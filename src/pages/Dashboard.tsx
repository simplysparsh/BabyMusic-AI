import PresetSongs from '../components/PresetSongs';
import MusicGenerator from '../components/MusicGenerator';
import SongList from '../components/SongList';
import { useErrorStore } from '../store/errorStore';
import { useRealtime } from '../hooks/useRealtime';
import Footer from '../components/Footer';
import { useAuthStore } from '../store/authStore';
import MiniStreak from '../components/dashboard/MiniStreak';
import DetailedStreak from '../components/dashboard/DetailedStreak';
import { useStreakStore } from '../store/streakStore';
import { useEffect, useRef } from 'react';
import { StreakService } from '../services/streakService';
import { useSongStore } from '../store/songStore';

export default function Dashboard() {
  const error = useErrorStore(state => state.error);
  const { profile, user, initialized } = useAuthStore();
  const { streakData, isLoading: isStreakLoading, setStreakData, setLoading: setStreakLoading } = useStreakStore();
  const { songs } = useSongStore();
  const hasSongs = songs.length > 0;
  const wasHidden = useRef(false);
  
  useRealtime();

  // Initial streak data load
  useEffect(() => {
    const loadStreak = async () => {
      if (user && initialized) {
        setStreakLoading(true);
        const data = await StreakService.fetchStreakData(user.id);
        setStreakData(data);
        setStreakLoading(false);
      }
    };
    loadStreak();
  }, [user, initialized, setStreakData, setStreakLoading]);

  // Handle visibility changes (tab switching)
  useEffect(() => {
    const handleVisibilityChange = async () => {
      // If the page becomes visible and was previously hidden
      if (!document.hidden && wasHidden.current && user?.id) {
        wasHidden.current = false;
        
        // Only fetch new data if we don't already have streak data
        // or to refresh after a longer period (could add timestamp check)
        if (!streakData || isStreakLoading) {
          setStreakLoading(true);
          const data = await StreakService.fetchStreakData(user.id);
          setStreakData(data);
          setStreakLoading(false);
        }
      } else if (document.hidden) {
        wasHidden.current = true;
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [user, streakData, isStreakLoading, setStreakData, setStreakLoading]);

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
    <main className="scroll-container">
      {/* Error banner removed - we'll use the Header banner for all errors */}
      
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
            <MiniStreak 
              streakDays={streakData?.currentStreak ?? 0} 
              isLoading={isStreakLoading || streakData === null}
            />
          </div>
        </div>

        <PresetSongs />
        <MusicGenerator />
        
        <div className="scroll-optimize">
          <div className="mt-16 max-w-2xl mx-auto relative z-10">
            {hasSongs && (
              <h2 className="text-4xl font-bold bg-gradient-to-r from-primary via-white to-secondary 
                          bg-clip-text text-transparent mb-8 text-center">
                Your Melodies
                <span className="block text-base text-white/60 font-normal mt-2">
                  Your collection of personalized songs
                </span>
              </h2>
            )}
            <SongList />
          </div>

          {/* Detailed Streak Section */}
          {import.meta.env.VITE_FEATURE_STREAK_ENABLED?.toLowerCase() === 'true' && (
            <div className="mt-24 max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold text-white mb-8 text-center">
                Your Progress
              </h2>
              <DetailedStreak
                streakDays={streakData?.currentStreak ?? 0} 
                isLoading={isStreakLoading || streakData === null}
                dailyGoal={dailyGoal}
                songsToday={songsToday}
              />
            </div>
          )}
        </div>
      </section>
      <Footer />
    </main>
  );
}