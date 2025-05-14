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
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2,webmanifest}'], // Ensure all necessary assets are precached
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 30 // <== 30 days
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'gstatic-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 30 // <== 30 days
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            urlPattern: ({ url }) => url.pathname.startsWith('/assets/') || url.pathname.endsWith('logo.svg') || url.pathname.startsWith('/screenshots/'),
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'static-assets-cache',
              expiration: {
                maxEntries: 60,
                maxAgeSeconds: 60 * 60 * 24 * 7 // 7 days
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            // Ensure process.env.VITE_SUPABASE_URL is correctly loaded by Vite
            urlPattern: ({ url, sameOrigin }) => {
              // Check if sameOrigin and is an API call, or if it's a Supabase storage URL for audio
              if (sameOrigin && (url.pathname.startsWith('/rest/v1/') || url.pathname.startsWith('/rpc/'))) {
                return true;
              }
              // Check for Supabase storage URLs (audio files) from your specific Supabase project
              if (process.env.VITE_SUPABASE_URL && url.href.startsWith(process.env.VITE_SUPABASE_URL) && url.pathname.includes('/storage/v1/object/public/songs/')) {
                return false; // This will be handled by the audio-cache rule
              }
              // General Supabase API calls if not same origin but matches the known Supabase URL structure
              if (process.env.VITE_SUPABASE_URL && url.href.startsWith(process.env.VITE_SUPABASE_URL) && (url.pathname.startsWith('/rest/v1/') || url.pathname.startsWith('/rpc/'))) {
                return true;
              }
              return false;
            },
            method: 'GET', // Important: Only cache GET requests for APIs
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              networkTimeoutSeconds: 5,
              expiration: {
                maxEntries: 40,
                maxAgeSeconds: 60 * 60 * 1 // 1 hour
              },
              cacheableResponse: {
                statuses: [0, 200] // Cache opaque responses and successful ones
              }
            }
          },
          {
            urlPattern: ({ url }) => {
              // More specific check for audio files from Supabase storage or other CDNs
              if (process.env.VITE_SUPABASE_URL && url.href.startsWith(process.env.VITE_SUPABASE_URL) && url.pathname.includes('/storage/v1/object/public/songs/')) {
                return /\.(mp3|m4a|wav)$/i.test(url.pathname);
              }
              // General audio file match for other CDNs if you use them
              return /\.(mp3|m4a|wav)$/i.test(url.pathname);
            },
            handler: 'CacheFirst',
            options: {
              cacheName: 'audio-cache',
              rangeRequests: true, // Enable range requests for audio
              expiration: {
                maxEntries: 50, // Max 50 audio files
                maxAgeSeconds: 60 * 60 * 24 * 7 // Cache audio for 7 days
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          }
        ]
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
