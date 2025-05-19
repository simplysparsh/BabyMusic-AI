import { supabase } from '../lib/supabase';
import { createMusicGenerationTask } from '../lib/piapi';
import { PRESET_CONFIGS } from '../data/lyrics';
import { getPresetType } from '../utils/presetUtils';
import { withRetry } from '../utils/dbUtils';
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
  is_favorite?: boolean;
  updated_at: string;
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
    preset_type: dbSong.preset_type || undefined,
    isFavorite: dbSong.is_favorite ?? false,
    updated_at: dbSong.updated_at ? new Date(dbSong.updated_at) : undefined
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
   * @param ageGroup The baby's age group (optional)
   * @param gender The baby's gender (optional)
   * @returns The task ID for the generation task
   */
  static async startSongGeneration(
    dbSong: DatabaseSong, 
    babyName: string,
    ageGroup?: AgeGroup,
    gender?: string
  ): Promise<string> {
    if (!dbSong.id) {
      throw new Error('Song ID is required to start generation');
    }
    
    try {
      // Create task - use passed-in ageGroup and gender
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
          id,
          name,
          mood,
          theme,
          voice_type,
          lyrics,
          audio_url,
          created_at,
          user_id,
          retryable,
          error,
          task_id,
          song_type,
          preset_type,
          is_favorite, 
          updated_at,
          variations:song_variations(*)
        `
        )
        .eq('user_id', userId)
        .order('is_favorite', { ascending: false })
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

      // Use the unified method with the existing song ID
      return this.generateSong({
        userId,
        name: dbSong.name,
        babyName,
        songParams: {
          theme: dbSong.theme,
          mood: dbSong.mood,
          tempo: dbSong.tempo,
          isInstrumental: !!dbSong.is_instrumental,
          voice: dbSong.voice_type,
          userInput: dbSong.user_lyric_input,
          songType: dbSong.song_type || 'preset',
          preset_type: dbSong.preset_type
        },
        existingSongId: songId // Pass the existing song ID
      });
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

  static async regeneratePresetSongs(userId: string, babyName: string, gender: string, isInitialSetup: boolean = false) {
    // Controlled via .env: VITE_DISABLE_PRESET_REGENERATION=true disables preset song regeneration
    const TEMPORARILY_DISABLE_REGENERATION = import.meta.env.VITE_DISABLE_PRESET_REGENERATION === 'true';
    if (TEMPORARILY_DISABLE_REGENERATION) {
      console.warn('[SongService] Preset song regeneration is temporarily DISABLED via VITE_DISABLE_PRESET_REGENERATION env variable.');
      return;
    }

    const logPrefix = isInitialSetup ? 'Initial-User-Setup' : 'Profile-Update';
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

      // Fetch profile data once
      const profileData = await this.fetchProfileData(userId);
      const ageGroup = profileData.ageGroup;
      
      // Create new preset songs sequentially
      console.log(`${logPrefix}: Creating new preset songs sequentially...`);
      let failedCount = 0;
      for (const [type, config] of Object.entries(PRESET_CONFIGS)) {
        console.log(`${logPrefix}: Starting creation for preset type: ${type}`);
        try {
          await this.generateSong({
            userId,
            name: config.title(babyName),
            babyName,
            songParams: {
              mood: config.mood,
              songType: 'preset',
              preset_type: type as PresetType
            },
            ageGroup,
            gender
          });
          console.log(`${logPrefix}: Successfully initiated creation for preset type: ${type}`);
        } catch (songError) {
          console.error(`${logPrefix}: Failed to create preset song of type ${type}:`, songError);
          failedCount++;
          // Continue to the next preset even if one fails
        }
      }

      // Check if any creation failed
      if (failedCount > 0) {
        console.error(`${logPrefix}: Failed to initiate creation for ${failedCount} preset songs.`);
        // Keep regenerationSuccessful as false
      } else {
          regenerationSuccessful = true;
          console.log(`${logPrefix}: All preset songs initiated successfully.`);
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

  /**
   * Fetches profile data (age group and gender) for a user
   * This centralizes profile data access for song generation
   * @param userId The user ID to fetch profile data for
   * @returns The age group and gender from the profile
   */
  static async fetchProfileData(userId: string): Promise<{ ageGroup?: AgeGroup, gender?: string }> {
    // Validate input
    if (!userId || typeof userId !== 'string') {
      console.error('Invalid user ID provided to fetchProfileData:', userId);
      throw new Error('Valid user ID is required to fetch profile data');
    }
    
    console.log(`Fetching profile data for user ${userId}`);
    
    try {
      const result = await withRetry(() =>
        supabase
          .from('profiles')
          .select('age_group, gender')
          .eq('id', userId)
          .single()
      );
        
      if (result.error) {
        console.error(`Error fetching profile data for user ${userId}:`, result.error);
        throw result.error;
      }
      
      return {
        ageGroup: result.data?.age_group,
        gender: result.data?.gender
      };
    } catch (error) {
      console.error(`Failed to fetch profile data for user ${userId}:`, error);
      // Return empty object rather than throwing to allow generation to proceed with defaults
      return {};
    }
  }

  /**
   * Validates input parameters for song generation
   * @param params Parameters to validate
   * @throws Error if validation fails
   */
  private static validateSongGenerationParams(params: {
    userId: string;
    name: string;
    babyName: string;
    songParams: {
      songType: 'preset' | 'theme' | 'theme-with-input' | 'from-scratch';
      mood?: MusicMood;
      theme?: ThemeType;
    };
  }): void {
    const { userId, name, babyName, songParams } = params;
    
    if (!userId) throw new Error('User ID is required');
    if (!name) throw new Error('Song name is required');
    if (!babyName) throw new Error('Baby name is required');
    if (!songParams.songType) throw new Error('Song type is required');
    
    // Specific validations based on song type
    if (songParams.songType === 'from-scratch' && !songParams.mood) {
      throw new Error('Mood is required for custom songs');
    }
    
    if ((songParams.songType === 'theme' || songParams.songType === 'theme-with-input') && !songParams.theme) {
      throw new Error('Theme is required for theme-based songs');
    }
  }
  
  /**
   * Handles the regeneration of an existing song
   * @param params All parameters needed for song regeneration
   * @returns The regenerated song
   */
  private static async handleExistingSong(params: {
    existingSongId: string;
    name: string;
    babyName: string;
    songParams: {
      tempo?: Tempo;
      voice?: VoiceType;
      theme?: ThemeType;
      mood?: MusicMood;
      userInput?: string;
      isInstrumental?: boolean;
    };
    ageGroup?: AgeGroup;
    gender?: string;
  }): Promise<Song> {
    const { existingSongId, name, babyName, songParams, ageGroup, gender } = params;
    
    console.log(`Regenerating existing song ${existingSongId}`);
    
    // Reset the song state and clear variations
    const customFields = { 
      name, 
      theme: songParams.theme,
      mood: songParams.mood
    };
    
    const resetSong = await this.prepareForRegeneration(existingSongId, customFields);
    
    // Prepare database song with all parameters
    const dbSongForGeneration = { 
      ...resetSong, 
      tempo: songParams.tempo || (resetSong as any).tempo, 
      is_instrumental: songParams.isInstrumental !== undefined ? songParams.isInstrumental : (resetSong as any).is_instrumental, 
      voice_type: songParams.voice || (resetSong as any).voice_type, 
      user_lyric_input: songParams.userInput || (resetSong as any).user_lyric_input 
    };
    
    // Start song generation with complete profile data
    const taskId = await this.startSongGeneration(
      dbSongForGeneration as DatabaseSong, 
      babyName, 
      ageGroup, 
      gender
    );
    
    // Update the song with the new task ID
    await this.updateSongWithTaskId(existingSongId, taskId);
    
    // Return updated song object
    return {
      ...mapDatabaseSongToSong(resetSong),
      task_id: taskId,
      error: undefined,
      retryable: false
    };
  }
  
  /**
   * Handles the creation of a new song
   * @param params All parameters needed for song creation
   * @returns The newly created song
   */
  private static async handleNewSong(params: {
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
    ageGroup?: AgeGroup;
    gender?: string;
  }): Promise<Song> {
    const { userId, name, babyName, songParams, ageGroup, gender } = params;
    
    // Get preset type if applicable
    const presetType = songParams.songType === 'preset' 
      ? (songParams.preset_type || getPresetType(name)) 
      : undefined;
    
    // Determine the appropriate mood
    const determinedMood = this.determineMood({
      songType: songParams.songType,
      presetType,
      mood: songParams.mood
    });
    
    // Create initial song record
    const dbSong = await this.createSongRecord({
      name,
      theme: songParams.theme,
      mood: determinedMood || undefined,
      voice_type: songParams.isInstrumental ? null : songParams.voice,
      tempo: songParams.tempo,
      song_type: songParams.songType,
      lyrics: undefined,
      user_lyric_input: songParams.userInput || undefined,
      preset_type: presetType || undefined,
      is_instrumental: songParams.isInstrumental || false,
      user_id: userId,
      retryable: false,
    });
    
    // Start generation with complete profile data
    const taskId = await this.startSongGeneration(
      dbSong as DatabaseSong, 
      babyName, 
      ageGroup, 
      gender
    );
    
    // Convert database song to Song interface and add task ID
    return {
      ...mapDatabaseSongToSong(dbSong as DatabaseSong),
      task_id: taskId
    };
  }

  /**
   * Unified method to generate a song with complete profile data
   * This serves as the central point for song generation logic
   * @param params All parameters needed for song generation
   * @returns The generated song
   */
  static async generateSong(params: {
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
    ageGroup?: AgeGroup;
    gender?: string;
    existingSongId?: string; // If provided, this will update an existing song instead of creating a new one
  }): Promise<Song> {
    const { userId, name, babyName, songParams, ageGroup: providedAgeGroup, gender: providedGender, existingSongId } = params;
    
    // Validate required parameters
    this.validateSongGenerationParams({
      userId,
      name,
      babyName,
      songParams
    });
    
    console.log('Unified song generation with params:', {
      userId,
      name,
      babyName,
      songParams: {
        ...songParams,
        userInput: songParams.userInput ? 'provided' : 'not provided'
      },
      providedAgeGroup,
      providedGender,
      existingSongId: existingSongId || 'none'
    });

    // If age group or gender are missing, fetch them from profile
    let ageGroup = providedAgeGroup;
    let gender = providedGender;
    
    if (!ageGroup || !gender) {
      console.log('Missing profile data, fetching from database');
      const profileData = await this.fetchProfileData(userId);
      ageGroup = ageGroup || profileData.ageGroup;
      gender = gender || profileData.gender;
    }
    
    // Handle song generation based on whether we're updating an existing song or creating a new one
    if (existingSongId) {
      return this.handleExistingSong({
        existingSongId,
        name,
        babyName,
        songParams,
        ageGroup,
        gender
      });
    } else {
      return this.handleNewSong({
        userId,
        name,
        babyName,
        songParams,
        ageGroup,
        gender
      });
    }
  }
}