import { supabase } from '../lib/supabase';
import { createMusicGenerationTask } from '../lib/piapi';
import { PRESET_CONFIGS } from '../data/lyrics';
import type {
  Song,
  MusicMood,
  ThemeType,
  Language,
  PresetType,
  Tempo,
} from '../types';

export class SongService {
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
      userInput?: string; // User's custom ideas/context for lyrics generation
      isInstrumental?: boolean;
      songType: 'preset' | 'theme' | 'theme-with-input' | 'from-scratch';
    };
  }): Promise<Song> {
    const { userId, name, babyName, songParams } = params;
    const { theme, mood, userInput, tempo, songType, isInstrumental, voice } =
      songParams;

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
        hasLyrics: !!lyrics,
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

    console.log('Preset detection:', {
      name,
      isPreset,
    });

    // Get preset config if applicable
    const presetType = isPreset ? getPresetType(name) : undefined;

    console.log('Preset type detection:', {
      isPreset,
      presetType,
      hasConfig: presetType ? !!PRESET_CONFIGS[presetType] : false,
    });

    const presetConfig = presetType ? PRESET_CONFIGS[presetType] : undefined;

    // For non-preset songs, require either theme or mood
    if (!isPreset && !theme && !mood) {
      throw new Error('Either theme or mood is required');
    }

    // Helper function to determine the mood
    const determineMood = () => isPreset ? presetConfig?.mood : theme ? undefined : mood;

    console.log('Creating song record:', {
      name,
      theme,
      mood: determineMood(), 
      voice_type: isInstrumental ? null : voice,
      tempo,
      songType,
      hasUserInput: !!userInput,
      song_type: songType,
      is_preset: isPreset,
      preset_type: presetType || null,
      is_instrumental: isInstrumental || false,
    });

    // Create initial song record
    const { data: song, error: createError } = await supabase
      .from('songs')
      // Store user-provided lyrics or null - actual lyrics will be generated during task creation
      .insert([
        {
          name,
          theme,
          mood: determineMood(),
          voice_type: isInstrumental ? null : voice,
          tempo,
          song_type: songType,
          lyrics: null, // Will be set after generation
          user_lyric_input: userInput || null, // Store user's custom input for lyrics generation
          wants_custom_lyrics: wantsCustomLyrics || false, // Store whether user wants custom lyrics
          is_preset: isPreset,
          preset_type: presetType || null,
          is_instrumental: isInstrumental || false,
          user_id: userId,
        },
      ])
      .select()
      .single();

    if (createError) throw createError;

    // Start generation task
    const taskId = await createMusicGenerationTask(
      theme,
      mood: isPreset ? presetConfig?.mood : mood,
      userInput, // Pass user's custom input to Claude for lyrics generation
      name: babyName,
      undefined, // ageGroup will be fetched from profile
      tempo,
      isInstrumental,
      wantsCustomLyrics,
      is_preset: isPreset,
      preset_type: presetType
    );

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