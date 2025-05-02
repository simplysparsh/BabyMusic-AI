import { useState, useEffect } from 'react';
import { Play, Pause, ChevronDown, RefreshCw, Music, LockKeyhole, Download, Heart } from 'lucide-react';
import { SongStateService } from '../services/songStateService';
import type { Song } from '../types';
import { useSongStore } from '../store/songStore';
import { SongService } from '../services/songService';
import { useAuthStore } from '../store/authStore';
import { useErrorStore } from '../store/errorStore';
import SongGenerationTimer from './common/SongGenerationTimer';

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
  const [isFavorited, setIsFavorited] = useState(false);
  const { retryingSongs, setRetrying } = useSongStore();
  const { user, profile } = useAuthStore((state) => ({ 
    user: state.user, 
    profile: state.profile 
  }));
  const isPremium = profile?.isPremium ?? false;
  const globalError = useErrorStore((state) => state.error);

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

  // Handle retry button click
  const handleRetry = async () => {
    if (song.id && !isRetrying && user) {
      try {
        setRetrying(song.id, true);
        const babyName = user.user_metadata?.babyName || 'Baby';
        await SongService.retrySongGeneration(song.id, user.id, babyName);
      } catch (error) {
        console.error('Failed to retry song:', error);
        setRetrying(song.id, false);
      }
    }
  };

  // Handle Download Click
  const handleDownload = () => {
    if (!isPremium || !isPlayable || !song.audio_url) return;
    
    // Create a temporary link to trigger download
    const link = document.createElement('a');
    link.href = song.audio_url;
    // Use song name for filename, sanitize if needed
    const filename = `${song.name || 'baby-music-ai-song'}.mp3`; 
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Handle Toggle Favorite Click
  const handleToggleFavorite = () => {
    if (!isPremium || !isPlayable) return;
    // TODO: Implement backend call to update favorite status
    // e.g., toggleFavoriteSong(song.id, !isFavorited);
    setIsFavorited(!isFavorited);
    console.log(`Toggled favorite for song ${song.id} to ${!isFavorited}`);
  };

  return (
    <div className="card group mb-4 flex items-center gap-4 rounded-2xl border border-white/10 bg-neutral-800 p-4 shadow-lg transition-all duration-300 hover:border-white/20">
      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 shadow-inner 
                    sm:h-16 sm:w-16">
        <Music className="h-6 w-6 text-primary/80 sm:h-8 sm:w-8" />
      </div>

      <div className="flex-grow overflow-hidden">
        <div className="flex items-center justify-between gap-2">
          <div className="flex-grow overflow-hidden">
            <h3 className="truncate text-base font-medium text-white sm:text-lg">
              {song.name}
            </h3>
            <p className="truncate text-xs text-white/60 sm:text-sm">
              {`${song.mood || ''} ${song.theme ? `• ${song.theme}` : ''}`}
            </p>
          </div>
          
          <div className="flex flex-shrink-0 items-center space-x-1 sm:space-x-2">
            {hasVariations && (
              <button
                onClick={toggleExpand}
                className="text-white/60 transition-all duration-300 hover:text-primary"
                aria-label="Toggle variations"
              >
                <ChevronDown
                  className={`h-5 w-5 transform transition-transform ${
                    expandedVariations ? 'rotate-180' : ''
                  }`}
                />
              </button>
            )}
            {isPlayable && (
              <button
                onClick={handleToggleFavorite}
                disabled={!isPremium}
                aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
                className={`transition-all duration-300 group flex items-center justify-center p-2 sm:p-2.5 rounded-full 
                         ${!isPremium 
                           ? 'text-white/30 cursor-not-allowed'
                           : (isFavorited 
                             ? 'text-red-400 bg-red-500/10 hover:bg-red-500/20'
                             : 'text-white/60 hover:text-red-400 bg-white/10 hover:bg-white/20')} `}
              >
                {!isPremium ? (
                   <LockKeyhole className="w-4 h-4 sm:w-5 sm:h-5" />
                ) : (
                   <Heart className={`w-4 h-4 sm:w-5 sm:h-5 transition-colors ${isFavorited ? 'fill-current' : 'fill-none'}`} />
                )}
               </button>
            )}
            {isPlayable && (
              <div className="flex items-center gap-1">
                <button
                  onClick={handleDownload}
                  disabled={!isPremium}
                  aria-label={!isPremium ? "Download song (Premium only)" : "Download song"}
                  title={!isPremium ? "Download song (Premium only)" : "Download MP3"}
                  className={`transition-all duration-300 group flex items-center justify-center p-2 sm:p-2.5 rounded-full 
                           ${!isPremium 
                             ? 'text-white/30 cursor-not-allowed bg-white/5'
                             : 'text-white/60 hover:text-primary bg-white/10 hover:bg-white/20'}`}
                >
                  <Download className={`w-4 h-4 sm:w-5 sm:h-5 ${isPremium ? 'transition-transform group-hover:scale-110' : ''}`} />
                </button>
                {!isPremium && (
                  <span className="text-xs font-semibold text-primary/70 bg-primary/10 px-1.5 py-0.5 rounded-sm">
                    PRO
                  </span>
                )}
              </div>
            )}
            <button
              onClick={() => !playButtonDisabled && audioUrl && onPlayClick(audioUrl, song.id)}
              disabled={playButtonDisabled}
              aria-label={isPlayLimitReached ? "Play limit reached" : (isPlaying && currentSong === audioUrl ? "Pause" : "Play")}
              className={`transition-all duration-300 group flex items-center justify-center p-2.5 rounded-full 
                       ${isPlayLimitReached
                         ? 'bg-yellow-500/20 text-yellow-300 cursor-not-allowed'
                         : (isPlaying && currentSong === audioUrl 
                           ? 'bg-gradient-to-br from-black/80 to-black/90 text-green-400 border border-green-500/30 shadow-lg' 
                           : 'text-white/70 hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed bg-white/10 hover:bg-white/20')}`}
            >
              {isPlayLimitReached ? (
                <LockKeyhole className="w-4 h-4 sm:w-5 sm:h-5" />
              ) : isPlaying && currentSong === audioUrl ? (
                <Pause className="w-4 h-4 sm:w-5 sm:h-5" />
              ) : (
                <Play className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:scale-110" />
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