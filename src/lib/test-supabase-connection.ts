import { supabase } from './supabase';

export const testSupabaseConnection = async () => {
  try {
    console.log('🔍 Testing Supabase connection...');
    
    // Test basic connection
    const { data, error } = await supabase
      .from('accounts')
      .select('count')
      .limit(1);
    
    if (error) {
      console.error('❌ Supabase connection failed:', error);
      return { success: false, error: error.message };
    }
    
    console.log('✅ Supabase connection successful!');
    console.log('📊 Connection test data:', data);
    
    // Test auth
    const { data: { session }, error: authError } = await supabase.auth.getSession();
    
    if (authError) {
      console.warn('⚠️ Auth session check failed:', authError);
    } else {
      console.log('🔐 Auth status:', session ? 'Logged in' : 'Not logged in');
    }
    
    return { success: true, data };
    
  } catch (error) {
    console.error('❌ Unexpected error testing Supabase:', error);
    return { success: false, error: 'Unexpected error occurred' };
  }
};

// Test connection on import
testSupabaseConnection();
