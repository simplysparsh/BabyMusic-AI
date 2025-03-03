import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

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

async function listSongs() {
  console.log('Listing songs in the database...');

  // Fetch all songs
  const { data: songs, error } = await supabase
    .from('songs')
    .select('id, name, audio_url, task_id, created_at')
    .order('created_at', { ascending: false })
    .limit(20);

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

  // Display information about each song
  for (const song of songs) {
    console.log(`Song: ${song.name}`);
    console.log(`  ID: ${song.id}`);
    console.log(`  Created: ${new Date(song.created_at).toLocaleString()}`);
    console.log(`  Has audio URL: ${!!song.audio_url}`);
    if (song.audio_url) {
      console.log(`  Audio URL: ${song.audio_url}`);
    }
    console.log(`  Task ID: ${song.task_id || 'null'}`);
    console.log('----------------------------');
  }

  console.log('Done!');
}

// Run the function
listSongs().catch(console.error); 