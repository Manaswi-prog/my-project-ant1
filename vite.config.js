import { defineConfig } from 'vite';

/**
 * Vite production configuration.
 * Manual chunk splitting separates heavy vendor libs from core app code,
 * reducing initial bundle parse time and improving efficiency scores.
 */
export default defineConfig({
  build: {
    target: 'es2020',
    rollupOptions: {
      output: {
        manualChunks: {
          // Firebase in its own chunk — loads in parallel but not blocking
          'vendor-firebase': ['firebase/app', 'firebase/firestore', 'firebase/analytics'],
          // AI SDK in its own chunk
          'vendor-ai': ['@google/generative-ai'],
          // NOTE: jspdf and html2canvas are excluded — they are dynamically imported
          // on-demand inside click handlers, so Rollup will auto-split them as async chunks
        }
      }
    },
    // Raise chunk size warning threshold to avoid false positives
    chunkSizeWarningLimit: 600,
    // Enable minification with terser settings
    minify: 'esbuild',
  },
  // Optimize dependency pre-bundling
  optimizeDeps: {
    include: ['firebase/app', 'firebase/firestore', 'firebase/analytics', '@google/generative-ai']
  }
});
