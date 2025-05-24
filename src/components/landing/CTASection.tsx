import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Heart, Baby, Sparkle, MusicNote, Brain } from '@phosphor-icons/react';

interface CTASectionProps {
  onOpenAuth: () => void;
}

export default function CTASection({ onOpenAuth }: CTASectionProps) {
  // Check for 'true' or 'TRUE' case-insensitively
  const isSignupDisabled = import.meta.env.VITE_DISABLE_SIGNUP?.toLowerCase() === 'true';
  
  const floatingIconVariants = {
    float: {
      y: [-2, 2, -2],
      rotate: [-0.5, 0.5, -0.5],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };
  
  return (
    <section className="relative pt-16 pb-8 sm:pt-20 sm:pb-12 overflow-hidden">
      {/* Enhanced warm background with floating orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div 
          className="absolute -top-40 left-20 w-72 h-72 rounded-full filter blur-[90px]"
          style={{
            background: 'linear-gradient(135deg, rgba(255, 182, 193, 0.12), rgba(255, 218, 185, 0.08))'
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.4, 0.7, 0.4]
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute -bottom-40 right-20 w-80 h-80 rounded-full filter blur-[100px]"
          style={{
            background: 'linear-gradient(135deg, rgba(173, 216, 230, 0.14), rgba(255, 192, 203, 0.10))'
          }}
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 4
          }}
        />
        <motion.div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full filter blur-[120px]"
          style={{
            background: 'linear-gradient(135deg, rgba(255, 239, 213, 0.08), rgba(255, 228, 225, 0.12))'
          }}
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.25, 0.5, 0.25]
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 8
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
          className="relative rounded-3xl p-8 sm:p-12 group
                    transition-all duration-200 shadow-xl shadow-black/20 backdrop-blur-sm overflow-hidden
                    border border-pink-200/20 transform-gpu"
          style={{
            background: 'linear-gradient(135deg, rgba(255, 182, 193, 0.12), rgba(255, 218, 185, 0.10), rgba(173, 216, 230, 0.08))'
          }}
        >
          {/* Enhanced warm gradient overlays */}
          <div 
            className="absolute inset-0 rounded-3xl opacity-60"
            style={{
              background: 'linear-gradient(135deg, rgba(255, 192, 203, 0.15), rgba(255, 218, 185, 0.12), rgba(173, 216, 230, 0.10))'
            }}
          />
          
          {/* Floating baby-friendly icons within the CTA */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl">
            <motion.div
              className="absolute top-8 left-8"
              variants={floatingIconVariants}
              animate="float"
            >
              <Heart size={16} weight="duotone" className="text-pink-300/40" />
            </motion.div>
            <motion.div
              className="absolute bottom-8 right-12"
              variants={floatingIconVariants}
              animate="float"
              transition={{ delay: 1.5 }}
            >
              <MusicNote size={18} weight="duotone" className="text-blue-300/40" />
            </motion.div>
            <motion.div
              className="absolute top-16 right-8"
              variants={floatingIconVariants}
              animate="float"
              transition={{ delay: 2.5 }}
            >
              <Sparkle size={14} weight="fill" className="text-yellow-300/40" />
            </motion.div>
            <motion.div
              className="absolute bottom-16 left-12"
              variants={floatingIconVariants}
              animate="float"
              transition={{ delay: 0.5 }}
            >
              <Baby size={20} weight="duotone" className="text-purple-300/40" />
            </motion.div>
          </div>
          
          <div className="relative z-10 text-center">
            {/* Enhanced title with warm glow effect */}
            <div className="relative mb-6 sm:mb-8">
              <div className="absolute -inset-6 bg-gradient-to-r from-transparent via-pink-200/8 to-transparent blur-2xl opacity-60 rounded-full"></div>
              <h2 className="text-2xl sm:text-4xl font-bold text-white relative
                           drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                Start Your Musical Journey Today
              </h2>
              
              {/* Floating sparkles around title */}
              <motion.div
                className="absolute -top-4 -left-4"
                animate={{
                  scale: [0.8, 1.2, 0.8],
                  opacity: [0.4, 0.8, 0.4]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity
                }}
              >
                <Sparkle size={16} weight="fill" className="text-yellow-300/60" />
              </motion.div>
              <motion.div
                className="absolute -top-2 -right-6"
                animate={{
                  scale: [0.6, 1, 0.6],
                  opacity: [0.3, 0.7, 0.3]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  delay: 1
                }}
              >
                <Heart size={12} weight="fill" className="text-pink-300/60" />
              </motion.div>
            </div>
            
            <p className="text-base sm:text-lg text-white/85 mb-8 sm:mb-10 max-w-2xl mx-auto 
                       transition-colors duration-500
                       drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
              Create magical moments with your little one through personalized melodies. Your peaceful parenting journey starts here.
            </p>

            {/* Beautiful decorative elements with warm colors */}
            <div className="flex justify-center items-center gap-3 mb-8 sm:mb-10">
              <motion.div 
                className="w-8 h-px bg-gradient-to-r from-transparent via-pink-300/50 to-transparent"
                animate={{ scaleX: [0.5, 1, 0.5] }}
                transition={{ duration: 4, repeat: Infinity }}
              />
              <motion.div 
                className="w-2 h-2 bg-gradient-to-br from-pink-300 to-orange-300 rounded-full shadow-sm"
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 2.5, repeat: Infinity }}
              />
              <motion.div 
                className="w-12 h-px bg-gradient-to-r from-transparent via-blue-200/50 to-transparent"
                animate={{ scaleX: [0.5, 1, 0.5] }}
                transition={{ duration: 4, repeat: Infinity, delay: 1 }}
              />
              <motion.div 
                className="w-1.5 h-1.5 bg-gradient-to-br from-blue-300 to-purple-300 rounded-full shadow-sm"
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
              />
              <motion.div 
                className="w-8 h-px bg-gradient-to-r from-transparent via-orange-200/50 to-transparent"
                animate={{ scaleX: [0.5, 1, 0.5] }}
                transition={{ duration: 4, repeat: Infinity, delay: 2 }}
              />
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <motion.button 
                onClick={onOpenAuth}
                className="relative inline-flex items-center text-sm sm:text-base px-8 py-4 sm:py-3 rounded-2xl
                          w-full sm:w-auto text-white font-semibold shadow-xl shadow-pink-500/30
                          transition-all duration-150 gap-3 border border-pink-300/30 transform-gpu"
                style={{
                  background: 'linear-gradient(135deg, rgba(255, 105, 180, 0.9), rgba(255, 140, 105, 0.9))',
                  textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)'
                }}
                whileTap={{ scale: 0.98, transition: { duration: 0.1 } }}
              >
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-pink-400/20 to-orange-400/20 blur-sm"></div>
                <Heart size={20} weight="duotone" className="relative z-10" />
                <span className="relative z-10">{isSignupDisabled ? 'Join Our Family' : 'Create Your First Song'}</span>
                <ArrowRight className="w-5 h-5 relative z-10" />
              </motion.button>
              
              <motion.a 
                href="/methodology"
                className="relative inline-flex items-center justify-center text-sm sm:text-base px-6 py-4 sm:py-3
                          border border-white/40 rounded-2xl text-white
                          transition-all duration-150 w-full sm:w-auto backdrop-blur-md
                          drop-shadow-sm gap-2 font-medium transform-gpu"
                style={{
                  background: 'rgba(255, 255, 255, 0.08)'
                }}
                whileTap={{ scale: 0.98, transition: { duration: 0.1 } }}
              >
                <Brain size={18} weight="duotone" className="text-purple-300" />
                <span>View Our Methodology</span>
              </motion.a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}