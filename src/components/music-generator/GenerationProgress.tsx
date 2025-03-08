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
    <div className="mt-8 space-y-6 fade-in">
      <div className="flex items-center justify-center gap-3 bg-primary/10 py-3 px-6 rounded-xl
                    backdrop-blur-sm border border-primary/20 animate-pulse">
        <Clock className="inline-block w-4 h-4 mr-2 animate-pulse" />
        <p className="text-white/90 text-sm font-medium flex items-center gap-2">
          Creating your <span className="text-primary">masterpiece</span>... ✨ 
          <span className="text-white/80">
            {displayTime}
          </span>
        </p>
      </div>
      
      <div className="w-full bg-white/10 rounded-full h-2">
        <div 
          className="bg-gradient-to-r from-primary to-secondary h-full rounded-full transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        ></div>
      </div>
    </div>
  );
}