import React from 'react';
import PresetSongs from '../components/PresetSongs';
import MusicGenerator from '../components/MusicGenerator';
import SongList from '../components/SongList';
import { useErrorStore } from '../store/errorStore';
import { useRealtime } from '../hooks/useRealtime';
import Footer from '../components/Footer';
import { Sparkles } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import MiniStreak from '../components/dashboard/MiniStreak';
import DetailedStreak from '../components/dashboard/DetailedStreak';

export default function Dashboard() {
  const error = useErrorStore(state => state.error);
  const { profile, initialized } = useAuthStore();
  useRealtime();

  const streakDays = 5;
  const dailyGoal = 3;
  const songsToday = 2;

  if (!initialized) {
    return (
      <div className="min-h-screen bg-background-dark flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

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
          <div className="text-center mb-4 relative z-10">
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
              {profile?.babyName ? `Welcome back, ${profile.babyName}'s Parent! 👋` : 'Welcome back! 👋'}
            </h1>
            <p className="text-white/70">
              Let's create some magical melodies together
            </p>
          </div>
          <div className="flex justify-center">
            <MiniStreak streakDays={streakDays} />
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
        <div className="mt-24 max-w-2xl mx-auto">
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