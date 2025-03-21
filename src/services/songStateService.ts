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
   * Determines if a song is currently generating
   */
  static isGenerating(song: Song | undefined): boolean {
    if (!song) return false;
    
    // If the song has an error or is retryable, it's not generating
    if (song.error || song.retryable) return false;
    
    // If the song has an audio URL, it's not generating
    if (song.audio_url) return false;
    
    // A song is generating if it has a task_id, no audio_url, and no error
    return !!song.task_id;
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
    return !!song?.audio_url;
  }

  /**
   * Determines if a song has failed generation
   */
  static hasFailed(song: Song | undefined): boolean {
    if (!song) return false;
    return !!song.error || !!song.retryable;
  }

  /**
   * Determines if a song is completed (has an audio URL)
   */
  static isCompleted(song: Song | undefined): boolean {
    return this.isReady(song);
  }

  /**
   * Determines if a song can be retried
   */
  static canRetry(song: Song | undefined): boolean {
    if (!song) return false;
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
   */
  static isPresetTypeGenerating(
    songs: Song[],
    presetType: PresetType
  ): boolean {
    const song = this.getSongForPresetType(songs, presetType);
    return song ? this.isGenerating(song) : false;
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
    isPartiallyReady: boolean;
  } {
    const song = this.getSongForPresetType(songs, presetType);
    
    // Get state first
    const state = this.getSongState(song);
    
    // Compute metadata flags
    const isGenerating = this.isGenerating(song);
    const hasFailed = this.hasFailed(song);
    const canRetry = this.canRetry(song);
    const isReady = this.isReady(song);
    const isCompleted = this.isCompleted(song);
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
      isCompleted,
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

  /**
   * Determines if a song is partially ready (has audio but still generating)
   */
  static isPartiallyReady(song: Song | undefined): boolean {
    if (!song) return false;
    
    // A song is partially ready if it has an audio_url AND still has a task_id
    return !!song.audio_url && !!song.task_id;
  }
  
  /**
   * Determines if a song can be played (either fully or partially ready)
   */
  static isPlayable(song: Song | undefined): boolean {
    if (!song) return false;
    
    // A song is playable if it has an audio_url (regardless of task_id)
    return !!song.audio_url;
  }
}