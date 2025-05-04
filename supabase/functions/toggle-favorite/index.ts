// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
// import "jsr:@supabase/functions-js/edge-runtime.d.ts"

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
// Pin specific Supabase client version
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4'
import { corsHeaders, handleCorsPreflight } from '../_shared/cors.ts' // Import shared CORS helpers

console.log(`Function 'toggle-favorite' up and running!`);

// Add Request type for req
serve(async (req: Request) => {
  // Handle CORS preflight requests using the shared helper
  if (req.method === 'OPTIONS') {
    return handleCorsPreflight();
  }

  try {
    // Ensure environment variables are set
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY');
    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Missing Supabase environment variables.');
    }

    // Create Supabase client with auth header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Missing authorization header');
    }
    
    const supabase = createClient(
      supabaseUrl,
      supabaseAnonKey,
      { global: { headers: { Authorization: authHeader } } }
    );

    // Get user data
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      console.error('User auth error:', userError);
      return new Response(JSON.stringify({ error: 'User not authenticated' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Get song_id from request body
    const { song_id } = await req.json();
    if (!song_id) {
      throw new Error('Missing song_id in request body');
    }

    // Fetch the current favorite status and owner of the song
    const { data: currentSong, error: fetchError } = await supabase
      .from('songs')
      .select('is_favorite, user_id')
      .eq('id', song_id)
      .single();

    if (fetchError) {
      console.error('Error fetching song:', fetchError);
      throw new Error('Failed to fetch song details.');
    }

    if (!currentSong) {
       throw new Error('Song not found.');
    }
    
    // IMPORTANT: Verify the authenticated user owns the song
    if (currentSong.user_id !== user.id) {
       console.error(`User ${user.id} attempted to favorite song ${song_id} owned by ${currentSong.user_id}`);
       return new Response(JSON.stringify({ error: 'Forbidden: You do not own this song' }), {
          status: 403,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
       });
    }

    // Toggle the favorite status
    const newFavoriteStatus = !currentSong.is_favorite;

    const { error: updateError } = await supabase
      .from('songs')
      .update({ is_favorite: newFavoriteStatus, updated_at: new Date().toISOString() })
      .eq('id', song_id)
      .eq('user_id', user.id); // Extra safety check

    if (updateError) {
      console.error('Error updating favorite status:', updateError);
      throw new Error('Failed to update favorite status.');
    }

    console.log(`Song ${song_id} favorite status toggled to ${newFavoriteStatus} for user ${user.id}`);

    return new Response(JSON.stringify({ success: true, is_favorite: newFavoriteStatus }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error('Error in toggle-favorite function:', error);
    // Check error type before accessing message
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

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/toggle-favorite' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
