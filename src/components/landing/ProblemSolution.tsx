import { motion } from 'framer-motion';
import { X, Check, Warning, Heart, Brain, Sparkle, MusicNote, Baby } from '@phosphor-icons/react';

export default function ProblemSolution() {
  return (
    <section className="py-16 relative overflow-hidden">
      {/* Subtle background - different from hero */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/50 to-slate-950/80" />
        <motion.div 
          className="absolute top-1/3 right-1/4 w-64 h-64 rounded-full blur-[100px]"
          style={{
            background: 'linear-gradient(135deg, rgba(255, 99, 132, 0.06), rgba(255, 159, 64, 0.04))'
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <div className="max-w-6xl mx-auto px-6 sm:px-6 lg:px-8 relative z-10">
        {/* Enhanced header */}
        <div className="text-center mb-8">
          <h2 
            className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-6 sm:mb-8
                       drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] 
                       [text-shadow:_0_1px_2px_rgb(0_0_0_/_80%)]"
          >
            Is Your Baby's Music Helping or Harming?
          </h2>
          <div className="flex justify-center">
            <div className="w-8 h-px bg-gradient-to-r from-red-300/40 via-white/20 to-green-300/40" />
          </div>
        </div>

        {/* Creative comparison layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* Problem Side - Compact */}
          <div 
            className="relative p-5 rounded-2xl backdrop-blur-sm border border-red-200/20 overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(255, 99, 132, 0.08), rgba(255, 159, 64, 0.05))'
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-orange-500/3 opacity-60" />
            
            <div className="relative z-10">
              {/* Compact header */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-red-500/15 flex items-center justify-center border border-red-300/20">
                  <Warning size={20} weight="duotone" className="text-red-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white drop-shadow-sm">Traditional Content</h3>
                  <p className="text-red-300/80 text-xs">Overstimulating visuals</p>
                </div>
              </div>
              
              {/* Updated points with proper text size */}
              <div className="space-y-3">
                {[
                  'Fast-paced cuts hijack attention spans',
                  'Overstimulation linked to speech delays',
                  'Passive consumption hurts development'
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-3 text-red-400">
                    <X size={16} weight="bold" className="text-red-400 flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Solution Side - Compact */}
          <div 
            className="relative p-5 rounded-2xl backdrop-blur-sm border border-green-200/20 overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(75, 192, 192, 0.08), rgba(153, 102, 255, 0.05))'
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-green-400/5 to-blue-400/3 opacity-60" />
            
            <div className="relative z-10">
              {/* Compact header */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-green-500/15 flex items-center justify-center border border-green-300/20">
                  <div>
                    <Heart size={20} weight="duotone" className="text-green-400" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white drop-shadow-sm">TuneLoom Solution</h3>
                  <p className="text-green-300/80 text-xs">Scientifically designed</p>
                </div>
              </div>
              
              {/* Updated points with proper text size */}
              <div className="space-y-3">
                {[
                  'Scientifically crafted melodies',
                  'Boosts cognition and emotional well-being',
                  'Supports deep sleep and relaxation'
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-3 text-green-400">
                    <Check size={16} weight="bold" className="text-green-400 flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}