import { createClient } from '@supabase/supabase-js';
import fetch from 'node-fetch';
import * as dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name of the current module
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const {
  VITE_SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY,
  VITE_PIAPI_KEY,
  VITE_WEBHOOK_SECRET
} = process.env;

if (!VITE_SUPABASE_URL) throw new Error('VITE_SUPABASE_URL is required');
if (!SUPABASE_SERVICE_ROLE_KEY) throw new Error('SUPABASE_SERVICE_ROLE_KEY is required');
if (!VITE_PIAPI_KEY) throw new Error('VITE_PIAPI_KEY is required');
if (!VITE_WEBHOOK_SECRET) throw new Error('VITE_WEBHOOK_SECRET is required');

const supabase = createClient(VITE_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// Types matching the application schema
type MusicMood = 'calm' | 'playful' | 'learning' | 'energetic';
type ThemeType = 
  | 'pitchDevelopment' 
  | 'cognitiveSpeech' 
  | 'sleepRegulation'
  | 'socialEngagement' 
  | 'indianClassical' 
  | 'westernClassical';
type SongType = 'preset' | 'theme' | 'theme-with-input' | 'from-scratch';
type PresetType = 'playing' | 'eating' | 'sleeping' | 'pooping';

// PIAPI API types
interface SunoClip {
  id: string;
  status: string;
  audio_url: string;
  title?: string;
  metadata?: {
    prompt?: string;
    tags?: string;
  };
}

interface SunoResponse {
  task_id: string;
  model: string;
  task_type: string;
  status: string;
  clips: SunoClip[];
}

// Retry utility function for database operations
const withRetry = async <T>(operation: () => Promise<T>, maxRetries = 3, timeoutMs = 2000): Promise<T> => {
  let lastError: Error | null = null;
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;
      console.error(`Attempt ${attempt}/${maxRetries} failed:`, error);
      if (attempt < maxRetries) {
        const delay = Math.min(timeoutMs, attempt * 1000);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  throw lastError;
};

async function createTestUser() {
  const TEST_EMAIL = 'test-suno@example.com';
  const TEST_PASSWORD = 'test123456';
  
  // First, check if the user already exists
  const { data: users } = await supabase.auth.admin.listUsers();
  const existingUser = users.users.find(u => u.email === TEST_EMAIL);
  
  if (existingUser) {
    console.log('Test user already exists:', existingUser.id);
    return existingUser;
  }
  
  // Create a new test user
  const { data, error } = await supabase.auth.admin.createUser({
    email: TEST_EMAIL,
    password: TEST_PASSWORD,
    email_confirm: true
  });
  
  if (error) {
    console.error('Failed to create test user:', error);
    throw error;
  }
  
  console.log('Test user created successfully:', data.user.id);
  return data.user;
}

async function generateSong(userId: string, songOptions: {
  name: string;
  theme?: ThemeType;
  mood?: MusicMood;
  songType: SongType;
  presetType?: PresetType;
  isInstrumental?: boolean;
}) {
  // Initialize the request
  const API_URL = 'https://api.piapi.ai/api/v1';
  const WEBHOOK_URL = `${VITE_SUPABASE_URL}/functions/v1/piapi-webhook`;
  
  console.log('Generating song with options:', songOptions);
  
  // Insert a placeholder song in the database
  const { data: songData, error: songError } = await supabase
    .from('songs')
    .insert({
      name: songOptions.name,
      user_id: userId,
      theme: songOptions.theme,
      mood: songOptions.mood,
      song_type: songOptions.songType,
      preset_type: songOptions.presetType,
      is_instrumental: songOptions.isInstrumental || false,
      created_at: new Date().toISOString()
    })
    .select();
  
  if (songError) {
    console.error('Failed to create song in database:', songError);
    throw songError;
  }
  
  const songId = songData[0].id;
  console.log('Created song placeholder with ID:', songId);
  
  // Prepare description based on song type and theme
  const getDescription = () => {
    if (songOptions.songType === 'preset') {
      if (songOptions.presetType === 'sleeping') {
        return 'A gentle lullaby to help a baby sleep.';
      } else if (songOptions.presetType === 'playing') {
        return 'An upbeat song for playtime with a baby.';
      } else if (songOptions.presetType === 'eating') {
        return 'A calming melody for mealtime with a baby.';
      } else {
        return 'A soothing song for a baby.';
      }
    } else if (songOptions.theme) {
      if (songOptions.theme === 'sleepRegulation') {
        return 'A soothing lullaby designed to help with sleep regulation.';
      } else if (songOptions.theme === 'cognitiveSpeech') {
        return 'A song that encourages cognitive development and speech.';
      } else {
        return 'A developmental song for babies.';
      }
    } else {
      return 'A playful song for babies and toddlers.';
    }
  };
  
  // Construct the payload for the PIAPI API
  const payload = {
    model: 'music-s',
    task_type: 'generate_music_custom',
    config: {
      webhook_config: {
        endpoint: WEBHOOK_URL,
        secret: VITE_WEBHOOK_SECRET
      }
    },
    parameters: {
      title: songOptions.name,
      description: getDescription(),
      tags: `${songOptions.mood || 'calm'}, baby music, ${songOptions.isInstrumental ? 'instrumental' : 'vocals'}`,
      guidance_preset: 'STORYTELLING',
      variations_count: 2
    }
  };
  
  console.log('Sending API request with payload:', JSON.stringify(payload, null, 2));
  
  try {
    const response = await fetch(`${API_URL}/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': VITE_PIAPI_KEY || ''
      },
      body: JSON.stringify(payload)
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API request failed:', response.status, errorText);
      throw new Error(`API request failed: ${response.status} ${errorText}`);
    }
    
    const apiResponse = await response.json() as SunoResponse;
    console.log('API response:', apiResponse);
    
    // Update the song with the task ID
    const { error: updateError } = await supabase
      .from('songs')
      .update({
        task_id: apiResponse.task_id
      })
      .eq('id', songId);
    
    if (updateError) {
      console.error('Failed to update song with task ID:', updateError);
    } else {
      console.log('Song updated with task ID:', apiResponse.task_id);
    }
    
    return {
      songId,
      taskId: apiResponse.task_id
    };
  } catch (error) {
    console.error('Error generating song:', error);
    
    // Update the song with error
    await supabase
      .from('songs')
      .update({
        error: error instanceof Error ? error.message : 'Unknown error',
        retryable: true
      })
      .eq('id', songId);
    
    throw error;
  }
}

async function pollForCompletion(songId: string, intervalMs = 5000, timeoutMs = 300000) {
  console.log(`Polling for song ${songId} completion...`);
  const startTime = Date.now();
  
  while (Date.now() - startTime < timeoutMs) {
    // Check the song status
    const { data: song, error } = await supabase
      .from('songs')
      .select('id, audio_url, task_id, error')
      .eq('id', songId)
      .single();
    
    if (error) {
      console.error('Error checking song status:', error);
      await new Promise(resolve => setTimeout(resolve, intervalMs));
      continue;
    }
    
    if (song.audio_url) {
      console.log('Song generation completed!');
      console.log('Audio URL:', song.audio_url);
      
      // Check for variations
      const { data: variations, error: varError } = await supabase
        .from('song_variations')
        .select('id, audio_url, title, created_at')
        .eq('song_id', songId);
      
      if (!varError && variations && variations.length > 0) {
        console.log(`Found ${variations.length} variations:`);
        variations.forEach((v, i) => {
          console.log(`Variation ${i+1}:`, v.audio_url);
        });
      }
      
      return song;
    }
    
    if (song.error) {
      console.error('Song generation failed with error:', song.error);
      return song;
    }
    
    if (!song.task_id) {
      console.error('Song has no task ID but also no audio or error');
      return song;
    }
    
    console.log('Song still generating, checking again in', intervalMs / 1000, 'seconds...');
    await new Promise(resolve => setTimeout(resolve, intervalMs));
  }
  
  console.error('Timed out waiting for song generation');
  return null;
}

async function cleanupTestData(userId: string, songId: string) {
  console.log('Cleaning up test data...');
  
  if (songId) {
    const { error: deleteError } = await supabase
      .from('songs')
      .delete()
      .eq('id', songId);
    
    if (deleteError) {
      console.error('Failed to delete test song:', deleteError);
    } else {
      console.log('Test song deleted successfully');
    }
  }
  
  if (userId) {
    const { error: userError } = await supabase.auth.admin.deleteUser(userId);
    
    if (userError) {
      console.error('Failed to delete test user:', userError);
    } else {
      console.log('Test user deleted successfully');
    }
  }
}

async function runTest() {
  try {
    console.log('Starting PIAPI integration test...');
    
    // Create test user
    const user = await createTestUser();
    
    // Generate a song
    const { songId, taskId } = await generateSong(user.id, {
      name: 'Test Lullaby',
      mood: 'calm',
      theme: 'sleepRegulation',
      songType: 'theme',
      isInstrumental: false
    });
    
    console.log(`Generated song with ID ${songId} and task ID ${taskId}`);
    
    // Poll for completion (but don't wait more than 5 minutes)
    console.log('Waiting for song to be generated...');
    await pollForCompletion(songId);
    
    // Cleanup is optional - comment this out if you want to keep the test data
    // await cleanupTestData(user.id, songId);
    
    console.log('Test completed successfully');
  } catch (error) {
    console.error('Test failed:', error);
  }
}

runTest(); 