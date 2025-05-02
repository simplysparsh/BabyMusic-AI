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
      // Handle new song inserts
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'songs',
          filter: `user_id=eq.${userId}`,
        },
        async (payload) => {
          const typedPayload = payload as RealtimePayload<SongPayload>;
          const newSong = typedPayload.new;
          if (!newSong || !('id' in newSong)) return;
          await handleSongUpdate(newSong as SongPayload, set, get, supabase);
        }
      )
      // Handle song updates
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'songs',
          filter: `user_id=eq.${userId}`,
        },
        async (payload) => {
          const typedPayload = payload as RealtimePayload<SongPayload>;
          const newSong = typedPayload.new;
          if (!newSong || !('id' in newSong)) return;
          await handleSongUpdate(newSong as SongPayload, set, get, supabase);
        }
      )
      // Handle song deletions
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'songs',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          const typedPayload = payload as RealtimePayload<SongPayload>;
          const oldSong = typedPayload.old;
          if (!oldSong || !('id' in oldSong)) return;
          
          console.log(`DELETE event received for song ${oldSong.id}, preset_type: ${oldSong.preset_type || 'none'}`);
          
          /**
           * HANDLING SONG DELETIONS:
           * 
           * This handler is particularly important for the preset song regeneration flow:
           * 
           * 1. For preset songs (when preset_type exists):
           *    - We typically already removed these from the store via notifyPresetSongsRegenerating
           *    - This handler ensures any songs that weren't manually removed get cleaned up
           *    - It's a safety net for consistent store state during regeneration
           * 
           * 2. For regular song deletions:
           *    - We use the standard batchUpdate mechanism
           *    - This ensures task IDs are properly cleaned up from processing lists
           * 
           * This dual-approach ensures proper handling of both user-initiated deletions
           * and system-initiated regeneration deletions.
           */
          
          // Handle the deletion by updating the store
          if (oldSong.preset_type) {
            // This is a preset song being deleted - likely during regeneration
            // We need to remove it from the songs array
            set({
              songs: get().songs.filter(s => s.id !== oldSong.id)
            });
            console.log(`Removed deleted preset song ${oldSong.id} (${oldSong.preset_type}) from store.`);
          } else {
            // Standard deletion - use batch update
            get().batchUpdate({
              removeSongId: oldSong.id,
              taskIdsToRemoveFromProcessing: oldSong.task_id ? [oldSong.task_id] : undefined
            });
          }
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