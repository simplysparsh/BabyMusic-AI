import type {
  ThemeType,
  MusicMood,
  Tempo,
  VoiceType,
  AgeGroup,
} from '../types';
import { ClaudeAPI } from '../lib/claude';
import { PRESET_CONFIGS, THEME_LYRICS } from '../data/lyrics';

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
    `Create encouraging, light-hearted lyrics for ${name}'s potty time. Keep it fun but purposeful.`,
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
    `Create lyrics inspired by Indian classical music for ${name}. Keep the language simple and child-friendly`,

  westernClassical: (name) =>
    `Create lyrics inspired by Western classical melodies for ${name}. Focus on harmony and musical flow.`,

  custom: (name) =>
    `Write engaging children's song lyrics for ${name}. Make it age-appropriate and fun.`,
};

// Age-specific modifiers
const AGE_MODIFIERS: Record<AgeGroup, string> = {
  '0-6':
    'Keep the lyrics very simple with basic sounds and repetitive patterns.',
  '7-12': 'Use simple words and include interactive elements.',
  '13-24': 'Include more complex words and educational elements.',
};

// Mood-based style guides
const MOOD_STYLES: Record<MusicMood, string> = {
  calm: 'Use gentle, soothing words and a peaceful rhythm.',
  playful: 'Make it fun and bouncy with playful words.',
  learning: 'Include educational elements and clear pronunciation.',
  energetic: 'Use upbeat words and dynamic phrases.',
};

// Tempo modifiers
const TEMPO_MODIFIERS: Record<Tempo, string> = {
  slow: 'Create a gentle, flowing rhythm.',
  medium: 'Maintain a steady, comfortable pace.',
  fast: 'Use bouncy, quick-moving phrases.',
};

export class LyricGenerationService {
  static async generateLyrics(params: LyricGenerationParams): Promise<string> {
    // Validate required parameters
    if (!params.babyName) {
      throw new Error('Baby name is required for lyric generation');
    }

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
      presetType,
    } = params;

    // Base prompt based on context
    let basePrompt = '';

    if (isPreset && presetType) {
      basePrompt = PRESET_PROMPTS[presetType](babyName);
    } else if (theme && !hasUserIdeas) {
      basePrompt = THEME_PROMPTS[theme](babyName);
    } else if (!theme || hasUserIdeas) {
      if (!mood) {
        throw new Error(
          'Mood is required for custom songs-lyricsgenerationservice'
        );
      }
      basePrompt = `Write engaging children's song lyrics for ${babyName}. Make it age-appropriate and fun.`;
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
        basePrompt =
          `Create lyrics for a children's song about: ${userInput}\n\n` +
          `Requirements:\n` +
          `- Must prominently feature the name "${babyName}"\n` +
          `- Keep the original theme/idea from user input\n` +
          `- Adapt to ${mood} mood and ${tempo || 'moderate'} tempo`;
      } else {
        // For themed songs, blend user ideas with theme
        basePrompt +=
          '\n\nSpecial Instructions:\n' +
          `- Incorporate these ideas from the parent: ${userInput}\n` +
          '- Blend parent ideas with the theme naturally\n' +
          `- Ensure ${babyName}'s name is featured prominently`;
      }
    } else if (isCustom) {
      // For custom songs without specific ideas, ensure baby name is central
      basePrompt =
        `Create a ${mood} song centered around ${babyName}.\n\n` +
        `Requirements:\n` +
        `- Make ${babyName} the main character of the song\n` +
        `- Create an engaging story or activity\n` +
        `- Match the ${mood} mood and ${tempo || 'moderate'} tempo`;
    }

    // Add general guidelines
    basePrompt +=
      '\n\nGuidelines:\n' +
      '- Keep lyrics child-friendly and positive\n' +
      '- Use clear, simple language\n' +
      '- Include repetition for memorability\n' +
      '- Maximum length: 4-8 lines\n' +
      '- Make it musical and flowing';

    try {
      return await ClaudeAPI.generateLyrics(basePrompt);
    } catch (error) {
      console.error('Lyric generation failed:', error);

      // Use fallback lyrics but preserve error for monitoring
      if (error instanceof Error) {
        await logLyricGenerationError(error.message, params);
      }

      console.error('Failed to generate lyrics with Claude:', error);
      // Use backup lyrics from our data files
      if (isPreset && presetType) {
        return PRESET_CONFIGS[presetType].lyrics(babyName);
      } else if (theme) {
        return THEME_LYRICS[theme](babyName);
      } else {
        return THEME_LYRICS.custom(babyName);
      }
    }
  }
}
