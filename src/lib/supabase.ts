import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/supabase';

// Debug: Log all environment variables
console.log('All env variables:', import.meta.env);

// Get environment variables with fallbacks
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ckiuvcmzwvvbpmsmpamb.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNraXV2Y216d3Z2YnBtc21wYW1iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDczMDU5NTEsImV4cCI6MjA2Mjg4MTk1MX0.0wVLPDpb1z_CF0qBVxUn1DBSdCGc9e0axvYScSaGf28';

// Debug: Log the specific variables we're looking for
console.log('VITE_SUPABASE_URL:', supabaseUrl);
console.log('VITE_SUPABASE_ANON_KEY:', supabaseKey ? 'Key exists' : 'Key missing');

// Create Supabase client
export const supabase = createClient<Database>(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    storageKey: 'ulster-delt-auth',
    storage: window.localStorage,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});

// Test the connection
supabase.auth.getSession().then(
  ({ data: { session }, error }) => {
    if (error) {
      console.error('Error testing Supabase connection:', error);
    } else {
      console.log('Supabase connection successful');
      console.log('Session:', session ? 'Active' : 'No active session');
    }
  }
);