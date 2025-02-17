import React, { useState } from 'react';
import { Wand2, Play, Download, Share2, Loader2, Clock, Sparkles, RefreshCw } from 'lucide-react';
import type { MusicMood, Instrument } from '../types';
import { useSongStore } from '../store/songStore';
import { useAuthStore } from '../store/authStore';

const GENERATION_TIME = 240; // 4 minutes in seconds

const MUSIC_FACTS = [
  {
    fact: "Complex melodies boost cognitive development in infants by 23%",
    source: "https://www.musictherapy.org/assets/1/7/MT_Young_Children_2006.pdf"
  },
  {
    fact: "Classical music enhances spatial-temporal skills in toddlers by up to 35%",
    source: "https://www.pbs.org/parents/thrive/the-benefits-of-music-education"
  },
  {
    fact: "Musical training improves memory capacity by 20% in early childhood",
    source: "https://nafme.org/20-important-benefits-of-music-in-our-schools/"
  },
  {
    fact: "Daily music exposure accelerates language development by 6 months",
    source: "https://www.kindermusik.com/mindsonmusic/kids-music/how-music-helps-your-childs-brain-grow"
  },
  {
    fact: "Music therapy reduces stress hormones in young children by 37%",
    source: "https://suzukiassociation.org/news/music-kids-stress/"
  },
  {
    fact: "Early music exposure increases brain plasticity by 28%",
    source: "https://www.childrensmusic.org/benefits-of-music-education"
  }
];

