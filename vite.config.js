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
          // Separate Firebase into its own chunk (loads lazily)
          'vendor-firebase': ['firebase/app', 'firebase/firestore', 'firebase/analytics'],
          // Separate AI SDK
          'vendor-ai': ['@google/generative-ai'],
          // Separate PDF/canvas export libs (rarely needed at startup)
          'vendor-export': ['jspdf', 'html2canvas'],
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
