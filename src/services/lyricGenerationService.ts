import type {
  ThemeType,
  MusicMood,
  Tempo,
  AgeGroup,
  PresetType,
} from '../types';
import { ClaudeAPI } from '../lib/claude';
import { PRESET_CONFIGS, THEME_CONFIGS } from '../data/lyrics';
import { supabase } from '../lib/supabase';

const SYSTEM_PROMPT = `You are a professional children's songwriter specializing in creating engaging, 
age-appropriate lyrics. Your task is to create lyrics based on the following requirements:

1. Name: ALWAYS use the child's name exactly as provided
2. Length: Maximum 2900 characters
3. Language: Simple, child-friendly words
4. Tone: Positive and uplifting
5. Theme: Follow provided mood/theme
6. Format: Plain text with line breaks
7. Song should last 2-3 mins

Output only the lyrics, no explanations or additional text.`;


interface LyricGenerationParams {
  babyName: string;
  ageGroup?: AgeGroup;
  theme?: ThemeType;
  mood?: MusicMood;
  tempo?: Tempo;
  userInput?: string;
  songType: 'preset' | 'theme' | 'theme-with-input' | 'from-scratch';
  presetType?: PresetType;
  gender?: string;
}

// Age-specific modifiers for prompts
const AGE_MODIFIERS: Record<AgeGroup, string> = {
  '0-6': 'Keep it very simple and repetitive.',
  '7-12': 'Use simple words and clear patterns.',
  '13-24': 'Include more complex words and concepts.',
};

// Mood-specific style guidance
const MOOD_STYLES: Record<MusicMood, string> = {
  calm: 'Use soothing and peaceful language.',
  playful: 'Make it fun and bouncy.',
  learning: 'Focus on educational elements.',
  energetic: 'Include active and dynamic words.',
};

// Tempo-specific guidance
const TEMPO_MODIFIERS: Record<Tempo, string> = {
  slow: 'Keep a gentle, slow rhythm.',
  medium: 'Maintain a moderate, steady pace.',
  fast: 'Create an upbeat, quick rhythm.',
};

