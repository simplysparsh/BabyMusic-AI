import { supabase } from '../lib/supabase';
import type { PresetType, Song } from '../types';

/**
 * Enum representing the possible states of a song
 */
export enum SongState {
  GENERATING = 'generating',
  READY = 'ready',
  FAILED = 'failed',
  INITIAL = 'initial',
  PARTIALLY_READY = 'partially_ready'
}

/**
 * SongStateService handles all logic related to determining a song's state
 * for consistent UI rendering and business logic throughout the application.
 */
export class SongStateService {
  /**
   * Gets the current state of a song
   */
  static getSongState(song: Song | undefined): SongState {
    if (!song) return SongState.INITIAL;
    
    // Song has error - it's in a failed state
    if (song.error || song.retryable) return SongState.FAILED;
    
    // Song has audio_url and task_id - it's partially ready (audio available but still finalizing)
    if (song.audio_url && song.task_id) return SongState.PARTIALLY_READY;
    
    // Song has audio_url but no task_id - it's fully ready
    if (song.audio_url) return SongState.READY;
    
    // Song has task_id but no audio_url - it's still generating
    if (song.task_id) return SongState.GENERATING;
    
    // Default state for a new song
    return SongState.INITIAL;
  }

  /**
   * Determines if a song is currently generating based on its properties.
   * This is the primary check for generation state.
   */
  static isGenerating(song: Song | undefined): boolean {
    return this.getSongState(song) === SongState.GENERATING;
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

  /**
   * Determines if a song is ready to play
   */
  static isReady(song: Song | undefined): boolean {
    return this.getSongState(song) === SongState.READY;
  }

  /**
   * Determines if a song has failed generation
   */
  static hasFailed(song: Song | undefined): boolean {
    return this.getSongState(song) === SongState.FAILED;
  }

  /**
   * Determines if a song can be retried
   */
  static canRetry(song: Song | undefined): boolean {
    return this.hasFailed(song);
  }

  /**
   * Determines if a song is a preset song
   */
  static isPresetSong(song: Song | undefined): boolean {
    if (!song) return false;
    return song.song_type === 'preset' && !!song.preset_type;
  }


  /**
   * Determines if a song is partially ready (has audio but still generating)
   */
  static isPartiallyReady(song: Song | undefined): boolean {
    return this.getSongState(song) === SongState.PARTIALLY_READY;
  }
  
  /**
   * Determines if a song can be played (either fully or partially ready)
   */
  static isPlayable(song: Song | undefined): boolean {
    const state = this.getSongState(song);
    return state === SongState.READY || state === SongState.PARTIALLY_READY;
  }

  /**
   * Gets the most appropriate song for a preset type from a collection of songs
   */
  static getSongForPresetType(songs: Song[], presetType: PresetType): Song | undefined {
    // Get all songs for this preset type
    const presetSongs = songs.filter(song => 
      song.preset_type === presetType && song.song_type === 'preset'
    );
    
    if (presetSongs.length === 0) return undefined;
    
    // Return the most recently created song for this preset type
    return presetSongs.sort((a, b) => {
      const dateA = new Date(a.createdAt || 0);
      const dateB = new Date(b.createdAt || 0);
      return dateB.getTime() - dateA.getTime();
    })[0];
  }

  /**
   * Determines if any song with a given preset type exists and is generating
   * based solely on the song's properties (primary check).
   * 
   * NOTE: Consider using isPresetTypeGeneratingFull instead, which provides
   * a more robust check by also considering the store's generatingSongs set.
   */
  static isPresetTypeGenerating(
    songs: Song[],
    presetType: PresetType
  ): boolean {
    const song = this.getSongForPresetType(songs, presetType);
    return song ? this.isGenerating(song) : false;
  }

  /**
   * Enhanced version that checks both song properties and the generating songs set.
   * Uses a primary-secondary check approach for more reliable state detection.
   * 
   * @param songs All songs
   * @param presetType The preset type to check
   * @param generatingSongsSet Set of song IDs currently being generated (from store)
   * @returns Whether a song of this preset type is generating
   */
  static isPresetTypeGeneratingFull(
    songs: Song[],
    presetType: PresetType,
    generatingSongsSet: Set<string>
  ): boolean {
    const song = this.getSongForPresetType(songs, presetType);
    
    // Primary check - Based on song properties from database
    const isPrimaryGenerating = song ? this.isGenerating(song) : false;
    
    // If primary indicates generating, we can trust that
    if (isPrimaryGenerating) return true;
    
    // Secondary check - Only consult if primary check is negative
    // This catches cases where generation has started but properties haven't updated
    const isSecondaryGenerating = song?.id ? generatingSongsSet.has(song.id) : false;
    
    return isSecondaryGenerating;
  }

  /**
   * Determines if a song has variations
   */
  static hasVariations(song: Song | undefined): boolean {
    if (!song) return false;
    return !!song.variations && song.variations.length > 0;
  }

  /**
   * Gets the number of variations a song has
   */
  static getVariationCount(song: Song | undefined): number {
    if (!song?.variations) return 0;
    return song.variations.length;
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
    
    if (song.error) return 'Retry';
    if (song.audio_url) return 'Play';
    
    return 'Generate';
  }

  /**
   * Gets the state metadata for a preset type
   * @param songs All songs
   * @param presetType The preset type to get metadata for
   * @returns State metadata including various boolean flags and the relevant song
   */
  static getPresetTypeStateMetadata(
    songs: Song[],
    presetType: PresetType
  ): {
    isGenerating: boolean;  // Note: This is only the primary check based on song properties
    hasFailed: boolean;
    canRetry: boolean;
    isReady: boolean;
    hasVariations: boolean;
    variationCount: number;
    statusLabel: string;
    song: Song | undefined;
    state: SongState;
    isPartiallyReady: boolean;
  } {
    const song = this.getSongForPresetType(songs, presetType);
    
    // Get state first
    const state = this.getSongState(song);
    
    // Compute metadata flags
    const isGenerating = this.isGenerating(song);  // Primary check based on song properties only
    const hasFailed = this.hasFailed(song);
    const canRetry = this.canRetry(song);
    const isReady = this.isReady(song);
    const isPartiallyReady = this.isPartiallyReady(song);
    const hasVariations = this.hasVariations(song);
    const variationCount = this.getVariationCount(song);
    const statusLabel = this.getStatusLabel(song, isGenerating);
    
    return {
      isGenerating,
      hasFailed,
      canRetry,
      isReady,
      hasVariations,
      variationCount,
      statusLabel,
      song,
      state,
      isPartiallyReady
    };
  }

  /**
   * Updates a song with an error message
   */
  static async updateSongWithError(songId: string, errorMessage: string): Promise<void> {
    if (!songId) return;
    
    try {
      const { error } = await supabase
        .from('songs')
        .update({ 
          error: errorMessage,
          retryable: true,
          task_id: null // Clear task_id to prevent stuck generation
        })
        .eq('id', songId);
        
      if (error) {
        console.error(`Failed to update song ${songId} with error:`, error);
      }
    } catch (err) {
      console.error(`Error updating song ${songId} with error:`, err);
    }
  }
}