import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  // Ensure environment variables are properly loaded
  envPrefix: 'VITE_',
  // Enable source maps for better debugging
  build: {
    sourcemap: true
  }
});
