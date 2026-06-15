import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico'],
      manifest: {
        name: 'Least Count Party Score Tracker',
        short_name: 'LeastCount',
        description: 'Streamlined counter dashboard optimized for card games and scorekeeping math.',
        theme_color: '#0f172a', // Matches your slate-900 background
        background_color: '#0f172a',
        display: 'standalone', // Hides browser address bar on mobile
        orientation: 'portrait',
        icons: [
          {
            src: 'https://cdn-icons-png.flaticon.com/512/7417/7417772.png', // High quality online sports/score icon
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'https://cdn-icons-png.flaticon.com/512/7417/7417772.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable' // Essential for Android adaptative app shapes
          }
        ]
      }
    })
  ],
})