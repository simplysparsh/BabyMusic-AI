import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0'

interface AudioClip {
  id: string;
  audio_url: string;
  title?: string;
  metadata?: {
    tags?: string;
    prompt?: string;
  };
}

const WEBHOOK_SECRET = Deno.env.get('WEBHOOK_SECRET')
const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || ''
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''

console.log('Edge Function started:', {
  hasWebhookSecret: !!WEBHOOK_SECRET,
  hasSupabaseUrl: !!SUPABASE_URL,
  hasServiceRoleKey: !!SUPABASE_SERVICE_ROLE_KEY,
  timestamp: new Date().toISOString()
});

serve(async (req) => {
  try {
    // Log incoming request
    console.log('Webhook received:', {
      method: req.method,
      headers: Object.fromEntries(req.headers.entries()),
    });

    // Verify webhook secret
    const secret = req.headers.get('x-webhook-secret');
    if (secret !== Deno.env.get('WEBHOOK_SECRET')) {
      console.error('Invalid webhook secret');
      throw new Error('Invalid webhook secret');
    }

    // Parse request body
    let body;
    try {
      body = await req.json();
      console.log('Webhook body:', JSON.stringify(body, null, 2));
    } catch (error) {
      console.error('Failed to parse webhook body:', error);
      throw new Error('Invalid webhook body');
    }

    // Extract task details
    const { task_id, status, error: taskError, output } = body;
    if (!task_id) {
      console.error('Missing task_id in webhook');
      throw new Error('Missing task_id');
    }

    console.log('Processing webhook:', {
      task_id,
      status,
      error: taskError,
      hasOutput: !!output
    });

    // Initialize Supabase client with service role key
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

    // Log status update in a clear format
    console.log('\n#######################');
    console.log('# Status now:', status);
    console.log('# Task ID:', task_id);
    console.log('# Progress:', output?.progress || 'N/A');
    console.log('#######################\n');
    
    // Log status update in a clear format
    console.log('\n##### Status now:', status, '#####\n');
    const errorMessage = taskError?.message || body?.error_message;

    // Log status for debugging
    console.log('Task status update:', {
      taskId: task_id,
      status,
      hasOutput: !!output,
      hasError: !!taskError || !!errorMessage,
      progress: output?.progress
    });

    console.log('Webhook received:', {
      taskId: task_id,
      status,
      hasOutput: !!output,
      clipCount: output?.clips ? Object.keys(output.clips).length : 0
    });

    // Find the song by task_id
    const { data: songs, error: findError } = await supabase
      .from('songs')
      .select('id, task_id, audio_url, error')
      .eq('task_id', task_id.toString())
      .maybeSingle();

    if (findError) {
      throw findError;
    }

    if (!songs) {
      throw new Error(`Song not found for task_id: ${task_id}`);
    }

    console.log('Found song:', {
      songId: songs.id,
      taskId: songs.task_id
    });

    if (output?.clips) {
      console.log('Task completed successfully');
      
      // Handle completed status
      const clip = Object.values(output.clips)[0] as AudioClip;
      
      console.log('Processing audio clips:', {
        songId: songs.id,
        hasAudio: !!clip?.audio_url,
        audioUrl: clip?.audio_url ? clip.audio_url.substring(0, 30) + '...' : 'none'
      });
      
      if (clip?.audio_url) {
        try {
          console.log(`Received audio URL from API for song with task: ${task_id}`, new Date().toISOString());
          
          // First, check the current state of the song to avoid race conditions
          const { data: currentSong, error: checkError } = await supabase
            .from('songs')
            .select('id, task_id, audio_url, error')
            .eq('id', songs.id)
            .single();
            
          if (checkError) {
            console.error('Error checking song current state:', checkError);
            throw checkError;
          }
          
          // If the song already has an audio URL, don't update it
          if (currentSong?.audio_url) {
            console.log(`Song ${songs.id} already has audio URL, skipping update`);
            return new Response(JSON.stringify({ success: true, status: 'already_updated' }), {
              headers: { 'Content-Type': 'application/json' },
              status: 200
            });
          }
          
          // Update the song with the audio URL - condition ONLY on song ID for reliability
          // This ensures the update happens even if task_id changed
          console.log(`Updating song ${songs.id} with audio URL - START`, new Date().toISOString());
          const updateStart = Date.now();
          
          // PRIORITY UPDATE: First update just the audio_url field to ensure it's set ASAP
          const { error: quickUpdateError } = await supabase
            .from('songs')
            .update({ audio_url: clip.audio_url })
            .eq('id', songs.id);
            
          if (quickUpdateError) {
            console.error('Failed quick audio URL update:', quickUpdateError);
            throw quickUpdateError;
          }
          
          console.log(`Quick audio URL update completed in ${Date.now() - updateStart}ms`, new Date().toISOString());
          
          // Then update the remaining fields in a separate call
          const { error: updateError } = await supabase
            .from('songs')
            .update({ 
              error: null,
              task_id: null // Clear task_id to indicate it's no longer in the queue
            })
            .eq('id', songs.id);

          if (updateError) {
            console.error('Failed to update song state fields:', updateError);
            // Don't throw here - audio URL was already updated
          }
          
          console.log(`Successfully updated song with audio URL in ${Date.now() - updateStart}ms:`, {
            songId: songs.id,
            taskId: task_id,
            state: 'completed',
            timestamp: new Date().toISOString()
          });
        } catch (err) {
          console.error('Error processing audio URL update:', err);
          // Don't rethrow - we want to return success even if there was an error
          // This prevents the API from retrying the webhook call
        }
      } else {
        console.warn(`Task completed but no audio URL found for song ${songs.id}`);
      }
    }
    else if (taskError) {
      console.log('Task failed with error');
      
      let errorMsg = taskError.message || 'Music generation failed';
      let retryable = false;

      // Handle specific error cases
      if (errorMsg.includes("doesn't have enough credits")) {
        errorMsg = 'Service temporarily unavailable. Please try again.';
        retryable = true;
      } else if (errorMsg.includes('suno api status: 429')) {
        errorMsg = 'Too many requests. Please wait a moment and try again.';
        retryable = true;
      }

      console.log('Task failed:', {
        taskId: task_id,
        error: errorMsg,
        retryable
      });

      try {
        // First check if the song already has an audio URL
        const { data: currentSong, error: checkError } = await supabase
          .from('songs')
          .select('id, audio_url')
          .eq('id', songs.id)
          .single();
          
        if (checkError) {
          console.error('Error checking song before marking as failed:', checkError);
          throw checkError;
        }
        
        // If the song already has an audio URL, don't mark it as failed
        if (currentSong?.audio_url) {
          console.log(`Song ${songs.id} already has audio URL, not marking as failed`);
          return new Response(JSON.stringify({ success: true, status: 'already_completed' }), {
            headers: { 'Content-Type': 'application/json' },
            status: 200
          });
        }

        // Update the song with the error
        console.log(`Marking song ${songs.id} as failed with error: ${errorMsg}`);
        const { error: updateError } = await supabase
          .from('songs')
          .update({ 
            error: errorMsg,
            retryable,
            audio_url: null,
            task_id: null // Clear task_id to indicate it's no longer in the queue
          })
          .eq('id', songs.id);

        if (updateError) {
          console.error('Failed to update song with error:', updateError);
          throw updateError;
        }
        
        console.log(`Successfully marked song ${songs.id} as failed`);
      } catch (err) {
        console.error('Error handling song failure:', err);
        // Don't rethrow to ensure the webhook doesn't retry
      }
    }
    else {
      console.log('Unhandled task status:', { taskId: task_id, status });
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200
    });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error'
    console.error('Webhook error:', {
      error: errorMessage,
      stack: err instanceof Error ? err.stack : undefined,
      details: err,
      timestamp: new Date().toISOString()
    });
    
    // Don't expose detailed error information in the response
    return new Response(JSON.stringify({ 
      error: 'An error occurred processing the webhook',
      status: 'error'
    }), {
      headers: { 'Content-Type': 'application/json' },
      status: err instanceof Error && err.message.includes('not found') ? 404 : 500
    });
  }
})