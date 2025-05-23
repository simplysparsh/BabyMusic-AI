import { motion } from 'framer-motion';
import { Heart, Baby, Brain, MusicNote, Moon, Sparkle } from '@phosphor-icons/react';

export default function Features() {
  const cardHoverVariants = {
    rest: { y: 0, transition: { duration: 0.15 } },
    hover: { 
      y: -2,
      transition: {
        duration: 0.15,
        ease: "easeOut"
      }
    }
  };

  return (
    <section id="features" className="py-24 relative overflow-hidden">
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

        <div className="text-center mb-12 sm:mb-16 relative">
          {/* Enhanced section header with warmer design */}
          <div>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-pink-200/6 to-transparent blur-2xl rounded-full"></div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-6 relative
                         drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              Your Partner in Peaceful Parenting
            </h2>
            <p className="text-base sm:text-lg text-white/85 max-w-2xl mx-auto leading-relaxed px-2 relative
                       drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
              What your baby hears shapes their brain. Replace overstimulation with high-quality melodies designed for learning and calm
            </p>
            
            {/* Warm decorative elements */}
            <div className="flex justify-center mt-6">
              <motion.div 
                className="w-16 h-px bg-gradient-to-r from-transparent via-pink-300/40 to-transparent"
                animate={{ scaleX: [0.5, 1, 0.5] }}
                transition={{ duration: 4, repeat: Infinity }}
              />
            </div>
          </div>
        </div>

        <div className="relative max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {[
            {
              icon: Heart,
              title: 'Peace of Mind',
              description: 'Finally, screen-free entertainment you can trust, giving you guilt-free moments to yourself',
              gradient: 'from-pink-400/15 via-rose-300/10 to-transparent',
              iconColor: 'text-pink-300',
              bgColor: 'rgba(255, 182, 193, 0.05)',
              delay: 0
            },
            {
              icon: Baby,
              title: 'Daily Routines Made Easy',
              description: 'Transform challenging moments into joyful experiences with music designed for every situation',
              gradient: 'from-blue-300/15 via-sky-300/10 to-transparent',
              iconColor: 'text-blue-300',
              bgColor: 'rgba(173, 216, 230, 0.05)',
              delay: 0.1
            },
            {
              icon: Brain,
              title: 'Smart Development',
              description: 'While you relax, your baby naturally develops musical intelligence and emotional awareness',
              gradient: 'from-purple-300/15 via-violet-300/10 to-transparent',
              iconColor: 'text-purple-300',
              bgColor: 'rgba(221, 160, 221, 0.05)',
              delay: 0.2
            }
          ].map(({ icon: Icon, title, description, gradient, iconColor, bgColor, delay }) => (
            <motion.div 
              key={title}
              className="relative group"
              initial="rest"
              whileHover="hover"
            >
              <motion.div 
                className="relative h-full p-6 sm:p-8 rounded-3xl backdrop-blur-sm
                         bg-white/[0.03] border border-white/10
                         transition-all duration-200 overflow-hidden
                         shadow-lg shadow-black/5 transform-gpu"
                variants={cardHoverVariants}
                style={{ backgroundColor: bgColor }}
              >
                {/* Warm gradient background on hover */}
                <motion.div 
                  className={`absolute inset-0 bg-gradient-to-br ${gradient}`}
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1, transition: { duration: 0.2 } }}
                />
                
                {/* Content */}
                <div className="relative z-10 text-center">
                  <motion.div 
                    className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-6 sm:mb-8 relative"
                    whileHover={{ scale: 1.05, transition: { duration: 0.15 } }}
                  >
                    <div className="absolute inset-0 bg-white/8 rounded-3xl shadow-lg backdrop-blur-sm border border-white/10" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Icon 
                        size={32} 
                        weight="duotone" 
                        className={`${iconColor} drop-shadow-sm`} 
                      />
                    </div>
                    
                    {/* Floating sparkles around icons */}
                    <motion.div
                      className="absolute -top-2 -right-2"
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
                  </motion.div>
                  
                  <h3 className="text-lg sm:text-xl font-semibold text-white mb-4 sm:mb-6 
                              drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                    {title}
                  </h3>
                  
                  <p className="text-sm sm:text-base text-white/80 leading-relaxed
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

                {/* Subtle floating elements within cards */}
                <motion.div
                  className="absolute top-4 right-4 opacity-20"
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
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}