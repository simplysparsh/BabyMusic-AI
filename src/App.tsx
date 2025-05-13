import Header from './components/Header';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Methodology from './pages/Methodology';
import PremiumPage from './pages/PremiumPage';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import { useEffect, useState, Suspense } from 'react';
import { useAuthStore } from './store/authStore'; 
import { useSongStore } from './store/songStore';
import { forceTokenRefresh, getLastSuccessfulRefresh, registerSessionExpiredCallback } from './lib/supabase';
import OnboardingModal from './components/auth/OnboardingModal';

function App() {
  const { user, initialized, profile, showPostSignupOnboarding, hidePostSignupOnboarding, signOut } = useAuthStore();
  const loadSongs = useSongStore(state => state.loadSongs);
  const setupSubscription = useSongStore(state => state.setupSubscription);
  const [path, setPath] = useState(window.location.pathname);

  // Handle client-side navigation
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'A' && (target as HTMLAnchorElement).href.startsWith(window.location.origin)) {
        e.preventDefault();
        const newPath = new URL((target as HTMLAnchorElement).href).pathname;
        window.history.pushState({}, '', newPath);
        setPath(newPath);
      }
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  // Handle authentication state changes (without manual interval)
  useEffect(() => {
    if (initialized && user) {
      registerSessionExpiredCallback(signOut);
      loadSongs();
      setupSubscription(user.id);
    }
  }, [initialized, user, loadSongs, setupSubscription, signOut]);

  // Refresh token when app regains focus after being in background
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && user) {
        const lastRefresh = getLastSuccessfulRefresh();
        if (Date.now() - lastRefresh > 45 * 60 * 1000) {
          console.log('App became visible, performing backup token refresh');
          forceTokenRefresh();
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [user]);

  // Show loading spinner while auth state is initializing
  if (!initialized) {
    return (
      <div className="min-h-screen bg-background-dark flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-dark">
      <Header />
      <Suspense fallback={null}>
        {path === '/methodology' ? (
          <Methodology />
        ) : path === '/premium' ? (
          <PremiumPage />
        ) : path === '/privacy' ? (
          <PrivacyPolicy />
        ) : path === '/terms' ? (
          <TermsOfService />
        ) : (
          user ? <Dashboard /> : <Landing />
        )}
      </Suspense>
      
      <OnboardingModal 
        isOpen={showPostSignupOnboarding}
        userProfile={profile}
        onComplete={() => {
          console.log('Onboarding complete callback in App.tsx');
          hidePostSignupOnboarding();
        }}
      />
    </div>
  );
}

export default App;