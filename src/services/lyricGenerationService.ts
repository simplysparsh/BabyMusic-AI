import type {
  ThemeType,
  MusicMood,
  Tempo,
  VoiceType,
  AgeGroup,
  PresetType
} from '../types';
import { ClaudeAPI } from '../lib/claude';
import { PRESET_CONFIGS, THEME_CONFIGS } from '../data/lyrics';
import { supabase } from '../lib/supabase';

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

// Age-specific modifiers for prompts
const AGE_MODIFIERS: Record<AgeGroup, string> = {
  '0-6': 'Keep it very simple and repetitive.',
  '7-12': 'Use simple words and clear patterns.',
  '13-24': 'Include more complex words and concepts.'
};

// Mood-specific style guidance
const MOOD_STYLES: Record<MusicMood, string> = {
  calm: 'Use soothing and peaceful language.',
  playful: 'Make it fun and bouncy.',
  learning: 'Focus on educational elements.',
  energetic: 'Include active and dynamic words.'
};

// Tempo-specific guidance
const TEMPO_MODIFIERS: Record<Tempo, string> = {
  slow: 'Keep a gentle, slow rhythm.',
  medium: 'Maintain a moderate, steady pace.',
  fast: 'Create an upbeat, quick rhythm.'
};

export class LyricGenerationService {
  static async generateLyrics(params: LyricGenerationParams): Promise<string> {
    console.log('LyricGenerationService.generateLyrics called with:', {
      ...params,
      userInput: params.userInput ? 'provided' : 'not provided',
      hasName: !!params.babyName
    });

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

    if (isPreset && presetType && PRESET_CONFIGS[presetType]) {
      basePrompt = PRESET_CONFIGS[presetType].description;
    } else if (theme && !hasUserIdeas && THEME_CONFIGS[theme]) {
      basePrompt = THEME_CONFIGS[theme].prompt;
    } else if (!theme || hasUserIdeas) {
      if (!mood) {
        throw new Error('Mood is required for custom songs');
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

    // Add user's custom input if provided
    if (userInput) {
      basePrompt += `\n\nIncorporate these ideas: ${userInput}`;
    }

    try {
      console.log('Calling Claude API for lyrics generation');
      return await ClaudeAPI.generateLyrics(basePrompt);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      console.error('Lyric generation failed:', {
        error: errorMessage,
        params: {
          hasName: !!babyName,
          theme,
          mood,
          isPreset,
          presetType,
          hasUserInput: !!userInput
        }
      });

      // Use fallback lyrics but preserve error for monitoring
      if (err instanceof Error) {
        try {
          await logLyricGenerationError(errorMessage, params);
        } catch (logError) {
          console.error('Failed to log lyric generation error:', {
            originalError: errorMessage,
            logError
          });
          // Continue with fallback lyrics even if logging fails
        }
      }

      // Use backup lyrics from our data files
      let fallbackLyrics: string;
      if (isPreset && presetType && PRESET_CONFIGS[presetType]) {
        fallbackLyrics = PRESET_CONFIGS[presetType].lyrics(babyName);
      } else if (theme && THEME_CONFIGS[theme]) {
        fallbackLyrics = THEME_CONFIGS[theme].lyrics(babyName);
      } else {
        // For custom songs, create a mood-based template
        fallbackLyrics = `Let's make ${mood} music together,\n` +
          `${babyName} leads the way.\n` +
          `With ${mood} melodies flowing,\n` +
          `Creating magic today!`;
      }
      
      console.log('Using fallback lyrics:', {
        type: isPreset ? 'preset' : theme ? 'theme' : 'custom',
        length: fallbackLyrics.length
      });
      
      return fallbackLyrics;
    }
  }
}

export const logLyricGenerationError = async (error: string, params: LyricGenerationParams) => {
  try {
    await supabase.from('lyric_generation_errors').insert([
      {
        error_message: error,
        theme: params.theme,
        mood: params.mood,
        is_preset: params.isPreset,
        preset_type: params.presetType,
        has_user_ideas: params.hasUserIdeas,
        has_user_input: !!params.userInput
      }
    ]);
  } catch (err) {
    console.error('Failed to log lyric generation error:', err);
  }
};
