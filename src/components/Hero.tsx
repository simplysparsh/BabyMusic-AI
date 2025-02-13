import React from 'react';
import { Music, Heart, Brain } from 'lucide-react';

export default function Hero() {
  return (
    <div className="relative min-h-screen bg-gradient-radial from-background-dark via-background-dark to-black pt-24 pb-12 overflow-hidden">
      <div className="absolute inset-0 bg-stars bg-cover bg-center opacity-20"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-secondary/5 to-accent/5"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background-dark/50 to-background-dark"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center relative z-10 fade-in">
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-white mb-4 sm:mb-6 tracking-tight">
            Musical Adventures for Your
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              {' '}
              Little One
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-white/80 mb-8 sm:mb-12 max-w-2xl mx-auto leading-relaxed px-4">
            Create personalized melodies that inspire learning, creativity, and development
            through the magic of music.
          </p>
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 mb-12 sm:mb-16">
            <button className="btn-primary">
              Create Music
            </button>
            <button className="btn-secondary">
              Learn More
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-8 max-w-4xl mx-auto relative z-10">
          {[
            {
              icon: Music,
              title: 'AI-Powered Music',
              description:
                'Personalized melodies tailored to your child\'s development stage',
            },
            {
              icon: Heart,
              title: 'Learning Through Music',
              description:
                'Educational songs that make learning fun and engaging',
            },
            {
              icon: Brain,
              title: 'Development Focused',
              description:
                'Age-appropriate music that grows with your child\'s needs',
            },
          ].map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="card p-8 group hover:bg-white/[0.09] transition-all duration-500"
            >
              <div className="flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mb-6 mx-auto
                            group-hover:scale-110 transition-transform duration-500">
                <Icon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3 text-center">
                {title}
              </h3>
              <p className="text-white/70 text-center leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}