import type { ThemeType } from '../../types';

interface ThemeConfig {
  fallbackLyrics: (name: string) => string;
  description: string;
  generationGuideline: string;
}

export const THEME_CONFIGS: Record<ThemeType, ThemeConfig> = {
  pitchDevelopment: {
    fallbackLyrics: (name) =>
      `Up and down goes ${name}'s voice,\n` +
      `Like a bird making musical choice.\n` +
      `High notes soar and low notes play,\n` +
      `${name}'s singing brightens every day!\n\n` +
      `Do Re Mi, can you see?\n` +
      `${name}'s learning music, one, two, three!\n` +
      `Notes and scales, never fails,\n` +
      `Making music tell sweet tales!`,
    description: 'Simple, slow-paced melody with pure, sustained tones in a pentatonic or major scale. Use soft, high-pitched instruments like a glockenspiel, harp, and piano. Incorporate distinct, well-separated notes with clear pitch definition. The tempo should be around 60-80 BPM, mimicking a caregiver\'s soothing voice.',
    generationGuideline: 'Create a children\'s song focused on pitch recognition and vocal development'
  },
  cognitiveSpeech: {
    fallbackLyrics: (name) =>
      `Listen close as ${name} speaks,\n` +
      `Words and sounds like mountain peaks.\n` +
      `Syllables dance, letters play,\n` +
      `${name}'s voice grows stronger every day!\n\n` +
      `Speak and sing, let words ring,\n` +
      `${name}'s voice makes everything swing!\n` +
      `Clear and bright, pure delight,\n` +
      `Learning language day and night!`,
    description: 'Rhythmic, playful musical piece at 120 BPM with a steady beat using soft percussion (shakers, wooden blocks, and gentle drums). Use repetitive, singable melodies with vowel-like vocalizations (\'la-la,\' \'ba-ba\') to encourage baby babbling and speech processing. The structure should have clear call-and-response elements.',
    generationGuideline: 'Create a children\'s song that encourages speech development and cognitive learning'
  },
  sleepRegulation: {
    fallbackLyrics: (name) =>
      `Hush now ${name}, drift and dream,\n` +
      `Float away on starlight's beam.\n` +
      `Gentle waves of sleepy sighs,\n` +
      `Carry you through peaceful skies.\n\n` +
      `Rest your head, time for bed,\n` +
      `Dreams are waiting to be read.\n` +
      `Close your eyes, paradise,\n` +
      `Sleep until the sun does rise.`,
    description: 'Soft, slow lullaby with a tempo of 50-70 BPM. Use warm, gentle tones from acoustic guitar, harp, and soft strings. The melody should be repetitive, with smooth legato phrasing and minimal harmonic complexity. Background nature sounds like soft rain or heartbeats can be subtly integrated.',
    generationGuideline: 'Create a gentle lullaby to help with sleep regulation'
  },
  socialEngagement: {
    fallbackLyrics: (name) =>
      `Hello friends, ${name} is here,\n` +
      `Bringing smiles and lots of cheer!\n` +
      `Wave your hands and say hello,\n` +
      `Making friendships as we go!\n\n` +
      `Share and care, show you're there,\n` +
      `${name}'s learning how to be aware!\n` +
      `Kind and true, me and you,\n` +
      `Building bonds both old and new!`,
    description: 'Upbeat, interactive musical track with dynamic tempo changes between 90-140 BPM. Include engaging, speech-like vocal elements (\'peek-a-boo,\' \'hello!\') and playful, bouncing rhythms using marimba, claps, and light percussion. Add occasional pauses for natural call-and-response interaction.',
    generationGuideline: 'Create a children\'s song that promotes social interaction and emotional development'
  },
  indianClassical: {
    fallbackLyrics: (name) =>
      `Om Shanti ${name}, peaceful and bright,\n` +
      `Like morning ragas at first light.\n` +
      `Gentle swaras guide the way,\n` +
      `As ${name} learns to sing and play.\n\n` +
      `Peaceful rhythms, soft and slow,\n` +
      `Help ${name}'s inner light to grow.\n` +
      `Ancient wisdom, new and pure,\n` +
      `Making melodies to endure.`,
    description: 'Soothing melody based on a simple Hindustani raga, such as Raga Yaman, using traditional instruments like the sitar and tabla. Maintain a medium tempo (80-100 BPM) with repetitive, gentle phrases to create a calming atmosphere.',
    generationGuideline: 'Create a children\'s song incorporating Indian classical music elements'
  },
  westernClassical: {
    fallbackLyrics: (name) =>
      `${name} dances with Mozart's grace,\n` +
      `Classical beauty fills this place.\n` +
      `Gentle strings and flutes so sweet,\n` +
      `Make ${name}'s melody complete!\n\n` +
      `Bach and more, music's door,\n` +
      `${name}'s learning what to explore!\n` +
      `Pure and bright, day and night,\n` +
      `Classical dreams take their flight!`,
    description: 'Gentle arrangement of a classical piece by Mozart or Beethoven, such as Mozart\'s \'Piano Sonata No. 16\' or Beethoven\'s \'Für Elise,\' using soft piano tones. Keep the tempo slow (60-80 BPM) and maintain a soothing dynamic throughout.',
    generationGuideline: 'Create a children\'s song incorporating Western classical music elements'
  }
};

// For backward compatibility
export const THEME_LYRICS = Object.fromEntries(
  Object.entries(THEME_CONFIGS).map(([key, config]) => [key, config.fallbackLyrics])
) as Record<ThemeType, (name: string) => string>;