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
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 tracking-tight">
              Musical Adventures for Your
              <span className="block bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Little One
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-white/80 mb-8 max-w-2xl mx-auto leading-relaxed">
              Create personalized melodies that inspire learning, creativity, and development
              through the magic of AI-powered music.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a 
                href={user ? "/dashboard" : "#"}
                onClick={() => !user && document.querySelector<HTMLButtonElement>('[data-auth-trigger]')?.click()}
                className="btn-primary"
              >
                {user ? 'Go to Dashboard' : 'Get Started Free'}
                <ArrowRight className="w-5 h-5 ml-2 inline-block" />
              </a>
              <a href="#features" className="btn-secondary">
                Learn More
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Problem vs Solution Section */}
      <section className="py-24 relative bg-gradient-to-b from-background-dark/50 to-background-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-white text-center mb-8">
            Why Most Baby Music & TV Might Be Harming Your Child
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Problem Side */}
            <div className="card p-8 bg-red-500/5 border-red-500/10 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent"></div>
              <div className="w-32 h-32 mx-auto mb-8 relative">
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
            <div className="card p-8 bg-green-500/5 border-green-500/10 relative overflow-hidden group">
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

      {/* Features Section */}
      <section id="features" className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Why Choose MelodyNest?
            </h2>
            <p className="text-lg text-white/70 max-w-2xl mx-auto">
              Discover a world of musical possibilities designed specifically for your child's development.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Music2,
                title: 'AI-Powered Music',
                description: 'Unique melodies tailored to your child\'s development stage'
              },
              {
                icon: Heart,
                title: 'Special Moments',
                description: 'Create songs for playtime, mealtime, bedtime, and more'
              },
              {
                icon: Brain,
                title: 'Development Focused',
                description: 'Support cognitive growth through musical engagement'
              },
              {
                icon: Star,
                title: 'Multiple Variations',
                description: 'Get different versions of each song to keep things fresh'
              }
            ].map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="card p-6 text-center hover:scale-105 transition-all duration-500"
              >
                <div className="w-16 h-16 mx-auto bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
                  <Icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{title}</h3>
                <p className="text-white/70">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 relative bg-gradient-to-b from-background-dark to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Benefits of Early Music Education
            </h2>
            <p className="text-lg text-white/70 max-w-2xl mx-auto">
              Research shows that early exposure to music has profound effects on child development.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[
              {
                title: 'Cognitive Development',
                stat: '23%',
                description: 'Increase in problem-solving abilities'
              },
              {
                title: 'Language Skills',
                stat: '6mo',
                description: 'Faster language development'
              },
              {
                title: 'Emotional Growth',
                stat: '37%',
                description: 'Reduction in stress levels'
              },
              {
                title: 'Memory Capacity',
                stat: '20%',
                description: 'Improvement in memory retention'
              }
            ].map(({ title, stat, description }) => (
              <div
                key={title}
                className="card p-8 text-center hover:scale-105 transition-all duration-500"
              >
                <div className="text-4xl font-bold text-primary mb-2">{stat}</div>
                <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
                <p className="text-white/70">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="card p-12 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10"></div>
            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
                Start Your Musical Journey Today
              </h2>
              <p className="text-lg text-white/70 mb-8 max-w-2xl mx-auto">
                Join thousands of parents who are enriching their children's lives through the power of personalized music.
              </p>
              <button 
                onClick={() => document.querySelector<HTMLButtonElement>('[data-auth-trigger]')?.click()}
                className="btn-primary"
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