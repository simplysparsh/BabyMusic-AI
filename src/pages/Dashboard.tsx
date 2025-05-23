import PresetSongs from '../components/PresetSongs';
import MusicGenerator from '../components/MusicGenerator';
import SongList from '../components/SongList';
import { useRealtime } from '../hooks/useRealtime';
import Footer from '../components/Footer';
import { useAuthStore } from '../store/authStore';
import MiniStreak from '../components/dashboard/MiniStreak';
import DetailedStreak from '../components/dashboard/DetailedStreak';
import { useStreakStore } from '../store/streakStore';
import { useEffect, useRef, useState } from 'react';
import { StreakService } from '../services/streakService';
import { useSongStore } from '../store/songStore';

export default function Dashboard() {
  const { profile, user, initialized } = useAuthStore();
  const { streakData, isLoading: isStreakLoading, setStreakData, setLoading: setStreakLoading } = useStreakStore();
  const { songs } = useSongStore();
  const hasSongs = songs.length > 0;
  const wasHidden = useRef(false);
  const [isBannerClosed, setIsBannerClosed] = useState(false);
  
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

  // Check if the service unavailable banner should be shown
  const showUnavailableBannerEnv = import.meta.env.VITE_SHOW_UNAVAILABLE_BANNER?.toLowerCase() === 'true';

  if (!initialized) {
    return (
      <div className="min-h-screen bg-background-dark flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <main className="scroll-container relative overflow-hidden min-h-screen">
      {/* Balanced OG Image-Inspired Background - Darker base with subtle color hints */}
      <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900"></div>
      <div className="fixed inset-0 bg-gradient-to-tr from-purple-900/15 via-pink-900/10 to-blue-900/15"></div>
      <div className="fixed inset-0 bg-gradient-to-bl from-orange-900/8 via-transparent to-green-900/6"></div>
      
      {/* Enhanced Animated Background Elements - Subtle but beautiful */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Floating orbs - more subtle but still present */}
        <div className="absolute top-20 left-4 w-40 h-40 bg-gradient-to-br from-yellow-400/8 to-orange-400/6 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0s', animationDuration: '8s' }}></div>
        <div className="absolute top-60 right-8 w-32 h-32 bg-gradient-to-br from-cyan-400/10 to-blue-400/8 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s', animationDuration: '10s' }}></div>
        <div className="absolute top-96 left-1/2 -translate-x-1/2 w-48 h-48 bg-gradient-to-br from-pink-400/8 to-purple-400/6 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s', animationDuration: '12s' }}></div>
        <div className="absolute bottom-40 right-4 w-36 h-36 bg-gradient-to-br from-emerald-400/10 to-green-400/8 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '6s', animationDuration: '9s' }}></div>
        
        {/* Subtle texture overlay */}
        <div className="absolute inset-0 opacity-[0.015]" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)`,
          backgroundSize: '32px 32px'
        }}></div>
        
        {/* Gentle vignette effect */}
        <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-black/10"></div>
      </div>

      {/* Service Temporarily Unavailable Banner */}
      {showUnavailableBannerEnv && !isBannerClosed && (
        <div className="bg-yellow-500 text-yellow-900 p-4 sticky top-0 z-[101] flex justify-between items-center">
          <div className="flex-grow text-center">
            <p className="font-semibold">Service Temporarily Unavailable</p>
            <p>We are currently performing maintenance. Please check back later.</p>
          </div>
          <button 
            onClick={() => setIsBannerClosed(true)} 
            className="text-yellow-900 hover:text-yellow-700 ml-4 p-1 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-700"
            aria-label="Close banner"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>
      )}
      
      <section className="pt-20 pb-16 px-4 relative">
        {/* Header with Mini Streak - Enhanced */}
        <div className="max-w-4xl mx-auto mb-8 relative">
          {/* Subtle floating particles around header */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-4 left-8 w-1 h-1 bg-yellow-400/80 rounded-full animate-ping" style={{ animationDelay: '0s', animationDuration: '3s' }}></div>
            <div className="absolute top-12 right-12 w-1.5 h-1.5 bg-pink-400/80 rounded-full animate-ping" style={{ animationDelay: '1s', animationDuration: '4s' }}></div>
            <div className="absolute bottom-8 left-16 w-1 h-1 bg-cyan-400/80 rounded-full animate-ping" style={{ animationDelay: '2s', animationDuration: '3.5s' }}></div>
            <div className="absolute bottom-4 right-8 w-1 h-1 bg-emerald-400/80 rounded-full animate-ping" style={{ animationDelay: '1.5s', animationDuration: '4.5s' }}></div>
          </div>
          
          <div className="text-center mb-6 relative z-10">
            {/* Enhanced welcome text with excellent contrast */}
            <div className="relative">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 leading-tight px-2 
                           drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                {profile?.babyName ? `Welcome back, ${profile.babyName}'s Parent! 👋` : 'Welcome back! 👋'}
              </h1>
              <div className="absolute -inset-4 bg-gradient-to-r from-transparent via-purple-400/5 to-transparent blur-xl opacity-50 rounded-full"></div>
            </div>
            <p className="text-white/90 text-sm sm:text-base px-4 leading-relaxed 
                       drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
              Let's create some magical melodies together
            </p>
            
            {/* Refined decorative elements */}
            <div className="flex justify-center items-center gap-2 mt-4 mb-2">
              <div className="w-8 h-px bg-gradient-to-r from-transparent via-yellow-400/40 to-transparent"></div>
              <div className="w-1.5 h-1.5 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full animate-pulse shadow-sm"></div>
              <div className="w-12 h-px bg-gradient-to-r from-transparent via-pink-400/40 to-transparent"></div>
              <div className="w-1 h-1 bg-gradient-to-br from-cyan-400 to-blue-400 rounded-full animate-pulse shadow-sm" style={{ animationDelay: '0.5s' }}></div>
              <div className="w-8 h-px bg-gradient-to-r from-transparent via-emerald-400/40 to-transparent"></div>
            </div>
          </div>
          
          {/* Enhanced MiniStreak container with better backdrop */}
          <div className="flex justify-center relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-400/5 via-pink-400/8 to-cyan-400/5 blur-xl rounded-full"></div>
            <MiniStreak 
              streakDays={streakData?.currentStreak ?? 0} 
              isLoading={isStreakLoading || streakData === null}
            />
          </div>
        </div>

        {/* Content sections with enhanced spacing and better contrast */}
        <div className="space-y-12 sm:space-y-16 relative z-10">
          <PresetSongs />
          <MusicGenerator />
        </div>
        
        <div className="scroll-optimize">
          <div className="mt-16 sm:mt-20 max-w-2xl mx-auto relative z-10">
            {hasSongs && (
              <div className="text-center mb-8 relative">
                {/* Enhanced section header with better contrast */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent blur-2xl rounded-full"></div>
                <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-yellow-300 via-white to-pink-300 
                            bg-clip-text text-transparent mb-4 relative drop-shadow-lg">
                  Your Melodies
                </h2>
                <p className="text-sm sm:text-base text-white/85 font-normal px-4 
                           drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                  Your collection of personalized songs
                </p>
                
                {/* Decorative line */}
                <div className="flex justify-center mt-4">
                  <div className="w-16 h-px bg-gradient-to-r from-transparent via-yellow-400/50 to-transparent"></div>
                </div>
              </div>
            )}
            <SongList />
          </div>

          {/* Detailed Streak Section */}
          {import.meta.env.VITE_FEATURE_STREAK_ENABLED?.toLowerCase() === 'true' && (
            <div className="mt-24 max-w-2xl mx-auto relative">
              {/* Background glow for streak section */}
              <div className="absolute inset-0 bg-gradient-to-br from-orange-400/8 via-transparent to-pink-400/8 blur-3xl rounded-full"></div>
              
              <div className="text-center mb-8 relative z-10">
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2 
                             drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                  Your Progress
                </h2>
                <div className="flex justify-center">
                  <div className="w-12 h-px bg-gradient-to-r from-transparent via-orange-400/50 to-transparent"></div>
                </div>
              </div>
              
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