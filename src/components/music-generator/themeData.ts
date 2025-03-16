import type { ThemeType } from '../../types';
import { Music2, Brain, Heart, Star } from 'lucide-react';

export const THEMES: { type: ThemeType; title: string; description: string; icon: React.ComponentType<React.SVGProps<SVGSVGElement>> }[] = [
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