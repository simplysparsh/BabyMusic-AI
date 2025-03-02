
import { Flame, Star, Music2, Sparkles, Heart, Zap } from 'lucide-react';

interface DetailedStreakProps {
  streakDays: number;
  dailyGoal: number;
  songsToday: number;
}

export default function DetailedStreak({ streakDays, dailyGoal, songsToday }: DetailedStreakProps) {
  return (
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
                color: '#FFC107',
                borderColor: '#FFB300',
                earned: true
              },
              { 
                icon: Flame, 
                label: '3 Days',
                color: '#FF5722',
                borderColor: '#F4511E',
                earned: true 
              },
              { 
                icon: Music2, 
                label: '10 Songs',
                color: '#4CAF50',
                borderColor: '#43A047',
                earned: true 
              },
              { 
                icon: Zap, 
                label: '7 Days',
                color: '#9C27B0',
                borderColor: '#8E24AA',
                earned: false 
              },
              {
                icon: Heart,
                label: '20 Songs',
                color: '#E91E63',
                borderColor: '#D81B60',
                earned: false
              }
            ].map(({ icon: Icon, label, color, borderColor, earned }) => (
              <div 
                key={label}
                className={`flex-none group relative ${earned ? '' : 'opacity-40 grayscale'}`}
                title={label}
              >
                <div className="relative w-10 h-10">
                  <div 
                    className="w-full h-full relative"
                    style={{
                      clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                      background: earned 
                        ? `linear-gradient(135deg, ${color}, ${borderColor})`
                        : 'linear-gradient(135deg, #4A5568, #2D3748)',
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
  );
}