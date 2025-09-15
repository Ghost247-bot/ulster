import { supabase } from './supabase';

export const testFinancialGoalsAccess = async () => {
  console.log('Testing Financial Goals Access...');
  
  try {
    // Test 1: Check current session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    console.log('Session:', session ? 'Active' : 'No session');
    if (sessionError) {
      console.error('Session error:', sessionError);
      return;
    }
    
    if (!session) {
      console.error('No active session');
      return;
    }
    
    // Test 2: Check user profile and admin status
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();
    
    console.log('Profile:', profile);
    if (profileError) {
      console.error('Profile error:', profileError);
      return;
    }
    
    console.log('Is Admin:', profile?.is_admin);
    
    // Test 3: Try to access user_financial_goals table
    const { data: goals, error: goalsError } = await supabase
      .from('user_financial_goals')
      .select('*')
      .limit(5);
    
    console.log('Goals query result:', { goals, goalsError });
    
    if (goalsError) {
      console.error('Goals error details:', {
        message: goalsError.message,
        details: goalsError.details,
        hint: goalsError.hint,
        code: goalsError.code
      });
    } else {
      console.log('Successfully accessed financial goals table');
    }
    
    // Test 4: Try to access profiles table
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id, first_name, last_name, email')
      .limit(5);
    
    console.log('Profiles query result:', { profiles, profilesError });
    
    if (profilesError) {
      console.error('Profiles error details:', {
        message: profilesError.message,
        details: profilesError.details,
        hint: profilesError.hint,
        code: profilesError.code
      });
    } else {
      console.log('Successfully accessed profiles table');
    }
    
  } catch (error) {
    console.error('Test error:', error);
  }
};
