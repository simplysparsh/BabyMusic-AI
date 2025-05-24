import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { useAuthStore } from './store/authStore';
import './index.css';

// Import debug utilities to make them available globally in development
import './utils/debugSupabase';

// Initialize auth state
useAuthStore.getState().loadUser();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
