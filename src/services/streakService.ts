import { supabase } from '../lib/supabase';
import type { StreakData } from '../types/streak';

/**
 * Fetches streak data for a given user.
 * Note: Currently fetches from profiles table, could be a dedicated endpoint later.
 */
const fetchStreakData = async (userId: string): Promise<StreakData | null> => {
  if (!userId) return null;

  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('current_streak, last_active_date')
      .eq('id', userId)
      .single();

    if (error) {
      // Don't throw if profile just doesn't exist or has no streak data yet
      if (error.code === 'PGRST116') { 
        console.log('No profile/streak data found for user:', userId);
        return null;
      }
      console.error('Error fetching streak data:', error);
      throw error; // Rethrow other errors
    }

    if (data) {
      return {
        currentStreak: data.current_streak ?? 0,
        lastActiveDate: data.last_active_date, // Keep as string or null
      };
    }
    return null;
  } catch (err) {
    console.error('Unexpected error in fetchStreakData:', err);
    // Depending on desired behavior, could return null or rethrow
    return null; 
  }
};

/**
 * Calls the backend RPC function to update the user's streak.
 */
const updateStreak = async (userId: string): Promise<void> => {
  if (!userId) return;

  try {
    const { error: rpcError } = await supabase.rpc('update_user_streak', {
      user_id_input: userId,
    });
    if (rpcError) {
      console.error('Error calling update_user_streak RPC:', rpcError);
      // Potentially throw or handle specific errors if needed
    }
  } catch (rpcCallError) {
    console.error('Unexpected error during update_user_streak RPC call:', rpcCallError);
    // Potentially throw
  }
};

export const StreakService = {
  fetchStreakData,
  updateStreak,
}; 