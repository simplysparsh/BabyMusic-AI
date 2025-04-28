import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { useSongStore } from './songStore';
import { useErrorStore } from './errorStore';
import { ProfileService } from '../services/profileService';
import { SongService } from '../services/songService';
import { type User } from '@supabase/supabase-js';
import { DEFAULT_LANGUAGE } from '../types';
import type { UserProfile, Language, AgeGroup } from '../types';
import type { PresetType as _PresetType } from '../types';
import { PRESET_CONFIGS as _PRESET_CONFIGS } from '../data/lyrics';

interface AuthState {
  user: User | null;
  profile: UserProfile | null;
  initialized: boolean;
  isLoading: boolean;
  
  // Add loadProfile to the interface
  loadProfile: () => Promise<void>;
  
  updateProfile: (updates: { 
    babyName: string; 
    preferredLanguage?: Language;
    birthMonth?: number;
    birthYear?: number;
    ageGroup?: AgeGroup;
    gender?: string;
  }) => Promise<UserProfile>; // Change return type to match implementation
  
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, babyName: string, gender: string) => Promise<void>;
  signOut: () => Promise<void>;
  loadUser: () => Promise<void | (() => void)>; // Fix return type to match implementation
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  profile: null,
  initialized: false,
  isLoading: false,
  loadProfile: async () => {
    const user = get().user;
    if (!user) return;

    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !session) {
      await supabase.auth.signOut();
      set({ user: null, profile: null });
      return;
    }

    const MAX_RETRIES = 3;
    const RETRY_DELAY = 2000;
    let retryCount = 0;
    
    while (retryCount < MAX_RETRIES) {
      try {
        // Add a small delay before retries (but not on first attempt)
        if (retryCount > 0) {
          await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * retryCount));
        }

        // Verify session is still valid before each attempt
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        if (!currentSession) {
          throw new Error('Session expired during profile load');
        }

      const { data: profile, error } = await supabase
        .from('profiles')
        .select(`
          id,
          email,
          is_premium,
          daily_generations,
          last_generation_date,
          baby_name,
          preferred_language,
          created_at,
          gender
        `)
        .eq('id', user.id)
        .single();
      
      if (error) {
        // If the profile doesn't exist, force logout
        if (error.code === 'PGRST116' || error.message.includes('contains 0 rows')) {
          await supabase.auth.signOut();
          set({ 
            user: null, 
            profile: null
          });
          return;
        }
        throw error;
      }

      if (profile) {
        const userProfile: UserProfile = {
          id: profile.id,
          email: profile.email,
          isPremium: profile.is_premium,
          dailyGenerations: profile.daily_generations,
          lastGenerationDate: profile.last_generation_date,
          babyName: profile.baby_name,
          preferredLanguage: profile.preferred_language || DEFAULT_LANGUAGE,
          gender: profile.gender
        };
      
        set({ profile: userProfile });
        return;
      } else {
        throw new Error('No profile data received');
      }
      } catch (err) {
        retryCount++;

        if (retryCount === MAX_RETRIES) {
          set({ 
            isLoading: false 
          });
          throw err;
        }
      }
    }
  },
  
  updateProfile: async ({ babyName: newBabyName, preferredLanguage, birthMonth, birthYear, ageGroup, gender }) => {
    const user = get().user;
    if (!user) throw new Error('Not authenticated');
    const errorStore = useErrorStore.getState();
    const currentProfile = get().profile;

    console.log('Starting profile update with data:', {
      newBabyName,
      preferredLanguage,
      birthMonth,
      birthYear,
      ageGroup,
      gender
    });

    errorStore.clearError();

    if (!newBabyName) {
      throw new Error('Baby name is required');
    }

    try {
      const trimmedNewName = newBabyName.trim();
      if (!trimmedNewName) {
        throw new Error('Baby name is required');
      }

      // Ensure gender is explicitly passed
      const updatedProfile = await ProfileService.updateProfile({
        userId: user.id,
        babyName: trimmedNewName,
        preferredLanguage,
        birthMonth,
        birthYear,
        ageGroup,
        gender
      });

      console.log('Profile updated successfully:', updatedProfile);

      // Update profile state immediately
      set({ profile: updatedProfile });

      // Determine the gender to use for regeneration
      const genderForRegen = gender || updatedProfile.gender;

      // Regenerate preset songs only if the baby name changed and we have a gender
      if (trimmedNewName !== currentProfile?.babyName && genderForRegen) {
        console.log('Baby name changed, triggering preset song regeneration...');
        SongService.regeneratePresetSongs(user.id, trimmedNewName, genderForRegen)
          .catch(error => {
            console.error('Background preset song regeneration failed:', error);
            // Don't surface this error to the user since profile update succeeded
          });
      } else if (trimmedNewName !== currentProfile?.babyName && !genderForRegen) {
          console.warn('Baby name changed, but skipping preset song regeneration because gender is missing.');
      }

      return updatedProfile;
    } catch (error) {
      console.error('Profile update failed:', error);
      // Revert local state on error
      if (currentProfile) {
        set({ profile: currentProfile });
      }
      errorStore.setError(error instanceof Error ? error.message : 'Failed to update profile');
      throw error;
    }
  },
  signIn: async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        throw error;
      }
      
      if (!data.session) {
        throw new Error('No session returned after sign in');
      }
      
      // Get the user data immediately after sign in
      set({ user: data.user });
      
      // Load the profile
      await get().loadProfile(); 
    } finally {
    }
  },
  signUp: async (email: string, password: string, babyName: string, gender: string) => {
    set({ initialized: false });
    
    if (!email.trim() || !password.trim() || !babyName.trim() || !gender) {
      throw new Error('All fields are required');
    }

    try {
      console.log('Starting signup process...');
      
      // Verify Supabase client is configured
      if (!supabase) {
        console.error('Supabase client not initialized');
        throw new Error('Authentication service configuration error. Please try again later.');
      }
      
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password
      });

      if (signUpError) {
        console.error('Supabase signup error:', signUpError);
        throw signUpError;
      }
      
      if (!data.user) {
        console.error('No user returned after sign up');
        throw new Error('Authentication failed: No user data received after sign up.');
      }
      
      console.log('Auth user created successfully, creating profile...');
      
      const user = data.user;
      set({ user });

      const trimmedBabyName = babyName.trim();
      const userId = user.id;
      const userEmail = user.email!;

      try {
        const { error: insertError } = await supabase
          .from('profiles')
          .insert([{ 
            id: userId,
            baby_name: trimmedBabyName,
            email: userEmail,
            gender: gender,
            preferred_language: DEFAULT_LANGUAGE,
            created_at: new Date().toISOString()
          }]);
          
        if (insertError) {
          console.error('Error creating profile entry:', insertError);
          throw new Error('Failed to create user profile after authentication.');
        }

        console.log('Profile created successfully for user:', userId);

      } catch (profileError) {
        console.error('Exception during profile creation:', profileError);
        throw profileError;
      }

      SongService.regeneratePresetSongs(userId, trimmedBabyName, gender, true)
        .then(() => {
            console.log(`Preset song regeneration initiated for user ${userId}`);
        })
        .catch((error) => {
          console.error(`Error initiating preset song regeneration for user ${userId}:`, error);
        });

      await get().loadProfile();

      set({ initialized: true });

    } catch (error) {
      set({ user: null, initialized: true }); 
      console.error("Signup failed:", error);
      throw error; 
    }
  },
  signOut: async () => {
    set({ initialized: false });
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }
  
      // Clear all state
      set({ 
        user: null, 
        profile: null,
        initialized: true
      });
  
      // Clear other stores
      useSongStore.setState({
        songs: [],
        processingTaskIds: new Set<string>()     
      }, true);
  
      useErrorStore.getState().clearError();
  
    } catch (error) {
      // Force clear state even if sign out fails
      set({ 
        user: null, 
        profile: null,
        initialized: true
      });
      throw error;
    }
  },
  loadUser: async () => {
    try {
      // First try to get an existing session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      set({ initialized: false });
      
      if (sessionError) {
        await supabase.auth.signOut();
        set({ user: null, profile: null, initialized: true });
        return;
      }
      
      if (!session) {
        set({ user: null, profile: null, initialized: true });
        return;
      }
      
      const user = session.user;
      set({ user });
      
      if (user) {
        await get().loadProfile();
      }
      set({ initialized: true });
      
      // Set up auth state change listener
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
        
        if (event === 'SIGNED_OUT') {
          set({ user: null, profile: null });
          return;
        }

        if (!session) {
          set({ user: null, profile: null });
          return;
        }

        const newUser = session.user;
        set({ user: newUser });

        if (newUser) {
          try {
            await get().loadProfile();
          } catch {
            // If profile load fails, sign out and reset state
            await supabase.auth.signOut();
            set({ user: null, profile: null });
          }
        }
      });
      
      return () => subscription.unsubscribe();

    } catch {
      await supabase.auth.signOut();
      set({ 
        user: null, 
        profile: null,
        initialized: true
      });
    }
  }
}));