import { motion } from 'framer-motion';
import { Brain } from '@phosphor-icons/react';

export default function VideoEvidence() {
  return (
    <section className="py-8 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
          className="max-w-lg mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="relative p-3 sm:p-4 rounded-2xl backdrop-blur-sm border border-red-200/20 overflow-hidden
                         bg-red-500/5">
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/3 to-orange-500/2 opacity-60" />
            
            <div className="relative z-10">
              {/* Compact header */}
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
                <h3 className="text-sm font-medium text-white flex items-center gap-2">
                  <Brain size={16} weight="duotone" className="text-red-300" />
                  Research: Impact on Development
                </h3>
              </div>
              
              {/* Compact video */}
              <div className="aspect-video w-full rounded-lg overflow-hidden bg-black/50 mb-3" 
                   style={{ maxHeight: '140px' }}>
                <iframe
                  src="https://www.youtube.com/embed/YEFptHp0AmM?rel=0&modestbranding=1&showinfo=0&controls=1&fs=0&playsinline=1"
                  title="The Impact of Overstimulating Content on Child Development"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                  loading="lazy"
                />
              </div>
              
              {/* Compact description */}
              <p className="text-white/70 text-xs leading-relaxed text-center">
                Research shows overstimulating content negatively impacts attention spans and cognitive development
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
} 