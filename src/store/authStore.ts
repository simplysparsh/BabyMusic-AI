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
import { StreakService } from '../services/streakService';

interface AuthState {
  user: User | null;
  profile: UserProfile | null;
  initialized: boolean;
  isLoading: boolean;
  showPostSignupOnboarding: boolean;
  
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
  hidePostSignupOnboarding: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  profile: null,
  initialized: false,
  isLoading: false,
  showPostSignupOnboarding: false,
  loadProfile: async () => {
    const user = get().user;
    if (!user) return;

    set({ isLoading: true });

    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session) {
        console.error('Session error or no session during profile load, signing out.');
        await supabase.auth.signOut();
        set({ user: null, profile: null, initialized: true, showPostSignupOnboarding: false }); 
        return;
      }

      const MAX_RETRIES = 3;
      const RETRY_DELAY = 2000;
      let retryCount = 0;
      
      while (retryCount < MAX_RETRIES) {
        try {
          if (retryCount > 0) {
            await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * retryCount));
          }

          if (retryCount > 0) {
            const { data: { session: refreshedSession } } = await supabase.auth.getSession();
            if (!refreshedSession) {
              console.error('Session expired during profile load retry loop, signing out.');
              await supabase.auth.signOut();
              set({ user: null, profile: null, initialized: true, showPostSignupOnboarding: false });
              return;
            }
          }

          const { data: profileData, error } = await supabase
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
              gender,
              birth_month,
              birth_year,
              age_group,
              timezone
            `)
            .eq('id', user.id)
            .single();
          
          if (error) {
            if (error.code === 'PGRST116' || error.message.includes('contains 0 rows')) {
              console.error('Profile not found for user, signing out.');
              await supabase.auth.signOut();
              set({ user: null, profile: null, initialized: true, showPostSignupOnboarding: false });
              return;
            }
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
              isPremium: profileData.is_premium,
              dailyGenerations: profileData.daily_generations,
              lastGenerationDate: profileData.last_generation_date,
              babyName: profileData.baby_name,
              preferredLanguage: profileData.preferred_language || DEFAULT_LANGUAGE,
              gender: profileData.gender,
              birthMonth: profileData.birth_month,
              birthYear: profileData.birth_year,
              ageGroup: profileData.age_group,
              timezone: profileData.timezone
            };
          
            set({ profile: userProfile });
            
            if (!userProfile.birthMonth || !userProfile.birthYear) {
              console.log('Profile incomplete (missing birth month/year), setting showPostSignupOnboarding flag.');
              set({ showPostSignupOnboarding: true });
            } else {
               if (get().showPostSignupOnboarding) {
                  console.log('Profile complete, ensuring showPostSignupOnboarding flag is false.');
                  set({ showPostSignupOnboarding: false });
               }
            }
            
            return;
          } else {
            throw new Error('No profile data received despite no error');
          }
        } catch (err) {
          retryCount++;
          console.error(`Error loading profile (attempt ${retryCount}/${MAX_RETRIES}):`, err);

          if (retryCount === MAX_RETRIES) {
            console.error('Max retries reached for loading profile. Signing out.');
            await supabase.auth.signOut();
            set({ user: null, profile: null, initialized: true, showPostSignupOnboarding: false }); 
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

      set({ profile: updatedProfile });

      const genderForRegen = gender || updatedProfile.gender;

      if (trimmedNewName !== currentProfile?.babyName && genderForRegen) {
        console.log('Baby name changed, triggering preset song regeneration...');
        
        /**
         * PRESET SONG REGENERATION STRATEGY:
         * 
         * 1. IMMEDIATELY REMOVE SONGS FROM STORE:
         *    Before starting the backend regeneration process, we first remove
         *    all preset songs from the UI state using notifyPresetSongsRegenerating.
         *    This creates an immediate visual effect where preset cards disappear briefly.
         * 
         * 2. THEN START BACKEND REGENERATION:
         *    The regeneratePresetSongs service method will:
         *    - Delete all preset songs from the database
         *    - Create new ones with the updated baby name
         *    - The subscription system will handle adding the new songs to the store
         * 
         * This two-step approach ensures a consistent UI experience during regeneration,
         * preventing cards from showing mixed states or stale data.
         */
        
        // Clear out preset songs from the store immediately using the store's method
        const songStore = useSongStore.getState();
        songStore.notifyPresetSongsRegenerating();
        
        // Now start the actual backend regeneration process
        SongService.regeneratePresetSongs(user.id, trimmedNewName, genderForRegen)
          .catch(error => {
            console.error('Background preset song regeneration failed:', error);
          });
      } else if (trimmedNewName !== currentProfile?.babyName && !genderForRegen) {
          console.warn('Baby name changed, but skipping preset song regeneration because gender is missing.');
      }

      return updatedProfile;
    } catch (error) {
      console.error('Profile update failed:', error);
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
      
      set({ user: data.user });
      
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
      const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

      try {
        const { error: insertError } = await supabase
          .from('profiles')
          .insert([{ 
            id: userId,
            baby_name: trimmedBabyName,
            email: userEmail,
            gender: gender,
            preferred_language: DEFAULT_LANGUAGE,
            created_at: new Date().toISOString(),
            timezone: userTimeZone
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
  
      set({ 
        user: null, 
        profile: null,
        initialized: true,
        showPostSignupOnboarding: false
      });
  
      useSongStore.setState({
        songs: [],
        processingTaskIds: new Set<string>()     
      }, true);
  
      useErrorStore.getState().clearError();
  
    } catch (error) {
      set({ 
        user: null, 
        profile: null,
        initialized: true,
        showPostSignupOnboarding: false
      });
      throw error;
    }
  },
  loadUser: async () => {
    try {
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
        StreakService.updateStreak(user.id);
      }
      set({ initialized: true });
      
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
            StreakService.updateStreak(newUser.id);
          } catch {
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
        initialized: true,
        showPostSignupOnboarding: false
      });
    }
  },
  hidePostSignupOnboarding: () => {
    set({ showPostSignupOnboarding: false });
  }
}));