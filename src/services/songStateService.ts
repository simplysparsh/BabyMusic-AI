import type {
  Song,
  PresetType
} from '../types';
import { supabase } from '../lib/supabase';
import { TimeoutService } from './timeoutService';

// Define a type for the error object structure
interface SongErrorObject {
  code: number;
  raw_message?: string;
}

/**
 * Enum representing the possible states of a song
 */
export enum SongState {
  GENERATING = 'generating',
  READY = 'ready',
  FAILED = 'failed',
  INITIAL = 'initial'
}

/**
 * SongStateService handles all logic related to determining a song's state
 * for consistent UI rendering and business logic throughout the application.
 * 
 * This service establishes a single source of truth for song state by relying
 * exclusively on song entities and their properties.
 * 
 * The song state model is simplified to three states:
 * 1. Generating: Song has a task_id, no audio_url, and no error
 * 2. Completed: Song has an audio_url
 * 3. Failed: Song has an error
 */
export class SongStateService {
  /**
   * Gets the current state of a song
   * This is the single source of truth for song state
   */
  static getSongState(song: Song | undefined): SongState {
    if (!song) return SongState.INITIAL;
    
    if (this.isReady(song)) return SongState.READY;
    if (this.hasFailed(song)) return SongState.FAILED;
    if (this.isGenerating(song)) return SongState.GENERATING;
    
    return SongState.INITIAL;
  }

  /**
   * Determines if a song is currently generating
   * This is the single source of truth for generation state
   */
  static isGenerating(song: Song | undefined): boolean {
    if (!song) return false;
    
    // If the song has an error, it's not generating (error overrides everything)
    if (song.error) {
      return false;
    }
    
    // If the song has an audio URL, it's not generating
    if (song.audio_url) {
      return false;
    }
    
    // If the song is marked as retryable, it's not generating (even if error is null)
    // This handles the inconsistent state where retryable is true but error is null
    if (song.retryable) {
      // Log this inconsistent state for debugging
      console.warn(`Song ${song.id} has retryable: true but error: null - treating as failed`);
      
      // Try to fix this inconsistent state
      this.updateSongWithError(song.id, "Generation failed. Please try again.");
      return false;
    }
    
    // Check if the song has been stuck for too long (more than the timeout duration)
    // This is a fallback check in case the timeout didn't fire for some reason
    if (TimeoutService.hasSongTimedOut(song)) {
      // Song has been stuck for too long, mark as not generating
      console.log(`Song ${song.id} has been stuck for too long, marking as failed`);
      this.updateSongWithError(song.id, "Generation took too long. Please try again.");
      return false;
    }
    
    // A song is generating if it has a task_id, no audio_url, and no error
    return !!song.task_id;
  }
  
