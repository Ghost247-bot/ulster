import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/ulster/',
  define: {
    'process.env.VITE_SUPABASE_URL': JSON.stringify('https://ckiuvcmzwvvbpmsmpamb.supabase.co'),
    'process.env.VITE_SUPABASE_ANON_KEY': JSON.stringify('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNraXV2Y216d3Z2YnBtc21wYW1iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDczMDU5NTEsImV4cCI6MjA2Mjg4MTk1MX0.0wVLPDpb1z_CF0qBVxUn1DBSdCGc9e0axvYScSaGf28')
  },
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
