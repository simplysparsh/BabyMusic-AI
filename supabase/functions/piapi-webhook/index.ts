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
      console.log('Processing clip output with status:', status);
      
      // Handle different statuses
      const clip = Object.values(output.clips)[0] as AudioClip;
      
      console.log('Processing audio clips:', {
        songId: songs.id,
        hasAudio: !!clip?.audio_url,
        audioUrl: clip?.audio_url ? clip.audio_url.substring(0, 30) + '...' : 'none',
        status: status
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
            
            // But still update completion status if this is the final notification
            if (status === 'completed' || status === 'complete') {
              console.log(`Updating song ${songs.id} to mark as completed`);
              const { error: completeError } = await supabase
                .from('songs')
                .update({ 
                  task_id: null, // Clear task_id only when fully complete
                  error: null
                })
                .eq('id', songs.id);
                
              if (completeError) {
                console.error('Failed to update song completion status:', completeError);
              }
            }
            
            return new Response(JSON.stringify({ success: true, status: 'already_updated' }), {
              headers: { 'Content-Type': 'application/json' },
              status: 200
            });
          }
          
          console.log(`Updating song ${songs.id} with audio URL - START`, new Date().toISOString());
          const updateStart = Date.now();
          
          // PROGRESSIVE UPDATE: Set audio_url without clearing task_id if not completed
          if (status !== 'completed' && status !== 'complete') {
            const { error: progressiveUpdateError } = await supabase
              .from('songs')
              .update({ 
                audio_url: clip.audio_url,
                error: null
                // Keeping task_id to indicate generation is still in progress
              })
              .eq('id', songs.id);
              
            if (progressiveUpdateError) {
              console.error('Failed to update song with progressive audio URL:', progressiveUpdateError);
              throw progressiveUpdateError;
            }
            
            console.log(`Successfully updated song with progressive audio URL in ${Date.now() - updateStart}ms`);
          } else {
            // COMPLETION UPDATE: Update all fields when fully complete
            const { error: completeUpdateError } = await supabase
              .from('songs')
              .update({ 
                audio_url: clip.audio_url,
                error: null,
                task_id: null // Now safe to clear task_id
              })
              .eq('id', songs.id);
              
            if (completeUpdateError) {
              console.error('Failed to update song with complete status:', completeUpdateError);
              throw completeUpdateError;
            }
            
            console.log(`Successfully updated song to completed state in ${Date.now() - updateStart}ms`);
          }
          
          console.log(`Song update successful:`, {
            songId: songs.id,
            taskId: task_id,
            status: status,
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
      console.log('Task error received');
      
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
        // unless the error is critical (determined by retryable flag)
        if (currentSong?.audio_url && retryable) {
          console.log(`Song ${songs.id} already has audio URL, not marking as failed since error is retryable`);
          return new Response(JSON.stringify({ success: true, status: 'has_audio_ignoring_error' }), {
            headers: { 'Content-Type': 'application/json' },
            status: 200
          });
        }

        // Prepare update fields, preserving audio_url if it exists
        const updateFields: any = {
          error: errorMsg,
          retryable,
          task_id: null // Clear task_id to indicate it's no longer in the queue
        };
        
        // Don't clear audio_url if it already exists
        if (!currentSong?.audio_url) {
          updateFields.audio_url = null;
        } else {
          console.log(`Preserving existing audio_url for song ${songs.id} even though error occurred`);
        }

        // Update the song with the error
        console.log(`Marking song ${songs.id} as failed with error: ${errorMsg}`);
        const { error: updateError } = await supabase
          .from('songs')
          .update(updateFields)
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