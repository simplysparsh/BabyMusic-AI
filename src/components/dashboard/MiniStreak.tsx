import { Flame } from 'lucide-react';
import { useEffect, useRef } from 'react';

interface MiniStreakProps {
  streakDays: number;
  isLoading: boolean;
}

export default function MiniStreak({ streakDays, isLoading }: MiniStreakProps) {
  // Keep track of the last valid streak value to prevent flickering
  const lastValidStreakRef = useRef<number | null>(null);
  
  // Update the ref when we have a valid streak value
  useEffect(() => {
    if (!isLoading && streakDays !== undefined) {
      lastValidStreakRef.current = streakDays;
    }
  }, [streakDays, isLoading]);
  
  // Show last valid streak or the current streak, only show '--' on initial load
  const displayStreak = isLoading && lastValidStreakRef.current !== null
    ? lastValidStreakRef.current
    : isLoading ? '--' : streakDays;

  return (
    <div className="w-full bg-white/[0.03] backdrop-blur-sm border-t border-b border-white/5 py-2">
      <div className="max-w-md mx-auto flex items-center justify-center gap-3">
        <div className="flex items-center gap-2">
          <Flame className="w-5 h-5 text-[#F59E0B]" />
          <div className="relative">
            <span className="text-xl font-bold bg-gradient-to-r from-[#F59E0B] to-[#EC4899] 
                          bg-clip-text text-transparent">
              {displayStreak}
            </span>
            <span className="ml-1.5 text-white/80">day streak</span>
          </div>
        </div>
        <div className="w-px h-4 bg-white/10"></div>
        <div className="text-white/50 text-sm">
          Visit daily to maintain
        </div>
      </div>
    </div>
  );
}