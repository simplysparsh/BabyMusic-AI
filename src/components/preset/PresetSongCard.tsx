import { ComponentType, KeyboardEvent, MouseEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Play, Pause, RefreshCw, Wand2, ChevronLeft, ChevronRight, LockKeyhole } from 'lucide-react';
import type { PresetType, Song } from '../../types';
import { SongStateService, SongState } from '../../services/songStateService';
import SongGenerationTimer from '../common/SongGenerationTimer';
import { useErrorStore } from '../../store/errorStore';

/**
 * Optimistic UI Pattern Implementation
 * 
 * This component implements the "optimistic UI" pattern for better perceived performance:
 * 
 * - When a user clicks "Generate" or "Retry", we immediately show the "Generating..." state
 *   in the UI before waiting for the backend API call to complete.
 * - We use a local state (optimisticSongState) to temporarily override the actual song state
 *   from the store until the backend confirms the action (or reports failure).
 * - This approach improves the perceived responsiveness of the app as users get immediate 
 *   visual feedback when they trigger an action, even if the actual backend operation 
 *   takes a second or two to initiate.
 * - If the initial API call fails (before a task_id is assigned), we revert the optimistic 
 *   state and show the original state again.
 * - Once the backend confirms the state transition (by assigning a task_id), the component 
 *   switches from optimistic to actual state.
 * 
 * See also: docs/frontend.md for more on UI patterns in the application.
 */

// Define the specific error message for play limit
const PLAY_LIMIT_ERROR_MSG = 'Monthly play limit reached. Upgrade to Premium for unlimited listening!';

