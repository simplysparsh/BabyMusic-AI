import { supabase } from '../lib/supabase';
import { createMusicGenerationTask } from '../lib/piapi';
import { PRESET_CONFIGS } from '../data/lyrics';
import type {
  Song,
  MusicMood,
  ThemeType,
  PresetType,
  Tempo,
  VoiceType
} from '../types';

export class SongService {
  /**
   * Determines the appropriate mood for a song based on its type and parameters
   * @param params Parameters to determine the mood
   * @returns The determined mood or undefined if API should choose
   */
  private static determineMood(params: {
    songType: 'preset' | 'theme' | 'theme-with-input' | 'from-scratch';
    presetType?: PresetType;
    mood?: MusicMood;
  }): MusicMood | undefined {
    const { songType, presetType, mood } = params;

    // For presets: use the preset's defined mood
    if (presetType && PRESET_CONFIGS[presetType]) {
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

    // Helper functions
    const isPresetSong = (name: string) => {
      return name.toLowerCase().includes('playtime') ||
        name.toLowerCase().includes('mealtime') ||
        name.toLowerCase().includes('bedtime') ||
        name.toLowerCase().includes('potty');
    };

    const getPresetType = (name: string): PresetType | undefined => {
      const lowerName = name.toLowerCase();
      if (lowerName.includes('playtime')) return 'playing';
      if (lowerName.includes('mealtime')) return 'eating';
      if (lowerName.includes('bedtime')) return 'sleeping';
      if (lowerName.includes('potty')) return 'pooping';
      return undefined;
    };

    console.log('Creating song with params:', {
      userId,
      name,
      babyName,
      songParams: {
        theme,
        mood,
        userInput: userInput ? `"${userInput}"` : 'not provided',
        tempo,
        isInstrumental,
        voice,
      },
    });

    if (!userId || !name) {
      throw new Error('User ID and name are required');
    }

    // Check if this is a preset song
    const isPreset = isPresetSong(name);
    const presetType = isPreset ? getPresetType(name) : undefined;

    console.log('Preset detection:', {
      name,
      isPreset,
      presetType,
      hasConfig: presetType ? !!PRESET_CONFIGS[presetType] : false,
    });

    // For non-preset songs, require either theme or mood
    if (!isPreset && !theme && !mood) {
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
      is_preset: isPreset,
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
        is_preset: isPreset,
        preset_type: presetType || null,
        is_instrumental: isInstrumental || false,
        user_id: userId,
      }])
      .select()
      .single();

    if (createError) throw createError;

    // Start generation task
    const taskId = await createMusicGenerationTask({
      theme,
      mood: determinedMood,
      userInput,
      name: babyName,
      ageGroup: undefined, // Will be fetched from profile
      tempo,
      isInstrumental,
      songType,
      voice,
      is_preset: isPreset,
      preset_type: presetType
    });

    // Update song with task ID
    const { error: updateError } = await supabase
      .from('songs')
      .update({ task_id: taskId })
      .eq('id', song.id);

    if (updateError) throw updateError;

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