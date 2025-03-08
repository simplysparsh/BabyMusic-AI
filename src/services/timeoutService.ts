import { supabase } from '../lib/supabase';
import { SongStateService } from './songStateService';

// Define the timeout duration for song generation (5 minutes in milliseconds)
export const SONG_TIMEOUT_DURATION = 5 * 60 * 1000;

/**
 * TimeoutService handles all timeout-related functionality for the application.
 * This service is responsible for setting and clearing timeouts, and for
 * handling timeout events.
 */
export class TimeoutService {
  // Map to store timeout IDs for each song
  private static timeoutIds: Map<string, NodeJS.Timeout> = new Map();

  /**
   * Sets a timeout for song generation
   * This is the single source of truth for timeout handling
   * @param songId The ID of the song to set a timeout for
   */
  static setSongGenerationTimeout(songId: string): void {
    // Clear any existing timeout for this song
    this.clearSongGenerationTimeout(songId);
    
    const timeoutMinutes = Math.floor(SONG_TIMEOUT_DURATION / (60 * 1000));
    
    const timeoutId = setTimeout(async () => {
      console.log(`Song generation timeout reached for song ${songId} after ${timeoutMinutes} minutes`);
      
      try {
        await SongStateService.updateSongWithError(
          songId, 
          `Song generation timed out after ${timeoutMinutes} minutes. Please try again.`
        );
      } catch (err) {
        console.error('Error handling song generation timeout:', err);
      } finally {
        // Clean up the timeout reference
        this.timeoutIds.delete(songId);
      }
    }, SONG_TIMEOUT_DURATION);
    
    // Store the timeout ID
    this.timeoutIds.set(songId, timeoutId);
    
    // Set up a subscription to clear the timeout if the song gets an audio URL or error
    this.setupSongStateListener(songId);
  }
  
  /**
   * Sets up a listener to clear the timeout when a song gets an audio URL or error
   * @param songId The ID of the song to listen for
   */
  private static setupSongStateListener(songId: string): void {
    const subscription = supabase
      .channel(`song-state-${songId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'songs',
          filter: `id=eq.${songId}`
        },
        (payload) => {
          const updatedSong = payload.new as any;
          
          // If the song now has an audio URL or an error, clear the timeout
          if (updatedSong.audio_url || updatedSong.error) {
            console.log(`Song ${songId} received audio URL or error, clearing timeout`);
            this.clearSongGenerationTimeout(songId);
            
            // Unsubscribe from further updates
            subscription.unsubscribe();
          }
        }
      )
      .subscribe();
  }
  
  /**
   * Clears a song generation timeout
   * @param songId The ID of the song to clear the timeout for
   */
  static clearSongGenerationTimeout(songId: string): void {
    const timeoutId = this.timeoutIds.get(songId);
    if (timeoutId) {
      clearTimeout(timeoutId);
      this.timeoutIds.delete(songId);
    }
  }
  
  /**
   * Checks if a song has been generating for too long
   * This is used as a fallback check in case the timeout didn't fire
   * @param song The song to check
   * @returns true if the song has timed out, false otherwise
   */
  static hasSongTimedOut(song: any): boolean {
    if (!song || !song.createdAt) return false;
    
    const createdAt = new Date(song.createdAt).getTime();
    const now = Date.now();
    
    return now - createdAt > SONG_TIMEOUT_DURATION;
  }
  
  /**
   * Checks for and fixes inconsistent song states in the database
   * This can be called periodically to ensure data consistency
   */
  static async checkAndFixInconsistentStates(): Promise<void> {
    try {
      console.log('Checking for inconsistent song states...');
      
      // Find songs with retryable: true but error: null
      const { data: inconsistentSongs, error: fetchError } = await supabase
        .from('songs')
        .select('id, name')
        .is('error', null)
        .eq('retryable', true);
      
      if (fetchError) {
        console.error('Failed to fetch inconsistent songs:', fetchError);
        return;
      }
      
      if (inconsistentSongs && inconsistentSongs.length > 0) {
        console.warn(`Found ${inconsistentSongs.length} songs with inconsistent states (retryable: true but error: null)`);
        
        // Fix each inconsistent song
        for (const song of inconsistentSongs) {
          console.log(`Fixing inconsistent state for song ${song.id} (${song.name})`);
          await SongStateService.updateSongWithError(song.id, "Generation failed. Please try again.");
        }
        
        console.log('Finished fixing inconsistent song states');
      } else {
        console.log('No inconsistent song states found');
      }
    } catch (err) {
      console.error('Error checking for inconsistent song states:', err);
    }
  }
} 