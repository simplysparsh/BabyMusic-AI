import { Clock } from 'lucide-react';

interface GenerationProgressProps {
  timeLeft: number;
  totalTime: number;
  formattedTime?: string;
  progress?: number;
}

export default function GenerationProgress({ 
  timeLeft, 
  totalTime,
  formattedTime,
  progress
}: GenerationProgressProps) {
  // If formattedTime is not provided, calculate it
  const displayTime = formattedTime || (() => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  })();

  // If progress is not provided, calculate it
  const progressPercent = progress !== undefined 
    ? progress 
    : ((totalTime - timeLeft) / totalTime) * 100;

  return (
    <div className="mt-4 space-y-4 fade-in px-2">
      <div 
        className="flex flex-wrap items-center justify-center px-3 py-2 rounded-lg bg-black"
        style={{
          background: 'linear-gradient(to right, rgba(0,0,0,0.95), rgba(0,0,0,0.9))'
        }}
      >
        <div className="flex items-center gap-1.5">
          <Clock className="inline-block w-3.5 h-3.5 text-primary/90 animate-pulse" />
          <p className="text-white/90 text-xs sm:text-sm">
            Creating your <span className="text-primary">masterpiece</span>... ✨
          </p>
        </div>
        <div className="text-xs ml-1.5 bg-black/80 px-1.5 py-0.5 rounded text-white/90">
          {displayTime}
        </div>
      </div>
      
      <div className="w-full bg-black/40 rounded-full h-1.5 border border-white/5">
        <div 
          className="bg-gradient-to-r from-primary to-secondary h-full rounded-full transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        ></div>
      </div>
    </div>
  );
}