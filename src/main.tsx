import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { useAuthStore } from './store/authStore';
import './index.css';

// Initialize auth state
useAuthStore.getState().loadUser();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
