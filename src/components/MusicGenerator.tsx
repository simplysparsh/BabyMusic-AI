import React, { useState } from 'react';
import { Wand2, Play, Download, Share2, Loader2, Clock, Sparkles, RefreshCw, Music2, Brain, Heart, Star } from 'lucide-react';
import type { ThemeType, VoiceType, Tempo, MusicMood } from '../types';
import { useSongStore } from '../store/songStore';
import { useAuthStore } from '../store/authStore';

const GENERATION_TIME = 240; // 4 minutes in seconds

const THEMES: { type: ThemeType; title: string; description: string; icon: any }[] = [
  {
    type: 'pitchDevelopment',
    title: 'Musical Intelligence',
    description: 'Develop pitch recognition and musical memory',
    icon: Music2
  },
  {
    type: 'cognitiveSpeech',
    title: 'Language & Learning',
    description: 'Enhance speech development and cognitive skills',
    icon: Brain
  },
  {
    type: 'sleepRegulation',
    title: 'Sleep & Relaxation',
    description: 'Calming melodies for peaceful sleep',
    icon: Heart
  },
  {
    type: 'socialEngagement',
    title: 'Social & Emotional',
    description: 'Foster emotional intelligence and social bonds',
    icon: Star
  },
  {
    type: 'musicalDevelopment',
    title: 'Advanced Music',
    description: 'Complex patterns for musical advancement',
    icon: Music2
  },
  {
    type: 'indianClassical',
    title: 'Indian Ragas',
    description: 'Traditional melodies for holistic development',
    icon: Music2
  },
  {
    type: 'westernClassical',
    title: 'Western Classical',
    description: 'Structured compositions for focus and calm',
    icon: Heart
  },
  {
    type: 'custom',
    title: 'Fully Custom',
    description: 'Create your own unique musical experience',
    icon: Wand2
  }
];

const VOICE_OPTIONS: { type: VoiceType; label: string }[] = [
  { type: 'softFemale', label: 'Soft Female Voice' },
  { type: 'calmMale', label: 'Calm Male Voice' }
];

const TEMPO_OPTIONS: { type: Tempo; label: string }[] = [
  { type: 'slow', label: 'Slow & Gentle' },
  { type: 'medium', label: 'Medium & Balanced' },
  { type: 'fast', label: 'Fast & Energetic' }
];

const MOOD_OPTIONS: { type: MusicMood; label: string }[] = [
  { type: 'calm', label: 'Calm & Peaceful' },
  { type: 'playful', label: 'Playful & Fun' },
  { type: 'learning', label: 'Learning & Focus' },
  { type: 'energetic', label: 'Energetic & Active' }
];

