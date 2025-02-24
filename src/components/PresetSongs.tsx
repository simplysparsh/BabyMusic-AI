import React, { type FC, useState, useRef, useEffect, MouseEvent, KeyboardEvent } from 'react';
import { Baby, UtensilsCrossed, Moon, Waves, Play, Pause, Wand2, Music, ChevronRight, ChevronLeft, RefreshCw } from 'lucide-react';
import { usePresetSongs } from '../hooks/usePresetSongs';
import type { PresetType, Song } from '../types';
import { useAuthStore } from '../store/authStore';
import { useAudioStore } from '../store/audioStore';

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
  const { isPlaying, currentSong, songNames, presetSongTypes, generatingSongs, handlePresetClick } = usePresetSongs();
  const [timeLeft, setTimeLeft] = useState<number>(240); // 4 minutes in seconds
  const { playAudio, stopAllAudio } = useAudioStore();
  const [currentVariation, setCurrentVariation] = useState<Record<string, number>>({});
  
  // Get preset songs from usePresetSongs hook
  const { presetSongs } = usePresetSongs();
  
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

  // Set up song names when user or profile changes
  useEffect(() => {
    if (user && profile?.babyName) {
      // Note: Removed setSongNames as it's handled by usePresetSongs hook
    }
  }, [user, profile?.babyName]);

  const handlePlay = (audioUrl: string, type: PresetType) => {
    playAudio(audioUrl);
  };

  const handleVariationChange = (e: MouseEvent<HTMLDivElement>, type: PresetType, direction: 'next' | 'prev') => {
    e.stopPropagation();
    const song = songs.find((s: Song) => s.name === songNames[type]);
    if (!song?.variations?.length) return;

    const currentIndex = currentVariation[type] || 0;
    const totalVariations = song.variations.length;
    let newIndex = direction === 'next' 
      ? (currentIndex + 1) % totalVariations
      : (currentIndex - 1 + totalVariations) % totalVariations;
    
    setCurrentVariation((prev: Record<string, number>) => ({ ...prev, [type]: newIndex }));
    handlePlay(song.variations[newIndex].audio_url, type);
  };

  // Show component only when we have a logged-in user
  if (!user) return null;

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
        {PRESETS.map(({ type, icon: Icon, title, description }) => {
          const song = songs.find((s: Song) => s.name === songNames[type]);
          const isGenerating = presetSongTypes.has(type) || 
                             (song && !song.audioUrl && ['staged', 'pending', 'processing'].includes(song.status || ''));
          
          return (
            <div
              key={type}
              onClick={() => handlePresetClick(type)}
              role="button"
              aria-disabled={isGenerating}
              className={`relative overflow-hidden rounded-2xl p-5 sm:p-7 text-left min-h-[100px] cursor-pointer
                       aria-disabled:opacity-50 aria-disabled:cursor-not-allowed
                       aria-disabled:hover:scale-100 aria-disabled:hover:shadow-none
                       aria-disabled:hover:from-current aria-disabled:hover:to-current
                       aria-disabled:hover:bg-white/5
                       transition-all duration-500 group flex items-start gap-4 backdrop-blur-sm bg-black/60
                       bg-gradient-to-br hover:scale-[1.02]
                       ${type === 'playing' ? 'from-[#FF5252]/20 to-[#FF8080]/5 hover:from-[#FF3333]/40 hover:to-[#FF6666]/30' :
                         type === 'eating' ? 'from-[#00E676]/20 to-[#69F0AE]/5 hover:from-[#00C853]/40 hover:to-[#00E676]/30' :
                         type === 'sleeping' ? 'from-[#40C4FF]/20 to-[#80D8FF]/5 hover:from-[#00B0FF]/40 hover:to-[#40C4FF]/30' :
                         'from-[#E040FB]/20 to-[#EA80FC]/5 hover:from-[#D500F9]/40 hover:to-[#E040FB]/30'}
                       hover:shadow-xl hover:shadow-${
                         type === 'playing' ? '[#FF5252]' :
                         type === 'eating' ? '[#00E676]' :
                         type === 'sleeping' ? '[#40C4FF]' :
                         '[#E040FB]'
                       }/20`}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/[0.07] to-transparent opacity-0
                          group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center
                          group-hover:scale-110 group-hover:rotate-[360deg] 
                          transition-all duration-700 ease-in-out group-hover:bg-opacity-20
                          ${type === 'playing' ? 'bg-[#FF5252]' :
                            type === 'eating' ? 'bg-[#00E676]' :
                            type === 'sleeping' ? 'bg-[#40C4FF]' :
                            'bg-[#E040FB]'}"
              >
                <Icon className={`w-6 h-6 
                             ${type === 'playing' ? 'text-[#FF5252] group-hover:text-[#FF3333]' :
                               type === 'eating' ? 'text-[#00E676] group-hover:text-[#00C853]' :
                               type === 'sleeping' ? 'text-[#40C4FF] group-hover:text-[#00B0FF]' :
                               'text-[#E040FB] group-hover:text-[#D500F9]'}`} />
              </div>
              <div className="relative">
                <h3 className="text-base font-medium text-white mb-1 flex items-center gap-1.5
                           group-hover:text-opacity-90">
                  {title}
                  <span className="text-base">
                    {type === 'playing' ? '🎈' :
                      type === 'eating' ? '🍼' :
                      type === 'sleeping' ? '🌙' :
                      '🚽'}
                  </span>
                  {/* Status indicator */}
                  {(() => {
                    if (isGenerating) {
                      return (
                        <span className="inline-flex items-center text-xs bg-primary/20 text-white
                                     px-3 py-1.5 rounded-full ml-2 border border-primary/20
                                     shadow-lg animate-pulse z-10 whitespace-nowrap">
                          <span className="w-2 h-2 bg-primary rounded-full mr-2 animate-ping"></span>
                          Generating...
                        </span>
                      );
                    }
                    
                    if (song?.error && !song.audioUrl) {
                      return (
                        <span className="inline-flex items-center text-xs bg-red-500/20 text-white
                                     px-3 py-1.5 rounded-full ml-2 border border-red-500/20
                                     shadow-lg z-10 whitespace-nowrap">
                          <RefreshCw className="w-3 h-3 mr-1" />
                          {song.retryable ? 'Try Again' : 'Failed'}
                        </span>
                      );
                    }
                    
                    if (song?.audioUrl) {
                      return (
                        <span className="inline-flex items-center text-xs bg-green-500/20 text-white
                                     px-3 py-1.5 rounded-full ml-2 border border-green-500/20
                                     shadow-lg z-10 whitespace-nowrap">
                          <Play className="w-3 h-3 mr-1" />
                          Play
                        </span>
                      );
                    }
                    
                    return (
                      <span className="inline-flex items-center text-xs bg-white/20 text-white
                                   px-3 py-1.5 rounded-full ml-2 border border-white/20
                                   shadow-lg z-10 whitespace-nowrap">
                        <Wand2 className="w-3 h-3 mr-1" />
                        Generate
                      </span>
                    );
                  })()}
                </h3>
                <p className="text-xs text-white/60 group-hover:text-white/80 transition-colors">
                  {presetSongTypes.has(type) ? (
                    <span className="text-primary animate-pulse">Creating your special song...</span>
                  ) : description}
                </p>
                {!presetSongTypes.has(type) &&
                 !songs.some((s: Song) => s.name === songNames[type] && generatingSongs.has(s.id)) &&
                 songNames[type] &&
                 (songs.find((s: Song) => s.name === songNames[type])?.variations?.length ?? 0) > 0 && (
                  <div className="flex items-center gap-1 mt-3 text-white/60">
                    <div
                      role="button"
                      tabIndex={0}
                      onClick={(e: MouseEvent<HTMLDivElement>) => handleVariationChange(e, type, 'prev')}
                      onKeyDown={(e: KeyboardEvent<HTMLDivElement>) => e.key === 'Enter' && handleVariationChange(e as unknown as MouseEvent<HTMLDivElement>, type, 'prev')}
                      className="p-1 rounded-full hover:bg-white/10 transition-colors"
                    >
                      <ChevronLeft className="w-3 h-3" />
                    </div>
                    <span className="text-xs">
                      {(currentVariation[type] || 0) + 1}/{songs.find((s: Song) => s.name === songNames[type])?.variations?.length ?? 0}
                    </span>
                    <div
                      role="button"
                      tabIndex={0}
                      onClick={(e: MouseEvent<HTMLDivElement>) => handleVariationChange(e, type, 'next')}
                      onKeyDown={(e: KeyboardEvent<HTMLDivElement>) => e.key === 'Enter' && handleVariationChange(e as unknown as MouseEvent<HTMLDivElement>, type, 'next')}
                      className="p-1 rounded-full hover:bg-white/10 transition-colors"
                    >
                      <ChevronRight className="w-3 h-3" />
                    </div>
                  </div>
                )}
              </div>
              <div className="absolute bottom-0 right-0 w-24 h-24 
                          bg-gradient-radial from-white/5 to-transparent 
                          rounded-full -mr-12 -mb-12 
                          group-hover:scale-150 transition-transform duration-700"></div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PresetSongs;