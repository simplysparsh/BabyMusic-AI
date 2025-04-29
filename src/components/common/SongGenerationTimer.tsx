import { Clock } from 'lucide-react';
import { useSongGenerationTimer } from '../../hooks/useSongGenerationTimer';

interface SongGenerationTimerProps {
  isGenerating: boolean;
  showProgress?: boolean;
  className?: string;
  compact?: boolean;
  onTimeout?: () => void;
  songId?: string;
}

/**
 * A reusable timer component for song generation
 * Uses the same timeout duration as the server-side timeout
 */
export default function SongGenerationTimer({
  isGenerating,
  showProgress = true,
  className = '',
  compact = false,
  onTimeout,
  songId
}: SongGenerationTimerProps) {
  const { timeLeft, formattedTime, progress, totalTime: _totalTime } = useSongGenerationTimer(isGenerating, songId);
  
  // Call onTimeout when timer reaches 0
  if (timeLeft === 0 && onTimeout) {
    onTimeout();
  }
  
  if (!isGenerating) {
    return null;
  }
  
  // Compact mode just shows the time
  if (compact) {
    return (
      <span className={`text-white/80 ${className}`}>
        <Clock className="inline-block w-3 h-3 mr-1 animate-pulse" />
        {formattedTime}
      </span>
    );
  }
  
  return (
    <div className={`space-y-3 fade-in ${className}`}>
      <div className="flex items-center justify-center gap-3 bg-primary/10 py-2 px-4 rounded-xl
                    backdrop-blur-sm border border-primary/20 animate-pulse">
        <Clock className="inline-block w-4 h-4 animate-pulse" />
        <p className="text-white/90 text-sm font-medium">
          <span className="text-white/80">{formattedTime}</span> remaining
        </p>
      </div>
      
      {showProgress && (
        <div className="w-full bg-white/10 rounded-full h-1.5">
          <div 
            className="bg-gradient-to-r from-primary to-secondary h-full rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      )}
    </div>
  );
} 