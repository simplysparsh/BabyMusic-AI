import type { ThemeType, MusicMood, Tempo, VoiceType, AgeGroup } from '../types';

interface LyricGenerationParams {
  babyName: string;
  ageGroup?: AgeGroup;
  theme?: ThemeType;
  mood?: MusicMood;
  tempo?: Tempo;
  userInput?: string;
  isCustom?: boolean;
  hasUserIdeas?: boolean;
  isPreset?: boolean;
  presetType?: PresetType;
}

// Preset-specific prompts
const PRESET_PROMPTS: Record<PresetType, (name: string) => string> = {
  playing: (name) =>
    `Create playful, energetic lyrics for ${name}'s playtime song. Include actions like jumping, dancing, and spinning.`,
  
  eating: (name) =>
    `Write encouraging lyrics for ${name}'s mealtime song. Make eating fun and exciting while staying gentle.`,
  
  sleeping: (name) =>
    `Compose soothing lullaby lyrics for ${name}'s bedtime. Use calming imagery and peaceful themes.`,
  
  pooping: (name) =>
    `Create encouraging, light-hearted lyrics for ${name}'s potty time. Keep it fun but purposeful.`
};

// Theme-based prompts
const THEME_PROMPTS: Record<ThemeType, (name: string) => string> = {
  pitchDevelopment: (name) => 
    `Create lyrics for a song that helps ${name} develop pitch recognition. Include melodic patterns and clear tonal changes.`,
  
  cognitiveSpeech: (name) =>
    `Write lyrics for a song that enhances ${name}'s speech development. Use simple words and repetitive patterns.`,
  
  sleepRegulation: (name) =>
    `Compose gentle lullaby lyrics to help ${name} fall asleep. Use soothing words and calming imagery.`,
  
  socialEngagement: (name) =>
    `Create interactive song lyrics that encourage ${name}'s social development. Include actions and responses.`,
  
  musicalDevelopment: (name) =>
    `Write lyrics that introduce ${name} to musical concepts. Include rhythm patterns and musical terms.`,
  
  indianClassical: (name) =>
    `Compose lyrics inspired by Indian classical music for ${name}. Use simple Sanskrit-inspired sounds.`,
  
  westernClassical: (name) =>
    `Create lyrics inspired by Western classical melodies for ${name}. Focus on harmony and musical flow.`,
  
  custom: (name) =>
    `Write engaging children's song lyrics for ${name}. Make it age-appropriate and fun.`
};

// Age-specific modifiers
const AGE_MODIFIERS: Record<AgeGroup, string> = {
  '0-6': 'Keep the lyrics very simple with basic sounds and repetitive patterns.',
  '7-12': 'Use simple words and include interactive elements.',
  '13-24': 'Include more complex words and educational elements.'
};

// Mood-based style guides
const MOOD_STYLES: Record<MusicMood, string> = {
  calm: 'Use gentle, soothing words and a peaceful rhythm.',
  playful: 'Make it fun and bouncy with playful words.',
  learning: 'Include educational elements and clear pronunciation.',
  energetic: 'Use upbeat words and dynamic phrases.'
};

// Tempo modifiers
const TEMPO_MODIFIERS: Record<Tempo, string> = {
  slow: 'Create a gentle, flowing rhythm.',
  medium: 'Maintain a steady, comfortable pace.',
  fast: 'Use bouncy, quick-moving phrases.'
};

export class LyricGenerationService {
  static async generateLyrics(params: LyricGenerationParams): Promise<string> {
    const {
      babyName,
      ageGroup,
      theme,
      mood,
      tempo,
      userInput,
      isCustom,
      hasUserIdeas,
      isPreset,
      presetType
    } = params;

    // Base prompt based on context
    let basePrompt = '';
    
    if (isPreset && presetType) {
      basePrompt = PRESET_PROMPTS[presetType](babyName);
    } else if (theme) {
      basePrompt = THEME_PROMPTS[theme](babyName);
    } else {
      basePrompt = THEME_PROMPTS.custom(babyName);
    }

    // Add age-specific modifications if available
    if (ageGroup) {
      basePrompt += ' ' + AGE_MODIFIERS[ageGroup];
    }

    // Add mood style if specified
    if (mood) {
      basePrompt += ' ' + MOOD_STYLES[mood];
    }

    // Add tempo guidance if specified
    if (tempo) {
      basePrompt += ' ' + TEMPO_MODIFIERS[tempo];
    }

    // Handle user ideas differently based on context
    if (hasUserIdeas && userInput) {
      if (isCustom) {
        // For custom songs, use user input as primary inspiration
        basePrompt = `Create lyrics for a children's song about: ${userInput}\n\n` +
                    `Requirements:\n` +
                    `- Must prominently feature the name "${babyName}"\n` +
                    `- Keep the original theme/idea from user input\n` +
                    `- Adapt to ${mood} mood and ${tempo || 'moderate'} tempo`;
      } else {
        // For themed songs, blend user ideas with theme
        basePrompt += '\n\nSpecial Instructions:\n' +
                     `- Incorporate these ideas from the parent: ${userInput}\n` +
                     '- Blend parent ideas with the theme naturally\n' +
                     `- Ensure ${babyName}'s name is featured prominently`;
      }
    } else if (isCustom) {
      // For custom songs without specific ideas, ensure baby name is central
      basePrompt = `Create a ${mood} song centered around ${babyName}.\n\n` +
                  `Requirements:\n` +
                  `- Make ${babyName} the main character of the song\n` +
                  `- Create an engaging story or activity\n` +
                  `- Match the ${mood} mood and ${tempo || 'moderate'} tempo`;
    }

    // Add general guidelines
    basePrompt += '\n\nGuidelines:\n' +
      '- Keep lyrics child-friendly and positive\n' +
      '- Use clear, simple language\n' +
      '- Include repetition for memorability\n' +
      '- Maximum length: 4-8 lines\n' +
      '- Make it musical and flowing';

    // TODO: Replace with actual Claude API call
    // For now, return sample lyrics based on theme
    return generateSampleLyrics(babyName, theme, mood);
  }
}

// Temporary function to generate sample lyrics until Claude integration
function generateSampleLyrics(name: string, theme?: ThemeType, mood?: MusicMood): string {
  // Custom song with playful mood
  if (!theme && mood === 'playful') {
    return `${name} is dancing, twirling high,\n` +
           `Like a butterfly in the summer sky!\n` +
           `Clap your hands and spin around,\n` +
           `${name}'s joy fills the air with sound!`;
  }

  // Theme-based with user ideas
  if (theme === 'sleepRegulation') {
    return `Sweet dreams little ${name}, close your eyes and rest,\n` +
           `Like stars in the night sky, you shine the best.\n` +
           `Gentle moonbeams watch you sleep,\n` +
           `While ${name}'s dreams grow sweet and deep.`;
  }
  
  // Default themed song
  if (theme === 'pitchDevelopment') {
    return `Up and down goes ${name}'s voice,\n` +
           `Like a bird making musical choice.\n` +
           `High notes soar and low notes play,\n` +
           `${name}'s singing brightens every day!`;
  }
  
  // Generic fallback always featuring the name
  return `${name}, ${name}, what do you see?\n` +
         `A world full of wonder, just waiting to be!\n` +
         `${name}, ${name}, what do you hear?\n` +
         `Music and laughter, sweet and clear!`;
}