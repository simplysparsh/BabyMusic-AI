
import { Heart, Music2, Star } from 'lucide-react';

export default function Features() {
  return (
    <section id="features" className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Floating background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-[100px] animate-float"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-br from-secondary/10 to-transparent rounded-full blur-[100px] animate-float" style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-accent/10 to-transparent rounded-full blur-[100px] animate-float" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="text-center mb-8 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4">
            Your Partner in Peaceful Parenting
          </h2>
          <p className="text-base sm:text-lg text-white/70 max-w-2xl mx-auto leading-relaxed px-2">
            What your baby hears shapes their brain. Replace overstimulation with high-quality melodies designed for learning and calm
          </p>
        </div>

        <div className="relative max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {[
            {
              icon: Heart,
              title: 'Peace of Mind',
              description: 'Finally, screen-free entertainment you can trust, giving you guilt-free moments to yourself',
              gradient: 'from-rose-300/20 via-rose-300/10 to-transparent',
              iconColor: 'text-rose-300/80',
              delay: '0s'
            },
            {
              icon: Music2,
              title: 'Daily Routines Made Easy',
              description: 'Transform challenging moments into joyful experiences with music designed for every situation',
              gradient: 'from-sky-300/20 via-sky-300/10 to-transparent',
              iconColor: 'text-sky-300/80',
              delay: '0.1s'
            },
            {
              icon: Star,
              title: 'Smart Development',
              description: 'While you relax, your baby naturally develops musical intelligence and emotional awareness',
              gradient: 'from-amber-300/20 via-amber-300/10 to-transparent',
              iconColor: 'text-amber-300/80',
              delay: '0.2s'
            }
          ].map(({ icon: Icon, title, description, gradient, iconColor, delay }) => (
            <div 
              key={title}
              className="relative group"
              style={{ transitionDelay: delay }}
            >
              <div className="relative h-full p-6 sm:p-8 rounded-3xl backdrop-blur-sm
                           bg-white/[0.02] border border-white/5
                           transition-all duration-500 overflow-hidden
                           sm:hover:bg-white/[0.05] sm:group-hover:scale-[1.02]
                           sm:group-hover:border-white/10">
                {/* Gradient background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0
                              sm:group-hover:opacity-100 transition-all duration-500`}></div>
                
                {/* Content */}
                <div className="relative z-10 text-center">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 relative">
                    <div className="absolute inset-0 bg-white/5 rounded-2xl transform rotate-45
                                sm:group-hover:scale-110 transition-all duration-500"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Icon className={`w-8 h-8 sm:w-10 sm:h-10 ${iconColor} transform sm:group-hover:scale-110 transition-all duration-500`} />
                    </div>
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4 sm:group-hover:text-primary
                              transition-colors duration-300">{title}</h3>
                  <p className="text-sm sm:text-base text-white/70 leading-relaxed sm:group-hover:text-white/80
                              transition-colors duration-300">
                    {title === 'Peace of Mind' ? (
                      <>
                        Finally, screen-free entertainment you can trust, giving you{' '}
                        <span className="text-primary/90 font-medium">guilt-free</span>{' '}
                        moments to yourself
                      </>
                    ) : (
                      description
                    )}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}