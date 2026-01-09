// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  future: {
    compatibilityVersion: 4,
  },
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },

  modules: [
    '@nuxtjs/tailwindcss',
    '@vite-pwa/nuxt',
  ],

  runtimeConfig: {
    // Private keys (only available server-side)
    databaseUrl: process.env.DATABASE_URL,

    // Public keys (exposed to client)
    public: {
      appName: 'Ryne',
      appVersion: '1.0.0',
      apiBase: process.env.NUXT_PUBLIC_API_BASE || '/api',
    },
  },

  // Security headers
  nitro: {
    routeRules: {
      '/api/**': {
        cors: true,
        headers: {
          'Access-Control-Allow-Methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
          'Access-Control-Allow-Credentials': 'true',
        },
      },
    },
  },

  // Optimize build
  experimental: {
    payloadExtraction: true,
    renderJsonPayloads: true,
  },

  pwa: {
    registerType: 'autoUpdate',
    manifest: {
      name: 'Ryne - Offline Workout Tracker',
      short_name: 'Ryne',
      description: 'Simple offline-first workout tracking app',
      theme_color: '#6f58c9',
      background_color: '#ffffff',
      display: 'standalone',
      icons: [
        {
          src: '/icon-192x192.png',
          sizes: '192x192',
          type: 'image/png',
          purpose: 'any'
        },
        {
          src: '/icon-512x512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'any'
        },
        {
          src: '/maskable-icon.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'maskable'
        }
      ]
    },
    workbox: {
      navigateFallback: '/',
      globPatterns: ['**/*.{js,css,html,png,svg,ico}'],
      runtimeCaching: [
        {
          urlPattern: /^https:\/\/.*\.(?:png|jpg|jpeg|svg|gif)$/,
          handler: 'CacheFirst',
          options: {
            cacheName: 'images-cache',
            expiration: {
              maxEntries: 50,
              maxAgeSeconds: 30 * 24 * 60 * 60 // 30 days
            }
          }
        }
      ]
    },
    client: {
      installPrompt: true
    },
    devOptions: {
      enabled: true,
      type: 'module'
    }
  }
})
