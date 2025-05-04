// @breadcrumbs
// - src/store/song/actions.ts: Actions for the song store
// - Parent: src/store/songStore.ts
// - Related: src/store/song/types.ts (types)
// - Related: src/lib/supabase.ts (database)

import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../authStore';
import { SongService, mapDatabaseSongToSong } from '../../services/songService';
import { SongStateService } from '../../services/songStateService';
import type { Song, PresetType } from '../../types';
import type { SongState, CreateSongParams } from './types';
import { useErrorStore } from '../errorStore';

// Create a typed setter and getter for the zustand store
type SetState = (state: Partial<SongState>) => void;
type GetState = () => SongState;

export const createSongActions = (set: SetState, get: GetState) => ({
  loadSongs: async () => {
    try {
      set({ isLoading: true, error: null });
      
      const { data: songsData, error } = await supabase
        .from('songs')
        .select('*, variations:song_variations(*)')
        .eq('user_id', useAuthStore.getState().user?.id)
        .order('is_favorite', { ascending: false })
        .order('created_at', { ascending: false });
      
      if (error) throw error;

      // *** Add logging here ***
      console.log('[DEBUG] Before cloning queuedTaskIds:', {
        type: typeof get().queuedTaskIds,
        value: get().queuedTaskIds,
        isIterable: typeof get().queuedTaskIds?.[Symbol.iterator] === 'function'
      });
      // *** End logging ***
      
      // Clear any processing task IDs that don't exist in the database
      const newProcessingTaskIds = new Set([...get().processingTaskIds]);
      const newQueuedTaskIds = new Set([...get().queuedTaskIds]);
      
      // Remove task IDs associated with songs that don't exist
      songsData?.forEach(song => {
        if (song.task_id) {
          // Keep task IDs for existing songs
          if (!newProcessingTaskIds.has(song.task_id)) {
            newProcessingTaskIds.add(song.task_id);
          }
        }
      });
      
      // Filter out task IDs that aren't associated with any song
      for (const taskId of newProcessingTaskIds) {
        const songExists = songsData?.some(song => song.task_id === taskId);
        if (!songExists) {
          newProcessingTaskIds.delete(taskId);
          newQueuedTaskIds.delete(taskId);
        }
      }

      console.log('State reconciliation:', {
        dbSongs: songsData?.length || 0,
        previousTaskIds: get().processingTaskIds.size,
        newTaskIds: newProcessingTaskIds.size
      });
      
      // Removing debug logs
      // console.log('[loadSongs] Raw data fetched from Supabase:', songsData); 
      
      const songsToSet = (songsData || []).map(dbSong => mapDatabaseSongToSong(dbSong));
      // console.log('[loadSongs] Mapped songs before setting state:', songsToSet);
      
      set({ 
        songs: songsToSet, // Use the mapped data
        processingTaskIds: newProcessingTaskIds,
        queuedTaskIds: newQueuedTaskIds
      });
    } catch (error) {
      // Add specific logging if the error is the iterable issue
      if (error instanceof TypeError && error.message.includes('is not iterable')) {
        console.error('[DEBUG] Caught iterable error. Current queuedTaskIds:', {
          type: typeof get().queuedTaskIds,
          value: get().queuedTaskIds
        });
      }
      console.error('Error loading songs:', error);
      set({ error: 'Failed to load your songs.' });
    } finally {
      set({ isLoading: false });
    }
  },

  createSong: async (params: CreateSongParams): Promise<Song> => {
    const { name, mood, theme, userInput, tempo, isInstrumental, voice, songType, preset_type } = params;
    console.log('[Action] createSong triggered with params:', params);

    // Destructure error store methods *before* try block
    const { setError, clearError } = useErrorStore.getState();

    try {
      const user = useAuthStore.getState().user;
      const profile = useAuthStore.getState().profile;
      clearError(); // Clear previous errors here

      if (!user || !profile) {
        throw new Error('User must be logged in');
      }
      if (!profile.babyName) {
        throw new Error('Baby name is required');
      }
      
      // --- Call Check Function FIRST --- 
      console.log(`[Action] Invoking check-generation-allowance function...`);
      const { data: checkData, error: checkError } = await supabase.functions.invoke(
        'check-generation-allowance'
        // No body needed, function uses user context
      );

      if (checkError) {
         console.error('[Action] check-generation-allowance invocation error:', checkError);
         throw new Error(`Server check failed: ${checkError.message}`);
      }

      if (!checkData?.allowed) {
         console.log('[Action] Generation not allowed by backend:', checkData?.reason);
         const reason = checkData?.reason;
         if (reason === 'limit_reached') {
            throw new Error('Generation limit reached. Upgrade to Premium.'); // Specific error for UI
         } else {
            throw new Error(checkData?.error || 'Generation not allowed by server.');
         }
      }
      
      console.log('[Action] Generation allowed by backend. Proceeding with client-side creation...');
      
      // --- Proceed with EXISTING Client-Side Logic --- 
      // Note: SongService methods might need slight adjustments if they also interact with profile counts
      // For now, assume they primarily handle DB inserts and PIAPI calls.

      // The logic for handling preset updates vs. new custom songs needs to be here too.
      const currentPresetType: PresetType | null = preset_type || null; // Need PresetType import back
      let createdOrUpdatedSong: Song | undefined;
      
      if (currentPresetType && songType === 'preset') {
          console.log('Processing PRESET update via client-side logic after check:', currentPresetType);
          // Find existing preset song
          const existingSongs = get().songs.filter(s => 
            s.song_type === 'preset' && s.preset_type === currentPresetType
          );
          const isGenerating = existingSongs.some(song => SongStateService.isGenerating(song));
          if (isGenerating) throw new Error(`${currentPresetType} song is already being generated`);

          if (existingSongs.length > 0) {
             const existingSong = existingSongs.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())[0];
             console.log(`Updating existing preset song ${existingSong.id}`);
             
             // Use SongService to handle the preset regeneration steps
             // This assumes SongService methods don't redo the count checks/increments
             const customFields = { name: name || existingSong.name, theme: theme || existingSong.theme, mood: mood || existingSong.mood };
             const resetSong = await SongService.prepareForRegeneration(existingSong.id, customFields);
             const dbSongForGeneration = { ...resetSong, tempo: tempo || (resetSong as any).tempo, is_instrumental: isInstrumental !== undefined ? isInstrumental : (resetSong as any).is_instrumental, voice_type: voice || (resetSong as any).voice_type, user_lyric_input: userInput || (resetSong as any).user_lyric_input };
             const taskId = await SongService.startSongGeneration(dbSongForGeneration as any, profile.babyName, profile.ageGroup, profile.gender); // Pass profile details
             await SongService.updateSongWithTaskId(existingSong.id, taskId);
             createdOrUpdatedSong = { ...mapDatabaseSongToSong(resetSong), task_id: taskId }; // Need mapDatabaseSongToSong import back
             
             // Update UI state for the updated song
             set({ songs: get().songs.map(s => s.id === existingSong.id ? createdOrUpdatedSong : s) });
          } else {
             // This case (preset type requested but no existing song) shouldn't happen with current flow?
             // If it can, we might need to create it here using SongService.createSong
             console.warn(`Preset song requested (${currentPresetType}) but no existing one found. Creating new.`);
             // Fall through to standard creation below? Or handle differently?
              createdOrUpdatedSong = await SongService.createSong({
                 userId: user.id, name, babyName: profile.babyName,
                 songParams: { theme, mood, tempo, isInstrumental, songType, voice, userInput, preset_type: currentPresetType }
              });
              set({ songs: [createdOrUpdatedSong, ...get().songs] });
          }
      } else {
          // Create a new non-preset song using SongService
          console.log(`Proceeding to create NEW non-preset song via client-side logic`);
          createdOrUpdatedSong = await SongService.createSong({
             userId: user.id, name, babyName: profile.babyName,
             songParams: { theme, mood, tempo, isInstrumental, songType, voice, userInput, preset_type: undefined }, // Ensure preset_type is not passed
             ageGroup: profile.ageGroup,
             gender: profile.gender
          });
          if (!createdOrUpdatedSong) throw new Error('Failed to create song record via service');
          // Update UI state
          set({ songs: [createdOrUpdatedSong, ...get().songs] });
      }
      
      if (!createdOrUpdatedSong) {
         throw new Error('Song creation/update process failed');
      }

      console.log('Client-side song creation/update successful:', createdOrUpdatedSong.id);
      return createdOrUpdatedSong;

    } catch (error) {
      console.error('[Action] Error in createSong action:', error);
      const message = error instanceof Error ? error.message : 'Failed to create song';
      setError(message); // Now setError should be in scope
      // No optimistic song to remove in this version
      throw error; // Re-throw error
    }
  },

  deleteAllSongs: async () => {
    try {
      set({ isDeleting: true, error: null });
      const { user } = useAuthStore.getState();
      
      if (!user) {
        throw new Error('User must be logged in to delete songs');
      }
      
      const { error } = await supabase
        .from('songs')
        .delete()
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      set({ 
        songs: [], 
        processingTaskIds: new Set(),
        queuedTaskIds: new Set()
      });
    } catch (error) {
      console.error('Error deleting songs:', error);
      set({ error: 'Failed to delete your songs.' });
    } finally {
      set({ isDeleting: false });
    }
  },

  retrySong: async (songId: string) => {
    const { user, profile } = useAuthStore.getState(); // Get profile too
    const { setError, clearError } = useErrorStore.getState(); // Get error handlers
    clearError(); // Clear previous errors
    
    if (!user || !profile) { // Check profile
      console.error('User not authenticated or profile missing');
      setError('Authentication error. Please log in again.');
      return;
    }
    
    const userId = user.id;
    const babyName = profile.babyName || 'Baby'; // Use profile directly
    
    try {
      // --- Add Check Function Call --- 
      console.log(`[Action] Invoking check-generation-allowance before retrying song ${songId}...`);
      const { data: checkData, error: checkError } = await supabase.functions.invoke(
        'check-generation-allowance'
      );
      
      if (checkError) {
         console.error('[Action] check-generation-allowance invocation error on retry:', checkError);
         throw new Error(`Server check failed: ${checkError.message}`);
      }

      if (!checkData?.allowed) {
         console.log('[Action] Generation not allowed for retry by backend:', checkData?.reason);
         const reason = checkData?.reason;
         if (reason === 'limit_reached') {
            throw new Error('Generation limit reached. Upgrade to Premium to retry songs.');
         } else {
            throw new Error(checkData?.error || 'Retry not allowed by server.');
         }
      }
      // --- End Check Function Call --- 
      
      console.log(`[Action] Generation allowed for retry. Proceeding with retry for song ${songId}`);
      set({ error: null }); // Clear any previous errors shown
      
      // Mark the song as retrying
      const songStore = get();
      songStore.setRetrying(songId, true);
      
      // Call the SongService to retry the song generation
      // This now happens *only* if the check passed (and count was incremented if needed)
      await SongService.retrySongGeneration(songId, userId, babyName);
      
      // The song update will be handled by the subscription handler
      // setRetrying(false) might happen via subscription or should it be here?
      // Keeping it in catch block for now.
      
    } catch (error) {
      console.error('Failed to retry song generation:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to retry song generation';
      setError(errorMessage);
      
      // Clear the retrying state
      const songStore = get();
      songStore.setRetrying(songId, false);
    }
  },

  resetGeneratingState: async () => {
    try {
      set({ isLoading: true, error: null });
      
      const songs = get().songs;
      if (songs.length === 0) {
        console.log('No songs to reset');
        return;
      }
      
      const songsToReset = songs.filter(song => 
        // Only reset songs that are in GENERATING state
        SongStateService.isGenerating(song)
      );
      
      if (songsToReset.length === 0) {
        console.log('No generating songs to reset');
        set({ isLoading: false });
        return;
      }
      
      console.log(`Resetting ${songsToReset.length} songs stuck in generating state`);
      
      // Update each song in the database to clear task_id and mark as retryable
      for (const song of songsToReset) {
        try {
          await SongService.updateSongWithError(
            song.id,
            'Generation timed out - please try again',
            {
              retryable: true,
              clearTaskId: true,
              clearAudioUrl: false
            }
          );
          
          console.log(`Reset generating state for song ${song.id}`);
        } catch (err) {
          console.error(`Failed to reset song ${song.id}:`, err);
        }
      }
      
      // Force refresh songs from the database to get the updated state
      await get().loadSongs();
      
    } catch (error) {
      console.error('Error resetting generating state:', error);
      set({ error: 'Failed to reset generating songs.' });
    } finally {
      set({ isLoading: false });
    }
  }
});