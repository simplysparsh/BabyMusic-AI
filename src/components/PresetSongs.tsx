import { type FC } from 'react';
import { Baby, UtensilsCrossed, Moon, Waves } from 'lucide-react';
import usePresetSongs from '../hooks/usePresetSongs';
import { useAuthStore } from '../store/authStore';
import { useAudioStore } from '../store/audioStore';
import PresetSongCard from './preset/PresetSongCard';
import type { PresetType } from '../types';

const PRESETS: {
  type: PresetType;
  icon: typeof Baby;
  title: string;
  description: string;
}[] = [
  {
    type: 'playing',
    icon: Baby,
    title: 'Playtime',
    description: 'Fun and energetic songs for active moments',
  },
  {
    type: 'eating',
    icon: UtensilsCrossed,
    title: 'Mealtime',
    description: 'Gentle melodies to make eating enjoyable',
  },
  {
    type: 'sleeping',
    icon: Moon,
    title: 'Bedtime',
    description: 'Soothing lullabies for peaceful sleep',
  },
  {
    type: 'pooping',
    icon: Waves,
    title: 'Flushtime', //Let it be Flushtime
    description: 'Playful tunes to make bathroom time fun',
  },
];

const PresetSongs: FC = () => {
  const { user, profile } = useAuthStore();
  const { isPlaying, currentUrl: currentPlayingUrl } = useAudioStore();
  
  const {
    songs,
    handlePresetClick,
    handlePlay,
    handleVariationChange,
    isPresetTypeGenerating,
    currentVariationIndices
  } = usePresetSongs();

  // Show component only when we have a logged-in user
  if (!user) return null;

  return (
    <div className="w-full max-w-2xl mx-auto mb-6 sm:mb-8 relative px-4">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 
                    rounded-3xl blur-3xl"></div>
      <h2 className="text-3xl font-bold text-white mb-6 sm:mb-8 text-center relative z-10 bg-transparent">
        {profile?.babyName ? `${profile.babyName}'s Special Songs` : 'Special Songs'}
        <span className="block text-base sm:text-lg font-normal text-white/60 mt-2">
          ✨ Magical melodies for every moment ✨
        </span>
      </h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 relative">
        {PRESETS.map(({ type, icon, title, description }) => {
          // Find the song for this preset type
          const song = songs.find(s => s.preset_type === type);
          const audioUrl = song?.audio_url;
          
          // Create a key that will change when important values change, forcing re-render
          const keyParts = [
            type,
            song?.id || 'no-song',
            song?.audio_url ? 'has-audio' : 'no-audio',
            song?.task_id ? 'has-task' : 'no-task'
          ];
          const itemKey = keyParts.join('-');
          
          return (
            <PresetSongCard
              key={itemKey}
              type={type}
              title={title}
              description={description}
              iconComponent={icon}
              songs={songs}
              isPlaying={isPlaying && currentPlayingUrl === audioUrl}
              onPlayClick={(url) => handlePlay(url)}
              onGenerateClick={handlePresetClick}
              onVariationChange={handleVariationChange}
              currentVariationIndex={currentVariationIndices[type] || 0}
              isPresetTypeGenerating={isPresetTypeGenerating}
            />
          );
        })}
      </div>
    </div>
  );
};

export default PresetSongs;