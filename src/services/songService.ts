import { supabase } from '../lib/supabase';
import { createMusicGenerationTask } from '../lib/piapi';
import { PRESET_CONFIGS } from '../data/lyrics';
import { getPresetType } from '../utils/presetUtils';
import { DEFAULT_LANGUAGE } from '../types';
import type {
  Song,
  MusicMood,
  ThemeType,
  PresetType,
  Tempo,
  VoiceType,
  AgeGroup,
  SongVariation,
} from '../types';

// Define a type to bridge database schema columns and Song interface
type DatabaseSong = {
  id: string;
  name: string;
  theme?: ThemeType;
  mood?: MusicMood;
  voice_type?: VoiceType;
  tempo?: Tempo;
  song_type?: 'preset' | 'theme' | 'theme-with-input' | 'from-scratch';
  lyrics?: string | null;
  created_at: string;
  user_id: string;
  audio_url?: string | null;
  user_lyric_input?: string | null;
  preset_type?: PresetType | null;
  is_instrumental?: boolean;
  retryable?: boolean;
  error?: string | null;
  task_id?: string | null;
  variations?: DatabaseSongVariation[];
  status?: string;
};

// Define a type for database song variations
type DatabaseSongVariation = {
  id: string;
  song_id: string;
  audio_url: string;
  title?: string;
  created_at: string;
  metadata?: {
    tags?: string;
    prompt?: string;
  };
};

/**
 * Converts a database song to the Song interface format
 * @param dbSong The database song record
 * @returns A song that matches the Song interface
 */
export function mapDatabaseSongToSong(dbSong: any): Song {
  // Convert database variations to SongVariation format if present
  const variations: SongVariation[] | undefined = dbSong.variations?.map(v => ({
    id: v.id,
    songId: v.song_id,
    audio_url: v.audio_url,
    title: v.title,
    created_at: new Date(v.created_at),
    metadata: v.metadata
  }));

  return {
    id: dbSong.id,
    name: dbSong.name,
    theme: dbSong.theme,
    mood: dbSong.mood,
    voice: dbSong.voice_type,
    lyrics: dbSong.lyrics || undefined,
    audio_url: dbSong.audio_url || undefined,
    createdAt: new Date(dbSong.created_at),
    userId: dbSong.user_id,
    retryable: dbSong.retryable,
    variations: variations ? (variations as any[]) : [],
    error: dbSong.error || undefined,
    task_id: dbSong.task_id || undefined,
    song_type: dbSong.song_type,
    preset_type: dbSong.preset_type || undefined
  };
}

// Add the new mapping function for variations
export function mapDatabaseVariationToVariation(dbVariation: any): SongVariation {
  return {
    id: dbVariation.id,
    songId: dbVariation.song_id,
    audio_url: dbVariation.audio_url,
    title: dbVariation.title,
    metadata: dbVariation.metadata as any, // Cast metadata
    created_at: new Date(dbVariation.created_at), // Use created_at (snake_case)
  };
}

export class SongService {
  /**
   * Updates a song with an error status
   * @param songId The ID of the song to update
   * @param errorMessage The error message to set
   * @param options Optional parameters for the update
   * @param options.retryable Whether the song can be retried (defaults to true)
   * @param options.clearTaskId Whether to clear the task_id (defaults to true)
   * @param options.clearAudioUrl Whether to clear the audio_url (defaults to false)
   */
  static async updateSongWithError(
    songId: string,
    errorMessage: string,
    options: {
      retryable?: boolean;
      clearTaskId?: boolean;
      clearAudioUrl?: boolean;
    } = {}
  ): Promise<void> {
    if (!songId) return;

    const {
      retryable = true,
      clearTaskId = true,
      clearAudioUrl = false
    } = options;

    try {
      const updateData: Record<string, any> = {
        error: errorMessage,
        retryable,
        updated_at: new Date().toISOString()
      };

      if (clearTaskId) {
        updateData.task_id = null;
      }

      if (clearAudioUrl) {
        updateData.audio_url = null;
      }

      const result = await withRetry(() => 
        supabase
          .from('songs')
          .update(updateData)
          .eq('id', songId)
      );
        
      if (result.error) {
        console.error(`Failed to update song ${songId} with error:`, result.error);
      }
    } catch (err) {
      console.error(`Error updating song ${songId} with error:`, err);
    }
  }

