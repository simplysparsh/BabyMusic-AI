import { SongService } from './songService';
import { supabase } from '../lib/supabase';
import type { PresetType, Language } from '../types';

// Preset song configurations
const PRESETS = {
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

export class PresetService {
  static async createPresetSong(params: {
    userId: string;
    babyName: string;
    type: PresetType;
  }): Promise<void> {
    const { userId, babyName, type } = params;
    
    if (!userId || !babyName) {
      throw new Error('User ID and baby name are required');
    }
    
    const preset = PRESETS[type];
    
    if (!preset) {
      throw new Error(`Invalid preset type: ${type}`);
    }

    await SongService.createSong({
      userId,
      name: preset.title(babyName),
      mood: preset.mood,
      instrument: preset.instrument,
      lyrics: preset.lyrics(babyName)
    });
  }

  static async regenerateAllPresets(params: {
    userId: string,
    babyName: string
  }): Promise<void> {
    const { userId, babyName } = params;
    
    console.log('Starting preset songs regeneration:', { userId, babyName });

    if (!userId || !babyName) {
      throw new Error('User ID and baby name are required');
    }

    // Delete existing preset songs first
    try {
      const { error: deleteError } = await supabase
        .from('songs')
        .delete()
        .eq('user_id', userId)
        .or('name.ilike.%playtime%,name.ilike.%mealtime%,name.ilike.%bedtime%,name.ilike.%potty%');

      if (deleteError) throw deleteError;

      // Create new preset songs
      console.log('Creating new preset songs for:', babyName);
      for (const type of Object.keys(PRESETS)) {
        const preset = PRESETS[type as PresetType];
        await SongService.createSong({
          userId,
          name: preset.title(babyName),
          mood: preset.mood,
          lyrics: preset.lyrics(babyName)
        });
      }
      
      console.log('Preset songs generation complete');
    } catch (error) {
      console.error('Failed to regenerate presets:', error);
      throw error;
    }
  }
}