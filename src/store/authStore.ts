import { create } from 'zustand';
import { supabase, supabaseWithRetry, stopTokenRefresh, clearSupabaseStorage } from '../lib/supabase';
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
  showPostSignupOnboarding: boolean;
  showPostOAuthOnboarding: boolean;
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
  hidePostSignupOnboarding: () => void;
  hidePostOAuthOnboarding: () => void;
  incrementPlayCount: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  profile: null,
  initialized: false,
  isLoading: false,
  showPostSignupOnboarding: false,
  showPostOAuthOnboarding: false,
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
            .single();
          
          if (error) {
            if (error.code === 'PGRST116' || error.message.includes('contains 0 rows')) {
              console.error('Profile not found for user, signing out.');
              await supabase.auth.signOut();
              set({ user: null, profile: null, initialized: true, showPostSignupOnboarding: false, showPostOAuthOnboarding: false });
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
            
            if (!userProfile.babyName || !userProfile.gender || !userProfile.birthMonth || !userProfile.birthYear) {
              console.log('Profile incomplete (missing babyName, gender, birthMonth, or birthYear), setting showPostOAuthOnboarding flag.');
              set({ showPostOAuthOnboarding: true });
            } else {
               if (get().showPostOAuthOnboarding) {
                  console.log('Profile complete, ensuring showPostOAuthOnboarding flag is false.');
                  set({ showPostOAuthOnboarding: false });
               }
            }
            if (get().showPostSignupOnboarding && !get().showPostOAuthOnboarding) {
              set({ showPostSignupOnboarding: false });
            }

            set({ error: null });
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
            set({ user: null, profile: null, initialized: true, showPostSignupOnboarding: false, showPostOAuthOnboarding: false }); 
            set({ error: err instanceof Error ? err.message : 'Failed to load profile.' });
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
    const currentProfile = get().profile;

    console.log('Starting profile update with data:', updates);

    errorStore.clearError();

    if (!updates.babyName || !updates.babyName.trim()) {
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

      if (get().showPostOAuthOnboarding && updatedProfileData.babyName && updatedProfileData.gender && updatedProfileData.birthMonth && updatedProfileData.birthYear) {
        set({ showPostOAuthOnboarding: false });
      }

      const genderForRegen = updates.gender || updatedProfileData.gender;

      if ((updates.babyName.trim() !== currentProfile?.babyName || (updates.gender && !currentProfile?.gender)) && genderForRegen) {
        console.log('Baby name or gender updated, triggering preset song regeneration...');
        
        const songStore = useSongStore.getState();
        songStore.notifyPresetSongsRegenerating();
        
        SongService.regeneratePresetSongs(user.id, updates.babyName.trim(), genderForRegen, true)
          .catch(error => {
            console.error('Background preset song regeneration failed:', error);
          });
      }
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

      const { error: insertError } = await supabase.from('profiles').insert([profileDataToInsert]);
      if (insertError) {
        console.error('Error creating profile entry:', insertError);
        throw new Error('Failed to create user profile after authentication.');
      }

      await get().loadProfile();

      SongService.regeneratePresetSongs(data.user.id, babyName.trim(), gender, true)
        .catch(err => console.error('Error regenerating presets on signup:', err));
      
      if (!get().profile?.birthMonth || !get().profile?.birthYear) {
          set({ showPostOAuthOnboarding: true });
      }

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
      stopTokenRefresh(); 
      clearSupabaseStorage();
      set({ user: null, profile: null, initialized: false, showPostSignupOnboarding: false, showPostOAuthOnboarding: false, error: null });
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
          set({ user: session.user });
          await get().loadProfile();
        } else {
          console.warn('[AuthStore] onAuthStateChange: Signed in event but no session user.');
          set({ user: null, profile: null });
        }
      } else if (event === 'SIGNED_OUT') {
        set({ user: null, profile: null, showPostSignupOnboarding: false, showPostOAuthOnboarding: false, error: null });
      }
      set({ isLoading: false, initialized: true });
    });

    return () => {
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  },

  hidePostSignupOnboarding: () => set({ showPostSignupOnboarding: false }),
  hidePostOAuthOnboarding: () => set({ showPostOAuthOnboarding: false }),

  incrementPlayCount: async () => {
    const user = get().user;
    const profile = get().profile;
    if (!user || !profile) return;

    try {
      const updatedPlays = (profile.monthlyPlaysCount || 0) + 1;
      set(state => ({ 
        profile: state.profile ? { ...state.profile, monthlyPlaysCount: updatedPlays } : null 
      }));
      
      await supabaseWithRetry.functions.invoke('increment-play-count');
    } catch (error) {
      console.error("Failed to increment play count in DB:", error);
      set(state => ({ 
        profile: state.profile ? { ...state.profile, monthlyPlaysCount: profile.monthlyPlaysCount } : null 
      }));
    }
  }
}));