export default function MusicGenerator() {
  const [theme, setTheme] = useState<ThemeType>('pitchDevelopment');
  const [voice, setVoice] = useState<VoiceType>('softFemale');
  const [tempo, setTempo] = useState<Tempo>('medium');
  const [mood, setMood] = useState<MusicMood>('calm');
  const [hasIdeas, setHasIdeas] = useState(true);
  const [customText, setCustomText] = useState('');
  const [timeLeft, setTimeLeft] = useState(GENERATION_TIME);
  const [error, setError] = useState<string | null>(null);
  const { createSong, generatingSongs } = useSongStore();
  const { user } = useAuthStore();

  const [currentSong, setCurrentSong] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = React.useRef<HTMLAudioElement | null>(null);
  const isGenerating = generatingSongs.size > 0;

  React.useEffect(() => {
    let timer: number;
    if (isGenerating) {
      timer = window.setInterval(() => {
        setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    } else {
      setTimeLeft(GENERATION_TIME);
    }
    return () => clearInterval(timer);
  }, [isGenerating]);

  const handleGenerate = async () => {
    if (!user) {
      setError('Please sign in to generate music');
      return;
    }

    if ((theme === 'custom' || hasIdeas) && !customText.trim()) {
      setError('Please enter your custom text');
      return;
    }

    setError(null);

    try {
      const songName = theme === 'custom' 
        ? `Custom: ${customText.slice(0, 30)}${customText.length > 30 ? '...' : ''}`
        : `${THEMES.find(t => t.type === theme)?.title} Theme`;

      await createSong({
        name: songName,
        mood,
        voice,
        lyrics: theme === 'custom' ? customText : undefined
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
        {/* Theme Selection */}
        <div>
          <label className="block text-2xl font-bold text-white mb-2">
            Create Your Perfect Song
          </label>
          <p className="text-white/70 mb-6">
            Choose a theme or let us craft a unique melody based on your ideas
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {THEMES.map(({ type, title, description, icon: Icon }) => (
              <button
                key={type}
                onClick={() => setTheme(type)}
                className={`p-4 rounded-xl text-left transition-all duration-300 flex items-start gap-3
                         ${theme === type
                           ? 'bg-gradient-to-r from-primary to-secondary text-black'
                           : 'bg-white/[0.07] text-white hover:bg-white/[0.1]'}`}
              >
                <div className={`p-2 rounded-lg ${theme === type ? 'bg-black/10' : 'bg-white/10'}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-medium">{title}</div>
                  <div className="text-sm opacity-80">{description}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Inspiration Text Input (available for all themes) */}
        <div>
          <label className="block text-lg font-medium text-white/90 mb-2">
            Your Musical Inspiration
            <span className="text-white/60 text-sm ml-2">(Optional)</span>
          </label>
          <div className="space-y-3">
            <div className="flex gap-3">
              {theme !== 'custom' && (
                <button
                  onClick={() => {
                    setHasIdeas(false);
                    setCustomText('');
                  }}
                  className={`px-4 py-2 rounded-xl text-sm transition-all duration-300
                           ${!hasIdeas
                             ? 'bg-gradient-to-r from-primary to-secondary text-black'
                             : 'bg-white/[0.07] text-white hover:bg-white/[0.1]'}`}
                >
                  Build for me
                </button>
              )}
              <button
                onClick={() => setHasIdeas(true)}
                className={`px-4 py-2 rounded-xl text-sm transition-all duration-300
                         ${hasIdeas
                           ? 'bg-gradient-to-r from-primary to-secondary text-black'
                           : 'bg-white/[0.07] text-white hover:bg-white/[0.1]'}`}
              >
                I have ideas
              </button>
            </div>
            {(hasIdeas || theme === 'custom') && (
              <textarea
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                placeholder={`Share your ideas! Examples:
• A lullaby about [baby's name] exploring a magical garden
• An upbeat song to make diaper changes fun
• A calming melody with sounds of gentle rain
• Something to help with tummy time
• A song about colors and shapes for learning`}
                className="w-full h-40 bg-[#2A2D3E] border border-white/10 rounded-xl px-6 py-4
                         text-white placeholder:text-white/40 placeholder:text-sm focus:outline-none focus:ring-2
                         focus:ring-primary/50 transition-all duration-300 resize-none"
              />
            )}
          </div>
        </div>

        {/* Voice Selection */}
        {(hasIdeas || theme === 'custom') && (
          <div>
          <label className="block text-lg font-medium text-white/90 mb-4">
            Voice Type
          </label>
          <div className="flex gap-3">
            {VOICE_OPTIONS.map(({ type, label }) => (
              <button
                key={type}
                onClick={() => setVoice(type)}
                className={`flex-1 px-4 py-3 rounded-xl text-center transition-all duration-300
                         ${voice === type
                           ? 'bg-gradient-to-r from-accent to-secondary text-black'
                           : 'bg-white/[0.07] text-white hover:bg-white/[0.1]'}`}
              >
                {label}
              </button>
            ))}
          </div>
          </div>
        )}

        {/* Advanced Options (only for custom theme) */}
        {theme === 'custom' && (
          <>
            {/* Tempo Selection */}
            <div>
              <label className="block text-lg font-medium text-white/90 mb-4">
                Tempo
              </label>
              <div className="flex gap-3">
                {TEMPO_OPTIONS.map(({ type, label }) => (
                  <button
                    key={type}
                    onClick={() => setTempo(type)}
                    className={`flex-1 px-4 py-3 rounded-xl text-center transition-all duration-300
                             ${tempo === type
                               ? 'bg-gradient-to-r from-primary to-accent text-black'
                               : 'bg-white/[0.07] text-white hover:bg-white/[0.1]'}`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Mood Selection */}
            <div>
              <label className="block text-lg font-medium text-white/90 mb-4">
                Mood
              </label>
              <div className="grid grid-cols-2 gap-3">
                {MOOD_OPTIONS.map(({ type, label }) => (
                  <button
                    key={type}
                    onClick={() => setMood(type)}
                    className={`px-4 py-3 rounded-xl text-center transition-all duration-300
                             ${mood === type
                               ? 'bg-gradient-to-r from-secondary to-accent text-black'
                               : 'bg-white/[0.07] text-white hover:bg-white/[0.1]'}`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Generate Button */}
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
          </div>
        )}
      </div>
    </div>
  );
}