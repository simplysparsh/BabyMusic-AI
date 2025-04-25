import type { PresetType, Song } from '../types';

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
 */
export class SongStateService {
  /**
   * Gets the current state of a song
   */
  static getSongState(song: Song | undefined): SongState {
    if (!song) return SongState.INITIAL;
    
    // Debug trace (minimize output to avoid console spam)
    const shouldLog = Math.random() < 0.1; // Only log ~10% of calls
    if (shouldLog) {
      console.log(`[STATE CALC] SongStateService.getSongState for song ${song.id}:`, {
        hasError: !!song.error,
        isRetryable: !!song.retryable,
        hasAudioUrl: !!song.audio_url,
        hasTaskId: !!song.task_id,
        taskId: song.task_id || 'none',
        timestamp: new Date().toISOString()
      });
    }
    
    // 1. Check for failure first
    if (song.error || song.retryable) return SongState.FAILED;

    // 2. Check if it's fully ready/complete
    if (this.isComplete(song)) return SongState.READY;

    // 3. Check if it's currently generating (has task_id but isn't complete or failed)
    if (song.task_id) return SongState.GENERATING;

    // 4. If none of the above, it's likely in an initial pre-generation state
    if (shouldLog) console.log(`[STATE DECISION] Song ${song.id} is INITIAL`);
    return SongState.INITIAL;
  }

  /**
   * Determines if a song has successfully completed generation.
   * This is the definitive check for a finished, playable song.
   */
  static isComplete(song: Song | undefined): boolean {
    if (!song) return false;
    // Complete means no task_id, an audio_url, and no error.
    return !song.task_id && !!song.audio_url && !song.error;
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
    const state = this.getSongState(song);
    
    switch (state) {
      case SongState.GENERATING:
        return 'Generating...';
      case SongState.FAILED:
        return 'Retry';
      case SongState.READY:
        return 'Play';
      case SongState.INITIAL:
      default:
        // If called externally with isGenerating=true, respect that
        return isGenerating ? 'Generating...' : 'Generate';
    }
  }

  /**
   * Determines if a song can be played.
   * With the non-streaming API, this is equivalent to checking if it's complete.
   */
  static isPlayable(song: Song | undefined): boolean {
    // TODO: If streaming is added later (e.g., with a streaming_url field),
    // update this to: return this.isComplete(song) || !!song.streaming_url;
    return this.isComplete(song);
  }
}