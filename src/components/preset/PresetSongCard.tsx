import React, { useCallback, MouseEvent, KeyboardEvent } from 'react';
import { Play, RefreshCw, Wand2, ChevronLeft, ChevronRight } from 'lucide-react';
import type { PresetType, Song } from '../../types';
import { SongStateService } from '../../services/songStateService';
import { songAdapter } from '../../utils/songAdapter';

interface PresetCardProps {
  type: PresetType;
  title: string;
  description: string;
  iconComponent: React.ComponentType<any>;
  songs: Song[];
  isPlaying: boolean;
  onPlayClick: (audioUrl: string, type: PresetType) => void;
  onGenerateClick: (type: PresetType) => void;
  onVariationChange: (e: MouseEvent<HTMLDivElement>, type: PresetType, direction: 'next' | 'prev') => void;
  currentVariationIndex: number;
  localGeneratingTypes?: Set<PresetType>;
}

export default function PresetSongCard({
  type,
  title,
  description,
  iconComponent: Icon,
  songs,
  isPlaying,
  onPlayClick,
  onGenerateClick,
  onVariationChange,
  currentVariationIndex,
  localGeneratingTypes = new Set()
}: PresetCardProps) {
  // Get song state metadata using the comprehensive helper method for preset types
  const {
    isGenerating: serviceIsGenerating,
    hasFailed,
    isReady,
    hasVariations,
    variationCount,
    statusLabel: serviceStatusLabel,
    song: currentSong
  } = SongStateService.getPresetTypeStateMetadata(
    songs,
    type
  );
  
  // Check both the service and local state for generating status
  const isGenerating = serviceIsGenerating || localGeneratingTypes.has(type);
  
  // Determine the status label based on combined generating state
  const statusLabel = isGenerating && !serviceIsGenerating ? "Generating..." : serviceStatusLabel;

  // Get the audio URL using the adapter
  const audioUrl = currentSong ? songAdapter.getAudioUrl(currentSong) : undefined;

  // Log songs prop changes
  React.useEffect(() => {
    console.log(`PresetSongCard songs prop changed for ${type}:`, songs);
    console.log(`PresetSongCard isGenerating: serviceIsGenerating=${serviceIsGenerating}, localGenerating=${localGeneratingTypes.has(type)}, combined=${isGenerating}`);
    // Also debug any issues with audio URL
    if (currentSong) {
      console.log(`PresetSongCard currentSong for ${type}:`, {
        id: currentSong.id,
        hasAudio: !!currentSong.audio_url,
        audioUrl: currentSong.audio_url,
        error: currentSong.error,
        isReady
      });
    }
  }, [songs, type, serviceIsGenerating, localGeneratingTypes, isGenerating, currentSong, isReady]);

  // Handle card click
  const handleCardClick = useCallback(() => {
    if (isGenerating) return;
    
    if (isReady && audioUrl) {
      console.log(`Playing song for ${type}:`, { audioUrl });
      onPlayClick(audioUrl, type);
    } else {
      console.log(`Generating song for ${type}`);
      onGenerateClick(type);
    }
  }, [isGenerating, isReady, audioUrl, type, onPlayClick, onGenerateClick]);

  // Get color scheme based on preset type
  const getColorScheme = () => {
    switch (type) {
      case 'playing':
        return {
          gradientFrom: 'from-[#FF5252]/20',
          gradientTo: 'to-[#FF8080]/5',
          hoverFrom: 'hover:from-[#FF3333]/40',
          hoverTo: 'hover:to-[#FF6666]/30',
          shadowColor: 'shadow-[#FF5252]/20',
          bgColor: 'bg-[#FF5252]',
          textColor: 'text-[#FF5252]',
          hoverTextColor: 'group-hover:text-[#FF3333]',
          emoji: '🎈'
        };
      case 'eating':
        return {
          gradientFrom: 'from-[#00E676]/20',
          gradientTo: 'to-[#69F0AE]/5',
          hoverFrom: 'hover:from-[#00C853]/40',
          hoverTo: 'hover:to-[#00E676]/30',
          shadowColor: 'shadow-[#00E676]/20',
          bgColor: 'bg-[#00E676]',
          textColor: 'text-[#00E676]',
          hoverTextColor: 'group-hover:text-[#00C853]',
          emoji: '🍼'
        };
      case 'sleeping':
        return {
          gradientFrom: 'from-[#40C4FF]/20',
          gradientTo: 'to-[#80D8FF]/5',
          hoverFrom: 'hover:from-[#00B0FF]/40',
          hoverTo: 'hover:to-[#40C4FF]/30',
          shadowColor: 'shadow-[#40C4FF]/20',
          bgColor: 'bg-[#40C4FF]',
          textColor: 'text-[#40C4FF]',
          hoverTextColor: 'group-hover:text-[#00B0FF]',
          emoji: '🌙'
        };
      default: // pooping
        return {
          gradientFrom: 'from-[#E040FB]/20',
          gradientTo: 'to-[#EA80FC]/5',
          hoverFrom: 'hover:from-[#D500F9]/40',
          hoverTo: 'hover:to-[#E040FB]/30',
          shadowColor: 'shadow-[#E040FB]/20',
          bgColor: 'bg-[#E040FB]',
          textColor: 'text-[#E040FB]',
          hoverTextColor: 'group-hover:text-[#D500F9]',
          emoji: '🚽'
        };
    }
  };

  const colors = getColorScheme();

  // Additional debugging for pooping type
  React.useEffect(() => {
    if (type === 'pooping') {
      console.log(`[FlushTime Debug] Card state:`, {
        isReady,
        hasAudio: !!audioUrl,
        audioUrl,
        isGenerating,
        hasFailed,
        statusLabel
      });
    }
  }, [type, isReady, audioUrl, isGenerating, hasFailed, statusLabel]);

  return (
    <div
      onClick={handleCardClick}
      role="button"
      aria-disabled={isGenerating}
      className={`relative overflow-hidden rounded-2xl p-5 sm:p-7 text-left min-h-[100px] cursor-pointer
                 aria-disabled:opacity-50 aria-disabled:cursor-not-allowed
                 aria-disabled:hover:scale-100 aria-disabled:hover:shadow-none
                 aria-disabled:hover:from-current aria-disabled:hover:to-current
                 aria-disabled:hover:hover:bg-white/5
                 transition-all duration-500 group flex items-start gap-4 backdrop-blur-sm bg-black/60
                 bg-gradient-to-br hover:scale-[1.02]
                 ${colors.gradientFrom} ${colors.gradientTo} ${colors.hoverFrom} ${colors.hoverTo}
                 hover:shadow-xl ${colors.shadowColor}`}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-white/[0.07] to-transparent opacity-0
                    group-hover:opacity-100 transition-opacity duration-500"></div>
      <div className={`w-14 h-14 rounded-xl ${colors.bgColor}/10 flex items-center justify-center
                    group-hover:scale-110 group-hover:rotate-[360deg] 
                    transition-all duration-700 ease-in-out group-hover:bg-opacity-20`}
      >
        <Icon className={`w-6 h-6 ${colors.textColor} ${colors.hoverTextColor}`} />
      </div>
      <div className="relative">
        <h3 className="text-base font-medium text-white mb-1 flex items-center gap-1.5
                     group-hover:text-opacity-90">
          {title}
          <span className="text-base">{colors.emoji}</span>
          {/* Status indicator */}
          {(() => {
            if (isGenerating) {
              return (
                <span className="inline-flex items-center text-xs bg-primary/20 text-white
                               px-3 py-1.5 rounded-full ml-2 border border-primary/20
                               shadow-lg animate-pulse z-10 whitespace-nowrap">
                  <span className="w-2 h-2 bg-primary rounded-full mr-2 animate-ping"></span>
                  {statusLabel}
                </span>
              );
            }
            
            if (hasFailed) {
              return (
                <span className="inline-flex items-center text-xs bg-red-500/20 text-white
                               px-3 py-1.5 rounded-full ml-2 border border-red-500/20
                               shadow-lg z-10 whitespace-nowrap">
                  <RefreshCw className="w-3 h-3 mr-1" />
                  {statusLabel}
                </span>
              );
            }
            
            if (isReady) {
              return (
                <span className="inline-flex items-center text-xs bg-green-500/20 text-white
                               px-3 py-1.5 rounded-full ml-2 border border-green-500/20
                               shadow-lg z-10 whitespace-nowrap">
                  <Play className="w-3 h-3 mr-1" />
                  {statusLabel}
                </span>
              );
            }
            
            return (
              <span className="inline-flex items-center text-xs bg-white/20 text-white
                             px-3 py-1.5 rounded-full ml-2 border border-white/20
                             shadow-lg z-10 whitespace-nowrap">
                <Wand2 className="w-3 h-3 mr-1" />
                {statusLabel}
              </span>
            );
          })()}
        </h3>
        <p className="text-xs text-white/60 group-hover:text-white/80 transition-colors">
          {isGenerating ? (
            <span className="text-primary animate-pulse">Creating your special song...</span>
          ) : description}
        </p>
        {hasVariations && !isGenerating && currentSong && (
          <div className="flex items-center gap-1 mt-3 text-white/60">
            <div
              role="button"
              tabIndex={0}
              onClick={(e: MouseEvent<HTMLDivElement>) => onVariationChange(e, type, 'prev')}
              onKeyDown={(e: KeyboardEvent<HTMLDivElement>) => e.key === 'Enter' && onVariationChange(e as unknown as MouseEvent<HTMLDivElement>, type, 'prev')}
              className="p-1 rounded-full hover:bg-white/10 transition-colors"
            >
              <ChevronLeft className="w-3 h-3" />
            </div>
            <span className="text-xs">
              {currentVariationIndex + 1}/{variationCount}
            </span>
            <div
              role="button"
              tabIndex={0}
              onClick={(e: MouseEvent<HTMLDivElement>) => onVariationChange(e, type, 'next')}
              onKeyDown={(e: KeyboardEvent<HTMLDivElement>) => e.key === 'Enter' && onVariationChange(e as unknown as MouseEvent<HTMLDivElement>, type, 'next')}
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
}