import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { Song, ThemeType, UserProfile, PresetType, Language } from '../types';
import type { User } from '@supabase/supabase-js';
import { SongService } from '../services/songService';
import { ProfileService } from '../services/profileService';

// Types
type StateUpdater = (state: AppState) => Partial<AppState>;
// We define AppStore type for documentation purposes, but it's not used directly in this file

interface AppState {
  // Core state
  user: User | null;
  profile: UserProfile | null;
  songs: Song[];
  
  // UI state
  isLoading: boolean;
  error: string | null;
  presetSongTypes: Set<PresetType>;
  
  // Actions
  setState: (updater: StateUpdater) => void;
  clearError: () => void;
  
  // Auth
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, babyName: string) => Promise<void>;
  signOut: () => Promise<void>;
  loadUser: () => Promise<void>;
  
  // Songs
  createSong: (params: {
    name: string;
    theme: ThemeType;
    lyrics?: string;
  }) => Promise<Song | null>;
  deleteAllSongs: () => Promise<void>;
  
  // Profile
  updateProfile: (params: { babyName: string; preferredLanguage?: Language }) => Promise<void>;
}

export const useAppStore = create<AppState>((
  set: (partial: Partial<AppState> | ((state: AppState) => Partial<AppState>)) => void,
  get: () => AppState
) => ({
  // Initial state
  user: null,
  profile: null,
  songs: [],
  isLoading: false,
  error: null,
  presetSongTypes: new Set<PresetType>(),

  // State helpers
  setState: (updater: StateUpdater) => set(updater),
  clearError: () => set({ error: null }),

  // Auth actions
  signIn: async (email: string, password: string) => {
    set({ isLoading: true });
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      
      const profile = await ProfileService.updateProfile({
        userId: data.user.id,
        babyName: ''
      });
      const songs = await SongService.loadUserSongs(data.user.id);
        
      set({ 
        user: data.user,
        profile,
        songs,
        error: null 
      });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Sign in failed' });
    } finally {
      set({ isLoading: false });
    }
  },

  signUp: async (email: string, password: string, babyName: string) => {
    set({ isLoading: true });
    try {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;

      const profile = await ProfileService.updateProfile({
        userId: data.user!.id,
        babyName
      });

      await SongService.regeneratePresetSongs(data.user!.id, babyName);

      set({ 
        user: data.user,
        profile,
        error: null 
      });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Sign up failed' });
    } finally {
      set({ isLoading: false });
    }
  },

  signOut: async () => {
    await supabase.auth.signOut();
    set({ 
      user: null, 
      profile: null, 
      songs: [],
      presetSongTypes: new Set()
    });
  },

  loadUser: async () => {
    set({ isLoading: true });
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        set({ user: null, profile: null });
        return;
      }

      const profile = await ProfileService.updateProfile({
        userId: session.user.id,
        babyName: ''
      });
      const songs = await SongService.loadUserSongs(session.user.id);

      set({ 
        user: session.user,
        profile,
        songs
      });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to load user' });
    } finally {
      set({ isLoading: false });
    }
  },

  // Song actions
  createSong: async ({ name, theme }) => {
    const { user, profile } = get();
    
    if (!user || !profile) {
      set({ error: 'You must be logged in to create a song' });
      return null;
    }

    try {
      const song = await SongService.createSong({
        userId: user.id,
        name,
        babyName: profile.babyName,
        songParams: {
          theme,
          songType: 'theme'
        }
      });

      set(state => ({
        songs: [song, ...state.songs]
      }));

      return song;
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to create song' });
      return null;
    }
  },

  deleteAllSongs: async () => {
    const { user } = get();
    if (!user) throw new Error('Must be signed in');

    try {
      await SongService.deleteUserSongs(user.id);
      set({ songs: [] });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to delete songs' });
    }
  },

  // Profile actions
  updateProfile: async (params: { babyName: string; preferredLanguage?: Language }) => {
    const { user } = get();
    
    if (!user) {
      set({ error: 'You must be logged in to update your profile' });
      return;
    }

    try {
      const updatedProfile = await ProfileService.updateProfile({
        userId: user.id,
        babyName: params.babyName,
        preferredLanguage: params.preferredLanguage
      });

      set({ profile: updatedProfile });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to update profile' });
    }
  }
}));