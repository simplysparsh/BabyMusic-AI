import { useState, useEffect } from 'react';
import { SONG_TIMEOUT_DURATION } from '../services/timeoutService';

// Convert milliseconds to seconds for UI display
const TIMEOUT_SECONDS = Math.floor(SONG_TIMEOUT_DURATION / 1000);

/**
 * Hook for managing song generation timer
 * Uses the same timeout duration as the server-side timeout
 * @param isGenerating Whether a song is currently being generated
 * @returns Timer state and helper functions
 */
export function useSongGenerationTimer(isGenerating: boolean) {
  const [timeLeft, setTimeLeft] = useState(TIMEOUT_SECONDS);
  const [progress, setProgress] = useState(0);
  
  // Reset and start timer when generation starts
  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    
    if (isGenerating) {
      // Reset timer when starting generation
      setTimeLeft(TIMEOUT_SECONDS);
      setProgress(0);
      
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          const newTime = prev > 0 ? prev - 1 : 0;
          // Calculate progress percentage (0-100)
          setProgress(((TIMEOUT_SECONDS - newTime) / TIMEOUT_SECONDS) * 100);
          return newTime;
        });
      }, 1000);
    }
    
    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [isGenerating]);
  
  // Format time as MM:SS
  const formatTime = () => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };
  
  return {
    timeLeft,
    progress,
    formattedTime: formatTime(),
    totalTime: TIMEOUT_SECONDS
  };
} 