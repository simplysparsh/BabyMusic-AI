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

async function checkStuckTasks() {
  console.log('Checking for songs that might be stuck in a generating state...');

  // Find songs that have task IDs but no audio URL and no error
  const { data: generatingSongs, error: generatingError } = await supabase
    .from('songs')
    .select('id, name, created_at, task_id')
    .is('audio_url', null)
    .is('error', null)
    .not('task_id', 'is', null);

  if (generatingError) {
    console.error('Error fetching generating songs:', generatingError);
    return;
  }

  console.log(`Found ${generatingSongs.length} songs that might be stuck in a generating state.`);

  // Sort by creation date (oldest first)
  generatingSongs.sort((a, b) => 
    new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  );

  // Display information about each song
  for (const song of generatingSongs) {
    const createdAt = new Date(song.created_at);
    const now = new Date();
    const ageInMinutes = Math.floor((now.getTime() - createdAt.getTime()) / (1000 * 60));
    
    console.log(`Song: ${song.name} (${song.id})`);
    console.log(`  Created: ${createdAt.toLocaleString()} (${ageInMinutes} minutes ago)`);
    console.log(`  Task ID: ${song.task_id}`);
    
    // Check if the song is older than 5 minutes (likely stuck)
    if (ageInMinutes > 5) {
      console.log(`  LIKELY STUCK (older than 5 minutes)`);
    }
    
    console.log('');
  }

  // Find songs that have audio URLs but still have task IDs
  const { data: incompleteWithAudio, error: incompleteError } = await supabase
    .from('songs')
    .select('id, name, audio_url, task_id')
    .not('audio_url', 'is', null)
    .not('task_id', 'is', null);

  if (incompleteError) {
    console.error('Error fetching incomplete songs with audio:', incompleteError);
    return;
  }

  console.log(`Found ${incompleteWithAudio.length} songs with audio URLs but still have task IDs.`);

  // Display information about each song
  for (const song of incompleteWithAudio) {
    console.log(`Song: ${song.name} (${song.id})`);
    console.log(`  Has audio URL: ${!!song.audio_url}`);
    console.log(`  Task ID: ${song.task_id || 'null'}`);
    console.log('');
  }

  console.log('Done!');
}

// Run the function
checkStuckTasks().catch(console.error); 