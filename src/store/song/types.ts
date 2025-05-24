// @breadcrumbs
// - src/store/song/types.ts: Types for song store state and actions
// - Parent: src/store/songStore.ts
// - Related: src/types/index.ts (base types)

import type { Song, MusicMood, ThemeType, PresetType, Tempo, VoiceType } from '../../types';

export type StateUpdater = (state: SongState) => Partial<SongState>;

/**
 * Interface for song data received from Supabase realtime subscriptions
 * Matches the database schema of the songs table
 */
export interface SongPayload {
  id: string;
  created_at?: string;
  name: string;
  song_type: string;
  error?: string | null;
  audio_url?: string | null;
  task_id?: string | null;
  user_id: string;
  retryable?: boolean;
  is_instrumental?: boolean;
  theme?: string | null;
  user_lyric_input?: string | null;
  generated_lyrics?: string | null;
  tempo?: string | null;
  preset_type?: string | null;
  mood?: string | null;
  instrument?: string | null;
  voice_type?: string | null;
  lyrics?: string | null;
  is_favorite?: boolean;
}

/**
 * Interface for variation data received from Supabase realtime subscriptions
 * Matches the database schema of the song_variations table
 */
export interface VariationPayload {
  id: string;
  song_id: string;
  created_at?: string;
  audio_url?: string | null;
  metadata?: Record<string, any> | null;
  retryable?: boolean;
  title?: string | null;
}

/**
 * Type to represent batch updates to the song state
 * This ensures that multiple related state updates happen atomically
 */
export interface BatchUpdate {
  songs?: Song[];
  updateSong?: { id: string; updatedSong: Song };
  addSong?: Song;
  removeSongId?: string;
  taskIdsToAddToProcessing?: string[];
  taskIdsToRemoveFromProcessing?: string[];
  songIdsToAddToRetrying?: string[];
  songIdsToRemoveFromRetrying?: string[];
  error?: string | null;
}

export interface SongState {
  // State
  songs: Song[];
  isLoading: boolean;
  retryingSongs: Set<string>;
  processingTaskIds: Set<string>;
  queuedTaskIds: Set<string>; // Tasks that are in the queue (have task_id, no audio_url, no error)
  isDeleting: boolean;
  error: string | null;
  isResetting: boolean; // Flag to indicate store is being reset (prevents subscription race conditions)

  // Actions
  setState: (updater: Partial<SongState>) => void;
  batchUpdate: (updates: BatchUpdate) => void;
  setRetrying: (songId: string, isRetrying: boolean) => void;
  loadSongs: () => Promise<void>;
  createSong: (params: CreateSongParams) => Promise<Song>;
  deleteAllSongs: () => Promise<void>;
  setupSubscription: (userId: string) => (() => void) | undefined;
  resetGeneratingState: () => Promise<void>;
  notifyPresetSongsRegenerating: () => void; // Method to remove preset songs from the store immediately
  resetStore: () => void; // Method to reset all store state to initial values
}

export interface CreateSongParams {
  name: string;
  // For themed songs (songType === 'theme' | 'theme-with-input'):
  // - mood and tempo are optional as they are determined by the API based on the theme
  // For custom songs (songType === 'from-scratch'):
  // - mood and tempo are required to specify the exact characteristics
  mood?: MusicMood;
  theme?: ThemeType;
  userInput?: string; // User's input text to help generate lyrics
  tempo?: Tempo;
  isInstrumental?: boolean;
  voice?: VoiceType;
  songType: 'preset' | 'theme' | 'theme-with-input' | 'from-scratch';
  preset_type?: PresetType; // Type of preset song when songType is 'preset'
  lyrics?: string; // The lyrics to use for the song
  gender?: string; // Baby's gender for personalized lyrics
  ageGroup?: string; // Baby's age group for generation customization
} 