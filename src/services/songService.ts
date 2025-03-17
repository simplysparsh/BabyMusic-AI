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
  SongVariation
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
export function mapDatabaseSongToSong(dbSong: DatabaseSong): Song {
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
    variations,
    error: dbSong.error || undefined,
    task_id: dbSong.task_id || undefined,
    song_type: dbSong.song_type,
    preset_type: dbSong.preset_type || undefined
  };
}

export class SongService {
  /**
   * Updates a song with an error status
   * @param songId The ID of the song to update
   * @param errorMessage The error message to set
   * @param retryable Whether the song can be retried
   */
  static async updateSongWithError(songId: string, errorMessage: string, retryable: boolean = true): Promise<void> {
    if (!songId) return;
    
    try {
      const { error } = await supabase
        .from('songs')
        .update({
          error: errorMessage,
          retryable: retryable,
          task_id: null // Clear task_id to indicate it's no longer in the queue
        })
        .eq('id', songId);
        
      if (error) {
        console.error(`Failed to update song ${songId} with error:`, error);
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
        const { data: profile } = await supabase
          .from('profiles')
          .select('age_group, gender')
          .eq('id', dbSong.user_id)
          .single();
          
        ageGroup = profile?.age_group as AgeGroup | undefined;
        gender = profile?.gender as string | undefined;
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
      const { error: updateError } = await supabase
        .from('songs')
        .update({
          task_id: taskId,
          error: null,
          retryable: false
        })
        .eq('id', dbSong.id);
        
      if (updateError) {
        throw updateError;
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

    const { data: dbSongs, error } = await supabase
      .from('songs')
      .select(
        `
        *,
        variations:song_variations(*)
      `
      )
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    // Convert database songs to Song interface format
    return (dbSongs || []).map(dbSong => mapDatabaseSongToSong(dbSong as DatabaseSong));
  }

  static async deleteUserSongs(userId: string): Promise<void> {
    if (!userId) {
      throw new Error('User ID is required');
    }

    // First get all songs for this user to clear their timeouts
    const { data: songs, error: fetchError } = await supabase
      .from('songs')
      .select('id')
      .eq('user_id', userId);

    if (fetchError) {
      console.error('Failed to fetch songs for timeout clearing:', fetchError);
    } else if (songs && songs.length > 0) {
      // No need to clear timeouts anymore
      console.log(`Deleting ${songs.length} songs for user ${userId}`);
    }

    const { error } = await supabase
      .from('songs')
      .delete()
      .eq('user_id', userId);

    if (error) throw error;
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
    const { data: dbSong, error: createError } = await supabase
      .from('songs')
      .insert([{
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
      }])
      .select()
      .single();

    if (createError) {
      console.error('Failed to create song record:', {
        error: createError,
        params: {
          name,
          theme,
          mood: determinedMood,
          songType,
          hasUserInput: !!userInput
        }
      });
      throw createError;
    }

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

  static async regeneratePresetSongs(userId: string, babyName: string, isSilent: boolean = false) {
    if (!isSilent) {
      console.log('Starting preset song regeneration:', { userId, babyName });
    }

    try {
      // Delete existing preset songs first
      const { error: deleteError } = await supabase
        .from('songs')
        .delete()
        .eq('user_id', userId)
        .or('name.ilike.%playtime%,name.ilike.%mealtime%,name.ilike.%bedtime%,name.ilike.%potty%');

      if (deleteError) throw deleteError;

      // Create new preset songs in parallel
      const presetPromises = Object.entries(PRESET_CONFIGS).map(([type, config]) => 
        this.createSong({
          userId,
          name: config.title(babyName),
          babyName,
          songParams: {
            mood: config.mood,
            songType: 'preset',
            preset_type: type as PresetType
          }
        })
      );

      await Promise.all(presetPromises);
      
      if (!isSilent) {
        console.log('Preset song regeneration completed successfully');
      }
    } catch (error) {
      if (!isSilent) {
        console.error('Failed to regenerate preset songs:', error);
      }
      // Don't throw - let the error be handled by the UI layer if needed
    }
  }

  /**
   * Generates preset songs for a user during the sign-up process
   * @param babyName The baby's name to use in song generation
   * @param email The email to use for profile creation
   * @returns The user ID
   */
  static async generatePresetSongsForNewUser(babyName: string, email: string): Promise<string> {
    console.log('Starting preset song generation for new user:', { babyName, email });
    
    // Generate a UUID for the user
    let userId;
    try {
      userId = crypto.randomUUID();
    } catch (error) {
      console.error('crypto.randomUUID() not available, using fallback:', error);
      userId = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    }
    
    console.log(`Generated user ID: ${userId}`);
    
    try {
      // First check if a profile with this email already exists
      const { data: existingProfile, error: queryError } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', email)
        .maybeSingle();
        
      if (queryError) {
        console.error('Error checking for existing profile:', queryError);
      } else if (existingProfile) {
        console.log(`Found existing profile with ID ${existingProfile.id} for email ${email}`);
        return existingProfile.id;
      }
      
      // Create a simple profile with just name and email
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .insert([{ 
          id: userId,
          baby_name: babyName,
          email: email,
          created_at: new Date().toISOString(),
          preset_songs_generated: false,
          preferred_language: DEFAULT_LANGUAGE
        }])
        .select('*')
        .single();

      if (profileError) {
        // If it's a duplicate key error, try to fetch the existing profile
        if (profileError.code === '23505') {
          console.log('Duplicate key error, trying to fetch existing profile');
          const { data: retryProfile, error: retryError } = await supabase
            .from('profiles')
            .select('id')
            .eq('email', email)
            .maybeSingle();
            
          if (retryError) {
            console.error('Error fetching existing profile on retry:', retryError);
            throw new Error(`Failed to fetch existing profile: ${retryError.message}`);
          }
          
          if (retryProfile) {
            console.log(`Found existing profile on retry with ID ${retryProfile.id}`);
            return retryProfile.id;
          }
        }
        
        console.error('Failed to create profile:', profileError);
        throw new Error(`Failed to create profile: ${profileError.message}`);
      }
      
      console.log('Successfully created profile:', profile);
      
      // Start generating preset songs in the background
      this.startPresetSongGeneration(userId, babyName);
      
      return userId;
    } catch (error) {
      console.error('Error in generatePresetSongsForNewUser:', error);
      throw error;
    }
  }
  
  /**
   * Starts generating preset songs in the background
   * This is separated from the profile creation to keep the code clean
   * @param userId The user ID to associate the songs with
   * @param babyName The baby's name to use in song generation
   */
  private static startPresetSongGeneration(userId: string, babyName: string): void {
    // Small delay to ensure profile is fully created before starting song generation
    setTimeout(() => {
      // Generate each preset song type
      Object.entries(PRESET_CONFIGS).forEach(([type, config]) => {
        this.createSong({
          userId,
          name: config.title(babyName),
          babyName,
          songParams: {
            mood: config.mood,
            songType: 'preset',
            preset_type: type as PresetType,
          }
        }).then(() => {
          console.log(`Successfully created preset song ${type} for user ${userId}`);
        }).catch(error => {
          console.error(`Failed to create preset song ${type} for user ${userId}:`, {
            message: error.message,
            code: error.code
          });
          // Don't throw - we want to continue with sign-up even if song generation fails
        });
      });
    }, 100);
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
      const { data: updatedSong, error: updateError } = await supabase
        .from('songs')
        .update(updateFields)
        .eq('id', songId)
        .select('*')
        .single();
        
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
   * Deletes all variations associated with a song
   * @param songId The ID of the song to clear variations for
   */
  static async clearSongVariations(songId: string): Promise<void> {
    console.log(`Clearing variations for song ${songId}`);
    
    try {
      // Check if variations exist
      const { data: variations, error: variationsError } = await supabase
        .from('song_variations')
        .select('id')
        .eq('song_id', songId);
        
      if (variationsError) {
        console.error(`Error checking variations for song ${songId}:`, variationsError);
        throw new Error('Failed to check for existing variations');
      }

      // If variations exist, delete them
      if (variations && variations.length > 0) {
        console.log(`Deleting ${variations.length} variations for song ${songId}`);
        
        const { error: deleteVariationsError } = await supabase
          .from('song_variations')
          .delete()
          .eq('song_id', songId);
        
        if (deleteVariationsError) {
          console.error(`Error deleting variations for song ${songId}:`, deleteVariationsError);
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
   * Updates a song with a task ID for tracking the generation
   * @param songId The ID of the song to update
   * @param taskId The task ID to set
   * @returns The updated song
   */
  static async updateSongWithTaskId(songId: string, taskId: string): Promise<void> {
    console.log(`Updating song ${songId} with task ID ${taskId}`);
    
    try {
      const { error } = await supabase
        .from('songs')
        .update({ task_id: taskId })
        .eq('id', songId);
        
      if (error) {
        console.error(`Error updating song ${songId} with task ID:`, error);
        throw new Error('Failed to update song with task ID');
      }
    } catch (error) {
      console.error(`Error in updateSongWithTaskId for song ${songId}:`, error);
      throw error;
    }
  }
}