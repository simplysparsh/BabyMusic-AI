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
          className={`p-6 rounded-2xl text-left transition-all duration-500 flex items-start gap-4 relative overflow-hidden
                    group hover:scale-[1.02] backdrop-blur-sm
                   ${selectedTheme === type
                     ? 'bg-black/60 text-white shadow-xl shadow-primary/10'
                     : 'bg-black/40 text-white/90 hover:bg-black/50'}`}
        >
          {/* Dynamic background gradients */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 
                       group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="absolute inset-0 bg-gradient-to-tl from-secondary/10 via-transparent to-transparent opacity-0 
                       group-hover:opacity-100 transition-opacity duration-500" style={{ animationDelay: '150ms' }}></div>
          
          {/* Selected state overlay */}
          <div className={`absolute inset-0 bg-gradient-to-br transition-opacity duration-500
                        ${selectedTheme === type 
                          ? 'from-primary/20 via-secondary/10 to-transparent opacity-100'
                          : 'opacity-0'}`} />
          
          {/* Icon container */}
          <div className={`relative w-12 h-12 rounded-xl flex items-center justify-center
                        transition-all duration-700 group-hover:scale-110 group-hover:rotate-[360deg]
                        ${selectedTheme === type 
                          ? 'bg-primary/20' 
                          : 'bg-white/[0.05] group-hover:bg-white/[0.08]'}`}>
            <Icon className={`w-6 h-6 transition-colors duration-300
                          ${selectedTheme === type 
                            ? 'text-primary' 
                            : 'text-white/70 group-hover:text-white'}`} />
          </div>
          
          <div className="relative z-10">
            <div className="font-medium text-lg mb-1 group-hover:text-white transition-colors">{title}</div>
            <div className="text-sm text-white/60 group-hover:text-white/80 transition-colors">{description}</div>
          </div>
          
          {/* Decorative corner gradient */}
          <div className="absolute bottom-0 right-0 w-24 h-24 
                       bg-gradient-radial from-white/5 to-transparent 
                       rounded-full -mr-12 -mb-12 
                       group-hover:scale-150 transition-transform duration-700"></div>
        </button>
      ))}
    </div>
  );
}