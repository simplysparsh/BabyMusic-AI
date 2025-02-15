import React from 'react';
import Header from './components/Header';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Methodology from './pages/Methodology';
import { useAuthStore } from './store/authStore';
import { useEffect, useState } from 'react';

function App() {
  const { user } = useAuthStore();
  const [path, setPath] = useState(window.location.pathname);

  useEffect(() => {
    const handleLocationChange = () => {
      setPath(window.location.pathname);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a');
      if (anchor?.getAttribute('href')?.startsWith('/')) {
        e.preventDefault();
        const newPath = anchor.getAttribute('href') || '/';
        window.history.pushState({}, '', newPath);
        setPath(newPath);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  return (
    <div className="min-h-screen bg-background-dark">
      <Header />
      {path === '/methodology' ? (
        <Methodology />
      ) : (
        user ? <Dashboard /> : <Landing />
      )}
    </div>
  );
}

export default App;