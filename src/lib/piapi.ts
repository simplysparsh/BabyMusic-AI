import { MusicMood, ThemeType, PresetType, MusicGenerationParams, Tempo, AgeGroup, VoiceType } from '../types';
import { supabase } from './supabase';
import { PRESET_CONFIGS } from '../data/lyrics/presets';
import { THEME_CONFIGS } from '../data/lyrics/themes';
import { LyricGenerationService } from '../services/lyricGenerationService';
import { SongPromptService } from '../services/songPromptService';

const API_URL = 'https://api.piapi.ai/api/v1';
const API_KEY = import.meta.env.VITE_PIAPI_KEY;
const WEBHOOK_SECRET = import.meta.env.VITE_WEBHOOK_SECRET;

const PIAPI_LIMITS = {
  PROMPT_MAX_LENGTH: 3000,
  TAGS_MAX_LENGTH: 200,
};

// Edge Function URL with anon key for authentication
const WEBHOOK_URL = `${
  import.meta.env.VITE_SUPABASE_URL
}/functions/v1/piapi-webhook`;

const headers = {
  'Content-Type': 'application/json',
  'x-api-key': API_KEY,
};

const getThemeDescription = (theme: ThemeType) => {
  const prompts = {
    pitchDevelopment: 'Melodic patterns for pitch recognition training',
    cognitiveSpeech: 'Clear rhythmic patterns for speech development',
    sleepRegulation: 'Gentle lullaby with soothing patterns',
    socialEngagement: 'Interactive melody for social bonding',
    indianClassical:
      'Peaceful Indian classical melody with gentle ragas and traditional elements',
    westernClassical: 'Adapted classical melodies for babies',
  };

  if (!theme || !prompts[theme]) {
    throw new Error(`Invalid theme: ${theme}`);
  }

  return prompts[theme];
};

/**
 * Get the base prompt for a given mood
 */
const getMoodPrompt = (mood: MusicMood): string => {
  return `Create a ${mood} children's song that is engaging and age-appropriate`;
};

/**
 * Get the base prompt for a given theme
 */
const getThemePrompt = (theme: ThemeType): string => {
  switch (theme) {
    case 'pitchDevelopment':
      return 'Create a children\'s song focused on pitch recognition and vocal development';
    case 'cognitiveSpeech':
      return 'Create a children\'s song that encourages speech development and cognitive learning';
    case 'sleepRegulation':
      return 'Create a gentle lullaby to help with sleep regulation';
    case 'socialEngagement':
      return 'Create a children\'s song that promotes social interaction and emotional development';
    case 'indianClassical':
      return 'Create a children\'s song incorporating Indian classical music elements';
    case 'westernClassical':
      return 'Create a children\'s song incorporating Western classical music elements';
    default:
      return 'Create an engaging children\'s song';
  }
};

const getThemeTitle = (theme: ThemeType, babyName: string): string => {
  const themeNames = {
    pitchDevelopment: "Musical Journey",
    cognitiveSpeech: "Speaking Adventure",
    sleepRegulation: "Sleepy Time",
    socialEngagement: "Friendship Song",
    indianClassical: "Indian Melody",
    westernClassical: "Classical Journey"
  };
  const now = new Date();
  const version = now.getTime();
  return `${babyName}'s ${themeNames[theme]} (v${Math.floor((version % 1000000) / 100000)})`;
};

const getCustomTitle = (mood: MusicMood, babyName: string, isInstrumental: boolean): string => {
  const moodNames = {
    calm: "Peaceful",
    playful: "Playful",
    learning: "Learning",
    energetic: "Energetic"
  };
  const now = new Date();
  const version = now.getTime();
  return isInstrumental 
    ? `${babyName}'s ${moodNames[mood]} Melody (v${Math.floor((version % 1000000) / 100000)})`
    : `${babyName}'s ${moodNames[mood]} Song (v${Math.floor((version % 1000000) / 100000)})`;
};

