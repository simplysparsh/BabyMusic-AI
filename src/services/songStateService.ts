import type {
  Song,
  PresetType
} from '../types';

// Define a type for the error object structure
interface SongErrorObject {
  code: number;
  raw_message?: string;
}

/**
 * SongStateService handles all logic related to determining a song's state
 * for consistent UI rendering and business logic throughout the application.
 * 
 * This service establishes a single source of truth for song state by relying
 * exclusively on song entities and their properties.
 */
export class SongStateService {
  /**
   * Determines if a song is currently generating
   */
  static isGenerating(song: Song | undefined): boolean {
    if (!song) return false;
    
    // If the song has an audio URL, it's not generating regardless of other factors
    if (song.audio_url) return false;
    
    // A song is generating if it has no audio_url and no error
    return !song.error;
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
    
    // A song has failed if it has no audio_url and has an error
    if (!song.audio_url && song.error) {
      // Handle error as object with code property
      if (typeof song.error === 'object' && song.error !== null) {
        // Type guard to check if errorObj has a code property
        if ('code' in song.error) {
          const errorObj = song.error as SongErrorObject;
          return errorObj.code !== 0;
        }
        return false;
      }
      // Handle error as string
      return !!song.error;
    }
    
    return false;
  }

  /**
   * Provides a user-friendly failure message based on the error details
   */
  static getFailureMessage(song: Song | undefined): string | undefined {
    if (!song || !song.error) return undefined;
    
    // Handle error as object with raw_message property
    if (typeof song.error === 'object' && song.error !== null) {
      // Type guard and casting for specific error properties
      if ('code' in song.error) {
        const errorObj = song.error as SongErrorObject;
        
        // Check for specific error codes and messages
        if (errorObj.code === 10000) {
          if (errorObj.raw_message && typeof errorObj.raw_message === 'string') {
            if (errorObj.raw_message.includes('failed to generate clip')) {
              return 'The song generation service encountered an issue. Please try again later.';
            }
          }
        }
        
        // Check for artist name error in raw_message
        if (errorObj.raw_message && typeof errorObj.raw_message === 'string') {
          if (errorObj.raw_message.includes('Tags contained artist name:')) {
            return 'The song failed to generate because the tags contained an artist name. Please provide an alternative spelling for the artist name.';
          }
        }
      }
    }
    // Handle error as string
    else if (typeof song.error === 'string') {
      if (song.error.includes('Tags contained artist name:')) {
        return 'The song failed to generate because the tags contained an artist name. Please provide an alternative spelling for the artist name.';
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
    return !!song.error && !!song.retryable && !song.audio_url;
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

    return {
      isGenerating,
      hasFailed,
      canRetry,
      isReady,
      hasVariations,
      variationCount,
      statusLabel,
      isPresetSong
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

    return {
      isGenerating,
      hasFailed,
      canRetry,
      isReady,
      hasVariations,
      variationCount,
      statusLabel,
      song
    };
  }

  /**
   * Determines if a song is retryable
   */
  static isRetryable(song: Song | undefined): boolean {
    if (!song) return false;
    
    // A song is retryable if it has failed and has the retryable flag set
    return this.hasFailed(song) && !!song.retryable;
  }
}