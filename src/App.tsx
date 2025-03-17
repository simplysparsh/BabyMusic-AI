import Header from './components/Header';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Methodology from './pages/Methodology';
import { useEffect, useState, Suspense } from 'react';
import { useAuthStore } from './store/authStore'; 
import { useSongStore } from './store/songStore';
import { useResetGenerating } from './hooks/useResetGenerating';
import { SongStateService as _SongStateService } from './services/songStateService';

function App() {
  const { user, initialized } = useAuthStore();
  const { loadSongs, setupSubscription, resetGeneratingState } = useSongStore();
  const { hasStuckSongs, stuckSongCount } = useResetGenerating();
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

  // Set up song subscription and load songs when user is authenticated
  useEffect(() => {
    if (user) {
      setupSubscription();
      loadSongs().catch(error => {
        console.error('Failed to load songs:', error);
      });
    }
  }, [user, setupSubscription, loadSongs]);

  // Check for stuck songs on app load
  useEffect(() => {
    if (user && hasStuckSongs) {
      const checkStuckSongs = async () => {
        try {
          // No need to check for inconsistent states anymore
          
          // This will reconcile UI state with database state
          await loadSongs();
          
          // If there are still stuck songs after reconciliation, reset them
          if (hasStuckSongs) {
            await resetGeneratingState();
          }
        } catch (error) {
          console.error('Error checking stuck songs:', error);
        }
      };
      
      checkStuckSongs();
    }
  }, [user, hasStuckSongs, stuckSongCount, loadSongs, resetGeneratingState]);

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
        ) : (
          user ? <Dashboard /> : <Landing />
        )}
      </Suspense>
    </div>
  );
}

export default App;