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

async function fixStuckTasks() {
  console.log('Fixing songs that might be stuck in a generating state...');

  try {
    // Find songs that have task IDs but no audio URL and no error
    const { data: stuckSongs, error: stuckError } = await supabase
      .from('songs')
      .select('id, name, created_at, task_id')
      .is('audio_url', null)
      .is('error', null)
      .not('task_id', 'is', null);

    if (stuckError) {
      console.error('Error fetching stuck songs:', stuckError);
      return;
    }

    if (!stuckSongs || stuckSongs.length === 0) {
      console.log('No stuck songs found that need fixing.');
      return;
    }

    // Filter songs that are older than 5 minutes
    const now = new Date();
    const oldStuckSongs = stuckSongs.filter(song => {
      const createdAt = new Date(song.created_at);
      const ageInMinutes = Math.floor((now.getTime() - createdAt.getTime()) / (1000 * 60));
      return ageInMinutes > 5;
    });

    if (oldStuckSongs.length === 0) {
      console.log('No songs found that have been stuck for more than 5 minutes.');
      return;
    }

    console.log(`Found ${oldStuckSongs.length} songs that have been stuck for more than 5 minutes.`);

    // Fix each stuck song
    for (const song of oldStuckSongs) {
      console.log(`Fixing song: ${song.name} (${song.id})`);
      
      try {
        const { error: updateError } = await withRetry(async () => {
          const response = await supabase
            .from('songs')
            .update({
              task_id: null,
              error: 'Song generation timed out after 5 minutes',
              retryable: true
            })
            .eq('id', song.id);
          return response;
        });

        if (updateError) {
          console.error(`Error updating song ${song.id}:`, updateError);
        } else {
          console.log(`Successfully reset song ${song.id}`);
        }
      } catch (err) {
        console.error(`Failed to fix song ${song.id}:`, err);
      }
    }

    // Find songs that have audio URLs but still have task IDs
    const { data: songsWithAudio, error: audioError } = await supabase
      .from('songs')
      .select('id, name, audio_url, task_id')
      .not('audio_url', 'is', null)
      .not('task_id', 'is', null);

    if (audioError) {
      console.error('Error fetching songs with audio URLs:', audioError);
      return;
    }

    if (songsWithAudio && songsWithAudio.length > 0) {
      console.log(`Found ${songsWithAudio.length} songs with audio URLs that still have task IDs.`);
      
      // Clear task IDs for these songs
      for (const song of songsWithAudio) {
        console.log(`Clearing task ID for song: ${song.name} (${song.id})`);
        
        try {
          const { error: updateError } = await withRetry(async () => {
            const response = await supabase
              .from('songs')
              .update({
                task_id: null
              })
              .eq('id', song.id);
            return response;
          });

          if (updateError) {
            console.error(`Error clearing task ID for song ${song.id}:`, updateError);
          } else {
            console.log(`Successfully cleared task ID for song ${song.id}`);
          }
        } catch (err) {
          console.error(`Failed to clear task ID for song ${song.id}:`, err);
        }
      }
    } else {
      console.log('No songs found with audio URLs that still have task IDs.');
    }

    console.log('Fix operation completed.');
  } catch (error) {
    console.error('An unexpected error occurred:', error);
  }
}

// Run the fix operation
fixStuckTasks(); 