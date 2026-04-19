import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import { visualizer } from 'rollup-plugin-visualizer';
import path from 'path';

export default defineConfig({
  plugins: [
    react(),

    // Progressive Web App — works on every device, installable everywhere.
    // Using generateSW (not injectManifest) so vite-plugin-pwa auto-generates
    // the service worker — no custom public/sw.js source file needed.
    // This fixes: "Could not resolve entry module public/sw.js" on Vercel.
    VitePWA({
      registerType: 'autoUpdate',
      strategies: 'generateSW',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: { maxEntries: 10, maxAgeSeconds: 31536000 },
            },
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'gstatic-fonts-cache',
              expiration: { maxEntries: 10, maxAgeSeconds: 31536000 },
            },
          },
        ],
      },
      manifest: {
        name: 'NOVA IDE',
        short_name: 'NOVA',
        description: "The world's most powerful browser-based IDE",
        theme_color: '#0a0a0f',
        background_color: '#0a0a0f',
        display: 'standalone',
        icons: [
          { src: '/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any maskable' },
          { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
        ],
      },
      devOptions: { enabled: true },
    }),

    // Bundle analyzer — run: ANALYZE=true npm run build
    process.env.ANALYZE && visualizer({ open: true, gzipSize: true }),
  ].filter(Boolean),

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@themes': path.resolve(__dirname, './src/themes'),
      '@store': path.resolve(__dirname, './src/store'),
    },
  },

  build: {
    target: 'es2020',
    sourcemap: true,
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor':  ['react', 'react-dom'],
          'monaco-core':   ['monaco-editor'],
          'monaco-react':  ['@monaco-editor/react'],
          'xterm':         ['xterm', 'xterm-addon-fit', 'xterm-addon-web-links', 'xterm-addon-search'],
          'utils':         ['zustand', 'idb', 'fuse.js'],
        },
      },
    },
  },

  server: {
    host: true,
    port: 5173,
    strictPort: false,
    headers: {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'SAMEORIGIN',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
    },
  },

  optimizeDeps: {
    include: ['monaco-editor', '@monaco-editor/react'],
    exclude: ['@monaco-editor/react/esm'],
  },

  worker: {
    format: 'es',
  },
});
