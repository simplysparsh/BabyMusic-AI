import React, { useEffect } from 'react';
import { Trash2, Music2 } from 'lucide-react';
import { useSongStore } from '../store/songStore';
import { useAuthStore } from '../store/authStore';
import { useAudioStore } from '../store/audioStore';
import SongItem from './SongItem';
import { SongStateService } from '../services/songStateService';

export default function SongList() {
  const { songs, loadSongs, isLoading, isDeleting, deleteAllSongs, generatingSongs, processingTaskIds } = useSongStore();
  const { user } = useAuthStore();
  const { isPlaying, currentUrl, playAudio } = useAudioStore();
  const [initialLoadComplete, setInitialLoadComplete] = React.useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(false);

  const handleDownload = async (audioUrl: string, title: string) => {
    try {
      const response = await fetch(audioUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${title}.mp3`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Failed to download audio:', error);
    }
  };

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

  const handlePlay = (audioUrl: string, songId: string) => {
    playAudio(audioUrl);
  };
  
  // Only show loading state on initial load, not when refreshing
  if (isLoading && !initialLoadComplete) {
    return (
      <div className="flex justify-center items-center py-16">
        <p className="text-white/60">Loading your songs...</p>
      </div>
    );
  }

  if (songs.length === 0) {
    return (
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
              Create Your First Melody
            </h3>
            <p className="text-white/60 text-lg max-w-md mx-auto leading-relaxed">
              Choose a mood and instrument above to generate a unique song for your little one.
            </p>
          </div>
        </div>
        )}
      </div>
    );
  }

  // Filter out preset songs using proper checks - use SongStateService
  const regularSongs = songs.filter(song => 
    song.song_type !== 'preset' || !song.preset_type
  );

  return (
    <div>
      <div className="flex justify-end mb-6">
        {songs.length > 0 && (
          <div className="relative">
            {!showDeleteConfirm ? (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10
                         text-red-400 hover:bg-red-500/20 transition-all duration-300
                         font-medium"
                disabled={isDeleting}
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete All</span>
              </button>
            ) : (
              <div className="flex items-center gap-3 card p-4 border-red-500/20 bg-black/50">
                <span className="text-white/80">Are you sure?</span>
                <button
                  onClick={handleDeleteAll}
                  className="px-4 py-2 rounded-lg bg-red-500 text-white font-medium
                           hover:bg-red-600 transition-all duration-300 
                           shadow-lg shadow-red-500/25"
                  disabled={isDeleting}
                >
                  {isDeleting ? 'Deleting...' : 'Yes, delete all'}
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 rounded-lg bg-white/10 text-white/80 font-medium
                           hover:bg-white/20 transition-all duration-300
                           border border-white/10"
                  disabled={isDeleting}
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      <div className="space-y-4">
        {regularSongs.map((song) => (
          <SongItem
            key={song.id}
            song={song}
            currentSong={currentUrl}
            isPlaying={isPlaying && currentUrl === song.audio_url}
            generatingSongs={generatingSongs}
            processingTaskIds={processingTaskIds}
            onPlayClick={handlePlay}
            onDownloadClick={handleDownload}
          />
        ))}
      </div>
    </div>
  );
}