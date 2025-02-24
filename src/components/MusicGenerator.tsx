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
import { THEMES } from './music-generator/ThemeSelector';

type TabType = 'themes' | 'fromScratch';
const GENERATION_TIME = 240; // 4 minutes in seconds

const getThemeDisplayName = (themeType: ThemeType): string => {
  const theme = THEMES.find((t: { type: ThemeType }) => t.type === themeType);
  return theme ? theme.title : themeType;
};

export default function MusicGenerator() {
  const [activeTab, setActiveTab] = useState<TabType>('themes');
  const [theme, setTheme] = useState<ThemeType | undefined>();
  const [tempo, setTempo] = useState<Tempo | undefined>();
  const [mood, setMood] = useState<MusicMood | undefined>();
  const [voiceSettings, setVoiceSettings] = useState({
    isInstrumental: false,
    voice: 'softFemale' as VoiceType
  });
  const [customText, setCustomText] = useState('');
  const [timeLeft, setTimeLeft] = useState(GENERATION_TIME);
  const [error, setError] = useState<string | null>(null);
  const [songType, setSongType] = useState<'preset' | 'theme' | 'theme-with-input' | 'from-scratch'>('theme');
  
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
    setSongType(activeTab === 'themes' ? 'theme' : 'from-scratch');
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
    
    // Validate required fields based on song type
    if ((songType === 'theme' || songType === 'theme-with-input') && !theme) {
      setError('Please select a theme');
      return;
    }
    
    if (songType === 'from-scratch' && !mood) {
      setError('Please select a mood');
      return;
    }

    console.log('Generate clicked:', { 
      activeTab, 
      theme, 
      mood, 
      customText,
      songType,
      voiceSettings
    });

    setError(null);

    try {
      const baseParams = {
        voice: voiceSettings.isInstrumental ? undefined : voiceSettings.voice,
        isInstrumental: voiceSettings.isInstrumental,
        songType
      };

      if (songType === 'theme' || songType === 'theme-with-input') {
        if (!theme) {
          setError('Please select a theme');
          return;
        }

        console.log('Creating themed song:', {
          theme,
          songType,
          customText: customText.trim()
        });

        // For themed songs, we don't specify mood or tempo
        // Let the API determine these based on the theme's characteristics
        // For example:
        // - sleepRegulation theme should naturally be calm and slow
        // - pitchDevelopment theme should adapt to learning pace
        // - socialEngagement theme should match interaction dynamics
        await createSong({
          ...baseParams,
          name: `${getThemeDisplayName(theme)} Theme`,
          theme,
          userInput: customText.trim() || undefined
        });
      } else {
        // from-scratch mode
        if (!mood) {
          setError('Please select a mood for your song');
          return;
        }

        if (!customText.trim()) {
          setError('Please enter your custom text');
          return;
        }

        if (!tempo) {
          setError('Please select a tempo for your song');
          return;
        }

        console.log('Creating custom song:', {
          mood,
          customText: customText.trim()
        });

        await createSong({
          ...baseParams,
          name: `${mood} Song: ${customText.slice(0, 30)}${customText.length > 30 ? '...' : ''}`,
          tempo: tempo,
          mood: mood,
          userInput: customText.trim()
        });
      }
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
                key="theme-selector"
                selectedTheme={theme}
                onThemeSelect={setTheme}
              />
              <LyricsInput
                key="theme-lyrics"
                value={customText}
                onChange={setCustomText}
                onSongTypeChange={setSongType}
              />
            </>
          ) : (
            <>
              <LyricsInput
                key="scratch-lyrics"
                value={customText}
                onChange={setCustomText}
                isFromScratch
                onSongTypeChange={setSongType}
              />
              <CustomOptions
                key="scratch-options"
                tempo={tempo}
                mood={mood}
                onTempoSelect={setTempo}
                onMoodSelect={setMood}
              />
            </>
          )}
          
          {/* Only show voice options if user has ideas or in fromScratch mode */}
          {(songType === 'theme-with-input' || songType === 'from-scratch') && (
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