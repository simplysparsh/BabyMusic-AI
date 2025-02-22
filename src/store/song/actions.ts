// @breadcrumbs
// - src/store/song/actions.ts: Actions for managing songs (create, delete, load)
// - Parent: src/store/songStore.ts
// - Related: src/store/song/types.ts (types)
// - Related: src/lib/piapi.ts (music generation)
// - Related: src/lib/supabase.ts (database)

import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../authStore';
import { createMusicGenerationTask } from '../../lib/piapi';
import { getPresetType } from '../../utils/presetUtils';
import type { Song } from '../../types';
import type { SongState, CreateSongParams } from './types';

type SetState = (state: Partial<SongState>) => void;
type GetState = () => SongState;

export const createSongActions = (set: SetState, get: GetState) => ({
  loadSongs: async () => {
    set({ isLoading: true, error: null });

    try {
      const user = useAuthStore.getState().user;
      if (!user?.id) {
        set({ songs: [], presetSongTypes: new Set() });
        return;
      }

      let retryCount = 0;
      const MAX_RETRIES = 3;
      const RETRY_DELAY = 1000;
      
      while (retryCount < MAX_RETRIES) {
        try {
          const { data: songs, error } = await supabase
            .from('songs')
            .select(`
              *,
              variations:song_variations(
                id,
                audio_url,
                title,
                metadata,
                created_at
              )
            `)
            .order('created_at', { ascending: false });

          if (error) throw error;

          // Update songs and clear preset types for completed songs
          const completedPresetTypes = new Set<string>();
          songs?.forEach((song: Song) => {
            const presetType = getPresetType(song.name);
            if (song.audioUrl && presetType) {
              completedPresetTypes.add(presetType);
            }
          });

          set({
            songs: songs as Song[],
            presetSongTypes: new Set(
              Array.from(get().presetSongTypes)
                .filter(type => !completedPresetTypes.has(type))
            )
          });
          break;
        } catch (error) {
          retryCount++;
          if (retryCount === MAX_RETRIES) throw error;
          await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * retryCount));
        }
      }
    } catch (error) {
      set({ 
        error: 'Unable to load songs. Please refresh the page or try signing in again.',
        songs: [],
        presetSongTypes: new Set()
      });
    } finally {
      set({ isLoading: false });
    }
  },

  createSong: async ({ name, mood, theme, lyrics, tempo, isInstrumental, hasUserIdeas }: CreateSongParams): Promise<Song> => {
    console.log('songStore.createSong called with:', {
      name,
      mood,
      theme,
      lyrics: lyrics ? 'provided' : 'not provided',
      tempo,
      isInstrumental,
      hasUserIdeas
    });

    let newSong: Song | null = null;
    try {
      const user = useAuthStore.getState().user;
      const profile = useAuthStore.getState().profile;

      if (!user || !profile) {
        throw new Error('User must be logged in to create songs');
      }

      if (!profile.babyName) {
        throw new Error('Baby name is required to create songs');
      }

      // Determine if this is a preset song
      const presetType = getPresetType(name);
      const isPreset = !!presetType;

      // If it's a preset and we're already generating it, don't create a new one
      if (presetType && get().presetSongTypes.has(presetType)) {
        throw new Error(`${presetType} song is already being generated`);
      }
      
      // If it's a preset song, delete any existing ones of the same type
      if (presetType) {
        const existingSongs = get().songs.filter(s => {
          const songType = getPresetType(s.name);
          return songType === presetType;
        });

        if (existingSongs.length > 0) {
          const { error: deleteError } = await supabase
            .from('songs')
            .delete()
            .in('id', existingSongs.map(s => s.id));

          if (deleteError) throw deleteError;

          // Update local state to remove deleted songs
          set({
            songs: get().songs.filter(s => !existingSongs.find(es => es.id === s.id))
          });
        }
      }

      // Track preset type if applicable
      if (presetType) {
        set({
          presetSongTypes: new Set([...get().presetSongTypes, presetType])
        });
      }

      // Create the initial song record
      const { data, error: insertError } = await supabase
        .from('songs')
        .insert([{
          name,
          mood,
          theme,
          lyrics,
          tempo,
          is_instrumental: isInstrumental,
          has_user_ideas: hasUserIdeas,
          user_lyric_input: lyrics,
          user_id: user.id,
          audio_url: null,
          status: 'staged'
        }])
        .select()
        .single();

      if (insertError || !data) throw insertError || new Error('Failed to create song');
      newSong = data as Song;

      // Update UI state
      set({
        songs: [newSong, ...get().songs],
        generatingSongs: new Set([...get().generatingSongs, newSong.id])
      });

      // Start music generation
      const taskId = await createMusicGenerationTask({
        theme,
        mood,
        lyrics, 
        name,
        ageGroup: profile?.ageGroup,
        tempo,
        isInstrumental,
        hasUserIdeas,
        voice: newSong.voice,
        is_preset: isPreset,
        preset_type: presetType || undefined
      });

      // Update song with task ID
      const { error: updateError } = await supabase
        .from('songs')
        .update({ task_id: taskId })
        .eq('id', newSong.id);

      if (updateError) throw updateError;

      set({
        processingTaskIds: new Set([...get().processingTaskIds, taskId])
      });
      
      return newSong;
    } catch (error) {
      // Clear preset type and generating state
      const presetType = getPresetType(name);

      if (presetType) {
        set({
          presetSongTypes: new Set([...get().presetSongTypes].filter(t => t !== presetType))
        });
      }

      // Update song with error state if it was created
      if (newSong?.id) {
        await supabase
          .from('songs')
          .update({ error: 'Failed to start music generation' })
          .eq('id', newSong.id);

        set({
          generatingSongs: new Set([...get().generatingSongs].filter(id => id !== newSong.id))
        });
      }

      throw error instanceof Error ? error : new Error('Failed to create song');
    }
  },

  deleteAllSongs: async () => {
    try {
      set({ isDeleting: true, error: null });
      const { user } = useAuthStore.getState();
      
      if (!user) {
        throw new Error('User must be logged in to delete songs');
      }

      const { error } = await supabase
        .from('songs')
        .delete()
        .eq('user_id', user.id);

      if (error) throw error;
      set({ songs: [] });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to delete songs' });
      throw error;
    } finally {
      set({ isDeleting: false });
    }
  }
}); 