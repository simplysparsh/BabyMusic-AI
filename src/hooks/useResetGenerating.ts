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
  
  const resetWithConfirmation = useCallback(async () => {
    if (!hasStuckSongs) return;
    
    if (window.confirm(`This will clear ${generatingSongs.size} song${generatingSongs.size > 1 ? 's' : ''} that ${generatingSongs.size > 1 ? 'are' : 'is'} stuck in the generating state. Continue?`)) {
      await resetStuckSongs();
    }
  }, [hasStuckSongs, generatingSongs.size, resetStuckSongs]);
  
  return {
    hasStuckSongs,
    isResetting,
    resetStuckSongs,
    resetWithConfirmation,
    stuckSongCount: generatingSongs.size
  };
}

export default useResetGenerating; 