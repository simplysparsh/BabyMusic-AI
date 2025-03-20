// @ts-ignore
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
// @ts-ignore
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

const WEBHOOK_SECRET = Deno.env.get('VITE_WEBHOOK_SECRET')
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
    // Log ALL headers (names only) to see what PIAPI is sending
    const allHeaders = [...req.headers.keys()];
    console.log('All received headers:', {
      headerNames: allHeaders,
      timestamp: new Date().toISOString()
    });

    // Log incoming request with full details (excluding secrets)
    const requestHeaders = Object.fromEntries([...req.headers].filter(([key]) => !key.toLowerCase().includes('secret')));
    console.log('Webhook received:', {
      method: req.method,
      headers: requestHeaders,
      timestamp: new Date().toISOString()
    });

    // Try multiple possible header names for the secret
    const secret = req.headers.get('x-webhook-secret') || 
                  req.headers.get('x-secret') ||
                  req.headers.get('webhook-secret') ||
                  req.headers.get('secret');

    console.log('Webhook secret check:', {
      hasSecret: !!secret,
      expectedSecret: !!WEBHOOK_SECRET,
      checkedHeaders: ['x-webhook-secret', 'x-secret', 'webhook-secret', 'secret'],
      timestamp: new Date().toISOString()
    });

    if (!secret) {
      console.error('Missing webhook secret header');
      return new Response(JSON.stringify({ 
        error: 'Missing webhook secret header',
        status: 'error'
      }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (secret !== WEBHOOK_SECRET) {
      console.error('Invalid webhook secret');
      return new Response(JSON.stringify({ 
        error: 'Invalid webhook secret',
        status: 'error'
      }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Parse request body with error handling
    let body;
    try {
      body = await req.json();
      console.log('Webhook body:', JSON.stringify(body, null, 2));
    } catch (error) {
      console.error('Failed to parse webhook body:', error);
      return new Response(JSON.stringify({ 
        error: 'Invalid JSON body',
        status: 'error'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Extract data from the nested structure
    const { data } = body;
    if (!data) {
      console.error('Missing data object in webhook body');
      return new Response(JSON.stringify({ 
        error: 'Missing data object in webhook body',
        status: 'error'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Validate required fields from the data object
    const { task_id, status, error: taskError, output } = data;
    if (!task_id) {
      console.error('Missing task_id in webhook body');
      return new Response(JSON.stringify({ 
        error: 'Missing task_id in webhook body',
        status: 'error'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Initialize Supabase client
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Find the song with detailed logging
    console.log('Looking for song with task_id:', task_id);
    const { data: songs, error: findError } = await supabase
      .from('songs')
      .select('id, task_id, audio_url, error')
      .eq('task_id', task_id.toString())
      .maybeSingle();

    if (findError) {
      console.error('Database error finding song:', findError);
      throw findError;
    }

    if (!songs) {
      console.error(`No song found for task_id: ${task_id}`);
      return new Response(JSON.stringify({ 
        error: `No song found for task_id: ${task_id}`,
        status: 'error'
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    console.log('Processing webhook:', {
      task_id,
      status,
      error: taskError,
      hasOutput: !!output
    });

    // Log status update in a clear format
    console.log('\n#######################');
    console.log('# Status now:', status);
    console.log('# Task ID:', task_id);
    console.log('# Progress:', output?.progress || 'N/A');
    console.log('#######################\n');
    
    // Log status update in a clear format
    console.log('\n##### Status now:', status, '#####\n');
    
    // Check for errors in the response
    const hasError = taskError && typeof taskError === 'object' && 
      'code' in taskError && taskError.code !== 0 && 
      ('message' in taskError || 'raw_message' in taskError) && 
      (taskError.message || taskError.raw_message);

    // Log status update with error info if present
    console.log('Task status update:', {
      taskId: task_id,
      status,
      hasError,
      errorDetails: taskError && typeof taskError === 'object' ? {
        code: 'code' in taskError ? taskError.code : 0,
        message: 'message' in taskError ? taskError.message : 
                 ('raw_message' in taskError ? taskError.raw_message : ''),
        detail: 'detail' in taskError ? taskError.detail : null
      } : null
    });

    console.log('Webhook received:', {
      taskId: task_id,
      status,
      hasOutput: !!output,
      clipCount: output?.clips ? Object.keys(output.clips).length : 0
    });

    // SIMPLIFIED LOGIC: Handle audio clips if present
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
          
          // Check current state to avoid race conditions
          const { data: currentSong, error: checkError } = await supabase
            .from('songs')
            .select('id, task_id, audio_url, error')
            .eq('id', songs.id)
            .single();
            
          if (checkError) {
            console.error('Error checking song current state:', checkError);
            throw checkError;
          }
          
          // If the song already has an audio URL, only update task_id if this is complete
          if (currentSong?.audio_url) {
            console.log(`Song ${songs.id} already has audio URL: ${currentSong.audio_url}`);
            
            // Only clear task_id if the status is complete/completed
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
            
            return new Response(JSON.stringify({ success: true, status: 'already_has_audio' }), {
              headers: { 'Content-Type': 'application/json' },
              status: 200
            });
          }
          
          console.log(`Updating song ${songs.id} with audio URL - START`, new Date().toISOString());
          const updateStart = Date.now();
          
          // Update logic based on status
          if (status === 'completed' || status === 'complete') {
            // ENHANCED LOGGING: Log when we receive completed status
            console.log('COMPLETED status detected:', {
              songId: songs.id,
              status,
              clipCount: output?.clips ? Object.keys(output.clips).length : 0,
              // @ts-ignore - We know the structure of clips at runtime
              clipStatus: output?.clips ? Object.values(output.clips)[0]?.status ?? 'unknown' : 'unknown',
              timestamp: new Date().toISOString()
            });
            
            // Song is complete - update audio_url and clear task_id
            const { error: completeUpdateError } = await supabase
              .from('songs')
              .update({ 
                audio_url: clip.audio_url,
                error: null,
                retryable: false,
                task_id: null // Clear task_id since the song is complete
              })
              .eq('id', songs.id);
              
            if (completeUpdateError) {
              console.error('Failed to update song with complete status:', completeUpdateError);
              throw completeUpdateError;
            }
            
            console.log(`Song ${songs.id} marked as complete with audio URL`);
          } else {
            // Song is partially ready - update audio_url but keep task_id
            const { error: progressUpdateError } = await supabase
              .from('songs')
              .update({ 
                audio_url: clip.audio_url,
                error: null,
                retryable: false
                // Keep task_id to indicate generation is still in progress
              })
              .eq('id', songs.id);
              
            if (progressUpdateError) {
              console.error('Failed to update song with partial audio:', progressUpdateError);
              throw progressUpdateError;
            }
            
            console.log(`Song ${songs.id} updated with partial audio URL`);
          }
          
          console.log(`Song update successful in ${Date.now() - updateStart}ms:`, {
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
        console.warn(`Task received but no audio URL found for song ${songs.id}`);
      }
    }
    // SIMPLIFIED ERROR HANDLING: Only handle errors when the error object has a non-zero code and a message
    else if (hasError) {
      console.log('Error object received from API:', taskError);
      
      // Use message or raw_message from the error object
      let errorMsg = taskError.message || taskError.raw_message || 'Music generation failed';
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
          return new Response(JSON.stringify({ success: true, status: 'has_audio_ignoring_error' }), {
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
            task_id: null, // Clear task_id to indicate it's no longer in the queue
            audio_url: null // Ensure no audio_url is set
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