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
    lyrics: (name) => `Bounce and play, ${name}'s having fun today!\n` +
           `Jump and spin, let the games begin!\n` +
           `Hands up high, reaching for the sky,\n` +
           `${name}'s smile makes the whole world bright!\n\n` +
           `Dance and twirl, like a happy star,\n` +
           `${name}'s laughter echoes near and far.\n` +
           `Clap your hands and stomp your feet,\n` +
           `Making playtime extra sweet!`,
    description: 'High-energy dance tune with playful rhythms'
  },
  eating: {
    title: (name) => `${name}'s mealtime song`,
    mood: 'playful',
    lyrics: (name) => `Yummy yummy in ${name}'s tummy,\n` +
           `Eating food that's oh so yummy!\n` +
           `Open wide, here comes the spoon,\n` +
           `${name} grows stronger with each noon!\n\n` +
           `Carrots, peas, and healthy treats,\n` +
           `Every bite makes ${name} complete.\n` +
           `Munching, crunching, what a joy,\n` +
           `Growing strong, our special joy!`,
    description: 'Upbeat melody with gentle encouragement'
  },
  sleeping: {
    title: (name) => `${name}'s bedtime song`,
    mood: 'calm',
    lyrics: (name) => `Sweet dreams little ${name}, close your eyes,\n` +
           `Stars are twinkling in the night skies.\n` +
           `Moonbeams dance upon your bed,\n` +
           `Angels watching overhead.\n\n` +
           `Gentle breezes, soft and light,\n` +
           `Keep you cozy through the night.\n` +
           `${name}'s dreams are filled with love so deep,\n` +
           `Peaceful slumber, gentle sleep.`,
    description: 'Soft, soothing lullaby with peaceful patterns'
  },
  pooping: {
    title: (name) => `${name}'s flushtime`,
    mood: 'playful',
    lyrics: (name) => `Push push little ${name}, it's time to go,\n` +
           `Let it all come out, don't be slow!\n` +
           `Sitting on your special seat,\n` +
           `Making potty time so neat!\n\n` +
           `Every day we learn and grow,\n` +
           `${name}'s getting bigger, don't you know!\n` +
           `When we're done, we'll clap and say,\n` +
           `"${name} did so great today!"`,
    description: 'Fun, encouraging melody with rhythmic patterns'
  }
};