import React from 'react';
import Header from './components/Header';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import { useAuthStore } from './store/authStore';

function App() {
  const { user } = useAuthStore();

  return (
    <div className="min-h-screen bg-background-dark">
      <Header />
      {user ? <Dashboard /> : <Landing />}
    </div>
  );
}

export default App;