import React, { useState } from 'react';
import { Play, Pause, Download, Share2, ChevronDown } from 'lucide-react';
import { SongStateService } from '../services/songStateService';
import type { Song } from '../types';
import { useSongAdapter } from '../utils/songAdapter';

interface SongItemProps {
  song: Song;
  currentSong: string | null;
  isPlaying: boolean;
  generatingSongs: Set<string>;
  processingTaskIds: Set<string>;
  onPlayClick: (audioUrl: string, songId: string) => void;
  onDownloadClick: (audioUrl: string, title: string) => void;
}

export default function SongItem({
  song,
  currentSong,
  isPlaying,
  generatingSongs,
  processingTaskIds,
  onPlayClick,
  onDownloadClick
}: SongItemProps) {
  const [expandedVariations, setExpandedVariations] = useState(false);
  const { getAudioUrl } = useSongAdapter();

  // Get song state information using SongStateService
  const { 
    isGenerating, 
    hasFailed,
    hasVariations,
    variationCount
  } = SongStateService.getSongStateMetadata(
    song,
    generatingSongs,
    processingTaskIds,
    undefined, // Not relevant for regular songs
    null       // Not a preset song
  );

  // Handle toggling variations display
  const toggleExpand = () => {
    if (hasVariations) {
      setExpandedVariations(!expandedVariations);
    }
  };

  const audioUrl = getAudioUrl(song);

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
            onClick={() => audioUrl && onPlayClick(audioUrl, song.id)}
            disabled={!audioUrl}
            className="text-white/60 hover:text-primary disabled:opacity-50
                     transition-all duration-300 group"
          >
            {isPlaying && currentSong === audioUrl ? (
              <Pause className="w-5 h-5" />
            ) : (
              <Play className="w-5 h-5 group-hover:scale-110 transition-transform" />
            )}
          </button>
          <button
            disabled={!audioUrl}
            onClick={() => audioUrl && onDownloadClick(audioUrl, song.name)}
            className="text-white/60 hover:text-accent disabled:opacity-50
                     transition-all duration-300 group"
          >
            <Download className="w-5 h-5 group-hover:scale-110 transition-transform" />
          </button>
          <button
            disabled={!audioUrl}
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
                  className="text-white/60 hover:text-primary transition-all duration-300"
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
      {!audioUrl && (
        <div className="mt-2">
          <div className="h-1 bg-primary/20 rounded-full overflow-hidden">
            <div className={`h-full bg-primary animate-pulse ${
              hasFailed ? 'bg-red-400 !animate-none' : ''
            }`}></div>
          </div>
          <p className={`text-xs mt-1 text-white/60 ${hasFailed ? '!text-red-400' : ''}`}>
            {isGenerating ? 'Generating...' : song.error || 'Processing...'}
          </p>
        </div>
      )}
    </div>
  );
}