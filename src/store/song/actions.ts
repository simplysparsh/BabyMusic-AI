// @breadcrumbs
// - src/store/song/actions.ts: Actions for the song store
// - Parent: src/store/songStore.ts
// - Related: src/store/song/types.ts (types)
// - Related: src/lib/supabase.ts (database)

import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../authStore';
import { SongService } from '../../services/songService';
import type { Song, PresetType } from '../../types';
import type { SongState, CreateSongParams } from './types';
import { songAdapter } from '../../utils/songAdapter';
import { getPresetType } from '../../utils/presetUtils';

// Create a typed setter and getter for the zustand store
type SetState = (state: Partial<SongState>) => void;
type GetState = () => SongState;

export const createSongActions = (set: SetState, get: GetState) => ({
  loadSongs: async () => {
    try {
      set({ isLoading: true, error: null });
      
      const { data: songsData, error } = await supabase
        .from('songs')
        .select('*, variations:song_variations(*)')
        .eq('user_id', useAuthStore.getState().user?.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;

      set({ songs: songsData as Song[] || [] });
    } catch (error) {
      console.error('Error loading songs:', error);
      set({ error: 'Failed to load your songs.' });
    } finally {
      set({ isLoading: false });
    }
  },

  createSong: async ({ name, mood, theme, userInput, tempo, isInstrumental, voice, songType, preset_type }: CreateSongParams): Promise<Song> => {
    console.log('songStore.createSong called with:', {
      name,
      mood,
      theme,
      userInput: userInput ? `"${userInput}"` : 'not provided',
      songType,
      preset_type,
      isInstrumental,
      voice
    });

    const currentPresetType: PresetType | null = preset_type || null;
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

      // If this is a preset song, check if one is already generating
      if (currentPresetType && songType === 'preset') {
        console.log('Processing preset song of type:', currentPresetType);
        
        // Find all songs of this preset type
        const existingSongs = get().songs.filter(s => 
          s.song_type === 'preset' && s.preset_type === currentPresetType
        );
        
        console.log(`Found ${existingSongs.length} existing songs for preset type ${currentPresetType}`);
        
        // Check if any are currently generating
        // Use songAdapter for consistent property access
        const isGenerating = existingSongs.some(song => 
          !songAdapter.getAudioUrl(song) && !song.error ||
          get().generatingSongs.has(song.id)
        );
        
        if (isGenerating) {
          console.log(`A song of type ${currentPresetType} is already generating, skipping`);
          throw new Error(`${currentPresetType} song is already being generated`);
        }

        // Delete any existing songs of this preset type
        if (existingSongs.length > 0) {
          console.log(`Deleting ${existingSongs.length} existing songs for preset type ${currentPresetType}:`, 
            existingSongs.map(s => ({ id: s.id, name: s.name })));
          
          const { error: deleteError } = await supabase
            .from('songs')
            .delete()
            .in('id', existingSongs.map(s => s.id));

          if (deleteError) {
            console.error(`Failed to delete existing ${currentPresetType} songs:`, deleteError);
            throw deleteError;
          }

          // Update local state to remove deleted songs
          set({
            songs: get().songs.filter(s => !existingSongs.find(es => es.id === s.id))
          });
          
          console.log(`Successfully deleted existing ${currentPresetType} songs`);
        }
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
          voice,
          userInput,
          preset_type: currentPresetType || undefined
        }
      });

      if (!createdSong) {
        throw new Error('Failed to create song record');
      }

      console.log('Song created successfully:', {
        id: createdSong.id,
        name: createdSong.name,
        preset_type: createdSong.preset_type
      });

      // Update UI state
      set({
        songs: [createdSong, ...get().songs],
        generatingSongs: new Set([...get().generatingSongs, createdSong.id])
      });

      return createdSong;
    } catch (error) {
      // Update song with error state if it was created
      if (createdSong?.id) {
        try {
          await supabase
            .from('songs')
            .update({ error: 'Failed to start music generation' })
            .eq('id', createdSong!.id);

          set({
            generatingSongs: new Set([...get().generatingSongs].filter(id => id !== createdSong!.id))
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
      
      set({ 
        songs: [], 
        generatingSongs: new Set(),
        processingTaskIds: new Set(),
        stagedTaskIds: new Set()
      });
    } catch (error) {
      console.error('Error deleting songs:', error);
      set({ error: 'Failed to delete your songs.' });
    } finally {
      set({ isDeleting: false });
    }
  },

  retrySong: async (songId: string) => {
    const { user } = useAuthStore.getState();
    
    if (!user) {
      console.error('User not authenticated');
      return;
    }
    
    const userId = user.id;
    const profile = useAuthStore.getState().profile;
    const babyName = profile?.babyName || 'Baby';
    
    try {
      set({ error: null });
      
      // Mark the song as retrying
      const songStore = get();
      songStore.setRetrying(songId, true);
      
      // Call the SongService to retry the song generation
      await SongService.retrySongGeneration(songId, userId, babyName);
      
      // The song update will be handled by the subscription handler
    } catch (error) {
      console.error('Failed to retry song generation:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to retry song generation';
      set({ error: errorMessage });
      
      // Clear the retrying state
      const songStore = get();
      songStore.setRetrying(songId, false);
    }
  }
});