import { useState, useCallback } from 'react';
import { useSongStore } from '../store/songStore';
import { SongStateService } from '../services/songStateService';

/**
 * Hook to provide functionality for resetting songs stuck in generating state
 */
export function useResetGenerating() {
  const [isResetting, setIsResetting] = useState(false);
  const { songs, resetGeneratingState } = useSongStore();
  
  // Determine if there are any songs currently in generating or partially ready state
  const stuckSongs = songs.filter(song => 
    SongStateService.isGenerating(song) || SongStateService.isPartiallyReady(song)
  );
  
  const hasStuckSongs = stuckSongs.length > 0;
  
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
    stuckSongCount: stuckSongs.length
  };
}

export default useResetGenerating; 