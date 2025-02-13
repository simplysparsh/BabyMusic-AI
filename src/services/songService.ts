import { supabase } from '../lib/supabase';
import { createMusicGenerationTask } from '../lib/piapi';
import type { Song, MusicMood, Instrument, Language } from '../types';

export class SongService {
  // Core song operations
  static async createSong(params: {
    userId: string;
    name: string;
    mood: MusicMood;
    instrument?: Instrument;
    lyrics?: string
  }): Promise<Song> {
    const { userId, name, mood, instrument, lyrics } = params;
    
    if (!userId || !name || !mood) {
      throw new Error('User ID, name, and mood are required');
    }

    // Create initial song record
    const { data: song, error: createError } = await supabase
      .from('songs')
      .insert([{
        name,
        mood,
        instrument: instrument || null,
        lyrics,
        user_id: userId
      }])
      .select()
      .single();

    if (createError) throw createError;

    // Start generation task
    const taskId = await createMusicGenerationTask(
      mood,
      instrument,
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