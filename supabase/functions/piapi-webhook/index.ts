// @ts-ignore
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
// @ts-ignore
import { createClient, SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0'

// Types
interface AudioClip {
  id: string;
  audio_url: string;
  title?: string;
  metadata?: {
    tags?: string;
    prompt?: string;
  };
}

interface WebhookResponse {
  success: boolean;
  status?: string;
  error?: string;
}

interface TaskData {
  task_id: string;
  status: string;
  error?: any;
  output?: {
    progress?: number;
    clips?: Record<string, AudioClip>;
  };
}

interface Song {
  id: string;
  task_id?: string;
  audio_url?: string;
  error?: string;
}

// Configuration
class Config {
  static WEBHOOK_SECRET = Deno.env.get('VITE_WEBHOOK_SECRET');
  static SUPABASE_URL = Deno.env.get('SUPABASE_URL') || '';
  static SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

  static logStartup(): void {
    console.log('Edge Function started:', {
      hasWebhookSecret: !!this.WEBHOOK_SECRET,
      hasSupabaseUrl: !!this.SUPABASE_URL,
      hasServiceRoleKey: !!this.SUPABASE_SERVICE_ROLE_KEY,
      timestamp: new Date().toISOString()
    });
  }
}

// Logger service with consistent formatting
class Logger {
  static log(message: string, data?: Record<string, any>): void {
    if (data) {
      console.log(message, {
        ...data,
        timestamp: new Date().toISOString()
      });
    } else {
      console.log(message, { timestamp: new Date().toISOString() });
    }
  }

  static error(message: string, error?: any): void {
    console.error(message, error);
  }

  static logStatusUpdate(status: string, taskId: string, progress?: number): void {
    console.log('\n#######################');
    console.log('# Status now:', status);
    console.log('# Task ID:', taskId);
    console.log('# Progress:', progress || 'N/A');
    console.log('#######################\n');
    
    console.log('\n##### Status now:', status, '#####\n');
  }
}

// Response factory for consistent response formatting
class ResponseFactory {
  static createSuccessResponse(data: Partial<WebhookResponse> = {}): Response {
    return new Response(
      JSON.stringify({ success: true, ...data }),
      { 
        headers: { 'Content-Type': 'application/json' },
        status: 200
      }
    );
  }

  static createErrorResponse(error: string, status: number): Response {
    return new Response(
      JSON.stringify({ 
        error, 
        status: 'error',
        success: false
      }),
      {
        headers: { 'Content-Type': 'application/json' },
        status
      }
    );
  }
}

// Authentication service to validate webhook requests
class WebhookAuthenticator {
  static extractSecret(headers: Headers): string | null {
    return headers.get('x-webhook-secret') || 
           headers.get('x-secret') ||
           headers.get('webhook-secret') ||
           headers.get('secret');
  }

  static validateSecret(secret: string | null): boolean {
    return !!secret && secret === Config.WEBHOOK_SECRET;
  }

  static logHeaders(headers: Headers): void {
    const allHeaders = [...headers.keys()];
    Logger.log('All received headers:', { headerNames: allHeaders });

    const requestHeaders = Object.fromEntries(
      [...headers].filter(([key]) => !key.toLowerCase().includes('secret'))
    );
    
    Logger.log('Webhook received:', {
      headers: requestHeaders
    });

    // Log JWT verification status
    Logger.log('JWT VERIFICATION STATUS:', {
      status: 'DISABLED',
      reason: 'JWT verification is explicitly disabled by design for this webhook function',
      deploymentFlag: '--no-verify-jwt'
    });

    // Log if Authorization header is present (JWT might be required)
    if (headers.has('Authorization')) {
      Logger.log('JWT VERIFICATION CHECK: Authorization header is present', {
        headerValue: headers.get('Authorization')?.substring(0, 20) + '...',
        jwtMightBeRequired: false
      });
    } else {
      Logger.log('JWT VERIFICATION CHECK: No Authorization header found', {
        jwtMightBeRequired: false,
        note: 'JWT verification is disabled by design, so no Authorization header is required'
      });
    }

    Logger.log('Webhook secret check:', {
      hasSecret: !!this.extractSecret(headers),
      expectedSecret: !!Config.WEBHOOK_SECRET,
      checkedHeaders: ['x-webhook-secret', 'x-secret', 'webhook-secret', 'secret']
    });
  }
}

// Database service to handle all Supabase interactions
class SongDatabase {
  public supabase: SupabaseClient;  // Make it public for emergency fixes

  constructor() {
    this.supabase = createClient(Config.SUPABASE_URL, Config.SUPABASE_SERVICE_ROLE_KEY);
  }

  async findSongByTaskId(taskId: string): Promise<Song | null> {
    Logger.log(`Looking for song with task_id: ${taskId}`);
    const { data, error } = await this.supabase
      .from('songs')
      .select('id, task_id, audio_url, error')
      .eq('task_id', taskId.toString())
      .maybeSingle();

    if (error) {
      Logger.error('Database error finding song:', error);
      throw error;
    }

    return data;
  }

  async getSongCurrentState(songId: string): Promise<Song | null> {
    const { data, error } = await this.supabase
      .from('songs')
      .select('id, task_id, audio_url, error')
      .eq('id', songId)
      .single();
      
    if (error) {
      Logger.error('Error checking song current state:', error);
      throw error;
    }
    
    return data;
  }

  async updateSongWithAudioUrl(songId: string, audioUrl: string, isComplete: boolean): Promise<void> {
    const updateStart = Date.now();
    Logger.log(`Updating song ${songId} with audio URL - START`);
    
    // Use a more flexible type with index signature
    const updateData: Record<string, any> = { 
      audio_url: audioUrl,
      error: null,
      retryable: false
    };
    
    if (isComplete) {
      // Add task_id: null only if the song is complete
      // Also add updated_at to force React to detect the change
      Object.assign(updateData, { 
        task_id: null,
        updated_at: new Date().toISOString() // Use updated_at instead of _lastUpdated
      });
    } else {
      // For partial updates, still update the timestamp
      Object.assign(updateData, {
        updated_at: new Date().toISOString() // Use updated_at instead of _lastUpdated
      });
    }
    
    const { error } = await this.supabase
      .from('songs')
      .update(updateData)
      .eq('id', songId);
      
    if (error) {
      Logger.error(`Failed to update song with ${isComplete ? 'complete' : 'partial'} status:`, error);
      throw error;
    }
    
    Logger.log(`Song update successful in ${Date.now() - updateStart}ms:`, {
      songId,
      isComplete,
      fields: Object.keys(updateData).join(', ')
    });
  }

  /**
   * Updates a song with an error status
   * @param songId The ID of the song to update
   * @param errorMsg The error message to set
   * @param options Optional parameters for the update
   * @param options.retryable Whether the song can be retried (defaults to false)
   * @param options.clearTaskId Whether to clear the task_id (defaults to true)
   * @param options.clearAudioUrl Whether to clear the audio_url (defaults to true)
   */
  async updateSongWithError(
    songId: string,
    errorMsg: string,
    options: {
      retryable?: boolean;
      clearTaskId?: boolean;
      clearAudioUrl?: boolean;
    } = {}
  ): Promise<void> {
    const {
      retryable = false,
      clearTaskId = true,
      clearAudioUrl = true
    } = options;

    Logger.log(`Marking song ${songId} as failed with error: ${errorMsg}`);
    
    const updateData: Record<string, any> = {
      error: errorMsg,
      retryable,
      updated_at: new Date().toISOString()
    };

    if (clearTaskId) {
      updateData.task_id = null;
    }

    if (clearAudioUrl) {
      updateData.audio_url = null;
    }

    const { error } = await this.supabase
      .from('songs')
      .update(updateData)
      .eq('id', songId);

    if (error) {
      Logger.error('Failed to update song with error:', error);
      throw error;
    }
    
    Logger.log(`Successfully marked song ${songId} as failed`);
  }
}

// Task processors for different webhook scenarios
class AudioClipProcessor {
  private db: SongDatabase;
  
  constructor(db: SongDatabase) {
    this.db = db;
  }
  
  async processAudioClip(song: Song, taskData: TaskData): Promise<Response | null> {
    const { task_id, status, output } = taskData;
    
    if (!output?.clips) {
      Logger.log(`No clips found in webhook for task ${task_id}`);
      return null;
    }
    
    Logger.log(`[WEBHOOK] Processing clip output with status: ${status}`, { 
      songId: song.id,
      taskId: task_id
    });
    
    const clip = Object.values(output.clips)[0] as AudioClip;
    
    if (!clip?.audio_url) {
      Logger.log(`[WEBHOOK] Task received but no audio URL found for song ${song.id}`);
      return null;
    }
    
    try {
      // Determine if this is a completion status
      const isComplete = status === 'completed' || status === 'complete';
      
      Logger.log(`[WEBHOOK] Processing audio for song ${song.id}`, {
        status,
        isComplete,
        audioUrl: clip.audio_url.substring(0, 30) + '...',
        taskId: task_id
      });
      
      // SIMPLIFY: Direct database update for all cases
      if (isComplete) {
        // When completed, set permanent URL and clear task_id
        Logger.log(`[WEBHOOK] Marking song ${song.id} as COMPLETED with permanent URL`);
        
        const { error } = await this.db.supabase
          .from('songs')
          .update({
            audio_url: clip.audio_url,
            task_id: null,
            error: null,
            retryable: false,
            updated_at: new Date().toISOString() // Use updated_at instead of _lastUpdated
          })
          .eq('id', song.id);
        
        if (error) {
          Logger.error(`[WEBHOOK] Failed to update song ${song.id} with completed status:`, error);
        } else {
          Logger.log(`[WEBHOOK] Successfully updated song ${song.id} with COMPLETED status and permanent URL`);
        }
      } else {
        // For non-complete statuses, check if we need to set a temporary URL
        const currentSong = await this.db.getSongCurrentState(song.id);
        
        if (!currentSong?.audio_url) {
          Logger.log(`[WEBHOOK] Setting initial temporary URL for song ${song.id}`);
          
          const { error } = await this.db.supabase
            .from('songs')
            .update({
              audio_url: clip.audio_url,
              // Keep task_id as is for temporary URL
              error: null,
              retryable: false,
              updated_at: new Date().toISOString() // Use updated_at instead of _lastUpdated
            })
            .eq('id', song.id);
          
          if (error) {
            Logger.error(`[WEBHOOK] Failed to update song ${song.id} with temporary URL:`, error);
          } else {
            Logger.log(`[WEBHOOK] Successfully updated song ${song.id} with temporary URL`);
          }
        } else {
          Logger.log(`[WEBHOOK] Song ${song.id} already has a URL, keeping existing URL for non-complete status`);
        }
      }
      
      return null;
    } catch (err) {
      Logger.error(`[WEBHOOK] Error processing audio update for song ${song.id}:`, err);
      return null;
    }
  }
}

class ErrorProcessor {
  private db: SongDatabase;
  
  constructor(db: SongDatabase) {
    this.db = db;
  }
  
  isActualError(taskError: any): boolean {
    return taskError && 
           typeof taskError === 'object' && 
           'code' in taskError && 
           taskError.code !== 0 && 
           ('message' in taskError || 'raw_message' in taskError) && 
           (taskError.message || taskError.raw_message);
  }
  
  async processError(song: Song, taskData: TaskData): Promise<Response | null> {
    const { task_id, error: taskError } = taskData;
    
    if (!this.isActualError(taskError)) {
      return null;
    }
    
    Logger.log('Error object received from API:', taskError);
    
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

    Logger.log('Task failed:', {
      taskId: task_id,
      error: errorMsg,
      retryable
    });

    try {
      // First check if the song already has an audio URL
      const currentSong = await this.db.getSongCurrentState(song.id);
      
      // If the song already has an audio URL, don't mark it as failed
      if (currentSong?.audio_url) {
        Logger.log(`Song ${song.id} already has audio URL, not marking as failed`);
        return ResponseFactory.createSuccessResponse({ status: 'has_audio_ignoring_error' });
      }

      await this.db.updateSongWithError(song.id, errorMsg, {
        retryable,
        clearTaskId: true,
        clearAudioUrl: true
      });
      
      return null; // Continue processing
    } catch (err) {
      Logger.error('Error handling song failure:', err);
      // Don't rethrow to ensure the webhook doesn't retry
      return null; // Continue processing
    }
  }
}

// Main webhook handler
class WebhookHandler {
  private db: SongDatabase;
  private audioProcessor: AudioClipProcessor;
  private errorProcessor: ErrorProcessor;
  
  constructor() {
    this.db = new SongDatabase();
    this.audioProcessor = new AudioClipProcessor(this.db);
    this.errorProcessor = new ErrorProcessor(this.db);
  }
  
  async validateRequest(req: Request): Promise<{ valid: boolean; response?: Response }> {
    WebhookAuthenticator.logHeaders(req.headers);
    
    const secret = WebhookAuthenticator.extractSecret(req.headers);
    
    if (!secret) {
      return {
        valid: false,
        response: ResponseFactory.createErrorResponse('Missing webhook secret header', 401)
      };
    }

    if (!WebhookAuthenticator.validateSecret(secret)) {
      return {
        valid: false,
        response: ResponseFactory.createErrorResponse('Invalid webhook secret', 401)
      };
    }
    
    return { valid: true };
  }
  
  async parseBody(req: Request): Promise<{ valid: boolean; data?: any; response?: Response }> {
    try {
      const body = await req.json();
      Logger.log(`Webhook body: ${JSON.stringify(body, null, 2)}`);
      
      const { data } = body;
      if (!data) {
        return {
          valid: false,
          response: ResponseFactory.createErrorResponse('Missing data object in webhook body', 400)
        };
      }
      
      const { task_id } = data;
      if (!task_id) {
        return {
          valid: false,
          response: ResponseFactory.createErrorResponse('Missing task_id in webhook body', 400)
        };
      }
      
      return { valid: true, data };
    } catch (error) {
      Logger.error('Failed to parse webhook body:', error);
      return {
        valid: false,
        response: ResponseFactory.createErrorResponse('Invalid JSON body', 400)
      };
    }
  }
  
  async processWebhook(taskData: TaskData): Promise<Response> {
    const { task_id, status, output } = taskData;
    
    // Find the song with the given task_id
    const song = await this.db.findSongByTaskId(task_id);
    
    if (!song) {
      return ResponseFactory.createErrorResponse(`No song found for task_id: ${task_id}`, 404);
    }
    
    Logger.log('Processing webhook:', {
      task_id,
      status,
      error: taskData.error,
      hasOutput: !!output
    });
    
    Logger.logStatusUpdate(status, task_id, output?.progress);
    
    // Log status update with error info if present
    const hasError = this.errorProcessor.isActualError(taskData.error);
    Logger.log('Task status update:', {
      taskId: task_id,
      status,
      hasError,
      errorDetails: taskData.error && typeof taskData.error === 'object' ? {
        code: 'code' in taskData.error ? taskData.error.code : 0,
        message: 'message' in taskData.error ? taskData.error.message : 
                 ('raw_message' in taskData.error ? taskData.error.raw_message : ''),
        detail: 'detail' in taskData.error ? taskData.error.detail : null
      } : null
    });

    Logger.log('Webhook received:', {
      taskId: task_id,
      status,
      hasOutput: !!output,
      clipCount: output?.clips ? Object.keys(output.clips).length : 0
    });
    
    // Process audio clips if present
    if (output?.clips) {
      const audioResponse = await this.audioProcessor.processAudioClip(song, taskData);
      if (audioResponse) return audioResponse;
    }
    // Process errors if present
    else if (hasError) {
      const errorResponse = await this.errorProcessor.processError(song, taskData);
      if (errorResponse) return errorResponse;
    }
    else {
      Logger.log('Unhandled task status:', { taskId: task_id, status });
    }
    
    return ResponseFactory.createSuccessResponse();
  }
  
  async handleRequest(req: Request): Promise<Response> {
    try {
      // Validate the request
      const validationResult = await this.validateRequest(req);
      if (!validationResult.valid) {
        return validationResult.response!;
      }
      
      // Parse the request body
      const parseResult = await this.parseBody(req);
      if (!parseResult.valid) {
        return parseResult.response!;
      }
      
      // Process the webhook
      return await this.processWebhook(parseResult.data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      Logger.error('Webhook error:', {
        error: errorMessage,
        stack: err instanceof Error ? err.stack : undefined,
        details: err
      });
      
      // Don't expose detailed error information in the response
      return ResponseFactory.createErrorResponse(
        'An error occurred processing the webhook',
        err instanceof Error && err.message.includes('not found') ? 404 : 500
      );
    }
  }
}

// Initialize the application
Config.logStartup();

// Start the server
serve(async (req) => {
  const handler = new WebhookHandler();
  return await handler.handleRequest(req);
})