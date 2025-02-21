import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuthStore } from '../store/authStore';
import { useSongStore } from '../store/songStore';
import { useAudioStore } from '../store/audioStore';
import type { PresetType, Song } from '../types';
import { PRESET_CONFIGS } from '../data/lyrics';

export function usePresetSongs() {
  const { user, profile } = useAuthStore();
  const { songs, createSong, presetSongTypes, generatingSongs } = useSongStore();
  const { isPlaying, currentUrl, handlePlay } = useAudioStore();

  // Get preset songs from the list
  const presetSongs = songs.filter(song => {
    const name = song.name.toLowerCase();
    return (
      name.includes('playtime') ||
      name.includes('mealtime') ||
      name.includes('bedtime') ||
      name.includes('potty')
    );
  });

  // Generate song names based on baby name
  const songNames = profile?.babyName
    ? Object.fromEntries(
        Object.entries(PRESET_CONFIGS).map(([type, config]) => [
          type,
          config.title(profile.babyName)
        ])
      )
    : {};

  const handlePresetClick = useCallback(async (type: PresetType) => {
    if (!user?.id || !profile?.babyName) return;

    const songName = songNames[type];
    const config = PRESET_CONFIGS[type];

    if (!songName) {
      return;
    }

    const existingSong = songs.find(s => s.name === songName);
    const isGenerating = presetSongTypes.has(type) || 
                        (existingSong && !existingSong.audio_url && 
                         ['staged', 'pending', 'processing'].includes(existingSong.status));

    // If song exists and has audio, just play it
    if (existingSong?.audio_url) {
      handlePlay(existingSong.audio_url);
      return;
    }

    // If song is generating, don't start another generation
    if (isGenerating) {
      return;
    }

    // Only generate if we don't have a valid song
    if (!existingSong || !existingSong.audio_url) {
      try {
        await createSong({
          name: songName,
          mood: config.mood,
          lyrics: config.lyrics(profile.babyName)
        });
      } catch (error) {
        throw error;
      }
    }

  }, [user?.id, profile?.babyName, songNames, songs, handlePlay, presetSongTypes, generatingSongs, createSong]);

  return {
    isPlaying,
    currentSong: currentUrl,
    presetSongs,
    songNames,
    presetSongTypes,
    generatingSongs,
    handlePresetClick
  };
}