import Header from './components/Header';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Methodology from './pages/Methodology';
import { useEffect, useState, Suspense } from 'react';
import { useAuthStore } from './store/authStore'; 
import { useSongStore } from './store/songStore';

function App() {
  const { user, initialized } = useAuthStore();
  const { loadSongs, setupSubscription, songs, generatingSongs } = useSongStore();
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

  // Diagnostic logging to understand song state inconsistencies
  useEffect(() => {
    if (songs.length > 0 && generatingSongs.size > 0) {
      // Check for songs that are in generatingSongs but have NULL task_id
      const songsInGeneratingWithNullTaskId = songs.filter(
        song => song.task_id === null && generatingSongs.has(song.id)
      );
      
      // Check for songs with NULL task_id that are not in generatingSongs
      const songsWithNullTaskIdNotInGenerating = songs.filter(
        song => song.task_id === null && !generatingSongs.has(song.id)
      );
      
      // Log diagnostic info
      if (songsInGeneratingWithNullTaskId.length > 0) {
        console.log('DIAGNOSTIC: Found songs with NULL task_id that are still in generatingSongs:', 
          songsInGeneratingWithNullTaskId.map(s => ({ id: s.id, name: s.name })));
      }
      
      if (songsWithNullTaskIdNotInGenerating.length > 0) {
        console.log('DIAGNOSTIC: Songs with NULL task_id correctly not in generatingSongs:', 
          songsWithNullTaskIdNotInGenerating.length);
      }
      
      // Log all songs in generating state
      console.log('DIAGNOSTIC: Current songs in generatingSongs:', 
        Array.from(generatingSongs).map(id => {
          const song = songs.find(s => s.id === id);
          return {
            id,
            name: song?.name,
            hasTaskId: !!song?.task_id,
            taskIdValue: song?.task_id
          };
        }));
    }
  }, [songs, generatingSongs]);

  // Set up song subscription and load songs when user is authenticated
  useEffect(() => {
    if (user) {
      setupSubscription();
      loadSongs().catch(error => {
        console.error('Failed to load songs:', error);
      });
    }
  }, [user, setupSubscription, loadSongs]);

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