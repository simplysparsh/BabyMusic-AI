// @breadcrumbs
// - src/store/song/actions.ts: Actions for the song store
// - Parent: src/store/songStore.ts
// - Related: src/store/song/types.ts (types)
// - Related: src/lib/supabase.ts (database)

import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../authStore';
import { SongService } from '../../services/songService';
import { SongStateService } from '../../services/songStateService';
import type { Song, PresetType } from '../../types';
import type { SongState, CreateSongParams } from './types';
import { getPresetType as _getPresetType } from '../../utils/presetUtils';
import { mapDatabaseSongToSong } from '../../services/songService';

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

      // Clear any generating songs that don't exist in the database
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

      // Update generating songs based on SongStateService
      const updatedGeneratingSongs = new Set<string>();
      songsData?.forEach(song => {
        if (SongStateService.isGenerating(song as Song)) {
          updatedGeneratingSongs.add(song.id);
        }
      });

      console.log('State reconciliation:', {
        dbSongs: songsData?.length || 0,
        previousGenerating: get().generatingSongs.size,
        newGenerating: updatedGeneratingSongs.size,
        previousTaskIds: get().processingTaskIds.size,
        newTaskIds: newProcessingTaskIds.size
      });
      
      set({ 
        songs: songsData as Song[] || [],
        generatingSongs: updatedGeneratingSongs,
        processingTaskIds: newProcessingTaskIds,
        queuedTaskIds: newQueuedTaskIds
      });
    } catch (error) {
      console.error('Error loading songs:', error);
      set({ error: 'Failed to load your songs.' });
    } finally {
      set({ isLoading: false });
    }
  },

  createSong: async ({ name, mood, theme, userInput, tempo, isInstrumental, voice, songType, preset_type }: CreateSongParams): Promise<Song> => {
    console.log('songStore.createSong called with:', {
      name,
      mood,
      theme,
      userInput: userInput ? `"${userInput}"` : 'not provided',
      songType,
      preset_type,
      isInstrumental,
      voice
    });

    const currentPresetType: PresetType | null = preset_type || null;
    let createdSong: Song | undefined;
    
    try {
      const user = useAuthStore.getState().user;
      const profile = useAuthStore.getState().profile;

      if (!user || !profile) {
        throw new Error('User must be logged in to create songs');
      }

      if (!profile.babyName) {
        throw new Error('Baby name is required to create songs');
      }

      // If this is a preset song, check if one is already generating
      if (currentPresetType && songType === 'preset') {
        console.log('Processing preset song of type:', currentPresetType);
        
        // Find all songs of this preset type
        const existingSongs = get().songs.filter(s => 
          s.song_type === 'preset' && s.preset_type === currentPresetType
        );
        
        console.log(`Found ${existingSongs.length} existing songs for preset type ${currentPresetType}`);
        
        // Check if any are currently generating
        // Use SongStateService for consistent state management
        const isGenerating = existingSongs.some(song => 
          SongStateService.isGenerating(song)
        );
        
        if (isGenerating) {
          console.log(`A song of type ${currentPresetType} is already generating, skipping`);
          throw new Error(`${currentPresetType} song is already being generated`);
        }

        // Instead of deleting, update the existing song if it exists
        if (existingSongs.length > 0) {
          // Get the most recent song for this preset type
          const existingSong = existingSongs.sort((a, b) => {
            const dateA = new Date(a.createdAt || 0);
            const dateB = new Date(b.createdAt || 0);
            return dateB.getTime() - dateA.getTime();
          })[0];

          console.log(`Updating existing song ${existingSong.id} (${existingSong.name}) for preset type ${currentPresetType}`);
          
          try {
            // Create database song format with the correct fields for updates
            const customFields = {
              name: name || existingSong.name,
              theme: theme || existingSong.theme,
              mood: mood || existingSong.mood
            };
            
            // 1. Reset the song state and clear variations using SongService
            const resetSong = await SongService.prepareForRegeneration(existingSong.id, customFields);
            
            // 2. Create database song format with the correct fields for generation
            const dbSongForGeneration = {
              ...resetSong,
              tempo: tempo || (resetSong as any).tempo,
              is_instrumental: isInstrumental !== undefined ? isInstrumental : (resetSong as any).is_instrumental,
              voice_type: voice || (resetSong as any).voice_type,
              user_lyric_input: userInput || (resetSong as any).user_lyric_input
            };
            
            // 3. Start generation
            const taskId = await SongService.startSongGeneration(dbSongForGeneration as any, profile.babyName);
            
            // 4. Update the task ID
            await SongService.updateSongWithTaskId(existingSong.id, taskId);
            
            // 5. Convert to Song format
            const updatedSong = {
              ...mapDatabaseSongToSong(resetSong),
              task_id: taskId
            };
            
            // 6. Update UI state
            set({
              songs: get().songs.map(s => s.id === existingSong.id ? updatedSong : s),
              generatingSongs: new Set([...get().generatingSongs, existingSong.id])
            });
            
            return updatedSong;
          } catch (error) {
            console.error(`Error updating preset song ${existingSong.id}:`, error);
            throw new Error(`Failed to update preset song: ${error}`);
          }
        }
      }

      // Create the song using SongService - add a log to mark this transition clearly
      console.log(`Proceeding to create new song for ${currentPresetType || 'custom theme'}`);
      createdSong = await SongService.createSong({
        userId: user.id,
        name,
        babyName: profile.babyName,
        songParams: {
          theme,
          mood,
          tempo,
          isInstrumental,
          songType,
          voice,
          userInput,
          preset_type: currentPresetType || undefined
        }
      });

      if (!createdSong) {
        throw new Error('Failed to create song record');
      }

      console.log('Song created successfully:', {
        id: createdSong.id,
        name: createdSong.name,
        preset_type: createdSong.preset_type
      });

      // Update UI state
      set({
        songs: [createdSong, ...get().songs],
        generatingSongs: new Set([...get().generatingSongs, createdSong.id])
      });

      return createdSong;
    } catch (error) {
      // Update song with error state if it was created
      if (createdSong?.id) {
        try {
          // First, check if the song still exists in the database
          const { data: songExists, error: checkError } = await supabase
            .from('songs')
            .select('id')
            .eq('id', createdSong!.id)
            .single();
            
          if (checkError || !songExists) {
            console.log(`Song ${createdSong!.id} no longer exists in database, cleaning up UI state only`);
            // Song doesn't exist in DB, just clean up UI state
            set({
              songs: get().songs.filter(song => song.id !== createdSong!.id),
              generatingSongs: new Set([...get().generatingSongs].filter(id => id !== createdSong!.id))
            });
          } else {
            // Song exists, update it with error
            await supabase
              .from('songs')
              .update({ 
                error: 'Failed to start music generation',
                task_id: null // Clear task ID to prevent stuck state
              })
              .eq('id', createdSong!.id);

            set({
              generatingSongs: new Set([...get().generatingSongs].filter(id => id !== createdSong!.id))
            });
          }
        } catch (updateError) {
          console.error('Failed to update song error state:', updateError);
          // Still clean up UI state even if update fails
          set({
            generatingSongs: new Set([...get().generatingSongs].filter(id => id !== createdSong!.id))
          });
        }
      } else if (error instanceof Error && (error.message.includes('timed out') || error.message.includes('timeout'))) {
        // Handle timeout specifically - log but don't show UI message
        console.error('Song creation timed out:', error);
        
        // If this is a preset song, just let the UI return to initial state automatically
        if (songType === 'preset' && currentPresetType) {
          // Clean up any UI state related to this song creation attempt
          set({
            generatingSongs: new Set([...get().generatingSongs].filter(id => 
              !id.includes(`temp-${currentPresetType}`)
            ))
          });
        }
      }

      throw error instanceof Error ? error : new Error('Failed to create song');
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
        generatingSongs: new Set(),
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
    console.log('Resetting all generating state');
    
    try {
      // Get all songs that are currently marked as generating in the UI
      const generatingSongIds = [...get().generatingSongs];
      
      if (generatingSongIds.length > 0) {
        console.log(`Clearing generating state for ${generatingSongIds.length} songs`);
        
        // Update any songs in the database that still have task IDs
        const { data: songsWithTaskIds, error: fetchError } = await supabase
          .from('songs')
          .select('id, task_id')
          .in('id', generatingSongIds)
          .not('task_id', 'is', null);
          
        if (!fetchError && songsWithTaskIds && songsWithTaskIds.length > 0) {
          console.log(`Found ${songsWithTaskIds.length} songs with task IDs in database, clearing them`);
          
          // Update songs to clear task IDs and mark as failed
          const { error: updateError } = await supabase
            .from('songs')
            .update({ 
              task_id: null,
              error: 'Generation was interrupted or failed to complete',
              retryable: true
            })
            .in('id', songsWithTaskIds.map(song => song.id));
            
          if (updateError) {
            console.error('Failed to update songs in database:', updateError);
          }
        }
      }
      
      // Reset all UI state related to generating songs
      set({
        generatingSongs: new Set(),
        processingTaskIds: new Set(),
        queuedTaskIds: new Set()
      });
      
      console.log('Successfully reset generating state');
    } catch (error) {
      console.error('Error resetting generating state:', error);
    }
  }
});