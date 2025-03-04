// This Supabase Edge Function cleans up abandoned sign-ups
// It should be scheduled to run every hour
// Note: The Deno types are resolved when this is deployed to Supabase Edge Functions environment

// @ts-ignore - Deno types are available in Supabase Edge Functions environment
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'

// These will be set in the Supabase dashboard
// @ts-ignore - Deno is available in Supabase Edge Functions environment
const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
// @ts-ignore - Deno is available in Supabase Edge Functions environment
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
// @ts-ignore - Deno is available in Supabase Edge Functions environment
const piapiKey = Deno.env.get('VITE_PIAPI_KEY') || 'not set';
// @ts-ignore - Deno is available in Supabase Edge Functions environment
const claudeKey = Deno.env.get('VITE_CLAUDE_API_KEY') || 'not set';
// @ts-ignore - Deno is available in Supabase Edge Functions environment
const webhookSecret = Deno.env.get('VITE_WEBHOOK_SECRET') || 'not set';

// @ts-ignore - Deno.serve is available in Supabase Edge Functions environment
Deno.serve(async (req) => {
  // Create Supabase client with admin privileges
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  // Check if environment variables are properly set
  const envCheck = {
    supabaseUrl: !!supabaseUrl,
    supabaseKey: !!supabaseKey && supabaseKey.length > 10,
    piapiKey: piapiKey !== 'not set',
    claudeKey: claudeKey !== 'not set',
    webhookSecret: webhookSecret !== 'not set'
  };
  
  console.log('Environment variables check:', envCheck);
  
  try {
    // Get profiles that are in onboarding state and older than 24 hours
    const oneDayAgo = new Date();
    oneDayAgo.setHours(oneDayAgo.getHours() - 24); // Changed from 1 hour to 24 hours
    
    const { data: abandonedProfiles, error: queryError } = await supabase
      .from('profiles')
      .select('id')
      .eq('is_onboarding', true)
      .lt('created_at', oneDayAgo.toISOString());
      
    if (queryError) {
      throw queryError;
    }
    
    if (!abandonedProfiles || abandonedProfiles.length === 0) {
      console.log('No abandoned sign-ups found');
      return new Response(JSON.stringify({ 
        status: 'success', 
        message: 'No abandoned sign-ups found',
        env_check: envCheck,
        timestamp: new Date().toISOString()
      }), {
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
        message: `Cleaned up ${deletedProfiles} abandoned sign-ups and ${deletedSongs} orphaned songs`,
        env_check: envCheck,
        timestamp: new Date().toISOString()
      }),
      { headers: { 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error('Error cleaning up abandoned sign-ups:', error);
    
    return new Response(
      JSON.stringify({ 
        status: 'error', 
        message: error.message,
        env_check: envCheck || 'Not available due to early error',
        timestamp: new Date().toISOString()
      }),
      { headers: { 'Content-Type': 'application/json' }, status: 500 }
    );
  }
}); 