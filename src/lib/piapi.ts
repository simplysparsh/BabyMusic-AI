import { MusicGenerationParams } from '../types';
import { LyricGenerationService } from '../services/lyricGenerationService';
import { SongPromptService } from '../services/songPromptService';

const API_URL = 'https://api.piapi.ai/api/v1';
const API_KEY = import.meta.env.VITE_PIAPI_KEY;

const PIAPI_LIMITS = {
  PROMPT_MAX_LENGTH: 1000,
  DESCRIPTION_MAX_LENGTH: 10000,
  NEGATIVE_TAGS_MAX_LENGTH: 100,
};

// Edge Function URL with anon key for authentication
const WEBHOOK_URL = `${
  import.meta.env.VITE_SUPABASE_URL
}/functions/v1/piapi-webhook`;

const headers = {
  'Content-Type': 'application/json',
  'x-api-key': API_KEY,
};

export const createMusicGenerationTask = async ({
  theme,
  mood,
  userInput,
  name,
  gender,
  ageGroup,
  tempo,
  isInstrumental,
  songType,
  voice,
  preset_type,
}: MusicGenerationParams): Promise<string> => {
  const babyName = name || 'little one';

  // Get base description and title using SongPromptService
  const baseDescription = SongPromptService.getBaseDescription({
    theme,
    mood,
    songType,
    presetType: preset_type,
    voice,
    isInstrumental
  });

  const title = SongPromptService.generateTitle({
    theme,
    mood,
    babyName,
    isInstrumental,
    songType,
    presetType: preset_type
  });

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
        presetType: preset_type,
        gender
      });
    } catch (error) {
      console.error('Lyrics generation failed, using fallback:', error);
      generatedLyrics = await LyricGenerationService.getFallbackLyrics({
        babyName,
        theme,
        mood,
        presetType: preset_type,
        songType,
        gender
      });
    }
  }

  const description = `${baseDescription}`;
  
  const truncateToLimit = (text: string, maxLength: number): string => {
    return text.length > maxLength ? text.slice(0, maxLength) : text;
  };
  
  // Use generated lyrics as the prompt for music generation
  const promptWithLyrics = generatedLyrics || '';

  // ##### Calls API to generate music #####
  // Determine lyrics_type based on whether the song is instrumental
  const lyricsType = isInstrumental ? 'instrumental' : 'user';

  // Construct the input object based on the new API structure
  const inputPayload: Record<string, any> = {
    gpt_description_prompt: truncateToLimit(description, PIAPI_LIMITS.DESCRIPTION_MAX_LENGTH),
    lyrics_type: lyricsType,
    negative_tags: truncateToLimit('rock, metal, aggressive, harsh', PIAPI_LIMITS.NEGATIVE_TAGS_MAX_LENGTH),
    seed: -1, // Add seed parameter as per new API examples
    title: title // Add the generated title here
  };

  // Only add lyrics as prompt for non-instrumental songs
  if (!isInstrumental) {
    inputPayload.prompt = truncateToLimit(promptWithLyrics, PIAPI_LIMITS.PROMPT_MAX_LENGTH);
  }

  const requestBody = {
    model: 'music-u',
    task_type: 'generate_music',
    config: {
      webhook_config: {
        endpoint: WEBHOOK_URL,
        secret: import.meta.env.VITE_WEBHOOK_SECRET,
        // Removed secret_header and include_output
      },
    },
    input: inputPayload, // Use the structured input payload
  };

  // Log the complete input being sent to PIAPI (adjusted for new structure)
  console.log('================ PIAPI REQUEST (music-u) ================');
  console.log('Song Type:', songType);
  console.log('Theme:', theme);
  console.log('Mood:', mood);
  console.log('Preset Type:', preset_type);
  console.log('Voice:', voice);
  console.log('Gender:', gender);
  console.log('Is Instrumental:', isInstrumental);
  console.log('Base Description (gpt_description_prompt):', inputPayload.gpt_description_prompt);
  console.log('Title (Sent to API):', title);
  if (!isInstrumental) {
    console.log('Prompt (Lyrics):', (inputPayload.prompt as string).substring(0, 200) + ((inputPayload.prompt as string).length > 200 ? '...' : ''));
  }
  console.log('Lyrics Type:', inputPayload.lyrics_type);
  console.log('Negative Tags:', inputPayload.negative_tags);
  console.log('Seed:', inputPayload.seed);
  console.log('Full Request Body:', JSON.stringify(requestBody, (key, value) => 
    key === 'secret' ? '***' : value, 2));
  console.log('=========================================================');

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

      // Check for common API key issues
      if (response.status === 401 || errorMessage.includes('auth') || errorMessage.includes('key')) {
        console.error('API KEY ISSUE DETECTED:', {
          status: response.status,
          message: errorMessage,
          apiKeyLength: API_KEY ? API_KEY.length : 0,
          apiKeyDefined: !!API_KEY
        });
      }

      console.error('API Error Details:', {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        message: errorMessage,
        url: API_URL,
        apiKeyDefined: !!API_KEY,
        webhookUrlDefined: !!WEBHOOK_URL,
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