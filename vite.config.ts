import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      injectRegister: 'auto',
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
      },
      includeAssets: ['favicon.svg'],
      manifest: {
        name: 'Photo Measure',
        short_name: 'PhotoMeasure',
        description: 'Measure distances on photos with calibration.',
        theme_color: '#0ea5e9',
        background_color: '#0b1220',
        display: 'standalone',
        orientation: 'any',
        icons: [
          // These will be generated at build time from pwaAssets.image
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
          { src: 'maskable-icon-192x192.png', sizes: '192x192', type: 'image/png', purpose: 'maskable' },
          { src: 'maskable-icon-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
          { src: 'apple-touch-icon-180x180.png', sizes: '180x180', type: 'image/png', purpose: 'any' },
        ],
      },
      pwaAssets: {
        image: 'public/favicon.svg',
        // generates standard PWA icons and Apple touch icon from the SVG
      },
    }),
  ],
})
