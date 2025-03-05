import Header from './components/Header';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Methodology from './pages/Methodology';
import { useEffect, useState, Suspense } from 'react';
import { useAuthStore } from './store/authStore'; 
import { useSongStore } from './store/songStore';
import { useResetGenerating } from './hooks/useResetGenerating';

function App() {
  const { user, initialized } = useAuthStore();
  const { loadSongs, setupSubscription, resetGeneratingState } = useSongStore();
  const { hasStuckSongs, stuckSongCount } = useResetGenerating();
  const [path, setPath] = useState(window.location.pathname);

  // Debug log for environment variables
  useEffect(() => {
    console.log('App mounted, VITE_DISABLE_SIGNUP:', import.meta.env.VITE_DISABLE_SIGNUP);
  }, []);

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
      loadSongs();
    }
  }, [user, setupSubscription, loadSongs]);

  // Check for stuck songs on app load
  useEffect(() => {
    if (user && hasStuckSongs) {
      console.log(`Found ${stuckSongCount} stuck songs on app load, attempting to fix...`);
      
      // Check if these songs actually exist in the database
      const checkStuckSongs = async () => {
        try {
          // This will reconcile UI state with database state
          await loadSongs();
          
          // If there are still stuck songs after reconciliation, reset them
          if (hasStuckSongs) {
            console.log(`Still have ${stuckSongCount} stuck songs after reconciliation, resetting...`);
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