import React, { useEffect } from 'react';
import { Play, Pause, Download, Share2, ChevronDown, Trash2, Music2 } from 'lucide-react';
import { useSongStore } from '../store/songStore';
import { useAuthStore } from '../store/authStore';
import type { Song } from '../types';

export default function SongList() {
  const { songs, loadSongs, isLoading, isDeleting, deleteAllSongs, generatingSongs, processingTaskIds } = useSongStore();
  const { user } = useAuthStore();
  const [initialLoadComplete, setInitialLoadComplete] = React.useState(false);
  const [currentSong, setCurrentSong] = React.useState<string | null>(null);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [showPresetSongs, setShowPresetSongs] = React.useState(false);
  const [expandedSong, setExpandedSong] = React.useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(false);
  const audioRef = React.useRef<HTMLAudioElement | null>(null);

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
    if (!audioUrl) return;
    
    if (!audioRef.current) {
      audioRef.current = new Audio(audioUrl);
      audioRef.current.addEventListener('ended', () => setIsPlaying(false));
    }

    if (currentSong !== audioUrl) {
      audioRef.current.src = audioUrl;
      setCurrentSong(audioUrl);
    }

    if (isPlaying && currentSong === audioUrl) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const toggleExpand = (songId: string) => {
    setExpandedSong(expandedSong === songId ? null : songId);
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

  // Filter out preset songs
  const regularSongs = songs.filter(song => !song.name.toLowerCase().includes('playtime') &&
    !song.name.toLowerCase().includes('mealtime') &&
    !song.name.toLowerCase().includes('bedtime') &&
    !song.name.toLowerCase().includes('potty'));

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Your Melodies</h2>
        {songs.length > 0 && (
          <div className="relative">
            {!showDeleteConfirm ? (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-red-500/10
                         text-red-400 hover:bg-red-500/20 transition-all duration-300"
                disabled={isDeleting}
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete All</span>
              </button>
            ) : (
              <div className="flex items-center space-x-3 card p-4 border-red-500/20">
                <span className="text-white/80">Are you sure?</span>
                <button
                  onClick={handleDeleteAll}
                  className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600
                           transition-all duration-300 shadow-lg shadow-red-500/25"
                  disabled={isDeleting}
                >
                  {isDeleting ? 'Deleting...' : 'Yes, delete all'}
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 rounded-lg bg-white/10 text-white/80
                           hover:bg-white/20 transition-all duration-300"
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
        <div
          key={song.id}
          className="card p-6 group hover:bg-white/[0.09] transition-all duration-500 mb-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-white font-medium text-lg">{song.name}</h3>
              <p className="text-sm text-baby-cream/60">
                {`${song.mood} • ${song.instrument}`}
              </p>
            </div>
            <div className="flex items-center space-x-3">
              {song.variations && song.variations.length > 0 && (
                <button
                  onClick={() => toggleExpand(song.id)}
                  className="text-white/60 hover:text-primary transition-all duration-300"
                >
                  <ChevronDown
                    className={`w-5 h-5 transform transition-transform ${
                      expandedSong === song.id ? 'rotate-180' : ''
                    }`}
                  />
                </button>
              )}
              <button
                onClick={() => handlePlay(song.audio_url!, song.id)}
                disabled={!song.audio_url}
                className="text-white/60 hover:text-primary disabled:opacity-50
                         transition-all duration-300 group"
              >
                {isPlaying && currentSong === song.audio_url ? (
                  <Pause className="w-5 h-5" />
                ) : (
                  <Play className="w-5 h-5 group-hover:scale-110 transition-transform" />
                )}
              </button>
              <button
                disabled={!song.audio_url}
                onClick={() => handleDownload(song.audio_url!, song.name)}
                className="text-white/60 hover:text-accent disabled:opacity-50
                         transition-all duration-300 group"
              >
                <Download className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </button>
              <button
                disabled={!song.audio_url}
                className="text-white/60 hover:text-secondary disabled:opacity-50
                         transition-all duration-300 group"
              >
                <Share2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </button>
            </div>
          </div>
          {expandedSong === song.id && song.variations && (
            <div className="mt-6 space-y-3 pl-6 border-l-2 border-primary/20">
              {song.variations.map((variation, index) => (
                <div
                  key={variation.id}
                  className="flex items-center justify-between py-3 px-4 bg-white/[0.05]
                           rounded-xl backdrop-blur-sm group/variation hover:bg-white/[0.08]
                           transition-all duration-300"
                >
                  <span className="text-white/80">
                    Variation {index + 1}
                  </span>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handlePlay(variation.audioUrl, song.id)}
                      className="text-white/60 hover:text-primary transition-all duration-300"
                    >
                      {isPlaying && currentSong === variation.audioUrl ? (
                        <Pause className="w-4 h-4" />
                      ) : (
                        <Play className="w-4 h-4 group-hover/variation:scale-110 transition-transform" />
                      )}
                    </button>
                    <button 
                      onClick={() => handleDownload(variation.audio_url, `${song.name} - Variation ${index + 1}`)}
                      className="text-white/60 hover:text-accent transition-all duration-300"
                    >
                      <Download className="w-4 h-4 group-hover/variation:scale-110 transition-transform" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
          {!song.audio_url && (
            <div className="mt-2">
              <div className="h-1 bg-primary/20 rounded-full overflow-hidden">
                <div className={`h-full bg-primary animate-pulse ${
                  song.error && !generatingSongs.has(song.id) && !processingTaskIds.has(song.task_id) 
                  ? 'bg-red-400 !animate-none' 
                  : ''
                }`}></div>
              </div>
              <p className={`text-xs mt-1 text-baby-cream/60 ${
                song.error && !generatingSongs.has(song.id) && !processingTaskIds.has(song.task_id) 
                ? '!text-red-400' 
                : ''
              }`}>
                {(() => {
                  if (generatingSongs.has(song.id) || processingTaskIds.has(song.task_id)) {
                    return generatingSongs.has(song.id) ? 'Generating...' : 'Processing...';
                  }
                  return song.error || 'Processing...';
                })()}
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
    </div>
  );
}