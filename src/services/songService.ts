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
  MusicGenerationParams
} from '../types';

// Define the timeout duration for song generation (4 minutes in milliseconds)
const SONG_GENERATION_TIMEOUT = 4 * 60 * 1000; // 4 minutes
// Define a longer timeout for retries (6 minutes in milliseconds)
const RETRY_GENERATION_TIMEOUT = 6 * 60 * 1000; // 6 minutes

export class SongService {
  // Map to store timeout IDs for each song
  private static timeoutIds: Map<string, NodeJS.Timeout> = new Map();

  /**
   * Sets a timeout for song generation
   * @param songId The ID of the song to set a timeout for
   */
  private static setSongGenerationTimeout(songId: string, isRetry: boolean = false): void {
    // Clear any existing timeout for this song
    this.clearSongGenerationTimeout(songId);
    
    // Set a new timeout with longer duration for retries
    const timeoutDuration = isRetry ? RETRY_GENERATION_TIMEOUT : SONG_GENERATION_TIMEOUT;
    const timeoutMinutes = isRetry ? 6 : 4;
    
    const timeoutId = setTimeout(async () => {
      console.log(`Song generation timeout reached for song ${songId} after ${timeoutMinutes} minutes`);
      
      try {
        // Update the song with a timeout error
        const { error } = await supabase
          .from('songs')
          .update({
            error: `Song generation timed out after ${timeoutMinutes} minutes. Please try again.`,
            retryable: true
          })
          .eq('id', songId);
          
        if (error) {
          console.error('Failed to update song with timeout error:', error);
        }
      } catch (err) {
        console.error('Error handling song generation timeout:', err);
      } finally {
        // Clean up the timeout reference
        this.timeoutIds.delete(songId);
      }
    }, timeoutDuration);
    
    // Store the timeout ID
    this.timeoutIds.set(songId, timeoutId);
    
    // Set up a subscription to clear the timeout if the song gets an audio URL
    this.setupAudioUrlListener(songId);
  }
  
