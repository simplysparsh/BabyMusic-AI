// @breadcrumbs
// - src/store/song/handlers/songSubscriptionHandlers.ts: Handlers for song subscription events
// - Parent: src/store/song/subscriptions.ts
// - Related: src/store/song/types.ts (types)

import type { Song } from '../../../types';
import type { SongState, SongPayload } from '../types';
import type { SupabaseClient } from '@supabase/supabase-js';
import { SongStateService, SongState as SongStateEnum } from '../../../services/songStateService';

type SetState = (state: Partial<SongState> | ((prevState: SongState) => Partial<SongState>)) => void;
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
  const needsCompleteData = songHasError || // Fetch on error to get full error details
                           get().songs.findIndex(s => s.id === newSong.id) === -1; // Fetch if song is not in store yet
  
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
      // Song is ready to play (has audio_url and no task_id)
      console.log(`Song ${updatedSong.id} is now READY to play with audio_url: ${updatedSong.audio_url}`);
        
      // Use batch update to clear processing/retrying states
      get().batchUpdate({
        taskIdsToRemoveFromProcessing: updatedSong.task_id ? [updatedSong.task_id] : undefined, // Clear task ID if it was present
        songIdsToRemoveFromRetrying: [updatedSong.id]
      });
      
      // IMMUTABLE UPDATE: Update or add song in the store
      set((state: SongState) => {
        const songIndex = state.songs.findIndex(s => s.id === updatedSong.id);
        let newSongsArray;
        if (songIndex !== -1) {
          // Update existing song
          newSongsArray = [
            ...state.songs.slice(0, songIndex),
            { ...(updatedSong as Song), _lastUpdated: Date.now() }, // Create new object
            ...state.songs.slice(songIndex + 1)
          ];
        } else {
          // Add new song if it wasn't found
          newSongsArray = [
            ...state.songs, 
            { ...(updatedSong as Song), _lastUpdated: Date.now() } // Create new object
          ];
        }
        return { songs: newSongsArray };
      });
      
      // Log the complete updated song state for debugging
      console.log(`Updated song state in store to READY:`, {
        id: updatedSong.id,
        hasAudioUrl: !!updatedSong.audio_url,
        hasTaskId: !!updatedSong.task_id, // Should be false or null now
        hasError: !!updatedSong.error,
        state: 'READY'
      });
      
      // Clear all processing states (redundant with batch update but safe)
      updateSongProcessingState(updatedSong.task_id, false, get);
      return; // Exit after handling READY state

    case SongStateEnum.FAILED:
      // Song generation failed (has error or retryable flag)
      console.log(`Song ${updatedSong.id} state is FAILED. Error: ${updatedSong.error}`);
      
      // Use batch update to update song and mark for retry if applicable
      get().batchUpdate({
        updateSong: { // Still useful to update error/retryable flags via batch
          id: updatedSong.id,
          updatedSong: updatedSong as Song 
        },
        songIdsToRemoveFromRetrying: [updatedSong.id], // Clear previous retrying state first
        songIdsToAddToRetrying: updatedSong.retryable ? [updatedSong.id] : undefined,
        taskIdsToRemoveFromProcessing: updatedSong.task_id ? [updatedSong.task_id] : undefined // Clear processing
      });
      
      // IMMUTABLE UPDATE: Update or add song in the store
      set((state: SongState) => {
        const songIndex = state.songs.findIndex(s => s.id === updatedSong.id);
        let newSongsArray;
        if (songIndex !== -1) {
          // Update existing song
          newSongsArray = [
            ...state.songs.slice(0, songIndex),
            { ...(updatedSong as Song), _lastUpdated: Date.now() }, // Create new object
            ...state.songs.slice(songIndex + 1)
          ];
        } else {
          // Add new song if it wasn't found
          newSongsArray = [
            ...state.songs, 
            { ...(updatedSong as Song), _lastUpdated: Date.now() } // Create new object
          ];
        }
        return { songs: newSongsArray };
      });
      
      console.log(`Updated song state in store to FAILED:`, {
        id: updatedSong.id,
        hasAudioUrl: !!updatedSong.audio_url,
        hasTaskId: !!updatedSong.task_id,
        hasError: !!updatedSong.error,
        isRetryable: !!updatedSong.retryable,
        state: 'FAILED'
      });
      
      // Clear processing state (redundant with batch update but safe)
      updateSongProcessingState(updatedSong.task_id, false, get);
      return; // Exit after handling FAILED state
      
    case SongStateEnum.GENERATING:
      // Song is generating (has task_id, no audio_url, no error)
      // OR potentially has audio_url but still has task_id (implicitly "partially ready")
      
      if (songHasAudio && hasTaskId) {
        // This is the "partially ready" scenario: has audio but still processing
        console.log(`[TRANSITION DETECTED] Song ${updatedSong.id} has audio but still has task_id (partially ready): ${updatedSong.audio_url}`);
        
        // IMMUTABLE UPDATE: Update or add song in the store
        set((state: SongState) => {
          const songIndex = state.songs.findIndex(s => s.id === updatedSong.id);
          let newSongsArray;
          if (songIndex !== -1) {
            // Update existing song
            newSongsArray = [
              ...state.songs.slice(0, songIndex),
              { ...(updatedSong as Song), _lastUpdated: Date.now() }, // Create new object
              ...state.songs.slice(songIndex + 1)
            ];
          } else {
            // Add new song if it wasn't found
            newSongsArray = [
              ...state.songs, 
              { ...(updatedSong as Song), _lastUpdated: Date.now() } // Create new object
            ];
          }
          return { songs: newSongsArray };
        });

        // Verify the update was applied
        setTimeout(() => {
          const updatedSongInStore = get().songs.find(s => s.id === updatedSong.id);
          console.log(`[VERIFICATION - PARTIALLY READY SCENARIO] Song ${updatedSong.id} in store after update:`, {
            songState: updatedSongInStore ? SongStateService.getSongState(updatedSongInStore) : 'not found',
            hasTaskId: updatedSongInStore?.task_id ? true : false,
            hasAudio: updatedSongInStore?.audio_url ? true : false
          });
        }, 10);

        // Update processing state - ensure it's marked as processing
        updateSongProcessingState(updatedSong.task_id, true, get);
        
        // Update metadata via batch update if needed (might be redundant if set handles it)
        // get().batchUpdate({
        //   updateSong: { id: updatedSong.id, updatedSong: updatedSong as Song }
        // });
        
        return; // Exit after handling this specific generating sub-state
      }
      
      // Regular update for a generating song (no audio yet)
      console.log(`Song ${updatedSong.id} state is GENERATING (no audio yet).`);

      // Use batch update primarily for processing state
      get().batchUpdate({
         taskIdsToAddToProcessing: updatedSong.task_id ? [updatedSong.task_id] : undefined
      });

      // IMMUTABLE UPDATE: Update or add song in the store
      set((state: SongState) => {
        const songIndex = state.songs.findIndex(s => s.id === updatedSong.id);
        let newSongsArray;
        if (songIndex !== -1) {
          // Update existing song
          newSongsArray = [
            ...state.songs.slice(0, songIndex),
            { ...(updatedSong as Song), _lastUpdated: Date.now() }, // Create new object
            ...state.songs.slice(songIndex + 1)
          ];
        } else {
          // Add new song if it wasn't found
          newSongsArray = [
            ...state.songs, 
            { ...(updatedSong as Song), _lastUpdated: Date.now() } // Create new object
          ];
        }
        return { songs: newSongsArray };
      });
      
      // Update processing state (redundant with batch update but safe)
      updateSongProcessingState(updatedSong.task_id, true, get);
      
      console.log(`Updated song state in store to GENERATING:`, {
        id: updatedSong.id,
        hasAudioUrl: !!updatedSong.audio_url, // Should be false here
        hasTaskId: !!updatedSong.task_id, // Should be true here
        state: 'GENERATING'
      });
      return; // Exit after handling GENERATING state
      
    default: // Handles INITIAL or any unexpected state
      console.log(`Song ${updatedSong.id} is in unhandled state '${songState}' or INITIAL. Updating store.`);
      
      // Check if it implicitly became READY (e.g., initial load with audio and no task_id)
      if (SongStateService.isComplete(updatedSong as Song)) {
         console.log(`--> Song ${updatedSong.id} determined to be COMPLETE in default handler. Treating as READY.`);
         // Use batch update to clear states
         get().batchUpdate({
           taskIdsToRemoveFromProcessing: updatedSong.task_id ? [updatedSong.task_id] : undefined,
           songIdsToRemoveFromRetrying: [updatedSong.id]
         });
         // IMMUTABLE UPDATE
         set((state: SongState) => {
           const songIndex = state.songs.findIndex(s => s.id === updatedSong.id);
           let newSongsArray;
           if (songIndex !== -1) {
             newSongsArray = [
               ...state.songs.slice(0, songIndex),
               { ...(updatedSong as Song), _lastUpdated: Date.now() }, 
               ...state.songs.slice(songIndex + 1)
             ];
           } else {
             newSongsArray = [
               ...state.songs, 
               { ...(updatedSong as Song), _lastUpdated: Date.now() }
             ];
           }
           return { songs: newSongsArray };
         });
         return;
      }

      // Default update: ensure song is in the store, clear processing states just in case
      get().batchUpdate({
        songIdsToRemoveFromRetrying: [updatedSong.id],
        taskIdsToRemoveFromProcessing: updatedSong.task_id ? [updatedSong.task_id] : undefined
      });

      // IMMUTABLE UPDATE
      set((state: SongState) => {
        const songIndex = state.songs.findIndex(s => s.id === updatedSong.id);
        let newSongsArray;
        if (songIndex !== -1) {
          newSongsArray = [
            ...state.songs.slice(0, songIndex),
            { ...(updatedSong as Song), _lastUpdated: Date.now() }, 
            ...state.songs.slice(songIndex + 1)
          ];
        } else {
          newSongsArray = [
            ...state.songs, 
            { ...(updatedSong as Song), _lastUpdated: Date.now() }
          ];
        }
        return { songs: newSongsArray };
      });
      return;
  }

  // This final block should ideally not be reached if all cases return
  // Kept for safety, but should also handle insert/update correctly
  console.warn(`Song ${updatedSong.id} update fell through the switch statement. State: ${songState}. Performing final update/insert.`);
  set((state: SongState) => {
    const songIndex = state.songs.findIndex(s => s.id === updatedSong.id);
    let newSongsArray;
    if (songIndex !== -1) {
      newSongsArray = [
        ...state.songs.slice(0, songIndex),
        { ...(updatedSong as Song), _lastUpdated: Date.now() }, // Create new object
        ...state.songs.slice(songIndex + 1)
      ];
    } else {
      newSongsArray = [
        ...state.songs, 
        { ...(updatedSong as Song), _lastUpdated: Date.now() } // Create new object
      ];
    }
    return { songs: newSongsArray };
  });
}

/**
 * Helper function to update song processing state
 */
function updateSongProcessingState(
  taskId: string | null | undefined, // Allow undefined
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