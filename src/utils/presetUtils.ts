import { PresetType } from '../types';

/**
 * Determines the preset type from a song name
 * @param name The song name to check
 * @returns The preset type if it's a preset song, null otherwise
 */
export const getPresetType = (name: string): PresetType | null => {
  if (!name) return null;
  
  const lowerName = name.toLowerCase();
  if (lowerName.includes('playtime')) return 'playing';
  if (lowerName.includes('mealtime')) return 'eating';
  if (lowerName.includes('bedtime')) return 'sleeping';
  if (lowerName.includes('potty')) return 'pooping';
  return null;
};

/**
 * Checks if a song name corresponds to a preset song
 * @param name The song name to check
 * @returns True if it's a preset song name
 */
export const isPresetSong = (name: string): boolean => {
  return getPresetType(name) !== null;
};