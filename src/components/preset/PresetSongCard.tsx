import { ComponentType, KeyboardEvent, MouseEvent, useCallback, useEffect, useMemo } from 'react';
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
  currentVariationIndex
}: PresetCardProps) {
  // Get the current song for this preset type
  const currentSong = useMemo(() => 
    SongStateService.getSongForPresetType(songs, type),
    [songs, type]
  );
  
  // Compute all state properties using useMemo for reactivity
  const songState = useMemo(() => {
    const state = SongStateService.getSongState(currentSong);
    const timestamp = new Date().toISOString();
    const sequenceId = Math.random().toString(36).substring(2, 8);
    
    console.log(`[UI STATE] PresetSongCard ${type}: Computing song state at ${timestamp} [${sequenceId}]:`, { 
      state, 
      hasTaskId: currentSong?.task_id ? true : false, 
      taskId: currentSong?.task_id || 'none',
      hasAudio: currentSong?.audio_url ? true : false,
      songId: currentSong?.id || 'none',
      audioUrl: currentSong?.audio_url?.substring(0, 30) + '...' || 'none'
    });
    return state;
  }, [currentSong, type]);
  
  const isReady = useMemo(() => 
    songState === SongState.READY,
    [songState]
  );
  
  const isPartiallyReady = useMemo(() => 
    songState === SongState.PARTIALLY_READY,
    [songState]
  );
  
  const hasVariations = useMemo(() => 
    SongStateService.hasVariations(currentSong),
    [currentSong]
  );
  
  const variationCount = useMemo(() => 
    SongStateService.getVariationCount(currentSong),
    [currentSong]
  );
  
  const canRetry = useMemo(() => 
    SongStateService.canRetry(currentSong),
    [currentSong]
  );
  
  // Use direct state checks instead of the isGenerating prop
  const isGeneratingOrPartiallyReady = useMemo(() => 
    songState === SongState.GENERATING || songState === SongState.PARTIALLY_READY,
    [songState]
  );
  
  const statusLabel = useMemo(() => 
    SongStateService.getStatusLabel(currentSong, isGeneratingOrPartiallyReady),
    [currentSong, isGeneratingOrPartiallyReady]
  );
  
  // Get the audio URL
  const audioUrl = useMemo(() => 
    currentSong ? currentSong.audio_url : undefined,
    [currentSong]
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
  
  // Force the component to update when song state changes
  useEffect(() => {
    const timestamp = new Date().toISOString();
    const sequenceId = Math.random().toString(36).substring(2, 8);
    
    console.log(`[UI UPDATE] PresetSongCard ${type}: Song state changed to ${songState} at ${timestamp} [${sequenceId}]`);
    
    // For debugging transitions from generating to partially ready
    if (songState === SongState.PARTIALLY_READY) {
      console.log(`[PARTIAL READY] PresetSongCard ${type}: Song is now PARTIALLY_READY:`, {
        songId: currentSong?.id,
        hasAudio: currentSong?.audio_url ? true : false,
        hasTaskId: currentSong?.task_id ? true : false,
        timestamp,
        sequenceId
      });
    }
    
    // For debugging transitions from partially ready to ready
    if (songState === SongState.READY) {
      console.log(`[READY] PresetSongCard ${type}: Song is now READY:`, {
        songId: currentSong?.id,
        hasAudio: currentSong?.audio_url ? true : false,
        hasTaskId: currentSong?.task_id ? true : false,
        timestamp,
        sequenceId
      });
    }
  }, [songState, type, currentSong]);
  
  // Special effect to detect changes to the currentSong
  useEffect(() => {
    if (currentSong) {
      console.log(`[SONG UPDATED] PresetSongCard ${type}: Song object updated:`, {
        id: currentSong.id,
        hasTaskId: currentSong.task_id ? true : false,
        taskId: currentSong.task_id || 'none',
        hasAudio: currentSong.audio_url ? true : false,
        timestamp: new Date().toISOString()
      });
    }
  }, [currentSong, type]);
  
  // Handle card click
  const handleCardClick = useCallback(() => {
    // If already generating without audio, do nothing
    if (songState === SongState.GENERATING && !currentSong?.audio_url) {
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
  }, [songState, audioUrl, type, onPlayClick, onGenerateClick, canRetry, isReady, isPartiallyReady, currentSong?.id, currentSong?.audio_url]);

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
    if (songState === SongState.GENERATING) {
      return (
        <span className="inline-flex items-center text-xs bg-primary/20 text-white
                       px-3 py-1.5 rounded-full ml-2 border border-primary/20
                       shadow-lg z-10 whitespace-nowrap">
          <SongGenerationTimer 
            isGenerating={true}
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

  // Create a stable key for the component that changes when state changes
  const componentKey = useMemo(() => {
    // Create a key that will change when key properties change
    // Include audio_url to catch all transitions
    const hasLastUpdated = currentSong && '_lastUpdated' in currentSong;
    const lastUpdatedValue = hasLastUpdated ? (currentSong as any)._lastUpdated : '0';
    
    return `preset-${type}-${songState}-${currentSong?.id || 'no-song'}-${currentSong?.task_id ? 'has-task' : 'no-task'}-${currentSong?.audio_url ? 'has-audio' : 'no-audio'}-${lastUpdatedValue}`;
  }, [type, songState, currentSong]);

  return (
    <div
      key={componentKey}
      onClick={handleCardClick}
      role="button"
      aria-disabled={songState === SongState.GENERATING}
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
          {songState === SongState.GENERATING ? (
            <span className="text-primary animate-pulse inline-block">
              Creating your special song...
            </span>
          ) : songState === SongState.PARTIALLY_READY ? (
            <span className="text-green-400">
              Song's ready to play—just finalizing it now...
            </span>
          ) : description}
        </p>
        {hasVariations && songState !== SongState.GENERATING && currentSong && (
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