// @breadcrumbs
// - src/store/song/actions.ts: Actions for the song store
// - Parent: src/store/songStore.ts
// - Related: src/store/song/types.ts (types)
// - Related: src/lib/supabase.ts (database)

import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../authStore';
import { SongService } from '../../services/songService';
import { SongStateService } from '../../services/songStateService';
import type { Song } from '../../types';
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
      
      set({ 
        songs: songsData as Song[] || [],
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

    let tempSongId = `temp_${crypto.randomUUID()}`; // Temporary ID for optimistic update

    try {
      const user = useAuthStore.getState().user;
      const profile = useAuthStore.getState().profile;
      const { clearError } = useErrorStore.getState();
      clearError(); // Clear previous errors

      if (!user || !profile) {
        throw new Error('User must be logged in');
      }
      if (!profile.babyName) {
        throw new Error('Baby name is required');
      }

      // Optimistic UI Update: Add a placeholder song
      // Note: Details like task_id will be updated later by subscription or function response
      const optimisticSong: Partial<Song> & { id: string } = {
        id: tempSongId,
        name: name,
        mood: mood,
        theme: theme,
        voice: voice,
        audio_url: undefined,
        createdAt: new Date(), // Use current date
        userId: user.id,
        retryable: false,
        variations: [],
        error: undefined,
        task_id: undefined, // Will be set later
        song_type: songType,
        preset_type: preset_type,
        // Mark as temporary/optimistic if needed
      };
      
      // Add optimistic song to state immediately (Simplified set call)
      const currentSongs = get().songs;
      set({ songs: [optimisticSong as Song, ...currentSongs] });
      console.log(`[Action] Optimistically added temp song ${tempSongId}`);

      // Prepare payload for the Edge Function
      const functionPayload = {
        name: name,
        babyName: profile.babyName,
        theme: theme,
        mood: mood,
        userInput: userInput,
        tempo: tempo,
        isInstrumental: isInstrumental,
        voice: voice,
        songType: songType,
        preset_type: preset_type,
        ageGroup: profile.ageGroup, // Pass from profile
        gender: profile.gender,     // Pass from profile
      };

      console.log(`[Action] Invoking initiate-song-creation function...`);
      const { data: functionData, error: functionError } = await supabase.functions.invoke(
        'initiate-song-creation',
        { body: functionPayload }
      );

      if (functionError) {
        console.error('[Action] Edge function invocation error:', functionError);
        throw new Error(functionError.message); // Throw error to be caught below
      }

      // Handle potential errors returned IN the function data
      if (functionData && functionData.error) {
        console.error('[Action] Edge function returned error:', functionData.error);
        throw new Error(functionData.error); 
      }
      
      if (!functionData || !functionData.id || !functionData.task_id) {
        console.error('[Action] Edge function returned invalid data:', functionData);
        throw new Error('Failed to initiate song creation: Invalid response from server.');
      }

      console.log(`[Action] initiate-song-creation successful:`, functionData);

      // Update the optimistic song with real data (Simplified set call)
      const updatedSongs = get().songs.map(s => 
        s.id === tempSongId ? { ...s, ...functionData, id: functionData.id } : s
      );
      set({ songs: updatedSongs });
      console.log(`[Action] Updated song ${functionData.id} with data from function`);

      // Return the created song data (or a mapped version if necessary)
      // Assuming functionData directly matches the needed Song structure for now
      return functionData as Song;

    } catch (error) {
      console.error('[Action] Error in createSong action:', error);
      const message = error instanceof Error ? error.message : 'Failed to create song';
      useErrorStore.getState().setError(message); // Set global error
      
      // Remove the optimistic song entry on failure (Simplified set call)
      const songsWithoutOptimistic = get().songs.filter(s => s.id !== tempSongId);
      set({ songs: songsWithoutOptimistic });
      console.log(`[Action] Removed optimistic temp song ${tempSongId} due to error`);
      
      // Re-throw error so the calling component knows it failed
      throw error;
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
    const { user } = useAuthStore.getState();
    
    if (!user) {
      console.error('User not authenticated');
      return;
    }
    
    const userId = user.id;
    const profile = useAuthStore.getState().profile;
    const babyName = profile?.babyName || 'Baby';
    
    try {
      set({ error: null });
      
      // Mark the song as retrying
      const songStore = get();
      songStore.setRetrying(songId, true);
      
      // Call the SongService to retry the song generation
      await SongService.retrySongGeneration(songId, userId, babyName);
      
      // The song update will be handled by the subscription handler
    } catch (error) {
      console.error('Failed to retry song generation:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to retry song generation';
      set({ error: errorMessage });
      
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