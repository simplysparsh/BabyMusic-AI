// @breadcrumbs
// - src/store/songStore.ts: Main song store with state management
// - Children:
//   - src/store/song/types.ts (types)
//   - src/store/song/actions.ts (actions)
//   - src/store/song/subscriptions.ts (subscriptions)
// - Related: src/store/authStore.ts (user state)

import { create } from 'zustand';
import type { SongState, BatchUpdate } from './song/types';
import { createSongActions } from './song/actions';
import { createSongSubscriptions } from './song/subscriptions';

// Define the return type of createSongSubscriptions explicitly if needed
// interface SongSubscriptionActions {
//   setupSubscription: (userId: string) => (() => void) | undefined;
// }

// Combine actions and subscriptions into a single type for the store state
// It's important that SongState in types.ts includes the setupSubscription signature correctly.
// Assuming SongState in types.ts looks like this:
/*
export interface SongState {
  // ... other state ...
  // Actions
  loadSongs: () => Promise<void>;
  // ... other actions ...
  // Subscriptions - Updated signature
  setupSubscription: (userId: string) => (() => void) | undefined; 
}
*/

// Ensure the create<SongState> uses the combined state including the updated setupSubscription signature
export const useSongStore = create<SongState>((set, get) => {
  const actions = createSongActions(set, get);
  const subscriptions = createSongSubscriptions(set, get);

  return {
    // Initial state
    songs: [],
    isLoading: false,
    retryingSongs: new Set<string>(),
    processingTaskIds: new Set<string>(),
    queuedTaskIds: new Set<string>(),
    isDeleting: false,
    error: null,
    isResetting: false,

    // State helpers
    setState: (updater) => set(updater),
    
    /**
     * Batch update function to handle multiple state changes atomically
     * This reduces the number of re-renders and prevents race conditions
     */
    batchUpdate: (updates: BatchUpdate) => {
      set(state => {
        // Start with current state
        let updatedSongs = [...state.songs];
        let updatedProcessing = new Set(state.processingTaskIds);
        let updatedRetrying = new Set(state.retryingSongs);
        let updatedError = state.error;
        
        // Apply song updates
        if (updates.songs) {
          updatedSongs = updates.songs;
        }
        
        // Update a specific song
        if (updates.updateSong) {
          updatedSongs = updatedSongs.map(song => 
            song.id === updates.updateSong!.id ? updates.updateSong!.updatedSong : song
          );
        }
        
        // Add a new song
        if (updates.addSong) {
          if (!updatedSongs.some(s => s.id === updates.addSong!.id)) {
            updatedSongs = [...updatedSongs, updates.addSong];
          }
        }
        
        // Remove a song
        if (updates.removeSongId) {
          updatedSongs = updatedSongs.filter(song => song.id !== updates.removeSongId);
          updatedRetrying.delete(updates.removeSongId);
        }
        
        // Update processing task IDs
        if (updates.taskIdsToAddToProcessing) {
          updates.taskIdsToAddToProcessing.forEach(id => updatedProcessing.add(id));
        }
        
        if (updates.taskIdsToRemoveFromProcessing) {
          updates.taskIdsToRemoveFromProcessing.forEach(id => updatedProcessing.delete(id));
        }
        
        // Update retrying state
        if (updates.songIdsToAddToRetrying) {
          updates.songIdsToAddToRetrying.forEach(id => updatedRetrying.add(id));
        }
        
        if (updates.songIdsToRemoveFromRetrying) {
          updates.songIdsToRemoveFromRetrying.forEach(id => updatedRetrying.delete(id));
        }
        
        // Update error if provided
        if (updates.error !== undefined) {
          updatedError = updates.error;
        }
        
        // Return all updated state in a single atomic update
        return {
          songs: updatedSongs,
          processingTaskIds: updatedProcessing,
          retryingSongs: updatedRetrying,
          error: updatedError
        };
      });
    },

    setRetrying: (songId: string, isRetrying: boolean) => {
      set(state => {
        const newRetrying = new Set(state.retryingSongs);
        if (isRetrying) {
          newRetrying.add(songId);
        } else {
          newRetrying.delete(songId);
        }
        return { retryingSongs: newRetrying };
      });
    },

    // Actions
    ...actions,

    // Subscriptions
    // The type checker should ensure this matches the signature in SongState
    setupSubscription: subscriptions.setupSubscription,
    
    /**
     * Reset all song store state to initial values
     * This should be called during sign-out to prevent stale data issues
     */
    resetStore: () => {
      console.log('[SONG STORE] Resetting store to initial state');
      set({
        songs: [],
        isLoading: false,
        retryingSongs: new Set<string>(),
        processingTaskIds: new Set<string>(),
        queuedTaskIds: new Set<string>(),
        isDeleting: false,
        error: null,
        isResetting: true,
      });
      
      // Clear the resetting flag after a brief delay to allow subscriptions to see it
      setTimeout(() => {
        set({ isResetting: false });
      }, 100);
    },

    /**
     * Handles UI state during preset song regeneration.
     * 
     * APPROACH EXPLANATION:
     * When baby name changes, we need to regenerate all preset songs. This function
     * immediately removes all preset songs from the store, causing the UI to show
     * an empty state briefly before new songs appear.
     * 
     * WHY THIS WORKS:
     * 1. Removing songs creates a clean slate - prevents UI showing old songs in a 
     *    transitional state
     * 2. When new songs arrive via Supabase subscriptions, they'll create fresh 
     *    cards in "Generating" state
     * 3. This approach ensures visual consistency across all preset song cards
     *    (rather than some showing error states and others showing generating)
     * 
     * CAUTION FOR FUTURE DEVELOPERS:
     * This approach depends on the following sequence of events:
     * a) Remove preset songs from store (this function)
     * b) Backend regeneratePresetSongs deletes songs from database
     * c) Backend creates new preset songs with task_ids
     * d) Supabase real-time subscriptions pick up the new songs
     * e) New songs appear in UI with "Generating" state
     */
    notifyPresetSongsRegenerating: () => {
      const allSongs = get().songs;
      // Find all preset songs
      const presetSongs = allSongs.filter(s => s.song_type === 'preset' && s.preset_type);
      
      if (presetSongs.length > 0) {
        console.log(`[PRESET REGENERATION] Preparing UI for regeneration of ${presetSongs.length} preset songs`);
        
        // Create a new songs array without the preset songs
        // This makes all cards behave consistently - like they never existed
        set({
          songs: allSongs.filter(s => !(s.song_type === 'preset' && s.preset_type))
        });
        
        // Log the deleted preset song IDs for debugging
        console.log(`[PRESET REGENERATION] Removed preset songs from store:`, 
          presetSongs.map(s => ({ id: s.id, type: s.preset_type }))
        );
      }
    },
  };
});