import { useState, useEffect } from 'react';
import { Play, Pause, ChevronDown, RefreshCw, Music, LockKeyhole, Download, Heart, Sparkles } from 'lucide-react';
import { SongStateService } from '../services/songStateService';
import type { Song } from '../types';
import { useSongStore } from '../store/songStore';
import { useAuthStore } from '../store/authStore';
import { useErrorStore } from '../store/errorStore';
import SongGenerationTimer from './common/SongGenerationTimer';
import { supabaseWithRetry, forceTokenRefresh } from '../lib/supabase';
import { SongService } from '../services/songService';

// Define the specific error message for play limit
const PLAY_LIMIT_ERROR_MSG = 'Monthly play limit reached. Upgrade to Premium for unlimited listening!';

interface SongItemProps {
  song: Song;
  currentSong: string | null;
  isPlaying: boolean;
  onPlayClick: (audioUrl: string, songId: string) => void;
}

export default function SongItem({
  song,
  currentSong,
  isPlaying,
  onPlayClick,
}: SongItemProps) {
  const [expandedVariations, setExpandedVariations] = useState(false);
  const [isTogglingFavorite, setIsTogglingFavorite] = useState(false);
  const { retryingSongs, setRetrying } = useSongStore();
  const { user, profile } = useAuthStore((state) => ({ 
    user: state.user, 
    profile: state.profile 
  }));
  const isPremium = profile?.isPremium ?? false;
  const globalError = useErrorStore((state) => state.error);
  const setGlobalError = useErrorStore((state) => state.setError);
  const clearGlobalError = useErrorStore((state) => state.clearError);

  // Check if the global error is the play limit error
  const isPlayLimitReached = globalError === PLAY_LIMIT_ERROR_MSG;

  // Get all the song state information from SongStateService
  const isGenerating = SongStateService.isGenerating(song);
  const hasFailed = SongStateService.hasFailed(song);
  const hasVariations = SongStateService.hasVariations(song);
  const canRetry = SongStateService.canRetry(song);
  const isPlayable = SongStateService.isPlayable(song);
  const isPreset = SongStateService.isPresetSong(song);
  
  // Determine final play button disabled state
  const playButtonDisabled = !isPlayable || isPlayLimitReached;

  // Check if the song is currently being retried
  const isRetrying = retryingSongs.has(song.id);

  // Get the audio URL
  const audioUrl = song.audio_url;

  // Effect to clear retrying state when song state changes
  useEffect(() => {
    if (isPlayable && isRetrying) {
      setRetrying(song.id, false);
    }
  }, [isPlayable, isRetrying, song.id, setRetrying]);

  // Handle toggling variations display
  const toggleExpand = () => {
    if (hasVariations) {
      setExpandedVariations(!expandedVariations);
    }
  };

  // Handle Download Click
  const handleDownload = () => {
    if (!isPremium || !isPlayable || !song.audio_url) return;
    
    // Create a temporary link to trigger download
    const link = document.createElement('a');
    link.href = song.audio_url;
    // Use song name for filename, sanitize if needed
    const filename = `${song.name || 'tuneloom-song'}.mp3`; 
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Handle retry button click
  const handleRetry = async () => {
    if (song.id && !isRetrying && user) {
      try {
        setRetrying(song.id, true);
        // Ensure user_metadata exists before accessing it
        const babyName = user?.user_metadata?.babyName || 'Baby'; 
        await SongService.retrySongGeneration(song.id, user.id, babyName); 
      } catch (error) {
        console.error('Failed to retry song:', error);
        setRetrying(song.id, false);
      }
    }
  };

  // Handle Toggle Favorite Click
  const handleToggleFavorite = async () => {
    if (!isPremium) return;
    setIsTogglingFavorite(true);
    clearGlobalError(); // Clear previous errors
    let response: { data: any; error: any; } | null = null;

    try {
      // Refresh token before toggling favorite status
      await forceTokenRefresh();
      
      response = await supabaseWithRetry.functions.invoke('toggle-favorite', {
        body: { song_id: song.id },
      });

      // Defensive checks
      if (!response) {
        throw new Error("Invocation returned null or undefined response.");
      }
      const invokeData = response.data;
      const invokeError = response.error;

      if (invokeError) {
        const message = typeof invokeError === 'object' && invokeError !== null && invokeError.message ? invokeError.message : 'Unknown invocation error';
        throw new Error(`Failed to toggle favorite: ${message}`);
      }

      // Check data structure more carefully
      if (!(typeof invokeData === 'object' && invokeData !== null && invokeData.success !== undefined)) {
        const message = typeof invokeData === 'object' && invokeData !== null && invokeData.error ? invokeData.error : 'Unexpected response structure from toggle function.';
        throw new Error(message);
      }
      // Success: UI update relies on subscription

    } catch (caughtError) {
      const errorMessage = caughtError instanceof Error ? caughtError.message : 'Could not update favorite status.';
      setGlobalError(errorMessage);
    } finally {
      setIsTogglingFavorite(false);
    }
  };

  return (
    <div className="card group mb-4 flex items-center gap-3 sm:gap-4 rounded-2xl border border-white/10 bg-neutral-800 p-3 sm:p-4 shadow-lg transition-all duration-300 hover:border-white/20">
      <div className="flex h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 shadow-inner">
        <Music className="h-5 w-5 sm:h-6 sm:w-6 text-primary/80" />
      </div>

      <div className="flex-grow overflow-hidden">
        <div className="flex items-center justify-between gap-2">
          <div className="flex-grow overflow-hidden mr-1">
            <h3 className="text-sm sm:text-base font-medium text-white break-words">
              {song.name}
            </h3>
            <p className="text-xs text-white/60 break-words">
              {`${song.mood || ''} ${song.theme ? `• ${song.theme}` : ''}`}
            </p>
          </div>
          
          <div className="flex flex-shrink-0 items-center space-x-0.5 sm:space-x-1">
            {hasVariations && (
              <button
                onClick={toggleExpand}
                className="text-white/60 transition-all duration-300 hover:text-primary p-1 sm:p-1.5 rounded-full"
                aria-label="Toggle variations"
              >
                <ChevronDown
                  className={`h-3.5 w-3.5 sm:h-5 sm:h-5 transform transition-transform ${
                    expandedVariations ? 'rotate-180' : ''
                  }`}
                />
              </button>
            )}
            {isPlayable && (
              <div className="flex items-center gap-0.5 sm:gap-1">
                <button
                  onClick={handleToggleFavorite}
                  disabled={!isPremium || isTogglingFavorite}
                  aria-label={!isPremium ? "Favorite song (Premium only)" : (song.isFavorite ? "Remove from favorites" : "Add to favorites")}
                  title={!isPremium ? "Favorite song (Premium only)" : (song.isFavorite ? "Remove from favorites" : "Add to favorites")}
                  className={`transition-all duration-300 group flex items-center justify-center p-1 sm:p-1.5 rounded-full relative 
                           ${!isPremium 
                             ? 'text-white/30 cursor-not-allowed bg-black/20' 
                             : (song.isFavorite 
                               ? 'text-red-400 bg-red-500/10 hover:bg-red-500/20' 
                               : 'text-white/60 hover:text-red-400 bg-white/10 hover:bg-white/20')} 
                           ${isTogglingFavorite ? 'opacity-50 cursor-wait' : ''}`}
                >
                  <Heart className={`w-3.5 h-3.5 sm:w-5 sm:h-5 transition-colors ${isPremium && song.isFavorite ? 'fill-current' : 'fill-none'} ${!isPremium ? 'text-white/30' : ''}`} />
                  {isTogglingFavorite && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-full">
                      <div className="w-3 h-3 border-2 border-white/50 border-t-white rounded-full animate-spin"></div>
                    </div>
                  )}
                </button>
                {!isPremium && (
                  <span title="Premium Feature">
                    <Sparkles className="w-3.5 h-3.5 text-yellow-400/80 flex-shrink-0" />
                  </span>
                )}
              </div>
            )}
            {isPlayable && (
              <div className="flex items-center gap-0.5 sm:gap-1">
                <button
                  onClick={handleDownload}
                  disabled={!isPremium}
                  aria-label={!isPremium ? "Download song (Premium only)" : "Download song"}
                  title={!isPremium ? "Download song (Premium only)" : "Download MP3"}
                  className={`transition-all duration-300 group flex items-center justify-center p-1 sm:p-1.5 rounded-full 
                           ${!isPremium 
                             ? 'text-white/30 cursor-not-allowed bg-black/20'
                             : 'text-white/60 hover:text-primary bg-white/10 hover:bg-white/20'}`}
                >
                  <Download className={`w-3.5 h-3.5 sm:w-5 sm:h-5 ${isPremium ? 'transition-transform group-hover:scale-110' : ''}`} />
                </button>
                {!isPremium && (
                  <span title="Premium Feature">
                    <Sparkles className="w-3.5 h-3.5 text-yellow-400/80 flex-shrink-0" />
                  </span>
                )}
              </div>
            )}
            <button
              onClick={() => !playButtonDisabled && audioUrl && onPlayClick(audioUrl, song.id)}
              disabled={playButtonDisabled}
              aria-label={isPlayLimitReached ? "Play limit reached" : (isPlaying && currentSong === audioUrl ? "Pause" : "Play")}
              className={`transition-all duration-300 group flex items-center justify-center p-1 sm:p-1.5 rounded-full 
                       ${isPlayLimitReached
                         ? 'bg-yellow-500/20 text-yellow-300 cursor-not-allowed'
                         : (isPlaying && currentSong === audioUrl 
                           ? 'bg-gradient-to-br from-black/80 to-black/90 text-green-400 border border-green-500/30 shadow-lg'
                           : 'bg-gradient-to-br from-black/80 to-black/90 text-green-400 border border-green-500/30 shadow-lg hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed')}`}
            >
              {isPlayLimitReached ? (
                <LockKeyhole className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
              ) : isPlaying && currentSong === audioUrl ? (
                <Pause className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
              ) : (
                <Play className="w-3.5 h-3.5 sm:w-5 sm:h-5 transition-transform group-hover:scale-110" />
              )}
            </button>
          </div>
        </div>

        {expandedVariations && hasVariations && song.variations && (
          <div className="mt-4 space-y-2 border-l-2 border-primary/20 pl-4 sm:pl-6">
            {song.variations.map((variation, index) => (
              <div key={variation.id}>
                {variation.audio_url && (
                  <div className="group/variation flex items-center justify-between rounded-lg bg-white/[0.05] px-3 py-2 transition-all duration-300 hover:bg-white/[0.08]">
                    <span className="text-sm text-white/80">
                      Variation {index + 1}
                    </span>
                    <div className="flex items-center space-x-1.5">
                      <button
                        onClick={() => variation.audio_url && onPlayClick(variation.audio_url, song.id)}
                        aria-label={isPlaying && currentSong === variation.audio_url ? "Pause variation" : "Play variation"}
                        className={`transition-all duration-300 flex items-center justify-center rounded-full p-1.5 
                                  ${isPlaying && currentSong === variation.audio_url 
                                    ? 'bg-gradient-to-br from-black/80 to-black/90 text-green-400 border border-green-500/30 shadow-sm' 
                                    : 'text-white/60 hover:text-primary bg-white/10 hover:bg-white/20'}`}
                      >
                        {isPlaying && currentSong === variation.audio_url ? (
                          <Pause className="w-4 h-4" />
                        ) : (
                          <Play className="w-4 h-4 transition-transform group-hover/variation:scale-110" />
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {(isGenerating || hasFailed) && (
          <div className="mt-3">
            <div className="h-1 overflow-hidden rounded-full bg-primary/20">
              <div className={`h-full bg-primary ${hasFailed ? 'bg-red-400' : 'animate-pulse'}`} 
                  style={{ width: isPreset ? '100%' : undefined }}></div>
            </div>
            <div className="mt-1 flex items-center justify-between">
              <div className={`text-xs ${hasFailed ? 'text-red-400' : 'text-white/60'}`}>
                {isGenerating ? (
                  isPreset ? (
                    <span className="inline-flex items-center animate-pulse">
                      <RefreshCw className="inline-block w-3 h-3 mr-1 animate-spin" />
                      Creating your song...
                    </span>
                  ) : (
                    <SongGenerationTimer 
                      isGenerating={isGenerating} 
                      compact={true}
                      className="inline-flex items-center"
                      songId={song.id}
                    />
                  )
                ) : (song.error || 'Processing...')}
              </div>
              {canRetry && (
                <button
                  onClick={handleRetry}
                  disabled={isRetrying}
                  className={`text-xs flex items-center px-2 py-1 rounded transition-all ${isRetrying ? 'opacity-50' : ''}
                           ${song.error && song.error.includes('timed out') ? 'text-white bg-primary hover:bg-primary/80' : 'text-white bg-primary/20 hover:bg-primary/30'}`}
                >
                  <RefreshCw className={`w-3 h-3 mr-1 ${isRetrying ? 'animate-spin' : ''}`} />
                  {isRetrying ? 'Retrying...' : 'Retry'}
                </button>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}