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
    <div className="mt-6 space-y-4 fade-in">
      <div 
        className="flex items-center justify-center gap-2 py-2 px-4 rounded-lg
                 shadow-sm border border-primary/20 animate-pulse"
        style={{
          background: 'linear-gradient(to right, rgba(0,0,0,0.8), rgba(0,0,0,0.75))'
        }}
      >
        <Clock className="inline-block w-4 h-4 text-primary/90 animate-pulse" />
        <p className="text-white/90 text-sm flex items-center gap-2">
          Creating your <span className="text-primary">masterpiece</span>... ✨ 
          <span className="text-white/90 ml-1 bg-black/40 px-1.5 py-0.5 rounded text-xs">
            {displayTime}
          </span>
        </p>
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