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

// Partial song type for query results
type SongQueryResult = Partial<DatabaseSong>;

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

async function listSongs() {
  console.log('Listing songs in the database...');

  try {
    // Fetch all songs
    const { data: songs, error } = await withRetry(async () => {
      const response = await supabase
        .from('songs')
        .select(`
          id, 
          name, 
          audio_url, 
          task_id, 
          created_at, 
          error, 
          song_type, 
          preset_type, 
          mood, 
          theme, 
          is_instrumental,
          user_id,
          retryable
        `)
        .order('created_at', { ascending: false })
        .limit(20);
      return response;
    });

    if (error) {
      console.error('Error fetching songs:', error);
      return;
    }

    if (!songs || songs.length === 0) {
      console.log('No songs found in the database.');
      return;
    }

    console.log(`Found ${songs.length} songs:`);
    console.log('----------------------------');

    songs.forEach((song, index) => {
      const createdDate = new Date(song.created_at);
      const songStatus = getSongStatus(song);
      
      console.log(`${index + 1}. ${song.name} (${song.id})`);
      console.log(`   Type: ${song.song_type || 'Unknown'}${song.preset_type ? ` (${song.preset_type})` : ''}${song.is_instrumental ? ' [Instrumental]' : ''}`);
      console.log(`   Theme/Mood: ${song.theme || 'N/A'} / ${song.mood || 'N/A'}`);
      console.log(`   Created: ${createdDate.toLocaleString()}`);
      console.log(`   Status: ${songStatus}`);
      
      if (song.audio_url) {
        console.log(`   Audio: ${song.audio_url}`);
      }
      
      if (song.task_id) {
        console.log(`   Task ID: ${song.task_id}`);
      }
      
      if (song.error) {
        console.log(`   Error: ${song.error}`);
      }
      
      console.log('');
    });

    console.log('----------------------------');
  } catch (error) {
    console.error('An unexpected error occurred:', error);
  }
}

// Determine song status based on its properties
function getSongStatus(song: SongQueryResult): string {
  if (song.error) {
    return `Failed (${song.retryable ? 'Retryable' : 'Not Retryable'})`;
  }
  
  if (song.audio_url) {
    return 'Completed';
  }
  
  if (song.task_id) {
    return 'Generating';
  }
  
  return 'Unknown';
}

// Run the function
listSongs(); 