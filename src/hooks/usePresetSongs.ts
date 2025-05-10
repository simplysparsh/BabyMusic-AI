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
  const { playAudio } = useAudioStore();
  const [generatingIntent, setGeneratingIntent] = useState<Record<PresetType, boolean>>({} as Record<PresetType, boolean>);
  
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

  // Effect to clear generatingIntent when actual song state catches up
  useEffect(() => {
    let intentsChanged = false;
    const newIntents = { ...generatingIntent };

    (Object.keys(newIntents) as PresetType[]).forEach(type => {
      if (newIntents[type]) { // If there was an intent for this type
        const songForType = SongStateService.getSongForPresetType(songs, type); // `songs` from useSongStore
        const actualState = SongStateService.getSongState(songForType);

        if (actualState === SongState.GENERATING || actualState === SongState.READY || actualState === SongState.FAILED) {
          newIntents[type] = false;
          intentsChanged = true;
        }
      }
    });

    if (intentsChanged) {
      setGeneratingIntent(newIntents);
    }
  }, [songs, generatingIntent]);

  // Handle preset card click (this is what PresetSongCard calls onGenerateClick)
  const handlePresetClick = useCallback(async (type: PresetType) => {
    if (!user?.id || !profile?.babyName) {
      console.error('User or profile not loaded for preset click');
      return; // Or throw new Error to be caught by PresetSongCard
    }

    const currentSongForType = SongStateService.getSongForPresetType(songs, type);
    const actualState = currentSongForType ? SongStateService.getSongState(currentSongForType) : SongState.INITIAL;

    // Prevent multiple generation initiations
    if ((actualState === SongState.GENERATING && currentSongForType?.task_id) || generatingIntent[type]) {
      console.log(`Preset ${type} generation already in progress (actual: ${actualState}, intent: ${generatingIntent[type]})`);
      return;
    }

    if (actualState === SongState.READY && currentSongForType?.audio_url) {
      playAudio(currentSongForType.audio_url);
      return;
    }

    // Set intent just before the async call
    setGeneratingIntent(prev => ({ ...prev, [type]: true }));

    try {
      await createSong({
        name: songNames[type as keyof typeof songNames] || `${type} song`,
        mood: PRESET_CONFIGS[type].mood,
        songType: 'preset',
        preset_type: type,
        lyrics: PRESET_CONFIGS[type].fallbackLyrics(profile.babyName),
        gender: profile.gender,
        ageGroup: profile.ageGroup
      });
      // If createSong succeeds, the useEffect watching `songs` will eventually clear the intent.
    } catch (error) {
      console.error(`Error in usePresetSongs.handlePresetClick (createSong) for ${type}:`, error);
      setGeneratingIntent(prev => ({ ...prev, [type]: false })); // Clear intent on failure to initiate
      // Re-throw the error so PresetSongCard's catch block can also react if needed (e.g. for local optimistic state).
      // However, the primary mechanism for clearing local optimistic state should be its own useEffect watching actual songState.
      throw error;
    }
  }, [songs, createSong, playAudio, user, profile, songNames, generatingIntent, setGeneratingIntent]);

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
    currentVariationIndices: variationIndices,
    generatingIntent
  };
}