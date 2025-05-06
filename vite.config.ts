import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        // Only apply console removal in production builds
        plugins: 
          process.env.NODE_ENV === 'production' 
            ? ['transform-remove-console']
            : []
      }
    })
  ],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['lucide-react', 'zustand']
        }
      }
    },
    minify: 'terser',
    terserOptions: {
      format: {
        comments: false
      },
      compress: {
        // Terser also removes console logs as a fallback mechanism
        drop_console: true
      }
    }
  }
});
