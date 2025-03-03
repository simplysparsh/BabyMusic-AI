// @breadcrumbs
// - src/store/song/types.ts: Types for song store state and actions
// - Parent: src/store/songStore.ts
// - Related: src/types/index.ts (base types)

import type { Song, MusicMood, ThemeType, PresetType, Tempo, VoiceType } from '../../types';

export type StateUpdater = (state: SongState) => Partial<SongState>;

export interface SongState {
  // State
  songs: Song[];
  isLoading: boolean;
  generatingSongs: Set<string>;
  retryingSongs: Set<string>;
  processingTaskIds: Set<string>;
  stagedTaskIds: Set<string>;
  isDeleting: boolean;
  error: string | null;

  // Actions
  setState: (updater: StateUpdater) => void;
  clearGeneratingState: (songId: string) => void;
  setRetrying: (songId: string, isRetrying: boolean) => void;
  loadSongs: () => Promise<void>;
  createSong: (params: CreateSongParams) => Promise<Song>;
  deleteAllSongs: () => Promise<void>;
  setupSubscription: () => void;
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
} 