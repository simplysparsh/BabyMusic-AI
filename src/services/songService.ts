import { supabase } from '../lib/supabase';
import { createMusicGenerationTask } from '../lib/piapi';
import { PRESET_CONFIGS } from '../data/lyrics';
import type { Song, MusicMood, ThemeType, Language, PresetType, Tempo } from '../types';

export class SongService {
  // Core song operations
  static async createSong(params: {
    userId: string;
    name: string;
    tempo?: Tempo;
    theme?: ThemeType;
    mood?: MusicMood;
    lyrics?: string;
    hasUserIdeas?: boolean;
  }): Promise<Song> {
    const { userId, name, theme, mood, lyrics, tempo, hasUserIdeas } = params;
    
    if (!userId || !name) {
      throw new Error('User ID and name are required');
    }

    // Check if this is a preset song
    const isPreset = name.toLowerCase().includes('playtime') ||
                     name.toLowerCase().includes('mealtime') ||
                     name.toLowerCase().includes('bedtime') ||
                     name.toLowerCase().includes('potty');

    // Get preset config if applicable
    const presetType = isPreset ? (
      name.toLowerCase().includes('playtime') ? 'playing' :
      name.toLowerCase().includes('mealtime') ? 'eating' :
      name.toLowerCase().includes('bedtime') ? 'sleeping' :
      'pooping'
    ) as PresetType : undefined;
    
    const presetConfig = presetType ? PRESET_CONFIGS[presetType] : undefined;

    // For non-preset songs, require either theme or mood
    if (!isPreset && !theme && !mood) {
      throw new Error('Either theme or mood is required');
    }

    // For custom theme songs, require mood
    if (!isPreset && theme === 'custom' && !mood) {
      throw new Error('Mood is required for custom songs');
    }

    // Create initial song record
    const { data: song, error: createError } = await supabase
      .from('songs')
      .insert([{
        name,
        theme,
        mood: isPreset ? presetConfig?.mood : mood,
        lyrics: isPreset ? presetConfig?.lyrics(name.split("'")[0]) : lyrics,
        is_preset: isPreset,
        preset_type: presetType || null,
        user_id: userId
      }])
      .select()
      .single();

    if (createError) throw createError;

    // Start generation task
    const taskId = await createMusicGenerationTask(
      theme,
      isPreset ? presetConfig?.mood : mood,
      isPreset ? presetConfig?.lyrics(name.split("'")[0]) : lyrics,
      name,
      undefined, // ageGroup will be fetched from profile
      tempo,
      false, // isInstrumental
      hasUserIdeas
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
      .select(`
        *,
        variations:song_variations(*)
      `)
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