  /**
   * Sets up a listener to clear the timeout when a song gets an audio URL
   * @param songId The ID of the song to listen for
   */
  private static setupAudioUrlListener(songId: string): void {
    const subscription = supabase
      .channel(`song-audio-url-${songId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'songs',
          filter: `id=eq.${songId}`
        },
        (payload) => {
          const updatedSong = payload.new as Song;
          
          // If the song now has an audio URL, clear the timeout
          if (updatedSong.audio_url) {
            console.log(`Song ${songId} received audio URL, clearing timeout`);
            this.clearSongGenerationTimeout(songId);
            
            // Unsubscribe from further updates
            subscription.unsubscribe();
          }
        }
      )
      .subscribe();
  }

  /**
   * Clears a song generation timeout
   * @param songId The ID of the song to clear the timeout for
   */
  private static clearSongGenerationTimeout(songId: string): void {
    const timeoutId = this.timeoutIds.get(songId);
    if (timeoutId) {
      clearTimeout(timeoutId);
      this.timeoutIds.delete(songId);
    }
  }

  static async regeneratePresetSongs(userId: string, babyName: string) {
    console.log('Starting preset song regeneration:', { userId, babyName });

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
      console.log('Preset song regeneration completed successfully');
    } catch (error) {
      console.error('Failed to regenerate preset songs:', error);
      // Don't throw - let the error be handled by the UI layer if needed
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

  // Core song operations
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
    const { data: song, error: createError } = await supabase
      .from('songs')
      .insert([{
        name,
        theme,
        mood: determinedMood,
        voice_type: isInstrumental ? null : voice,
        tempo,
        song_type: songType,
        lyrics: null,
        user_lyric_input: userInput || null,
        preset_type: presetType || null,
        is_instrumental: isInstrumental || false,
        user_id: userId,
        retryable: true, // Mark all songs as retryable by default
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
      id: song.id,
      name: song.name,
      songType,
      hasUserInput: !!userInput
    });

    // Get the user's profile to access ageGroup and gender
    const { data: profile } = await supabase
      .from('profiles')
      .select('age_group, gender')
      .eq('id', userId)
      .single();
    
    const ageGroup = profile?.age_group as AgeGroup | undefined;
    const gender = profile?.gender as string | undefined;
    
    console.log('Retrieved profile data for music generation:', {
      userId,
      hasAgeGroup: !!ageGroup,
      ageGroup,
      gender
    });

    // Start generation task
    let taskId;
    try {
      const generationParams: MusicGenerationParams = {
        theme,
        mood: determinedMood,
        userInput,
        name: babyName,
        gender,
        ageGroup,
        tempo,
        isInstrumental,
        songType,
        voice,
        preset_type: presetType || undefined
      };
      
      taskId = await createMusicGenerationTask(generationParams);

      console.log('Music generation task created:', {
        taskId,
        songId: song.id
      });
      
      // Set a timeout for this song generation
      this.setSongGenerationTimeout(song.id);
    } catch (error) {
      console.error('Failed to create music generation task:', {
        error,
        songId: song.id
      });

      throw error;
    }

    return song;
  }

  static async loadUserSongs(userId: string): Promise<Song[]> {
    if (!userId) {
      throw new Error('User ID is required');
    }

    const { data: songs, error } = await supabase
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
    return songs;
  }

  static async deleteUserSongs(userId: string): Promise<void> {
    if (!userId) {
      throw new Error('User ID is required');
    }

    const { error } = await supabase
      .from('songs')
      .delete()
      .eq('user_id', userId);

    if (error) throw error;
  }

  /**
   * Retry a failed song generation
   * @param songId The ID of the song to retry
   * @param userId The user ID
   * @param babyName The baby's name
   */
  static async retrySongGeneration(songId: string, userId: string, babyName: string): Promise<Song> {
    console.log(`Retrying song generation for song ${songId}`);
    
    try {
      // First, get the song details
      const { data: song, error: fetchError } = await supabase
        .from('songs')
        .select('*')
        .eq('id', songId)
        .eq('user_id', userId)
        .single();
      
      if (fetchError || !song) {
        console.error('Failed to fetch song for retry:', fetchError);
        throw new Error('Failed to fetch song details');
      }
      
      // Clear any existing error and task ID
      const { error: updateError } = await supabase
        .from('songs')
        .update({
          error: null,
          task_id: null,
          retryable: false
        })
        .eq('id', songId);
      
      if (updateError) {
        console.error('Failed to update song for retry:', updateError);
        throw new Error('Failed to prepare song for retry');
      }
      
      // Create a new music generation task
      const taskId = await createMusicGenerationTask({
        theme: song.theme,
        mood: song.mood,
        tempo: song.tempo,
        isInstrumental: song.is_instrumental,
        voice: song.voice_type,
        userInput: song.user_lyric_input,
        songType: song.song_type,
        preset_type: song.preset_type,
        name: babyName
      });
      
      if (!taskId) {
        throw new Error('Failed to create music generation task');
      }
      
      // Update the song with the new task ID
      const { error: taskUpdateError } = await supabase
        .from('songs')
        .update({
          task_id: taskId
        })
        .eq('id', songId);
      
      if (taskUpdateError) {
        console.error('Failed to update song with new task ID:', taskUpdateError);
      }
      
      // Set a timeout for the retry with a longer duration
      this.setSongGenerationTimeout(songId, true);
      
      return {
        ...song,
        error: null,
        task_id: taskId
      } as Song;
    } catch (error) {
      console.error('Error retrying song generation:', error);
      
      // Update the song with the error
      try {
        await supabase
          .from('songs')
          .update({
            error: 'Failed to retry song generation. Please try again later.',
            retryable: true
          })
          .eq('id', songId);
      } catch (updateError) {
        console.error('Failed to update song with retry error:', updateError);
      }
      
      throw error;
    }
  }

  /**
   * Generates preset songs for a user during the sign-up process
   * @param tempId A temporary ID to associate songs with this specific sign-up attempt
   * @param babyName The baby's name to use in song generation
   * @returns A temporary ID that can be used to link the songs to a user when sign-up completes
   */
  static async generatePresetSongsForNewUser(babyName: string): Promise<string> {
    console.log('Starting early preset song generation for new user:', { babyName });
    // Generate a temporary ID to associate with this sign-up session
    const tempId = crypto.randomUUID();
    
    try {
      // Create a temporary profile entry with onboarding flag
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([{ 
          id: tempId,
          baby_name: babyName,
          is_onboarding: true, 
          preferred_language: DEFAULT_LANGUAGE,
          preset_songs_generated: false,
          created_at: new Date().toISOString()
        }])
        .select('*')
        .single();

      if (profileError) {
        console.error('Failed to create temporary profile:', profileError);
        throw profileError;
      }
      
      // Start generating preset songs in the background
      // We don't await these promises to allow the signup process to continue
      Object.entries(PRESET_CONFIGS).forEach(([type, config]) => {
        this.createSong({
          userId: tempId,
          name: config.title(babyName),
          babyName,
          songParams: {
            mood: config.mood,
            songType: 'preset',
            preset_type: type as PresetType
          }
        }).catch(error => {
          console.error(`Failed to generate preset song ${type}:`, error);
          // Don't throw - we want to continue with sign-up even if song generation fails
        });
      });
      
      return tempId;
    } catch (error) {
      console.error('Failed to start preset song generation:', error);
      throw error;
    }
  }

  /**
   * Transfers songs from a temporary profile to a permanent user profile
   * @param tempId The temporary ID used during song generation
   * @param userId The permanent user ID to transfer songs to
   */
  static async transferSongsToUser(tempId: string, userId: string): Promise<void> {
    console.log('Transferring songs to permanent user:', { tempId, userId });
    
    try {
      // Update songs to link them to the permanent user ID
      const { error: updateError } = await supabase
        .from('songs')
        .update({ user_id: userId })
        .eq('user_id', tempId);

      if (updateError) {
        console.error('Failed to transfer songs to user:', updateError);
        throw updateError;
      }
      
      // Delete the temporary profile
      const { error: deleteError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', tempId);
        
      if (deleteError) {
        console.error('Failed to delete temporary profile:', deleteError);
        // Don't throw - this is a cleanup operation and shouldn't block the flow
      }
      
    } catch (error) {
      console.error('Error in transferSongsToUser:', error);
      throw error;
    }
  }
  
  /**
   * Cleanup function to remove abandoned sign-up data
   * This should be called periodically to clean up orphaned data
   */
  static async cleanupAbandonedSignups(): Promise<void> {
    console.log('Cleaning up abandoned sign-ups');
    
    try {
      // Get profiles that are in onboarding state and older than 1 hour
      const oneHourAgo = new Date();
      oneHourAgo.setHours(oneHourAgo.getHours() - 1);
      
      const { data: abandonedProfiles, error: queryError } = await supabase
        .from('profiles')
        .select('id')
        .eq('is_onboarding', true)
        .lt('created_at', oneHourAgo.toISOString());
        
      if (queryError) {
        console.error('Failed to query abandoned profiles:', queryError);
        throw queryError;
      }
      
      if (!abandonedProfiles || abandonedProfiles.length === 0) {
        console.log('No abandoned sign-ups found');
        return;
      }
      
      console.log(`Found ${abandonedProfiles.length} abandoned sign-ups to clean up`);
      
      // Delete songs for abandoned profiles
      for (const profile of abandonedProfiles) {
        const { error: songsDeleteError } = await supabase
          .from('songs')
          .delete()
          .eq('user_id', profile.id);
          
        if (songsDeleteError) {
          console.error(`Failed to delete songs for abandoned profile ${profile.id}:`, songsDeleteError);
          // Continue with other profiles even if one fails
        }
        
        const { error: profileDeleteError } = await supabase
          .from('profiles')
          .delete()
          .eq('id', profile.id);
          
        if (profileDeleteError) {
          console.error(`Failed to delete abandoned profile ${profile.id}:`, profileDeleteError);
          // Continue with other profiles even if one fails
        }
      }
      
      console.log('Completed cleanup of abandoned sign-ups');
    } catch (error) {
      console.error('Error in cleanupAbandonedSignups:', error);
      throw error;
    }
  }
}