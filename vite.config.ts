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
        name: 'TuneLoom',
        short_name: 'TuneLoom',
        description: 'Personalized music generation for your little one\'s special moments.',
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
            label: 'TuneLoom Desktop View'
          },
          {
            src: 'screenshots/mobile-view.png',
            sizes: '742x1460', // Updated dimensions
            type: 'image/png',
            form_factor: 'narrow',
            label: 'TuneLoom Mobile View'
          }
        ]
      },
      devOptions: {
        enabled: true // Enable PWA in development for testing
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2,webmanifest}'], // Ensure all necessary assets are precached
        globIgnores: ['**/og-image-v1.png'], // Exclude specific large files from precache
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
            urlPattern: /\.supabase\.co\/rest\/v1\/|\.supabase\.co\/rpc\/|\/rest\/v1\/|\/rpc\//,
            method: 'GET',
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              networkTimeoutSeconds: 5,
              expiration: {
                maxEntries: 40,
                maxAgeSeconds: 60 * 60 * 1
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            urlPattern: ({ url }) => /\.(mp3|m4a|wav)$/i.test(url.pathname),
            handler: 'CacheFirst',
            options: {
              cacheName: 'audio-cache',
              matchOptions: {
                ignoreSearch: true
              },
              fetchOptions: { mode: 'no-cors' },
              plugins: [
                {
                  requestWillFetch: async ({ request }) => {
                    if (request.headers.has('range')) {
                      const newHeaders = new Headers(request.headers);
                      newHeaders.delete('range');
                      return new Request(request.url, {
                        headers: newHeaders,
                        mode: 'no-cors',
                        credentials: request.credentials,
                        cache: request.cache,
                        redirect: request.redirect,
                        integrity: request.integrity,
                        referrer: request.referrer,
                        referrerPolicy: request.referrerPolicy,
                        signal: request.signal,
                      });
                    }
                    return request;
                  }
                }
              ],
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 * 10
              },
              cacheableResponse: {
                statuses: [0, 200, 206]
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
        drop_console: true
      }
    }
  }
});
