import { useState, useCallback } from 'react';
import { useSongStore } from '../store/songStore';

/**
 * Hook to provide functionality for resetting songs stuck in generating state
 */
export function useResetGenerating() {
  const [isResetting, setIsResetting] = useState(false);
  const { generatingSongs, resetGeneratingState } = useSongStore();
  
  const hasStuckSongs = generatingSongs.size > 0;
  
  const resetStuckSongs = useCallback(async () => {
    if (!hasStuckSongs) return;
    
    setIsResetting(true);
    try {
      await resetGeneratingState();
    } catch (error) {
      console.error('Failed to reset generating state:', error);
    } finally {
      setIsResetting(false);
    }
  }, [hasStuckSongs, resetGeneratingState]);
  
  return {
    hasStuckSongs,
    isResetting,
    resetStuckSongs,
    stuckSongCount: generatingSongs.size
  };
}

export default useResetGenerating; 