  /**
   * Starts song generation for a song record that already exists in the database
   * @param dbSong The database song record to generate
   * @param babyName The baby's name for personalization
   * @returns The task ID for the generation task
   */
  static async startSongGeneration(dbSong: DatabaseSong, babyName: string): Promise<string> {
    if (!dbSong.id) {
      throw new Error('Song ID is required to start generation');
    }
    
    try {
      // Get profile data if needed
      let ageGroup: AgeGroup | undefined;
      let gender: string | undefined;
      
      if (dbSong.user_id) {
        const profileResult = await withRetry(() => 
          supabase
            .from('profiles')
            .select('age_group, gender')
            .eq('id', dbSong.user_id)
            .single()
        );
          
        ageGroup = profileResult.data?.age_group as AgeGroup | undefined;
        gender = profileResult.data?.gender as string | undefined;
      }
      
      // Create task
      const taskId = await createMusicGenerationTask({
        theme: dbSong.theme,
        mood: dbSong.mood,
        tempo: dbSong.tempo,
        isInstrumental: !!dbSong.is_instrumental,
        voice: dbSong.voice_type,
        userInput: dbSong.user_lyric_input || undefined,
        songType: dbSong.song_type || 'preset',
        preset_type: dbSong.preset_type || undefined,
        name: babyName,
        gender,
        ageGroup
      });
      
      if (!taskId) {
        throw new Error('Failed to create music generation task');
      }
      
      // Update song with task ID
      const updateResult = await withRetry(() => 
        supabase
          .from('songs')
          .update({
            task_id: taskId,
            error: null,
            retryable: false
          })
          .eq('id', dbSong.id)
      );
        
      if (updateResult.error) {
        throw updateResult.error;
      }
      
      return taskId;
    } catch (error) {
      console.error(`Failed to start generation for song ${dbSong.id}:`, error);
      
      // Update song with error
      await this.updateSongWithError(
        dbSong.id,
        'Failed to start music generation. Please try again.'
      );
      
      throw error;
    }
  }

  static async loadUserSongs(userId: string): Promise<Song[]> {
    if (!userId) {
      throw new Error('User ID is required');
    }

    const result = await withRetry(() =>
      supabase
        .from('songs')
        .select(
          `
          *,
          variations:song_variations(*)
        `
        )
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
    );

    if (result.error) throw result.error;
    
    // Convert database songs to Song interface format
    return (result.data || []).map(dbSong => mapDatabaseSongToSong(dbSong as DatabaseSong));
  }

  static async deleteUserSongs(userId: string): Promise<void> {
    if (!userId) {
      throw new Error('User ID is required');
    }

    // First get all songs for this user to clear their timeouts
    const fetchResult = await withRetry(() => 
      supabase
        .from('songs')
        .select('id')
        .eq('user_id', userId)
    );

    if (fetchResult.error) {
      console.error('Failed to fetch songs for timeout clearing:', fetchResult.error);
    } else if (fetchResult.data && fetchResult.data.length > 0) {
      // No need to clear timeouts anymore
      console.log(`Deleting ${fetchResult.data.length} songs for user ${userId}`);
    }

    const deleteResult = await withRetry(() =>
      supabase
        .from('songs')
        .delete()
        .eq('user_id', userId)
    );

    if (deleteResult.error) throw deleteResult.error;
  }

  /**
   * Retries generation for a failed song
   * @param songId The ID of the song to retry
   * @param userId The user ID
   * @param babyName The baby's name
   */
  static async retrySongGeneration(songId: string, userId: string, babyName: string): Promise<Song> {
    console.log(`Retrying song generation for song ${songId}`);
    
    try {
      // First, get the song details
      const { data: dbSong, error: fetchError } = await supabase
        .from('songs')
        .select('*')
        .eq('id', songId)
        .eq('user_id', userId)
        .single();
      
      if (fetchError || !dbSong) {
        console.error('Failed to fetch song for retry:', fetchError);
        throw new Error('Failed to fetch song details');
      }

      // 1. Reset the song state and clear variations
      const resetSong = await this.prepareForRegeneration(songId);
      
      // 2. Start song generation
      const taskId = await this.startSongGeneration(resetSong as DatabaseSong, babyName);
      
      // 3. Update the song with the new task ID
      await this.updateSongWithTaskId(songId, taskId);
      
      // 4. Return updated song object
      return {
        ...mapDatabaseSongToSong(resetSong),
        task_id: taskId,
        error: undefined,
        retryable: false
      };
    } catch (error) {
      console.error('Error retrying song generation:', error);
      
      // Update the song with the error
      await this.updateSongWithError(
        songId, 
        'Failed to retry song generation. Please try again later.'
      );
      
      throw error;
    }
  }

