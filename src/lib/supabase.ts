import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/supabase';

// Debug: Log all environment variables
console.log('All env variables:', import.meta.env);

// Get environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Debug: Log the specific variables we're looking for
console.log('VITE_SUPABASE_URL:', supabaseUrl);
console.log('VITE_SUPABASE_ANON_KEY:', supabaseKey ? 'Key exists' : 'Key missing');

// Validate environment variables
if (!supabaseUrl) {
  throw new Error('VITE_SUPABASE_URL is required. Please check your .env file.');
}

if (!supabaseKey) {
  throw new Error('VITE_SUPABASE_ANON_KEY is required. Please check your .env file.');
}

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