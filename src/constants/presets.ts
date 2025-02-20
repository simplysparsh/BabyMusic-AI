import type { PresetType, MusicMood } from '../types';

interface PresetConfig {
  title: (name: string) => string;
  mood: MusicMood;
  lyrics: (name: string) => string;
  description: string;
}

export const PRESET_CONFIGS: Record<PresetType, PresetConfig> = {
  playing: {
    title: (name) => `${name}'s playtime song`,
    mood: 'energetic',
    lyrics: (name) => `Bounce and play, ${name}'s having fun today! Jump and spin, let the games begin!`,
    description: 'High-energy dance tune with playful rhythms'
  },
  eating: {
    title: (name) => `${name}'s mealtime song`,
    mood: 'playful',
    lyrics: (name) => `Yummy yummy in ${name}'s tummy, eating food that's oh so yummy!`,
    description: 'Upbeat melody with gentle encouragement'
  },
  sleeping: {
    title: (name) => `${name}'s bedtime song`,
    mood: 'calm',
    lyrics: (name) => `Sweet dreams little ${name}, close your eyes and drift away.`,
    description: 'Soft, soothing lullaby with peaceful patterns'
  },
  pooping: {
    title: (name) => `${name}'s flushtime`,
    mood: 'playful',
    lyrics: (name) => `Push push little ${name}, let it all come out to play!`,
    description: 'Fun, encouraging melody with rhythmic patterns'
  }
};