  /**
   * Determines the appropriate mood for a song based on its type and parameters
   * @param params Parameters to determine the mood
   * @returns The determined mood or undefined if API should choose
   */
  private static determineMood(params: {
    songType: 'preset' | 'theme' | 'theme-with-input' | 'from-scratch';
    presetType?: PresetType | null;
    mood?: MusicMood | null;
  }): MusicMood | undefined {
    const { songType, presetType, mood } = params;

    // For presets: use the preset's defined mood
    if (songType === 'preset' && presetType && PRESET_CONFIGS[presetType]) {
      return PRESET_CONFIGS[presetType].mood;
    }

    // For themes: let API choose based on theme
    if (songType === 'theme' || songType === 'theme-with-input') {
      return undefined;
    }

    // For custom songs: use user-selected mood
    return mood || undefined;
  }

  /**
   * Creates a new song record directly in the database with retry logic
   * @param song The song data to insert
   * @returns The created database song
   */
  static async createSongRecord(song: any): Promise<DatabaseSong> {
    console.log('Creating song record:', song);
    
    try {
      // Check current session to debug permission issues
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      console.log('Current Supabase session:', {
        hasSession: !!sessionData?.session,
        isExpired: sessionData?.session?.expires_at ? new Date(sessionData.session.expires_at * 1000) < new Date() : 'unknown',
        user: sessionData?.session?.user?.id || 'none',
        error: sessionError || 'none'
      });
      
      // Create the song in the database with retry
      console.log('About to insert song into database:', JSON.stringify(song));
      const result = await withRetry(() => 
        supabase
          .from('songs')
          .insert(song)
          .select('*')
          .single()
      );
      
      const createdSong = result.data;
      const error = result.error;
        
      if (error) {
        console.error('Error creating song record:', error);
        console.error('Full error details:', JSON.stringify(error));
        throw new Error(`Failed to create song record: ${error.message || 'Unknown error'}`);
      }
        
      if (!createdSong) {
        console.error('Created song record not found in result');
        console.error('Full result:', JSON.stringify(result));
        throw new Error('Created song record not found');
      }
      
      console.log('Successfully created song record:', {
        id: createdSong.id,
        name: createdSong.name,
        preset_type: createdSong.preset_type
      });
        
      return createdSong as DatabaseSong;
    } catch (error) {
      console.error('Error in createSongRecord:', error);
      console.error('Error stack:', error instanceof Error ? error.stack : 'No stack available');
      console.error('Song data attempted:', JSON.stringify(song, null, 2));
      throw error;
    }
  }

  static async createSong(params: {
    userId: string;
    name: string;
    babyName: string;
    songParams: {
      tempo?: Tempo;
      voice?: VoiceType;
      theme?: ThemeType;
      mood?: MusicMood;
      userInput?: string;
      isInstrumental?: boolean;
      songType: 'preset' | 'theme' | 'theme-with-input' | 'from-scratch';
      preset_type?: PresetType;
    };
  }): Promise<Song> {
    const { userId, name, babyName, songParams } = params;
    const { theme, mood, userInput, tempo, songType, isInstrumental, voice, preset_type: presetTypeParam } = songParams;

    console.log('Creating song with params:', {
      userId,
      name,
      songParams: {
        theme,
        mood,
        userInput: userInput ? `"${userInput}"` : 'not provided',
        tempo,
        isInstrumental,
        voice,
        songType,
        preset_type: presetTypeParam
      },
    });

    if (!userId || !name) {
      throw new Error('User ID and name are required');
    }

    // Get preset type if applicable
    const presetType = songType === 'preset' ? (presetTypeParam || getPresetType(name)) : undefined;

    console.log('Preset detection:', {
      name,
      songType,
      presetType,
      hasConfig: presetType ? !!PRESET_CONFIGS[presetType] : false,
    });

    // For non-preset/non-theme songs, require mood
    if (songType === 'from-scratch' && !mood) {
      throw new Error('Either theme or mood is required');
    }

    // Determine the appropriate mood
    const determinedMood = this.determineMood({
      songType,
      presetType,
      mood
    });

    console.log('Creating song record:', {
      name,
      theme,
      mood: determinedMood,
      voice_type: isInstrumental ? null : voice,
      tempo,
      song_type: songType,
      preset_type: presetType || null,
      is_instrumental: isInstrumental || false,
      user_lyric_input: userInput || null,
      userInput_raw: userInput,
    });

    // Create initial song record
    const dbSong = await this.createSongRecord({
      name,
      theme,
      mood: determinedMood || undefined,
      voice_type: isInstrumental ? null : voice,
      tempo,
      song_type: songType,
      lyrics: undefined,
      user_lyric_input: userInput || undefined,
      preset_type: presetType || undefined,
      is_instrumental: isInstrumental || false,
      user_id: userId,
      retryable: false, // Only set to true when an error occurs
    });

    console.log('Created song record:', {
      id: dbSong.id,
      name: dbSong.name,
      songType,
      hasUserInput: !!userInput
    });

    // Start generation
    let taskId;
    try {
      taskId = await this.startSongGeneration(dbSong as DatabaseSong, babyName);
    } catch (error) {
      console.error('Failed to start song generation:', error);
      throw error;
    }

    // Convert database song to Song interface
    const song = mapDatabaseSongToSong(dbSong as DatabaseSong);
    
    return {
      ...song,
      task_id: taskId
    };
  }

