import { Flame } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { getStreakMessage } from '../../utils/streakMessages';

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

  // Get meaningful message based on current streak
  const streakMessage = getStreakMessage(displayStreak === '--' ? 0 : displayStreak);

  return (
    <div className="w-full max-w-lg mx-auto relative">
      {/* Enhanced background with gradient and blur */}
      <div className="relative bg-gradient-to-r from-white/[0.08] via-white/[0.12] to-white/[0.08] 
                      backdrop-blur-md border border-white/10 rounded-2xl py-3 px-4 sm:py-4 sm:px-6
                      shadow-lg shadow-black/10 hover:shadow-xl hover:shadow-black/20 
                      transition-all duration-500 group overflow-hidden">
        
        {/* Subtle animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-pink-500/5 to-blue-500/5 
                        opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
        
        {/* Floating particles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
          <div className="absolute top-2 left-8 w-1 h-1 bg-orange-400/60 rounded-full animate-ping" 
               style={{ animationDelay: '0s', animationDuration: '3s' }}></div>
          <div className="absolute bottom-2 right-12 w-0.5 h-0.5 bg-pink-400/60 rounded-full animate-ping" 
               style={{ animationDelay: '1.5s', animationDuration: '4s' }}></div>
        </div>
        
        <div className="flex items-center justify-center gap-3 sm:gap-4 relative z-10">
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Enhanced flame icon with glow */}
            <div className="relative">
              <div className="absolute inset-0 bg-orange-400/30 blur-md rounded-full scale-150"></div>
              <Flame className="w-5 h-5 sm:w-6 sm:h-6 text-orange-400 relative z-10 
                              group-hover:scale-110 transition-transform duration-300" />
            </div>
            
            <div className="relative">
              <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-orange-400 via-pink-400 to-purple-400 
                            bg-clip-text text-transparent group-hover:from-orange-300 group-hover:via-pink-300 
                            group-hover:to-purple-300 transition-all duration-300">
                {displayStreak}
              </span>
              <span className="ml-1.5 sm:ml-2 text-white/80 text-sm sm:text-base font-medium">
                day streak
              </span>
            </div>
          </div>
          
          {/* Enhanced divider */}
          <div className="w-px h-4 sm:h-5 bg-gradient-to-b from-transparent via-white/20 to-transparent"></div>
          
          <div className="text-white/80 text-sm sm:text-sm font-medium">
            <span className="hidden sm:inline">{streakMessage.desktop}</span>
            <span className="sm:hidden">{streakMessage.mobile}</span>
          </div>
        </div>
        
        {/* Bottom accent line */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r 
                        from-transparent via-orange-400/30 to-transparent 
                        group-hover:via-orange-400/50 transition-all duration-500"></div>
      </div>
    </div>
  );
}