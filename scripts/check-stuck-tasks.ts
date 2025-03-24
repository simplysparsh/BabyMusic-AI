import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

// Database song types that match the actual schema
type DatabaseSong = {
  id: string;
  name: string;
  theme?: string;
  mood?: string;
  voice_type?: string;
  tempo?: string;
  song_type?: 'preset' | 'theme' | 'theme-with-input' | 'from-scratch';
  lyrics?: string | null;
  created_at: string;
  user_id: string;
  audio_url?: string | null;
  user_lyric_input?: string | null;
  preset_type?: string | null;
  is_instrumental?: boolean;
  retryable?: boolean;
  error?: string | null;
  task_id?: string | null;
};

// Load environment variables from .env.local
const envLocalPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envLocalPath)) {
  dotenv.config({ path: envLocalPath });
} else {
  dotenv.config(); // Fallback to .env
  console.warn('Warning: .env.local file not found, using .env if available');
}

// Get Supabase credentials from environment variables
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

// Validate credentials
if (!supabaseUrl || !supabaseKey) {
  console.error('Error: Missing Supabase credentials in environment variables.');
  console.error('Please ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set in .env.local');
  process.exit(1);
}

// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

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

async function checkStuckTasks() {
  console.log('Checking for songs that might be stuck in a generating state...');
  
  try {
    // Find songs that have task IDs but no audio URL and no error
    const { data: generatingSongs, error: generatingError } = await withRetry(async () => {
      const response = await supabase
        .from('songs')
        .select('id, name, created_at, task_id, audio_url, error, user_id')
        .is('audio_url', null)
        .is('error', null)
        .not('task_id', 'is', null);
      return response;
    });

    if (generatingError) {
      console.error('Error fetching generating songs:', generatingError);
      return;
    }

    if (!generatingSongs || generatingSongs.length === 0) {
      console.log('No songs found that are stuck in a generating state.');
      return;
    }

    console.log(`Found ${generatingSongs.length} songs that might be stuck in a generating state.`);

    // Sort by creation date (oldest first)
    generatingSongs.sort((a, b) => 
      new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );

    // Display details about potentially stuck songs
    generatingSongs.forEach((song, index) => {
      const createdAt = new Date(song.created_at);
      const now = new Date();
      const ageInMinutes = Math.floor((now.getTime() - createdAt.getTime()) / (1000 * 60));
      
      console.log(`${index + 1}. Song ID: ${song.id}`);
      console.log(`   Name: ${song.name}`);
      console.log(`   Created: ${createdAt.toLocaleString()} (${ageInMinutes} minutes ago)`);
      console.log(`   Task ID: ${song.task_id}`);
      console.log('');
    });

    // Find songs with audio URLs that still have task IDs
    const { data: completedSongs, error: completedError } = await withRetry(async () => {
      const response = await supabase
        .from('songs')
        .select('id, name, task_id, audio_url, user_id, created_at')
        .not('audio_url', 'is', null)
        .not('task_id', 'is', null);
      return response;
    });

    if (completedError) {
      console.error('Error fetching completed songs with task IDs:', completedError);
      return;
    }

    if (completedSongs && completedSongs.length > 0) {
      console.log(`Found ${completedSongs.length} songs with audio URLs that still have task IDs:`);
      
      completedSongs.forEach((song, index) => {
        console.log(`${index + 1}. Song ID: ${song.id}`);
        console.log(`   Name: ${song.name}`);
        console.log(`   Task ID: ${song.task_id}`);
        console.log(`   Audio URL: ${song.audio_url}`);
        console.log('');
      });
    } else {
      console.log('No completed songs found that still have task IDs.');
    }

    console.log('Check completed.');
  } catch (error) {
    console.error('An unexpected error occurred:', error);
  }
}

// Run the check
checkStuckTasks(); 