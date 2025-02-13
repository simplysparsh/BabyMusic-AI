import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { Song, MusicMood, Instrument, UserProfile, User, PresetType, Language } from '../types';
import { SongService } from '../services/songService';
import { PresetService } from '../services/presetService';
import { ProfileService } from '../services/profileService';

interface AppState {
  // Core state
  user: User | null;
  profile: UserProfile | null;
  songs: Song[];
  
  // UI state
  isLoading: boolean;
  error: string | null;
  generatingSongs: Set<string>;
  presetSongTypes: Set<PresetType>;
  
  // Actions
  setState: (updater: (state: AppState) => Partial<AppState>) => void;
  clearError: () => void;
  
  // Auth
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, babyName: string) => Promise<void>;
  signOut: () => Promise<void>;
  loadUser: () => Promise<void>;
  
  // Songs
  createSong: (params: {
    name: string;
    mood: MusicMood;
    instrument?: Instrument;
    lyrics?: string;
  }) => Promise<void>;
  deleteAllSongs: () => Promise<void>;
  
  // Profile
  updateProfile: (params: { 
    babyName: string;
    preferredLanguage?: Language;
  }) => Promise<void>;
}

export const useAppStore = create<AppState>((set, get) => ({
  // Initial state
  user: null,
  profile: null,
  songs: [],
  isLoading: false,
  error: null,
  generatingSongs: new Set(),
  presetSongTypes: new Set(),

  // State helpers
  setState: (updater) => set(updater),
  clearError: () => set({ error: null }),

  // Auth actions
  signIn: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      
      const profile = await ProfileService.loadProfile(data.user.id);
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

  signUp: async (email, password, babyName) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: { babyName }
        }
      });
      if (error) throw error;

      const profile = await ProfileService.createProfile({
        userId: data.user!.id,
        email,
        babyName
      });

      // Generate initial preset songs
      await PresetService.regenerateAllPresets({
        userId: data.user!.id,
        babyName
      });

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
      generatingSongs: new Set(),
      presetSongTypes: new Set()
    });
  },

  loadUser: async () => {
    set({ isLoading: true });
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        set({ user: null, profile: null, songs: [] });
        return;
      }

      const profile = await ProfileService.loadProfile(session.user.id);
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
  createSong: async ({ name, mood, instrument, lyrics }) => {
    const { user, profile } = get();
    if (!user || !profile) throw new Error('Must be signed in');

    set({ error: null });

    // Track generating state
    const presetType = name.toLowerCase().includes('playtime') ? 'playing'
      : name.toLowerCase().includes('mealtime') ? 'eating'
      : name.toLowerCase().includes('bedtime') ? 'sleeping'
      : name.toLowerCase().includes('potty') ? 'pooping'
      : null;

    if (presetType) {
      set(state => ({
        presetSongTypes: new Set([...state.presetSongTypes, presetType])
      }));
    }

    try {
      const song = await SongService.createSong({
        userId: user.id,
        name,
        mood,
        instrument,
        lyrics,
        language: profile.preferredLanguage
      });

      set(state => ({
        songs: [song, ...state.songs],
        generatingSongs: new Set([...state.generatingSongs, song.id])
      }));
    } catch (error) {
      // Clear generating states on error
      if (presetType) {
        set(state => ({
          presetSongTypes: new Set([...state.presetSongTypes].filter(t => t !== presetType))
        }));
      }
      set({ error: error instanceof Error ? error.message : 'Failed to create song' });
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
  updateProfile: async ({ babyName, preferredLanguage }) => {
    const { user, profile } = get();
    if (!user) throw new Error('Must be signed in');

    try {
      const updatedProfile = await ProfileService.updateProfile({
        userId: user.id,
        babyName,
        preferredLanguage,
        oldBabyName: profile?.babyName
      });

      set({ profile: updatedProfile });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to update profile' });
    }
  }
}));