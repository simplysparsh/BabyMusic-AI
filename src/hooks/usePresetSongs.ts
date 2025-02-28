import { useState, useEffect, useCallback, MouseEvent } from 'react';
import { PresetType, Song } from '../types';
import { useSongStore } from '../store/songStore';
import { SongStateService } from '../services/songStateService';
import { useAudioStore } from '../store/audioStore';
import { useAuthStore } from '../store/authStore';
import { PRESET_CONFIGS } from '../data/lyrics';

export default function usePresetSongs() {
  const { user, profile } = useAuthStore();
  const { songs, generatingSongs, createSong } = useSongStore();
  const { isPlaying, playAudio } = useAudioStore();
  
  // Track local generating states for immediate UI feedback
  const [localGeneratingTypes, setLocalGeneratingTypes] = useState<Set<PresetType>>(new Set());
  
  // Track current variation for each preset type
  const [currentVariation, setCurrentVariation] = useState<Record<string, number>>({});
  
  // Generate song names based on baby name
  const songNames = profile?.babyName
    ? Object.fromEntries(
        Object.entries(PRESET_CONFIGS).map(([type, config]) => [
          type,
          config.title(profile.babyName!)
        ])
      )
    : {};

  // Update filtered songs when the songs state changes
  useEffect(() => {
    // Clear local generating types for songs that are no longer generating
    // or have completed/failed
    setLocalGeneratingTypes(prev => {
      const newSet = new Set(prev);
      
      // For each preset type in the local generating set
      Array.from(prev).forEach(type => {
        const songForType = SongStateService.getSongForPresetType(songs, type);
        
        // If the song exists and either has an audioUrl or error, it's no longer generating
        if (songForType && (songForType.audioUrl || songForType.error)) {
          newSet.delete(type);
        }
        
        // If the song's ID is no longer in the generatingSongs set, it's no longer generating
        if (songForType && !generatingSongs.has(songForType.id)) {
          newSet.delete(type);
        }
      });
      
      return newSet;
    });
    
    // Debug logging
    console.log('usePresetSongs songs updated:', songs);
    console.log('usePresetSongs generatingSongs:', Array.from(generatingSongs));
  }, [songs, generatingSongs]);

  // Handle preset card click
  const handlePresetClick = useCallback((type: PresetType) => {
    // If user or profile is missing, we can't proceed
    if (!user?.id || !profile?.babyName) {
      console.error('User or profile not loaded');
      return;
    }

    console.log(`Preset clicked: ${type}`);
    const currentSong = SongStateService.getSongForPresetType(songs, type);
    const isGenerating = SongStateService.isPresetTypeGenerating(songs, type);
    
    console.log(`Current song for ${type}:`, currentSong);
    console.log(`Is ${type} generating:`, isGenerating);
    
    // If the song is already generating, do nothing
    if (isGenerating || localGeneratingTypes.has(type)) {
      console.log(`${type} is already generating, ignoring click`);
      return;
    }
    
    // If the song is ready (has audio URL), play it
    if (currentSong?.audioUrl) {
      console.log(`Playing ${type} song:`, currentSong.audioUrl);
      playAudio(currentSong.audioUrl);
    } else {
      // Otherwise generate a new song
      console.log(`Generating new ${type} song`);
      
      // Set local generating state immediately for UI feedback
      setLocalGeneratingTypes(prev => new Set(prev).add(type));
      
      // Create the song
      createSong({
        name: songNames[type as keyof typeof songNames],
        mood: PRESET_CONFIGS[type].mood,
        songType: 'preset',
        preset_type: type,
        lyrics: PRESET_CONFIGS[type].lyrics(profile.babyName)
      });
    }
  }, [songs, generatingSongs, createSong, playAudio, user, profile, localGeneratingTypes, songNames]);

  const handlePlay = useCallback((audioUrl: string, type: PresetType) => {
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
    
    if (!variationCount || variationCount <= 1) return;
    
    setCurrentVariation((prev: Record<string, number>) => {
      const current = prev[type] || 0;
      const newIndex = direction === 'next'
        ? (current + 1) % variationCount
        : (current - 1 + variationCount) % variationCount;
      
      return { ...prev, [type]: newIndex };
    });
    
    if (song?.variations?.[currentVariation[type] || 0]?.audio_url) {
      playAudio(song.variations[currentVariation[type] || 0].audio_url);
    }
  }, [songs, currentVariation, playAudio]);

  return {
    songs,
    handlePresetClick,
    handlePlay,
    handleVariationChange,
    currentVariation,
    localGeneratingTypes
  };
}