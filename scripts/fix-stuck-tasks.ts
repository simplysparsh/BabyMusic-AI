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

async function fixStuckTasks() {
  console.log('Fixing songs that might be stuck in a generating state...');

  // Find songs that have task IDs but no audio URL and no error, and are older than 5 minutes
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

  // Filter songs that are older than 5 minutes
  const now = new Date();
  const oldStuckSongs = stuckSongs.filter(song => {
    const createdAt = new Date(song.created_at);
    const ageInMinutes = Math.floor((now.getTime() - createdAt.getTime()) / (1000 * 60));
    return ageInMinutes > 5;
  });

  console.log(`Found ${oldStuckSongs.length} songs that are stuck in a generating state for more than 5 minutes.`);

  // Update each stuck song
  for (const song of oldStuckSongs) {
    console.log(`Fixing stuck song: ${song.name} (${song.id})`);
    
    // Update the song to mark it as failed and clear the task ID
    const { error: updateError } = await supabase
      .from('songs')
      .update({
        task_id: null,
        error: 'Generation timed out after 5 minutes',
        retryable: true
      })
      .eq('id', song.id);
    
    if (updateError) {
      console.error(`Error updating song ${song.id}:`, updateError);
    } else {
      console.log(`Successfully updated song ${song.id}`);
    }
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

  // Update each song with audio but still has task ID
  for (const song of incompleteWithAudio) {
    console.log(`Fixing song with audio: ${song.name} (${song.id})`);
    
    // Update the song to clear the task ID since it already has audio
    const { error: updateError } = await supabase
      .from('songs')
      .update({
        task_id: null
      })
      .eq('id', song.id);
    
    if (updateError) {
      console.error(`Error updating song ${song.id}:`, updateError);
    } else {
      console.log(`Successfully updated song ${song.id}`);
    }
  }

  console.log('Done!');
}

// Run the function
fixStuckTasks().catch(console.error); 