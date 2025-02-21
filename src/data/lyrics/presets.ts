import type { PresetType, MusicMood } from '../../types';

interface PresetConfig {
  title: (name: string) => string;
  mood: MusicMood;
  lyrics: (name: string) => string;
  description: string;
}

export const PRESET_CONFIGS: Record<PresetType, PresetConfig> = {
  playing: {
    title: (name: string) => `${name}'s Playtime Song`,
    mood: 'energetic',
    lyrics: (name: string) => 
      `Jump and bounce, let's play around,\n` +
      `${name}'s having fun, hear the happy sound!\n` +
      `Clap your hands and spin with glee,\n` +
      `Playing games, just you and me!\n\n` +
      `Toys and blocks and so much more,\n` +
      `${name}'s learning what fun is for!\n` +
      `Giggles, smiles, and lots of play,\n` +
      `Making memories every day!`,
    description: 'Energetic melody for playtime activities'
  },
  eating: {
    title: (name: string) => `${name}'s Mealtime Song`,
    mood: 'playful',
    lyrics: (name: string) =>
      `Yummy yummy in ${name}'s tummy,\n` +
      `Eating food that's oh so yummy!\n` +
      `One more bite, it tastes so nice,\n` +
      `Healthy food will make you rise!\n\n` +
      `Open wide, here comes the spoon,\n` +
      `${name} will grow up big real soon!\n` +
      `Munching, crunching, what a treat,\n` +
      `Mealtime makes our day complete!`,
    description: 'Encouraging melody for mealtime'
  },
  sleeping: {
    title: (name: string) => `${name}'s Bedtime Lullaby`,
    mood: 'calm',
    lyrics: (name: string) =>
      `Sweet dreams, little ${name}, close your eyes,\n` +
      `Stars are twinkling in the night skies.\n` +
      `Soft and cozy in your bed,\n` +
      `Rest your precious sleepy head.\n\n` +
      `Moonbeams dancing, soft and bright,\n` +
      `Watching over you tonight.\n` +
      `Drift away to dreamland sweet,\n` +
      `Until morning we shall meet.`,
    description: 'Soothing lullaby for bedtime'
  },
  pooping: {
    title: (name: string) => `${name}'s Flush Time Song`,
    mood: 'playful',
    lyrics: (name: string) =>
      `It's potty time for ${name} today,\n` +
      `Learning new things along the way!\n` +
      `Sitting proud upon the throne,\n` +
      `You can do this on your own!\n\n` +
      `Push push, little ${name}, you're doing great,\n` +
      `This is something to celebrate!\n` +
      `When you're done, we'll wash our hands,\n` +
      `You're the star of potty land!`,
    description: 'Playful melody for potty training'
  }
};