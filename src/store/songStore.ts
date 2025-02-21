import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { useAuthStore } from './authStore';
import { useErrorStore } from './errorStore';
import { createMusicGenerationTask } from '../lib/piapi';
import type { Song, MusicMood, Instrument, Tempo } from '../types';

interface SongState {
  songs: Song[];
  isLoading: boolean;
  generatingSongs: Set<string>;
  presetSongTypes: Set<string>;
  processingTaskIds: Set<string>;
  stagedTaskIds: Set<string>;
  isDeleting: boolean;
  setState: (updater: (state: SongState) => Partial<SongState>) => void;
  clearGeneratingState: (songId: string) => void;
  loadSongs: () => Promise<void>;
  setupSubscription: () => void;
  createSong: (params: {
    name: string;
    mood: MusicMood;
    instrument?: Instrument;
    tempo?: Tempo;
    lyrics?: string;
    hasUserIdeas?: boolean;
  }) => Promise<Song>;
  deleteAllSongs: () => Promise<void>;
}

export const useSongStore = create<SongState>((set, get) => ({
  songs: [],
  isLoading: false,
  generatingSongs: new Set<string>(),
  presetSongTypes: new Set<string>(),
  processingTaskIds: new Set<string>(),
  stagedTaskIds: new Set<string>(),
  error: null,
  isDeleting: false,

  setState: (updater) => set(updater),

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
        async (payload) => {
          const { new: newSong, old: oldSong, eventType } = payload;          
          if (!oldSong?.id || !newSong?.id) {
            return;
          }
          
          if (eventType === 'UPDATE' || eventType === 'INSERT') {
            const presetType = newSong.name.toLowerCase().includes('playtime') ? 'playing'
              : newSong.name.toLowerCase().includes('mealtime') ? 'eating'
              : newSong.name.toLowerCase().includes('bedtime') ? 'sleeping'
              : newSong.name.toLowerCase().includes('potty') ? 'pooping'
              : null;

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
        async (payload) => {
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
          songs?.forEach(song => {
            if (song.audio_url) {
              if (song.name.toLowerCase().includes('playtime')) completedPresetTypes.add('playing');
              if (song.name.toLowerCase().includes('mealtime')) completedPresetTypes.add('eating');
              if (song.name.toLowerCase().includes('bedtime')) completedPresetTypes.add('sleeping');
              if (song.name.toLowerCase().includes('potty')) completedPresetTypes.add('pooping');
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
    instrument, 
    lyrics,
    tempo,
    isInstrumental,
    hasUserIdeas 
  }) => {
    console.log('Creating song:', {
      name,
      mood,
      theme,
      lyrics,
      tempo,
      isInstrumental,
      hasUserIdeas
    });

    let newSong;
    try {
      // Create initial song with staged status
      const user = useAuthStore.getState().user;
      const profile = useAuthStore.getState().profile;
      const errorStore = useErrorStore.getState();
      const currentState = get();

      if (!user || !profile) {
        throw new Error('User must be logged in to create songs');
      }

      if (!profile.babyName) {
        throw new Error('Baby name is required to create songs');
      }

      // Check if this is a preset song type
      const presetType = name.toLowerCase().includes('playtime') ? 'playing'
        : name.toLowerCase().includes('mealtime') ? 'eating'
        : name.toLowerCase().includes('bedtime') ? 'sleeping'
        : name.toLowerCase().includes('potty') ? 'pooping'
        : null;

      // If it's a preset and we're already generating it, don't create a new one
      if (presetType && get().presetSongTypes.has(presetType)) {
        throw new Error(`${presetType} song is already being generated`);
      }
      
      // If it's a preset song, delete any existing ones of the same type
      if (presetType) {
        const existingSongs = get().songs.filter(s => {
          const songType = s.name.toLowerCase().includes('playtime') ? 'playing'
            : s.name.toLowerCase().includes('mealtime') ? 'eating'
            : s.name.toLowerCase().includes('bedtime') ? 'sleeping'
            : s.name.toLowerCase().includes('potty') ? 'pooping'
            : null;
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
          voice_type: voiceType,
          lyrics,
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
      taskId = await createMusicGenerationTask(
        theme,
        mood,
        lyrics, 
        name,
        profile?.ageGroup,
        tempo,
        isInstrumental,
        hasUserIdeas
      );

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
      const presetType = name.toLowerCase().includes('playtime') ? 'playing'
        : name.toLowerCase().includes('mealtime') ? 'eating'
        : name.toLowerCase().includes('bedtime') ? 'sleeping'
        : name.toLowerCase().includes('potty') ? 'pooping'
        : null;

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