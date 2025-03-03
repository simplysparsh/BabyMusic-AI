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

// Song ID to update
const songId = '005d66f1-d43d-4550-8e20-1a17a65c2548';

// Audio URL to set
const audioUrl = 'https://example.com/audio.mp3';

async function updateSongAudio() {
  console.log(`Updating song ${songId} with audio URL: ${audioUrl}`);

  // First, fetch the song to make sure it exists
  const { data: song, error: fetchError } = await supabase
    .from('songs')
    .select('*')
    .eq('id', songId)
    .single();

  if (fetchError) {
    console.error('Error fetching song:', fetchError);
    return;
  }

  if (!song) {
    console.error(`Song with ID ${songId} not found`);
    return;
  }

  console.log('Found song:', song.name);

  // Update the song with the audio URL
  const { error: updateError } = await supabase
    .from('songs')
    .update({
      audio_url: audioUrl,
      task_id: null // Clear the task ID since we're manually setting the audio URL
    })
    .eq('id', songId);

  if (updateError) {
    console.error('Error updating song:', updateError);
    return;
  }

  console.log(`Successfully updated song ${songId} with audio URL`);
}

// Run the function
updateSongAudio().catch(console.error); 