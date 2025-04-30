import { supabase } from '../lib/supabase';
import { DEFAULT_LANGUAGE } from '../types';
import type { Language, UserProfile, AgeGroup } from '../types';

interface ProfileUpdateParams {
  userId: string;
  babyName: string;
  preferredLanguage?: Language;
  birthMonth?: number;
  birthYear?: number;
  ageGroup?: AgeGroup;
  gender?: string;
  timezone?: string;
}

export class ProfileService {
  static async updateProfile({ 
    userId, 
    babyName, 
    preferredLanguage,
    birthMonth,
    birthYear,
    ageGroup,
    gender,
    timezone
  }: ProfileUpdateParams): Promise<UserProfile> {
    const trimmedBabyName = babyName.trim();
    
    console.log('Starting profile update:', { 
      userId, 
      newName: trimmedBabyName,
      preferredLanguage,
      birthMonth,
      birthYear,
      ageGroup,
      gender,
      timezone
    });
    
    // Basic validation
    if (!userId) throw new Error('User ID is required');
    if (!trimmedBabyName) throw new Error('Baby name is required');
    if (gender === undefined) {
      console.log('Gender not provided, will not update gender field');
    }

    // First update the profile in the database
    const { data: profile, error: updateError } = await supabase
      .from('profiles')
      .update(
        {
          baby_name: trimmedBabyName,
          ...(preferredLanguage && { preferred_language: preferredLanguage }),
          ...(birthMonth && { birth_month: birthMonth }),
          ...(birthYear && { birth_year: birthYear }),
          ...(ageGroup && { age_group: ageGroup }),
          ...(gender !== undefined && { gender }),
          ...(timezone && { timezone })
        }
      )
      .eq('id', userId)
      .select(`
        id,
        email,
        is_premium,
        daily_generations,
        last_generation_date,
        baby_name,
        preferred_language,
        gender,
        birth_month, 
        birth_year, 
        age_group,
        timezone
      `)
      .single();

    if (updateError) {
      throw updateError;
    }

    if (!profile) {
      throw new Error('Failed to update profile - no data returned');
    }

    // Return profile response immediately
    const profileResponse: UserProfile = {
      id: profile.id,
      email: profile.email,
      isPremium: profile.is_premium,
      dailyGenerations: profile.daily_generations,
      lastGenerationDate: profile.last_generation_date,
      babyName: profile.baby_name,
      preferredLanguage: profile.preferred_language || DEFAULT_LANGUAGE,
      gender: profile.gender,
      birthMonth: profile.birth_month,
      birthYear: profile.birth_year,
      ageGroup: profile.age_group,
      timezone: profile.timezone
    };

    return profileResponse;
  }
}