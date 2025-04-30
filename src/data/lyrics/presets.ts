import type { PresetType, MusicMood } from '../../types';

interface PresetConfig {
  title: (name: string) => string;
  mood: MusicMood;
  fallbackLyrics: (name: string) => string;
  description: string;
}

export const PRESET_CONFIGS: Record<PresetType, PresetConfig> = {
  playing: {
    title: (name: string) => `${name}'s Playtime Song`,
    mood: 'energetic',
    fallbackLyrics: (name: string) => 
      `Jump and bounce, let's play around,\n` +
      `${name}'s having fun, hear the happy sound!\n` +
      `Clap your hands and spin with glee,\n` +
      `Playing games, just you and me!\n\n` +
      `Toys and blocks and so much more,\n` +
      `${name}'s learning what fun is for!\n` +
      `Giggles, smiles, and lots of play,\n` +
      `Making memories every day!`,
    description: 'An energetic, upbeat melody designed for baby playtime. Features a lively tempo (100–130 BPM), bouncy rhythms, and major key tonality. Percussive instruments like marimba, tambourine, and ukulele drive a sense of fun and physical exploration. Repetitive phrasing and bright tones invite movement, laughter, and social engagement.'
  },
  eating: {
    title: (name: string) => `${name}'s Mealtime Song`,
    mood: 'playful',
    fallbackLyrics: (name: string) =>
      `Yummy yummy in ${name}'s tummy,\n` +
      `Eating food that's oh so yummy!\n` +
      `One more bite, it tastes so nice,\n` +
      `Healthy food will make you rise!\n\n` +
      `Open wide, here comes the spoon,\n` +
      `${name} will grow up big real soon!\n` +
      `Munching, crunching, what a treat,\n` +
      `Mealtime makes our day complete!`,
    description: 'A cheerful, steady-tempo tune that creates a joyful yet calming atmosphere for mealtime. Mid-tempo rhythms (90–110 BPM) paired with acoustic guitar, soft percussion, and xylophone support focus without overstimulation. Melodies are singable and engaging, encouraging positive associations with food and routine.'
  },
  sleeping: {
    title: (name: string) => `${name}'s Bedtime Lullaby`,
    mood: 'calm',
    fallbackLyrics: (name: string) =>
      `Sweet dreams, little ${name}, close your eyes,\n` +
      `Stars are twinkling in the night skies.\n` +
      `Soft and cozy in your bed,\n` +
      `Rest your precious sleepy head.\n\n` +
      `Moonbeams dancing, soft and bright,\n` +
      `Watching over you tonight.\n` +
      `Drift away to dreamland sweet,\n` +
      `Until morning we shall meet.`,
    description: 'A slow, soothing lullaby with gentle harmonies and soft textures to aid in winding down for sleep. Tempo ranges from 50–70 BPM, using instruments like harp, music box, ambient pads, and warm strings. The mood is tranquil, nurturing, and dreamy, evoking a secure and restful environment ideal for sleep onset and emotional comfort.'
  },
  pooping: {
    title: (name: string) => `${name}'s Flush Time Song`,
    mood: 'playful',
    fallbackLyrics: (name: string) =>
      `It's potty time for ${name} today,\n` +
      `Learning new things along the way!\n` +
      `Sitting proud upon the throne,\n` +
      `You can do this on your own!\n\n` +
      `Push push, little ${name}, you're doing great,\n` +
      `This is something to celebrate!\n` +
      `When you're done, we'll wash our hands,\n` +
      `You're the star of potty land!`,
    description: 'A playful, lighthearted melody crafted to make potty time feel fun and empowering. Set in a major key with a tempo around 80–100 BPM, it features whimsical instruments like ukulele, claps, and bongos. The tone is upbeat and confident, supporting routine-building through humor, encouragement, and positive reinforcement.'
  }
};