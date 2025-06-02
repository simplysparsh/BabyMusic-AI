import { useState, useEffect } from 'react';
import { Trash2, Music2, Sparkles } from 'lucide-react';
import { useSongStore } from '../store/songStore';
import { useAuthStore } from '../store/authStore';
import { useAudioStore } from '../store/audioStore';
import SongItem from './SongItem';

type TabType = 'custom' | 'preset'; // Define tab types

export default function SongList() {
  // Destructure using selectors
  const songs = useSongStore(state => state.songs);
  const loadSongs = useSongStore(state => state.loadSongs);
  const isLoading = useSongStore(state => state.isLoading);
  const isDeleting = useSongStore(state => state.isDeleting);
  const deleteAllSongs = useSongStore(state => state.deleteAllSongs);
  
  const { user, profile } = useAuthStore((state) => ({ 
    user: state.user, 
    profile: state.profile 
  }));
  const isPremium = profile?.isPremium ?? false;
  const { isPlaying, currentUrl, playAudio } = useAudioStore();
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('custom'); // Add state for active tab

  useEffect(() => {
    console.log('🔍 [SongList] useEffect triggered:', { 
      userId: user?.id, 
      hasUser: !!user,
      hasLoadSongs: !!loadSongs,
      timestamp: new Date().toISOString() 
    });
    
    if (user) {
      console.log('📦 [SongList] Calling loadSongs() for user:', user.id);
      // Ensure loadSongs is defined before calling
      if (loadSongs) { 
        loadSongs().then(() => {
          setInitialLoadComplete(true);
        });
      } else {
        // Add logging if function is missing (shouldn't happen now)
        console.error('loadSongs function not available in songStore!');
      }
    }
  }, [loadSongs, user?.id]); // Correct dependency array

  const handleDeleteAll = async () => {
    try {
      await deleteAllSongs();
      setShowDeleteConfirm(false);
    } catch (error) {
      console.error('Failed to delete songs:', error);
    }
  };

  const handlePlay = (audioUrl: string, _songId: string) => {
    playAudio(audioUrl);
  };

  // Filter songs based on active tab
  const filteredSongs = songs.filter(song => {
    if (activeTab === 'custom') {
      // Custom songs are those not explicitly marked as 'preset'
      return song.song_type !== 'preset';
    } else {
      // Preset songs are those explicitly marked as 'preset'
      return song.song_type === 'preset';
    }
  });

  // Sort filtered songs: Favorites first, then by creation date
  const sortedSongs = [...filteredSongs].sort((a, b) => {
    const aIsFav = a.isFavorite ?? false;
    const bIsFav = b.isFavorite ?? false;

    // If favorite statuses differ, sort by favorite (true comes first)
    if (aIsFav !== bIsFav) {
      return aIsFav ? -1 : 1;
    }

    // If favorite statuses are the same, sort by creation date (newest first)
    const dateA = a.createdAt?.getTime() || 0;
    const dateB = b.createdAt?.getTime() || 0;
    return dateB - dateA;
  });

  // Determine if there are any songs at all (before filtering)
  const hasAnySongs = songs.length > 0;
  // Determine if there are songs for the current tab (use sorted list length)
  const hasSongsForCurrentTab = sortedSongs.length > 0;
  // Check if all *sorted* songs have errors
  const allFilteredSongsHaveErrors = hasSongsForCurrentTab && sortedSongs.every(song => !!song.error);

  // Loading state
  if (isLoading && !initialLoadComplete) {
    return (
      <div className="w-full p-4 sm:p-6 card">
        <div className="flex justify-center items-center py-16">
          <p className="text-white/60">Loading your songs...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="w-full p-4 sm:p-6 card">
        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-white/10 mb-6">
          <button
            onClick={() => setActiveTab('custom')}
            className={`px-4 sm:px-6 py-3 rounded-t-lg text-sm font-medium transition-all duration-300 relative
                     ${activeTab === 'custom' 
                       ? 'text-white bg-white/10' 
                       : 'text-white/60 hover:text-white hover:bg-white/5'}`}
          >
            Custom
            {activeTab === 'custom' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary to-secondary"></div>
            )}
          </button>
          <button
            onClick={() => setActiveTab('preset')}
            className={`px-4 sm:px-6 py-3 rounded-t-lg text-sm font-medium transition-all duration-300 relative
                     ${activeTab === 'preset' 
                       ? 'text-white bg-white/10' 
                       : 'text-white/60 hover:text-white hover:bg-white/5'}`}
          >
            Preset
            {activeTab === 'preset' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary to-secondary"></div>
            )}
          </button>
           {/* Spacer to push Delete button to the right */}
           <div className="flex-grow"></div>
           {/* Delete All Button - Show only if there are *any* songs */}
           {hasAnySongs && (
             <div className="relative py-2"> {/* Adjusted padding to align better with tabs */}
              {!showDeleteConfirm ? (
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="flex items-center whitespace-nowrap gap-1.5 px-3.5 py-2 rounded-xl bg-red-500/10
                           text-red-400 hover:bg-red-500/20 transition-all duration-300
                           text-sm font-medium" // Made text slightly smaller
                  disabled={isDeleting}
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete All</span>
                </button>
              ) : (
                // Confirmation Box: Updated for better mobile display
                <div className="absolute right-0 top-full mt-2 z-50 max-w-xs w-64">
                  <div className="rounded-xl overflow-hidden bg-black/95 shadow-xl border border-red-500/30">
                    <div className="p-4 text-center">
                      <span className="text-white text-sm font-medium block">
                        Permanently delete all songs?
                      </span>
                      
                      <div className="flex gap-3 mt-4 justify-center">
                        <button
                          onClick={handleDeleteAll}
                          className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-medium
                                   hover:bg-red-700 transition-all duration-300 
                                   shadow-md"
                          disabled={isDeleting}
                        >
                          {isDeleting ? 'Deleting...' : 'Yes'}
                        </button>
                        <button
                          onClick={() => setShowDeleteConfirm(false)}
                          className="px-4 py-2 rounded-lg bg-gray-600/50 text-white text-sm font-medium
                                   hover:bg-gray-600/70 transition-all duration-300"
                          disabled={isDeleting}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
           )}
        </div>

        {/* Content Area */}
        {!hasSongsForCurrentTab ? (
          // Empty State - Single consistent design for any empty situation
          <div className="text-center py-12 space-y-6">
            {isDeleting ? (
              <p className="text-white/60 text-lg animate-pulse">
                Deleting all songs...
              </p>
            ) : (
              <div className="max-w-lg mx-auto">
                <div className="w-20 h-20 mx-auto bg-[#3e3a48] rounded-full flex items-center justify-center mb-5">
                  <Music2 className="w-10 h-10 text-pink-300" />
                </div>
                <div className="space-y-3">
                  <h3 className="text-2xl font-semibold text-white">
                    Create Your First Melody
                  </h3>
                  <p className="text-white/70 text-base max-w-md mx-auto leading-relaxed">
                    Create a themed song or customize your own melody with the perfect mood, tempo, and voice for your little one.
                  </p>
                </div>
              </div>
            )}
          </div>
        ) : (
          // Song List
          <>
            {allFilteredSongsHaveErrors && (
              <div className="mb-6 p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                <p className="text-yellow-300 text-sm">
                  All songs in this tab encountered generation issues. This could be due to high server load or temporary service disruptions. 
                  Please try retrying your songs or creating new ones.
                </p>
              </div>
            )}
            
            <div className="space-y-4">
              {sortedSongs.map((song, index) => (
                <SongItem
                  key={`${song.id}-${index}`}
                  song={song}
                  currentSong={currentUrl}
                  isPlaying={isPlaying}
                  onPlayClick={handlePlay}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Consolidated Premium Hint Banner (Restyled Consistently) */}
      {user && !isPremium && hasAnySongs && (
        // Applied consistent styling from ThemeSelector hint
        <div className="mt-6 p-3 rounded-lg bg-gradient-to-r from-primary/10 to-secondary/10 text-center border border-primary/20 shadow-inner px-4">
          <a 
            href="/premium" 
            className="group inline-flex items-center justify-center gap-2"
          >
             {/* Changed icon to Sparkles */}
            <Sparkles className="w-4 h-4 text-primary/80 group-hover:text-primary transition-colors duration-300 flex-shrink-0" />
            <span className="text-sm text-white/70 group-hover:text-white transition-colors">
              Unlock unlimited plays, downloads, favorites & all themes with <strong className="font-semibold text-primary underline group-hover:text-secondary transition-colors">Premium!</strong>
            </span>
          </a>
        </div>
      )}
    </>
  );
}