  static async regeneratePresetSongs(userId: string, babyName: string, gender: string, isSignUp: boolean = false) {
    const logPrefix = isSignUp ? 'Sign-up' : 'Profile update';
    console.log(`${logPrefix}: Starting preset song regeneration:`, { userId, babyName, gender });

    let regenerationSuccessful = false;
    try {
      // Delete existing preset songs first
      console.log(`${logPrefix}: Deleting existing preset songs for user ${userId}...`);
      const deleteResult = await withRetry(() =>
        supabase
          .from('songs')
          .delete()
          .eq('user_id', userId)
          .not('preset_type', 'is', null) // Use preset_type to identify presets reliably
      );

      if (deleteResult.error) {
        console.error(`${logPrefix}: Error deleting existing preset songs:`, deleteResult.error);
        throw deleteResult.error; // Propagate error to be caught below
      }
      console.log(`${logPrefix}: Existing preset songs deleted successfully.`);

      // Create new preset songs in parallel
      console.log(`${logPrefix}: Creating new preset songs...`);
      const presetPromises = Object.entries(PRESET_CONFIGS).map(([type, config]) => 
        this.createSong({
          userId,
          name: config.title(babyName),
          babyName, // Pass babyName here
          songParams: {
            mood: config.mood,
            songType: 'preset',
            preset_type: type as PresetType
            // Gender will be fetched within startSongGeneration from profile
          }
        })
      );

      // Wait for all song creation promises to settle
      const results = await Promise.allSettled(presetPromises);
      
      // Check if any promise failed
      const failedGenerations = results.filter(r => r.status === 'rejected');
      if (failedGenerations.length > 0) {
        console.error(`${logPrefix}: Some preset song generations failed:`, failedGenerations);
        // Decide if this constitutes a full failure or partial success.
        // For now, we'll consider it a failure for setting the flag.
        throw new Error(`Failed to generate ${failedGenerations.length} preset songs.`);
      } else {
          regenerationSuccessful = true;
          console.log(`${logPrefix}: All preset songs created/initiated successfully.`);
      }
      
    } catch (error) {
      console.error(`${logPrefix}: Failed to regenerate preset songs:`, error);
      // Don't re-throw; the goal is to finish the signup/update if possible,
      // but log the error and ensure the flag isn't set incorrectly.
    } finally {
      // Update the profile flag only if regeneration was fully successful
      if (regenerationSuccessful) {
        console.log(`${logPrefix}: Updating profile to set preset_songs_generated = true for user ${userId}...`);
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ preset_songs_generated: true })
          .eq('id', userId);
          
        if (updateError) {
          console.error(`${logPrefix}: Failed to update preset_songs_generated flag for user ${userId}:`, updateError);
          // Log this error, but don't block the overall process completion
        } else {
           console.log(`${logPrefix}: Profile flag updated successfully.`);
        }
      }
    }
  }

  /**
   * Updates a song's basic state fields to reset it
   * @param songId The ID of the song to reset
   * @param customFields Optional custom fields to update along with the reset
   * @returns The updated database song
   */
  static async resetSongState(songId: string, customFields: Partial<DatabaseSong> = {}): Promise<DatabaseSong> {
    console.log(`Resetting song state for song ${songId}`);
    
    try {
      // Standard reset fields that clear the song state
      const resetFields = {
        error: null,
        retryable: false,
        audio_url: null,
        task_id: null // Clear this so we don't think it's still generating
      };

      // Combine reset fields with any custom fields
      const updateFields = {
        ...resetFields,
        ...customFields
      };

      // Update the song with reset fields
      const result = await withRetry(() => 
        supabase
          .from('songs')
          .update(updateFields)
          .eq('id', songId)
          .select('*')
          .single()
      );
        
      // Extract data and error from result
      const updatedSong = result.data;
      const updateError = result.error;
      
      if (updateError) {
        console.error('Error resetting song state:', updateError);
        throw new Error('Failed to reset song state');
      }

      if (!updatedSong) {
        throw new Error('Song not found after reset');
      }
      
      return updatedSong as DatabaseSong;
    } catch (error) {
      console.error(`Error in resetSongState for song ${songId}:`, error);
      throw error;
    }
  }

  /**
   * Clears any variations for a song
   * @param songId The ID of the song to clear variations for
   */
  static async clearSongVariations(songId: string): Promise<void> {
    console.log(`Clearing variations for song ${songId}`);
    
    try {
      // Check if variations exist
      const variationsResult = await withRetry(() => 
        supabase
          .from('song_variations')
          .select('id')
          .eq('song_id', songId)
      );
        
      if (variationsResult.error) {
        console.error(`Error checking variations for song ${songId}:`, variationsResult.error);
        throw new Error('Failed to check for existing variations');
      }

      // If variations exist, delete them
      if (variationsResult.data && variationsResult.data.length > 0) {
        console.log(`Deleting ${variationsResult.data.length} variations for song ${songId}`);
        
        const deleteResult = await withRetry(() => 
          supabase
            .from('song_variations')
            .delete()
            .eq('song_id', songId)
        );
        
        if (deleteResult.error) {
          console.error(`Error deleting variations for song ${songId}:`, deleteResult.error);
          throw new Error('Failed to delete variations');
        }
      }
    } catch (error) {
      console.error(`Error in clearSongVariations for song ${songId}:`, error);
      throw error;
    }
  }

  /**
   * Prepares a song for regeneration by resetting state and clearing variations
   * @param songId The ID of the song to prepare
   * @param customFields Optional custom fields to update
   * @returns The updated song
   */
  static async prepareForRegeneration(songId: string, customFields: Partial<DatabaseSong> = {}): Promise<DatabaseSong> {
    try {
      // First reset the song state
      const updatedSong = await this.resetSongState(songId, customFields);
      
      // Then clear any variations
      await this.clearSongVariations(songId);
      
      return updatedSong;
    } catch (error) {
      console.error(`Error preparing song ${songId} for regeneration:`, error);
      throw error;
    }
  }

  /**
   * Updates a song with a task ID
   * @param songId The ID of the song to update
   * @param taskId The task ID to set
   */
  static async updateSongWithTaskId(songId: string, taskId: string): Promise<void> {
    console.log(`Updating song ${songId} with task ID ${taskId}`);
    
    try {
      const result = await withRetry(() =>
        supabase
          .from('songs')
          .update({ task_id: taskId })
          .eq('id', songId)
      );
        
      if (result.error) {
        console.error(`Error updating song ${songId} with task ID:`, result.error);
        throw new Error('Failed to update song with task ID');
      }
    } catch (error) {
      console.error(`Error in updateSongWithTaskId for song ${songId}:`, error);
      throw error;
    }
  }
}

