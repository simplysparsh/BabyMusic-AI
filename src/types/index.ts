export type MusicMood = 'calm' | 'playful' | 'learning' | 'energetic';
export type Instrument = 'piano' | 'harp' | 'strings' | 'whiteNoise';
export type VoiceType = 'softFemale' | 'calmMale' | 'gentleChorus';
export type AgeGroup = '0-6' | '6-12' | '12-24';
export type PresetType = 'playing' | 'eating' | 'sleeping' | 'pooping';

export interface Song {
  id: string;
  name: string;
  mood: MusicMood;
  instrument: Instrument;
  voice?: VoiceType;
  lyrics?: string;
  audioUrl?: string;
  createdAt: Date;
  userId: string;
  variations?: SongVariation[];
}

export interface SongVariation {
  id: string;
  songId: string;
  audio_url: string;
  title?: string;
  metadata?: {
    tags?: string;
    prompt?: string;
  };
  created_at: Date;
}

export interface UserProfile {
  id: string;
  email: string;
  isPremium: boolean;
  dailyGenerations: number;
  lastGenerationDate: Date;
  babyName: string;
}