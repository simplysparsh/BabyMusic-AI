// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts"

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient, SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4'
import { corsHeaders, handleCorsPreflight } from '../_shared/cors.ts' // Import shared CORS helpers


interface ProfileLimitData {
  is_premium: boolean | null;
  generation_count: number | null;
}

// Assuming limits are defined in a shared location accessible to functions
// OR define them here if not shared easily
const GENERATION_LIMIT = 4;

console.log(`Function 'check-generation-allowance' up and running!`);

// --- Helper: Get Profile & Check Limit --- 
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

// --- Helper: Increment Generation Count --- 
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
  // Handle CORS preflight requests using the shared helper
  if (req.method === 'OPTIONS') {
    return handleCorsPreflight();
  }

  let supabaseAdmin: SupabaseClient | null = null;

  try {
    // --- Environment Variable Setup --- 
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY');
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
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

    // --- Limit Check & Increment --- 
    const { allowed, profileData } = await getProfileAndCheckLimit(supabaseAdmin, userId);
    
    if (!allowed) {
       return new Response(JSON.stringify({ allowed: false, reason: 'limit_reached' }), {
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
       });
    }
    
    // Increment count if user is free (profileData is guaranteed to exist if allowed=true)
    if (!profileData?.is_premium) {
       await incrementGenerationCount(supabaseAdmin, userId, profileData?.generation_count || 0);
    }

    // --- Success Response --- 
    return new Response(JSON.stringify({ allowed: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error('Error in check-generation-allowance function:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return new Response(JSON.stringify({ allowed: false, reason: 'server_error', error: errorMessage }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500, 
    });
  }
});

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/check-generation-allowance' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
