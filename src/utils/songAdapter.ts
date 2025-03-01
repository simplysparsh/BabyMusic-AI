import { useCallback } from 'react';
import type { Song, SongVariation } from '../types';

/**
 * SongAdapter provides utilities to handle property naming inconsistencies
 * between the database and the application. It serves as a mapping layer
 * to ensure consistent property access regardless of naming changes.
 */
export function useSongAdapter() {
  /**
   * Gets the audio URL from a song, handling different property naming conventions
   * @param song The song object
   * @returns The audio URL, if available
   */
  const getAudioUrl = useCallback((song?: Song | null): string | undefined => {
    if (!song) return undefined;
    
    // Primary property from database
    return song.audio_url;
  }, []);

  /**
   * Checks if a song has audio available to play
   * @param song The song object
   * @returns Boolean indicating if audio is ready
   */
  const isAudioReady = useCallback((song?: Song | null): boolean => {
    if (!song) return false;
    return !!getAudioUrl(song);
  }, [getAudioUrl]);

  /**
   * Gets the audio URL from a song variation
   * @param variation The song variation object
   * @returns The audio URL, if available
   */
  const getVariationAudioUrl = useCallback((variation?: SongVariation | null): string | undefined => {
    if (!variation) return undefined;
    return variation.audio_url;
  }, []);

  /**
   * Maps a song object to ensure consistent property naming
   * @param song The song object which might have inconsistent property names
   * @returns A normalized song object
   */
  const normalizeSong = useCallback((song: any): Song => {
    if (!song) return song;
    
    // Create a normalized song object with consistent property names
    return {
      ...song,
      // Ensure audio_url is set correctly
      audio_url: song.audio_url || song.audioUrl,
    };
  }, []);

  return {
    getAudioUrl,
    isAudioReady,
    getVariationAudioUrl,
    normalizeSong
  };
}

// Non-hook versions for use outside of React components
export const songAdapter = {
  getAudioUrl: (song?: Song | null): string | undefined => {
    if (!song) return undefined;
    return song.audio_url;
  },
  
  isAudioReady: (song?: Song | null): boolean => {
    if (!song) return false;
    return !!song.audio_url;
  },
  
  getVariationAudioUrl: (variation?: SongVariation | null): string | undefined => {
    if (!variation) return undefined;
    return variation.audio_url;
  },
  
  normalizeSong: (song: any): Song => {
    if (!song) return song;
    return {
      ...song,
      audio_url: song.audio_url || song.audioUrl,
    };
  }
};