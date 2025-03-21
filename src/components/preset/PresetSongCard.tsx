import { ComponentType, KeyboardEvent, MouseEvent, useCallback, useEffect, useState, useRef } from 'react';
import { Play, Pause, RefreshCw, Wand2, ChevronLeft, ChevronRight } from 'lucide-react';
import type { PresetType, Song } from '../../types';
import { SongStateService, SongState } from '../../services/songStateService';
import SongGenerationTimer from '../common/SongGenerationTimer';

interface PresetCardProps {
  type: PresetType;
  title: string;
  description: string;
  iconComponent: ComponentType<React.SVGProps<SVGSVGElement>>;
  songs: Song[];
  isPlaying: boolean;
  onPlayClick: (audioUrl: string, type: PresetType) => void;
  onGenerateClick: (type: PresetType) => void;
  onVariationChange: (e: MouseEvent<HTMLDivElement>, type: PresetType, direction: 'next' | 'prev') => void;
  currentVariationIndex: number;
  isPresetTypeGenerating: (type: PresetType) => boolean;
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
  isPresetTypeGenerating
}: PresetCardProps) {
  // Get song state metadata using the helper method for preset types
  const {
    isGenerating: serviceIsGenerating,
    canRetry,
    isReady,
    hasVariations,
    variationCount,
    statusLabel,
    song: currentSong,
    state: songState,
    isPartiallyReady
  } = SongStateService.getPresetTypeStateMetadata(
    songs,
    type
  );
  
  // Debugging for song state changes
  useEffect(() => {
    if (currentSong?.audio_url && isReady) {
      console.log(`PresetSongCard: Song ready with audio URL for type ${type}`, {
        songId: currentSong.id,
        audioUrl: currentSong.audio_url,
        state: songState
      });
    }
  }, [currentSong?.audio_url, isReady, songState, type]);
  
  // Brute-force UI update approach with useRef
  const forceUpdateKey = useRef(0);
  const [, setForceRender] = useState({});
  
  // Force UI update on every state change
  useEffect(() => {
    // Log all state changes for debugging with simplified format
    console.log(`PresetSongCard ${type} state update:`, {
      state: songState,
      audio: !!currentSong?.audio_url,
      taskId: currentSong?.task_id || 'none',
      updateKey: forceUpdateKey.current
    });
    
    // Force a re-render by updating the key with a timeout
    // to ensure React has processed all state changes
    const forceRefresh = setTimeout(() => {
      forceUpdateKey.current += 1;
      // Trigger re-render without dependencies
      setForceRender({});
      console.log(`Forced DOM update for ${type} preset`, {
        reason: 'State change detected',
        newKey: forceUpdateKey.current,
        timestamp: new Date().toISOString()
      });
    }, 100);
    
    return () => clearTimeout(forceRefresh);
  }, [currentSong, songState, type, isPartiallyReady]);
  
  // Combine generating states - check both the service and the store state
  const isGenerating = serviceIsGenerating || isPresetTypeGenerating(type);
  
  // Get the audio URL
  const audioUrl = currentSong ? currentSong.audio_url : undefined;

  // Handle card click
  const handleCardClick = useCallback(() => {
    // If already generating without audio, do nothing
    if (isGenerating && !currentSong?.audio_url) {
      console.log(`Card click ignored: ${type} preset is generating without audio`);
      return;
    }
    
    // Log the current state for debugging
    console.log(`Card click for ${type} preset:`, {
      songState,
      isReady,
      isPartiallyReady,
      audioUrl: audioUrl || 'none',
      songId: currentSong?.id || 'none'
    });
    
    switch (songState) {
      case SongState.READY:
      case SongState.PARTIALLY_READY:
        // Play the song if it's ready or partially ready and has an audio URL
        if (audioUrl) {
          onPlayClick(audioUrl, type);
        }
        break;
        
      case SongState.FAILED:
        // Handle retry if the song has failed and can be retried
        if (canRetry) {
          onGenerateClick(type);
        }
        break;
        
      default:
        // For initial state or any other state, generate a new song
        onGenerateClick(type);
        break;
    }
  }, [songState, isGenerating, audioUrl, type, onPlayClick, onGenerateClick, canRetry, isReady, isPartiallyReady, currentSong?.id, currentSong?.audio_url]);

  // Get color scheme based on preset type
  const getColorScheme = () => {
    switch (type) {
      case 'playing':
        return {
          gradientFrom: 'from-[#FF5252]/20',
          gradientTo: 'to-[#FF8080]/5',
          bgColor: 'bg-[#FF5252]',
          textColor: 'text-[#FF5252]',
          emoji: '🎈'
        };
      case 'eating':
        return {
          gradientFrom: 'from-[#00E676]/20',
          gradientTo: 'to-[#69F0AE]/5',
          bgColor: 'bg-[#00E676]',
          textColor: 'text-[#00E676]',
          emoji: '🍼'
        };
      case 'sleeping':
        return {
          gradientFrom: 'from-[#40C4FF]/20',
          gradientTo: 'to-[#80D8FF]/5',
          bgColor: 'bg-[#40C4FF]',
          textColor: 'text-[#40C4FF]',
          emoji: '🌙'
        };
      default: // pooping
        return {
          gradientFrom: 'from-[#E040FB]/20',
          gradientTo: 'to-[#EA80FC]/5',
          bgColor: 'bg-[#E040FB]',
          textColor: 'text-[#E040FB]',
          emoji: '🚽'
        };
    }
  };

  const colors = getColorScheme();

  // Render the status indicator based on song state
  const renderStatusIndicator = () => {
    // Always use SongStateService to determine state
    const songState = SongStateService.getSongState(currentSong);
    
    if (songState === SongState.GENERATING && !isPartiallyReady) {
      return (
        <span className="inline-flex items-center text-xs bg-primary/20 text-white
                       px-3 py-1.5 rounded-full ml-2 border border-primary/20
                       shadow-lg z-10 whitespace-nowrap">
          <SongGenerationTimer 
            isGenerating={isGenerating}
            showProgress={false}
            compact={true}
            className="!m-0 !p-0"
          />
        </span>
      );
    }
    
    if (songState === SongState.PARTIALLY_READY) {
      // Subtle indicator for partially ready songs - softer green with small dot
      return (
        <span className="inline-flex items-center text-xs bg-gradient-to-br from-black/80 to-black/90 text-green-400
                       px-3 py-1.5 rounded-full ml-2 border border-green-500/30
                       shadow-lg z-10 whitespace-nowrap">
          {isPlaying ? (
            <Pause className="w-3 h-3 mr-1" />
          ) : (
            <Play className="w-3 h-3 mr-1" />
          )}
          {isPlaying ? "Pause" : "Play"}
          <span className="w-1.5 h-1.5 bg-green-400/70 rounded-full ml-1.5 animate-pulse" 
                title="Song is still being improved, but you can play it now"></span>
        </span>
      );
    }
    
    if (songState === SongState.FAILED) {
      return (
        <span className="inline-flex items-center text-xs bg-red-500/20 text-white
                       px-3 py-1.5 rounded-full ml-2 border border-red-500/20
                       shadow-lg z-10 whitespace-nowrap">
          <RefreshCw className="w-3 h-3 mr-1" />
          {statusLabel}
        </span>
      );
    }
    
    if (songState === SongState.READY) {
      return (
        <span className="inline-flex items-center text-xs bg-gradient-to-br from-black/80 to-black/90 text-green-400
                       px-3 py-1.5 rounded-full ml-2 border border-green-500/30
                       shadow-lg z-10 whitespace-nowrap">
          {isPlaying ? (
            <Pause className="w-3 h-3 mr-1" />
          ) : (
            <Play className="w-3 h-3 mr-1" />
          )}
          {isPlaying ? "Pause" : statusLabel}
        </span>
      );
    }
    
    return (
      <span className={`inline-flex items-center text-xs bg-white/20 text-white
                     px-3 py-1.5 rounded-full ml-2 border border-white/20
                     shadow-lg z-10 whitespace-nowrap active:italic
                     ${type === 'playing' ? 'active:bg-[#FF5252]/30' : ''}
                     ${type === 'eating' ? 'active:bg-[#00E676]/30' : ''}
                     ${type === 'sleeping' ? 'active:bg-[#40C4FF]/30' : ''}
                     ${type === 'pooping' ? 'active:bg-[#E040FB]/30' : ''}`}>
        <Wand2 className="w-3 h-3 mr-1" />
        {statusLabel}
      </span>
    );
  };

  return (
    <div
      key={`preset-${type}-${forceUpdateKey.current}`}
      onClick={handleCardClick}
      role="button"
      aria-disabled={isGenerating}
      className={`relative overflow-hidden rounded-2xl p-5 sm:p-7 text-left min-h-[100px] cursor-pointer
                 aria-disabled:cursor-not-allowed
                 transition-all duration-500 group flex items-start gap-4 backdrop-blur-sm bg-black/60
                 bg-gradient-to-br active:scale-[0.98] touch-manipulation
                 ${colors.gradientFrom} ${colors.gradientTo}`}
    >
      <div className={`w-14 h-14 rounded-xl ${colors.bgColor}/10 flex items-center justify-center
                    transition-all duration-700 ease-in-out`}
      >
        <Icon className={`w-6 h-6 ${colors.textColor}`} />
      </div>
      <div className="relative">
        <h3 className="text-base font-medium text-white mb-1 flex items-center gap-1.5
                     group-hover:text-opacity-90">
          {title}
          <span className="text-base">{colors.emoji}</span>
          {/* Status indicator */}
          {renderStatusIndicator()}
        </h3>
        <p className="text-xs text-white/60 transition-colors">
          {isGenerating ? (
            <span className="text-primary animate-pulse inline-block">
              Creating your special song...
            </span>
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