export const createMusicGenerationTask = async ({
  theme,
  mood,
  userInput,
  name,
  ageGroup,
  tempo,
  isInstrumental,
  songType,
  voice,
  preset_type,
}: MusicGenerationParams): Promise<string> => {
  console.log('Creating music generation task:', { 
    theme, 
    mood, 
    name, 
    songType,
    preset_type 
  });
    
  const babyName = name || 'little one';
  
  // Get base description and title using SongPromptService
  const baseDescription = SongPromptService.getBaseDescription({
    theme,
    mood,
    songType,
    presetType: preset_type
  });

  const title = SongPromptService.generateTitle({
    theme,
    mood,
    babyName,
    isInstrumental,
    songType,
    presetType: preset_type
  });

  console.log('Song configuration:', { title, baseDescription });

  // Generate lyrics if needed
  let generatedLyrics = '';
  if (!isInstrumental) {
    try {
      generatedLyrics = await LyricGenerationService.generateLyrics({
        babyName,
        theme,
        mood,
        tempo,
        ageGroup,
        userInput,
        songType,
        presetType: preset_type
      });
    } catch (error) {
      console.error('Lyrics generation failed, using fallback:', error);
      generatedLyrics = await LyricGenerationService.getFallbackLyrics({
        babyName,
        theme,
        mood,
        presetType: preset_type,
        songType
      });
      console.log('Successfully applied fallback lyrics');
    }
  }


  const description = `${baseDescription}`;

  const tags = theme 
    ? `${theme}, children's music` 
    : songType === 'from-scratch' && mood
      ? `${mood}, children's music${voice ? `, ${voice}` : ''}`
      : `children's music${voice ? `, ${voice}` : ''}`;

  // Use generated lyrics as the prompt for music generation
  const finalPrompt = generatedLyrics || '';
  
  const truncateToLimit = (text: string, maxLength: number): string => {
    return text.length > maxLength ? text.slice(0, maxLength) : text;
  };
  
  const truncatedPrompt = truncateToLimit(finalPrompt, PIAPI_LIMITS.PROMPT_MAX_LENGTH);
  const truncatedTags = truncateToLimit(description, PIAPI_LIMITS.TAGS_MAX_LENGTH);

  console.log('Final request configuration:', {
    title,
    description: truncatedTags.slice(0, 50) + '...',
    tags,
    isInstrumental,
    hasPrompt: !!truncatedPrompt,
    promptLength: truncatedPrompt.length,
  });

  // ##### Calls API to generate music #####
  const requestBody = {
    model: 'music-s',
    task_type: 'generate_music_custom',
    config: {
      webhook_config: {
        endpoint: WEBHOOK_URL,
        secret: import.meta.env.VITE_WEBHOOK_SECRET,
        include_output: true,
      },
    },
    input: {
      title: title,
      prompt: truncatedPrompt,
      tags: truncatedTags,
      make_instrumental: isInstrumental || false,
      negative_tags: 'rock, metal, aggressive, harsh',
      // Use mood and tempo as provided by SongService
      ...(mood && { mood }),
      ...(tempo && { tempo })
    },
  };

  console.log('Sending API request:', {
    songType,
    userInput: userInput ? 'provided' : 'not provided',
    promptLength: finalPrompt.length,
    title,
    tags: description,
    isInstrumental,
    requestBody: {
      ...requestBody,
      config: {
        ...requestBody.config,
        webhook_config: {
          ...requestBody.config.webhook_config,
          secret: '***' // Hide secret
        }
      }
    }
  });

  try {
    const response = await fetch(`${API_URL}/task`, {
      method: 'POST',
      headers: {
        ...headers,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', errorText);
      let errorMessage = 'Failed to create music generation task';

      try {
        const errorData = JSON.parse(errorText);
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch (parseError) {
        // If parsing fails, use the raw error text if it exists
        console.error('Failed to parse error response:', parseError);
        errorMessage = errorText || errorMessage;
      }

      console.error('API Error Details:', {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        message: errorMessage,
        url: API_URL,
        requestBody: {
          ...requestBody,
          config: {
            ...requestBody.config,
            webhook_config: {
              ...requestBody.config.webhook_config,
              secret: '***'
            }
          }
        }
      });

      // Provide user-friendly error messages based on status codes
      if (response.status === 401) {
        throw new Error('Authentication failed. Please check your API key.');
      } else if (response.status === 429) {
        throw new Error('Too many requests. Please try again later.');
      } else if (response.status >= 500) {
        throw new Error(
          'Music generation service is temporarily unavailable. Please try again later.'
        );
      } else {
        throw new Error(`Failed to create music: ${errorMessage}`);
      }
    }

    const data = await response.json();
    console.log('API Response:', {
      data,
      status: response.status,
      headers: Object.fromEntries(response.headers.entries())
    });

    if (!data.data?.task_id) {
      console.error('Missing task_id in response:', data);
      throw new Error('Failed to start music generation: No task ID returned');
    }
    return data.data.task_id as string;
  } catch (error) {
    console.error('Music generation request failed:', error);
    throw error;
  }
};