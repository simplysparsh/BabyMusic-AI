import { MusicMood, Instrument } from '../types';
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

const getInstrumentPrompt = (instrument: Instrument) => {
  const prompts = {
    piano: 'Bright piano with rhythmic patterns',
    harp: 'Dynamic harp with playful melodies',
    strings: 'Energetic string ensemble',
    whiteNoise: 'Rhythmic white noise patterns',
  };
  return prompts[instrument];
};

const getLyricsPrompt = (lyrics: string, language: Language) => {
  return `children's song: ${lyrics}`;
};

export const createMusicGenerationTask = async (
  mood: MusicMood, 
  instrument?: Instrument,
  lyrics?: string
) => {
  console.log('Creating music generation task:', { mood, instrument });

  const moodPrompt = getMoodPrompt(mood);
  const instrumentPrompt = instrument ? getInstrumentPrompt(instrument) : '';
  const lyricsPrompt = lyrics ? getLyricsPrompt(lyrics) : '';

  // Keep base description concise
  const baseDescription = `${moodPrompt}${instrument ? `. ${instrumentPrompt}` : ''}`;
  const maxLyricsLength = 200 - baseDescription.length - 2; // 2 for ". " separator
  
  // Truncate lyrics if needed
  const truncatedLyrics = lyrics 
    ? `. ${lyricsPrompt.length > maxLyricsLength 
        ? lyricsPrompt.slice(0, maxLyricsLength - 3) + '...' 
        : lyricsPrompt}`
    : '';
  
  const description = `${baseDescription}${truncatedLyrics}`;

  // Set appropriate title based on the description
  const isPlaytime = description.toLowerCase().includes('playtime');
  const isMealtime = description.toLowerCase().includes('mealtime');
  const isBedtime = description.toLowerCase().includes('bedtime');
  const isPotty = description.toLowerCase().includes('potty');

  let title;
  if (isPlaytime) {
    title = 'Playtime Song';
  } else if (isMealtime) {
    title = 'Mealtime Song';
  } else if (isBedtime) {
    title = 'Bedtime Song';
  } else if (isPotty) {
    title = 'Flush Symphony';
  } else {
    title = instrument ? `${mood} ${instrument} melody` : `${mood} melody`;
  }

  const tags = `${mood}, children's music`;
  
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