/**
 * Utility function for robust database operations with retry logic
 * @param operation The database operation to perform
 * @param maxRetries Maximum number of retry attempts (default: 3)
 * @param timeoutMs Timeout in milliseconds (default: 8000)
 * @returns The result of the operation
 */
const withRetry = async <T>(operation: () => Promise<T> | T, maxRetries = 3, timeoutMs = 8000): Promise<T> => {
  let lastError: any;
  let retryCount = 0;
  
  while (retryCount <= maxRetries) {
    try {
      // Create a timeout promise
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => {
          reject(new Error(`Operation timed out after ${timeoutMs}ms`));
        }, timeoutMs);
      });
      
      // Race between the operation and the timeout
      const result = await Promise.race([
        operation(),
        timeoutPromise
      ]);
      
      return result;
    } catch (error: any) {
      lastError = error;
      
      // If this is a timeout error, log and continue to retry
      if (error.message && error.message.includes('timed out')) {
        console.warn(`Operation timed out, retrying (attempt ${retryCount + 1}/${maxRetries})`);
      }
      // If this is a non-retriable error, throw immediately
      else if (error?.code === 'PGRST116' || error?.code === '23505') {
        console.error('Non-retriable database error:', error);
        throw error;
      }
      
      if (retryCount >= maxRetries) {
        break;
      }
      
      // Exponential backoff
      const delay = 500 * Math.pow(2, retryCount);
      console.warn(`Database operation failed, retrying in ${delay}ms (attempt ${retryCount + 1}/${maxRetries}):`, error);
      
      await new Promise(resolve => setTimeout(resolve, delay));
      retryCount++;
    }
  }
  
  console.error(`All ${maxRetries} retry attempts failed for database operation:`, lastError);
  throw lastError;
};