export default function MusicGenerator() {
  const [mood, setMood] = useState<MusicMood>('calm');
  const [instrument, setInstrument] = useState<Instrument>('piano');
  const [timeLeft, setTimeLeft] = useState(GENERATION_TIME);
  const [currentFact, setCurrentFact] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const { createSong, generatingSongs } = useSongStore();
  const { songs, presetSongTypes } = useSongStore();
  const { user } = useAuthStore();

  const [currentSong, setCurrentSong] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = React.useRef<HTMLAudioElement | null>(null);
  const isGenerating = generatingSongs.size > 0 || presetSongTypes.size > 0;

  React.useEffect(() => {
    let timer: number;
    let factTimer: number;

    if (isGenerating) {
      timer = window.setInterval(() => {
        setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);

      factTimer = window.setInterval(() => {
        setCurrentFact((prev) => (prev + 1) % MUSIC_FACTS.length);
      }, 8000);
    } else {
      setTimeLeft(GENERATION_TIME);
    }

    return () => {
      clearInterval(timer);
      clearInterval(factTimer);
      setTimeLeft(GENERATION_TIME);
    };
  }, [isGenerating]);

  const handleGenerate = async () => {
    if (!user) {
      setError('Please sign in to generate music');
      return;
    }

    setError(null);

    try {
      await createSong({
        name: `${mood} ${instrument} melody`,
        mood,
        instrument,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate music');
    }
  };
  
  const handlePlay = (audioUrl: string | null) => {
    if (!audioUrl) return;
    
    if (!audioRef.current) {
      audioRef.current = new Audio(audioUrl);
      audioRef.current.addEventListener('ended', () => setIsPlaying(false));
    }

    if (currentSong !== audioUrl) {
      audioRef.current.src = audioUrl;
      setCurrentSong(audioUrl);
    }

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleDownload = async (audioUrl: string | null, title: string) => {
    if (!audioUrl) return;
    
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

  return (
    <div className="w-full max-w-2xl mx-auto p-4 sm:p-8 card relative z-10">
      <div className="space-y-6">
        <div className="space-y-6">
          <div>
            <label className="block text-lg font-medium text-white/90 mb-4">
              Music Mood
            </label>
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              {['calm', 'playful', 'learning', 'energetic'].map((m) => (
                <button
                  key={m}
                  onClick={() => setMood(m as MusicMood)}
                  className={`min-h-[40px] px-4 py-2.5 sm:px-5 sm:py-3 rounded-full text-sm sm:text-base font-medium transition-all duration-300 ${
                    mood === m
                      ? 'bg-gradient-to-r from-primary to-secondary text-black shadow-lg shadow-primary/25 ring-2 ring-primary/50 ring-offset-2 ring-offset-background-dark border-0'
                      : 'bg-white/[0.07] text-white hover:bg-white/[0.1] hover:text-white backdrop-blur-sm border border-white/10'
                  }`}
                >
                  {m.charAt(0).toUpperCase() + m.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-lg font-medium text-white/90 mb-4">
              Instrument
            </label>
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              {['piano', 'harp', 'strings', 'whiteNoise'].map((i) => (
                <button
                  key={i}
                  onClick={() => setInstrument(i as Instrument)}
                  className={`min-h-[40px] px-4 py-2.5 sm:px-5 sm:py-3 rounded-full text-sm sm:text-base font-medium transition-all duration-300 ${
                    instrument === i
                      ? 'bg-gradient-to-r from-accent to-secondary text-black shadow-lg shadow-accent/25 ring-2 ring-accent/50 ring-offset-2 ring-offset-background-dark border-0'
                      : 'bg-white/[0.07] text-white hover:bg-white/[0.1] hover:text-white backdrop-blur-sm border border-white/10'
                  }`}
                >
                  {i.charAt(0).toUpperCase() + i.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-center pt-4">
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="flex items-center space-x-3 min-h-[48px] bg-gradient-to-r from-primary to-secondary
                         text-black font-medium px-8 py-4 rounded-xl hover:opacity-90 transition-all duration-300
                         disabled:opacity-50 shadow-lg shadow-primary/25 group"
            >
              <Wand2 className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" />
              <span>{isGenerating ? 'Generating...' : 'Create Music'}</span>
            </button>
          </div>
          
          {error && (
            <p className="text-red-400 text-sm text-center mt-4 fade-in">{error}</p>
          )}

          {isGenerating && (
            <div className="mt-8 space-y-6 fade-in">
              <div className="flex items-center justify-center gap-3 bg-primary/10 py-3 px-6 rounded-xl
                            backdrop-blur-sm border border-primary/20 animate-pulse">
                <Clock className="inline-block w-4 h-4 mr-2 animate-pulse" />
                <p className="text-white/90 text-sm font-medium flex items-center gap-2">
                  Creating your <span className="text-primary">masterpiece</span>... ✨ 
                  <span className="text-white/80">
                    {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                  </span>
                </p>
              </div>
              
              <div className="w-full bg-white/10 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-primary to-secondary h-full rounded-full transition-all duration-300"
                  style={{ width: `${((240 - timeLeft) / 240) * 100}%` }}
                ></div>
              </div>

              <div className="p-6 bg-white/[0.07] rounded-xl backdrop-blur-sm border border-white/10 
                            transform hover:scale-[1.01] transition-all duration-300">
                <div className="flex flex-col items-center gap-3 fade-in">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-primary animate-pulse" />
                    <h4 className="text-white font-semibold">Did You Know?</h4>
                  </div>
                  <p className="text-white/90 text-sm text-center">
                    {MUSIC_FACTS[currentFact].fact}
                  </p>
                  <a 
                    href={MUSIC_FACTS[currentFact].source}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-primary/80 hover:text-primary transition-colors"
                  >
                    📚 Read Research
                  </a>
                </div>
              </div>
            </div>
          )}
          
          {songs.some(song => song.audio_url && currentSong === song.audio_url) && (
            <div className="mt-8 text-center">
              {song.error ? (
                <div className="flex flex-col items-center gap-2">
                  <p className="text-red-400 text-sm">{song.error}</p>
                  {song.retryable && (
                    <button
                      onClick={() => handleGenerate()}
                      className="text-primary hover:text-primary/80 text-sm flex items-center gap-2"
                    >
                      <RefreshCw className="w-4 h-4" />
                      Try Again
                    </button>
                  )}
                </div>
              ) : (
                <p className="text-white/90 text-sm font-medium flex items-center justify-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  Your melody is ready to play!
                </p>
              )}
            </div>
          )}

          <div className="flex justify-center space-x-4 pt-6">
            <button 
              onClick={() => handlePlay(currentSong)}
              disabled={!currentSong}
              className="flex items-center space-x-2 text-white/60 hover:text-primary
                         transition-all duration-300 disabled:opacity-50 group"
            >
              {isPlaying ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <Play className="w-6 h-6 group-hover:scale-110 transition-transform" />
              )}
              <span>{isPlaying ? 'Playing...' : 'Play'}</span>
            </button>
            <button 
              disabled={!currentSong}
              onClick={() => currentSong && handleDownload(currentSong, `${mood} ${instrument} melody`)}
              className="flex items-center space-x-2 text-white/60 hover:text-accent
                         transition-all duration-300 disabled:opacity-50 group"
            >
              <Download className="w-6 h-6 group-hover:scale-110 transition-transform" />
              <span>Download</span>
            </button>
            <button
              disabled={!currentSong}
              className="flex items-center space-x-2 text-white/60 hover:text-secondary
                         transition-all duration-300 disabled:opacity-50 group"
            >
              <Share2 className="w-6 h-6 group-hover:scale-110 transition-transform" />
              <span>Share</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}