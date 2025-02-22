// @breadcrumbs
// - src/store/song/subscriptions.ts: Real-time subscriptions for song updates
// - Parent: src/store/songStore.ts
// - Related: src/store/song/types.ts (types)
// - Related: src/lib/supabase.ts (database)
// - Children:
//   - src/store/song/handlers/songSubscriptionHandlers.ts (song handlers)
//   - src/store/song/handlers/variationSubscriptionHandlers.ts (variation handlers)

import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../authStore';
import type { SongState } from './types';
import { handleSongUpdate } from './handlers/songSubscriptionHandlers';
import { handleVariationInsert } from './handlers/variationSubscriptionHandlers';
import type { RealtimePostgresChangesPayload } from '@supabase/supabase-js';

type SetState = (state: Partial<SongState>) => void;
type GetState = () => SongState;

interface SongPayload {
  id: string;
  name: string;
  error?: string | null;
  audioUrl?: string | null;
  task_id?: string;
  status?: string;
  user_id: string;
}

interface VariationPayload {
  song_id: string;
}

type RealtimePayload<T> = RealtimePostgresChangesPayload<T>;

export const createSongSubscriptions = (set: SetState, get: GetState) => {
  const setupSubscription = () => {
    const user = useAuthStore.getState().user;
    if (!user) return;
    let presetSongsProcessing = new Set<string>();

    supabase.getChannels().forEach(channel => channel.unsubscribe());
    
    // Subscribe to both songs and variations changes
    const songsSubscription = supabase
      .channel('songs-channel')
      .on<RealtimePayload<SongPayload>>(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'songs',
          filter: `user_id=eq.${user.id}`,
        },
        async (payload: RealtimePayload<SongPayload>) => {
          const { new: newSong, old: oldSong } = payload;          
          if (!oldSong?.id || !newSong?.id) {
            return;
          }
          
          await handleSongUpdate(
            newSong as SongPayload,
            oldSong as SongPayload,
            set,
            get,
            supabase,
            presetSongsProcessing
          );
        }
      )
      .subscribe();
      
    const variationsSubscription = supabase
      .channel('variations-channel')
      .on<RealtimePayload<VariationPayload>>(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public', 
          table: 'song_variations'
        },
        async (payload: RealtimePayload<VariationPayload>) => {
          const { new: variation } = payload;
          if (!variation?.song_id) {
            return;
          }
          
          await handleVariationInsert(
            variation as VariationPayload,
            set,
            get,
            supabase
          );
        }
      )
      .subscribe();

    // Clean up subscription when user changes
    return () => {
      songsSubscription.unsubscribe();
      variationsSubscription.unsubscribe();
    };
  };

  return { setupSubscription };
}; 