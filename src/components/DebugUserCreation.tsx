import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { createUser, createTestAdmin, createTestUser } from '../lib/createUser';
import { createTestAdminWithServiceRole, createTestUserWithServiceRole } from '../lib/createUserWithServiceRole';

const DebugUserCreation = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string>('');
  const [users, setUsers] = useState<any[]>([]);
  const [profiles, setProfiles] = useState<any[]>([]);

  const checkUsers = async () => {
    try {
      setIsLoading(true);
      setMessage('Checking users...');

      // Check auth users
      const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
      if (authError) {
        setMessage(`Auth error: ${authError.message}`);
        return;
      }
      setUsers(authUsers.users || []);

      // Check profiles
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*');
      
      if (profileError) {
        setMessage(`Profile error: ${profileError.message}`);
        return;
      }
      setProfiles(profileData || []);

      setMessage(`Found ${authUsers.users?.length || 0} auth users and ${profileData?.length || 0} profiles`);
    } catch (error: any) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const createTestAdminUser = async () => {
    try {
      setIsLoading(true);
      setMessage('Creating test admin user with service role...');
      
      const result = await createTestAdminWithServiceRole();
      
      if (result.success) {
        setMessage('Test admin user created successfully!');
        await checkUsers(); // Refresh the list
      } else {
        setMessage(`Failed to create test admin: ${result.error}`);
      }
    } catch (error: any) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const createTestRegularUser = async () => {
    try {
      setIsLoading(true);
      setMessage('Creating test regular user with service role...');
      
      const result = await createTestUserWithServiceRole();
      
      if (result.success) {
        setMessage('Test regular user created successfully!');
        await checkUsers(); // Refresh the list
      } else {
        setMessage(`Failed to create test user: ${result.error}`);
      }
    } catch (error: any) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-6">Debug User Creation</h1>
      
      <div className="space-y-4 mb-6">
        <button
          onClick={checkUsers}
          disabled={isLoading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          Check Users
        </button>
        
        <button
          onClick={createTestAdminUser}
          disabled={isLoading}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 ml-2"
        >
          Create Test Admin
        </button>
        
        <button
          onClick={createTestRegularUser}
          disabled={isLoading}
          className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50 ml-2"
        >
          Create Test User
        </button>
      </div>

      {message && (
        <div className="mb-4 p-3 bg-gray-100 rounded">
          <strong>Status:</strong> {message}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-xl font-semibold mb-3">Auth Users ({users.length})</h2>
          <div className="max-h-64 overflow-y-auto border rounded p-3">
            {users.length === 0 ? (
              <p className="text-gray-500">No auth users found</p>
            ) : (
              users.map((user, index) => (
                <div key={user.id || index} className="mb-2 p-2 bg-gray-50 rounded text-sm">
                  <div><strong>ID:</strong> {user.id}</div>
                  <div><strong>Email:</strong> {user.email}</div>
                  <div><strong>Created:</strong> {new Date(user.created_at).toLocaleString()}</div>
                  <div><strong>Confirmed:</strong> {user.email_confirmed_at ? 'Yes' : 'No'}</div>
                </div>
              ))
            )}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-3">Profiles ({profiles.length})</h2>
          <div className="max-h-64 overflow-y-auto border rounded p-3">
            {profiles.length === 0 ? (
              <p className="text-gray-500">No profiles found</p>
            ) : (
              profiles.map((profile, index) => (
                <div key={profile.id || index} className="mb-2 p-2 bg-gray-50 rounded text-sm">
                  <div><strong>ID:</strong> {profile.id}</div>
                  <div><strong>Email:</strong> {profile.email}</div>
                  <div><strong>Name:</strong> {profile.first_name} {profile.last_name}</div>
                  <div><strong>Admin:</strong> {profile.is_admin ? 'Yes' : 'No'}</div>
                  <div><strong>Role:</strong> {profile.role || 'Not set'}</div>
                  <div><strong>Created:</strong> {new Date(profile.created_at).toLocaleString()}</div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DebugUserCreation;
