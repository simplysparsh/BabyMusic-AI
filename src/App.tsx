import React from 'react';
import Header from './components/Header';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Methodology from './pages/Methodology';
import { useAuthStore } from './store/authStore';

function App() {
  const { user } = useAuthStore();
  const path = window.location.pathname;

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