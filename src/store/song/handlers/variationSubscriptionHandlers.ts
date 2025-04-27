// @breadcrumbs
// - src/store/song/handlers/variationSubscriptionHandlers.ts: Handlers for variation subscription events
// - Parent: src/store/song/subscriptions.ts
// - Related: src/store/song/types.ts (types)

import type { Song } from '../../../types';
import type { SongState, VariationPayload } from '../types';
import type { SupabaseClient } from '@supabase/supabase-js';
import { mapDatabaseVariationToVariation } from '../../../services/songService'; // Assuming this mapping function exists or create it

type SetState = (state: Partial<SongState> | ((state: SongState) => Partial<SongState>)) => void;
type GetState = () => SongState;

export async function handleVariationInsert(
  variationPayload: VariationPayload, // Rename for clarity
  set: SetState,
  get: GetState,
  _supabase: SupabaseClient // Mark supabase as unused for now
) {
  // 1. Map the incoming database payload to the frontend SongVariation type
  //    This handles potential snake_case to camelCase mapping if needed.
  //    Create mapDatabaseVariationToVariation if it doesn't exist.
  const newVariation = mapDatabaseVariationToVariation(variationPayload);

  if (!newVariation || !newVariation.songId) {
    console.error("Received invalid variation payload:", variationPayload);
    return;
  }

  // 2. Find the song in the current state and update its variations array
  set((state: SongState): Partial<SongState> => {
    const updatedSongs = state.songs.map(song => {
      if (song.id === newVariation.songId) {
        // Create a new variations array to ensure immutability
        const existingVariations = song.variations || [];
        
        // Avoid adding duplicates
        if (existingVariations.some(v => v.id === newVariation.id)) {
          return song; // Variation already exists, no change needed
        }
        
        // Add the new variation
        const updatedVariations = [...existingVariations, newVariation];
        
        // Return a new song object with the updated variations
        return {
          ...song,
          variations: updatedVariations,
        };
      }
      return song; // Return other songs unchanged
    });

    // Only return the changed part of the state
    return { songs: updatedSongs };
  });
} 