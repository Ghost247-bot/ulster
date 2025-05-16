import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LandmarkIcon } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import toast from 'react-hot-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, profile } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { error } = await signIn(email, password);
      
      if (error) {
        toast.error(error.message || 'Failed to sign in');
      } else {
        setTimeout(() => {
          if (profile?.is_admin) {
            navigate('/admin');
          } else {
            navigate('/dashboard');
          }
        }, 100);
      }
    } catch (error: any) {
      toast.error(error.message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto my-12 flex flex-col md:flex-row bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Left Side */}
      <div className="hidden md:flex flex-col justify-center items-start bg-[#f5f5f5] w-1/2 p-8 space-y-8 border-r">
        <div>
          <LandmarkIcon className="h-10 w-10 text-[#1B4D3E] mb-4" />
          <h2 className="text-2xl font-bold text-[#1B4D3E] mb-2">Welcome to Ulster Delt Bank</h2>
          <p className="text-gray-700 mb-4">Secure, convenient, and modern banking at your fingertips.</p>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-[#1B4D3E] mb-2">Why Bank Online?</h3>
          <ul className="list-disc pl-5 text-gray-700 space-y-1 text-sm">
            <li>24/7 account access</li>
            <li>Fast, secure transactions</li>
            <li>Easy bill payments</li>
            <li>Real-time alerts</li>
            <li>Dedicated customer support</li>
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-[#1B4D3E] mb-2">Need Help?</h3>
          <ul className="space-y-1 text-sm">
            <li><Link to="/customer-service" className="text-[#1B4D3E] hover:underline">Customer Service</Link></li>
            <li><Link to="/faqs" className="text-[#1B4D3E] hover:underline">FAQs</Link></li>
            <li><Link to="/security-center" className="text-[#1B4D3E] hover:underline">Security Center</Link></li>
          </ul>
        </div>
      </div>
      {/* Right Side (Login Form) */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-6">
            <LandmarkIcon className="h-12 w-12 text-[#1B4D3E] mx-auto" />
            <h2 className="mt-2 text-3xl font-bold text-gray-900">Welcome Back</h2>
            <p className="mt-2 text-sm text-gray-600">
              Sign in to access your Ulster Delt banking account
            </p>
          </div>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="form-label">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
                placeholder="name@example.com"
              />
            </div>
            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="form-label">
                  Password
                </label>
                <div className="text-sm">
                  <a href="#" className="font-medium text-[#1B4D3E] hover:text-[#145033]">
                    Forgot your password?
                  </a>
                </div>
              </div>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input"
              />
            </div>
            <div className="flex items-center">
              <input
                id="remember_me"
                name="remember_me"
                type="checkbox"
                className="h-4 w-4 text-[#1B4D3E] border-gray-300 rounded focus:ring-[#1B4D3E]"
              />
              <label htmlFor="remember_me" className="ml-2 block text-sm text-gray-700">
                Remember me
              </label>
            </div>
            <button
              type="submit"
              className={`btn w-full ${isLoading ? 'opacity-75 cursor-not-allowed' : ''} bg-[#1B4D3E] text-white hover:bg-[#145033]`}
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
          <div className="mt-6 text-center text-sm">
            <span className="text-gray-600">Don't have an account?</span>
            <Link to="/register" className="ml-1 font-medium text-[#1B4D3E] hover:text-[#145033]">
              Create one now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;