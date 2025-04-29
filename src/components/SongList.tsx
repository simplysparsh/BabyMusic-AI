import { useState } from 'react';
import { useEffect } from 'react';
import { Trash2, Music2 } from 'lucide-react';
import { useSongStore } from '../store/songStore';
import { useAuthStore } from '../store/authStore';
import { useAudioStore } from '../store/audioStore';
import SongItem from './SongItem';
import { Song } from '../types'; // Import Song type

type TabType = 'custom' | 'preset'; // Define tab types

export default function SongList() {
  const { songs, loadSongs, isLoading, isDeleting, deleteAllSongs } = useSongStore(); // Removed processingTaskIds as it wasn't used
  const { user } = useAuthStore();
  const { isPlaying, currentUrl, playAudio } = useAudioStore();
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('custom'); // Add state for active tab

  useEffect(() => {
    if (user) {
      console.log('Loading songs for user:', user.id);
      loadSongs().then(() => {
        setInitialLoadComplete(true);
      });
    }
  }, [loadSongs, user]);

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

  // Only show loading state on initial load, not when refreshing
  if (isLoading && !initialLoadComplete) {
    return (
      <div className="flex justify-center items-center py-16">
        <p className="text-white/60">Loading your songs...</p>
      </div>
    );
  }

  // Determine if there are any songs at all (before filtering)
  const hasAnySongs = songs.length > 0;
  // Determine if there are songs for the current tab
  const hasSongsForCurrentTab = filteredSongs.length > 0;

  // Empty state specifically for when *all* songs are loaded but the current tab is empty
  const renderEmptyTabState = () => (
    <div className="text-center py-16 space-y-4">
      <div className="w-20 h-20 mx-auto bg-white/5 rounded-full flex items-center justify-center mb-4">
        <Music2 className="w-10 h-10 text-white/30" />
      </div>
      <h3 className="text-xl font-semibold text-white">
        No {activeTab === 'custom' ? 'custom' : 'preset'} songs yet
      </h3>
      <p className="text-white/60 max-w-sm mx-auto">
        {activeTab === 'custom' 
          ? 'Songs you create yourself will appear here.' 
          : 'Preset songs generated from the section above will appear here.'}
      </p>
    </div>
  );

  // Empty state for when there are *no songs at all* yet
  const renderInitialEmptyState = () => (
     <div className="text-center py-16 space-y-6">
        {isDeleting ? (
          <p className="text-white/60 text-lg animate-pulse">
            Deleting all songs...
          </p>
        ) : (
        <div>
          <div className="w-24 h-24 mx-auto bg-gradient-to-r from-primary/20 to-secondary/20 
                        rounded-full flex items-center justify-center">
            <Music2 className="w-12 h-12 text-primary animate-float" />
          </div>
          <div>
            <h3 className="text-2xl font-semibold text-white mb-2">
              Your Melodies Appear Here
            </h3>
            <p className="text-white/60 text-lg max-w-md mx-auto leading-relaxed">
              Create custom songs or generate presets, and they'll show up in the list below.
            </p>
          </div>
        </div>
        )}
      </div>
  );
  
  // Check if all *filtered* songs have errors
  const allFilteredSongsHaveErrors = hasSongsForCurrentTab && filteredSongs.every(song => !!song.error);

  return (
    <div className="w-full p-4 sm:p-6 card">
      {/* Tab Navigation */}
      <div className="flex items-center gap-2 border-b border-white/10 mb-6">
        <button
          onClick={() => setActiveTab('custom')}
          className={`px-6 py-3 rounded-t-lg text-sm font-medium transition-all duration-300 relative
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
          className={`px-6 py-3 rounded-t-lg text-sm font-medium transition-all duration-300 relative
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
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10
                         text-red-400 hover:bg-red-500/20 transition-all duration-300
                         text-sm font-medium" // Made text slightly smaller
                disabled={isDeleting}
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete All</span>
              </button>
            ) : (
              // Confirmation Box: Adjusted flex, padding, gap, text size
              <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 card p-2.5 border border-red-500/30 bg-black/60 shadow-xl">
                <span className="text-white/90 text-xs sm:text-sm font-medium text-center sm:text-left mb-2 sm:mb-0">Permanently delete all songs?</span>
                <div className="flex gap-2"> {/* Inner div for buttons */}
                  <button
                    onClick={handleDeleteAll}
                    // Yes Button: Adjusted padding, text size
                    className="px-2.5 py-1 rounded-md bg-red-600 text-white text-xs font-semibold
                             hover:bg-red-700 transition-all duration-300 
                             shadow-lg shadow-red-600/30"
                    disabled={isDeleting}
                  >
                    {isDeleting ? 'Deleting...' : 'Yes'}
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    // Cancel Button: Adjusted padding, text size
                    className="px-2.5 py-1 rounded-md bg-white/10 text-white/80 text-xs font-medium
                             hover:bg-white/20 transition-all duration-300
                             border border-white/20"
                    disabled={isDeleting}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
         )}
      </div>

      {/* Conditional Rendering based on song presence */}
      {!hasAnySongs && !isLoading && initialLoadComplete ? (
         renderInitialEmptyState()
       ) : !hasSongsForCurrentTab && !isLoading && initialLoadComplete ? (
         renderEmptyTabState()
       ) : (
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
             {filteredSongs.map(song => (
               <SongItem
                 key={song.id}
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
  );
}