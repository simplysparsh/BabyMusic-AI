import type { ThemeType } from '../../types';

interface ThemeConfig {
  lyrics: (name: string) => string;
  description: string;
  prompt: string;
}

export const THEME_CONFIGS: Record<ThemeType, ThemeConfig> = {
  pitchDevelopment: {
    lyrics: (name) =>
      `Up and down goes ${name}'s voice,\n` +
      `Like a bird making musical choice.\n` +
      `High notes soar and low notes play,\n` +
      `${name}'s singing brightens every day!\n\n` +
      `Do Re Mi, can you see?\n` +
      `${name}'s learning music, one, two, three!\n` +
      `Notes and scales, never fails,\n` +
      `Making music tell sweet tales!`,
    description: 'Melodic patterns for pitch recognition training',
    prompt: 'Create a children\'s song focused on pitch recognition and vocal development'
  },
  cognitiveSpeech: {
    lyrics: (name) =>
      `Listen close as ${name} speaks,\n` +
      `Words and sounds like mountain peaks.\n` +
      `Syllables dance, letters play,\n` +
      `${name}'s voice grows stronger every day!\n\n` +
      `Speak and sing, let words ring,\n` +
      `${name}'s voice makes everything swing!\n` +
      `Clear and bright, pure delight,\n` +
      `Learning language day and night!`,
    description: 'Clear rhythmic patterns for speech development',
    prompt: 'Create a children\'s song that encourages speech development and cognitive learning'
  },
  sleepRegulation: {
    lyrics: (name) =>
      `Hush now ${name}, drift and dream,\n` +
      `Float away on starlight's beam.\n` +
      `Gentle waves of sleepy sighs,\n` +
      `Carry you through peaceful skies.\n\n` +
      `Rest your head, time for bed,\n` +
      `Dreams are waiting to be read.\n` +
      `Close your eyes, paradise,\n` +
      `Sleep until the sun does rise.`,
    description: 'Gentle lullaby with soothing patterns',
    prompt: 'Create a gentle lullaby to help with sleep regulation'
  },
  socialEngagement: {
    lyrics: (name) =>
      `Hello friends, ${name} is here,\n` +
      `Bringing smiles and lots of cheer!\n` +
      `Wave your hands and say hello,\n` +
      `Making friendships as we go!\n\n` +
      `Share and care, show you're there,\n` +
      `${name}'s learning how to be aware!\n` +
      `Kind and true, me and you,\n` +
      `Building bonds both old and new!`,
    description: 'Interactive melody for social bonding',
    prompt: 'Create a children\'s song that promotes social interaction and emotional development'
  },
  indianClassical: {
    lyrics: (name) =>
      `Om Shanti ${name}, peaceful and bright,\n` +
      `Like morning ragas at first light.\n` +
      `Gentle swaras guide the way,\n` +
      `As ${name} learns to sing and play.\n\n` +
      `Peaceful rhythms, soft and slow,\n` +
      `Help ${name}'s inner light to grow.\n` +
      `Ancient wisdom, new and pure,\n` +
      `Making melodies to endure.`,
    description: 'Peaceful Indian classical melody with gentle ragas and traditional elements',
    prompt: 'Create a children\'s song incorporating Indian classical music elements'
  },
  westernClassical: {
    lyrics: (name) =>
      `${name} dances with Mozart's grace,\n` +
      `Classical beauty fills this place.\n` +
      `Gentle strings and flutes so sweet,\n` +
      `Make ${name}'s melody complete!\n\n` +
      `Bach and more, music's door,\n` +
      `${name}'s learning what to explore!\n` +
      `Pure and bright, day and night,\n` +
      `Classical dreams take their flight!`,
    description: 'Adapted classical melodies for babies',
    prompt: 'Create a children\'s song incorporating Western classical music elements'
  }
};

// For backward compatibility
export const THEME_LYRICS = Object.fromEntries(
  Object.entries(THEME_CONFIGS).map(([key, config]) => [key, config.lyrics])
) as Record<ThemeType, (name: string) => string>;