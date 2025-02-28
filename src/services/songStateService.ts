import type { Song, PresetType } from '../types';

/**
 * SongStateService handles all logic related to determining a song's state
 * for consistent UI rendering and business logic throughout the application
 */
export class SongStateService {
  /**
   * Determines if a song is currently generating
   */
  static isGenerating(
    song: Song | undefined,
    generatingSongs: Set<string>,
    processingTaskIds: Set<string>
  ): boolean {
    if (!song) return false;
    
    // Check if song ID is in generating set
    if (generatingSongs.has(song.id)) return true;
    
    // Check if task ID is in processing set
    if (song.task_id && processingTaskIds.has(song.task_id)) return true;
    
    // Check song status
    return ['staged', 'pending', 'processing'].includes(song.status || '') && !song.audioUrl;
  }

  /**
   * Determines if a song has failed generation
   */
  static hasFailed(song: Song | undefined): boolean {
    if (!song) return false;
    return !!song.error && !song.audioUrl;
  }

  /**
   * Determines if a song can be retried
   */
  static canRetry(song: Song | undefined): boolean {
    if (!song) return false;
    return !!song.error && !!song.retryable && !song.audioUrl;
  }

  /**
   * Determines if a song is ready to play
   */
  static isReady(song: Song | undefined): boolean {
    if (!song) return false;
    return !!song.audioUrl;
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
    isGenerating: boolean, 
    presetSongTypes: Set<PresetType>,
    presetType: PresetType | null
  ): string {
    if (!song) {
      return presetType && presetSongTypes.has(presetType) 
        ? 'Generating...' 
        : 'Generate';
    }
    
    if (isGenerating) return 'Generating...';
    if (song.error) return song.retryable ? 'Try Again' : 'Failed';
    if (song.audioUrl) return 'Play';
    
    return 'Generate';
  }

  /**
   * Gets UI metadata for rendering song state
   */
  static getSongStateMetadata(
    song: Song | undefined,
    generatingSongs: Set<string>,
    processingTaskIds: Set<string>,
    presetSongTypes: Set<PresetType>,
    presetType: PresetType | null
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
    const isGenerating = this.isGenerating(song, generatingSongs, processingTaskIds) || 
                         (presetType !== null && presetSongTypes.has(presetType));
    const hasFailed = this.hasFailed(song);
    const canRetry = this.canRetry(song);
    const isReady = this.isReady(song);
    const hasVariations = this.hasVariations(song);
    const variationCount = this.getVariationCount(song);
    const isPresetSong = this.isPresetSong(song);
    const statusLabel = this.getStatusLabel(song, isGenerating, presetSongTypes, presetType);

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
}