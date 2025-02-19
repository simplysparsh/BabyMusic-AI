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
  initialized: boolean;
  updateProfile: (updates: { 
    babyName: string; 
    preferredLanguage?: Language;
    birthMonth?: number;
    birthYear?: number;
    ageGroup?: AgeGroup;
  }) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, babyName: string) => Promise<void>;
  signOut: () => Promise<void>;
  loadUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  profile: null,
  initialized: false,
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
          preferredLanguage: profile.preferred_language || 'English'
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
  
  updateProfile: async ({ babyName: newBabyName, preferredLanguage, birthMonth, birthYear, ageGroup }) => {
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
        preferredLanguage,
        birthMonth,
        birthYear,
        ageGroup
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

    const { data, error } = await supabase.auth.signUp({
      email: email.trim().toLowerCase(),
      password,
      options: {
        data: {
          babyName: babyName.trim(),
          preferredLanguage: 'English'
        }
      }
    });

    if (error) {
      throw error;
    }
    
    if (!data.user) {
      throw new Error('No user returned after sign up');
    }
    
    // Set user state immediately
    set({ user: data.user });

    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Update profile with baby name
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ 
        baby_name: babyName,
        preset_songs_generated: false,
        preferred_language: 'English'
      })
      .eq('id', data.user.id);

    if (updateError) throw updateError;

    set({ 
      initialized: true,
      profile: {
        id: data.user.id,
        email: data.user.email || '',
        isPremium: false,
        dailyGenerations: 0,
        lastGenerationDate: new Date(),
        babyName: babyName.trim(),
        preferredLanguage: 'English'
      }
    });

    // Generate initial preset songs for new user
    await PresetService.regenerateAllPresets({
      userId: data.user.id,
      babyName: babyName.trim(),
      language: 'English'
    });
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
      useSongStore.getState().setState(state => ({
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
            // If profile load fails, sign out and reset state
            await supabase.auth.signOut();
            set({ user: null, profile: null });
          }
        }
      });
      
      return () => subscription.unsubscribe();

    } catch (error) {
      await supabase.auth.signOut();
      set({ 
        user: null, 
        profile: null,
        initialized: true
      });
    }
  }
}));