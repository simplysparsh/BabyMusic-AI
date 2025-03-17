// @breadcrumbs
// - src/store/song/handlers/songSubscriptionHandlers.ts: Handlers for song subscription events
// - Parent: src/store/song/subscriptions.ts
// - Related: src/store/song/types.ts (types)

import type { Song } from '../../../types';
import type { SongState } from '../types';
import type { SupabaseClient } from '@supabase/supabase-js';
import { SongStateService, SongState as SongStateEnum } from '../../../services/songStateService';

interface SongPayload {
  id: string;
  name: string;
  song_type: string;
  error?: string | null;
  audio_url?: string | null;
  task_id?: string;
  user_id: string;
  preset_type?: string;
  retryable?: boolean;
}

type SetState = (state: Partial<SongState>) => void;
type GetState = () => SongState;

/**
 * Handles song updates from the Supabase realtime subscription
 * This is the central handler for all song state changes
 */
export async function handleSongUpdate(
  newSong: SongPayload,
  oldSong: SongPayload,
  set: SetState,
  get: GetState,
  supabase: SupabaseClient
) {
  // Detect significant state changes
  const hasNewError = !oldSong.error && newSong.error;
  const hasNewAudio = oldSong.audio_url !== newSong.audio_url && !!newSong.audio_url;
  const hasTaskIdChange = oldSong.task_id !== newSong.task_id;
  const hasTaskIdCleared = oldSong.task_id && !newSong.task_id;
  
  // Log task_id changes specifically
  if (hasTaskIdChange) {
    console.log(`Task ID change for song ${newSong.id}:`, {
      before: oldSong.task_id || 'none',
      after: newSong.task_id || 'none',
      cleared: hasTaskIdCleared,
      hasAudio: !!newSong.audio_url
    });
  }
  
  // More detailed debugging for audio_url changes
  if (hasNewAudio) {
    console.log('AUDIO URL CHANGE DETECTED:', {
      songId: newSong.id,
      songName: newSong.name,
      oldUrl: oldSong.audio_url || 'none',
      newUrl: newSong.audio_url,
      taskId: {
        before: oldSong.task_id || 'none',
        after: newSong.task_id || 'none',
        cleared: hasTaskIdCleared
      },
      preset_type: newSong.preset_type || 'n/a'
    });
  }

  // Track task IDs for processing state using batch update
  if (newSong.task_id && !get().processingTaskIds.has(newSong.task_id)) {
    get().batchUpdate({
      taskIdsToAddToProcessing: [newSong.task_id]
    });
  }

  // Handle songs in queue using batch update
  if (SongStateService.isInQueue(newSong as unknown as Song) && newSong.task_id && !get().queuedTaskIds.has(newSong.task_id)) {
    // We can't use batch update for queuedTaskIds yet as it's not part of the batch update interface
    set({
      queuedTaskIds: new Set([...get().queuedTaskIds, newSong.task_id])
    });
  }

  // Determine if we need to fetch variations
  // Only fetch the complete song if we actually need the variations
  // or if this is a critical state change that might have complex data
  const needsCompleteData = hasNewAudio || // We need variations for newly ready songs
                           hasNewError || // We need error details
                           get().songs.findIndex(s => s.id === newSong.id) === -1; // New song
  
  let updatedSong;
  
  if (needsCompleteData) {
    // Fetch the complete song with variations
    const { data: fetchedSong, error: fetchError } = await supabase
      .from('songs')
      .select('*, variations:song_variations(*)')
      .eq('id', newSong.id)
      .single();
    
    // Handle case where song might have been deleted
    if (fetchError || !fetchedSong) {
      console.log(`Song ${newSong.id} not found in database, cleaning up UI state`);
      
      // Use batch update to atomically remove the song and all related state
      get().batchUpdate({
        removeSongId: newSong.id,
        taskIdsToRemoveFromProcessing: newSong.task_id ? [newSong.task_id] : undefined
      });
      
      return;
    }
    
    updatedSong = fetchedSong;
  } else {
    // Use the existing song from state but update fields from the payload
    const existingSong = get().songs.find(s => s.id === newSong.id);
    
    if (existingSong) {
      // Create a merged song object that preserves existing state but updates changed fields
      updatedSong = {
        ...existingSong,
        // Update the fields that might have changed
        task_id: newSong.task_id,
        audio_url: newSong.audio_url,
        error: newSong.error,
        retryable: newSong.retryable
      };
    } else {
      // If we couldn't find the song, fetch it as a fallback
      console.log(`Song ${newSong.id} not found in state, fetching complete data`);
      const { data: fetchedSong, error: fetchError } = await supabase
        .from('songs')
        .select('*, variations:song_variations(*)')
        .eq('id', newSong.id)
        .single();
        
      if (fetchError || !fetchedSong) {
        console.log(`Song ${newSong.id} not found in database, skipping update`);
        return;
      }
      
      updatedSong = fetchedSong;
    }
  }

  // Get the song's current state using the enhanced SongStateService
  const songState = SongStateService.getSongState(updatedSong as Song);
  
  // Always clear retrying state if song has a new audio_url or error
  if (hasNewAudio || hasNewError) {
    get().batchUpdate({
      songIdsToRemoveFromRetrying: [updatedSong.id]
    });
  }
  
  // Handle state-specific updates
  switch (songState) {
    case SongStateEnum.READY:
      // Song is ready to play (has audio_url)
      if (hasNewAudio) {
        console.log(`Song ${updatedSong.id} is now ready to play with audio_url: ${updatedSong.audio_url}`);
        
        // Use batch update to update song and clear processing states in one operation
        get().batchUpdate({
          updateSong: {
            id: updatedSong.id,
            updatedSong: updatedSong as Song
          },
          songIdsToRemoveFromGenerating: [updatedSong.id],
          taskIdsToRemoveFromProcessing: updatedSong.task_id ? [updatedSong.task_id] : undefined,
          songIdsToRemoveFromRetrying: [updatedSong.id]
        });
        
        // Log the complete updated song state for debugging
        console.log(`Updated song state in store:`, {
          id: updatedSong.id,
          hasAudioUrl: !!updatedSong.audio_url,
          hasTaskId: !!updatedSong.task_id,
          hasError: !!updatedSong.error
        });
        
        // We don't need to call updateSongProcessingState here since we've already updated everything
        return;
      }
      
      // Clear all processing states
      updateSongProcessingState(updatedSong.id, updatedSong.task_id, false, false, set, get);
      break;
      
    case SongStateEnum.FAILED:
      // Song has failed (has error)
      if (hasNewError) {
        console.log(`Song ${updatedSong.id} has failed with error: ${updatedSong.error}`);
      }
      
      // Use batch update for failed state
      get().batchUpdate({
        updateSong: {
          id: updatedSong.id,
          updatedSong: updatedSong as Song
        },
        songIdsToRemoveFromGenerating: [updatedSong.id],
        songIdsToAddToRetrying: updatedSong.retryable ? [updatedSong.id] : undefined,
        taskIdsToRemoveFromProcessing: updatedSong.task_id ? [updatedSong.task_id] : undefined,
        error: updatedSong.error || null
      });
      
      // No need to call updateSongProcessingState here since we've handled it all
      return;
      
    case SongStateEnum.GENERATING:
      // Song is generating (has task_id)
      if (hasTaskIdChange && updatedSong.task_id) {
        console.log(`Song ${updatedSong.id} is now generating with task_id: ${updatedSong.task_id}`);
        
        // Update song and add to generating songs in one operation
        get().batchUpdate({
          updateSong: {
            id: updatedSong.id,
            updatedSong: updatedSong as Song
          },
          songIdsToAddToGenerating: [updatedSong.id],
          taskIdsToAddToProcessing: [updatedSong.task_id]
        });
        
        return;
      }
      break;
      
    default:
      // Initial or unknown state
      // Update the song but clear all processing states to be safe
      get().batchUpdate({
        updateSong: {
          id: updatedSong.id,
          updatedSong: updatedSong as Song
        },
        songIdsToRemoveFromGenerating: [updatedSong.id],
        songIdsToRemoveFromRetrying: [updatedSong.id],
        taskIdsToRemoveFromProcessing: updatedSong.task_id ? [updatedSong.task_id] : undefined
      });
      return;
  }

  // Update the song in the songs array using batch update
  get().batchUpdate({
    updateSong: {
      id: updatedSong.id,
      updatedSong: updatedSong as Song
    }
  });
}

/**
 * Helper function to update a song's processing state
 */
function updateSongProcessingState(
  songId: string,
  taskId: string | null | undefined,
  isGenerating: boolean,
  isRetrying: boolean,
  set: SetState,
  get: GetState
): void {
  // Use batch update to ensure atomic update of all related state
  get().batchUpdate({
    songIdsToAddToGenerating: isGenerating ? [songId] : undefined,
    songIdsToRemoveFromGenerating: !isGenerating ? [songId] : undefined,
    songIdsToAddToRetrying: isRetrying ? [songId] : undefined,
    songIdsToRemoveFromRetrying: !isRetrying ? [songId] : undefined,
    taskIdsToAddToProcessing: (isGenerating && taskId) ? [taskId] : undefined,
    taskIdsToRemoveFromProcessing: (!isGenerating && taskId) ? [taskId] : undefined
  });
}