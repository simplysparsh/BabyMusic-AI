import { motion } from 'framer-motion';
import { Heart, Baby, Brain, MusicNote, Moon, Sparkle } from '@phosphor-icons/react';

export default function Features() {
  return (
    <section id="features" className="py-12 sm:py-16 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Warm floating background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div 
            className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-[100px]"
            style={{
              background: 'linear-gradient(135deg, rgba(255, 182, 193, 0.08), rgba(255, 218, 185, 0.06))'
            }}
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div 
            className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full blur-[100px]"
            style={{
              background: 'linear-gradient(135deg, rgba(173, 216, 230, 0.08), rgba(255, 192, 203, 0.06))'
            }}
            animate={{
              scale: [1, 1.15, 1],
              opacity: [0.25, 0.45, 0.25]
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2
            }}
          />
          <motion.div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-[100px]"
            style={{
              background: 'linear-gradient(135deg, rgba(255, 239, 213, 0.06), rgba(255, 228, 225, 0.08))'
            }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.2, 0.4, 0.2]
            }}
            transition={{
              duration: 18,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
          />
        </div>

        <div className="text-center mb-8 sm:mb-10 relative">
          {/* Enhanced section header with warmer design */}
          <div>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-pink-200/6 to-transparent blur-2xl rounded-full"></div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 sm:mb-5 relative
                         drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              Your Partner in Peaceful Parenting
            </h2>
            <p className="text-base sm:text-lg text-white/85 max-w-2xl mx-auto leading-relaxed px-2 relative
                       drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
              What your baby hears shapes their brain. Replace overstimulation with high-quality melodies designed for learning and calm
            </p>
            
            {/* Warm decorative elements */}
            <div className="flex justify-center mt-4">
              <motion.div 
                className="w-16 h-px bg-gradient-to-r from-transparent via-pink-300/40 to-transparent"
                animate={{ scaleX: [0.5, 1, 0.5] }}
                transition={{ duration: 4, repeat: Infinity }}
              />
            </div>
          </div>
        </div>

        <div className="relative max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {[
            {
              icon: Heart,
              title: 'Peace of Mind',
              description: 'Finally, screen-free entertainment you can trust, giving you guilt-free moments to yourself',
              gradient: 'from-pink-400/20 via-rose-300/15 to-transparent',
              iconColor: 'text-pink-300',
              bgColor: 'rgba(255, 182, 193, 0.08)',
              accentColor: 'border-pink-200/20',
              delay: 0
            },
            {
              icon: Baby,
              title: 'Daily Routines Made Easy',
              description: 'Transform challenging moments into joyful experiences with music designed for every situation',
              gradient: 'from-blue-300/20 via-sky-300/15 to-transparent',
              iconColor: 'text-blue-300',
              bgColor: 'rgba(173, 216, 230, 0.08)',
              accentColor: 'border-blue-200/20',
              delay: 0.1
            },
            {
              icon: Brain,
              title: 'Smart Development',
              description: 'While you relax, your baby naturally develops musical intelligence and emotional awareness',
              gradient: 'from-purple-300/20 via-violet-300/15 to-transparent',
              iconColor: 'text-purple-300',
              bgColor: 'rgba(221, 160, 221, 0.08)',
              accentColor: 'border-purple-200/20',
              delay: 0.2
            }
          ].map(({ icon: Icon, title, description, gradient, iconColor, bgColor, accentColor, delay }) => (
            <div 
              key={title}
              className="relative group"
            >
              <div 
                className={`relative h-full p-4 sm:p-6 rounded-3xl backdrop-blur-sm
                         bg-white/[0.04] border ${accentColor}
                         shadow-lg shadow-black/5 transform-gpu overflow-hidden`}
                style={{ backgroundColor: bgColor }}
              >
                {/* Always-visible warm gradient background */}
                <div 
                  className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-60`}
                />
                
                {/* Content */}
                <div className="relative z-10 text-center">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-4 sm:mb-5 relative">
                    <div className="absolute inset-0 bg-white/12 rounded-3xl shadow-lg backdrop-blur-sm border border-white/15" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Icon 
                        size={28} 
                        weight="duotone" 
                        className={`${iconColor} drop-shadow-sm`} 
                      />
                    </div>
                    
                    {/* Always-visible sparkles for visual interest */}
                    <div className="absolute -top-2 -right-2">
                      <motion.div
                        animate={{
                          scale: [0.8, 1.2, 0.8],
                          opacity: [0.4, 0.8, 0.4]
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          delay: delay
                        }}
                      >
                        <Sparkle size={12} weight="fill" className="text-yellow-300/60" />
                      </motion.div>
                    </div>
                  </div>
                  
                  <h3 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4 
                              drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                    {title}
                  </h3>
                  
                  <p className="text-sm sm:text-base text-white/85 leading-relaxed
                              drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]">
                    {title === 'Peace of Mind' ? (
                      <>
                        Finally, screen-free entertainment you can trust, giving you{' '}
                        <span className="text-pink-300 font-medium">guilt-free</span>{' '}
                        moments to yourself
                      </>
                    ) : title === 'Daily Routines Made Easy' ? (
                      <>
                        Transform challenging moments into{' '}
                        <span className="text-blue-300 font-medium">joyful experiences</span>{' '}
                        with music designed for every situation
                      </>
                    ) : (
                      <>
                        While you relax, your baby naturally develops{' '}
                        <span className="text-purple-300 font-medium">musical intelligence</span>{' '}
                        and emotional awareness
                      </>
                    )}
                  </p>
                </div>

                {/* Always-visible floating elements for visual richness */}
                <div className="absolute top-4 right-4 opacity-25">
                  <motion.div
                    animate={{
                      y: [-2, 2, -2],
                      rotate: [-1, 1, -1]
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: delay + 1
                    }}
                  >
                    {title === 'Peace of Mind' && <Heart size={16} weight="fill" className="text-pink-300" />}
                    {title === 'Daily Routines Made Easy' && <MusicNote size={16} weight="fill" className="text-blue-300" />}
                    {title === 'Smart Development' && <Moon size={16} weight="fill" className="text-purple-300" />}
                  </motion.div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}