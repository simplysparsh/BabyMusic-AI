export type MusicMood = 'calm' | 'playful' | 'learning' | 'energetic';
export type VoiceType = 'softFemale' | 'calmMale';
export type ThemeType = 
  | 'pitchDevelopment' 
  | 'cognitiveSpeech' 
  | 'sleepRegulation'
  | 'socialEngagement' 
  | 'indianClassical' 
  | 'westernClassical';

export type Tempo = 'slow' | 'medium' | 'fast';

export type AgeGroup = '0-6' | '7-12' | '13-24';
export type PresetType = 'playing' | 'eating' | 'sleeping' | 'pooping';
export type Language = 'en' | 'hi';

// Default language for the application - single source of truth
export const DEFAULT_LANGUAGE: Language = 'en';

export interface MusicGenerationParams {
  theme?: ThemeType;
  mood?: MusicMood;
  lyrics?: string;
  name?: string;
  gender?: string;
  ageGroup?: AgeGroup;
  tempo?: Tempo;
  isInstrumental?: boolean;
  songType: 'preset' | 'theme' | 'theme-with-input' | 'from-scratch';
  voice?: VoiceType;
  preset_type?: PresetType;
  userInput?: string;
}

export interface Song {
  id: string;
  name: string;
  mood?: MusicMood;
  theme?: ThemeType;
  voice?: VoiceType;
  lyrics?: string;
  audio_url?: string;  // Using snake_case to match database convention
  createdAt: Date;
  userId: string;
  retryable?: boolean;
  variations?: SongVariation[];
  error?: string;
  task_id?: string;
  song_type?: 'preset' | 'theme' | 'theme-with-input' | 'from-scratch';
  preset_type?: PresetType;
}

export interface SongVariation {
  id: string;
  songId: string;
  audio_url: string;
  title?: string;
  metadata?: {
    api_variation_id?: string;
    duration?: number;
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
  preferredLanguage: Language;
  birthMonth?: number;
  birthYear?: number;
  ageGroup?: AgeGroup;
  gender?: string;
  /** User's timezone in IANA format (e.g., America/Los_Angeles) */
  timezone?: string;
}

// Define BabyProfile type that contains the baby-related subset of profile data
// This keeps related data clearly structured while avoiding duplication
export type BabyProfile = {
  babyName: string;
  birthMonth?: number;
  birthYear?: number;
  ageGroup?: AgeGroup;
  preferredLanguage?: Language;
  gender?: string;
};