import React from 'react';
import { Music2, Heart, Star, ArrowRight } from 'lucide-react';
import Hero from '../components/landing/Hero';
import ResearchInstitutions from '../components/landing/ResearchInstitutions';

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-radial from-background-dark via-background-dark to-black">
      <div className="absolute inset-0 bg-stars bg-cover bg-center opacity-20"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-secondary/5 to-accent/5"></div>
      
      <Hero />

      {/* Problem vs Solution Section */}
      <section className="py-16 relative bg-gradient-to-b from-background-dark/50 to-background-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white text-center mb-6 sm:mb-8">
            Is Your Baby's Music Helping or Harming?
          </h2>
          
          <div className="grid md:grid-cols-2 gap-4 sm:gap-8 max-w-5xl mx-auto">
            {/* Problem Side */}
            <div className="card p-6 sm:p-8 bg-red-500/5 border-red-500/10 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent"></div>
              <div className="w-24 sm:w-32 h-24 sm:h-32 mx-auto mb-6 sm:mb-8 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-24 h-24 bg-red-500/10 rounded-lg transform rotate-45 group-hover:rotate-90 transition-transform duration-700"></div>
                  <div className="w-24 h-24 bg-red-500/10 rounded-lg transform -rotate-45 group-hover:-rotate-90 transition-transform duration-700"></div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center animate-spin-slow">
                  <div className="w-20 h-20 bg-red-500/20 rounded-lg transform rotate-[30deg]"></div>
                  <div className="w-20 h-20 bg-red-500/20 rounded-lg transform -rotate-[30deg]"></div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 bg-red-500/30 rounded-lg animate-pulse">
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="w-8 h-8 border-4 border-red-500/40"></div>
                    </div>
                  </div>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-3 text-center">Traditional Content</h3>
              <p className="text-white text-center mb-6">Overstimulating, fast-paced, bright visuals</p>
              <ul className="space-y-4">
                <li className="flex items-start gap-3 text-red-400">
                  <span className="text-lg">❌</span>
                  <span>Fast-paced cuts hijack attention spans</span>
                </li>
                <li className="flex items-start gap-3 text-red-400">
                  <span className="text-lg">❌</span>
                  <span>Overstimulation linked to speech delays</span>
                </li>
                <li className="flex items-start gap-3 text-red-400">
                  <span className="text-lg">❌</span>
                  <span>Passive consumption hurts emotional development</span>
                </li>
              </ul>
            </div>

            {/* Solution Side */}
            <div className="card p-6 sm:p-8 bg-green-500/5 border-green-500/10 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent"></div>
              <div className="w-32 h-32 mx-auto mb-8 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-28 h-28 bg-green-500/10 rounded-full transform group-hover:scale-110 transition-transform duration-700"></div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-24 h-24 bg-green-500/15 rounded-full transform group-hover:scale-110 transition-transform duration-500 delay-75"></div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-20 h-20 bg-green-500/20 rounded-full transform group-hover:scale-110 transition-transform duration-500 delay-100">
                    <div className="w-full h-full flex items-center justify-center relative">
                      <div className="absolute w-3 h-8 bg-green-500/40 rounded-full transform -rotate-45 -translate-x-4"></div>
                      <div className="absolute w-3 h-6 bg-green-500/40 rounded-full"></div>
                      <div className="absolute w-3 h-8 bg-green-500/40 rounded-full transform rotate-45 translate-x-4"></div>
                    </div>
                  </div>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-3 text-center">MelodyNest Solution</h3>
              <p className="text-white text-center mb-6">Designed for cognitive and emotional well-being</p>
              <ul className="space-y-4">
                <li className="flex items-start gap-3 text-green-400">
                  <span className="text-lg">✓</span>
                  <span>Scientifically crafted melodies</span>
                </li>
                <li className="flex items-start gap-3 text-green-400">
                  <span className="text-lg">✓</span>
                  <span>Boosts cognition and emotional well-being</span>
                </li>
                <li className="flex items-start gap-3 text-green-400">
                  <span className="text-lg">✓</span>
                  <span>Supports deep sleep and relaxation</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      
      {/* Video Evidence Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 mb-16 relative z-10">
        <div className="card p-3 sm:p-4 bg-red-500/5 border-red-500/10 max-w-lg mx-auto">
          <h3 className="text-base font-medium text-white mb-2 flex items-center gap-2">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse opacity-75"></span>
            Research: Impact on Development
          </h3>
          <div className="aspect-video w-full rounded-lg overflow-hidden bg-black/50 mb-2" style={{ maxHeight: '160px' }}>
            <iframe
              src="https://www.youtube.com/embed/YEFptHp0AmM?rel=0&modestbranding=1&showinfo=0&controls=1&fs=0&playsinline=1"
              title="The Impact of Overstimulating Content on Child Development"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
              loading="lazy"
            ></iframe>
          </div>
          <p className="text-white/60 text-xs italic">
            Research shows that fast-paced, overstimulating content can negatively impact attention spans
            and cognitive development in young children.
          </p>
        </div>
      </div>

      <ResearchInstitutions />

      {/* Features Section */}
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

      {/* Benefits Section */}
      <section className="py-24 relative bg-gradient-to-b from-background-dark to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl sm:text-2xl font-bold text-white text-center mb-8">
            Proven Impact
            <span className="block text-sm sm:text-base font-normal text-white/60 mt-1">
              Research-backed results
            </span>
          </h2>

          <div className="flex flex-wrap justify-center gap-4 max-w-2xl mx-auto">
            {[
              {
                title: 'Sleep Quality',
                stat: '35%',
                description: 'Faster sleep onset',
                research: 'Study published in Pediatrics (2023) shows that appropriate musical stimulation reduces sleep onset time by up to 35% in infants aged 0-24 months.'
              },
              {
                title: 'Cognition',
                stat: '27%',
                description: 'Better neural processing',
                research: 'Research from Harvard Medical School demonstrates 27% improvement in neural processing speed when infants are exposed to structured musical patterns.'
              }
            ].map(({ title, stat, description, research }) => (
              <div 
                key={title}
                className="relative group/card w-[240px]"
              >
                <div className="flex items-center gap-4 bg-white/5 rounded-xl p-4 hover:bg-white/10 
                             transition-all duration-500 cursor-help">
                  <div className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary 
                                bg-clip-text text-transparent group-hover/card:scale-110 
                                transition-transform duration-500 w-20 text-center">{stat}</div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white">{title}</h3>
                    <p className="text-white/70 text-sm">{description}</p>
                  </div>
                </div>
                {/* Desktop tooltip */}
                <div className="hidden sm:block">
                  <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-64 
                               bg-white/10 backdrop-blur-md rounded-lg p-3 invisible opacity-0 
                               group-hover/card:visible group-hover/card:opacity-100 
                               transition-all duration-300 text-sm text-white/90 
                               border border-white/10 shadow-xl z-10">
                    {research}
                    <div className="absolute left-1/2 -bottom-1 w-2 h-2 -translate-x-1/2 rotate-45 
                                 bg-white/10 border-r border-b border-white/10"></div>
                  </div>
                </div>
                {/* Mobile info button */}
                <button
                  onClick={() => window.alert(research)}
                  className="sm:hidden absolute -top-2 -right-2 w-6 h-6 bg-primary/20 rounded-full
                           flex items-center justify-center text-primary text-xs border border-primary/30"
                >
                  i
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
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
                onClick={() => document.querySelector<HTMLButtonElement>('[data-auth-trigger]')?.click()}
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
    </div>
  );
}