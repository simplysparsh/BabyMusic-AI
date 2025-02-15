import React from 'react';
import { Music2, Heart, Star, ArrowRight } from 'lucide-react';

interface CTASectionProps {
  onOpenAuth: (mode: 'signin' | 'signup') => void;
}

export default function CTASection({ onOpenAuth }: CTASectionProps) {
  return (
    <section className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="card p-6 sm:p-12 text-center relative overflow-hidden group">
          {/* Baby-themed floating icons */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-4 left-8 text-primary/20 group-hover:text-primary/30 transition-colors duration-500">
              <Music2 className="w-8 h-8 animate-float" />
            </div>
            <div className="absolute bottom-4 right-8 text-secondary/20 group-hover:text-secondary/30 transition-colors duration-500">
              <Heart className="w-8 h-8 animate-float" style={{ animationDelay: '1s' }} />
            </div>
            <div className="absolute top-1/2 left-12 -translate-y-1/2 text-accent/20 group-hover:text-accent/30 transition-colors duration-500">
              <Star className="w-6 h-6 animate-float" style={{ animationDelay: '0.5s' }} />
            </div>
            <div className="absolute top-1/2 right-12 -translate-y-1/2 text-primary/20 group-hover:text-primary/30 transition-colors duration-500">
              <Star className="w-6 h-6 animate-float" style={{ animationDelay: '1.5s' }} />
            </div>
          </div>

          {/* Subtle gradient background */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5 
                        group-hover:from-primary/10 group-hover:via-secondary/10 group-hover:to-accent/10 
                        transition-all duration-500"></div>
          
          {/* Gentle border animation */}
          <div className="absolute inset-0 border border-white/5 rounded-2xl group-hover:border-white/10 
                        transition-all duration-500"></div>

          <div className="relative z-10">
            <h2 className="text-2xl sm:text-4xl font-bold text-white mb-4 sm:mb-6">
              Start Your Musical Journey Today
            </h2>
            <p className="text-base sm:text-lg text-white/70 mb-6 sm:mb-8 max-w-2xl mx-auto group-hover:text-white/80 transition-colors duration-500">
              Create magical moments with your little one through the power of AI-crafted melodies. Your peaceful parenting journey starts here.
            </p>
            <button 
              onClick={() => onOpenAuth('signup')}
              className="relative inline-flex items-center btn-primary text-sm sm:text-base px-5 py-2.5 sm:px-6 sm:py-3 
                        hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
            >
              Create Your First Song
              <ArrowRight className="w-5 h-5 ml-2 inline-block" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}