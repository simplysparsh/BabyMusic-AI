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
  const hasSignificantChange = hasNewError || hasNewAudio || hasTaskIdChange;
  
  // Log significant state transitions
  if (hasSignificantChange) {
    console.log(`Song state change for ${newSong.name} (${newSong.id}):`, {
      song_type: newSong.song_type,
      preset_type: (newSong as SongPayload & { preset_type?: string }).preset_type,
      audio_url: {
        before: oldSong.audio_url ? 'present' : 'none',
        after: newSong.audio_url ? 'present' : 'none'
      },
      error: {
        before: oldSong.error,
        after: newSong.error
      },
      task_id: {
        before: oldSong.task_id,
        after: newSong.task_id
      },
      changes: {
        hasNewError,
        hasNewAudio,
        hasTaskIdChange
      }
    });
  }

  // Track task IDs for processing state
  if (newSong.task_id && !get().processingTaskIds.has(newSong.task_id)) {
    set({
      processingTaskIds: new Set([...get().processingTaskIds, newSong.task_id])
    });
  }

  // Handle songs in queue
  if (SongStateService.isInQueue(newSong as unknown as Song) && newSong.task_id && !get().queuedTaskIds.has(newSong.task_id)) {
    set({
      queuedTaskIds: new Set([...get().queuedTaskIds, newSong.task_id])
    });
  }

  // Fetch the complete song with variations
  const { data: updatedSong, error: fetchError } = await supabase
    .from('songs')
    .select('*, variations:song_variations(*)')
    .eq('id', oldSong.id)
    .single();
  
  // Handle case where song might have been deleted
  if (fetchError || !updatedSong) {
    console.log(`Song ${oldSong.id} not found in database, cleaning up UI state`);
    
    // Clean up UI state for this song
    const newGenerating = new Set(get().generatingSongs);
    newGenerating.delete(oldSong.id);
    
    // Clean up task IDs if applicable
    const newProcessingTaskIds = new Set(get().processingTaskIds);
    if (oldSong.task_id) {
      newProcessingTaskIds.delete(oldSong.task_id);
    }
    
    // Clean up retrying state if applicable
    const newRetrying = new Set(get().retryingSongs);
    newRetrying.delete(oldSong.id);
    
    // Remove song from songs array
    set({
      songs: get().songs.filter(song => song.id !== oldSong.id),
      generatingSongs: newGenerating,
      processingTaskIds: newProcessingTaskIds,
      retryingSongs: newRetrying
    });
    
    return;
  }

  // Get the song's current state using the enhanced SongStateService
  const songState = SongStateService.getSongState(updatedSong as Song);
  
  // Always clear retrying state if song has a new audio_url or error
  if (hasNewAudio || hasNewError) {
    const newRetrying = new Set(get().retryingSongs);
    newRetrying.delete(updatedSong.id);
    set({ retryingSongs: newRetrying });
  }
  
  // Handle state-specific updates
  switch (songState) {
    case SongStateEnum.READY:
      // Song is ready to play (has audio_url)
      if (hasNewAudio) {
        console.log(`Song ${updatedSong.id} is now ready to play with audio_url: ${updatedSong.audio_url}`);
        // Force immediate UI update for audio URL changes
        set({
          songs: get().songs.map((song) =>
            song.id === updatedSong.id ? {...song, audio_url: updatedSong.audio_url} : song
          )
        });
      }
      
      // Clear all processing states
      updateSongProcessingState(updatedSong.id, updatedSong.task_id, false, false, set, get);
      break;
      
    case SongStateEnum.FAILED:
      // Song has failed (has error)
      if (hasNewError) {
        console.log(`Song ${updatedSong.id} has failed with error: ${updatedSong.error}`);
      }
      
      // Clear generating state but keep retryable if applicable
      updateSongProcessingState(updatedSong.id, updatedSong.task_id, false, !!updatedSong.retryable, set, get);
      
      // Set error state
      set({ error: updatedSong.error || null });
      break;
      
    case SongStateEnum.GENERATING:
      // Song is generating (has task_id)
      if (hasTaskIdChange && updatedSong.task_id) {
        console.log(`Song ${updatedSong.id} is now generating with task_id: ${updatedSong.task_id}`);
        
        // Add to generating songs if not already there
        if (!get().generatingSongs.has(updatedSong.id)) {
          set({
            generatingSongs: new Set([...get().generatingSongs, updatedSong.id])
          });
        }
      }
      break;
      
    default:
      // Initial or unknown state
      // Clear generating state to be safe
      updateSongProcessingState(updatedSong.id, updatedSong.task_id, false, false, set, get);
      break;
  }

  // Update the song in the songs array
  set({
    songs: get().songs.map((song) =>
      song.id === oldSong.id ? updatedSong as Song : song
    )
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
  // Update generating state
  const newGenerating = new Set(get().generatingSongs);
  if (isGenerating) {
    newGenerating.add(songId);
  } else {
    newGenerating.delete(songId);
  }
  
  // Update retrying state
  const newRetrying = new Set(get().retryingSongs);
  if (isRetrying) {
    newRetrying.add(songId);
  } else {
    newRetrying.delete(songId);
  }
  
  // Update task processing state
  const newProcessingTaskIds = new Set(get().processingTaskIds);
  if (taskId) {
    if (isGenerating) {
      newProcessingTaskIds.add(taskId);
    } else {
      newProcessingTaskIds.delete(taskId);
    }
  }
  
  // Update all states at once
  set({
    generatingSongs: newGenerating,
    retryingSongs: newRetrying,
    processingTaskIds: newProcessingTaskIds
  });
}