  /**
   * Update a song with an error message
   */
  static async updateSongWithError(songId: string, errorMessage: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('songs')
        .update({
          error: errorMessage,
          retryable: true,
          task_id: null // Clear task_id to indicate it's no longer in the queue
        })
        .eq('id', songId);
        
      if (error) {
        console.error('Failed to update song with error:', error);
      }
    } catch (err) {
      console.error('Error updating song with error:', err);
    }
  }

  /**
   * Find songs of a specific preset type
   */
  static findSongsByPresetType(
    songs: Song[],
    presetType: PresetType
  ): Song[] {
    return songs.filter(s => 
      s.song_type === 'preset' && 
      s.preset_type === presetType
    );
  }

  /**
   * Gets the current song for a preset type, if it exists
   * Returns the most recently created song for this preset type
   */
  static getSongForPresetType(
    songs: Song[],
    presetType: PresetType
  ): Song | undefined {
    const presetSongs = this.findSongsByPresetType(songs, presetType);
    
    if (presetSongs.length === 0) return undefined;
    
    // Sort to get the most recent song first
    return presetSongs.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )[0];
  }

  /**
   * Determines if any song with a given preset type exists and is generating
   */
  static isPresetTypeGenerating(
    songs: Song[],
    presetType: PresetType
  ): boolean {
    // Get the most recent song for this preset type
    const song = this.getSongForPresetType(songs, presetType);
    
    // Check if the most recent song is generating
    return song ? this.isGenerating(song) : false;
  }

  /**
   * Determines if a song has definitively failed generation
   */
  static hasFailed(song: Song | undefined): boolean {
    if (!song) return false;
    
    // If the song has an error, it has failed (error overrides everything)
    if (song.error) {
      // Log the error when we first detect it (this will only happen once per song)
      if (song.task_id) {
        // If the song still has a task_id, this is likely the first time we're seeing the error
        this.getFailureMessage(song, true); // Log the error with shouldLog=true
        
        // Clear the task_id to prevent repeated logging
        this.updateSongWithError(song.id, typeof song.error === 'string' ? song.error : "Generation failed. Please try again.");
      }
      return true;
    }
    
    // If the song is marked as retryable, it has failed (even if error is null)
    if (song.retryable && !song.audio_url) {
      // If there's no error message but retryable is true, this is an inconsistent state
      if (!song.error) {
        console.warn(`Song ${song.id} has retryable: true but error: null - treating as failed`);
        // Try to fix this inconsistent state
        this.updateSongWithError(song.id, "Generation failed. Please try again.");
      }
      return true;
    }
    
    return false;
  }

  /**
   * Provides a user-friendly failure message based on the error details
   */
  static getFailureMessage(song: Song | undefined, shouldLog: boolean = false): string | undefined {
    if (!song || !song.error) return undefined;
    
    // For preset songs, always show "Retry" in the UI
    if (this.isPresetSong(song)) {
      // Log the detailed error to console for debugging, but only when explicitly requested
      if (shouldLog) {
        console.error('Song generation failed:', song.error);
      }
      return 'Retry';
    }
    
    // Handle error as object with raw_message property
    if (typeof song.error === 'object' && song.error !== null) {
      // Type guard and casting for specific error properties
      if ('code' in song.error) {
        const errorObj = song.error as SongErrorObject;
        
        // Log the detailed error to console, but only when explicitly requested
        if (shouldLog) {
          console.error('Song generation failed:', errorObj);
        }
        
        // Check for artist name error in raw_message
        if (errorObj.raw_message && typeof errorObj.raw_message === 'string') {
          if (errorObj.raw_message.includes('Tags contained artist name:')) {
            return 'Song generation failed: song contained an artist name. Provide an alternative spelling for baby name via settings.';
          }
        }
      }
    }
    // Handle error as string
    else if (typeof song.error === 'string') {
      // Log the detailed error to console, but only when explicitly requested
      if (shouldLog) {
        console.error('Song generation failed:', song.error);
      }
      
      if (song.error.includes('Tags contained artist name:')) {
        return 'The song failed to generate because the tags contained an artist name. Please provide an alternative spelling for the artist name.';
      }
      
      // Handle timeout errors with a simpler message
      if (song.error.includes('timed out')) {
        return 'Generation timed out. Please retry.';
      }
    }
    
    // Default failure message
    return 'The song failed to generate. Please try again.';
  }

  /**
   * Determines if a song can be retried
   */
  static canRetry(song: Song | undefined): boolean {
    if (!song) return false;
    return this.hasFailed(song) && !!song.retryable;
  }

  /**
   * Determines if a song is ready to play
   */
  static isReady(song: Song | undefined): boolean {
    if (!song) return false;
    return !!song.audio_url;
  }

  /**
   * Determines if a song has variations
   */
  static hasVariations(song: Song | undefined): boolean {
    if (!song?.variations) return false;
    return song.variations.length > 0;
  }

  /**
   * Gets the number of variations for a song
   */
  static getVariationCount(song: Song | undefined): number {
    if (!song?.variations) return 0;
    return song.variations.length;
  }

  /**
   * Determines if a song is a preset type
   */
  static isPresetSong(song: Song | undefined): boolean {
    if (!song) return false;
    return song.song_type === 'preset' && !!song.preset_type;
  }

  /**
   * Gets an appropriate status label for display
   */
  static getStatusLabel(
    song: Song | undefined, 
    isGenerating: boolean
  ): string {
    if (!song) {
      return isGenerating ? 'Generating...' : 'Generate';
    }
    
    if (isGenerating) return 'Generating...';
    
    if (song.error) return this.getFailureMessage(song) || 'Failed';
    if (song.audio_url) return 'Play';
    
    return 'Generate';
  }

  /**
   * Gets UI metadata for rendering song state
   * This is the comprehensive method for all song state needs
   */
  static getSongStateMetadata(
    song: Song | undefined,
    _generatingSongs: Set<string>,
    _processingTaskIds: Set<string>,
    _presetTypes?: Set<PresetType>,
    _presetType?: PresetType | null
  ): {
    isGenerating: boolean;
    hasFailed: boolean;
    canRetry: boolean;
    isReady: boolean;
    hasVariations: boolean;
    variationCount: number;
    statusLabel: string;
    isPresetSong: boolean;
    isCompleted: boolean;
    state: SongState;
  } {
    // Determine state based on song properties
    const isGenerating = this.isGenerating(song);
    const hasFailed = this.hasFailed(song);
    const canRetry = this.canRetry(song);
    const isReady = this.isReady(song);
    const hasVariations = this.hasVariations(song);
    const variationCount = this.getVariationCount(song);
    const isPresetSong = this.isPresetSong(song);
    const statusLabel = this.getStatusLabel(song, isGenerating);
    const isCompleted = this.isCompleted(song);
    const state = this.getSongState(song);

    return {
      isGenerating,
      hasFailed,
      canRetry,
      isReady,
      hasVariations,
      variationCount,
      statusLabel,
      isPresetSong,
      isCompleted,
      state
    };
  }

  /**
   * Gets UI metadata for rendering preset type state from a collection
   * of songs rather than a single song entity
   */
  static getPresetTypeStateMetadata(
    songs: Song[],
    presetType: PresetType
  ): {
    isGenerating: boolean;
    hasFailed: boolean;
    canRetry: boolean;
    isReady: boolean;
    hasVariations: boolean;
    variationCount: number;
    statusLabel: string;
    song: Song | undefined;
    isCompleted: boolean;
    state: SongState;
  } {
    // Find the most relevant song for this preset type
    const song = this.getSongForPresetType(songs, presetType);
    
    // Determine if generating based on song state AND preset type match
    const isGenerating = song 
      ? song.preset_type === presetType && this.isGenerating(song)
      : false;
    
    // Other states
    const hasFailed = this.hasFailed(song);
    const canRetry = this.canRetry(song);
    const isReady = this.isReady(song);
    const hasVariations = this.hasVariations(song);
    const variationCount = this.getVariationCount(song);
    const statusLabel = this.getStatusLabel(song, isGenerating);
    const isCompleted = this.isCompleted(song);
    const state = this.getSongState(song);

    return {
      isGenerating,
      hasFailed,
      canRetry,
      isReady,
      hasVariations,
      variationCount,
      statusLabel,
      song,
      isCompleted,
      state
    };
  }

  /**
   * Determines if a song is completed
   * This is the single source of truth for completion state
   */
  static isCompleted(song: Song | undefined): boolean {
    if (!song) return false;
    
    // A song is completed if it has an audio URL
    return !!song.audio_url;
  }

  /**
   * Determines if a song is retryable
   */
  static isRetryable(song: Song | undefined): boolean {
    if (!song) return false;
    
    // A song is retryable if it has failed and has the retryable flag set
    return this.hasFailed(song) && !!song.retryable;
  }

  /**
   * Determines if a song is in the queue
   * This is used for tracking tasks in the subscription handler
   */
  static isInQueue(song: Song | undefined): boolean {
    if (!song) return false;
    
    // A song is in the queue if it has a task_id, no audio_url, and no error
    return !!song.task_id && !song.audio_url && !song.error;
  }
}