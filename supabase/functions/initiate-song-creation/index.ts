// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts"

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient, SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4'
// import { corsHeaders } from '../_shared/cors.ts' // Assuming shared CORS exists or embed later - Embed instead

// Define CORS headers directly
const corsHeaders = {
  'Access-Control-Allow-Origin': '*', // Or specific origin
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Import song generation logic (adjust path as needed)
// We might need to adapt these or parts of them for the server-side context
// import { createMusicGenerationTask } from '../../src/lib/piapi.ts'; // Needs env vars
// import { SongPromptService } from '../../src/services/songPromptService.ts'; // Might need adaptation
// import { PRESET_CONFIGS } from '../../src/data/lyrics/presets.ts'; // Need to verify path/usage

// Type definitions (consider a shared types package)
// Replicating necessary types here for now
type MusicMood = 'calm' | 'playful' | 'learning' | 'energetic';
type ThemeType = 
  | 'pitchDevelopment' 
  | 'cognitiveSpeech' 
  | 'sleepRegulation'
  | 'socialEngagement' 
  | 'indianClassical' 
  | 'westernClassical';
type Tempo = 'slow' | 'medium' | 'fast';
type VoiceType = 'softFemale' | 'calmMale';
type PresetType = 'playing' | 'eating' | 'sleeping' | 'pooping';
type AgeGroup = '0-6' | '7-12' | '13-24';
type SongType = 'preset' | 'theme' | 'theme-with-input' | 'from-scratch';

interface RequestBody {
  name: string; // Expect pre-generated name from client for now
  babyName: string;
  theme?: ThemeType;
  mood?: MusicMood;
  userInput?: string;
  tempo?: Tempo;
  isInstrumental?: boolean;
  voice?: VoiceType;
  songType: SongType;
  preset_type?: PresetType;
  ageGroup?: AgeGroup;
  gender?: string;
}

// Define specific type for profile data fetched
interface ProfileLimitData {
  is_premium: boolean | null;
  generation_count: number | null;
}

const GENERATION_LIMIT = 2;

console.log(`Function 'initiate-song-creation' up and running!`);

async function getProfileAndCheckLimit(supabaseAdmin: SupabaseClient, userId: string): Promise<{ allowed: boolean; profileData?: ProfileLimitData }> {
  const { data: profile, error: fetchError } = await supabaseAdmin
    .from('profiles')
    .select('is_premium, generation_count')
    .eq('id', userId)
    .single();

  if (fetchError) {
    console.error(`Limit Check: Error fetching profile for user ${userId}:`, fetchError);
    throw new Error('Failed to fetch user profile for limit check.');
  }
  if (!profile) {
     throw new Error('User profile not found for limit check.');
  }

  if (profile.is_premium) {
    return { allowed: true, profileData: profile }; // Premium users always allowed
  }

  const currentCount = profile.generation_count || 0;
  if (currentCount >= GENERATION_LIMIT) {
    console.log(`Generation limit reached for user ${userId}. Count: ${currentCount}`);
    return { allowed: false }; // Limit reached for free user
  }

  return { allowed: true, profileData: profile }; // Allowed, return profile for increment
}

async function incrementGenerationCount(supabaseAdmin: SupabaseClient, userId: string, currentCount: number) {
   console.log(`Incrementing generation count for user ${userId} from ${currentCount}`);
   // TODO: Implement atomic increment using RPC if possible for better concurrency handling
   const { error: updateError } = await supabaseAdmin
     .from('profiles')
     .update({ generation_count: currentCount + 1 })
     .eq('id', userId);

   if (updateError) {
     console.error(`Failed to increment generation count for user ${userId}:`, updateError);
     // Decide if this should be a fatal error blocking generation
     throw new Error('Failed to update generation count.'); 
   }
   console.log(`Successfully incremented generation count for user ${userId}`);
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  let supabaseAdmin: SupabaseClient | null = null; // Define outside try for finally block

  try {
    // --- Environment Variable Setup ---
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY');
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    // TODO: Add PIAPI_KEY, CLAUDE_API_KEY secrets later

    if (!supabaseUrl || !supabaseAnonKey || !serviceRoleKey) {
      console.error('Missing Supabase environment variables.');
      throw new Error('Server configuration error.');
    }

    // --- Authentication --- 
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Missing authorization header');
    }
    const userClient = createClient(supabaseUrl, supabaseAnonKey, { global: { headers: { Authorization: authHeader } } });
    const { data: { user }, error: userError } = await userClient.auth.getUser();
    if (userError || !user) {
      console.error('User auth error:', userError);
      return new Response(JSON.stringify({ error: 'User not authenticated' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }
    const userId = user.id;

    // --- Create Admin Client --- 
    supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

    // --- Input Validation --- 
    const body: RequestBody = await req.json();
    if (!body.name || !body.babyName || !body.songType) {
      throw new Error('Missing required fields: name, babyName, songType');
    }
    // TODO: Add more specific validation based on songType

    // --- Limit Check & Increment --- 
    const { allowed, profileData } = await getProfileAndCheckLimit(supabaseAdmin, userId);
    if (!allowed) {
       return new Response(JSON.stringify({ error: 'Generation limit reached. Upgrade to Premium.' }), {
          status: 403, // Forbidden
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
       });
    }

    // Increment count if user is free (profileData is guaranteed to exist if allowed=true)
    if (!profileData?.is_premium) {
       await incrementGenerationCount(supabaseAdmin, userId, profileData?.generation_count || 0);
    }

    // --- Song Creation Logic (Placeholder) --- 
    // TODO: Adapt logic from songService.ts here
    // 1. Determine full parameters (mood, lyrics if needed?)
    // 2. Create initial song record in DB using supabaseAdmin
    // 3. Call createMusicGenerationTask (needs PIAPI key from secrets)
    // 4. Update song record with task_id using supabaseAdmin

    console.log(`Placeholder: Song creation initiated for user ${userId}`, body);
    const placeholderSongId = crypto.randomUUID(); // Generate a dummy ID for now
    const placeholderTaskId = 'task_placeholder_' + Date.now(); // Generate a dummy task ID

    // Simulate returning data similar to what frontend expects
    const responseData = {
      id: placeholderSongId,
      name: body.name,
      task_id: placeholderTaskId,
      // Include other relevant fields from body or defaults
      theme: body.theme,
      mood: body.mood, 
      song_type: body.songType,
      preset_type: body.preset_type,
      user_id: userId,
      created_at: new Date().toISOString(),
      // ... other fields eventually fetched/created
    };

    return new Response(JSON.stringify(responseData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error('Error in initiate-song-creation function:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    // Avoid destroying supabaseAdmin if it exists
    // Consider logging error without exposing details potentially?
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/initiate-song-creation' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
