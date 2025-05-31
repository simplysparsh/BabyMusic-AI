import { create } from 'zustand';
import { supabase, clearSupabaseStorage } from '../lib/supabase';
import { useErrorStore } from './errorStore';
import { ProfileService } from '../services/profileService';
import { SongService } from '../services/songService';
import { type User } from '@supabase/supabase-js';
import { DEFAULT_LANGUAGE } from '../types';
import type { UserProfile, Language, AgeGroup } from '../types';
import type { PresetType as _PresetType } from '../types';
import { PRESET_CONFIGS as _PRESET_CONFIGS } from '../data/lyrics';

export enum SignupMethod {
  Email = 'email',
  OAuth = 'oauth',
  None = 'none'
}

interface AuthState {
  user: User | null;
  profile: UserProfile | null;
  initialized: boolean;
  isLoading: boolean;
  error: string | null;
  
  loadProfile: () => Promise<void>;
  
  updateProfile: (updates: { 
    babyName: string; 
    preferredLanguage?: Language;
    birthMonth?: number;
    birthYear?: number;
    ageGroup?: AgeGroup;
    gender?: string;
  }) => Promise<UserProfile>;
  
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, babyName: string, gender: string) => Promise<void>;
  signOut: () => Promise<void>;
  loadUser: () => Promise<void | (() => void)>;
  incrementPlayCount: () => Promise<void>;
  clearOnboardingInProgress: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  profile: null,
  initialized: false,
  isLoading: false,
  error: null,
  
  loadProfile: async () => {
    const user = get().user;
    console.log('[AuthStore] loadProfile: Called. User from store:', user ? { id: user.id, email: user.email } : null);
    if (!user) return;

    set({ isLoading: true });

    try {
      const MAX_RETRIES = 3;
      const RETRY_DELAY = 2000;
      let retryCount = 0;
      
      while (retryCount < MAX_RETRIES) {
        try {
          if (retryCount > 0) {
            await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * retryCount));
          }

          console.log('[AuthStore] loadProfile: Attempting to fetch profile for user ID:', user.id);
          const { data: profileData, error } = await supabase
            .from('profiles')
            .select(`
              id,
              email,
              is_premium,
              generation_count,
              monthly_plays_count,
              play_count_reset_at,
              daily_generations,
              last_generation_date,
              baby_name,
              preferred_language,
              created_at,
              gender,
              birth_month,
              birth_year,
              age_group,
              timezone
            `)
            .eq('id', user.id)
            .maybeSingle();
          
          if (error) {
            throw error;
          }

          if (profileData) {
            const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
            
            if (profileData.timezone !== userTimeZone) {
               console.log(`Detected timezone change: DB='${profileData.timezone}', Local='${userTimeZone}'. Updating profile timezone.`);
               try {
                   const { data: updatedData, error: updateError } = await supabase
                     .from('profiles')
                     .update({ timezone: userTimeZone })
                     .eq('id', user.id)
                     .select('timezone')
                     .single();

                   if (updateError) {
                     console.error('Failed to update timezone in DB:', updateError);
                   } else if (updatedData && updatedData.timezone) { 
                     console.log('Timezone updated successfully in DB.');
                     profileData.timezone = updatedData.timezone;
                   } else {
                      console.warn('Timezone update call succeeded but did not return updated data. Using detected local timezone for session.');
                      profileData.timezone = userTimeZone;
                   }
               } catch (tzUpdateErr) {
                   console.error('Error during timezone update attempt:', tzUpdateErr);
               }
            }

            const userProfile: UserProfile = {
              id: profileData.id,
              email: profileData.email,
              isPremium: profileData.is_premium ?? false,
              generationCount: profileData.generation_count ?? 0,
              monthlyPlaysCount: profileData.monthly_plays_count ?? 0,
              playCountResetAt: profileData.play_count_reset_at ?? null,
              dailyGenerations: profileData.daily_generations ?? 0,
              lastGenerationDate: profileData.last_generation_date ?? null,
              babyName: profileData.baby_name ?? '',
              preferredLanguage: profileData.preferred_language || DEFAULT_LANGUAGE,
              gender: profileData.gender,
              birthMonth: profileData.birth_month,
              birthYear: profileData.birth_year,
              ageGroup: profileData.age_group,
              timezone: profileData.timezone
            };
          
            set({ profile: userProfile });
            set({ error: null });
            return;
          } else {
            // No profile exists yet. Skip throwing and create one below.
            throw { code: 'PGRST116', message: '0 rows', details: 'No profile row' } as any;
          }
        } catch (err) {
          // Check if this is a "no profile" error, which we want to handle specially
          const isNoProfileError =
            // Supabase/PostgREST specific code for missing row
            (typeof err === 'object' && err !== null && 'code' in err && (err as any).code === 'PGRST116') ||
            // Fallback for generic Error instances that mention zero-row result
            (err instanceof Error && err.message.toLowerCase().includes('0 rows')) ||
            // Supabase error objects also expose a `details` field with this wording
            (typeof err === 'object' && err !== null && 'details' in err && typeof (err as any).details === 'string' && (err as any).details.toLowerCase().includes('0 rows'));

          if (isNoProfileError) {
            // Handle the profile creation directly here instead of relying on retry
            console.log('Profile not found error caught in catch block, creating profile now');
            
            // Create a minimal profile to start onboarding
            const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
            const profileDataToInsert = {
              id: user.id,
              email: user.email!,
              preferred_language: DEFAULT_LANGUAGE,
              created_at: new Date().toISOString(),
              timezone: userTimeZone,
            };
            
            try {
              // Use upsert so we don't fail if a minimal profile row has already been created by the auth listener
              const { error: upsertError } = await supabase
                .from('profiles')
                .upsert([profileDataToInsert], { onConflict: 'id', ignoreDuplicates: false });

              if (upsertError) {
                console.error('Error creating/updating profile entry:', upsertError);
                throw new Error('Failed to create or update user profile after authentication.');
              }
              
              // Create a minimal profile object and mark for onboarding only for OAuth
              const userProfile: UserProfile = {
                id: user.id,
                email: user.email!,
                isPremium: false,
                generationCount: 0,
                monthlyPlaysCount: 0,
                playCountResetAt: null,
                dailyGenerations: 0,
                lastGenerationDate: null,
                babyName: '',
                preferredLanguage: DEFAULT_LANGUAGE,
                gender: undefined,
                birthMonth: undefined,
                birthYear: undefined,
                ageGroup: undefined,
                timezone: userTimeZone
              };
              set({ profile: userProfile });
              console.log('Created minimal profile for OAuth onboarding.');
              return;
            } catch (profileCreateErr) {
              console.error('Error in profile creation:', profileCreateErr);
              // Let it fall through to normal retry logic
            }
          }
          
          // For other errors, do normal retry logic
          retryCount++;
          console.error(`Error loading profile (attempt ${retryCount}/${MAX_RETRIES}):`, err);

          if (retryCount === MAX_RETRIES) {
            console.error('Max retries reached for loading profile. Signing out.');
            await supabase.auth.signOut();
            set({ user: null, profile: null, initialized: true, error: err instanceof Error ? err.message : 'Failed to load profile.' });
            return;
          }
        }
      }
    } finally {
      if (get().user) {
        set({ isLoading: false });
      }
    }
  },
  
  updateProfile: async (updates) => {
    const user = get().user;
    if (!user) throw new Error('Not authenticated');
    const errorStore = useErrorStore.getState();
    // const currentProfile = get().profile; // Keep this if needed for other logic, but not for song regen here

    console.log('Starting profile update with data:', updates);

    errorStore.clearError();

    if (!updates.babyName || !updates.babyName.trim()) {
      // This validation is for the babyName itself, not for triggering song regen.
      // It should remain if babyName is always required for any updateProfile call.
      // If babyName can be optional for some updates, this might need adjustment.
      // For now, assuming it's a general requirement for this function.
      throw new Error('Baby name is required'); 
    }

    try {
      const updatedProfileData = await ProfileService.updateProfile({
        userId: user.id,
        ...updates,
        babyName: updates.babyName.trim(),
      });

      console.log('Profile updated successfully:', updatedProfileData);

      set({ profile: updatedProfileData });

      return updatedProfileData;
    } catch (error) {
      console.error('Error updating profile:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to update profile.';
      errorStore.setError(errorMessage);
      set({ error: errorMessage });
      throw error;
    }
  },
  signIn: async (email, password) => {
    set({ isLoading: true, initialized: false, error: null });
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      set({ user: data.user });
      await get().loadProfile(); 
    } catch (error: any) {
      console.error("Sign-in error:", error);
      const message = error.message || 'An unknown sign-in error occurred.';
      set({ user: null, profile: null, error: message });
      throw error;
    } finally {
      set({ isLoading: false, initialized: true });
    }
  },
  signUp: async (email: string, password: string, babyName: string, gender: string) => {
    set({ isLoading: true, initialized: false, error: null });
    if (!email.trim() || !password.trim() || !babyName.trim() || !gender) {
      const missingFieldsError = new Error('All fields (email, password, baby name, gender) are required for sign up.');
      set({ error: missingFieldsError.message });
      throw missingFieldsError;
    }
    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
      });
      if (signUpError) throw signUpError;
      if (!data.user) throw new Error('Authentication failed: No user data received after sign up.');
      set({ user: data.user });
      const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const profileDataToInsert = {
        id: data.user.id,
        baby_name: babyName.trim(),
        email: data.user.email!,
        gender: gender,
        preferred_language: DEFAULT_LANGUAGE,
        created_at: new Date().toISOString(),
        timezone: userTimeZone,
      };
      const { error: upsertError } = await supabase
        .from('profiles')
        .upsert([profileDataToInsert], { onConflict: 'id', ignoreDuplicates: false });
      if (upsertError) {
        console.error('Error creating/updating profile entry:', upsertError);
        throw new Error('Failed to create or update user profile after authentication.');
      }
      await get().loadProfile(); 
      // Fire-and-forget: generate preset songs in the background
      SongService.regeneratePresetSongs(data.user.id, babyName.trim(), gender, true);
    } catch (error: any) {
      console.error("Signup failed:", error);
      const message = error.message || 'An unknown sign-up error occurred.';
      set({ user: null, profile: null, error: message });
      throw error; 
    } finally {
      set({ isLoading: false, initialized: true });
    }
  },
  signOut: async () => {
    set({ isLoading: true });
    try {
      await supabase.auth.signOut();
      clearSupabaseStorage();
      
      // Reset song store to prevent stale data issues
      const { useSongStore } = await import('./songStore');
      useSongStore.getState().resetStore();
      
      set({ user: null, profile: null, initialized: false, error: null });
    } catch (error: any) {
      console.error("Sign-out error:", error);
      const message = error.message || 'An unknown sign-out error occurred.';
      set({ error: message });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
  
  loadUser: async () => {
    console.log('[AuthStore] loadUser: Initializing user session...');
    set({ isLoading: true, error: null });
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        set({ user: session.user });
        await get().loadProfile();
      } else {
        set({ user: null, profile: null });
      }
    } catch (error: any) {
      console.error("Error loading user session:", error);
      const message = error.message || 'Failed to load session.';
      set({ user: null, profile: null, error: message });
    } finally {
      set({ isLoading: false, initialized: true });
    }
      
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log(`[AuthStore] onAuthStateChange: event='${event}', session exists=`, !!session);
      set({ isLoading: true, error: null });
      
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED') {
        if (session?.user) {
          const currentUser = get().user;
          const currentProfile = get().profile;
          
          // If we already have the same user and profile loaded, skip expensive reload operations
          // This prevents corruption during automatic token refreshes on tab visibility changes
          if (currentUser && currentProfile && 
              currentUser.id === session.user.id && 
              event === 'SIGNED_IN' && 
              session.user.app_metadata?.provider === 'email') {
            console.log('[AuthStore] onAuthStateChange: Skipping reload - same user already loaded (likely automatic token refresh)');
            set({ user: session.user }); // Update user object but skip profile reload
          } else {
            // Log the authentication provider for debugging
            console.log(`[AuthStore] onAuthStateChange: User signed in via ${session.user.app_metadata?.provider || 'unknown'}`);
            
            set({ user: session.user });
            // loadProfile will detect if this is a new OAuth user and create a profile
            await get().loadProfile();
          }
        } else {
          console.warn('[AuthStore] onAuthStateChange: Signed in event but no session user.');
          set({ user: null, profile: null });
        }
      } else if (event === 'SIGNED_OUT') {
        // Reset song store to prevent stale data issues
        const { useSongStore } = await import('./songStore');
        useSongStore.getState().resetStore();
        
        set({ user: null, profile: null, error: null });
      }
      set({ isLoading: false, initialized: true });
    });

    return () => {
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  },

  incrementPlayCount: async () => {
    try {
      await supabase.functions.invoke('increment-play-count');
    } catch (error) {
      console.error('Failed to increment play count:', error);
    }
  },

  clearOnboardingInProgress: () => {
    localStorage.removeItem('onboardingInProgress');
  }
}));