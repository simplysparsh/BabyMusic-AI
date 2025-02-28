import { useState, useEffect, useCallback } from 'react';
import { useAuthStore } from '../store/authStore';
import { useSongStore } from '../store/songStore';
import { useAudioStore } from '../store/audioStore';
import type { PresetType, Song } from '../types';
import { PRESET_CONFIGS } from '../data/lyrics';
import { SongStateService } from '../services/songStateService';

export function usePresetSongs() {
  const { user, profile } = useAuthStore();
  const { songs, createSong, presetSongTypes, generatingSongs, processingTaskIds } = useSongStore();
  const { isPlaying, currentUrl, playAudio, stopAllAudio } = useAudioStore();
  const [currentVariation, setCurrentVariation] = useState<Record<string, number>>({});
  const [timeLeft, setTimeLeft] = useState<number>(240); // 4 minutes in seconds

  // Get preset songs from the list
  const presetSongs = songs.filter(song => {
    return song.song_type === 'preset' && song.preset_type;
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

  // Handle countdown timer
  useEffect(() => {
    let timer: number;
    if (presetSongTypes.size > 0 || generatingSongs.size > 0) {
      timer = window.setInterval(() => {
        setTimeLeft((prev: number) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    } else {
      setTimeLeft(240);
    }
    return () => {
      clearInterval(timer);
      setTimeLeft(240);
    };
  }, [presetSongTypes.size, generatingSongs.size]);

  // Clean up audio on unmount
  useEffect(() => {
    return () => {
      stopAllAudio();
    };
  }, [stopAllAudio]);

  const handlePresetClick = useCallback(async (type: PresetType) => {
    if (!user?.id || !profile?.babyName) return;

    const songName = songNames[type];
    const config = PRESET_CONFIGS[type];

    if (!songName || !config) {
      return;
    }

    // Find existing song
    const existingSong = songs.find(s => s.name === songName);
    
    // Use SongStateService to determine song state
    const isReady = SongStateService.isReady(existingSong);
    const isGenerating = SongStateService.isGenerating(existingSong, generatingSongs, processingTaskIds) || 
                         presetSongTypes.has(type);
    
    // If song exists and has audio, just play it
    if (isReady && existingSong?.audioUrl) {
      playAudio(existingSong.audioUrl);
      return;
    }

    // If song is generating, don't start another generation
    if (isGenerating) {
      return;
    }

    // Only generate if we don't have a valid song
    if (!existingSong || !isReady) {
      try {
        await createSong({
          name: songName,
          mood: config.mood,
          songType: 'preset',
          preset_type: type,
          lyrics: config.lyrics(profile.babyName)
        });
      } catch (error) {
        console.error('Failed to create preset song:', error);
      }
    }
  }, [user?.id, profile?.babyName, songNames, songs, playAudio, presetSongTypes, generatingSongs, processingTaskIds, createSong]);

  const handlePlay = useCallback((audioUrl: string, type: PresetType) => {
    playAudio(audioUrl);
  }, [playAudio]);

  const handleVariationChange = useCallback((e: React.MouseEvent<HTMLDivElement>, type: PresetType, direction: 'next' | 'prev') => {
    e.stopPropagation();
    const song = presetSongs.find((s: Song) => s.name === songNames[type]);
    
    // Use SongStateService to check if song has variations
    const variationCount = SongStateService.getVariationCount(song);
    if (variationCount === 0) return;
    
    const currentIndex = currentVariation[type] || 0;
    const newIndex = direction === 'next' 
      ? (currentIndex + 1) % variationCount
      : (currentIndex - 1 + variationCount) % variationCount;
    
    setCurrentVariation((prev: Record<string, number>) => ({ ...prev, [type]: newIndex }));
    
    if (song?.variations?.[newIndex]?.audio_url) {
      playAudio(song.variations[newIndex].audio_url);
    }
  }, [presetSongs, songNames, currentVariation, playAudio]);

  return {
    isPlaying,
    currentSong: currentUrl,
    presetSongs,
    songNames,
    presetSongTypes,
    generatingSongs,
    processingTaskIds,
    handlePresetClick,
    handlePlay,
    handleVariationChange,
    currentVariation,
    timeLeft
  };
}