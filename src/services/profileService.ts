import { supabase } from '../lib/supabase';
import type { Language, UserProfile } from '../types';
import { useSongStore } from '../store/songStore';
import { PRESET_CONFIGS } from '../data/lyrics';

interface ProfileUpdateParams {
  userId: string;
  babyName: string;
  preferredLanguage?: Language;
  birthMonth?: number;
  birthYear?: number;
  ageGroup?: AgeGroup;
}

export class ProfileService {
  static async updateProfile({ 
    userId, 
    babyName, 
    preferredLanguage,
    birthMonth,
    birthYear,
    ageGroup
  }: ProfileUpdateParams): Promise<UserProfile> {
    const trimmedBabyName = babyName.trim();
    
    console.log('Starting profile update:', { 
      userId, 
      newName: trimmedBabyName,
      preferredLanguage,
      birthMonth,
      birthYear,
      ageGroup
    });
    
    // Basic validation
    if (!userId) throw new Error('User ID is required');
    if (!trimmedBabyName) throw new Error('Baby name is required');

    // First update the profile in the database
    const { data: profile, error: updateError } = await supabase
      .from('profiles')
      .update(
        {
          baby_name: trimmedBabyName,
          ...(preferredLanguage && { preferred_language: preferredLanguage }),
          ...(birthMonth && { birth_month: birthMonth }),
          ...(birthYear && { birth_year: birthYear }),
          ...(ageGroup && { age_group: ageGroup })
        }
      )
      .eq('id', userId)
      .select('*')
      .single();

    if (updateError) {
      throw updateError;
    }

    if (!profile) {
      throw new Error('Failed to update profile - no data returned');
    }

    // Always regenerate preset songs when updating profile
    console.log('Regenerating preset songs with name:', trimmedBabyName);
    try {
      const { createSong } = useSongStore.getState();
      
      // Delete existing preset songs first
      const { error: deleteError } = await supabase
        .from('songs')
        .delete()
        .eq('user_id', userId)
        .or('name.ilike.%playtime%,name.ilike.%mealtime%,name.ilike.%bedtime%,name.ilike.%potty%');

      if (deleteError) throw deleteError;

      // Create new preset songs in parallel
      const presetPromises = Object.entries(PRESET_CONFIGS).map(([type, config]) => {
        return createSong({
          name: config.title(trimmedBabyName),
          mood: config.mood,
          songType: 'preset',
          preset_type: type,
          lyrics: config.lyrics(trimmedBabyName)
        });
      });

      await Promise.all(presetPromises);
    } catch (error) {
      console.error('Failed to regenerate preset songs:', error);
      throw new Error('Failed to update preset songs. Please try again.');
    }

    return {
      id: profile.id,
      email: profile.email,
      isPremium: profile.is_premium,
      dailyGenerations: profile.daily_generations,
      lastGenerationDate: profile.last_generation_date,
      babyName: profile.baby_name,
      preferredLanguage: profile.preferred_language || 'English'
    };
  }
}