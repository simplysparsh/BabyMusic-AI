import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { useSongStore } from './songStore';
import { useErrorStore } from './errorStore';
import { PresetService } from '../services/presetService';
import { ProfileService } from '../services/profileService';
import { type User } from '@supabase/supabase-js';
import type { UserProfile } from '../types';

interface AuthState {
  user: User | null;
  profile: UserProfile | null;
  isLoading: boolean;
  updateProfile: (updates: { babyName: string; preferredLanguage?: Language }) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, babyName: string) => Promise<void>;
  signOut: () => Promise<void>;
  loadUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  profile: null,
  isLoading: true,
  loadProfile: async () => {
    const user = get().user;
    if (!user) return;

    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !session) {
      console.log('No valid session found, clearing state');
      await supabase.auth.signOut();
      set({ user: null, profile: null });
      return;
    }

    const MAX_RETRIES = 3;
    const RETRY_DELAY = 2000;
    let retryCount = 0;
    
    console.log('Loading profile for user:', user.id);

    while (retryCount < MAX_RETRIES) {
      try {
        // Add a small delay before retries (but not on first attempt)
        if (retryCount > 0) {
          console.log(`Retrying profile load (attempt ${retryCount + 1}/${MAX_RETRIES})...`);
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
      
      console.log('Profile data received:', profile);
      
      if (error) {
        console.error('Error loading profile:', error);
        // If the profile doesn't exist, force logout
        if (error.code === 'PGRST116' || error.message.includes('contains 0 rows')) {
          console.log('Profile not found, signing out');
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
          preferredLanguage: profile.preferred_language || 'English'
        };
      
        console.log('Successfully loaded profile:', {
          id: userProfile.id,
          email: userProfile.email,
          babyName: userProfile.babyName
        });

        set({ profile: userProfile });
        return;
      } else {
        throw new Error('No profile data received');
      }
      } catch (err) {
        console.error(`Profile load attempt ${retryCount + 1} failed:`, err);
        retryCount++;

        if (retryCount === MAX_RETRIES) {
          console.error('All profile load attempts exhausted');
          set({ 
            isLoading: false 
          });
          throw err;
        }
      }
    }
  },
  
  updateProfile: async ({ babyName: newBabyName, preferredLanguage }) => {
    const user = get().user;
    if (!user) throw new Error('Not authenticated');
    const songStore = useSongStore.getState();
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

      // Update local state first for immediate feedback
      set(state => ({
        profile: state.profile ? {
          ...state.profile,
          babyName: trimmedNewName
        } : null
      }));
      
      // Set all preset types as generating
      songStore.setState(state => ({
        presetSongTypes: new Set(['playing', 'eating', 'sleeping', 'pooping'])
      }));

      const updatedProfile = await ProfileService.updateProfile({
        userId: user.id,
        babyName: trimmedNewName,
        preferredLanguage
      });

      // Update profile state with server response
      set({ profile: updatedProfile });

      return updatedProfile;
    } catch (error) {
      console.error('Profile update failed:', error);
      // Revert local state on error
      if (currentProfile) {
        set({ profile: currentProfile });
        // Clear preset types on error
        songStore.setState(state => ({
          presetSongTypes: new Set()
        }));
      }
      errorStore.setError(error instanceof Error ? error.message : 'Failed to update profile');
      throw error;
    }
  },
  signIn: async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    if (error) throw error;
    
    // Get the user data immediately after sign in
    const { data: { user } } = await supabase.auth.getUser();
    set({ user });
    
    // Load the profile
    await get().loadProfile();
  },
  signUp: async (email: string, password: string, babyName: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          babyName: babyName.trim(),
          preferredLanguage: 'English'
        }
      }
    });
    if (error) throw error;
    
    // Load user data after successful sign up
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Failed to create user');

    // Wait a moment for the trigger to create the profile
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Update profile with baby name
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ 
        baby_name: babyName,
        preset_songs_generated: false,
        preferred_language: 'English'
      })
      .eq('id', user.id);

    if (updateError) throw updateError;

    // Load the updated profile
    await get().loadProfile();

    // Generate initial preset songs for new user
    console.log('Generating initial preset songs for new user');
    await PresetService.regenerateAllPresets({
      userId: user.id,
      babyName,
      language: 'English'
    });
    
    set({ user });
  },
  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    set({ user: null, profile: null });
  },
  loadUser: async () => {
    try {
      let retryCount = 0;
      const MAX_RETRIES = 3;
      const RETRY_DELAY = 1000;
      
      while (retryCount < MAX_RETRIES) {
        try {
          const { data: { session }, error: sessionError } = await supabase.auth.getSession();
          
          if (sessionError) throw sessionError;
          
          if (!session) {
            set({ user: null, profile: null, isLoading: false });
            return;
          }
          
          const user = session.user;
          set({ user });
          
          if (user) {
            await get().loadProfile();
          }
          
          // Set up auth state change listener
          const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (event === 'SIGNED_OUT' || event === 'USER_DELETED') {
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
              } catch (error) {
                console.error('Error loading profile on auth change:', error);
              }
            }
          });
          
          set({ isLoading: false });
          return () => subscription.unsubscribe();
        } catch (error) {
          console.error(`Auth attempt ${retryCount + 1} failed:`, error);
          retryCount++;

          if (retryCount === MAX_RETRIES) {
            throw error;
          }
          
          await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * retryCount));
        }
      }
    } catch (error) {
      console.error('Failed to load user after retries:', error);
      await supabase.auth.signOut();
      set({ 
        user: null, 
        profile: null,
        isLoading: false 
      });
    }
  }
}));