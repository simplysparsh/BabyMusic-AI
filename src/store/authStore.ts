import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { useSongStore } from './songStore';
import { useErrorStore } from './errorStore';
import { ProfileService } from '../services/profileService';
import { SongService } from '../services/songService';
import { type User } from '@supabase/supabase-js';
import { DEFAULT_LANGUAGE } from '../types';
import type { UserProfile, Language, AgeGroup, PresetType } from '../types';
import { PRESET_CONFIGS } from '../data/lyrics';

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
  signUp: (email: string, password: string, babyName: string) => Promise<void>;
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
          created_at
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
          preferredLanguage: profile.preferred_language || DEFAULT_LANGUAGE
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

    errorStore.clearError();

    if (!newBabyName) {
      throw new Error('Baby name is required');
    }

    try {
      const trimmedNewName = newBabyName.trim();
      if (!trimmedNewName) {
        throw new Error('Baby name is required');
      }

      const updatedProfile = await ProfileService.updateProfile({
        userId: user.id,
        babyName: trimmedNewName,
        preferredLanguage,
        birthMonth,
        birthYear,
        ageGroup,
        gender
      });

      // Update profile state immediately
      set({ profile: updatedProfile });

      // Start preset song regeneration in the background
      SongService.regeneratePresetSongs(user.id, trimmedNewName)
        .catch(error => {
          console.error('Background preset song regeneration failed:', error);
          // Don't surface this error to the user since profile update succeeded
        });

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
    set({ initialized: false });
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
      set({ initialized: true });
    } finally {
      set({ initialized: true });
    }
  },
  signUp: async (email: string, password: string, babyName: string) => {
    set({ initialized: false });
    
    if (!email.trim() || !password.trim() || !babyName.trim()) {
      throw new Error('All fields are required');
    }

    try {
      console.log('Starting signup process...');
      
      // Verify Supabase client has API key
      if (!supabase.supabaseKey) {
        console.error('Supabase client missing API key');
        throw new Error('Authentication service configuration error. Please try again later.');
      }
      
      const { data, error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: {
          data: {
            babyName: babyName.trim(),
            preferredLanguage: DEFAULT_LANGUAGE
          }
        }
      });

      if (error) {
        console.error('Supabase signup error:', error);
        throw error;
      }
      
      if (!data.user) {
        console.error('No user returned after sign up');
        throw new Error('No user returned after sign up');
      }
      
      console.log('User created successfully, setting up profile...');
      
      // Set user state immediately
      set({ user: data.user });

      // Check if profile already exists
      const { data: existingProfile, error: queryError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .maybeSingle();
        
      if (queryError) {
        // Log error but don't throw
        console.error('Error checking for existing profile:', queryError);
      }
      
      // If profile doesn't exist, create it
      if (!existingProfile) {
        const { error: insertError } = await supabase
          .from('profiles')
          .insert([{ 
            id: data.user.id,
            baby_name: babyName.trim(),
            email: email.trim().toLowerCase(),
            created_at: new Date().toISOString(),
            preset_songs_generated: true,
            preferred_language: DEFAULT_LANGUAGE,
            gender: null // Set default gender to null, user will provide during onboarding
          }]);
          
        if (insertError) {
          // Log error but don't throw
          console.error('Error creating profile:', insertError);
        }
      } else {
        // If profile exists, update it
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ 
            baby_name: babyName.trim(),
            preset_songs_generated: true,
            preferred_language: DEFAULT_LANGUAGE
          })
          .eq('id', data.user.id);

        if (updateError) {
          // Log error but don't throw
          console.error('Error updating profile:', updateError);
        }
      }

      // Generate preset songs in the background
      const trimmedBabyName = babyName.trim();
      SongService.regeneratePresetSongs(data.user.id, trimmedBabyName, true)
        .catch((error) => {
          // Log error but don't show to user
          console.error('Error generating preset songs:', error);
        });

      set({ 
        initialized: true,
        profile: {
          id: data.user.id,
          email: data.user.email || '',
          isPremium: false,
          dailyGenerations: 0,
          lastGenerationDate: new Date(),
          babyName: babyName.trim(),
          preferredLanguage: DEFAULT_LANGUAGE,
          gender: null // Set default gender to null, user will provide during onboarding
        }
      });
    } catch (error) {
      set({ initialized: true });
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
      useSongStore.getState().setState(_state => ({
        songs: [],
        generatingSongs: new Set(),
        presetSongTypes: new Set(),
        processingTaskIds: new Set()
      }));
  
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