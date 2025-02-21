import { create, StoreApi, UseBoundStore } from 'zustand';
import { supabase } from '../lib/supabase';
import { useAuthStore } from './authStore';
import { useErrorStore } from './errorStore';
import { createMusicGenerationTask } from '../lib/piapi';
import type { Song, MusicMood, ThemeType, Tempo, PresetType } from '../types';
import { getPresetType } from '../utils/presetUtils';
import type { RealtimePostgresChangesPayload } from '@supabase/supabase-js';

// Types
type StateUpdater = (state: SongState) => Partial<SongState>;
type SongStore = UseBoundStore<StoreApi<SongState>>;

interface SongState {
  songs: Song[];
  isLoading: boolean;
  generatingSongs: Set<string>;
  presetSongTypes: Set<PresetType>;
  processingTaskIds: Set<string>;
  stagedTaskIds: Set<string>;
  isDeleting: boolean;
  error: string | null;
  setState: (updater: StateUpdater) => void;
  clearGeneratingState: (songId: string) => void;
  loadSongs: () => Promise<void>;
  setupSubscription: () => void;
  createSong: (params: {
    name: string;
    mood: MusicMood;
    theme?: ThemeType;
    tempo?: Tempo;
    lyrics?: string;
    hasUserIdeas?: boolean;
  }) => Promise<Song>;
  deleteAllSongs: () => Promise<void>;
}

