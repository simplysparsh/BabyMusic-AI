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
import { usePWAInstall } from './hooks/usePWAInstall';
import { Download, MonitorDown, Monitor } from 'lucide-react';

function App() {
  const { user, initialized, profile, showPostOAuthOnboarding, showPostSignupOnboarding, hidePostOAuthOnboarding, hidePostSignupOnboarding, signOut } = useAuthStore();
  const loadSongs = useSongStore(state => state.loadSongs);
  const setupSubscription = useSongStore(state => state.setupSubscription);
  const [path, setPath] = useState(window.location.pathname);

  // Mount usePWAInstall at the top level to always capture beforeinstallprompt
  const { canInstall, isInstalled } = usePWAInstall();
  const [showPwaFallback, setShowPwaFallback] = useState(false);
  const [pwaFallbackClosed, setPwaFallbackClosed] = useState(false);

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

  // Fallback: detect if app is installable (address bar icon visible) but canInstall is false
  useEffect(() => {
    if (!canInstall && !isInstalled && window.matchMedia('(display-mode: standalone)').matches === false) {
      setShowPwaFallback(true);
    } else {
      setShowPwaFallback(false);
    }
  }, [canInstall, isInstalled]);

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
        isOpen={showPostOAuthOnboarding || showPostSignupOnboarding}
        userProfile={profile}
        onComplete={() => {
          if (showPostOAuthOnboarding) {
            console.log('Onboarding complete callback in App.tsx (OAuth flow)');
            hidePostOAuthOnboarding();
          } else if (showPostSignupOnboarding) {
            console.log('Onboarding complete callback in App.tsx (Email flow)');
            hidePostSignupOnboarding();
          }
        }}
      />

      {/* Fallback PWA install message if prompt is not available but app is installable */}
      {showPwaFallback && !pwaFallbackClosed && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-white/90 border border-primary/10 rounded-lg px-4 py-2 z-[200] shadow-md flex items-center gap-2 text-sm min-w-[260px] max-w-[90vw]" style={{backdropFilter: 'blur(6px)'}}>
          {/* Use MonitorDown if available, else Monitor as fallback */}
          {MonitorDown ? (
            <MonitorDown className="w-4 h-4 text-black/70 flex-shrink-0" aria-hidden="true" />
          ) : (
            <Monitor className="w-4 h-4 text-black/70 flex-shrink-0" aria-hidden="true" />
          )}
          <span className="text-primary font-semibold">Tip:</span>
          <span className="text-black/80">To install the app, look for the <b>install</b> {MonitorDown ? <MonitorDown className="inline w-4 h-4 text-black/70 align-text-bottom" aria-hidden="true" /> : <Monitor className="inline w-4 h-4 text-black/70 align-text-bottom" aria-hidden="true" />} button in your browser's address bar.</span>
          <button
            onClick={() => setPwaFallbackClosed(true)}
            className="ml-2 text-black/40 hover:text-black/70 transition-colors text-base font-bold focus:outline-none px-1 rounded"
            aria-label="Close install tip"
            style={{ lineHeight: 1 }}
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
}

export default App;