import { supabase } from '../lib/supabase';
import { createMusicGenerationTask } from '../lib/piapi';
import type { Song, MusicMood, ThemeType, Language } from '../types';

export class SongService {
  // Core song operations
  static async createSong(params: {
    userId: string;
    name: string;
    theme?: ThemeType;
    mood?: MusicMood;
    lyrics?: string
  }): Promise<Song> {
    const { userId, name, theme, mood, lyrics } = params;
    
    if (!userId || !name) {
      throw new Error('User ID and name are required');
    }

    if (!theme && !mood) {
      throw new Error('Either theme or mood is required');
    }

    if (theme === 'custom' && !mood) {
      throw new Error('Mood is required for custom songs');
    }

    // Create initial song record
    const { data: song, error: createError } = await supabase
      .from('songs')
      .insert([{
        name,
        theme,
        mood,
        lyrics,
        user_id: userId
      }])
      .select()
      .single();

    if (createError) throw createError;

    // Start generation task
    const taskId = await createMusicGenerationTask(
      theme,
      mood,
      lyrics
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