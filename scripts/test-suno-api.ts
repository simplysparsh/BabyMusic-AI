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

// Suno API types
interface SunoClip {
  id: string;
  video_url: string;
  audio_url: string;
  image_url: string;
  image_large_url: string | null;
  status: string;
  title: string;
  metadata: {
    duration: number;
    error_type: string;
    error_message: string;
    // ... other metadata fields
  };
}

interface SunoResponse {
  task_id: string;
  model: string;
  task_type: string;
  status: string;
  config: {
    service_mode: string;
    webhook_config: {
      endpoint: string;
      secret: string;
    };
  };
  output: {
    clips: Record<string, SunoClip>;
  };
  meta: {
    created_at: string;
    started_at: string;
    ended_at: string;
    usage: {
      type: string;
      frozen: number;
      consume: number;
    };
    is_using_private_pool: boolean;
  };
  error: {
    code: number;
    raw_message: string;
    message: string;
    detail: null;
  };
}

// Test data
const TEST_EMAIL = 'test@example.com';
const TEST_PASSWORD = 'test123456';
let TEST_SONG_ID: string | null = null;

async function deleteTestUser() {
  // List all users to find our test user
  const { data: users, error: listError } = await supabase.auth.admin.listUsers();
  
  if (listError) {
    console.error('Failed to list users:', listError);
    return;
  }
  
  const testUser = users.users.find(u => u.email === TEST_EMAIL);
  if (testUser) {
    const { error: deleteError } = await supabase.auth.admin.deleteUser(testUser.id);
    if (deleteError) {
      console.error('Failed to delete test user:', deleteError);
    } else {
      console.log('Test user deleted successfully');
    }
  } else {
    console.log('No test user found to delete');
  }
}

async function setupTestData() {
  console.log('\n=== Setting up test data ===');
  
  // First clean up any existing test data
  await deleteTestUser();
  
  // Create a new test user
  const { data: { user }, error: signUpError } = await supabase.auth.admin.createUser({
    email: TEST_EMAIL,
    password: TEST_PASSWORD,
    email_confirm: true
  });

  if (signUpError) {
    throw new Error(`Failed to create test user: ${signUpError.message}`);
  }

  if (!user) {
    throw new Error('Failed to create test user: No user returned');
  }

  console.log('Created test user:', user.id);

  // Profile should be automatically created by the handle_new_user trigger
  // But let's verify it exists
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (profileError) {
    throw new Error(`Failed to verify profile: ${profileError.message}`);
  }

  console.log('Verified test profile:', profile);

  // Create test song in Supabase first
  const TEST_SONG = {
    song_type: 'preset',
    user_id: user.id,
    name: 'Real Suno API Test Song',
    theme: 'sleepRegulation',
    mood: 'calm',
    preset_type: 'sleeping',
    is_instrumental: false,
    retryable: false
  };

  // Create test song
  const { data: song, error: songError } = await supabase
    .from('songs')
    .insert(TEST_SONG)
    .select()
    .single();

  if (songError) {
    throw new Error(`Failed to create test song: ${songError.message}`);
  }

  TEST_SONG_ID = song.id;
  console.log('Created test song:', song);

  // Now create the song in Suno
  const sunoPayload = {
    prompt: "A gentle lullaby with soft piano and strings, perfect for helping babies fall asleep",
    mode: "melody",
    model_version: "v2",
    webhook_url: `${VITE_SUPABASE_URL}/functions/v1/piapi-webhook`,
    webhook_auth_header: "x-webhook-secret",
    webhook_auth_value: VITE_WEBHOOK_SECRET,
    reference_song: null,
    continuation_song: null,
    continuation_start: null,
    continuation_end: null,
    sample_rate: null,
    format: null,
    language: null,
    accent: null,
    top_k: null,
    top_p: null,
    temperature: null,
    classifier_free_guidance: null,
    output_format: null,
    interpolation_points: null
  };

  console.log('Creating song in Suno API...');
  const sunoResponse = await fetch('https://api.suno.ai/v1/generations', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${VITE_PIAPI_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(sunoPayload)
  });

  if (!sunoResponse.ok) {
    const error = await sunoResponse.text();
    throw new Error(`Suno API request failed: ${sunoResponse.status} ${sunoResponse.statusText}\n${error}`);
  }

  const sunoData = (await sunoResponse.json()) as SunoResponse;
  console.log('Suno API response:', sunoData);

  // Update our song with the task ID from Suno
  const { error: updateError } = await supabase
    .from('songs')
    .update({ task_id: sunoData.task_id })
    .eq('id', TEST_SONG_ID);

  if (updateError) {
    throw new Error(`Failed to update song with task_id: ${updateError.message}`);
  }

  console.log('Updated song with Suno task_id:', sunoData.task_id);
  return { user, song, sunoData };
}

async function waitForCompletion(timeoutMinutes = 5) {
  console.log('\n=== Waiting for song completion ===');
  const startTime = Date.now();
  const timeoutMs = timeoutMinutes * 60 * 1000;

  while (Date.now() - startTime < timeoutMs) {
    const { data: song } = await supabase
      .from('songs')
      .select('*')
      .eq('id', TEST_SONG_ID)
      .single();

    console.log('Current song state:', {
      id: song.id,
      task_id: song.task_id,
      audio_url: song.audio_url,
      error: song.error
    });

    if (song.error) {
      throw new Error(`Song generation failed: ${song.error}`);
    }

    if (song.audio_url && !song.task_id) {
      console.log('Song generation completed successfully!');
      return song;
    }

    // Wait 10 seconds before checking again
    await new Promise(resolve => setTimeout(resolve, 10000));
    console.log('Still waiting...');
  }

  throw new Error(`Timeout after ${timeoutMinutes} minutes`);
}

async function cleanupTestData() {
  console.log('\n=== Cleaning up test data ===');
  
  // Delete test song using song ID if available
  if (TEST_SONG_ID) {
    const { error: songError } = await supabase
      .from('songs')
      .delete()
      .eq('id', TEST_SONG_ID);

    if (songError) {
      console.error('Failed to cleanup test song:', songError);
    } else {
      console.log('Test song cleaned up successfully');
    }
  }

  // Delete test user
  await deleteTestUser();
}

async function main() {
  try {
    // Setup test data and create song
    const { sunoData } = await setupTestData();
    console.log('Test setup complete. Suno task_id:', sunoData.task_id);

    // Wait for completion
    const completedSong = await waitForCompletion();
    console.log('Final song state:', completedSong);

  } catch (error) {
    console.error('Test failed:', error);
    throw error;
  } finally {
    // Clean up
    await cleanupTestData();
  }
}

// Run the test
main().catch(console.error); 