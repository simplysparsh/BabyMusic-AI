import React, { type FC } from 'react';
import { Baby, UtensilsCrossed, Moon, Waves } from 'lucide-react';
import { usePresetSongs } from '../hooks/usePresetSongs';
import { useAuthStore } from '../store/authStore';
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
    title: 'Flush Time',
    description: 'Playful tunes to make bathroom time fun',
  },
];

const PresetSongs: FC = () => {
  const { user, profile } = useAuthStore();
  const { 
    isPlaying, 
    songNames, 
    presetSongTypes, 
    generatingSongs,
    processingTaskIds,
    presetSongs,
    handlePresetClick,
    handlePlay,
    handleVariationChange,
    currentVariation
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
          const song = presetSongs.find(s => s.name === songNames[type]);
          
          return (
            <PresetSongCard
              key={type}
              type={type}
              title={title}
              description={description}
              iconComponent={icon}
              song={song}
              generatingSongs={generatingSongs}
              processingTaskIds={processingTaskIds}
              presetSongTypes={presetSongTypes}
              isPlaying={isPlaying && song?.audioUrl === currentVariation}
              onPlayClick={handlePlay}
              onGenerateClick={handlePresetClick}
              onVariationChange={handleVariationChange}
              currentVariationIndex={currentVariation[type] || 0}
            />
          );
        })}
      </div>
    </div>
  );
};

export default PresetSongs;