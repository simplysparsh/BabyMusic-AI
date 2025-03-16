import { useState, useEffect, useCallback, MouseEvent, useMemo } from 'react';
import type { PresetType, Song } from '../types';
import { useSongStore } from '../store/songStore';
import { SongStateService } from '../services/songStateService';
import { useAudioStore } from '../store/audioStore';
import { useAuthStore } from '../store/authStore';
import { PRESET_CONFIGS } from '../data/lyrics';

// Debounce time to prevent multiple clicks
const DEBOUNCE_TIME = 1000; // milliseconds

export default function usePresetSongs() {
  const { user, profile } = useAuthStore();
  const { songs, generatingSongs, createSong } = useSongStore();
  const { isPlaying: _isPlaying, playAudio } = useAudioStore();
  
  // Filter only preset songs
  const [presetSongs, setPresetSongs] = useState<Song[]>([]);
  
  // Track local generating state to prevent multiple clicks
  const [localGeneratingTypes, setLocalGeneratingTypes] = useState<Set<PresetType>>(new Set());
  
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
    
    // Clear local generating state for any types that are no longer generating
    setLocalGeneratingTypes(prev => {
      const newSet = new Set(prev);
      for (const type of prev) {
        const isStillGenerating = Array.from(generatingSongs).some(id => {
          const song = filteredPresetSongs.find(s => s.id === id);
          return song && song.preset_type === type;
        });
        
        if (!isStillGenerating) {
          newSet.delete(type);
        }
      }
      return newSet;
    });
  }, [songs, generatingSongs]);

  // Handle preset card click with debounce
  const handlePresetClick = useCallback((type: PresetType) => {
    // If user or profile is missing, we can't proceed
    if (!user?.id || !profile?.babyName) {
      console.error('User or profile not loaded');
      return;
    }

    const currentSong = SongStateService.getSongForPresetType(songs, type);
    const isGenerating = SongStateService.isPresetTypeGenerating(songs, type);
    const hasFailed = currentSong ? SongStateService.hasFailed(currentSong) : false;
    
    // If the song is already generating or we're in local generating state, do nothing
    if (isGenerating || localGeneratingTypes.has(type)) {
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
    
    // Set local generating state to prevent multiple clicks
    setLocalGeneratingTypes(prev => new Set([...prev, type]));
    
    // Generate a new song
    createSong({
      name: songNames[type as keyof typeof songNames],
      mood: PRESET_CONFIGS[type].mood,
      songType: 'preset',
      preset_type: type,
      lyrics: PRESET_CONFIGS[type].lyrics(profile.babyName),
      gender: profile.gender
    });
    
    // Clear local generating state after a timeout
    setTimeout(() => {
      setLocalGeneratingTypes(prev => {
        const newSet = new Set(prev);
        newSet.delete(type);
        return newSet;
      });
    }, DEBOUNCE_TIME);
  }, [songs, createSong, playAudio, user, profile, songNames, localGeneratingTypes]);

  const handlePlay = useCallback((audioUrl: string) => {
    playAudio(audioUrl);
  }, [playAudio]);

  const handleVariationChange = useCallback((
    e: MouseEvent<HTMLDivElement>,
    type: PresetType,
    direction: 'next' | 'prev'
  ) => {
    e.stopPropagation(); // Prevent card click
    
    const { variationCount, song } = SongStateService.getPresetTypeStateMetadata(
      songs,
      type
    );
    
    if (!variationCount || variationCount <= 1 || !song?.variations) return;
    
    // Get current index for this type
    const currentIndex = variationIndices[type] || 0;
    
    // Calculate new index
    const newIndex = direction === 'next'
      ? (currentIndex + 1) % variationCount
      : (currentIndex - 1 + variationCount) % variationCount;
    
    // Update variation index
    setVariationIndices(prev => ({
      ...prev,
      [type]: newIndex
    }));
    
    // Play the audio if available
    if (song.variations[newIndex]?.audio_url) {
      playAudio(song.variations[newIndex].audio_url);
    }
  }, [songs, playAudio, variationIndices]);

  return {
    songs: presetSongs, // Return only preset songs
    handlePresetClick,
    handlePlay,
    handleVariationChange,
    localGeneratingTypes,
    currentVariationIndices: variationIndices
  };
}