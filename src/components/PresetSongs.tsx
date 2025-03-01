import React, { type FC } from 'react';
import { Baby, UtensilsCrossed, Moon, Waves } from 'lucide-react';
import usePresetSongs from '../hooks/usePresetSongs';
import { useAuthStore } from '../store/authStore';
import { useAudioStore } from '../store/audioStore';
import { SongStateService } from '../services/songStateService';
import PresetSongCard from './preset/PresetSongCard';
import type { PresetType } from '../types';
import { songAdapter } from '../utils/songAdapter';

const PRESETS: {
  type: PresetType;
  icon: typeof Baby;
  title: string;
  description: string;
}[] = [
  {
    type: 'playing',
    icon: Baby,
    title: 'Playtime',
    description: 'Fun and energetic songs for active moments',
  },
  {
    type: 'eating',
    icon: UtensilsCrossed,
    title: 'Mealtime',
    description: 'Gentle melodies to make eating enjoyable',
  },
  {
    type: 'sleeping',
    icon: Moon,
    title: 'Bedtime',
    description: 'Soothing lullabies for peaceful sleep',
  },
  {
    type: 'pooping',
    icon: Waves,
    title: 'Flush Time',
    description: 'Playful tunes to make bathroom time fun',
  },
];

const PresetSongs: FC = () => {
  const { user, profile } = useAuthStore();
  const { 
    songs,
    handlePresetClick,
    handlePlay,
    handleVariationChange,
    currentVariation,
    localGeneratingTypes
  } = usePresetSongs();

  // Show component only when we have a logged-in user
  if (!user) return null;

  // Get current playing song from audio store
  const { isPlaying, currentUrl: currentPlayingUrl } = useAudioStore();

  // Debug function to inspect preset songs
  const debugPresetSongs = () => {
    console.group('Debug Preset Songs');
    PRESETS.forEach(preset => {
      const presetSongs = songs.filter(s => s.preset_type === preset.type);
      const currentSong = SongStateService.getSongForPresetType(songs, preset.type);
      console.log(`${preset.title} (${preset.type}):`, { 
        songsCount: presetSongs.length,
        currentSong: currentSong ? {
          id: currentSong.id,
          hasAudio: !!currentSong.audio_url,
          audioUrl: currentSong.audio_url,
          error: currentSong.error,
          isGenerating: SongStateService.isGenerating(currentSong),
          isReady: SongStateService.isReady(currentSong)
        } : 'No song found'
      });
    });
    console.groupEnd();
  };

  // Call debug function when songs change
  React.useEffect(() => {
    debugPresetSongs();
  }, [songs]);

  // Special debug for Flush Time song
  React.useEffect(() => {
    const flushTimeSongs = songs.filter(s => s.preset_type === 'pooping');
    console.log('[FlushTime Debug] All Flush Time songs:', flushTimeSongs.length > 0 ? 
      flushTimeSongs.map(s => ({
        id: s.id,
        audioUrl: s.audio_url,
        hasAudio: !!s.audio_url,
        status: s.status,
        error: s.error
      })) : 
      'None found');
  }, [songs]);

  return (
    <div className="w-full max-w-2xl mx-auto mb-6 sm:mb-8 relative px-4">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 
                    rounded-3xl blur-3xl"></div>
      <h2 className="text-3xl font-bold text-white mb-6 sm:mb-8 text-center relative z-10 bg-transparent">
        {profile?.babyName ? `${profile.babyName}'s Special Songs` : 'Special Songs'}
        <span className="block text-base sm:text-lg font-normal text-white/60 mt-2">
          ✨ Magical melodies for every moment ✨
        </span>
      </h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 relative">
        {PRESETS.map(({ type, icon, title, description }) => {
          const currentSong = SongStateService.getSongForPresetType(songs, type);
          const audioUrl = currentSong ? songAdapter.getAudioUrl(currentSong) : undefined;
          
          return (
            <PresetSongCard
              key={type}
              type={type}
              title={title}
              description={description}
              iconComponent={icon}
              songs={songs}
              isPlaying={isPlaying && currentPlayingUrl === audioUrl}
              onPlayClick={handlePlay}
              onGenerateClick={handlePresetClick}
              onVariationChange={handleVariationChange}
              currentVariationIndex={currentVariation[type] || 0}
              localGeneratingTypes={localGeneratingTypes}
            />
          );
        })}
      </div>
    </div>
  );
};

export default PresetSongs;