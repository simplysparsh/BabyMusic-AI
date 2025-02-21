import { MusicMood, ThemeType } from '../types';
import { supabase } from './supabase';
import { PRESET_CONFIGS } from '../data/lyrics';
import { LyricGenerationService } from '../services/lyricGenerationService';

const API_URL = 'https://api.piapi.ai/api/v1';
const API_KEY = import.meta.env.VITE_PIAPI_KEY;
const WEBHOOK_SECRET = import.meta.env.VITE_WEBHOOK_SECRET;

const PIAPI_LIMITS = {
  PROMPT_MAX_LENGTH: 3000,
  TAGS_MAX_LENGTH: 200
};

// Edge Function URL with anon key for authentication
const WEBHOOK_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/piapi-webhook`;

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

const getMoodPrompt = (mood: MusicMood) => {
  const prompts = {
    calm: 'Soft, rhythmic melody with medium tempo',
    playful: 'Upbeat, bouncy tune with fun rhythm',
    learning: 'Catchy educational melody with clear beat',
    energetic: 'High-energy dance tune with strong rhythm',
  };
  return prompts[mood];
};

const getThemeDescription = (theme: ThemeType) => {
  const prompts = {
    pitchDevelopment: 'Melodic patterns for pitch recognition training',
    cognitiveSpeech: 'Clear rhythmic patterns for speech development',
    sleepRegulation: 'Gentle lullaby with soothing patterns',
    socialEngagement: 'Interactive melody for social bonding',
    indianClassical: 'Peaceful Indian classical melody with gentle ragas and traditional elements',
    westernClassical: 'Adapted classical melodies for babies'
  };
  return prompts[theme];
};

interface MusicGenerationParams {
  theme?: ThemeType;
  mood?: MusicMood;
  lyrics?: string;
  name?: string;
  ageGroup?: AgeGroup;
  tempo?: Tempo;
  isInstrumental?: boolean;
  hasUserIdeas?: boolean;
}

export const createMusicGenerationTask = async (params: MusicGenerationParams) => {
  const {
    theme,
    mood,
    lyrics,
    name,
    ageGroup,
    tempo,
    isInstrumental,
    hasUserIdeas
  } = params;

  console.log('Creating music generation task:', { 
    theme, 
    mood, 
    name,
    ageGroup,
    tempo,
    isInstrumental,
    hasUserIdeas,
    lyrics: lyrics ? 'provided' : 'not provided'
  });

  let baseDescription: string;
  let title = '';  // Initialize with empty string to ensure it's always a string
  let generatedLyrics: string | undefined;
  
  // Check if this is a preset song
  const presetType = name?.toLowerCase().includes('playtime') ? 'playing'
    : name?.toLowerCase().includes('mealtime') ? 'eating'
    : name?.toLowerCase().includes('bedtime') ? 'sleeping'
    : name?.toLowerCase().includes('potty') ? 'pooping'
    : undefined;

  if (presetType) {
    const config = PRESET_CONFIGS[presetType];
    baseDescription = config.description;
    mood = config.mood; // Use preset's defined mood
    title = name || '';
    
    // Generate lyrics for preset songs
    try {
      generatedLyrics = await LyricGenerationService.generateLyrics({
        babyName: name?.split("'")[0] || 'little one',
        theme: undefined,
        mood: config.mood,
        isPreset: true,
        presetType,
        ageGroup
      });
    } catch (error) {
      console.error('Failed to generate preset lyrics, using fallback:', error);
      generatedLyrics = config.lyrics(name?.split("'")[0] || 'little one');
    }
    
    console.log('Preset song configuration:', { title, presetType, mood: config.mood });
  }
  // Handle theme-based songs
  if (theme && !isPreset) {
    baseDescription = getThemeDescription(theme);
    const now = new Date();
    const version = `${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}-${now.getFullYear().toString().slice(-2)}`;
    
    // Use theme's predefined mood
    const themeConfig = THEME_CONFIGS[theme];
    const themeMood = themeConfig.mood;
    title = `${theme} v${version}`;
    console.log('Themed song configuration:', { title, theme, mood: themeMood });
  } 
  // Handle custom songs
  else if (!isPreset) {
    if (!mood) {
      throw new Error('Mood is required for custom songs');
    }
    baseDescription = getMoodPrompt(mood);
    title = name || `${mood} ${lyrics ? 'vocal' : 'instrumental'} melody`;
    console.log('Custom song configuration:', { title, mood, baseDescription });
  }

  if (!baseDescription) {
    throw new Error('Failed to generate song description');
  }

  // Generate lyrics if needed
  if (!isInstrumental && (theme || lyrics)) {
    try {
      generatedLyrics = await LyricGenerationService.generateLyrics({
        babyName: name || 'little one',
        theme,
        mood,
        tempo,
        ageGroup,
        userInput: lyrics,
        isCustom: !theme,
        hasUserIdeas
      });
    } catch (error) {
      console.error('Failed to generate lyrics:', error);
      throw new Error('Failed to generate lyrics. Please try again.');
    }
  }

  const maxLyricsLength = 200 - baseDescription.length - 2;

  // Handle lyrics truncation safely
  let truncatedLyrics = '';
  if (generatedLyrics) {
    truncatedLyrics = `. ${generatedLyrics.length > maxLyricsLength 
      ? generatedLyrics.slice(0, maxLyricsLength - 3) + '...' 
      : generatedLyrics}`;
  }
  
  const description = `${baseDescription}${truncatedLyrics}`;

  const tags = theme !== 'custom' ? `${theme}, children's music` : `${mood}, children's music`;
  
  // Ensure we don't exceed PIAPI limits
  const finalPrompt = generatedLyrics || lyrics || '';
  const truncatedPrompt = finalPrompt.length > PIAPI_LIMITS.PROMPT_MAX_LENGTH 
    ? finalPrompt.slice(0, PIAPI_LIMITS.PROMPT_MAX_LENGTH)
    : finalPrompt;

  const truncatedTags = description.length > PIAPI_LIMITS.TAGS_MAX_LENGTH
    ? description.slice(0, PIAPI_LIMITS.TAGS_MAX_LENGTH)
    : description;

  console.log('Final request configuration:', { 
    title,
    description: truncatedTags.slice(0, 50) + '...',
    tags,
    isInstrumental: !lyrics
  });

  // ##### Calls API to generate music #####
  const requestBody = {
    model: 'music-s',
    task_type: 'generate_music_custom', //Uses API mode to give lyrics, title, description.
    config: {
      webhook_config: {
        endpoint: WEBHOOK_URL,
        secret: import.meta.env.VITE_WEBHOOK_SECRET,
        include_output: true
      }
    },
    input: {
      title: title,
      prompt: truncatedPrompt,
      tags: truncatedTags,
      make_instrumental: isInstrumental || false,
      negative_tags: 'rock, metal, aggressive, harsh',
    }
  };

  console.log('Sending API request:', { 
    prompt: lyrics ? 'provided' : 'not provided',
    title,
    tags: description,
    isInstrumental,
    hasUserIdeas
  });

  const response = await fetch(`${API_URL}/task`, {
    method: 'POST',
    headers: {
      ...headers,
      'Content-Type': 'application/json'
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
      message: errorMessage
    });
    
    // Provide user-friendly error messages based on status codes
    if (response.status === 401) {
      throw new Error('Authentication failed. Please check your API key.');
    } else if (response.status === 429) {
      throw new Error('Too many requests. Please try again later.');
    } else if (response.status >= 500) {
      throw new Error('Music generation service is temporarily unavailable. Please try again later.');
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