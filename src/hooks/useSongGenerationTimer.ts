import { useState, useEffect } from 'react';

// Define timeout directly here (5 minutes in milliseconds)
const SONG_TIMEOUT_DURATION = 5 * 60 * 1000;

// Convert milliseconds to seconds for UI display
const TIMEOUT_SECONDS = Math.floor(SONG_TIMEOUT_DURATION / 1000);

// Storage key prefix for persisting timer state
const TIMER_START_KEY_PREFIX = 'song_generation_timer_start_';

// Type for a single timer
type TimerInstance = {
  timeLeft: number;
  progress: number;
  startTime: number;
  interval: ReturnType<typeof setInterval> | null;
  listeners: Set<() => void>;
};

// Global registry of active timers
const activeTimers: Map<string, TimerInstance> = new Map();

// Get storage key for a specific song
const getTimerKey = (songId: string) => `${TIMER_START_KEY_PREFIX}${songId}`;

// Notify listeners for a specific timer
const notifyListeners = (songId: string) => {
  const timer = activeTimers.get(songId);
  if (timer) {
    timer.listeners.forEach(listener => listener());
  }
};

// Start a timer for a specific song
const startTimer = (songId: string) => {
  // If timer already exists, just subscribe to it
  if (activeTimers.has(songId)) {
    return;
  }
  
  // Check if we have stored timer data
  const timerKey = getTimerKey(songId);
  const storedStartTimeStr = localStorage.getItem(timerKey);
  
  let startTime = Date.now();
  let timeLeft = TIMEOUT_SECONDS;
  let progress = 0;
  
  // If we have stored timer data, calculate current state
  if (storedStartTimeStr) {
    const storedStartTime = parseInt(storedStartTimeStr, 10);
    const elapsed = Math.floor((Date.now() - storedStartTime) / 1000);
    
    // If timer hasn't expired
    if (elapsed < TIMEOUT_SECONDS) {
      startTime = storedStartTime;
      timeLeft = TIMEOUT_SECONDS - elapsed;
      progress = (elapsed / TIMEOUT_SECONDS) * 100;
    } else {
      // Timer would have expired, use full time
      timeLeft = 0;
      progress = 100;
    }
  } else {
    // New timer, store start time
    localStorage.setItem(timerKey, startTime.toString());
  }
  
  // Create the timer instance
  const timer: TimerInstance = {
    timeLeft,
    progress,
    startTime,
    interval: null,
    listeners: new Set()
  };
  
  // Start interval if time remaining
  if (timeLeft > 0) {
    timer.interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - timer.startTime) / 1000);
      
      if (elapsed < TIMEOUT_SECONDS) {
        timer.timeLeft = TIMEOUT_SECONDS - elapsed;
        timer.progress = (elapsed / TIMEOUT_SECONDS) * 100;
      } else {
        timer.timeLeft = 0;
        timer.progress = 100;
        
        // Timer completed, clear interval
        if (timer.interval) {
          clearInterval(timer.interval);
          timer.interval = null;
        }
      }
      
      // Notify listeners
      notifyListeners(songId);
    }, 1000);
  }
  
  // Store in registry
  activeTimers.set(songId, timer);
};

// Stop and cleanup a timer
const stopTimer = (songId: string) => {
  const timer = activeTimers.get(songId);
  if (!timer) return;
  
  // Clear interval
  if (timer.interval) {
    clearInterval(timer.interval);
  }
  
  // Remove from storage
  localStorage.removeItem(getTimerKey(songId));
  
  // Remove from registry
  activeTimers.delete(songId);
};

/**
 * Hook for managing song generation timer
 * Uses the same timeout duration as the server-side timeout
 * @param isGenerating Whether a song is currently being generated
 * @param songId ID of the song being generated
 * @returns Timer state and helper functions
 */
export function useSongGenerationTimer(isGenerating: boolean, songId?: string) {
  // Default state values
  const [timeLeft, setTimeLeft] = useState(TIMEOUT_SECONDS);
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    // If no songId or not generating, don't do anything
    if (!songId || !isGenerating) {
      return;
    }
    
    // Start or get existing timer
    startTimer(songId);
    
    // Get initial state from timer
    const timer = activeTimers.get(songId);
    if (timer) {
      setTimeLeft(timer.timeLeft);
      setProgress(timer.progress);
      
      // Add listener for updates
      const updateState = () => {
        setTimeLeft(timer.timeLeft);
        setProgress(timer.progress);
      };
      
      timer.listeners.add(updateState);
      
      // Cleanup listener on unmount
      return () => {
        timer.listeners.delete(updateState);
        
        // If no more listeners and not generating, clean up timer
        if (timer.listeners.size === 0 && !isGenerating) {
          stopTimer(songId);
        }
      };
    }
  }, [songId, isGenerating]);
  
  // Cleanup timer when generation ends
  useEffect(() => {
    if (!isGenerating && songId && activeTimers.has(songId)) {
      // Keep timer running but check if all instances have stopped generating
      const timer = activeTimers.get(songId);
      if (timer && timer.listeners.size === 0) {
        stopTimer(songId);
      }
    }
  }, [isGenerating, songId]);
  
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