import React from 'react';
import { Music2, Heart, Brain, Star, ArrowRight } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

export default function Landing() {
  const { user } = useAuthStore();
  
  return (
    <div className="min-h-screen bg-gradient-radial from-background-dark via-background-dark to-black">
      <div className="absolute inset-0 bg-stars bg-cover bg-center opacity-20"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-secondary/5 to-accent/5"></div>
      
      {/* Hero Section */}
      <section className="relative pt-24 pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold text-white mb-4 sm:mb-6 tracking-tight">
              Musical Adventures for Your
              <span className="block bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Little One
              </span>
            </h1>
            <p className="text-base sm:text-xl text-white/80 mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed px-2">
              Create personalized melodies that inspire learning, creativity, and development
              through the magic of AI-powered music.
            </p>
            <div className="flex justify-center">
              <a 
                href={user ? "/dashboard" : "#"}
                onClick={() => !user && document.querySelector<HTMLButtonElement>('[data-auth-trigger]')?.click()}
                className="btn-primary text-sm sm:text-base px-5 py-2.5 sm:px-6 sm:py-3"
              >
                {user ? 'Go to Dashboard' : 'Get Started Free'}
                <ArrowRight className="w-5 h-5 ml-2 inline-block" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Problem vs Solution Section */}
      <section className="py-24 relative bg-gradient-to-b from-background-dark/50 to-background-dark">
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

      {/* Research & Credibility Section */}
      <section className="py-24 relative bg-gradient-to-b from-[#FFD700]/[0.08] to-background-dark">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#FFD700]/[0.03] via-transparent to-transparent opacity-30"></div>
        <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-4xl font-bold text-white text-center mb-4 sm:mb-6">
            Research is Clear: Music Shapes Your Baby's Mind
            <span className="block text-base sm:text-xl font-normal text-white/60 mt-2">
              Leading institutions confirm the profound impact of early musical exposure
            </span>
          </h2>
          
          {/* Mobile pyramid layout */}
          <div className="sm:hidden max-w-3xl mx-auto mb-8">
            <div className="flex justify-center gap-4 mb-4">
              <a href="https://www.gse.harvard.edu" target="_blank" rel="noopener noreferrer" 
                 className="aspect-square w-24 card bg-[#FFD700]/[0.02] hover:bg-[#FFD700]/[0.05] p-3 group
                          transition-all duration-500 hover:scale-105">
                <div className="w-full h-full flex items-center justify-center relative">
                  <div className="text-white/70 group-hover:text-white transition-all duration-300 text-center">
                    <div className="text-2xl font-serif mb-2">H</div>
                    <div className="text-xs">HARVARD</div>
                  </div>
                </div>
              </a>
              <a href="https://www.washington.edu" target="_blank" rel="noopener noreferrer"
                 className="aspect-square w-24 card bg-[#FFD700]/[0.02] hover:bg-[#FFD700]/[0.05] p-3 group
                          transition-all duration-500 hover:scale-105">
                <div className="w-full h-full flex items-center justify-center relative">
                  <div className="text-white/70 group-hover:text-white transition-all duration-300 text-center">
                    <div className="text-2xl font-bold mb-2">UW</div>
                    <div className="text-xs">WASHINGTON</div>
                  </div>
                </div>
              </a>
            </div>
            <div className="flex justify-center gap-4">
              <a href="https://www.ncbi.nlm.nih.gov" target="_blank" rel="noopener noreferrer"
                 className="aspect-square w-24 card bg-[#FFD700]/[0.02] hover:bg-[#FFD700]/[0.05] p-3 group
                          transition-all duration-500 hover:scale-105">
                <div className="w-full h-full flex items-center justify-center relative">
                  <div className="text-white/70 group-hover:text-white transition-all duration-300 text-center">
                    <div className="text-2xl font-bold mb-2">NCBI</div>
                    <div className="text-xs">NIH</div>
                  </div>
                </div>
              </a>
              <a href="https://www.frontiersin.org" target="_blank" rel="noopener noreferrer"
                 className="aspect-square w-24 card bg-[#FFD700]/[0.02] hover:bg-[#FFD700]/[0.05] p-3 group
                          transition-all duration-500 hover:scale-105">
                <div className="w-full h-full flex items-center justify-center relative">
                  <div className="text-white/70 group-hover:text-white transition-all duration-300 text-center">
                    <div className="text-2xl font-bold mb-2">F</div>
                    <div className="text-xs">FRONTIERS</div>
                  </div>
                </div>
              </a>
              <a href="https://www.musictherapy.org" target="_blank" rel="noopener noreferrer"
                 className="aspect-square w-24 card bg-[#FFD700]/[0.02] hover:bg-[#FFD700]/[0.05] p-3 group
                          transition-all duration-500 hover:scale-105">
                <div className="w-full h-full flex items-center justify-center relative">
                  <div className="text-white/70 group-hover:text-white transition-all duration-300 text-center">
                    <div className="text-2xl font-bold mb-2">AMTA</div>
                    <div className="text-xs">MUSIC THERAPY</div>
                  </div>
                </div>
              </a>
            </div>
          </div>
          
          {/* Desktop grid layout */}
          <div className="hidden sm:grid sm:grid-cols-5 gap-4 max-w-3xl mx-auto mb-12">
            {[
              { name: 'H', text: 'HARVARD', url: 'https://www.gse.harvard.edu', isSerif: true },
              { name: 'UW', text: 'WASHINGTON', url: 'https://www.washington.edu' },
              { name: 'NCBI', text: 'NIH', url: 'https://www.ncbi.nlm.nih.gov' },
              { name: 'F', text: 'FRONTIERS', url: 'https://www.frontiersin.org' },
              { name: 'AMTA', text: 'MUSIC THERAPY', url: 'https://www.musictherapy.org' }
            ].map(({ name, text, url, isSerif }) => (
              <a
                key={name}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="aspect-square card bg-[#FFD700]/[0.02] hover:bg-[#FFD700]/[0.05] p-3 group
                         transition-all duration-500 hover:scale-105"
              >
                <div className="w-full h-full flex items-center justify-center relative">
                  <div className="text-white/70 group-hover:text-white transition-all duration-300 text-center">
                    <div className={`text-2xl mb-2 ${isSerif ? 'font-serif' : 'font-bold'}`}>{name}</div>
                    <div className="text-xs">{text}</div>
                  </div>
                </div>
              </a>
            ))}
          </div>
          
          <div className="max-w-3xl mx-auto text-center relative">
            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-32 h-px bg-gradient-to-r from-transparent via-[#FFD700]/50 to-transparent"></div>
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mb-4 sm:mb-6">
              <div className="flex items-center gap-2 text-[#FFD700]/80">
                <Star className="w-5 h-5" fill="currentColor" />
                <span className="text-xs sm:text-sm font-medium">Research</span>
              </div>
              <div className="w-px h-4 bg-[#FFD700]/20"></div>
              <div className="flex items-center gap-2 text-[#FFD700]/80">
                <Brain className="w-5 h-5" />
                <span className="text-xs sm:text-sm font-medium">Science</span>
              </div>
              <div className="w-px h-4 bg-[#FFD700]/20"></div>
              <div className="flex items-center gap-2 text-[#FFD700]/80">
                <Heart className="w-5 h-5" />
                <span className="text-xs sm:text-sm font-medium">Certified</span>
              </div>
            </div>
            <p className="text-base sm:text-lg text-white/80 leading-relaxed">
              Studies show that exposure to complex music before the age of 5 can significantly improve a child's pitch perception. 
              In some cases, it even leads to perfect pitch, a rare auditory skill linked to stronger memory and language abilities.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              {[
                {
                  url: 'https://www.gse.harvard.edu/ideas/usable-knowledge/23/03/does-nature-or-nurture-determine-musical-ability',
                  text: 'Harvard Research'
                },
                {
                  url: 'https://www.washington.edu/news/2016/04/25/music-improves-baby-brain-responses-to-music-and-speech',
                  text: 'UW Research'
                },
                {
                  url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC4951961',
                  text: 'NCBI Paper'
                },
                {
                  url: 'https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2017.00297',
                  text: 'Frontiers Study'
                },
                {
                  url: 'https://www.musictherapy.org/assets/1/7/MT_Young_Children_2006.pdf',
                  text: 'AMTA Study'
                }
              ].map(({ url, text }) => (
                <a
                  key={url}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-lg bg-[#FFD700]/[0.03] hover:bg-[#FFD700]/[0.08] text-white/70 hover:text-white
                           transition-all duration-300 text-sm border border-[#FFD700]/10 hover:border-[#FFD700]/20
                           hover:scale-105 backdrop-blur-sm"
                >
                  {text} →
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4">
              Your Partner in Peaceful Parenting
            </h2>
            <p className="text-base sm:text-lg text-white/70 max-w-2xl mx-auto leading-relaxed px-4">
              What your baby hears shapes their brain. Replace overstimulation with high-quality melodies designed for learning and calm
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto">
            {[
              {
                icon: Heart,
                title: 'Peace of Mind',
                description: 'Finally, screen-free entertainment you can trust, giving you guilt-free moments to yourself'
              },
              {
                icon: Music2,
                title: 'Daily Routines Made Easy',
                description: 'Transform challenging moments into joyful experiences with music designed for every situation'
              },
              {
                icon: Star,
                title: 'Smart Development',
                description: 'While you relax, your baby naturally develops musical intelligence and emotional awareness'
              }
            ].map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="card p-8 text-center group hover:scale-105 transition-all duration-500 relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 
                              group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="w-20 h-20 mx-auto bg-gradient-to-br from-primary/20 to-secondary/10 rounded-2xl 
                              flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500
                              relative">
                  <div className="absolute inset-0 bg-primary/5 rounded-2xl animate-pulse"></div>
                  <Icon className="w-10 h-10 text-primary relative z-10" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-4 group-hover:text-primary transition-colors">{title}</h3>
                <p className="text-white/70 leading-relaxed">{description}</p>
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