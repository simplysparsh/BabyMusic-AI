import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuthStore } from '../store/authStore';
import { useSongStore } from '../store/songStore';
import { useAudioStore } from '../store/audioStore';
import type { PresetType, Song } from '../types';

const PRESET_CONFIGS = {
  playing: {
    name: (babyName: string) => `${babyName}'s playtime song`,
    mood: 'energetic' as const,
    lyrics: (babyName: string) => `Bounce and play, ${babyName}'s having fun today!`
  },
  eating: {
    name: (babyName: string) => `${babyName}'s mealtime song`,
    mood: 'playful' as const,
    lyrics: (babyName: string) => `Yummy yummy in ${babyName}'s tummy!`
  },
  sleeping: {
    name: (babyName: string) => `${babyName}'s bedtime song`,
    mood: 'calm' as const,
    lyrics: (babyName: string) => `Sweet dreams little ${babyName}!`
  },
  pooping: {
    name: (babyName: string) => `${babyName}'s potty song`,
    mood: 'playful' as const,
    lyrics: (babyName: string) => `Push push little ${babyName}!`
  }
};

export function usePresetSongs() {
  const { user, profile } = useAuthStore();
  const { songs, presetSongTypes, generatingSongs, createSong } = useSongStore();
  const { playAudio, currentUrl, isPlaying } = useAudioStore();
  const [presetSongs, setPresetSongs] = useState<Record<PresetType, Song | null>>({
    playing: null,
    eating: null,
    sleeping: null,
    pooping: null
  });
  const [songNames, setSongNames] = useState<Record<PresetType, string>>({});

  useEffect(() => {
    if (!user || !profile?.babyName) return;

    setSongNames({
      playing: PRESET_CONFIGS.playing.name(profile.babyName),
      eating: PRESET_CONFIGS.eating.name(profile.babyName),
      sleeping: PRESET_CONFIGS.sleeping.name(profile.babyName),
      pooping: PRESET_CONFIGS.pooping.name(profile.babyName)
    });
  }, [user, profile?.babyName]);

  // Update preset songs when songs change
  useEffect(() => {
    if (!songNames) return;

    const newPresetSongs = {} as Record<PresetType, Song | null>;
    Object.entries(songNames).forEach(([type, name]) => {
      newPresetSongs[type as PresetType] = songs.find(s => s.name === name) || null;
    });
    setPresetSongs(newPresetSongs);
  }, [songs, songNames]);

  const handlePlay = useCallback((audioUrl: string) => {
    playAudio(audioUrl);
  }, [playAudio]);

  const handlePresetClick = useCallback(async (type: PresetType) => {
    if (!user?.id || !profile?.babyName) return;

    console.log('Handling preset click:', { type });

    const songName = songNames[type];
    const config = PRESET_CONFIGS[type];

    if (!songName) {
      console.log('No song name available for type:', type);
      return;
    }

    const existingSong = songs.find(s => s.name === songName);
    const isGenerating = presetSongTypes.has(type) || 
                        (existingSong && !existingSong.audio_url && 
                         ['staged', 'pending', 'processing'].includes(existingSong.status));

    console.log('Preset song state:', {
      type,
      songName,
      isGenerating,
      hasExistingSong: !!existingSong,
      hasAudio: !!existingSong?.audio_url,
      presetTypes: Array.from(presetSongTypes),
      audioUrl: existingSong?.audio_url
    });

    // If song exists and has audio, just play it
    if (existingSong?.audio_url) {
      console.log('Playing existing song:', existingSong.id);
      handlePlay(existingSong.audio_url);
      return;
    }

    // If song is generating, don't start another generation
    if (isGenerating) {
      console.log('Song is already generating, skipping');
      return;
    }

    // Only generate if we don't have a valid song
    if (!existingSong || !existingSong.audio_url) {
      console.log('Generating new song:', { type, songName });
      try {
        await createSong({
          name: songName,
          mood: config.mood,
          lyrics: config.lyrics(profile.babyName)
        });
      } catch (error) {
        console.error('Failed to handle preset click:', error);
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