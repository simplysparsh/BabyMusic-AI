import React from 'react';
import type { MusicMood, Tempo } from '../../types';

const TEMPO_OPTIONS: { type: Tempo; label: string }[] = [
  { type: 'slow', label: 'Slow' },
  { type: 'medium', label: 'Medium' },
  { type: 'fast', label: 'Fast' }
];

const MOOD_OPTIONS: { type: MusicMood; label: string }[] = [
  { type: 'calm', label: 'Calm' },
  { type: 'playful', label: 'Playful' },
  { type: 'learning', label: 'Learning' },
  { type: 'energetic', label: 'Energetic' }
];

interface CustomOptionsProps {
  tempo: Tempo;
  mood: MusicMood;
  onTempoSelect: (tempo: Tempo) => void;
  onMoodSelect: (mood: MusicMood) => void;
}

export default function CustomOptions({ 
  tempo, 
  mood, 
  onTempoSelect, 
  onMoodSelect 
}: CustomOptionsProps) {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-lg font-medium text-white/90 mb-4">
          Tempo
        </label>
        <div className="flex gap-3">
          {TEMPO_OPTIONS.map(({ type, label }) => (
            <button
              key={type}
              onClick={() => onTempoSelect(type)}
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

      <div>
        <label className="block text-lg font-medium text-white/90 mb-4">
          Mood
        </label>
        <div className="grid grid-cols-2 gap-3">
          {MOOD_OPTIONS.map(({ type, label }) => (
            <button
              key={type}
              onClick={() => onMoodSelect(type)}
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
    </div>
  );
}