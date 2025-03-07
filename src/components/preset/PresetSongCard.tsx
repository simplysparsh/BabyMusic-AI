import { ComponentType, KeyboardEvent, MouseEvent, useCallback } from 'react';
import { Play, RefreshCw, Wand2, ChevronLeft, ChevronRight } from 'lucide-react';
import type { PresetType, Song } from '../../types';
import { SongStateService } from '../../services/songStateService';
import { songAdapter } from '../../utils/songAdapter';

interface PresetCardProps {
  type: PresetType;
  title: string;
  description: string;
  iconComponent: ComponentType<React.SVGProps<SVGSVGElement>>;
  songs: Song[];
  isPlaying: boolean;
  onPlayClick: (audioUrl: string) => void;
  onGenerateClick: (type: PresetType) => void;
  onVariationChange: (e: MouseEvent<HTMLDivElement>, type: PresetType, direction: 'next' | 'prev') => void;
  currentVariationIndex?: number;
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
  currentVariationIndex = 0
}: PresetCardProps) {
  // Get song state metadata using the comprehensive helper method for preset types
  const {
    isGenerating,
    hasFailed,
    isReady,
    hasVariations,
    variationCount,
    statusLabel,
    song: currentSong
  } = SongStateService.getPresetTypeStateMetadata(
    songs,
    type
  );
  
  // Get the audio URL using the adapter
  const audioUrl = currentSong ? songAdapter.getAudioUrl(currentSong) : undefined;

  // Handle card click
  const handleCardClick = useCallback(() => {
    if (isGenerating) return;
    
    if (isReady && audioUrl) {
      onPlayClick(audioUrl);
    } else {
      onGenerateClick(type);
    }
  }, [isGenerating, isReady, audioUrl, type, onPlayClick, onGenerateClick]);

  // Get color scheme based on preset type
  const getColorScheme = () => {
    switch (type) {
      case 'playing':
        return 'from-blue-500/20 to-blue-600/20 border-blue-500/30 hover:border-blue-500/50';
      case 'eating':
        return 'from-green-500/20 to-green-600/20 border-green-500/30 hover:border-green-500/50';
      case 'sleeping':
        return 'from-purple-500/20 to-purple-600/20 border-purple-500/30 hover:border-purple-500/50';
      case 'pooping':
        return 'from-amber-500/20 to-amber-600/20 border-amber-500/30 hover:border-amber-500/50';
      default:
        return 'from-primary/20 to-secondary/20 border-primary/30 hover:border-primary/50';
    }
  };

  return (
    <div
      className={`relative rounded-xl p-4 border bg-gradient-to-br ${getColorScheme()} 
                backdrop-blur-sm transition-all duration-300 cursor-pointer
                hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]`}
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e: KeyboardEvent<HTMLDivElement>) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleCardClick();
        }
      }}
    >
      <div className="flex items-start mb-3">
        <div className={`p-2 rounded-full bg-white/10 mr-3`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          <p className="text-sm text-white/70">{description}</p>
        </div>
      </div>

      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center">
          {isGenerating ? (
            <div className="flex items-center">
              <div className="animate-spin mr-2">
                <RefreshCw className="w-4 h-4 text-white/70" />
              </div>
              <span className="text-sm text-white/70">{statusLabel}</span>
            </div>
          ) : hasFailed ? (
            <div className="flex items-center text-red-300">
              <RefreshCw className="w-4 h-4 mr-2" />
              <span className="text-sm">{statusLabel}</span>
            </div>
          ) : isReady ? (
            <div className="flex items-center text-white/70">
              <Play className="w-4 h-4 mr-2" />
              <span className="text-sm">{isPlaying ? 'Playing' : 'Play'}</span>
            </div>
          ) : (
            <div className="flex items-center text-white/70">
              <Wand2 className="w-4 h-4 mr-2" />
              <span className="text-sm">Generate</span>
            </div>
          )}
        </div>

        {/* Variation controls */}
        {hasVariations && variationCount > 1 && (
          <div className="flex items-center space-x-1">
            <div
              className="p-1 rounded-full bg-white/10 hover:bg-white/20 cursor-pointer"
              onClick={(e) => onVariationChange(e, type, 'prev')}
            >
              <ChevronLeft className="w-4 h-4 text-white" />
            </div>
            <span className="text-xs text-white/70">
              {currentVariationIndex + 1}/{variationCount}
            </span>
            <div
              className="p-1 rounded-full bg-white/10 hover:bg-white/20 cursor-pointer"
              onClick={(e) => onVariationChange(e, type, 'next')}
            >
              <ChevronRight className="w-4 h-4 text-white" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}