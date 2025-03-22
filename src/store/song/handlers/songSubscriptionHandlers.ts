// @breadcrumbs
// - src/store/song/handlers/songSubscriptionHandlers.ts: Handlers for song subscription events
// - Parent: src/store/song/subscriptions.ts
// - Related: src/store/song/types.ts (types)

import type { Song } from '../../../types';
import type { SongState, SongPayload } from '../types';
import type { SupabaseClient } from '@supabase/supabase-js';

type SetState = (state: Partial<SongState>) => void;
type GetState = () => SongState;

/**
 * Handle song update event from Supabase real-time subscription.
 * @param newSong Updated song data from Supabase
 * @param oldSong Previous song data
 * @param set State setter function
 * @param get State getter function
 * @param supabase Supabase client instance
 */
export async function handleSongUpdate(
  newSong: SongPayload,
  oldSong: SongPayload,
  set: SetState,
  get: GetState,
  supabase: SupabaseClient
) {
  // Check for critical state change - task_id nullification
  const taskIdNullified = oldSong?.task_id && newSong.task_id === null;
  
  // Log if task_id is nullified
  if (taskIdNullified) {
    console.log(`[SUPABASE UPDATE RECEIVED] Song ${newSong.id} task_id has been nullified in Supabase`, {
      songId: newSong.id,
      name: newSong.name,
      audioUrl: newSong.audio_url,
      timestamp: new Date().toISOString()
    });
  }
  
  // Get the existing song from the store
  const existingSong = get().songs.find((s) => s.id === newSong.id);
  
  // Use the existing song from state but update fields from the payload
  let updatedSong;
  
  if (existingSong) {
    // Create a merged song object that preserves existing state but updates changed fields
    updatedSong = {
      ...existingSong,
      // Update the fields that might have changed
      task_id: newSong.task_id,
      audio_url: newSong.audio_url || existingSong.audio_url,
      lyrics: newSong.lyrics || existingSong.lyrics,
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
  
  // Handle state-specific updates
  if (taskIdNullified) {
    // Force refresh the songs array to trigger UI updates
    const updatedSongs = [...get().songs];
    const songIndex = updatedSongs.findIndex(s => s.id === updatedSong.id);
    
    if (songIndex !== -1) {
      updatedSongs[songIndex] = updatedSong as Song;
      set({ songs: updatedSongs });
    }
  }
  
  // Update the song in the songs array using batch update
  get().batchUpdate({
    updateSong: {
      id: updatedSong.id,
      updatedSong: updatedSong as Song
    }
  });
}