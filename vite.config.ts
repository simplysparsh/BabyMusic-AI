import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['logo.svg'], // Make sure your logo is included
      manifest: {
        name: 'BabyMusic AI',
        short_name: 'BabyMusic',
        description: 'AI-powered music generation for your little one\'s special moments.', // You can refine this
        start_url: '/',
        display: 'standalone',
        theme_color: '#2A2D3E',
        background_color: '#2A2D3E',
        icons: [
          {
            src: 'pwa-64x64.png',
            sizes: '64x64',
            type: 'image/png'
          },
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: 'maskable-icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ],
        screenshots: [
          {
            src: 'screenshots/desktop-view.png',
            sizes: '2458x1804', // Updated dimensions
            type: 'image/png',
            form_factor: 'wide',
            label: 'BabyMusic AI Desktop View'
          },
          {
            src: 'screenshots/mobile-view.png',
            sizes: '742x1460', // Updated dimensions
            type: 'image/png',
            form_factor: 'narrow',
            label: 'BabyMusic AI Mobile View'
          }
        ]
      },
      devOptions: {
        enabled: true // Enable PWA in development for testing
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
