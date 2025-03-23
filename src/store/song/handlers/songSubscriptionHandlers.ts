// @breadcrumbs
// - src/store/song/handlers/songSubscriptionHandlers.ts: Handlers for song subscription events
// - Parent: src/store/song/subscriptions.ts
// - Related: src/store/song/types.ts (types)

import type { Song } from '../../../types';
import type { SongState, SongPayload } from '../types';
import type { SupabaseClient } from '@supabase/supabase-js';
import { SongStateService, SongState as SongStateEnum } from '../../../services/songStateService';

type SetState = (state: Partial<SongState>) => void;
type GetState = () => SongState;

/**
 * Handles song updates from the Supabase realtime subscription
 * This is the central handler for all song state changes
 */
export async function handleSongUpdate(
  newSong: SongPayload,
  set: SetState,
  get: GetState,
  supabase: SupabaseClient
) {
  // IMPORTANT: By default, Supabase only includes primary keys in oldSong, not complete data
  // Therefore, we should avoid comparisons that rely on oldSong having complete data
  
  // Direct state checks on newSong (reliable)
  const hasTaskId = !!newSong.task_id;
  const isTaskIdNull = newSong.task_id === null;
  const songHasAudio = !!newSong.audio_url;
  const songHasError = !!newSong.error;
  
  // Log task_id state specifically
  console.log(`Song ${newSong.id} task_id state:`, {
    taskId: newSong.task_id || 'none',
    isExplicitlyNull: isTaskIdNull,
    hasAudio: songHasAudio,
    hasError: songHasError,
    state: isTaskIdNull ? 'COMPLETED' : hasTaskId ? 'GENERATING' : 'NO_TASK',
  });
  
  // Log audio_url if present
  if (songHasAudio) {
    console.log('SONG HAS AUDIO:', {
      songId: newSong.id,
      songName: newSong.name,
      audioUrl: newSong.audio_url,
      taskId: newSong.task_id || 'none',
      isTaskIdNull: isTaskIdNull,
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
  const needsCompleteData = songHasAudio || // We need variations for newly ready songs
                           songHasError || // We need error details
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
  if (songHasAudio || songHasError) {
    get().batchUpdate({
      songIdsToRemoveFromRetrying: [updatedSong.id]
    });
  }
  
  // Handle state-specific updates
  switch (songState) {
    case SongStateEnum.READY:
      // Song is ready to play (has audio_url)
      if (songHasAudio || isTaskIdNull) {
        console.log(`Song ${updatedSong.id} is now ready to play with audio_url: ${updatedSong.audio_url}`);
        
        // Add log when a song transitions to READY due to task_id being cleared
        if (isTaskIdNull) {
          console.log(`Log from SongStateEnum.READY: Song ${updatedSong.id} transitioned to READY state because task_id was cleared`);
        }
        
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
        
        // Force refresh the songs array to trigger UI updates - same as PARTIALLY_READY
        const readySongs = [...get().songs];
        const readySongIndex = readySongs.findIndex(s => s.id === updatedSong.id);
        
        if (readySongIndex !== -1) {
          readySongs[readySongIndex] = updatedSong as Song;
          set({ songs: readySongs });
        }
        
        // Log the complete updated song state for debugging
        console.log(`Updated song state in store:`, {
          id: updatedSong.id,
          hasAudioUrl: !!updatedSong.audio_url,
          hasTaskId: !!updatedSong.task_id,
          hasError: !!updatedSong.error,
          state: 'READY'
        });
        
        // Clear all processing states
        updateSongProcessingState(updatedSong.id, updatedSong.task_id, false, false, get);
        return;
      }
      
      // Clear all processing states
      updateSongProcessingState(updatedSong.id, updatedSong.task_id, false, false, get);
      break;
      
    case SongStateEnum.PARTIALLY_READY:
      // Song has audio but is still generating
      if (songHasAudio || isTaskIdNull) {
        // If task_id is cleared, the song is now fully ready
        if (isTaskIdNull) {
          console.log(`Log from SongStateEnum.PARTIALLY_READY:Song ${updatedSong.id} transitioned from PARTIALLY_READY to READY: task_id cleared`);
          
          // Use the same logic as READY state
          get().batchUpdate({
            updateSong: {
              id: updatedSong.id,
              updatedSong: updatedSong as Song
            },
            songIdsToRemoveFromGenerating: [updatedSong.id],
            taskIdsToRemoveFromProcessing: undefined, // task_id is already null
            songIdsToRemoveFromRetrying: [updatedSong.id]
          });
          
          // Force refresh the songs array to trigger UI updates
          const readySongs = [...get().songs];
          const readySongIndex = readySongs.findIndex(s => s.id === updatedSong.id);
          
          if (readySongIndex !== -1) {
            readySongs[readySongIndex] = updatedSong as Song;
            set({ songs: readySongs });
          }
          
          return;
        }
        
        console.log(`Song ${updatedSong.id} is now partially ready with audio_url: ${updatedSong.audio_url}`);
        
        // Force update the UI immediately since we have audio
        get().batchUpdate({
          updateSong: {
            id: updatedSong.id,
            updatedSong: updatedSong as Song
          }
        });
        
        // Force refresh the songs array to trigger UI updates
        const currentSongs = [...get().songs];
        const songIndex = currentSongs.findIndex(s => s.id === updatedSong.id);
        
        if (songIndex !== -1) {
          currentSongs[songIndex] = updatedSong as Song;
          set({ songs: currentSongs });
        }
        
        console.log(`Updated partially ready song in store:`, {
          id: updatedSong.id,
          hasAudioUrl: !!updatedSong.audio_url,
          hasTaskId: !!updatedSong.task_id,
          state: 'PARTIALLY_READY'
        });
        
        return;
      }
      break;
      
    case SongStateEnum.FAILED:
      // Song has failed (has error)
      if (songHasError) {
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
      if (hasTaskId) {
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
      // If the song has audio_url and null task_id, treat as READY
      if (songHasAudio && isTaskIdNull) {
        console.log(`Song ${updatedSong.id} is in INITIAL state with audio_url and null task_id - treating as READY`);
        
        // Use the same logic as READY state
        get().batchUpdate({
          updateSong: {
            id: updatedSong.id,
            updatedSong: updatedSong as Song
          },
          songIdsToRemoveFromGenerating: [updatedSong.id],
          songIdsToRemoveFromRetrying: [updatedSong.id]
        });
        
        // Force refresh the songs array to trigger UI updates
        const readySongs = [...get().songs];
        const readySongIndex = readySongs.findIndex(s => s.id === updatedSong.id);
        
        if (readySongIndex !== -1) {
          readySongs[readySongIndex] = updatedSong as Song;
          set({ songs: readySongs });
        }
        
        return;
      }
      
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
  get: GetState
): void {
  // Check for explicit null (completed state)
  const isExplicitlyNull = taskId === null;
  
  // Use batch update to ensure atomic update of all related state
  get().batchUpdate({
    // Only add to generating if explicitly requested AND not null
    songIdsToAddToGenerating: (isGenerating && !isExplicitlyNull) ? [songId] : undefined,
    
    // Remove from generating if not generating OR explicit null
    songIdsToRemoveFromGenerating: (!isGenerating || isExplicitlyNull) ? [songId] : undefined,
    
    // Only add to retrying if explicitly requested AND not null
    songIdsToAddToRetrying: (isRetrying && !isExplicitlyNull) ? [songId] : undefined,
    
    // Remove from retrying if not retrying OR explicit null
    songIdsToRemoveFromRetrying: (!isRetrying || isExplicitlyNull) ? [songId] : undefined,
    
    // Only add task to processing if generating AND has a non-null task_id
    taskIdsToAddToProcessing: (isGenerating && taskId && !isExplicitlyNull) ? [taskId] : undefined,
    
    // Remove task from processing if not generating OR explicit null
    taskIdsToRemoveFromProcessing: (!isGenerating || isExplicitlyNull) ? 
      (taskId ? [taskId] : undefined) : undefined
  });
}