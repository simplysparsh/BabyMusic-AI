import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';
import { SongService } from '../src/services/songService';

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
const supabaseClient = createClient(supabaseUrl, supabaseKey);

async function fixTaskIds() {
  console.log('Checking for songs with task ID issues...');

  // 1. Find songs with audio URLs but still have task IDs
  // These should have their task IDs cleared since they're completed
  const { data: completedWithTaskIds, error: completedError } = await supabaseClient
    .from('songs')
    .select('id, name, audio_url, task_id')
    .not('audio_url', 'is', null)
    .not('task_id', 'is', null);

  if (completedError) {
    console.error('Error fetching completed songs with task IDs:', completedError);
    return;
  }

  console.log(`Found ${completedWithTaskIds.length} completed songs that still have task IDs.`);

  // Update each completed song to clear task ID
  for (const song of completedWithTaskIds) {
    console.log(`Updating completed song: ${song.name} (${song.id})`);
    try {
      await SongService.resetSongState(song.id, {
        task_id: null,
        audio_url: song.audio_url // Preserve the audio URL
      });
      console.log(`  Cleared task ID for completed song ${song.id}`);
    } catch (error) {
      console.error(`Error updating song ${song.id}:`, error);
    }
  }

  // 2. Find songs with errors but still have task IDs
  const { data: failedWithTaskIds, error: failedError } = await supabaseClient
    .from('songs')
    .select('id, name, error, task_id')
    .not('error', 'is', null)
    .not('task_id', 'is', null);

  if (failedError) {
    console.error('Error fetching failed songs with task IDs:', failedError);
    return;
  }

  console.log(`Found ${failedWithTaskIds.length} failed songs that still have task IDs.`);

  // Update each failed song
  for (const song of failedWithTaskIds) {
    console.log(`Updating failed song: ${song.name} (${song.id})`);
    try {
      await SongService.updateSongWithError(song.id, song.error, {
        retryable: true,
        clearTaskId: true,
        clearAudioUrl: false
      });
      console.log(`  Updated failed song ${song.id}`);
    } catch (error) {
      console.error(`Error updating song ${song.id}:`, error);
    }
  }

  // 3. Find songs with old task IDs (older than 5 minutes) that are still in generating state
  const { data: generatingSongs, error: generatingError } = await supabaseClient
    .from('songs')
    .select('id, name, created_at, task_id')
    .is('audio_url', null)
    .is('error', null)
    .not('task_id', 'is', null);

  if (generatingError) {
    console.error('Error fetching generating songs:', generatingError);
    return;
  }

  // Filter for songs older than 5 minutes
  const now = new Date();
  const stuckSongs = generatingSongs.filter(song => {
    const createdAt = new Date(song.created_at);
    const ageInMinutes = Math.floor((now.getTime() - createdAt.getTime()) / (1000 * 60));
    return ageInMinutes > 5;
  });

  console.log(`Found ${stuckSongs.length} songs with old task IDs (older than 5 minutes).`);

  // Update each stuck song
  for (const song of stuckSongs) {
    console.log(`Updating stuck song: ${song.name} (${song.id})`);
    try {
      await SongService.updateSongWithError(song.id, 'Song generation timed out. Please try again.', {
        retryable: true,
        clearTaskId: true,
        clearAudioUrl: false
      });
      console.log(`  Updated stuck song ${song.id}`);
    } catch (error) {
      console.error(`Error updating song ${song.id}:`, error);
    }
  }

  console.log('Done!');
}

// Run the function
fixTaskIds().catch(console.error); 