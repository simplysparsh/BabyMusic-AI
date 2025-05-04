// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts"

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4' // Pinned version
import { corsHeaders, handleCorsPreflight } from '../_shared/cors.ts' // Import shared CORS helpers

console.log(`Function 'increment-play-count' up and running!`);

// Helper function to check if a month has passed
function isMonthPassed(resetDate: string | null): boolean {
  if (!resetDate) return true; // If no reset date, consider month passed
  try {
    const resetTimestamp = new Date(resetDate);
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    return resetTimestamp < oneMonthAgo;
  } catch (e) {
    console.error('Error parsing resetDate:', e);
    return true; // Treat invalid date as needing reset
  }
}

serve(async (req: Request) => {
  // Handle CORS preflight requests using the shared helper
  if (req.method === 'OPTIONS') {
    return handleCorsPreflight();
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY');
    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Missing Supabase environment variables.');
    }

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Missing authorization header');
    }
    
    // Use the SERVICE_ROLE_KEY for backend operations that need to bypass RLS (like updating profiles)
    // Make sure SUPABASE_SERVICE_ROLE_KEY is set in your function's secrets
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    if (!serviceRoleKey) {
       throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY');
    }
    
    // Create a client authenticated as the user to get their ID
    const userClient = createClient(
      supabaseUrl,
      supabaseAnonKey,
      { global: { headers: { Authorization: authHeader } } }
    );
    const { data: { user }, error: userError } = await userClient.auth.getUser();
    if (userError || !user) {
      console.error('User auth error:', userError);
      return new Response(JSON.stringify({ error: 'User not authenticated' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    // Create a service role client to update the profile data
    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

    // Fetch the user's current profile data
    const { data: profile, error: fetchError } = await supabaseAdmin
      .from('profiles')
      .select('monthly_plays_count, play_count_reset_at')
      .eq('id', user.id)
      .single();

    if (fetchError) {
      console.error(`Error fetching profile for user ${user.id}:`, fetchError);
      throw new Error('Failed to fetch user profile.');
    }

    if (!profile) {
      throw new Error('User profile not found.');
    }

    let newPlayCount: number;
    let newResetDate: string | null = profile.play_count_reset_at;
    const currentTimestamp = new Date().toISOString();

    // Check if the monthly cycle needs resetting
    if (isMonthPassed(profile.play_count_reset_at)) {
      console.log(`Resetting monthly play count for user ${user.id}. Previous reset: ${profile.play_count_reset_at}`);
      newPlayCount = 1; // First play of the new cycle
      newResetDate = currentTimestamp;
    } else {
      newPlayCount = (profile.monthly_plays_count || 0) + 1;
    }

    // Update the profile
    const { error: updateError } = await supabaseAdmin
      .from('profiles')
      .update({
        monthly_plays_count: newPlayCount,
        play_count_reset_at: newResetDate,
        last_active_date: currentTimestamp // Also update last active date
      })
      .eq('id', user.id);

    if (updateError) {
      console.error(`Error updating profile for user ${user.id}:`, updateError);
      throw new Error('Failed to update play count.');
    }

    console.log(`Play count for user ${user.id} updated to ${newPlayCount}. Reset date: ${newResetDate}`);

    return new Response(JSON.stringify({ success: true, newPlayCount: newPlayCount }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error('Error in increment-play-count function:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/increment-play-count' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