export const useSongStore = create<SongState>((
  set: (partial: Partial<SongState> | ((state: SongState) => Partial<SongState>)) => void,
  get: () => SongState
) => ({
  songs: [],
  isLoading: false,
  generatingSongs: new Set<string>(),
  presetSongTypes: new Set<PresetType>(),
  processingTaskIds: new Set<string>(),
  stagedTaskIds: new Set<string>(),
  error: null,
  isDeleting: false,

  setState: (updater: StateUpdater) => set(updater),

  clearGeneratingState: (songId: string) => {
    set(state => {
      const newGenerating = new Set(state.generatingSongs);
      newGenerating.delete(songId);
      return { generatingSongs: newGenerating };
    });
  },

  setupSubscription: () => {
    const user = useAuthStore.getState().user;
    if (!user) return;
    let presetSongsProcessing = new Set<string>();

    supabase.getChannels().forEach(channel => channel.unsubscribe());
    
    // Subscribe to both songs and variations changes
    const songsSubscription = supabase
      .channel('songs-channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'songs',
          filter: `user_id=eq.${user.id}`,
        },
        async (payload: RealtimePostgresChangesPayload<Song>) => {
          const { new: newSong, old: oldSong, eventType } = payload;          
          if (!oldSong?.id || !newSong?.id) {
            return;
          }
          
          if (eventType === 'UPDATE' || eventType === 'INSERT') {
            const presetType = getPresetType(newSong.name);

            // Track preset songs being processed
            if (presetType && !presetSongsProcessing.has(newSong.id)) {
              presetSongsProcessing.add(newSong.id);
              set(state => ({
                presetSongTypes: new Set([...state.presetSongTypes, presetType])
              }));
            }

            // Handle error state
            if (newSong.error) {
              
              // Clear preset type if applicable
              if (presetType) {
                set(state => {
                  presetSongsProcessing.delete(newSong.id);
                  const newPresetTypes = new Set(state.presetSongTypes);
                  newPresetTypes.delete(presetType);
                  return { presetSongTypes: newPresetTypes };
                });
              }
            }
            
            // Handle successful completion
            if (newSong.audio_url) {
              
              // Clear preset type if applicable
              if (presetType) {
                set(state => {
                  presetSongsProcessing.delete(newSong.id);
                  const newPresetTypes = new Set(state.presetSongTypes);
                  newPresetTypes.delete(presetType);
                  return { 
                    presetSongTypes: newPresetTypes,
                    error: null
                  };
                });
              }
            }

            // Track task_id for processing state
            if (newSong.task_id && !get().processingTaskIds.has(newSong.task_id)) {
              set(state => ({
                processingTaskIds: new Set(state.processingTaskIds).add(newSong.task_id)
              }));
            }

            // Handle staged tasks
            if (newSong.status === 'staged' && !get().stagedTaskIds.has(newSong.task_id)) {
              set(state => ({
                stagedTaskIds: new Set(state.stagedTaskIds).add(newSong.task_id)
              }));
            }

            // Fetch the complete song with variations
            const { data: updatedSong } = await supabase
              .from('songs')
              .select('*, variations:song_variations(*)')
              .eq('id', oldSong.id)
              .single();
            
            if (!updatedSong) {
              return;
            }

            // Clear generating state when we have audio URL or an error
            if (updatedSong.audio_url || updatedSong.error || 
                updatedSong.status === 'failed') {
              get().clearGeneratingState(updatedSong.id);
            }

            
            set((state) => ({
              songs: state.songs.map((song) =>
                song.id === oldSong.id ? updatedSong : song
              ),
              error: updatedSong.error || null
            }));
          }
        }
      )
      .subscribe();
      
    const variationsSubscription = supabase
      .channel('variations-channel')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public', 
          table: 'song_variations'
        },
        async (payload: RealtimePostgresChangesPayload<any>) => {
          const variation = payload.new;
          if (!variation?.song_id) {
            return;
          }
          
          // Reload the entire song to get updated variations
          const { data: updatedSong } = await supabase
            .from('songs')
            .select('*, variations:song_variations(*)')
            .eq('id', variation.song_id)
            .single();
            
          if (!updatedSong) {
            return;
          }

            set((state) => ({
              songs: state.songs.map((song) => {
                if (song.id === variation.song_id) {
                  return updatedSong;
                }
                return song;
              }),
            }));
        }
      )
      .subscribe();

    // Clean up subscription when user changes
    return () => {
      songsSubscription.unsubscribe();
      variationsSubscription.unsubscribe();
    };
  },

  loadSongs: async () => {
    set({ 
      isLoading: true, 
      error: null
    });

    try {
      const user = useAuthStore.getState().user;
      if (!user?.id) {
        set({ 
          songs: [],
          presetSongTypes: new Set()
        });
        return;
      }

      let retryCount = 0;
      const MAX_RETRIES = 3;
      const RETRY_DELAY = 1000;
      
      while (retryCount < MAX_RETRIES) {
        try {
          const { data: songs, error } = await supabase
            .from('songs')
            .select(`
              *,
              variations:song_variations(
                id,
                audio_url,
                title,
                metadata,
                created_at
              )
            `)
            .order('created_at', { ascending: false });

          if (error) throw error;

          // Update songs and clear preset types for completed songs
          const completedPresetTypes = new Set<string>();
          songs?.forEach((song: Song) => {
            const presetType = getPresetType(song.name);
            if (song.audio_url && presetType) {
              completedPresetTypes.add(presetType);
            }
          });

          set(state => ({
            songs: songs as Song[],
            presetSongTypes: new Set(
              Array.from(state.presetSongTypes)
                .filter(type => !completedPresetTypes.has(type))
            )
          }));
          break;
        } catch (error) {
          retryCount++;

          if (retryCount === MAX_RETRIES) {
            throw error;
          }
          
          await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * retryCount));
        }
      }
      
      // Set up real-time subscription after loading songs
      get().setupSubscription();
    } catch (error) {
      set({ 
        error: 'Unable to load songs. Please refresh the page or try signing in again.',
        songs: [],
        presetSongTypes: new Set()
      });
    } finally {
      set({ isLoading: false });
    }
  },

  createSong: async ({ 
    name, 
    mood, 
    theme, 
    lyrics,
    tempo,
    isInstrumental,
    hasUserIdeas 
  }: {
    name: string;
    mood: MusicMood;
    theme?: ThemeType;
    lyrics?: string;
    tempo?: Tempo;
    isInstrumental?: boolean;
    hasUserIdeas?: boolean;
  }) => {
    console.log('songStore.createSong called with:', {
      name,
      mood,
      theme,
      lyrics,
      tempo,
      isInstrumental,
      hasUserIdeas
    });

    let newSong: Song | undefined;
    try {
      const user = useAuthStore.getState().user;
      const profile = useAuthStore.getState().profile;
      const errorStore = useErrorStore.getState();

      if (!user || !profile) {
        throw new Error('User must be logged in to create songs');
      }

      if (!profile.babyName) {
        throw new Error('Baby name is required to create songs');
      }

      // Determine if this is a preset song
      const presetType = getPresetType(name);
      const isPreset = !!presetType;

      // If it's a preset and we're already generating it, don't create a new one
      if (presetType && get().presetSongTypes.has(presetType)) {
        throw new Error(`${presetType} song is already being generated`);
      }
      
      // If it's a preset song, delete any existing ones of the same type
      if (presetType) {
        const existingSongs = get().songs.filter(s => {
          const songType = getPresetType(s.name);
          return songType === presetType;
        });

        if (existingSongs.length > 0) {
          try {
            const { error: deleteError } = await supabase
              .from('songs')
              .delete()
              .in('id', existingSongs.map(s => s.id));

            if (deleteError) throw deleteError;

            // Update local state to remove deleted songs
            set(state => ({
              songs: state.songs.filter(s => !existingSongs.find(es => es.id === s.id))
            }));
          } catch (error) {
            throw error;
          }
        }
      }

      // Track preset type if applicable
      if (presetType) {
        set(state => ({
          presetSongTypes: new Set([...state.presetSongTypes, presetType])
        }));
      }

      // Create the initial song record immediately
      const { data, error: insertError } = await supabase
        .from('songs')
        .insert([{
          name,
          mood,
          theme,
          lyrics,
          tempo,
          is_instrumental: isInstrumental,
          has_user_ideas: hasUserIdeas,
          user_lyric_input: lyrics,
          user_id: user.id,
          audio_url: null,
          status: 'staged'
        }])
        .select()
        .single();

      if (insertError) throw insertError;
      newSong = data;

      // Update UI state immediately
      set(state => ({
        songs: [newSong, ...state.songs]
      }));

      // Update generating state
      set(state => {
        const newGenerating = new Set(state.generatingSongs);
        newGenerating.add(newSong.id);
        return { generatingSongs: newGenerating };
      });

      let taskId: string;
      
      // Start the music generation task asynchronously
      const params = {
        theme,
        mood,
        lyrics, 
        name,
        ageGroup: profile?.ageGroup,
        tempo,
        isInstrumental,
        hasUserIdeas,
        voice: newSong.voice_type,
        is_preset: isPreset,
        preset_type: presetType || undefined
      };

      console.log('Calling createMusicGenerationTask with:', {
        ...params,
        lyrics: lyrics ? 'provided' : 'not provided'
      });
      
      taskId = await createMusicGenerationTask(params);

      // Update the song with the task ID
      const { error: updateError } = await supabase
        .from('songs')
        .update({ task_id: taskId })
        .eq('id', newSong.id);

      if (updateError) {
        throw updateError;
      }

      // Add task to processing set
      set(state => ({
        processingTaskIds: new Set([...state.processingTaskIds, taskId])
      }));
      
      return newSong as Song;
    } catch (error) {
      
      // Clear preset type and generating state
      const presetType = getPresetType(name);

      if (presetType) {
        set(state => ({
          presetSongTypes: new Set([...state.presetSongTypes].filter(t => t !== presetType))
        }));
      }

      // Update song with error state if it was created
      if (newSong?.id) {
        await supabase
          .from('songs')
          .update({ error: 'Failed to start music generation' })
          .eq('id', newSong.id);

        set(state => ({
          generatingSongs: new Set([...state.generatingSongs].filter(id => id !== newSong.id))
        }));
      }

      throw error instanceof Error 
        ? error 
        : new Error('Failed to create song');
    }
  },

  deleteAllSongs: async () => {
    try {
      set({ isDeleting: true, error: null });
      const { user } = useAuthStore.getState();
      
      if (!user) {
        throw new Error('User must be logged in to delete songs');
      }

      // With cascade delete, this will automatically delete associated variations
      const { error } = await supabase
        .from('songs')
        .delete()
        .eq('user_id', user.id);

      if (error) throw error;
      set({ songs: [] });
    } catch (error) {
      const errorStore = useErrorStore.getState();
      errorStore.setError(error instanceof Error ? error.message : 'Failed to delete songs');
      throw error;
    } finally {
      set({ isDeleting: false });
    }
  },
}));