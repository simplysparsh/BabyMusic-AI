import { useState, useEffect, useCallback, MouseEvent, useMemo } from 'react';
import type { PresetType, Song } from '../types';
import { useSongStore } from '../store/songStore';
import { SongStateService, SongState } from '../services/songStateService';
import { useAudioStore } from '../store/audioStore';
import { useAuthStore } from '../store/authStore';
import { PRESET_CONFIGS } from '../data/lyrics';

export default function usePresetSongs() {
  const { user, profile } = useAuthStore();
  const { songs, createSong } = useSongStore();
  const { isPlaying: _isPlaying, playAudio } = useAudioStore();
  
  // Filter only preset songs
  const [presetSongs, setPresetSongs] = useState<Song[]>([]);
  
  // Track current variation index for each preset type
  const [variationIndices, setVariationIndices] = useState<Record<PresetType, number>>({
    playing: 0,
    sleeping: 0,
    eating: 0,
    pooping: 0
  });
  
  // Generate song names based on baby name using useMemo to avoid dependency issues
  const songNames = useMemo(() => {
    return profile?.babyName
      ? Object.fromEntries(
          Object.entries(PRESET_CONFIGS).map(([type, config]) => [
            type,
            config.title(profile.babyName!)
          ])
        )
      : {};
  }, [profile?.babyName]);

  // Update filtered songs when the songs state changes
  useEffect(() => {
    // Filter only preset songs
    const filteredPresetSongs = songs.filter(song => 
      song.song_type === 'preset' && song.preset_type !== undefined
    );
    
    setPresetSongs(filteredPresetSongs);
  }, [songs]);

  // Handle preset card click
  const handlePresetClick = useCallback((type: PresetType) => {
    // If user or profile is missing, we can't proceed
    if (!user?.id || !profile?.babyName) {
      console.error('User or profile not loaded');
      return;
    }

    const currentSong = SongStateService.getSongForPresetType(songs, type);
    const songState = currentSong ? SongStateService.getSongState(currentSong) : SongState.INITIAL;
    const isGenerating = songState === SongState.GENERATING;
    const hasFailed = songState === SongState.FAILED;
    
    // If the song is already generating, do nothing
    if (isGenerating) {
      return;
    }
    
    // If the song is ready (has audio URL), play it
    if (currentSong && currentSong.audio_url) {
      playAudio(currentSong.audio_url);
      return;
    }
    
    // Log the action being taken
    console.log(`Handling click for ${type} preset:`, {
      currentSong: currentSong ? {
        id: currentSong.id,
        name: currentSong.name,
        hasFailed,
        hasAudio: !!currentSong.audio_url
      } : 'none',
      action: hasFailed ? 'retrying' : 'generating new'
    });
    
    // Generate a new song
    createSong({
      name: songNames[type as keyof typeof songNames],
      mood: PRESET_CONFIGS[type].mood,
      songType: 'preset',
      preset_type: type,
      lyrics: PRESET_CONFIGS[type].fallbackLyrics(profile.babyName),
      gender: profile.gender,
      ageGroup: profile.ageGroup
    });
  }, [songs, createSong, playAudio, user, profile, songNames]);

  const handlePlay = useCallback((audioUrl: string) => {
    playAudio(audioUrl);
  }, [playAudio]);

  const handleVariationChange = useCallback((
    e: MouseEvent<HTMLDivElement>,
    type: PresetType,
    direction: 'next' | 'prev'
  ) => {
    e.stopPropagation(); // Prevent card click
    
    const song = SongStateService.getSongForPresetType(songs, type);
    if (!song) return; // No song found for this type

    // Calculate total number of playable versions (main song + variations)
    const variationCount = SongStateService.getVariationCount(song);
    const totalVersions = 1 + variationCount;

    // Don't allow changing if there's only the main song
    if (totalVersions <= 1) return;

    // Get current index (0 represents the main song)
    const currentIndex = variationIndices[type] || 0;
    
    // Calculate new index (0 to totalVersions - 1)
    const newIndex = direction === 'next'
      ? (currentIndex + 1) % totalVersions
      : (currentIndex - 1 + totalVersions) % totalVersions;
    
    // Update variation index state
    setVariationIndices(prev => ({
      ...prev,
      [type]: newIndex
    }));
    
    // Determine the URL to play based on the new index
    let urlToPlay: string | undefined;
    if (newIndex === 0) {
      // Index 0 is the main song
      urlToPlay = song.audio_url;
    } else if (song.variations && song.variations[newIndex - 1]) {
      // Indices 1+ correspond to variations array (index - 1)
      urlToPlay = song.variations[newIndex - 1].audio_url;
    }

    // Play the audio if a valid URL was found
    if (urlToPlay) {
      playAudio(urlToPlay);
    } else {
      console.warn(`No audio URL found for ${type} at index ${newIndex}`);
    }
  }, [songs, playAudio, variationIndices]);

  return {
    songs: presetSongs,
    handlePresetClick,
    handlePlay,
    handleVariationChange,
    currentVariationIndices: variationIndices
  };
}