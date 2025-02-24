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

interface CreateTaskResponse {
  task_id: string;
}

interface TaskStatus {
  status: 'pending' | 'processing' | 'completed' | 'failed';
  output?: {
    progress?: number;
    clips: {
      [key: string]: {
        id: string;
        audio_url?: string;
        image_url?: string;
        title?: string;
        metadata?: {
          tags?: string;
          prompt?: string;
        };
        error?: {
          message: string;
        };
      };
    };
  };
  error?: {
    message: string;
  };
}

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
  is_preset,
  preset_type,
}: MusicGenerationParams) => {
  console.log('Creating music generation task:', { 
    theme, 
    mood, 
    name, 
    songType,
    is_preset, 
    preset_type 
  });
    
  const babyName = name || 'little one';
  
  // Get base description and title using SongPromptService
  const baseDescription = SongPromptService.getBaseDescription({
    theme,
    mood,
    isPreset: is_preset,
    presetType: preset_type
  });

  const title = SongPromptService.generateTitle({
    theme,
    mood,
    babyName,
    isInstrumental,
    isPreset: is_preset,
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
        isPreset: is_preset,
        presetType: preset_type
      });
    } catch (error) {
      console.error('Lyrics generation failed, using fallback:', error);
      generatedLyrics = await LyricGenerationService.getFallbackLyrics({
        babyName,
        theme,
        mood,
        isPreset: is_preset,
        presetType: preset_type,
        songType
      });
      console.log('Successfully applied fallback lyrics');
    }
  }

  const maxLyricsLength = 200 - baseDescription.length - 2;

  // Handle lyrics truncation safely
  let truncatedLyrics = '';
  if (generatedLyrics) {
    truncatedLyrics = `. ${
      generatedLyrics.length > maxLyricsLength
        ? generatedLyrics.slice(0, maxLyricsLength - 3) + '...'
        : generatedLyrics
    }`;
  }

  const description = `${baseDescription}${truncatedLyrics}`;

  const tags = theme 
    ? `${theme}, children's music` 
    : songType === 'from-scratch' && mood
      ? `${mood}, children's music${voice ? `, ${voice}` : ''}`
      : `children's music${voice ? `, ${voice}` : ''}`;

  // Use generated lyrics as the prompt for music generation
  const finalPrompt = generatedLyrics || '';
  const truncatedPrompt =
    finalPrompt.length > PIAPI_LIMITS.PROMPT_MAX_LENGTH
      ? finalPrompt.slice(0, PIAPI_LIMITS.PROMPT_MAX_LENGTH)
      : finalPrompt;

  const truncatedTags =
    description.length > PIAPI_LIMITS.TAGS_MAX_LENGTH
      ? description.slice(0, PIAPI_LIMITS.TAGS_MAX_LENGTH)
      : description;

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
  });

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
    } catch {
      // If parsing fails, use the raw error text if it exists
      errorMessage = errorText || errorMessage;
    }

    console.error('API Error Details:', {
      status: response.status,
      headers: Object.fromEntries(response.headers.entries()),
      message: errorMessage,
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
      throw new Error(errorMessage);
    }
  }

  const data = await response.json();

  if (!data.data?.task_id) {
    throw new Error('Failed to start music generation. Please try again.');
  }
  return data.data.task_id as string;
};