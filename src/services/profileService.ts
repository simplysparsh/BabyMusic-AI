import { supabase } from '../lib/supabase';
import type { Language, UserProfile } from '../types';
import { PresetService } from './presetService';

interface ProfileUpdateParams {
  userId: string;
  babyName: string;
  preferredLanguage?: Language;
}

export class ProfileService {
  static async updateProfile({ userId, babyName, preferredLanguage }: ProfileUpdateParams): Promise<UserProfile> {
    const trimmedBabyName = babyName.trim();
    
    console.log('Starting profile update:', { 
      userId, 
      newName: trimmedBabyName,
      preferredLanguage
    });
    
    // Basic validation
    if (!userId) throw new Error('User ID is required');
    if (!trimmedBabyName) throw new Error('Baby name is required');

    // First update the profile in the database
    const { data: profile, error: updateError } = await supabase
      .from('profiles')
      .update(
        preferredLanguage 
          ? { baby_name: trimmedBabyName, preferred_language: preferredLanguage }
          : { baby_name: trimmedBabyName }
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
      await PresetService.regenerateAllPresets({
        userId,
        babyName: trimmedBabyName
      });
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