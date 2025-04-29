import { create } from 'zustand';
import type { StreakData } from '../types/streak';

interface StreakState {
  streakData: StreakData | null;
  isLoading: boolean;
  error: string | null;
  setStreakData: (data: StreakData | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  // Potentially add actions here later to load/update data via streakService
}

export const useStreakStore = create<StreakState>((set) => ({
  streakData: null,
  isLoading: false,
  error: null,
  setStreakData: (data) => set({ streakData: data, isLoading: false, error: null }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error: error, isLoading: false }),
})); 