export class LyricGenerationService {
  static async generateLyrics(params: LyricGenerationParams): Promise<string> {
    console.log('LyricGenerationService.generateLyrics called with:', {
      ...params,
      userInput: params.userInput ? 'provided' : 'not provided',
      gender: params.gender || 'not provided'
    });

    // Validate required parameters
    if (!params.babyName) {
      throw new Error('Baby name is required for lyric generation');
    }

    // Set a timeout for the entire lyric generation process
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => {
        reject(new Error('Lyric generation timed out after 45 seconds'));
      }, 45000); // 45 second timeout
    });

    try {
      // Ensure Claude API key is configured
      if (!import.meta.env.VITE_CLAUDE_API_KEY) {
        console.warn('Claude API key not found, using fallback lyrics');
        return this.getFallbackLyrics(params);
      }

      const {
        babyName,
        ageGroup,
        theme,
        mood,
        tempo,
        userInput,
        songType,
        presetType,
        gender
      } = params;

      // Ensure clean baby name
      const name = babyName.trim();

      // Build the user prompt
      let lyricsBasePrompt = '';

      // Determine the base song description
      if (songType === 'preset' && presetType && PRESET_CONFIGS[presetType]) {
        lyricsBasePrompt = `Create a ${PRESET_CONFIGS[presetType].description} for ${name}`;
      } else if (songType === 'theme' && theme && THEME_CONFIGS[theme]) {
        lyricsBasePrompt = `${THEME_CONFIGS[theme].prompt} for ${name}`;
      } else if (songType === 'theme-with-input' && theme) {
        lyricsBasePrompt = `${THEME_CONFIGS[theme].prompt} for ${name}`;
      } else if (songType === 'from-scratch') {
        if (!mood) {
          throw new Error('Mood is required for songs built from scratch');
        }
        lyricsBasePrompt = `Write engaging children's song lyrics for ${name}. Make it age-appropriate and fun.`;
      } else {
        throw new Error('Invalid song type');
      }

      // Add age-specific modifications if available
      if (ageGroup) {
        lyricsBasePrompt += ' ' + AGE_MODIFIERS[ageGroup];
      }

      // Add mood style if specified
      if (mood) {
        lyricsBasePrompt += ' ' + MOOD_STYLES[mood];
      }

      // Add tempo guidance if specified
      if (tempo) {
        lyricsBasePrompt += ' ' + TEMPO_MODIFIERS[tempo];
      }

      // Add gender-specific guidance if provided
      if (gender) {
        if (gender === 'boy') {
          lyricsBasePrompt += ` Use male pronouns (he/him) and boy-appropriate language for ${name}.`;
        } else if (gender === 'girl') {
          lyricsBasePrompt += ` Use female pronouns (she/her) and girl-appropriate language for ${name}.`;
        } else {
          lyricsBasePrompt += ` Use gender-neutral pronouns (they/them) for ${name}.`;
        }
      }

      // Add user's custom input if provided
      if (userInput) {
        lyricsBasePrompt += `\n\nIncorporate these ideas: ${userInput}`;
      }

      // Construct the complete prompt with system instructions and user request
      const completePrompt = `${SYSTEM_PROMPT}\n\n${lyricsBasePrompt}`;

      try {
        if (!completePrompt?.trim()) {
          throw new Error('Prompt is required for lyrics generation');
        }

        console.log('Sending lyrics prompt to Claude:', {
          systemPrompt: SYSTEM_PROMPT.slice(0, 100) + '...\n',
          lyricsBasePromptStart: lyricsBasePrompt.slice(0, 150) + '...\n',
          hasName: lyricsBasePrompt.includes(name),
          promptLength: completePrompt.length
        });

        // Race between the API call and the timeout
        const lyrics = await Promise.race([
          ClaudeAPI.makeRequest(completePrompt),
          timeoutPromise
        ]);
        
        // Log quality metrics
        console.log('Lyrics generation quality:', lyrics.quality);
        
        // If the response doesn't contain the baby's name, log a warning
        if (!lyrics.quality.hasName) {
          console.warn('Generated lyrics may not contain baby name:', {
            name,
            length: lyrics.quality.length
          });
        }

        return lyrics.text;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        console.error('Lyric generation failed:', {
          error: errorMessage,
          params: {
            hasName: !!babyName,
            theme,
            mood,
            isPreset: songType === 'preset',
            songType,
            hasUserInput: !!userInput,
          },
        });

        // Use fallback lyrics but preserve error for monitoring
        if (err instanceof Error) {
          try {
            await logLyricGenerationError(errorMessage, params);
          } catch (logError) {
            console.error('Failed to log lyric generation error:', {
              originalError: errorMessage,
              logError,
            });
            // Continue with fallback lyrics even if logging fails
          }
        }

        // Use backup lyrics from our data files
        return this.getFallbackLyrics(params);
      }
    } catch (error) {
      console.error('Lyric generation process failed completely:', error);
      return this.getFallbackLyrics(params);
    }
  }

  static async getFallbackLyrics(params: {
    babyName: string;
    theme?: ThemeType;
    mood?: MusicMood;
    presetType?: PresetType;
    songType?: 'preset' | 'theme' | 'theme-with-input' | 'from-scratch';
    gender?: string;
  }): Promise<string> {
    const { babyName, theme, mood, presetType, songType, gender } = params;
    const name = babyName.trim();
    
    try {
      console.log('Getting fallback lyrics for:', {
        name,
        theme,
        mood,
        presetType,
        songType,
        gender
      });
      
      // Add gender-specific pronouns
      let pronoun = 'they';
      let possessivePronoun = 'their';
      
      if (gender === 'boy') {
        pronoun = 'he';
        possessivePronoun = 'his';
      } else if (gender === 'girl') {
        pronoun = 'she';
        possessivePronoun = 'her';
      }
      
      // For preset songs, use the preset config
      if (songType === 'preset' && presetType && PRESET_CONFIGS[presetType]) {
        console.log('Using preset fallback lyrics for:', presetType);
        const lyrics = PRESET_CONFIGS[presetType].lyrics(name);
        return lyrics
          .replace(/\{pronoun\}/g, pronoun)
          .replace(/\{possessive\}/g, possessivePronoun);
      }
      
      // For theme songs, use the theme config
      if ((songType === 'theme' || songType === 'theme-with-input') && theme && THEME_CONFIGS[theme]) {
        console.log('Using theme fallback lyrics for:', theme);
        const lyrics = THEME_CONFIGS[theme].lyrics(name);
        return lyrics
          .replace(/\{pronoun\}/g, pronoun)
          .replace(/\{possessive\}/g, possessivePronoun);
      }
      
      console.log('Using custom fallback lyrics');
      // For custom songs, use a mood-based template
      const fallbackLyrics = songType === 'from-scratch' && mood
        ? `Let's make ${mood} music together,\n` +
          `${name} leads the way.\n` +
          `With ${pronoun} dancing and singing,\n` +
          `${possessivePronoun} smile shines so bright.\n` +
          `With melodies flowing,\n` +
          `Creating magic today!`
        : `Twinkle twinkle little star,\n` +
          `${name} wonders who you are.\n` +
          `Up above the world so high,\n` +
          `Like a diamond in the sky.\n` +
          `Twinkle twinkle little star,\n` +
          `${name} knows just how special you are.`;
      
      return fallbackLyrics;
    } catch (error) {
      console.error('Error generating fallback lyrics:', error);
      // Ultimate fallback if everything else fails
      return `Twinkle twinkle little star,\n` +
        `${name} wonders who you are.\n` +
        `Up above the world so high,\n` +
        `Like a diamond in the sky.\n` +
        `Twinkle twinkle little star,\n` +
        `${name} knows just how special you are.`;
    }
  }
}

export const logLyricGenerationError = async (
  error: string,
  params: LyricGenerationParams
) => {
  try {
    await supabase.from('lyric_generation_errors').insert([
      {
        error_message: error,
        theme: params.theme,
        mood: params.mood,
        song_type: params.songType,
        preset_type: params.presetType,
        has_user_input: !!params.userInput,
      }
    ]);
  } catch (logError) {
    console.error('Failed to log lyric generation error:', {
      originalError: error,
      logError,
    });
  }
};