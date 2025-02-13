import { supabase } from '../lib/supabase';
import type { PresetType, MusicMood, Instrument } from '../types';
import { useSongStore } from '../store/songStore';

// Simplified preset configurations
const PRESET_SONGS = {
  playing: {
    title: (name: string) => `${name}'s playtime song`,
    mood: 'energetic' as const,
    lyrics: (name: string) => `Bounce and play, ${name}'s having fun today!`
  },
  eating: {
    title: (name: string) => `${name}'s mealtime song`, 
    mood: 'playful' as const,
    lyrics: (name: string) => `Yummy yummy in ${name}'s tummy!`
  },
  sleeping: {
    title: (name: string) => `${name}'s bedtime song`,
    mood: 'calm' as const,
    lyrics: (name: string) => `Sweet dreams little ${name}!`
  },
  pooping: {
    title: (name: string) => `${name}'s potty song`,
    mood: 'playful' as const,
    lyrics: (name: string) => `Push push little ${name}!`
  }
};

export class PresetSongService {
  static async regenerateAllPresetSongs(userId: string, babyName: string): Promise<void> {
    try {
      // Delete existing preset songs first
      const { error: deleteError } = await supabase
        .from('songs')
        .delete()
        .eq('user_id', userId)
        .or('name.ilike.%playtime%,name.ilike.%mealtime%,name.ilike.%bedtime%,name.ilike.%potty%');

      if (deleteError) throw deleteError;

      // Create all preset songs in parallel
      const { createSong } = useSongStore.getState();
      const presetPromises = Object.entries(PRESET_SONGS).map(([type, config]) => {
        return createSong({
          name: config.title(babyName),
          mood: config.mood,
          lyrics: config.lyrics(babyName)
        });
      });

      await Promise.all(presetPromises);
    } catch (error) {
      console.error('Failed to regenerate preset songs:', error);
      throw error;
    }
  }

  static async handlePresetClick(type: PresetType, babyName: string): Promise<void> {
    const config = PRESET_SONGS[type];
    if (!config) {
      throw new Error(`Invalid preset type: ${type}`);
    }

    const { createSong } = useSongStore.getState();
    try {
      await createSong({
        name: config.title(babyName),
        mood: config.mood,
        lyrics: config.lyrics(babyName)
      });
    } catch (error) {
      console.error('Failed to create preset song:', error);
      throw error;
    }
  }
}