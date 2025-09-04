import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['lucide-react'],
  },
  // Ensure environment variables are properly loaded
  envPrefix: 'VITE_',
  // Enable source maps for better debugging
  build: {
    sourcemap: true
  },
  // Server configuration to handle potential blocking issues
  server: {
    port: 5174,
    host: true
  }
});
