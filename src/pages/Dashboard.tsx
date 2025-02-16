import React from 'react';
import PresetSongs from '../components/PresetSongs';
import MusicGenerator from '../components/MusicGenerator';
import SongList from '../components/SongList';
import { useErrorStore } from '../store/errorStore';
import { useRealtime } from '../hooks/useRealtime';
import Footer from '../components/Footer';
import { Sparkles, Star, Trophy, Music2, Heart, Flame, Zap } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

export default function Dashboard() {
  const error = useErrorStore(state => state.error);
  const { profile } = useAuthStore();
  useRealtime();

  const achievements = [
    { icon: Star, label: 'First Song', description: 'Created your first melody', completed: true },
    { icon: Trophy, label: 'Bedtime Master', description: '5 bedtime songs created', completed: true },
    { icon: Zap, label: 'Melody Maker', description: '10 songs generated', completed: false }
  ];

  const streakDays = 5;
  const dailyGoal = 3;
  const songsToday = 2;

  return (
    <main>
      {error && (
        <div className="fixed top-16 left-0 right-0 z-50 p-4 bg-red-500/90 backdrop-blur-sm text-white text-center">
          {error}
        </div>
      )}
      <section className="pt-20 pb-16 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-background-dark via-background-dark to-black opacity-50"></div>
        
        {/* Welcome Header */}
        <div className="max-w-4xl mx-auto mb-12 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Welcome back, {profile?.babyName}'s Parent! 👋
          </h1>
          <p className="text-white/60">Let's create some magical melodies together</p>
        </div>

        {/* Mascot and Stats Section */}
        <div className="max-w-3xl mx-auto mb-12">
          <div className="relative overflow-hidden group rounded-3xl bg-gradient-to-br from-[#34D399] via-[#F59E0B] to-[#EC4899]
                         p-[2px] hover:p-[3px] transition-all duration-300">
            <div className="bg-black/90 rounded-[22px] p-4 sm:p-6 relative overflow-hidden">
              {/* Animated background particles */}
              <div className="absolute inset-0">
                <div className="absolute top-10 left-10 w-32 h-32 bg-[#34D399]/20 rounded-full blur-2xl animate-pulse"></div>
                <div className="absolute bottom-10 right-10 w-32 h-32 bg-[#F59E0B]/20 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-[#EC4899]/20 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }}></div>
              </div>

            {/* Stats Content */}
            <div className="w-full">
              {/* Streak Section */}
              <div className="flex flex-col sm:flex-row items-start sm:items-centers gap-4 sm:gap-6 mb-8">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-[#F59E0B] to-[#EC4899] blur-lg opacity-50"></div>
                        <div className="relative p-2 bg-black/50 backdrop-blur-xl rounded-xl border border-white/10">
                          <Flame className="w-6 h-6 text-[#F59E0B] animate-pulse" />
                        </div>
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                          {streakDays} Day Streak
                          <Sparkles className="w-5 h-5 text-[#F59E0B] animate-sparkle" />
                        </h3>
                        <p className="text-white/60 text-sm">Play songs daily to keep your streak</p>
                      </div>
                    </div>
                  </div>
                
                  {/* Daily Goal Progress */}
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-white/60 text-sm">Daily Song Goal</p>
                    <p className="text-white/80 text-sm font-medium ml-4">{songsToday}/{dailyGoal} songs</p>
                  </div>
                  <div className="h-3 bg-black/50 backdrop-blur-xl rounded-full overflow-hidden border border-white/10 relative">
                    <div 
                      className="h-full bg-gradient-to-r from-[#34D399] via-[#F59E0B] to-[#EC4899]
                               transition-all duration-500 animate-pulse"
                      style={{ width: `${(songsToday / dailyGoal) * 100}%` }}
                    >
                      <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Quick Stats */}
              <div className="flex justify-between gap-4">
                <div className="hidden sm:flex flex-1 items-center gap-4 p-4 bg-black/50 backdrop-blur-xl rounded-xl border border-white/10
                             hover:border-white/20 transition-all duration-300 group relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#34D399]/10 via-transparent to-transparent opacity-0 
                               group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative w-12 h-12 rounded-full bg-[#34D399]/20 flex items-center justify-center
                               group-hover:scale-110 transition-transform duration-500">
                    <Music2 className="w-6 h-6 text-[#34D399]" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white">145</h4>
                    <p className="text-xs text-white/60">Minutes Played</p>
                  </div>
                </div>
                <div className="hidden sm:flex flex-1 items-center gap-4 p-4 bg-black/50 backdrop-blur-xl rounded-xl border border-white/10
                             hover:border-white/20 transition-all duration-300 group relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#EC4899]/10 via-transparent to-transparent opacity-0 
                               group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative w-12 h-12 rounded-full bg-[#EC4899]/20 flex items-center justify-center
                               group-hover:scale-110 transition-transform duration-500">
                    <Star className="w-6 h-6 text-[#EC4899]" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white">12</h4>
                    <p className="text-xs text-white/60">Songs Created</p>
                  </div>
                </div>
                {/* Mobile Stats */}
                <div className="flex sm:hidden items-center gap-2 px-3 py-2 bg-black/50 backdrop-blur-xl rounded-xl border border-white/10">
                  <Music2 className="w-5 h-5 text-[#34D399]" />
                  <div>
                    <h4 className="text-lg font-bold text-white">145</h4>
                    <p className="text-xs text-white/60">Minutes Played</p>
                  </div>
                </div>
                <div className="flex sm:hidden items-center gap-2 px-3 py-2 bg-black/50 backdrop-blur-xl rounded-xl border border-white/10">
                  <Star className="w-5 h-5 text-[#EC4899]" />
                  <div>
                    <h4 className="text-lg font-bold text-white">12</h4>
                    <p className="text-xs text-white/60">Songs Created</p>
                  </div>
                </div>
              </div>
              
              {/* Badges */}
              <div className="mt-8 flex gap-6 overflow-x-auto pb-2 scrollbar-hide">
                {[
                  {
                    icon: Star,
                    label: 'First Song',
                    color: '#FFD700',
                    borderColor: '#FFA000',
                    earned: true
                  },
                  { 
                    icon: Flame, 
                    label: '3 Days',
                    color: '#FF6B6B',
                    borderColor: '#E03131',
                    earned: true 
                  },
                  { 
                    icon: Music2, 
                    label: '10 Songs',
                    color: '#51CF66',
                    borderColor: '#2F9E44',
                    earned: true 
                  },
                  { 
                    icon: Zap, 
                    label: '7 Days',
                    color: '#CC5DE8',
                    borderColor: '#9C36B5',
                    earned: false 
                  },
                  {
                    icon: Heart,
                    label: '20 Songs',
                    color: '#FF8787',
                    borderColor: '#FA5252',
                    earned: false
                  }
                ].map(({ icon: Icon, label, color, borderColor, earned }) => (
                  <div 
                    key={label}
                    className={`flex-none group relative ${earned ? '' : 'opacity-40 grayscale'}`}
                    title={label}
                  >
                    <div className="relative w-8 h-8">
                      <div 
                        className="w-full h-full rounded-full relative overflow-hidden"
                        style={{
                          backgroundColor: earned ? color : '#4A5568',
                          border: `2px solid ${earned ? borderColor : '#2D3748'}`
                        }}
                      >
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Icon className={`w-4 h-4 ${earned ? 'text-white' : 'text-white/40'} 
                                        group-hover:scale-110 transition-transform duration-500`} />
                        </div>
                      </div>
                    </div>
                    <p className="text-[10px] text-white/80 text-center mt-1">{label}</p>
                  </div>
                ))}
              </div>
            </div>
            </div>
          </div>
        </div>

        {/* Achievements Section */}
        <div className="max-w-3xl mx-auto mb-12 px-4">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <Trophy className="w-6 h-6 text-primary" />
            Achievements
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {achievements.map(({ icon: Icon, label, description, completed }) => (
              <div key={label} className={`card p-4 relative overflow-hidden
                                       ${completed 
                                         ? 'bg-gradient-to-br from-primary/20 to-secondary/20' 
                                         : 'bg-white/5'}`}>
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${completed ? 'bg-primary/20' : 'bg-white/10'}`}>
                    <Icon className={`w-6 h-6 ${completed ? 'text-primary' : 'text-white/40'}`} />
                  </div>
                  <div>
                    <h3 className="font-medium text-white mb-1">{label}</h3>
                    <p className="text-sm text-white/60">{description}</p>
                  </div>
                  {completed && (
                    <Sparkles className="absolute top-2 right-2 w-4 h-4 text-primary animate-pulse" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <PresetSongs />
        <MusicGenerator />
        <div className="mt-16 max-w-2xl mx-auto relative z-10">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Your Melodies</h2>
          <SongList />
        </div>
      </section>
      <Footer />
    </main>
  );
}