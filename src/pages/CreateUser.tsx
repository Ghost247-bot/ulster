import { useState } from 'react';
import { createUser, createTestAdmin, createTestUser } from '../lib/createUser';
import { LandmarkIcon, UserPlus, Shield, User } from 'lucide-react';
import DebugUserCreation from '../components/DebugUserCreation';

const CreateUser = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    isAdmin: false,
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    dateOfBirth: '',
    ssn: '',
    mothersMaidenName: '',
    referralSource: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      const result = await createUser(formData);
      
      if (result.success) {
        setMessage({ type: 'success', text: `User created successfully! Email: ${formData.email}` });
        // Reset form
        setFormData({
          email: '',
          password: '',
          firstName: '',
          lastName: '',
          isAdmin: false,
          phone: '',
          address: '',
          city: '',
          state: '',
          zip: '',
          dateOfBirth: '',
          ssn: '',
          mothersMaidenName: '',
          referralSource: ''
        });
      } else {
        setMessage({ type: 'error', text: result.error || 'Failed to create user' });
      }
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'An unexpected error occurred' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateTestAdmin = async () => {
    setIsLoading(true);
    setMessage(null);

    try {
      const result = await createTestAdmin();
      
      if (result.success) {
        setMessage({ type: 'success', text: 'Test admin user created successfully! Email: admin@ulsterdelt.com, Password: Admin123!' });
      } else {
        setMessage({ type: 'error', text: result.error || 'Failed to create test admin user' });
      }
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'An unexpected error occurred' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateTestUser = async () => {
    setIsLoading(true);
    setMessage(null);

    try {
      const result = await createTestUser();
      
      if (result.success) {
        setMessage({ type: 'success', text: 'Test user created successfully! Email: user@ulsterdelt.com, Password: User123!' });
      } else {
        setMessage({ type: 'error', text: result.error || 'Failed to create test user' });
      }
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'An unexpected error occurred' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <LandmarkIcon className="h-12 w-12 text-[#1B4D3E] mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900">Create User Account</h1>
          <p className="mt-2 text-gray-600">Create new user accounts for the Ulster Delt Bank system</p>
        </div>

        {message && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.type === 'success' 
              ? 'bg-green-50 border border-green-200 text-green-800' 
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}>
            {message.text}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Quick Test User Creation */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <UserPlus className="w-5 h-5" />
              Quick Test Users
            </h2>
            <p className="text-gray-600 mb-6">Create test users with predefined credentials for testing purposes.</p>
            
            <div className="space-y-4">
              <button
                onClick={handleCreateTestAdmin}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-[#1B4D3E] text-white rounded-lg hover:bg-[#145033] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Shield className="w-4 h-4" />
                Create Test Admin
              </button>
              
              <button
                onClick={handleCreateTestUser}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <User className="w-4 h-4" />
                Create Test User
              </button>
            </div>
            
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-2">Test Credentials:</h3>
              <div className="text-sm text-gray-600 space-y-1">
                <div><strong>Admin:</strong> admin@ulsterdelt.com / Admin123!</div>
                <div><strong>User:</strong> user@ulsterdelt.com / User123!</div>
              </div>
            </div>
          </div>

          {/* Custom User Creation Form */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Create Custom User</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B4D3E] focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B4D3E] focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B4D3E] focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B4D3E] focus:border-transparent"
                  required
                  minLength={6}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B4D3E] focus:border-transparent"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isAdmin"
                  checked={formData.isAdmin}
                  onChange={(e) => setFormData({ ...formData, isAdmin: e.target.checked })}
                  className="h-4 w-4 text-[#1B4D3E] border-gray-300 rounded focus:ring-[#1B4D3E]"
                />
                <label htmlFor="isAdmin" className="ml-2 block text-sm text-gray-700">
                  Admin privileges
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full px-4 py-2 bg-[#1B4D3E] text-white rounded-lg hover:bg-[#145033] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Creating User...' : 'Create User'}
              </button>
            </form>
          </div>
        </div>

        <div className="mt-8 text-center">
          <a 
            href="/login" 
            className="text-[#1B4D3E] hover:text-[#145033] font-medium"
          >
            ← Back to Login
          </a>
        </div>
      </div>

      {/* Debug Section */}
      <div className="mt-8">
        <DebugUserCreation />
      </div>
    </div>
  );
};

export default CreateUser;
