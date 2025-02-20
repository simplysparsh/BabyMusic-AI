import { MusicMood, ThemeType } from '../types';
import { supabase } from './supabase';

const API_URL = 'https://api.piapi.ai/api/v1';
const API_KEY = import.meta.env.VITE_PIAPI_KEY;
const WEBHOOK_SECRET = import.meta.env.VITE_WEBHOOK_SECRET;

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

const getPresetTitle = (name: string) => {
  if (name.toLowerCase().includes('playtime')) return 'Playtime Song';
  if (name.toLowerCase().includes('mealtime')) return 'Mealtime Song';
  if (name.toLowerCase().includes('bedtime')) return 'Bedtime Song';
  if (name.toLowerCase().includes('potty')) return 'Potty Song';
  return name;
};

const getThemePrompt = (theme: ThemeType) => {
  const prompts = {
    pitchDevelopment: 'Melodic patterns for pitch recognition training',
    cognitiveSpeech: 'Clear rhythmic patterns for speech development',
    sleepRegulation: 'Gentle lullaby with soothing patterns',
    socialEngagement: 'Interactive melody for social bonding',
    musicalDevelopment: 'Progressive musical patterns for skill building',
    indianClassical: 'Simple Indian classical patterns',
    westernClassical: 'Adapted classical melodies for babies',
    custom: ''
  };
  return prompts[theme];
};

const getLyricsPrompt = (lyrics: string, language: Language) => {
  return `children's song: ${lyrics}`;
};

export const createMusicGenerationTask = async (
  theme?: ThemeType,
  mood?: MusicMood, 
  lyrics?: string,
  name?: string
) => {
  let baseDescription;
  let title;
  
  // Handle preset songs first
  if (name && (
    name.toLowerCase().includes('playtime') ||
    name.toLowerCase().includes('mealtime') ||
    name.toLowerCase().includes('bedtime') ||
    name.toLowerCase().includes('potty')
  )) {
    title = getPresetTitle(name);
    baseDescription = getMoodPrompt(mood || 'playful');
  } else if (theme && theme !== 'custom') {
    baseDescription = getThemePrompt(theme);
    title = `${theme} v${Math.floor(Math.random() * 900) + 100}`; // Generate version number
  } else {
    if (!mood) throw new Error('Mood is required for custom songs');
    baseDescription = getMoodPrompt(mood);
    title = `${mood} ${lyrics ? 'vocal' : 'instrumental'} melody`;
  }

  const lyricsPrompt = lyrics ? getLyricsPrompt(lyrics) : '';

  const maxLyricsLength = 200 - baseDescription.length - 2;
  
  // Truncate lyrics if needed
  const truncatedLyrics = lyrics 
    ? `. ${lyricsPrompt.length > maxLyricsLength 
        ? lyricsPrompt.slice(0, maxLyricsLength - 3) + '...' 
        : lyricsPrompt}`
    : '';
  
  const description = `${baseDescription}${truncatedLyrics}`;

  const tags = theme !== 'custom' ? `${theme}, children's music` : `${mood}, children's music`;
  
  const requestBody = {
    model: 'music-s',
    task_type: 'generate_music',
    service_mode: 'public',
    config: {
      webhook_config: {
        endpoint: WEBHOOK_URL,
        secret: import.meta.env.VITE_WEBHOOK_SECRET,
        include_output: true
      }
    },
    input: {
      title,
      gpt_description_prompt: description,
      tags,
      make_instrumental: !lyrics,
      negative_tags: 'rock, metal, aggressive, harsh',
    }
  };

  console.log('Sending API request:', { description, title });

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