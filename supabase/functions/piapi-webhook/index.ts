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
        hasAudio: !!clip?.audio_url
      });
      
      if (clip?.audio_url) {
        // Update the main song with the first clip's audio URL
        const { error: updateError } = await supabase
          .from('songs')
          .update({ 
            audio_url: clip.audio_url,
            error: null,
            status: 'completed',
            task_id: null
          })
          .eq('id', songs.id)
          .eq('task_id', task_id.toString());

        if (updateError) {
          throw updateError;
        }
        
        console.log('Successfully processed song and variations:', {
          songId: songs.id,
          taskId: task_id,
          status: 'completed'
        });
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

      const { error: updateError } = await supabase
        .from('songs')
        .update({ 
          error: errorMsg,
          retryable,
          audio_url: null,
          status: 'failed',
          task_id: null
        })
        .eq('id', songs.id)
        .eq('task_id', task_id.toString());

      // Also update any variations to failed state
      const { error: variationError } = await supabase
        .from('song_variations')
        .update({
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