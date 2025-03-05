import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  define: {
    'process.env': {
      VITE_DISABLE_SIGNUP: process.env.VITE_DISABLE_SIGNUP,
    },
  },
});
