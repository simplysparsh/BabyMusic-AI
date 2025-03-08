// @breadcrumbs
// - src/store/song/handlers/songSubscriptionHandlers.ts: Handlers for song subscription events
// - Parent: src/store/song/subscriptions.ts
// - Related: src/store/song/types.ts (types)

import type { Song } from '../../../types';
import type { SongState } from '../types';
import type { SupabaseClient } from '@supabase/supabase-js';
import { songAdapter } from '../../../utils/songAdapter';
import { SongStateService } from '../../../services/songStateService';

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

type SetState = (state: Partial<SongState>) => void;
type GetState = () => SongState;

export async function handleSongUpdate(
  newSong: SongPayload,
  oldSong: SongPayload,
  set: SetState,
  get: GetState,
  supabase: SupabaseClient
) {
  // Log for debugging
  console.log(`Song update for ${newSong.name}:`, {
    song_type: newSong.song_type,
    status: newSong.status,
    audioUrl: !!newSong.audio_url,
    error: !!newSong.error
  });

  // Track task IDs for processing state
  if (newSong.task_id && !get().processingTaskIds.has(newSong.task_id)) {
    set({
      processingTaskIds: new Set([...get().processingTaskIds, newSong.task_id])
    });
  }

  // Handle staged tasks
  if (SongStateService.isStaged(newSong as unknown as Song) && newSong.task_id && !get().stagedTaskIds.has(newSong.task_id)) {
    set({
      stagedTaskIds: new Set([...get().stagedTaskIds, newSong.task_id])
    });
  }

  // Fetch the complete song with variations
  const { data: updatedSong, error: fetchError } = await supabase
    .from('songs')
    .select('*, variations:song_variations(*)')
    .eq('id', oldSong.id)
    .single();
  
  // Handle case where song might have been deleted
  if (fetchError || !updatedSong) {
    console.log(`Song ${oldSong.id} not found in database, cleaning up UI state`);
    
    // Clean up UI state for this song
    const newGenerating = new Set(get().generatingSongs);
    newGenerating.delete(oldSong.id);
    
    // Clean up task IDs if applicable
    const newProcessingTaskIds = new Set(get().processingTaskIds);
    if (oldSong.task_id) {
      newProcessingTaskIds.delete(oldSong.task_id);
    }
    
    // Clean up retrying state if applicable
    const newRetrying = new Set(get().retryingSongs);
    newRetrying.delete(oldSong.id);
    
    // Remove song from songs array
    set({
      songs: get().songs.filter(song => song.id !== oldSong.id),
      generatingSongs: newGenerating,
      processingTaskIds: newProcessingTaskIds,
      retryingSongs: newRetrying
    });
    
    return;
  }

  // Clear generating state when song is complete or has error
  if (SongStateService.isCompleted(updatedSong) || SongStateService.hasFailed(updatedSong)) {
    const newGenerating = new Set(get().generatingSongs);
    newGenerating.delete(updatedSong.id);

    // Clear from task processing queue if applicable
    const newProcessingTaskIds = new Set(get().processingTaskIds);
    if (updatedSong.task_id) {
      newProcessingTaskIds.delete(updatedSong.task_id);
    }
    
    // Clear retrying state if applicable
    const newRetrying = new Set(get().retryingSongs);
    newRetrying.delete(updatedSong.id);
    
    set({ 
      generatingSongs: newGenerating,
      processingTaskIds: newProcessingTaskIds,
      retryingSongs: newRetrying,
      error: updatedSong.error || null
    });
  }

  // Update the song in the songs array
  set({
    songs: get().songs.map((song) =>
      song.id === oldSong.id ? updatedSong as Song : song
    )
  });
}