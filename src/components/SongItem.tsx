import { useState, useEffect } from 'react';
import { Play, Pause, ChevronDown, ChevronLeft, ChevronRight, RefreshCw, Music, LockKeyhole, Download, Heart, Sparkles } from 'lucide-react';
import { SongStateService } from '../services/songStateService';
import type { Song } from '../types';
import { useSongStore } from '../store/songStore';
import { useAuthStore } from '../store/authStore';
import { useErrorStore } from '../store/errorStore';
import { useAudioStore } from '../store/audioStore';
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
  const [currentVariationIndex, setCurrentVariationIndex] = useState(0); // 0 = main song, 1+ = variations
  const [isTogglingFavorite, setIsTogglingFavorite] = useState(false);
  const { retryingSongs, setRetrying } = useSongStore();
  const { user, profile } = useAuthStore((state) => ({ 
    user: state.user, 
    profile: state.profile 
  }));
  const { stopAllAudio } = useAudioStore();
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
  
  // Calculate total variations (main song + variations)
  const totalVariations = 1 + (song.variations?.length || 0);
  const showVariationControls = hasVariations && totalVariations > 1;
  
  // Get current variation details
  const currentVariation = currentVariationIndex === 0 
    ? { name: 'Original', audio_url: song.audio_url }
    : song.variations?.[currentVariationIndex - 1];
  
  // Determine final play button disabled state
  const playButtonDisabled = !isPlayable || isPlayLimitReached || !currentVariation?.audio_url;

  // Check if the song is currently being retried
  const isRetrying = retryingSongs.has(song.id);

  // Effect to clear retrying state when song state changes
  useEffect(() => {
    if (isPlayable && isRetrying) {
      setRetrying(song.id, false);
    }
  }, [isPlayable, isRetrying, song.id, setRetrying]);

  // Handle variation navigation
  const handleVariationChange = (direction: 'prev' | 'next') => {
    if (!showVariationControls) return;
    
    // Stop currently playing audio when switching variations
    stopAllAudio();
    
    if (direction === 'next') {
      setCurrentVariationIndex((prev) => (prev + 1) % totalVariations);
    } else {
      setCurrentVariationIndex((prev) => (prev - 1 + totalVariations) % totalVariations);
    }
  };

  // Handle Download Click
  const handleDownload = () => {
    if (!isPremium || !isPlayable || !currentVariation?.audio_url) return;
    
    // Create a temporary link to trigger download
    const link = document.createElement('a');
    link.href = currentVariation.audio_url;
    // Use song name for filename, sanitize if needed
    const filename = `${song.name || 'tuneloom-song'}_${currentVariationIndex === 0 ? 'original' : `variation${currentVariationIndex}`}.mp3`; 
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
    <div className="card group mb-4 rounded-2xl border border-white/10 bg-neutral-800 p-4 sm:p-5 shadow-lg transition-all duration-300 hover:border-white/20">
      {/* Main Content Row - Optimized for thumb reach */}
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 sm:h-14 sm:w-14 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 shadow-inner">
          <Music className="h-6 w-6 sm:h-7 sm:w-7 text-primary/80" />
        </div>

        <div className="flex-grow overflow-hidden min-w-0">
          <h3 className="text-base sm:text-lg font-medium text-white break-words mb-1">
            {song.name}
          </h3>
          
          {/* Variation Status - Prominent and clear */}
          {showVariationControls && (
            <div className="flex items-center gap-2 text-sm">
              <span className="text-primary/90 font-medium">
                Song {currentVariationIndex + 1} of {totalVariations}
              </span>
            </div>
          )}
        </div>

        {/* Primary Action - Large Play Button (Thumb Zone Optimized) */}
        <button
          onClick={() => !playButtonDisabled && currentVariation?.audio_url && onPlayClick(currentVariation.audio_url, song.id)}
          disabled={playButtonDisabled}
          aria-label={isPlayLimitReached ? "Play limit reached" : (isPlaying && currentSong === currentVariation?.audio_url ? "Pause" : "Play")}
          className={`flex-shrink-0 transition-all duration-200 flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-2xl shadow-lg
                   ${isPlayLimitReached
                     ? 'bg-yellow-500/20 text-yellow-300 cursor-not-allowed'
                     : (isPlaying && currentSong === currentVariation?.audio_url 
                       ? 'bg-gradient-to-br from-primary/80 to-secondary/80 text-white border-2 border-primary/60 scale-95 shadow-primary/20' 
                       : 'bg-gradient-to-br from-emerald-500/90 to-green-600/90 text-white border-2 border-emerald-400/50 hover:scale-105 active:scale-95 shadow-emerald-500/25 disabled:opacity-50 disabled:cursor-not-allowed')}`}
        >
          {isPlayLimitReached ? (
            <LockKeyhole className="w-6 h-6 sm:w-7 sm:h-7" />
          ) : isPlaying && currentSong === currentVariation?.audio_url ? (
            <Pause className="w-6 h-6 sm:w-7 sm:h-7" />
          ) : (
            <Play className="w-6 h-6 sm:w-7 sm:h-7 ml-0.5" />
          )}
        </button>
      </div>

      {/* Secondary Actions Row - Grouped by frequency of use */}
      {(showVariationControls || isPlayable) && (
        <div className="mt-4 flex items-center justify-between gap-3">
          {/* Variation Navigation - Left side for easy thumb access */}
          <div className="flex items-center gap-2">
            {showVariationControls ? (
              <>
                <button
                  onClick={() => handleVariationChange('prev')}
                  className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 active:bg-white/30 transition-all duration-150 text-white/70 hover:text-white touch-manipulation"
                  aria-label="Previous variation"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                
                <div className="px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/20 min-w-[80px] text-center">
                  <span className="text-sm font-medium text-primary">
                    {currentVariationIndex + 1} of {totalVariations}
                  </span>
                </div>
                
                <button
                  onClick={() => handleVariationChange('next')}
                  className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 active:bg-white/30 transition-all duration-150 text-white/70 hover:text-white touch-manipulation"
                  aria-label="Next variation"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            ) : (
              <div className="text-sm text-white/30 italic">
                Single version
              </div>
            )}
          </div>

          {/* Utility Actions - Right side, smaller but still thumb-friendly */}
          {isPlayable && (
            <div className="flex items-center gap-2">
              <button
                onClick={handleToggleFavorite}
                disabled={!isPremium || isTogglingFavorite}
                aria-label={!isPremium ? "Favorite song (Premium only)" : (song.isFavorite ? "Remove from favorites" : "Add to favorites")}
                title={!isPremium ? "Favorite song (Premium only)" : (song.isFavorite ? "Remove from favorites" : "Add to favorites")}
                className={`transition-all duration-200 flex items-center justify-center w-10 h-10 rounded-xl relative touch-manipulation
                         ${!isPremium 
                           ? 'text-white/20 cursor-not-allowed bg-black/10' 
                           : (song.isFavorite 
                             ? 'text-red-400 bg-red-500/15 hover:bg-red-500/25 border border-red-500/30' 
                             : 'text-white/50 hover:text-red-400 bg-white/10 hover:bg-white/20')} 
                         ${isTogglingFavorite ? 'opacity-50 cursor-wait' : ''}`}
              >
                <Heart className={`w-5 h-5 transition-colors ${isPremium && song.isFavorite ? 'fill-current' : 'fill-none'}`} />
                {isTogglingFavorite && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-xl">
                    <div className="w-3 h-3 border-2 border-white/50 border-t-white rounded-full animate-spin"></div>
                  </div>
                )}
              </button>

              <button
                onClick={handleDownload}
                disabled={!isPremium}
                aria-label={!isPremium ? "Download song (Premium only)" : "Download song"}
                title={!isPremium ? "Download song (Premium only)" : "Download MP3"}
                className={`transition-all duration-200 flex items-center justify-center w-10 h-10 rounded-xl touch-manipulation
                         ${!isPremium 
                           ? 'text-white/20 cursor-not-allowed bg-black/10'
                           : 'text-white/50 hover:text-primary bg-white/10 hover:bg-white/20'}`}
              >
                <Download className={`w-5 h-5 ${isPremium ? 'transition-transform hover:scale-110' : ''}`} />
              </button>

              {/* Premium indicators grouped together */}
              {!isPremium && (
                <div className="flex items-center ml-1">
                  <Sparkles className="w-4 h-4 text-yellow-400/60" />
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Status Row - Only shown when needed (Progressive Disclosure) */}
      {(isGenerating || hasFailed) && (
        <div className="mt-4 pt-4 border-t border-white/5">
          <div className="h-1.5 overflow-hidden rounded-full bg-primary/15">
            <div className={`h-full transition-all duration-300 ${hasFailed ? 'bg-red-400' : 'bg-primary animate-pulse'}`} 
                style={{ width: isPreset ? '100%' : undefined }}></div>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <div className={`text-sm ${hasFailed ? 'text-red-400' : 'text-white/70'}`}>
              {isGenerating ? (
                isPreset ? (
                  <span className="inline-flex items-center animate-pulse">
                    <RefreshCw className="inline-block w-4 h-4 mr-2 animate-spin" />
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
                className={`text-sm flex items-center px-4 py-2 rounded-xl transition-all duration-200 touch-manipulation ${isRetrying ? 'opacity-50' : ''}
                         ${song.error && song.error.includes('timed out') ? 'text-white bg-primary/90 hover:bg-primary' : 'text-white bg-primary/20 hover:bg-primary/30'}`}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isRetrying ? 'animate-spin' : ''}`} />
                {isRetrying ? 'Retrying...' : 'Retry'}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}