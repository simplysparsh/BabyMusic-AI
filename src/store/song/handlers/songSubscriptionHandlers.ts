// @breadcrumbs
// - src/store/song/handlers/songSubscriptionHandlers.ts: Handlers for song subscription events
// - Parent: src/store/song/subscriptions.ts
// - Related: src/store/song/types.ts (types)

import { getPresetType } from '../../../utils/presetUtils';
import type { Song } from '../../../types';
import type { SongState } from '../types';
import type { SupabaseClient } from '@supabase/supabase-js';

interface SongPayload {
  id: string;
  name: string;
  song_type: string;
  error?: string | null;
  audioUrl?: string | null;
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
  supabase: SupabaseClient,
  presetSongsProcessing: Set<string>
) {
  const presetType = newSong.song_type === 'preset' ? getPresetType(newSong.name) : null;

  // Track preset songs being processed
  if (newSong.song_type === 'preset' && presetType && !presetSongsProcessing.has(newSong.id)) {
    presetSongsProcessing.add(newSong.id);
    set({
      presetSongTypes: new Set([...get().presetSongTypes, presetType])
    });
  }

  // Handle error state
  if (newSong.error) {
    // Clear preset type if applicable
    if (newSong.song_type === 'preset' && presetType) {
      presetSongsProcessing.delete(newSong.id);
      const newPresetTypes = new Set(get().presetSongTypes);
      newPresetTypes.delete(presetType);
      set({ presetSongTypes: newPresetTypes });
    }
  }
  
  // Handle successful completion
  if (newSong.audioUrl) {
    // Clear preset type if applicable
    if (newSong.song_type === 'preset' && presetType) {
      presetSongsProcessing.delete(newSong.id);
      const newPresetTypes = new Set(get().presetSongTypes);
      newPresetTypes.delete(presetType);
      set({ 
        presetSongTypes: newPresetTypes,
        error: null
      });
    }
  }

  // Track task_id for processing state
  if (newSong.task_id && !get().processingTaskIds.has(newSong.task_id)) {
    set({
      processingTaskIds: new Set([...get().processingTaskIds, newSong.task_id])
    });
  }

  // Handle staged tasks
  if (newSong.status === 'staged' && newSong.task_id && !get().stagedTaskIds.has(newSong.task_id)) {
    set({
      stagedTaskIds: new Set([...get().stagedTaskIds, newSong.task_id])
    });
  }

  // Fetch the complete song with variations
  const { data: updatedSong } = await supabase
    .from('songs')
    .select('*, variations:song_variations(*)')
    .eq('id', oldSong.id)
    .single();
  
  if (!updatedSong) {
    return;
  }

  // Clear generating state when we have audio URL or an error
  if (updatedSong.audioUrl || updatedSong.error || 
      updatedSong.status === 'failed') {
    const newGenerating = new Set(get().generatingSongs);
    newGenerating.delete(updatedSong.id);
    set({ generatingSongs: newGenerating });
  }

  set({
    songs: get().songs.map((song) =>
      song.id === oldSong.id ? updatedSong as Song : song
    ),
    error: updatedSong.error || null
  });
} 