// @breadcrumbs
// - src/store/song/handlers/variationSubscriptionHandlers.ts: Handlers for variation subscription events
// - Parent: src/store/song/subscriptions.ts
// - Related: src/store/song/types.ts (types)

import type { Song } from '../../../types';
import type { SongState } from '../types';
import type { SupabaseClient } from '@supabase/supabase-js';

interface VariationPayload {
  song_id: string;
}

type SetState = (state: Partial<SongState>) => void;
type GetState = () => SongState;

export async function handleVariationInsert(
  variation: VariationPayload,
  set: SetState,
  get: GetState,
  supabase: SupabaseClient
) {
  // Reload the entire song to get updated variations
  const { data: updatedSong } = await supabase
    .from('songs')
    .select('*, variations:song_variations(*)')
    .eq('id', variation.song_id)
    .single();
    
  if (!updatedSong) {
    return;
  }

  set({
    songs: get().songs.map((song) => {
      if (song.id === variation.song_id) {
        return updatedSong as Song;
      }
      return song;
    }),
  });
} 