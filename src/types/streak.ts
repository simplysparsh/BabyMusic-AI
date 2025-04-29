/**
 * Represents the core data related to user streaks.
 */
export interface StreakData {
  currentStreak: number;
  lastActiveDate: string | null; // Store as string (YYYY-MM-DD) from DB
  // Add other potential fields like longestStreak later
} 