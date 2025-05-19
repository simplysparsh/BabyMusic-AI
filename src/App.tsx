import Header from './components/Header';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Methodology from './pages/Methodology';
import PremiumPage from './pages/PremiumPage';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import { useEffect, useState, Suspense } from 'react';
import { useAuthStore, SignupMethod } from './store/authStore'; 
import { useSongStore } from './store/songStore';
import { forceTokenRefresh, getLastSuccessfulRefresh, registerSessionExpiredCallback } from './lib/supabase';
import OAuthOnboardingModal from './components/auth/OAuthOnboardingModal';
import EmailOnboardingModal from './components/auth/EmailOnboardingModal';
import { usePWAInstall } from './hooks/usePWAInstall';
import IOSInstallModal from './components/common/IOSInstallModal';
import { useUIStore } from './store/uiStore';

function App() {
  const { user, initialized, profile, signOut, clearOnboardingInProgress } = useAuthStore();
  const loadSongs = useSongStore(state => state.loadSongs);
  const setupSubscription = useSongStore(state => state.setupSubscription);
  const [path, setPath] = useState(window.location.pathname);
  const [isIOSInstallModalOpen, setIsIOSInstallModalOpen] = useState(false);
  const isOnboardingOpen = useUIStore(state => state.isOnboardingOpen);
  const signupMethod = useUIStore(state => state.signupMethod);
  const closeOnboarding = useUIStore(state => state.closeOnboarding);

  // Mount usePWAInstall at the top level to always capture beforeinstallprompt
  usePWAInstall();

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
    // IMPORTANT: This logic ensures onboarding modal is shown after OAuth signups.
    // When using OAuth, the app redirects away and reloads, losing in-memory state.
    // We persist onboarding intent in localStorage before redirect, and check here on app load.
    // If the flag is present, we trigger onboarding via Zustand and clear the flag.
    // DO NOT REMOVE this check unless you have an alternative way to persist onboarding intent across OAuth redirects.
    if (initialized && user) {
      const onboardingFlag = localStorage.getItem('onboardingInProgress');
      const lastSignupMethod = localStorage.getItem('lastSignupMethod');
      if (onboardingFlag === 'true' && lastSignupMethod) {
        useUIStore.getState().openOnboarding(lastSignupMethod as SignupMethod);
        localStorage.removeItem('onboardingInProgress');
        localStorage.removeItem('lastSignupMethod');
      }
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
      
      {/* OAuth Onboarding Modal */}
      <OAuthOnboardingModal 
        isOpen={isOnboardingOpen && signupMethod === SignupMethod.OAuth}
        userProfile={profile}
        onComplete={closeOnboarding}
        onShouldShowIOSInstallInstructions={() => setIsIOSInstallModalOpen(true)}
      />

      {/* Email Onboarding Modal */}
      <EmailOnboardingModal 
        isOpen={isOnboardingOpen && signupMethod === SignupMethod.Email}
        userProfile={profile}
        onComplete={closeOnboarding}
        onShouldShowIOSInstallInstructions={() => setIsIOSInstallModalOpen(true)}
      />

      <IOSInstallModal 
        isOpen={isIOSInstallModalOpen}
        onClose={() => {
          setIsIOSInstallModalOpen(false);
          closeOnboarding();
        }}
      />
    </div>
  );
}

export default App;