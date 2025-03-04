/// <reference lib="deno.ns" />

// This Supabase Edge Function cleans up abandoned sign-ups
// It should be scheduled to run every hour
// Note: The Deno types are resolved when this is deployed to Supabase Edge Functions environment

// Run this command to add the package: deno add npm:@supabase/supabase-js
import { createClient } from 'npm:@supabase/supabase-js';

// These will be set in the Supabase dashboard
const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

// @ts-ignore - Deno.serve is available in Supabase Edge Functions environment
Deno.serve(async (_req) => {
  // Create Supabase client with admin privileges
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  try {
    // Get profiles that are in onboarding state and older than 1 hour
    const oneHourAgo = new Date();
    oneHourAgo.setHours(oneHourAgo.getHours() - 1);
    
    const { data: abandonedProfiles, error: queryError } = await supabase
      .from('profiles')
      .select('id')
      .eq('is_onboarding', true)
      .lt('created_at', oneHourAgo.toISOString());
      
    if (queryError) {
      throw queryError;
    }
    
    if (!abandonedProfiles || abandonedProfiles.length === 0) {
      console.log('No abandoned sign-ups found');
      return new Response(JSON.stringify({ status: 'success', message: 'No abandoned sign-ups found' }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }
    
    console.log(`Found ${abandonedProfiles.length} abandoned sign-ups to clean up`);
    
    let deletedSongs = 0;
    let deletedProfiles = 0;
    
    // Delete songs and profiles for abandoned sign-ups
    for (const profile of abandonedProfiles) {
      // Delete songs first
      const { error: songsDeleteError, count: songsDeleted } = await supabase
        .from('songs')
        .delete({ count: 'exact' })
        .eq('user_id', profile.id);
        
      if (songsDeleteError) {
        console.error(`Failed to delete songs for abandoned profile ${profile.id}:`, songsDeleteError);
        // Continue with other profiles even if one fails
      } else {
        deletedSongs += songsDeleted || 0;
      }
      
      // Then delete the profile
      const { error: profileDeleteError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', profile.id);
        
      if (profileDeleteError) {
        console.error(`Failed to delete abandoned profile ${profile.id}:`, profileDeleteError);
        // Continue with other profiles even if one fails
      } else {
        deletedProfiles++;
      }
    }
    
    return new Response(
      JSON.stringify({
        status: 'success', 
        message: `Cleaned up ${deletedProfiles} abandoned sign-ups and ${deletedSongs} orphaned songs`
      }),
      { headers: { 'Content-Type': 'application/json' } }
    );
    
  } catch (error: unknown) {
    console.error('Error cleaning up abandoned sign-ups:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return new Response(
      JSON.stringify({ status: 'error', message: errorMessage }),
      { headers: { 'Content-Type': 'application/json' }, status: 500 }
    );
  }
}); 