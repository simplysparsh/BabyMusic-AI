import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fetch from 'node-fetch';

// Get the directory name of the current module
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const {
  VITE_SUPABASE_URL: SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY: SERVICE_ROLE_KEY,
  VITE_WEBHOOK_SECRET: WEBHOOK_SECRET
} = process.env;

if (!SUPABASE_URL) throw new Error('VITE_SUPABASE_URL is required');
if (!SERVICE_ROLE_KEY) throw new Error('SUPABASE_SERVICE_ROLE_KEY is required');
if (!WEBHOOK_SECRET) throw new Error('VITE_WEBHOOK_SECRET is required');

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

// Test data
const TEST_TASK_ID = '15e52874-fdb6-4f80-b8b4-7ad183f58a66';
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

async function simulateWebhook(payload: any) {
  const WEBHOOK_URL = `${SUPABASE_URL}/functions/v1/piapi-webhook`;

  if (!WEBHOOK_SECRET) {
    throw new Error('WEBHOOK_SECRET is required');
  }

  console.log('Sending webhook request:', {
    url: WEBHOOK_URL,
    hasSecret: !!WEBHOOK_SECRET,
    hasAnonKey: !!SERVICE_ROLE_KEY,
    payload: JSON.stringify(payload, null, 2)
  });

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    'x-webhook-secret': WEBHOOK_SECRET,
    'Authorization': `Bearer ${SERVICE_ROLE_KEY}`
  };

  const response = await fetch(WEBHOOK_URL, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload)
  });

  const responseText = await response.text();
  console.log('Webhook response:', {
    status: response.status,
    statusText: response.statusText,
    body: responseText
  });

  if (!response.ok) {
    throw new Error(`Webhook request failed: ${response.status} ${response.statusText}\n${responseText}`);
  }

  // Check song state after webhook
  const { data: song } = await supabase
    .from('songs')
    .select('*')
    .eq('id', TEST_SONG_ID)
    .single();

  console.log('Song state after webhook:', song);
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

  // Create test song
  const TEST_SONG = {
    task_id: TEST_TASK_ID,
    song_type: 'preset',
    user_id: user.id,
    name: 'Test Song',
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
  return { user, song };
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
    // Setup test data
    await setupTestData();

    // First simulate partial completion
    console.log('\n=== Testing Partial Completion ===');
    await simulateWebhook({
      task_id: TEST_TASK_ID,
      model: "music-s",
      task_type: "generate_music",
      status: "in_progress",
      config: {
        service_mode: "",
        webhook_config: {
          endpoint: `${SUPABASE_URL}/functions/v1/piapi-webhook`,
          secret: WEBHOOK_SECRET
        }
      },
      output: {
        clips: {
          "clip_1": {
            id: "clip_1",
            video_url: "https://cdn1.suno.ai/clip1.mp4",
            audio_url: "https://cdn1.suno.ai/clip1.mp3",
            image_url: "https://cdn2.suno.ai/image1.jpeg",
            image_large_url: null,
            status: "ready",
            title: "Test Song - Variation 1",
            metadata: {
              duration: 240,
              error_type: "",
              error_message: ""
            }
          }
        }
      },
      meta: {
        created_at: new Date().toISOString(),
        started_at: new Date().toISOString(),
        ended_at: null,
        usage: {
          type: "point",
          frozen: 400000,
          consume: 400000
        },
        is_using_private_pool: false
      },
      error: {
        code: 0,
        raw_message: "",
        message: "",
        detail: null
      }
    });

    // Wait 15 seconds
    console.log('\n=== Waiting 15 seconds before completion ===');
    await new Promise(resolve => setTimeout(resolve, 15000));

    // Then simulate full completion
    console.log('\n=== Testing Full Completion ===');
    await simulateWebhook({
      task_id: TEST_TASK_ID,
      model: "music-s",
      task_type: "generate_music",
      status: "completed",
      config: {
        service_mode: "",
        webhook_config: {
          endpoint: `${SUPABASE_URL}/functions/v1/piapi-webhook`,
          secret: WEBHOOK_SECRET
        }
      },
      output: {
        clips: {
          "clip_1": {
            id: "clip_1",
            video_url: "https://cdn1.suno.ai/clip1.mp4",
            audio_url: "https://cdn1.suno.ai/clip1.mp3",
            image_url: "https://cdn2.suno.ai/image1.jpeg",
            image_large_url: null,
            status: "ready",
            title: "Test Song - Variation 1",
            metadata: {
              duration: 240,
              error_type: "",
              error_message: ""
            }
          },
          "clip_2": {
            id: "clip_2",
            video_url: "https://cdn1.suno.ai/clip2.mp4",
            audio_url: "https://cdn1.suno.ai/clip2.mp3",
            image_url: "https://cdn2.suno.ai/image2.jpeg",
            image_large_url: null,
            status: "ready",
            title: "Test Song - Variation 2",
            metadata: {
              duration: 159,
              error_type: "",
              error_message: ""
            }
          }
        }
      },
      meta: {
        created_at: new Date().toISOString(),
        started_at: new Date().toISOString(),
        ended_at: new Date().toISOString(),
        usage: {
          type: "point",
          frozen: 400000,
          consume: 400000
        },
        is_using_private_pool: false
      },
      error: {
        code: 0,
        raw_message: "",
        message: "",
        detail: null
      }
    });

  } catch (error) {
    console.error('Test failed:', error);
    throw error;
  } finally {
    // Wait 15 seconds before cleanup
    console.log('\n=== Waiting 15 seconds before cleanup ===');
    await new Promise(resolve => setTimeout(resolve, 15000));
    
    // Clean up
    await cleanupTestData();
  }
}

// Run the test
main().catch(console.error); 