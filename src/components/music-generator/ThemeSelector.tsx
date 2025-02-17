import React from 'react';
import type { ThemeType } from '../../types';
import { Music2, Brain, Heart, Star, Wand2 } from 'lucide-react';

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
  }
];

interface ThemeSelectorProps {
  selectedTheme: ThemeType;
  onThemeSelect: (theme: ThemeType) => void;
}

export default function ThemeSelector({ selectedTheme, onThemeSelect }: ThemeSelectorProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {THEMES.map(({ type, title, description, icon: Icon }) => (
        <button
          key={type}
          onClick={() => onThemeSelect(type)}
          className={`p-4 rounded-xl text-left transition-all duration-300 flex items-start gap-3
                   ${selectedTheme === type
                     ? 'bg-gradient-to-r from-primary to-secondary text-black'
                     : 'bg-white/[0.07] text-white hover:bg-white/[0.1]'}`}
        >
          <div className={`p-2 rounded-lg ${selectedTheme === type ? 'bg-black/10' : 'bg-white/10'}`}>
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <div className="font-medium">{title}</div>
            <div className="text-sm opacity-80">{description}</div>
          </div>
        </button>
      ))}
    </div>
  );
}