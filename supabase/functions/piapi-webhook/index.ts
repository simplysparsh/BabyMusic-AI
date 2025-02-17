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
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

console.log('Edge Function started:', {
  hasWebhookSecret: !!WEBHOOK_SECRET,
  hasSupabaseUrl: !!SUPABASE_URL,
  hasServiceRoleKey: !!SUPABASE_SERVICE_ROLE_KEY,
  timestamp: new Date().toISOString()
});

serve(async (req) => {
  try {
    // Log incoming request
    console.log('Webhook request received:', {
      method: req.method,
      headers: Object.fromEntries(req.headers.entries()),
      timestamp: new Date().toISOString()
    });

    // Verify request method
    if (req.method !== 'POST') {
      throw new Error(`Invalid method: ${req.method}`);
    }

    // Verify required environment variables
    if (!WEBHOOK_SECRET || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      const missing = [
        !WEBHOOK_SECRET && 'WEBHOOK_SECRET',
        !SUPABASE_URL && 'SUPABASE_URL',
        !SUPABASE_SERVICE_ROLE_KEY && 'SUPABASE_SERVICE_ROLE_KEY'
      ].filter(Boolean).join(', ');
      throw new Error(`Missing required environment variables: ${missing}`);
    }

    // Verify webhook secret
    const webhookSecret = req.headers.get('x-webhook-secret');
    console.log('Webhook secret validation:', {
      receivedSecret: webhookSecret,
      expectedSecret: WEBHOOK_SECRET,
      match: webhookSecret === WEBHOOK_SECRET
    });

    if (!webhookSecret) {
      throw new Error('Missing webhook secret in request headers');
    }
    
    if (webhookSecret !== WEBHOOK_SECRET) {
      throw new Error('Webhook secret mismatch');
    }

    // Initialize Supabase client with service role key
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

    // Parse request body
    const payload = await req.json()
    console.log('Webhook payload:', {
      hasTaskId: !!payload?.task_id,
      hasDataTaskId: !!payload?.data?.task_id,
      status: payload?.status,
      hasOutput: !!payload?.output,
      hasError: !!payload?.error,
      payload: JSON.stringify(payload)
    });
    
    // Extract data from the nested structure
    const task_id = payload?.data?.task_id;
    const status = payload?.data?.status;
    const output = payload?.data?.output;
    const error = payload?.data?.error;
    
    // Log status update in a clear format
    console.log('\n#######################');
    console.log('# Status now:', status);
    console.log('# Task ID:', task_id);
    console.log('# Progress:', output?.progress || 'N/A');
    console.log('#######################\n');
    
    // Log status update in a clear format
    console.log('\n##### Status now:', status, '#####\n');
    const errorMessage = error?.message || payload?.error_message;

    // Log status for debugging
    console.log('Task status update:', {
      taskId: task_id,
      status,
      hasOutput: !!output,
      hasError: !!error || !!errorMessage,
      progress: output?.progress
    });

    if (!task_id) {
      throw new Error(`No task_id provided in webhook payload: ${JSON.stringify(payload)}`);
    }

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

    // Handle all possible statuses
    if (status === 'pending') {
      // Task is queued, no action needed
      console.log('Task is queued and waiting to start');
    } 
    else if (status === 'processing') {
      // Task is being processed
      console.log('Task is actively being processed');

      // Update song status
      const { error: updateError } = await supabase
        .from('songs')
        .update({ 
          status: 'processing',
          error: null
        })
        .eq('id', songs.id)
        .eq('task_id', task_id.toString());

      if (updateError) throw updateError;
    } 
    else if (status === 'staged') {
      // Task is staged but not yet processing
      console.log('Task is staged and ready for processing');
    } 
    else if (status === 'completed' && output?.clips) {
      console.log('Task completed successfully');
      
      // Handle completed status
      const clip = Object.values(output.clips)[0] as AudioClip;
      
      console.log('Processing audio clips:', {
        songId: songs.id,
        hasAudio: !!clip?.audio_url
      });
      
      if (clip?.audio_url) {
        // Update the main song with the first clip's audio URL
        const { error: updateError } = await supabase
          .from('songs')
          .update({ 
            audio_url: clip.audio_url,
            status: 'completed',
            error: null
          })
          .eq('id', songs.id)
          .eq('task_id', task_id.toString());

        if (updateError) {
          throw updateError;
        }
        
        console.log('Successfully processed song and variations:', {
          songId: songs.id
        });
      }
    }
    else if (status === 'failed' || error) {
      console.log('Task failed with error');
      
      let errorMsg = errorMessage || 'Music generation failed';
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

      const { error: updateError } = await supabase
        .from('songs')
        .update({ 
          status: 'failed',
          error: errorMsg,
          retryable,
          audio_url: null 
        })
        .eq('id', songs.id)
        .eq('task_id', task_id.toString());

      // Also update any variations to failed state
      const { error: variationError } = await supabase
        .from('song_variations')
        .update({
          status: 'failed',
          retryable
        })
        .eq('song_id', songs.id);

      if (variationError) {
        throw variationError;
      }
      if (updateError) {
        throw updateError;
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
      timestamp: new Date().toISOString()
    });
    
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { 'Content-Type': 'application/json' },
      status: err instanceof Error && err.message.includes('not found') ? 404 : 500
    });
  }
})