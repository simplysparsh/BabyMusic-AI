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
  song_type: string;
  error?: string | null;
  audio_url?: string | null;
  task_id?: string;
  status?: string;
  user_id: string;
}

interface VariationPayload {
  song_id: string;
}

// Update the type with the correct constraint
type RealtimePayload<T extends object> = RealtimePostgresChangesPayload<T>;

export const createSongSubscriptions = (set: SetState, get: GetState) => {
  const setupSubscription = () => {
    const user = useAuthStore.getState().user;
    if (!user) return;
    supabase.getChannels().forEach(channel => channel.unsubscribe());
    
    // Subscribe to both songs and variations changes
    const songsSubscription = supabase
      .channel('songs-channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'songs',
          filter: `user_id=eq.${user.id}`,
        },
        async (payload) => {
          // Use type assertion to ensure TypeScript knows the structure
          const typedPayload = payload as RealtimePayload<SongPayload>;
          const { new: newSong, old: oldSong } = typedPayload;
          
          // Add null checks and type assertions
          if (!oldSong || !newSong || !('id' in oldSong) || !('id' in newSong)) {
            return;
          }
          
          // Remove the presetSongsProcessing parameter or update the handler function
          await handleSongUpdate(
            newSong as SongPayload,
            oldSong as SongPayload,
            set,
            get,
            supabase
          );
        }
      )
      .subscribe();
      
    const variationsSubscription = supabase
      .channel('variations-channel')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public', 
          table: 'song_variations'
        },
        async (payload) => {
          // Use type assertion to ensure TypeScript knows the structure
          const typedPayload = payload as RealtimePayload<VariationPayload>;
          const { new: variation } = typedPayload;
          
          // Add null check and type assertion
          if (!variation || !('song_id' in variation)) {
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