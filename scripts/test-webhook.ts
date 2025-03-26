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
  VITE_WEBHOOK_SECRET: WEBHOOK_SECRET,
  VITE_PIAPI_KEY: PIAPI_KEY
} = process.env;

if (!SUPABASE_URL) throw new Error('VITE_SUPABASE_URL is required');
if (!SERVICE_ROLE_KEY) throw new Error('SUPABASE_SERVICE_ROLE_KEY is required');
if (!WEBHOOK_SECRET) throw new Error('VITE_WEBHOOK_SECRET is required');
if (!PIAPI_KEY) throw new Error('VITE_PIAPI_KEY is required');

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

async function deleteTestSong() {
  if (TEST_SONG_ID) {
    const { error } = await supabase
      .from('songs')
      .delete()
      .eq('id', TEST_SONG_ID);
    
    if (error) {
      console.error('Failed to delete test song:', error);
    } else {
      console.log('Test song deleted successfully');
    }
  } else {
    console.log('No test song ID available for deletion');
  }
}

async function createTestUser() {
  // Delete existing user first
  await deleteTestUser();
  
  // Create a new test user
  const { data: createData, error: createError } = await supabase.auth.admin.createUser({
    email: TEST_EMAIL,
    password: TEST_PASSWORD,
    email_confirm: true
  });
  
  if (createError) {
    console.error('Failed to create test user:', createError);
    throw createError;
  }
  
  console.log('Test user created successfully');
  return createData.user;
}

async function createTestSong(userId: string) {
  // Delete existing test song
  await deleteTestSong();
  
  // Insert a new song with a task ID
  const { data: songData, error: songError } = await supabase
    .from('songs')
    .insert({
      name: 'Test Webhook Song',
      user_id: userId,
      task_id: TEST_TASK_ID,
      song_type: 'theme',
      theme: 'sleepRegulation',
      mood: 'calm',
      created_at: new Date().toISOString()
    })
    .select();
  
  if (songError) {
    console.error('Failed to create test song:', songError);
    throw songError;
  }
  
  TEST_SONG_ID = songData[0].id;
  console.log('Test song created with ID:', TEST_SONG_ID);
  return songData[0];
}

async function triggerWebhook() {
  // Construct the webhook URL
  const webhookUrl = `${SUPABASE_URL}/functions/v1/piapi-webhook`;
  
  console.log('Sending webhook request to:', webhookUrl);
  
  // Mock PIAPI webhook payload
  const mockPayload = {
    data: {
      task_id: TEST_TASK_ID,
      model: "music-s",
      task_type: "generate_music_custom",
      status: "done",
      output: {
        clips: {
          "clip1": {
            id: "mock-clip-id-1",
            audio_url: "https://example.com/test-audio-1.mp3",
            title: "Test Song 1",
            metadata: {
              prompt: "A test prompt",
              tags: "calm, baby"
            }
          },
          "clip2": {
            id: "mock-clip-id-2",
            audio_url: "https://example.com/test-audio-2.mp3",
            title: "Test Song 2",
            metadata: {
              prompt: "A test prompt variation",
              tags: "calm, baby, variation"
            }
          }
        }
      }
    }
  };
  
  // Set headers to match expected values in the webhook
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'x-webhook-secret': WEBHOOK_SECRET || '',
    'x-api-key': PIAPI_KEY || ''
  };
  
  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(mockPayload)
    });
    
    const responseText = await response.text();
    console.log('Webhook response status:', response.status);
    console.log('Webhook response body:', responseText);
    
    if (!response.ok) {
      console.error('Webhook request failed with status:', response.status);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error triggering webhook:', error);
    return false;
  }
}

async function verifySongUpdated() {
  if (!TEST_SONG_ID) {
    console.error('No test song ID available for verification');
    return false;
  }
  
  console.log('Verifying song update...');
  
  // Wait a short time for webhook processing
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Check if the song was updated
  const { data: song, error } = await supabase
    .from('songs')
    .select('id, task_id, audio_url')
    .eq('id', TEST_SONG_ID)
    .single();
  
  if (error) {
    console.error('Failed to fetch updated song:', error);
    return false;
  }
  
  console.log('Updated song data:', song);
  
  // Check if the audio_url was set (regardless of task_id value)
  if (song.audio_url) {
    console.log('Song was successfully updated with audio URL by the webhook');
    return true;
  } else {
    console.log('Song was not properly updated with audio URL');
    return false;
  }
}

async function verifySongVariationsCreated() {
  if (!TEST_SONG_ID) {
    console.error('No test song ID available for verification');
    return false;
  }
  
  // Check if song variations were created
  const { data: variations, error } = await supabase
    .from('song_variations')
    .select('id, song_id, audio_url, title, metadata')
    .eq('song_id', TEST_SONG_ID);
  
  if (error) {
    console.error('Failed to fetch song variations:', error);
    return false;
  }
  
  if (variations && variations.length > 0) {
    console.log(`${variations.length} song variations were created:`);
    variations.forEach((variation, index) => {
      console.log(`Variation ${index + 1}:`);
      console.log(`  ID: ${variation.id}`);
      console.log(`  Title: ${variation.title}`);
      console.log(`  Audio URL: ${variation.audio_url}`);
      console.log(`  Metadata:`, variation.metadata);
    });
    return true;
  } else {
    console.log('No song variations were created');
    return false;
  }
}

async function runTest() {
  try {
    console.log('Starting webhook test...');
    
    // Create test user
    const user = await createTestUser();
    
    // Create test song
    await createTestSong(user.id);
    
    // Trigger webhook
    const webhookSuccess = await triggerWebhook();
    
    if (webhookSuccess) {
      // Verify song was updated
      await verifySongUpdated();
      
      // Verify song variations were created
      await verifySongVariationsCreated();
    }
    
    // Clean up
    await deleteTestSong();
    await deleteTestUser();
    
    console.log('Webhook test completed');
  } catch (error) {
    console.error('Test failed:', error);
  }
}

runTest(); 