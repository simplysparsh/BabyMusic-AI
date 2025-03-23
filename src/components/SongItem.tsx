import { useState, useEffect } from 'react';
import { Play, Pause, Download, Share2, ChevronDown, RefreshCw } from 'lucide-react';
import { SongStateService } from '../services/songStateService';
import type { Song } from '../types';
import { useSongStore } from '../store/songStore';
import { SongService } from '../services/songService';
import { useAuthStore } from '../store/authStore';
import SongGenerationTimer from './common/SongGenerationTimer';

interface SongItemProps {
  song: Song;
  currentSong: string | null;
  isPlaying: boolean;
  onPlayClick: (audioUrl: string, songId: string) => void;
  onDownloadClick: (audioUrl: string, title: string) => void;
}

export default function SongItem({
  song,
  currentSong,
  isPlaying,
  onPlayClick,
  onDownloadClick
}: SongItemProps) {
  const [expandedVariations, setExpandedVariations] = useState(false);
  const { retryingSongs, setRetrying } = useSongStore();
  const { user } = useAuthStore();

  // Get all the song state information from SongStateService
  const isGenerating = SongStateService.isGenerating(song);
  const hasFailed = SongStateService.hasFailed(song);
  const hasVariations = SongStateService.hasVariations(song);
  const isReady = SongStateService.isReady(song);
  const canRetry = SongStateService.canRetry(song);
  const isPlayable = SongStateService.isPlayable(song);

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

  return (
    <div className="card p-6 group hover:bg-white/[0.09] transition-all duration-500 mb-4
                   bg-black/40 backdrop-blur-sm border border-white/10 hover:border-white/20">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-white font-medium text-lg mb-1">{song.name}</h3>
          <p className="text-sm text-white/60">
            {`${song.mood || ''} ${song.theme ? `• ${song.theme}` : ''}`}
          </p>
        </div>
        <div className="flex items-center space-x-3">
          {hasVariations && (
            <button
              onClick={toggleExpand}
              className="text-white/60 hover:text-primary transition-all duration-300"
            >
              <ChevronDown
                className={`w-5 h-5 transform transition-transform ${
                  expandedVariations ? 'rotate-180' : ''
                }`}
              />
            </button>
          )}
          <button
            onClick={() => isPlayable && audioUrl && onPlayClick(audioUrl, song.id)}
            disabled={!isPlayable}
            className={`transition-all duration-300 group flex items-center justify-center
                     ${isPlaying && currentSong === audioUrl 
                        ? 'bg-gradient-to-br from-black/80 to-black/90 text-green-400 border border-green-500/30 shadow-lg rounded-full p-2.5' 
                        : 'text-white/60 hover:text-primary disabled:opacity-50 p-2.5'}`}
          >
            {isPlaying && currentSong === audioUrl ? (
              <Pause className="w-5 h-5" />
            ) : (
              <Play className="w-5 h-5 group-hover:scale-110 transition-transform" />
            )}
          </button>
          <button
            disabled={!isPlayable}
            onClick={() => isPlayable && audioUrl && onDownloadClick(audioUrl, song.name)}
            className="text-white/60 hover:text-accent disabled:opacity-50
                     transition-all duration-300 group"
          >
            <Download className="w-5 h-5 group-hover:scale-110 transition-transform" />
          </button>
          <button
            disabled={!isPlayable}
            className="text-white/60 hover:text-secondary disabled:opacity-50
                     transition-all duration-300 group"
          >
            <Share2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
          </button>
        </div>
      </div>
      
      {/* Variations section */}
      {expandedVariations && hasVariations && song.variations && (
        <div className="mt-6 space-y-3 pl-6 border-l-2 border-primary/20">
          {song.variations.map((variation, index) => (
            <div
              key={variation.id}
              className="flex items-center justify-between py-3 px-4 bg-white/[0.05]
                       rounded-xl backdrop-blur-sm group/variation hover:bg-white/[0.08]
                       transition-all duration-300"
            >
              <span className="text-white/80">
                Variation {index + 1}
              </span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => variation.audio_url && onPlayClick(variation.audio_url, song.id)}
                  className={`transition-all duration-300 flex items-center justify-center
                           ${isPlaying && currentSong === variation.audio_url 
                              ? 'bg-gradient-to-br from-black/80 to-black/90 text-green-400 border border-green-500/30 shadow-sm rounded-full p-1.5' 
                              : 'text-white/60 hover:text-primary p-1.5'}`}
                >
                  {isPlaying && currentSong === variation.audio_url ? (
                    <Pause className="w-4 h-4" />
                  ) : (
                    <Play className="w-4 h-4 group-hover/variation:scale-110 transition-transform" />
                  )}
                </button>
                <button 
                  onClick={() => variation.audio_url && onDownloadClick(variation.audio_url, `${song.name} - Variation ${index + 1}`)}
                  className="text-white/60 hover:text-accent transition-all duration-300"
                >
                  <Download className="w-4 h-4 group-hover/variation:scale-110 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Generation progress */}
      {!isPlayable && (
        <div className="mt-2">
          <div className="h-1 bg-primary/20 rounded-full overflow-hidden">
            <div className={`h-full bg-primary animate-pulse ${
              hasFailed ? 'bg-red-400 !animate-none' : ''
            }`}></div>
          </div>
          <div className="flex items-center justify-between mt-1">
            {isGenerating ? (
              <SongGenerationTimer 
                isGenerating={isGenerating} 
                showProgress={false}
                className="w-full"
              />
            ) : (
              <p className={`text-xs text-white/60 ${hasFailed ? '!text-red-400' : ''}`}>
                {isReady ? 'Ready to play' : (song.error || 'Processing...')}
              </p>
            )}
            {canRetry && (
              <button
                onClick={handleRetry}
                disabled={isRetrying}
                className={`text-xs flex items-center ${
                  song.error && song.error.includes('timed out') 
                    ? 'text-white bg-primary hover:bg-primary/80' 
                    : 'text-white bg-primary/20 hover:bg-primary/30'
                } px-2 py-1 rounded transition-all ${isRetrying ? 'opacity-50' : ''}`}
              >
                <RefreshCw className={`w-3 h-3 mr-1 ${isRetrying ? 'animate-spin' : ''}`} />
                {isRetrying ? 'Retrying...' : 'Retry'}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}