// @breadcrumbs
// - src/store/song/subscriptions.ts: Real-time subscriptions for song updates
// - Parent: src/store/songStore.ts
// - Related: src/store/song/types.ts (types)
// - Related: src/lib/supabase.ts (database)
// - Children:
//   - src/store/song/handlers/songSubscriptionHandlers.ts (song handlers)
//   - src/store/song/handlers/variationSubscriptionHandlers.ts (variation handlers)

import { supabase } from '../../lib/supabase';
import type { SongState, SongPayload, VariationPayload } from './types';
import { handleSongUpdate } from './handlers/songSubscriptionHandlers';
import { handleVariationInsert } from './handlers/variationSubscriptionHandlers';
import type { RealtimePostgresChangesPayload } from '@supabase/supabase-js';

type SetState = (state: Partial<SongState>) => void;
type GetState = () => SongState;

// Update the type with the correct constraint
type RealtimePayload<T extends object> = RealtimePostgresChangesPayload<T>;

export const createSongSubscriptions = (set: SetState, get: GetState) => {
  const setupSubscription = (userId: string) => {
    if (!userId) {
      console.error('setupSubscription called without userId');
      return;
    }
    
    console.log(`Setting up subscriptions for user: ${userId}`);
    supabase.getChannels().forEach(channel => {
      console.log(`Unsubscribing from existing channel: ${channel.topic}`);
      channel.unsubscribe();
    });
    
    // Subscribe to both songs and variations changes
    const songsSubscription = supabase
      .channel('songs-channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'songs',
          filter: `user_id=eq.${userId}`,
        },
        async (payload) => {
          // Use type assertion to ensure TypeScript knows the structure
          const typedPayload = payload as RealtimePayload<SongPayload>;
          const { new: newSong, old: oldSong } = typedPayload;
          
          // IMPORTANT: By default, Supabase only includes primary keys in oldSong, not complete data
          // The handler function should avoid comparing oldSong to newSong for non-primary-key fields
          
          // Add null checks and type assertions
          if (!oldSong || !newSong || !('id' in oldSong) || !('id' in newSong)) {
            return;
          }
          
          // Remove the presetSongsProcessing parameter or update the handler function
          await handleSongUpdate(
            newSong as SongPayload,
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
      console.log(`Cleaning up subscriptions for user: ${userId}`);
      songsSubscription.unsubscribe();
      variationsSubscription.unsubscribe();
    };
  };

  return { setupSubscription };
}; 