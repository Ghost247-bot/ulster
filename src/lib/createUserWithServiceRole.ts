import { createClient } from '@supabase/supabase-js';

// Get environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseServiceKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

// Validate environment variables
if (!supabaseUrl) {
  throw new Error('VITE_SUPABASE_URL is required. Please check your .env file.');
}

if (!supabaseServiceKey) {
  throw new Error('VITE_SUPABASE_SERVICE_ROLE_KEY is required. Please check your .env file.');
}

// Create a Supabase client with service role key for admin operations
const supabaseAdmin = createClient(
  supabaseUrl,
  supabaseServiceKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

interface CreateUserData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  isAdmin?: boolean;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  dateOfBirth?: string;
  ssn?: string;
  mothersMaidenName?: string;
  referralSource?: string;
}

export const createUserWithServiceRole = async (userData: CreateUserData) => {
  try {
    console.log('Creating user with service role:', userData.email);
    
    // Step 1: Create auth user using admin client
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: userData.email,
      password: userData.password,
      email_confirm: true, // Auto-confirm email
    });

    if (authError) {
      console.error('Auth error:', authError);
      return { success: false, error: authError.message };
    }

    if (!authData.user) {
      return { success: false, error: 'No user data received' };
    }

    console.log('Auth user created:', authData.user.id);

    // Step 2: Create profile using admin client
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .insert({
        id: authData.user.id,
        email: userData.email,
        first_name: userData.firstName,
        last_name: userData.lastName,
        phone: userData.phone || '',
        address: userData.address || '',
        city: userData.city || '',
        state: userData.state || '',
        zip: userData.zip || '',
        date_of_birth: userData.dateOfBirth || '',
        ssn: userData.ssn || '',
        mothers_maiden_name: userData.mothersMaidenName || '',
        referral_source: userData.referralSource || '',
        is_admin: userData.isAdmin || false,
        role: userData.isAdmin ? 'admin' : 'user',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });

    if (profileError) {
      console.error('Profile error:', profileError);
      // Clean up the auth user if profile creation fails
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
      return { success: false, error: profileError.message };
    }

    console.log('Profile created successfully');
    return { success: true, user: authData.user };
  } catch (error) {
    console.error('Create user error:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
};

// Helper function to create a test admin user
export const createTestAdminWithServiceRole = async () => {
  return await createUserWithServiceRole({
    email: 'admin@ulsterdelt.com',
    password: 'Admin123!',
    firstName: 'Admin',
    lastName: 'User',
    isAdmin: true,
    phone: '555-0123',
    address: '123 Admin St',
    city: 'Admin City',
    state: 'AC',
    zip: '12345',
    dateOfBirth: '1990-01-01',
    ssn: '123-45-6789',
    mothersMaidenName: 'Admin',
    referralSource: 'System'
  });
};

// Helper function to create a test regular user
export const createTestUserWithServiceRole = async () => {
  return await createUserWithServiceRole({
    email: 'user@ulsterdelt.com',
    password: 'User123!',
    firstName: 'Test',
    lastName: 'User',
    isAdmin: false,
    phone: '555-0124',
    address: '456 User Ave',
    city: 'User City',
    state: 'UC',
    zip: '54321',
    dateOfBirth: '1995-05-15',
    ssn: '987-65-4321',
    mothersMaidenName: 'User',
    referralSource: 'System'
  });
};
