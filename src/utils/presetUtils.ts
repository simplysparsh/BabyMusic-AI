import { PresetType } from '../types';

export const getPresetType = (name: string): PresetType | null => {
  if (!name) return null;
  
  const normalizedName = name.toLowerCase();
  if (normalizedName.includes('playtime')) return 'playing';
  if (normalizedName.includes('mealtime')) return 'eating';
  if (normalizedName.includes('bedtime')) return 'sleeping';
  if (normalizedName.includes('potty')) return 'pooping';
  return null;
};

export const isPresetSong = (name: string): boolean => {
  return !!getPresetType(name);
};