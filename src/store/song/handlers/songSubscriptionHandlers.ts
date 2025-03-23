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
  
  // IMPORTANT: When a field is set to NULL in the database, Supabase might either:
  // 1. Include the field explicitly as NULL in the payload, or
  // 2. Omit the field entirely from the payload (so it's undefined)
  // We need to handle both cases to ensure consistent state transitions
  
  // Log when task_id is undefined in the payload
  if (newSong.task_id === undefined) {
    console.log(`IMPORTANT: Supabase sent update for song ${newSong.id} with task_id UNDEFINED (not included in payload)`);
  }

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
    state: isTaskIdNull ? 'READY' : hasTaskId ? 'GENERATING' : 'NO_TASK',
  });
  
  // Update this section to trace song transitions into PARTIALLY_READY state
  if (songHasAudio) {
    // Determine the exact state transition
    const previousState = get().songs.find(s => s.id === newSong.id);
    const previousStateEnum = previousState ? SongStateService.getSongState(previousState) : 'unknown';
    const currentStateEnum = SongStateService.getSongState(newSong as unknown as Song);

    console.log(`[STATE TRANSITION] Song ${newSong.id}:`, {
      previousState: previousStateEnum,
      currentState: currentStateEnum,
      hasAudio: songHasAudio,
      hasTaskId: hasTaskId,
      taskId: newSong.task_id || 'none',
      timestamp: new Date().toISOString(),
      sequence: Math.random().toString(36).substring(2, 8) // Add a sequence ID to track the update order
    });

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
        updateSongProcessingState(updatedSong.task_id, false, get);
        return;
      }
      
      // Clear all processing states
      updateSongProcessingState(updatedSong.task_id, false, get);
      break;
      
    case SongStateEnum.PARTIALLY_READY:
      // Song has audio but is still generating
      if (songHasAudio || isTaskIdNull) {
        // If task_id is cleared, the song is now fully ready
        if (isTaskIdNull) {
          console.log(`[TRANSITION FROM PARTIALLY_READY TO READY] Song ${updatedSong.id} transitioning to READY: task_id cleared`, {
            before: {
              state: SongStateEnum.PARTIALLY_READY,
              hasTaskId: true,
              hasAudio: songHasAudio
            },
            after: {
              state: SongStateEnum.READY,
              hasTaskId: false,
              hasAudio: songHasAudio
            },
            song: updatedSong
          });
          
          // CRITICAL FIX: Force a more aggressive UI update by removing the song and re-adding it
          const readySongs = [...get().songs];
          const readySongIndex = readySongs.findIndex(s => s.id === updatedSong.id);
          
          if (readySongIndex !== -1) {
            // Create a new song object to ensure React detects the change
            const updatedSongWithNewRef = {
              ...updatedSong as Song,
              // Add a dummy property to force React to see this as a new object
              _lastUpdated: Date.now()
            };
            
            // Replace the song in the array
            readySongs[readySongIndex] = updatedSongWithNewRef;
            
            // Log before setting state
            console.log(`[CRITICAL FIX - PARTIALLY_READY→READY] Forcing UI update for song ${updatedSong.id}`);
            
            // Set the state and trigger UI updates - This is the critical part
            set({ songs: readySongs });
            
            // Verify the update was applied
            setTimeout(() => {
              const songInStore = get().songs.find(s => s.id === updatedSong.id);
              console.log(`[VERIFICATION - PARTIALLY_READY→READY] Song ${updatedSong.id} state after update:`, {
                state: songInStore ? SongStateService.getSongState(songInStore) : 'not found',
                hasTaskId: songInStore?.task_id ? true : false, 
                isTaskIdNull: songInStore?.task_id === null,
                hasAudio: songInStore?.audio_url ? true : false,
                audioUrl: songInStore?.audio_url?.substring(0, 30) + '...' || 'none'
              });
            }, 10);
          }
          
          // Use batch update for other state changes
          get().batchUpdate({
            taskIdsToRemoveFromProcessing: updatedSong.task_id ? [updatedSong.task_id] : undefined,
            songIdsToRemoveFromRetrying: [updatedSong.id]
          });
          
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
      // Update song to reflect it's now in a failed state
      get().batchUpdate({
        updateSong: {
          id: updatedSong.id,
          updatedSong: updatedSong as Song
        },
        songIdsToAddToRetrying: updatedSong.retryable ? [updatedSong.id] : undefined
      });
      
      // Force refresh the songs array to trigger UI updates
      const failedSongs = [...get().songs];
      const failedSongIndex = failedSongs.findIndex(s => s.id === updatedSong.id);
      
      if (failedSongIndex !== -1) {
        failedSongs[failedSongIndex] = updatedSong as Song;
        set({ songs: failedSongs });
      }
      
      console.log(`Updated song state to FAILED:`, {
        id: updatedSong.id,
        hasAudioUrl: !!updatedSong.audio_url,
        hasTaskId: !!updatedSong.task_id,
        hasError: !!updatedSong.error,
        isRetryable: !!updatedSong.retryable,
        state: 'FAILED'
      });
      
      // Clear processing state
      updateSongProcessingState(updatedSong.task_id, false, get);
      return;
      
    case SongStateEnum.GENERATING:
      // Song is generating (has task_id, no audio_url, no error)
      
      // Check if this update is changing the song to PARTIALLY_READY
      if (songHasAudio && hasTaskId) {
        console.log(`[TRANSITION TO PARTIALLY_READY] Song ${updatedSong.id} is now partially ready with audio_url: ${updatedSong.audio_url}`);
        
        // CRITICAL FIX: Force React to detect the change by creating a new object
        const songsArray = [...get().songs];
        const songIndex = songsArray.findIndex(s => s.id === updatedSong.id);
        
        if (songIndex !== -1) {
          // Create a completely new object reference to ensure React detects the change
          const updatedSongWithNewRef = {
            ...updatedSong as Song
          };
          
          // Replace the song in the array with the new reference
          songsArray[songIndex] = updatedSongWithNewRef;
          
          // Log before setting state
          console.log(`[CRITICAL FIX - GENERATING→PARTIALLY_READY] About to update song ${updatedSong.id} in store`);
          
          // Force a state update that React will detect
          set({ songs: songsArray });
          
          // Verify the update was applied
          setTimeout(() => {
            const updatedSongInStore = get().songs.find(s => s.id === updatedSong.id);
            console.log(`[VERIFICATION - GENERATING→PARTIALLY_READY] Song ${updatedSong.id} in store after update:`, {
              songState: updatedSongInStore ? SongStateService.getSongState(updatedSongInStore) : 'not found',
              hasTaskId: updatedSongInStore?.task_id ? true : false,
              hasAudio: updatedSongInStore?.audio_url ? true : false
            });
          }, 10);
        }
        
        // Update processing state - if song is generating, add it to processing
        updateSongProcessingState(updatedSong.task_id, true, get);
        
        // Update metadata via batch update to ensure all state changes are applied
        get().batchUpdate({
          updateSong: {
            id: updatedSong.id,
            updatedSong: updatedSong as Song
          }
        });
        
        return;
      }
      
      // Regular update for a generating song (no transition)
      get().batchUpdate({
        updateSong: {
          id: updatedSong.id,
          updatedSong: updatedSong as Song
        }
      });
      
      // Force refresh the songs array to trigger UI updates
      const songsArray = [...get().songs];
      const songIndex = songsArray.findIndex(s => s.id === updatedSong.id);
      
      if (songIndex !== -1) {
        songsArray[songIndex] = updatedSong as Song;
        set({ songs: songsArray });
      }
      
      // Update processing state - if song is generating, add it to processing
      updateSongProcessingState(updatedSong.task_id, true, get);
      
      console.log(`Updated song state to GENERATING:`, {
        id: updatedSong.id,
        hasAudioUrl: !!updatedSong.audio_url,
        hasTaskId: !!updatedSong.task_id,
        state: 'GENERATING'
      });
      return;
      
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
 * Helper function to update song processing state
 */
function updateSongProcessingState(
  taskId: string | null,
  isProcessing: boolean,
  get: GetState
) {
  // Update only the processing taskIds
  if (taskId) {
    get().batchUpdate({
      taskIdsToAddToProcessing: isProcessing ? [taskId] : undefined,
      taskIdsToRemoveFromProcessing: !isProcessing ? [taskId] : undefined,
    });
  }
}