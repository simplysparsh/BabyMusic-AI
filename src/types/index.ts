export type MusicMood = 'calm' | 'playful' | 'learning' | 'energetic';
export type VoiceType = 'softFemale' | 'calmMale';
export type ThemeType = 
  | 'pitchDevelopment' 
  | 'cognitiveSpeech' 
  | 'sleepRegulation'
  | 'socialEngagement'
  | 'indianClassical'
  | 'westernClassical'
  | 'custom';

export type Tempo = 'slow' | 'medium' | 'fast';

export type AgeGroup = '0-6' | '7-12' | '13-24';
export type PresetType = 'playing' | 'eating' | 'sleeping' | 'pooping';
export type TaskStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'staged';

export interface SongGenerationParams {
  name: string;
  mood?: MusicMood;
  theme?: ThemeType;
  tempo?: Tempo;
  lyrics?: string;
  isInstrumental?: boolean;
  hasUserIdeas?: boolean;
  voiceType?: VoiceType;
}

export interface LyricGenerationError {
  message: string;
  params: LyricGenerationParams;
  timestamp: Date;
}

export interface BabyProfile {
  name: string;
  birthMonth: number;
  birthYear: number;
  ageGroup: AgeGroup;
}

export interface Song {
  id: string;
  name: string;
  mood?: MusicMood;
  theme?: ThemeType;
  voice?: VoiceType;
  lyrics?: string;
  audioUrl?: string;
  createdAt: Date;
  userId: string;
  status?: TaskStatus;
  retryable?: boolean;
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
  babyProfile: BabyProfile;
}