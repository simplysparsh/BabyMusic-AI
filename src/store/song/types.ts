// @breadcrumbs
// - src/store/song/types.ts: Types for song store state and actions
// - Parent: src/store/songStore.ts
// - Related: src/types/index.ts (base types)

import type { Song, MusicMood, ThemeType, PresetType, Tempo } from '../../types';

export type StateUpdater = (state: SongState) => Partial<SongState>;

export interface SongState {
  // State
  songs: Song[];
  isLoading: boolean;
  generatingSongs: Set<string>;
  presetSongTypes: Set<PresetType>;
  processingTaskIds: Set<string>;
  stagedTaskIds: Set<string>;
  isDeleting: boolean;
  error: string | null;

  // Actions
  setState: (updater: StateUpdater) => void;
  clearGeneratingState: (songId: string) => void;
  loadSongs: () => Promise<void>;
  createSong: (params: CreateSongParams) => Promise<Song>;
  deleteAllSongs: () => Promise<void>;
  setupSubscription: () => void;
}

export interface CreateSongParams {
  name: string;
  mood: MusicMood;
  theme?: ThemeType;
  lyrics?: string;
  tempo?: Tempo;
  isInstrumental?: boolean;
  hasUserIdeas?: boolean;
} 