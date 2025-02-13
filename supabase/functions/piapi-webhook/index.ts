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

    // Update song based on status
    if (status === 'completed' && output?.clips) {
      const clips = Object.values(output.clips) as AudioClip[];
      const clipsWithAudio = clips.filter((clip): clip is AudioClip => !!clip?.audio_url);
      
      console.log('Processing audio clips:', {
        songId: songs.id,
        clipCount: clipsWithAudio.length
      });
      
      if (clipsWithAudio.length > 0) {
        // First update the main song
        const { error: updateError } = await supabase
          .from('songs')
          .update({ 
            audio_url: clipsWithAudio[0]?.audio_url,
            error: null
          })
          .eq('id', songs.id)
          .eq('task_id', task_id.toString());

        if (updateError) {
          throw updateError;
        }

        // Then create variations
        const variations = clipsWithAudio.map((clip) => ({
          song_id: songs.id,
          audio_url: clip.audio_url,
          title: clip.title || null,
          metadata: {
            tags: clip.metadata?.tags || null,
            prompt: clip.metadata?.prompt || null
          }
        }));
        
        console.log('Creating variations:', variations.length);
        
        // Delete any existing variations first
        const { error: deleteError } = await supabase
          .from('song_variations')
          .delete()
          .eq('song_id', songs.id);

        if (deleteError) {
          throw deleteError;
        }
        
        const { error: variationError } = await supabase
          .from('song_variations')
          .insert(variations);

        if (variationError) {
          throw variationError;
        }
        
        console.log('Successfully processed song and variations:', {
          songId: songs.id,
          variationCount: variations.length
        });
      }
    } else if (status === 'failed' || error) {
      const errorMsg = error?.message || 'Music generation failed';
      const { error: updateError } = await supabase
        .from('songs')
        .update({ 
          error: errorMsg,
          audio_url: null 
        })
        .eq('id', songs.id)
        .eq('task_id', task_id.toString());

      if (updateError) {
        throw updateError;
      }
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