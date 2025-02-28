import { supabase } from '../lib/supabase';
import { createMusicGenerationTask } from '../lib/piapi';
import { PRESET_CONFIGS } from '../data/lyrics';
import { getPresetType } from '../utils/presetUtils';
import type {
  Song,
  MusicMood,
  ThemeType,
  PresetType,
  Tempo,
  VoiceType
} from '../types';
import { useAuthStore } from '../store/authStore';

export class SongService {
  static async regeneratePresetSongs(userId: string, babyName: string) {
    console.log('Starting preset song regeneration:', { userId, babyName });

    try {
      // Delete existing preset songs first
      const { error: deleteError } = await supabase
        .from('songs')
        .delete()
        .eq('user_id', userId)
        .or('name.ilike.%playtime%,name.ilike.%mealtime%,name.ilike.%bedtime%,name.ilike.%potty%');

      if (deleteError) throw deleteError;

      // Create new preset songs in parallel
      const presetPromises = Object.entries(PRESET_CONFIGS).map(([type, config]) => 
        this.createSong({
          userId,
          name: config.title(babyName),
          babyName,
          songParams: {
            mood: config.mood,
            songType: 'preset',
            preset_type: type as PresetType
          }
        })
      );

      await Promise.all(presetPromises);
      console.log('Preset song regeneration completed successfully');
    } catch (error) {
      console.error('Failed to regenerate preset songs:', error);
      // Don't throw - let the error be handled by the UI layer if needed
    }
  }

  /**
   * Determines the appropriate mood for a song based on its type and parameters
   * @param params Parameters to determine the mood
   * @returns The determined mood or undefined if API should choose
   */
  private static determineMood(params: {
    songType: 'preset' | 'theme' | 'theme-with-input' | 'from-scratch';
    presetType?: PresetType | null;
    mood?: MusicMood | null;
  }): MusicMood | undefined {
    const { songType, presetType, mood } = params;

    // For presets: use the preset's defined mood
    if (songType === 'preset' && presetType && PRESET_CONFIGS[presetType]) {
      return PRESET_CONFIGS[presetType].mood;
    }

    // For themes: let API choose based on theme
    if (songType === 'theme' || songType === 'theme-with-input') {
      return undefined;
    }

    // For custom songs: use user-selected mood
    return mood;
  }

  // Core song operations
  static async createSong(params: {
    userId: string;
    name: string;
    babyName: string;
    songParams: {
      tempo?: Tempo;
      voice?: VoiceType;
      theme?: ThemeType;
      mood?: MusicMood;
      userInput?: string;
      isInstrumental?: boolean;
      songType: 'preset' | 'theme' | 'theme-with-input' | 'from-scratch';
    };
  }): Promise<Song> {
    const { userId, name, babyName, songParams } = params;
    const { theme, mood, userInput, tempo, songType, isInstrumental, voice } = songParams;

    console.log('Creating song with params:', {
      userId,
      name,
      songParams: {
        theme,
        mood,
        userInput: userInput ? `"${userInput}"` : 'not provided',
        tempo,
        isInstrumental,
        voice,
        songType
      },
    });

    if (!userId || !name) {
      throw new Error('User ID and name are required');
    }

    // Get preset type if applicable
    const presetType = songType === 'preset' ? getPresetType(name) : undefined;

    console.log('Preset detection:', {
      name,
      songType,
      presetType,
      hasConfig: presetType ? !!PRESET_CONFIGS[presetType] : false,
    });

    // For non-preset/non-theme songs, require mood
    if (songType === 'from-scratch' && !mood) {
      throw new Error('Either theme or mood is required');
    }

    // Determine the appropriate mood
    const determinedMood = this.determineMood({
      songType,
      presetType,
      mood
    });

    console.log('Creating song record:', {
      name,
      theme,
      mood: determinedMood,
      voice_type: isInstrumental ? null : voice,
      tempo,
      song_type: songType,
      preset_type: presetType || null,
      is_instrumental: isInstrumental || false,
      user_lyric_input: userInput || null,
      userInput_raw: userInput,
    });

    // Create initial song record
    const { data: song, error: createError } = await supabase
      .from('songs')
      .insert([{
        name,
        theme,
        mood: determinedMood,
        voice_type: isInstrumental ? null : voice,
        tempo,
        song_type: songType,
        lyrics: null,
        user_lyric_input: userInput || null,
        preset_type: presetType || null,
        is_instrumental: isInstrumental || false,
        user_id: userId,
      }])
      .select()
      .single();

    if (createError) {
      console.error('Failed to create song record:', {
        error: createError,
        params: {
          name,
          theme,
          mood: determinedMood,
          songType,
          hasUserInput: !!userInput
        }
      });
      throw createError;
    }

    console.log('Created song record:', {
      id: song.id,
      name: song.name,
      songType,
      hasUserInput: !!userInput
    });

    // Start generation task
    let taskId;
    try {
      taskId = await createMusicGenerationTask({
        theme,
        mood: determinedMood,
        userInput,
        name: babyName,
        ageGroup: undefined, // Will be fetched from profile
        tempo,
        isInstrumental,
        songType,
        voice,
        is_preset: songType === 'preset',
        preset_type: presetType
      });

      console.log('Music generation task created:', {
        taskId,
        songId: song.id
      });
    } catch (error) {
      console.error('Failed to create music generation task:', {
        error,
        songId: song.id
      });

      throw error;
    }

    return song;
  }

  static async loadUserSongs(userId: string): Promise<Song[]> {
    if (!userId) {
      throw new Error('User ID is required');
    }

    const { data: songs, error } = await supabase
      .from('songs')
      .select(
        `
        *,
        variations:song_variations(*)
      `
      )
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return songs;
  }

  static async deleteUserSongs(userId: string): Promise<void> {
    if (!userId) {
      throw new Error('User ID is required');
    }

    const { error } = await supabase
      .from('songs')
      .delete()
      .eq('user_id', userId);

    if (error) throw error;
  }
}