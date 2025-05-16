import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/supabase';

// These would typically come from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials. Please check your .env file for:');
  console.error('VITE_SUPABASE_URL:', supabaseUrl ? '✓ Set' : '✗ Missing');
  console.error('VITE_SUPABASE_ANON_KEY:', supabaseKey ? '✓ Set' : '✗ Missing');
}

// Log the first few characters of the URL and key for debugging (safely)
console.log('Supabase URL:', supabaseUrl ? `${supabaseUrl.substring(0, 20)}...` : 'Not set');
console.log('Supabase Key:', supabaseKey ? `${supabaseKey.substring(0, 10)}...` : 'Not set');

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