import React, { useState, useEffect } from 'react';
import { Wand2 } from 'lucide-react';
import type { ThemeType, VoiceType, Tempo, MusicMood } from '../types';
import { useSongStore } from '../store/songStore';
import { useAuthStore } from '../store/authStore';
import ThemeSelector from './music-generator/ThemeSelector';
import VoiceSelector from './music-generator/VoiceSelector';
import CustomOptions from './music-generator/CustomOptions';
import LyricsInput from './music-generator/LyricsInput';
import GenerationProgress from './music-generator/GenerationProgress';

type TabType = 'themes' | 'fromScratch';
const GENERATION_TIME = 240; // 4 minutes in seconds

export default function MusicGenerator() {
  const [activeTab, setActiveTab] = useState<TabType>('themes');
  const [theme, setTheme] = useState<ThemeType>('pitchDevelopment');
  const [tempo, setTempo] = useState<Tempo>('medium');
  const [mood, setMood] = useState<MusicMood>('calm');
  const [voiceSettings, setVoiceSettings] = useState({
    isInstrumental: false,
    voice: 'softFemale' as VoiceType
  });
  const [customText, setCustomText] = useState('');
  const [timeLeft, setTimeLeft] = useState(GENERATION_TIME);
  const [error, setError] = useState<string | null>(null);
  const [hasIdeas, setHasIdeas] = useState(false);
  
  const { createSong, generatingSongs } = useSongStore();
  const { user } = useAuthStore();
  const isGenerating = generatingSongs.size > 0;

  useEffect(() => {
    let timer: number;
    if (isGenerating) {
      // Reset timer when starting generation
      setTimeLeft(GENERATION_TIME);
      timer = window.setInterval(() => {
        setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [isGenerating]);

  // Reset states when changing tabs
  useEffect(() => {
    setCustomText('');
    setHasIdeas(false);
    setError(null);
    setVoiceSettings({
      isInstrumental: false,
      voice: 'softFemale' as VoiceType
    });
  }, [activeTab]);
  const handleGenerate = async () => {
    if (!user?.id) {
      setError('Please sign in to generate music');
      return;
    }

    // Require lyrics for custom songs and when user has ideas
    if ((activeTab === 'fromScratch' || hasIdeas) && !customText.trim()) {
      setError('Please enter your custom text');
      return;
    }

    setError(null);

    try {
      const songName = activeTab === 'fromScratch'
        ? `Custom: ${customText.slice(0, 30)}${customText.length > 30 ? '...' : ''}`
        : `${theme} Theme`;

      console.log('Starting song generation:', {
        activeTab,
        theme: activeTab === 'themes' ? theme : undefined,
        mood: activeTab === 'custom' || hasIdeas ? mood : undefined,
        hasIdeas,
        isInstrumental: voiceSettings.isInstrumental,
        voice: voiceSettings.isInstrumental ? undefined : voiceSettings.voice,
        customText: customText ? 'provided' : 'not provided'
      });

      await createSong({
        name: songName,
        // Use theme for theme-based songs
        theme: activeTab === 'themes' ? theme : undefined,
        // Use mood only for fromScratch songs
        mood: activeTab === 'custom' ? mood : undefined,
        tempo,
        // Always provide voice settings, even for build-for-me option
        voice: voiceSettings.isInstrumental ? undefined : voiceSettings.voice,
        isInstrumental: voiceSettings.isInstrumental,
        lyrics: customText.trim() || undefined,
        hasUserIdeas: hasIdeas
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate music');
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4 sm:p-8 card relative z-10">
      <div className="space-y-6">
        {/* Chrome-style Tabs */}
        <div className="flex items-center gap-2 border-b border-white/10 mb-6">
          <button
            onClick={() => setActiveTab('themes')}
            className={`px-6 py-3 rounded-t-lg text-sm font-medium transition-all duration-300 relative
                     ${activeTab === 'themes' 
                       ? 'text-white bg-white/10' 
                       : 'text-white/60 hover:text-white hover:bg-white/5'}`}
          >
            Goal-Based
            {activeTab === 'themes' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary to-secondary"></div>
            )}
          </button>
          <button
            onClick={() => setActiveTab('fromScratch')}
            className={`px-6 py-3 rounded-t-lg text-sm font-medium transition-all duration-300 relative
                     ${activeTab === 'fromScratch' 
                       ? 'text-white bg-white/10' 
                       : 'text-white/60 hover:text-white hover:bg-white/5'}`}
          >
            Build from Scratch
            {activeTab === 'fromScratch' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary to-secondary"></div>
            )}
          </button>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {activeTab === 'themes' ? (
            <>
              <ThemeSelector
                selectedTheme={theme}
                onThemeSelect={setTheme}
              />
              <LyricsInput
                value={customText}
                onChange={setCustomText}
                onHasIdeasChange={setHasIdeas}
              />
            </>
          ) : (
            <>
              <LyricsInput
                value={customText}
                onChange={setCustomText}
                isFromScratch
              />
              <CustomOptions
                tempo={tempo}
                mood={mood}
                onTempoSelect={setTempo}
                onMoodSelect={setMood}
              />
            </>
          )}
          
          {/* Only show voice options if user has ideas or in fromScratch mode */}
          {(hasIdeas || activeTab === 'fromScratch') && (
            <VoiceSelector
              isInstrumental={voiceSettings.isInstrumental}
              selectedVoice={voiceSettings.voice}
              onVoiceSelect={(voice) => setVoiceSettings(prev => ({ ...prev, voice }))}
              onInstrumentalToggle={(isInstrumental) => 
                setVoiceSettings(prev => ({ ...prev, isInstrumental }))}
            />
          )}
        </div>

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
          <GenerationProgress
            timeLeft={timeLeft}
            totalTime={GENERATION_TIME}
          />
        )}
      </div>
    </div>
  );
}