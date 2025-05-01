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

// --- Storage Helpers ---

const getTimerKey = (songId: string) => `${TIMER_START_KEY_PREFIX}${songId}`;

const readStoredStartTime = (songId: string): number | null => {
  const storedTime = localStorage.getItem(getTimerKey(songId));
  return storedTime ? parseInt(storedTime, 10) : null;
};

const writeStoredStartTime = (songId: string, startTime: number): void => {
  localStorage.setItem(getTimerKey(songId), startTime.toString());
};

const removeStoredStartTime = (songId: string): void => {
  localStorage.removeItem(getTimerKey(songId));
};

// --- Timer State Calculation ---

const calculateInitialTimerState = (startTime: number): Pick<TimerInstance, 'timeLeft' | 'progress'> => {
  const now = Date.now();
  const elapsed = Math.floor((now - startTime) / 1000);

  if (elapsed < TIMEOUT_SECONDS) {
    return {
      timeLeft: TIMEOUT_SECONDS - elapsed,
      progress: (elapsed / TIMEOUT_SECONDS) * 100,
    };
  } else {
    return {
      timeLeft: 0,
      progress: 100,
    };
  }
};

// --- Listener Notification ---

const notifyListeners = (songId: string) => {
  const timer = activeTimers.get(songId);
  if (timer) {
    timer.listeners.forEach(listener => listener());
  }
};

// --- Interval Management ---

const manageTimerInterval = (songId: string, timer: TimerInstance): ReturnType<typeof setInterval> | null => {
  if (timer.timeLeft <= 0) return null;

  return setInterval(() => {
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

    // Notify listeners on each tick
    notifyListeners(songId);
  }, 1000);
};

// --- Timer Orchestration ---

// Stop and cleanup a timer (modified to use storage helper)
const stopTimer = (songId: string) => {
  const timer = activeTimers.get(songId);
  if (!timer) return;

  // Clear interval
  if (timer.interval) {
    clearInterval(timer.interval);
  }

  // Remove from storage using helper
  removeStoredStartTime(songId);

  // Remove from registry
  activeTimers.delete(songId);
};

// Start a timer for a specific song (refactored)
const startTimer = (songId: string) => {
  // 1. Check if a timer exists and has already completed
  const existingTimer = activeTimers.get(songId);
  if (existingTimer && existingTimer.timeLeft <= 0) {
    // Clean up the completed timer before starting a new one
    stopTimer(songId);
  }

  // 2. If a timer still exists (meaning it was running and > 0), exit.
  if (activeTimers.has(songId)) {
    return;
  }

  // 3. Determine start time (read from storage or use current time)
  let startTime = readStoredStartTime(songId);
  const isNewTimer = startTime === null;
  if (isNewTimer) {
    startTime = Date.now();
    writeStoredStartTime(songId, startTime);
  }

  // 4. Calculate initial state
  const initialState = calculateInitialTimerState(startTime as number); // Cast: known not null here

  // 5. Create the timer instance
  const timer: TimerInstance = {
    startTime: startTime as number, // Cast: known not null here
    timeLeft: initialState.timeLeft,
    progress: initialState.progress,
    interval: null,
    listeners: new Set(),
  };

  // 6. Start the interval process
  timer.interval = manageTimerInterval(songId, timer);

  // 7. Store in registry
  activeTimers.set(songId, timer);
};

// --- React Hook ---

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
        const currentTimer = activeTimers.get(songId); // Re-fetch in case it was stopped
        if (currentTimer) {
          // Remove the listener associated with this specific hook instance.
          // The actual logic for stopping the timer globally is handled
          // in the second useEffect based on isGenerating and listener count.
          currentTimer.listeners.delete(updateState);
        }
      };
    }
  }, [songId, isGenerating]);

  // Cleanup timer when generation ends for this hook instance
  useEffect(() => {
    if (!isGenerating && songId && activeTimers.has(songId)) {
      const timer = activeTimers.get(songId);

      // If this hook instance stopped generating, check if the timer might be stopped globally.
      // This relies on listeners.size === 0 as a proxy to detect if any component still needs the timer.
      // EDGE CASE: This might stop the timer prematurely if multiple components use the hook for the
      // same songId and one unmounts/stops generating just before this check runs, leading to a temporary
      // listeners.size of 0. A more robust solution would involve reference counting.
      if (timer && timer.listeners.size === 0) {
        // Potential Race Condition Check: Re-verify listener count before stopping.
        const currentTimer = activeTimers.get(songId);
        if (currentTimer && currentTimer.listeners.size === 0) {
          stopTimer(songId);
        }
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