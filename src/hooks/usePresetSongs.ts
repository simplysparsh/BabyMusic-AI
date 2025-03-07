import { useState, useEffect, useCallback, MouseEvent } from 'react';
import type { PresetType, Song } from '../types';
import { useSongStore } from '../store/songStore';
import { SongStateService } from '../services/songStateService';
import { useAudioStore } from '../store/audioStore';
import { useAuthStore } from '../store/authStore';
import { PRESET_CONFIGS } from '../data/lyrics';

export default function usePresetSongs() {
  const { user, profile } = useAuthStore();
  const { songs, generatingSongs, createSong } = useSongStore();
  const { isPlaying: _isPlaying, playAudio } = useAudioStore();
  
  // Filter only preset songs
  const [presetSongs, setPresetSongs] = useState<Song[]>([]);
  
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
    // Filter only preset songs
    const filteredPresetSongs = songs.filter(song => 
      song.song_type === 'preset' && song.preset_type !== undefined
    );
    
    setPresetSongs(filteredPresetSongs);
    
    // Only log preset songs updates
    if (filteredPresetSongs.length > 0) {
      // Debug logging can be re-enabled if needed
      // console.log('usePresetSongs preset songs updated:', filteredPresetSongs);
      // console.log('usePresetSongs generatingSongs:', Array.from(generatingSongs));
    }
  }, [songs, generatingSongs]);

  // Handle preset card click
  const handlePresetClick = useCallback((type: PresetType) => {
    // If user or profile is missing, we can't proceed
    if (!user?.id || !profile?.babyName) {
      console.error('User or profile not loaded');
      return;
    }

    const currentSong = SongStateService.getSongForPresetType(songs, type);
    const isGenerating = SongStateService.isPresetTypeGenerating(songs, type);
    
    // If the song is already generating, do nothing
    if (isGenerating) {
      return;
    }
    
    // If the song is ready (has audio URL), play it
    if (currentSong && currentSong.audio_url) {
      playAudio(currentSong.audio_url);
    } else {
      // Otherwise generate a new song
      createSong({
        name: songNames[type as keyof typeof songNames],
        mood: PRESET_CONFIGS[type].mood,
        songType: 'preset',
        preset_type: type,
        lyrics: PRESET_CONFIGS[type].lyrics(profile.babyName),
        gender: profile.gender
      });
    }
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
    
    const { variationCount, song } = SongStateService.getPresetTypeStateMetadata(
      songs,
      type
    );
    
    if (!variationCount || variationCount <= 1) return;
    
    // Use index 0 as default since we don't have is_primary property
    const currentVariation = 0;
    const newIndex = direction === 'next'
      ? (currentVariation + 1) % variationCount
      : (currentVariation - 1 + variationCount) % variationCount;
    
    if (song?.variations?.[newIndex]?.audio_url) {
      playAudio(song.variations[newIndex].audio_url);
    }
  }, [songs, playAudio]);

  return {
    songs: presetSongs, // Return only preset songs
    handlePresetClick,
    handlePlay,
    handleVariationChange
  };
}