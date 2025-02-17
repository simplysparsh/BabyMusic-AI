import React from 'react';
import PresetSongs from '../components/PresetSongs';
import MusicGenerator from '../components/MusicGenerator';
import SongList from '../components/SongList';
import { useErrorStore } from '../store/errorStore';
import { useRealtime } from '../hooks/useRealtime';
import Footer from '../components/Footer';
import { Sparkles, Star, Trophy, Music2, Heart, Zap } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import MiniStreak from '../components/dashboard/MiniStreak';
import DetailedStreak from '../components/dashboard/DetailedStreak';

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
        
        {/* Header with Mini Streak */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="text-center mb-4">
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
              Welcome back, {profile?.babyName}'s Parent! 👋
            </h1>
            <p className="text-white/60">Let's create some magical melodies together</p>
          </div>
          <div className="flex justify-center">
            <MiniStreak streakDays={streakDays} />
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
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            Your Melodies
          </h2>
          <SongList />
        </div>

        {/* Detailed Streak Section */}
        <div className="mt-24 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            Your Progress
          </h2>
          <DetailedStreak
            streakDays={streakDays}
            dailyGoal={dailyGoal}
            songsToday={songsToday}
          />
        </div>
      </section>
      <Footer />
    </main>
  );
}