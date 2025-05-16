import { supabase } from './supabase';

export async function testDatabaseConnection() {
  try {
    console.log('Testing database connection...');
    console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
    console.log('Supabase Key exists:', !!import.meta.env.VITE_SUPABASE_ANON_KEY);
    
    // Try to fetch the current user to test the connection
    const { data, error } = await supabase.auth.getUser();
    
    if (error) {
      console.error('Database connection error:', error.message);
      console.error('Full error:', error);
      return false;
    }
    
    console.log('Database connection successful!');
    console.log('User data:', data);
    return true;
  } catch (error) {
    console.error('Failed to connect to database:', error);
    return false;
  }
} 