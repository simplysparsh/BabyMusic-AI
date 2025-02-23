// @breadcrumbs
// - src/store/song/actions.ts: Actions for managing songs (create, delete, load)
// - Parent: src/store/songStore.ts
// - Related: src/store/song/types.ts (types)
// - Related: src/lib/supabase.ts (database)

import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../authStore';
import { getPresetType } from '../../utils/presetUtils';
import { SongService } from '../../services/songService';
import type { Song, PresetType } from '../../types';
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

  createSong: async ({ name, mood, theme, lyrics, tempo, isInstrumental, songType }: CreateSongParams): Promise<Song> => {
    console.log('songStore.createSong called with:', {
      name,
      mood,
      theme,
      lyrics: lyrics ? 'provided' : 'not provided',
      songType,
      isInstrumental
    });

    let currentPresetType: PresetType | null = null;
    let createdSong: Song | undefined;
    
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
      currentPresetType = getPresetType(name);

      // If it's a preset and we're already generating it, don't create a new one
      if (currentPresetType && get().presetSongTypes.has(currentPresetType)) {
        throw new Error(`${currentPresetType} song is already being generated`);
      }
      
      // If it's a preset song, delete any existing ones of the same type
      if (currentPresetType) {
        const existingSongs = get().songs.filter(s => getPresetType(s.name) === currentPresetType);

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

        // Track preset type
        set({
          presetSongTypes: new Set([...get().presetSongTypes, currentPresetType])
        });
      }

      // Create the song using SongService
      createdSong = await SongService.createSong({
        userId: user.id,
        name,
        babyName: profile.babyName,
        songParams: {
          theme,
          mood,
          tempo,
          isInstrumental,
          songType,
          voice: undefined,
          userInput: lyrics
        }
      });

      if (!createdSong) {
        throw new Error('Failed to create song record');
      }

      // Update UI state
      set({
        songs: [createdSong, ...get().songs],
        generatingSongs: new Set([...get().generatingSongs, createdSong.id])
      });

      return createdSong;
    } catch (error) {
      // Clear preset type if applicable
      if (currentPresetType) {
        set({
          presetSongTypes: new Set([...get().presetSongTypes].filter(t => t !== currentPresetType))
        });
      }

      // Update song with error state if it was created
      if (createdSong?.id) {
        try {
          await supabase
            .from('songs')
            .update({ error: 'Failed to start music generation' })
            .eq('id', createdSong.id);

          set({
            generatingSongs: new Set([...get().generatingSongs].filter(id => id !== createdSong.id))
          });
        } catch (updateError) {
          console.error('Failed to update song error state:', updateError);
        }
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