interface PresetCardProps {
  type: PresetType;
  title: string;
  description: string;
  iconComponent: ComponentType<React.SVGProps<SVGSVGElement>>;
  songs: Song[];
  isPlaying: boolean;
  currentPlayingUrl: string | null;
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
  currentPlayingUrl,
  onPlayClick,
  onGenerateClick,
  onVariationChange,
  currentVariationIndex
}: PresetCardProps) {
  // Store the previous song ID to detect when it changes
  const prevSongIdRef = useRef<string | undefined>(undefined);
  const [optimisticSongState, setOptimisticSongState] = useState<SongState | null>(null);
  
  // Get the current song for this preset type
  const currentSong = useMemo(() => 
    SongStateService.getSongForPresetType(songs, type),
    [songs, type]
  );
  
  // Check if song has changed completely (like after deletion/regeneration)
  useEffect(() => {
    const currentId = currentSong?.id;
    if (prevSongIdRef.current && currentId && prevSongIdRef.current !== currentId) {
      console.log(`[SONG REPLACED] PresetSongCard ${type}: Song ID changed from ${prevSongIdRef.current} to ${currentId}`);
      // Force update by creating random key
      const forceUpdateEvent = new CustomEvent('forceUpdate', { detail: { type, id: currentId } });
      document.dispatchEvent(forceUpdateEvent);
    }
    prevSongIdRef.current = currentId;
  }, [currentSong?.id, type]);
  
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
  
  const hasVariations = useMemo(() => 
    SongStateService.hasVariations(currentSong),
    [currentSong]
  );
  
  const variationCount = useMemo(() => 
    SongStateService.getVariationCount(currentSong),
    [currentSong]
  );
  
  // Calculate total versions including the main song
  const totalVersions = useMemo(() => 1 + variationCount, [variationCount]);
  
  const canRetry = useMemo(() => 
    SongStateService.canRetry(currentSong),
    [currentSong]
  );
  
  // Use direct state checks instead of the isGenerating prop
  const isGeneratingOrPartiallyReady = useMemo(() => 
    songState === SongState.GENERATING,
    [songState]
  );
  
  const statusLabel = useMemo(() => 
    SongStateService.getStatusLabel(currentSong, isGeneratingOrPartiallyReady),
    [currentSong, isGeneratingOrPartiallyReady]
  );
  
  // Removed unused variable
  
  // Get the audio URL of the currently selected version (main or variation)
  const urlOfCurrentVersion = useMemo(() => {
    if (!currentSong) return undefined;
    if (currentVariationIndex === 0) {
      return currentSong.audio_url;
    } else if (currentSong.variations && currentSong.variations[currentVariationIndex - 1]) {
      return currentSong.variations[currentVariationIndex - 1].audio_url;
    }
    return undefined;
  }, [currentSong, currentVariationIndex]);
  
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
    
    // Force DOM update for song state changes
    if (currentSong) {
      document.querySelectorAll(`[data-preset-type="${type}"]`).forEach(el => {
        el.setAttribute('data-song-state', songState);
      });
    }
    
    // For debugging transitions to ready
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
  
  const globalError = useErrorStore((state) => state.error);
  const isPlayLimitReached = globalError === PLAY_LIMIT_ERROR_MSG;
  
  // Effect to clear optimistic state when actual state catches up or diverges
  useEffect(() => {
    if (optimisticSongState === SongState.GENERATING) {
      if (
        songState === SongState.GENERATING ||
        songState === SongState.READY ||
        songState === SongState.FAILED
      ) {
        setOptimisticSongState(null);
      }
    }
  }, [songState, optimisticSongState]);
  
  // Handle card click
  const handleCardClick = useCallback(async () => {
    // Ignore if generating or if play limit is reached for a READY song
    const currentDisplayState = optimisticSongState || songState;

    if ((currentDisplayState === SongState.GENERATING && !currentSong?.audio_url) ||
        (songState === SongState.READY && isPlayLimitReached)) {
      console.log(`Card click ignored: ${type} preset - DisplayState: ${currentDisplayState}, ActualState: ${songState}, PlayLimitReached: ${isPlayLimitReached}`);
      return;
    }

    // Log the current state for debugging
    console.log(`Card click for ${type} preset:`, {
      optimisticSongState,
      songState,
      isReady,
      selectedVersionUrl: urlOfCurrentVersion || 'none',
      songId: currentSong?.id || 'none'
    });

    switch (songState) {
      case SongState.READY:
        // Play the currently selected version if it's ready, has a URL, and limit NOT reached
        if (urlOfCurrentVersion && !isPlayLimitReached) {
          onPlayClick(urlOfCurrentVersion, type);
        }
        break;
        
      case SongState.FAILED:
        // Handle retry if the song has failed and can be retried
        if (canRetry) {
          setOptimisticSongState(SongState.GENERATING);
          try {
            await onGenerateClick(type);
            // If onGenerateClick resolves without error, optimistic state will be cleared by useEffect
          } catch (error) {
            console.error(`[PresetSongCard] Error during onGenerateClick (retry) for type ${type}:`, error);
            // Error store should be updated by onGenerateClick's source (createSong action)
            // Revert optimistic state if the initiation itself failed
            setOptimisticSongState(null);
          }
        }
        break;
        
      default:
        // For SongState.INITIAL or any other state
        setOptimisticSongState(SongState.GENERATING);
        try {
          await onGenerateClick(type);
          // If onGenerateClick resolves without error, optimistic state will be cleared by useEffect
        } catch (error) {
          console.error(`[PresetSongCard] Error during onGenerateClick (initial generate) for type ${type}:`, error);
          // Error store should be updated by onGenerateClick's source (createSong action)
          // Revert optimistic state if the initiation itself failed
          setOptimisticSongState(null);
        }
        break;
    }
  }, [
    songState,
    optimisticSongState,
    urlOfCurrentVersion,
    type,
    onPlayClick,
    onGenerateClick,
    canRetry,
    isReady,
    currentSong?.id,
    currentSong?.audio_url,
    isPlayLimitReached
  ]);

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
    // Create a unique key for the status indicator based on song state and task_id
    const displayState = optimisticSongState || songState;
    const statusKey = `${type}-status-${displayState}-${currentSong?.task_id || currentSong?.id || 'none'}-${optimisticSongState ? 'optimistic' : 'actual'}`;
    
    // Determine if the *currently selected* version is the one playing
    const isThisVersionPlaying = isPlaying && currentPlayingUrl === urlOfCurrentVersion;

    // Show Lock icon if READY but limit reached (based on actual songState)
    if (songState === SongState.READY && isPlayLimitReached) {
      return (
        <span key={statusKey + '-limit'} className="inline-flex items-center text-xs bg-yellow-500/20 text-yellow-300
                       px-3 py-1.5 rounded-full ml-2 border border-yellow-500/20
                       shadow-lg z-10 whitespace-nowrap">
          <LockKeyhole className="w-3 h-3 mr-1" />
          Limit Reached
        </span>
      );
    }

    if (displayState === SongState.GENERATING) {
      return (
        <span key={statusKey} className="inline-flex items-center text-xs bg-primary/20 text-white
                       px-3 py-1.5 rounded-full ml-2 border border-primary/20
                       shadow-lg z-10 whitespace-nowrap">
          <SongGenerationTimer 
            isGenerating={true}
            showProgress={false}
            compact={true}
            className="!m-0 !p-0"
            songId={currentSong?.id}
          />
        </span>
      );
    }
    
    if (displayState === SongState.FAILED) {
      return (
        <span key={statusKey} className="inline-flex items-center text-xs bg-red-500/20 text-white
                       px-3 py-1.5 rounded-full ml-2 border border-red-500/20
                       shadow-lg z-10 whitespace-nowrap">
          <RefreshCw className="w-3 h-3 mr-1" />
          {statusLabel}
        </span>
      );
    }
    
    if (displayState === SongState.READY) {
      return (
        <span key={statusKey} className="inline-flex items-center text-xs bg-gradient-to-br from-black/80 to-black/90 text-green-400
                       px-3 py-1.5 rounded-full ml-2 border border-green-500/30
                       shadow-lg z-10 whitespace-nowrap">
          {isThisVersionPlaying ? (
            <Pause className="w-3 h-3 mr-1" />
          ) : (
            <Play className="w-3 h-3 mr-1" />
          )}
          {isThisVersionPlaying ? "Pause" : statusLabel}
        </span>
      );
    }
    
    return (
      <span key={statusKey} className={`inline-flex items-center text-xs bg-white/20 text-white
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

  // Determine if the card itself should be marked as disabled
  const isCardDisabled = (songState === SongState.GENERATING && !currentSong?.audio_url) || 
                         (songState === SongState.READY && isPlayLimitReached);

  return (
    <div
      onClick={handleCardClick}
      role="button"
      aria-disabled={isCardDisabled}
      data-preset-type={type}
      data-song-state={songState}
      data-optimistic-song-state={optimisticSongState || 'null'}
      data-play-limit-reached={isPlayLimitReached}
      className={`relative overflow-hidden rounded-2xl p-5 sm:p-7 text-left min-h-[100px] 
                 ${isCardDisabled ? 'cursor-not-allowed opacity-70' : 'cursor-pointer active:scale-95'}
                 transition-all duration-500 group flex items-start gap-4 backdrop-blur-sm bg-black/60
                 bg-gradient-to-br touch-manipulation
                 ${colors.gradientFrom} ${colors.gradientTo}`}
    >
      <div className={`w-14 h-14 rounded-xl ${colors.bgColor}/10 flex items-center justify-center
                    transition-all duration-700 ease-in-out`}
      >
        <Icon className={`w-6 h-6 ${colors.textColor}`} />
      </div>
      <div className="relative flex-grow">
        <div className="flex items-center justify-between gap-1.5 mb-1">
          <h3 className="text-base font-medium text-white flex items-center gap-1.5
                       group-hover:text-opacity-90">
            {title}
            <span className="text-base">{colors.emoji}</span>
          </h3>
          {renderStatusIndicator()}
        </div>
        <p className="text-xs text-white/60 transition-colors pr-10">
          {(optimisticSongState === SongState.GENERATING || songState === SongState.GENERATING) ? (
            <span className="text-primary animate-pulse inline-block">
              Creating your special song...
            </span>
          ) : description}
        </p>
        <div className="flex items-center justify-start mt-3">
          {hasVariations && (optimisticSongState !== SongState.GENERATING && songState !== SongState.GENERATING) && currentSong && (
            <div className="flex items-center gap-1 text-white/60">
              <div
                role="button"
                tabIndex={totalVersions > 1 ? 0 : -1}
                aria-label="Previous Variation"
                aria-disabled={totalVersions <= 1}
                onClick={(e: MouseEvent<HTMLDivElement>) => { e.stopPropagation(); totalVersions > 1 && onVariationChange(e, type, 'prev'); }}
                onKeyDown={(e: KeyboardEvent<HTMLDivElement>) => { if(e.key === 'Enter') {e.stopPropagation(); totalVersions > 1 && onVariationChange(e as unknown as MouseEvent<HTMLDivElement>, type, 'prev');} }}
                className={`p-2 rounded-full transition-all ${totalVersions > 1 ? 'hover:bg-white/20 active:bg-white/30 hover:scale-110 cursor-pointer' : 'opacity-50 cursor-default'}`}
              >
                <ChevronLeft className="w-4 h-4" />
              </div>
              <span className="text-sm">
                Variation {currentVariationIndex + 1} of {totalVersions}
              </span>
              <div
                role="button"
                tabIndex={totalVersions > 1 ? 0 : -1}
                aria-label="Next Variation"
                aria-disabled={totalVersions <= 1}
                onClick={(e: MouseEvent<HTMLDivElement>) => { e.stopPropagation(); totalVersions > 1 && onVariationChange(e, type, 'next'); }}
                onKeyDown={(e: KeyboardEvent<HTMLDivElement>) => { if(e.key === 'Enter') {e.stopPropagation(); totalVersions > 1 && onVariationChange(e as unknown as MouseEvent<HTMLDivElement>, type, 'next'); }}}
                className={`p-2 rounded-full transition-all ${totalVersions > 1 ? 'hover:bg-white/20 active:bg-white/30 hover:scale-110 cursor-pointer' : 'opacity-50 cursor-default'}`}
              >
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="absolute bottom-0 right-0 w-24 h-24 
                    bg-gradient-radial from-white/5 to-transparent 
                    rounded-full -mr-12 -mb-12 
                    group-hover:scale-150 transition-transform duration-700"></div>
    </div>
  );
}