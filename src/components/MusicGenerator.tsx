import { useState, useEffect } from 'react';
import { Wand2 } from 'lucide-react';
import type { ThemeType, VoiceType, Tempo, MusicMood } from '../types';
import { useSongStore } from '../store/songStore';
import { useAuthStore } from '../store/authStore';
import ThemeSelector from './music-generator/ThemeSelector';
import VoiceSelector from './music-generator/VoiceSelector';
import CustomOptions from './music-generator/CustomOptions';
import LyricsInput from './music-generator/LyricsInput';
import GenerationProgress from './music-generator/GenerationProgress';
import { SongPromptService } from '../services/songPromptService';
import { useSongGenerationTimer } from '../hooks/useSongGenerationTimer';

type TabType = 'themes' | 'fromScratch';

export default function MusicGenerator() {
  const [activeTab, setActiveTab] = useState<TabType>('themes');
  const [theme, setTheme] = useState<ThemeType | undefined>();
  const [tempo, setTempo] = useState<Tempo | undefined>();
  const [mood, setMood] = useState<MusicMood | undefined>();
  const [voiceSettings, setVoiceSettings] = useState({
    isInstrumental: false,
    voice: 'softFemale' as VoiceType
  });
  const [userInput, setUserInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [songType, setSongType] = useState<'preset' | 'theme' | 'theme-with-input' | 'from-scratch'>('theme');
  
  const { createSong, songs } = useSongStore();
  const { user } = useAuthStore();
  
  // Identify if a non-preset song is currently generating
  const getGeneratingNonPresetSong = () => {
    return songs.find(song => 
      song.task_id && 
      !song.audio_url && 
      song.song_type && 
      song.song_type !== 'preset'
    );
  };

  const generatingNonPresetSong = getGeneratingNonPresetSong();
  const isNonPresetGenerating = !!generatingNonPresetSong;

  // Determine if the create button should be disabled
  const isCreateButtonDisabled = () => {
    // Always allow generating presets
    if (songType === 'preset') {
      return false; 
    }
    // Disable if trying to generate a non-preset and one is already running
    const isTryingToGenerateNonPreset = songType === 'theme' || songType === 'theme-with-input' || songType === 'from-scratch';
    return isTryingToGenerateNonPreset && isNonPresetGenerating;
  };

  // Use the centralized timer hook, only activating it when a non-preset song is generating
  const { timeLeft, totalTime, formattedTime, progress } = useSongGenerationTimer(isNonPresetGenerating);

  // Reset states when changing tabs
  useEffect(() => {
    setUserInput('');
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
    
    // Add validation for theme-with-input to require user input
    if (songType === 'theme-with-input' && !userInput.trim()) {
      setError('Please enter your custom text');
      return;
    }
    
    if (songType === 'from-scratch') {
      if (!mood) {
        setError('Please select a mood');
        return;
      }
      
      if (!tempo) {
        setError('Please select a tempo');
        return;
      }
      
      if (!userInput.trim()) {
        setError('Please enter your custom text');
        return;
      }
    }

    console.log('Generate clicked:', { 
      activeTab, 
      theme, 
      mood, 
      userInput,
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

      // Get the user's profile
      const profile = useAuthStore.getState().profile;
      if (!profile) {
        throw new Error('User profile not found');
      }

      if (songType === 'theme' || songType === 'theme-with-input') {
        console.log('Creating themed song:', {
          theme,
          songType,
          userInput: userInput.trim()
        });

        await createSong({
          ...baseParams,
          name: SongPromptService.generateTitle({
            theme,
            babyName: profile.babyName,
            isInstrumental: voiceSettings.isInstrumental,
            songType
          }),
          theme,
          userInput: userInput.trim() || undefined
        });
      } else {
        // from-scratch mode
        console.log('Creating custom song:', {
          mood,
          userInput: userInput.trim()
        });

        await createSong({
          ...baseParams,
          name: `${mood} Song: ${userInput.slice(0, 30)}${userInput.length > 30 ? '...' : ''}`,
          tempo,
          mood,
          userInput: userInput.trim()
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
                value={userInput}
                onChange={setUserInput}
                onSongTypeChange={setSongType}
              />
            </>
          ) : (
            <>
              <LyricsInput
                key="scratch-lyrics"
                value={userInput}
                onChange={setUserInput}
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
            disabled={isCreateButtonDisabled()}
            className="flex items-center space-x-3 min-h-[48px] bg-gradient-to-r from-primary to-secondary
                     text-black font-medium px-8 py-4 rounded-xl hover:opacity-90 transition-all duration-300
                     disabled:opacity-50 shadow-lg shadow-primary/25 group active:scale-95 active:shadow-md"
          >
            <Wand2 className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" />
            <span>{isNonPresetGenerating ? 'Generating...' : 'Create Music'}</span>
          </button>
        </div>
        
        {error && (
          <p className="text-red-400 text-sm text-center mt-4 fade-in">{error}</p>
        )}

        {/* Only show progress for non-preset songs */}
        {isNonPresetGenerating && (
          <GenerationProgress
            timeLeft={timeLeft}
            totalTime={totalTime}
            formattedTime={formattedTime}
            progress={progress}
          />
        )}
      </div>
    </div>
  );
}