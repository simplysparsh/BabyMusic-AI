// @breadcrumbs
// - src/store/songStore.ts: Main song store with state management
// - Children:
//   - src/store/song/types.ts (types)
//   - src/store/song/actions.ts (actions)
//   - src/store/song/subscriptions.ts (subscriptions)
// - Related: src/store/authStore.ts (user state)

import { create } from 'zustand';
import type { SongState } from './song/types';
import { createSongActions } from './song/actions';
import { createSongSubscriptions } from './song/subscriptions';

export const useSongStore = create<SongState>((set, get) => {
  const actions = createSongActions(set, get);
  const subscriptions = createSongSubscriptions(set, get);

  return {
    // Initial state
    songs: [],
    isLoading: false,
    generatingSongs: new Set<string>(),
    retryingSongs: new Set<string>(),
    processingTaskIds: new Set<string>(),
    stagedTaskIds: new Set<string>(),
    isDeleting: false,
    error: null,

    // State helpers
    setState: (updater) => set(updater),
    clearGeneratingState: (songId: string) => {
      set(state => {
        const newGenerating = new Set(state.generatingSongs);
        newGenerating.delete(songId);
        return { generatingSongs: newGenerating };
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
    setupSubscription: subscriptions.setupSubscription
  };
});