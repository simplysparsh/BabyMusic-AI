import type { PresetType, MusicMood } from '../../types';

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
    lyrics: (name) => 
      `${name} is jumping, ${name} is free,\n` +
      `Dancing and spinning for all to see!\n` +
      `Hands up high, touch the sky,\n` +
      `${name}'s smile makes the whole world bright!\n\n` +
      `Clap your hands and stomp your feet,\n` +
      `${name}'s playtime is oh so sweet!\n` +
      `Twirl around, touch the ground,\n` +
      `Joy and laughter all around!`,
    description: 'High-energy dance tune with playful rhythms'
  },
  eating: {
    title: (name) => `${name}'s mealtime song`,
    mood: 'playful',
    lyrics: (name) =>
      `Yummy yummy in ${name}'s tummy,\n` +
      `Eating food that's oh so yummy!\n` +
      `Open wide, food inside,\n` +
      `Growing strong with every bite!\n\n` +
      `Carrots, peas, and healthy treats,\n` +
      `Make ${name}'s mealtime extra sweet!\n` +
      `One more spoon, very soon,\n` +
      `${name} will grow big like the moon!`,
    description: 'Upbeat melody with gentle encouragement'
  },
  sleeping: {
    title: (name) => `${name}'s bedtime song`,
    mood: 'calm',
    lyrics: (name) =>
      `Sweet dreams little ${name}, close your eyes,\n` +
      `Stars are twinkling in the night skies.\n` +
      `Moonbeams dance upon your bed,\n` +
      `Angels watching overhead.\n\n` +
      `Gentle breezes, soft and light,\n` +
      `Keep you cozy through the night.\n` +
      `${name}'s dreams are filled with love so deep,\n` +
      `Time for peaceful, gentle sleep.`,
    description: 'Soft, soothing lullaby with peaceful patterns'
  },
  pooping: {
    title: (name) => `${name}'s flushtime`,
    mood: 'playful',
    lyrics: (name) =>
      `Push push little ${name}, time to go,\n` +
      `Let it all come out, nice and slow!\n` +
      `Sitting on your special seat,\n` +
      `Making potty time so neat!\n\n` +
      `Every day we learn and grow,\n` +
      `${name}'s getting bigger, don't you know!\n` +
      `When we're done, we'll clap and say,\n` +
      `"${name} did so great today!"`,
    description: 'Fun, encouraging melody with rhythmic patterns'
  }
};