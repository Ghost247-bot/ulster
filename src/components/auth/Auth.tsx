import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { AlertCircle, CheckCircle, ArrowLeft, Mail } from 'lucide-react';

interface AuthError {
  message: string;
  type: 'error' | 'success';
  action?: {
    label: string;
    onClick: () => void;
  };
}

type AuthMode = 'signin' | 'signup' | 'forgot-password' | 'reset-password';

export default function Auth() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<AuthError | null>(null);
  const [mode, setMode] = useState<AuthMode>('signin');
  const [resetEmailSent, setResetEmailSent] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validate password strength
    if (password.length < 8) {
      setError({
        message: 'Password must be at least 8 characters long',
        type: 'error'
      });
      setLoading(false);
      return;
    }

    // Check for password complexity
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (!hasUpperCase || !hasLowerCase || !hasNumbers || !hasSpecialChar) {
      setError({
        message: 'Password must contain uppercase, lowercase, numbers, and special characters',
        type: 'error'
      });
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        if (error.message.includes('429')) {
          setError({
            message: 'Too many signup attempts. Please try again in a few minutes.',
            type: 'error',
            action: {
              label: 'Try again later',
              onClick: () => setError(null)
            }
          });
        } else if (error.message.includes('already registered')) {
          setError({
            message: 'This email is already registered.',
            type: 'error',
            action: {
              label: 'Sign in instead',
              onClick: () => {
                setMode('signin');
                setError(null);
              }
            }
          });
        } else if (error.message.includes('password')) {
          setError({
            message: 'Password is too weak. Please use a stronger password.',
            type: 'error'
          });
        } else {
          setError({
            message: error.message,
            type: 'error'
          });
        }
        return;
      }

      if (data?.user) {
        setError({
          message: 'Please check your email for the confirmation link to complete your registration.',
          type: 'success',
          action: {
            label: 'Resend confirmation email',
            onClick: async () => {
              try {
                await supabase.auth.resend({
                  type: 'signup',
                  email,
                });
                setError({
                  message: 'Confirmation email resent! Please check your inbox.',
                  type: 'success'
                });
              } catch (err: any) {
                setError({
                  message: 'Failed to resend confirmation email. Please try again.',
                  type: 'error'
                });
              }
            }
          }
        });
        setEmail('');
        setPassword('');
      }
    } catch (error: any) {
      setError({
        message: error.message || 'An unexpected error occurred during sign up',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          setError({
            message: 'Invalid email or password. Please try again.',
            type: 'error',
            action: {
              label: 'Forgot password?',
              onClick: () => {
                setMode('forgot-password');
                setError(null);
              }
            }
          });
        } else if (error.message.includes('Email not confirmed')) {
          setError({
            message: 'Please verify your email address before signing in.',
            type: 'error',
            action: {
              label: 'Resend verification email',
              onClick: async () => {
                try {
                  await supabase.auth.resend({
                    type: 'signup',
                    email,
                  });
                  setError({
                    message: 'Verification email resent! Please check your inbox.',
                    type: 'success'
                  });
                } catch (err: any) {
                  setError({
                    message: 'Failed to resend verification email. Please try again.',
                    type: 'error'
                  });
                }
              }
            }
          });
        } else {
          setError({
            message: error.message,
            type: 'error'
          });
        }
        return;
      }

      if (data?.user) {
        setError({
          message: 'Successfully signed in! Redirecting...',
          type: 'success'
        });
      }
    } catch (error: any) {
      setError({
        message: error.message || 'An unexpected error occurred during sign in',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (error) {
        if (error.message.includes('429')) {
          setError({
            message: 'Too many attempts. Please try again in a few minutes.',
            type: 'error'
          });
        } else {
          setError({
            message: error.message,
            type: 'error'
          });
        }
        return;
      }

      setResetEmailSent(true);
      setError({
        message: 'Password reset instructions have been sent to your email.',
        type: 'success'
      });
    } catch (error: any) {
      setError({
        message: error.message || 'An unexpected error occurred',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const renderForm = () => {
    switch (mode) {
      case 'forgot-password':
        return (
          <form onSubmit={handleForgotPassword} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
                placeholder="Enter your email"
              />
            </div>

            <div className="flex flex-col space-y-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Sending...' : 'Send Reset Instructions'}
              </button>
              
              <button
                type="button"
                onClick={() => {
                  setMode('signin');
                  setError(null);
                }}
                className="w-full px-4 py-2 text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50 transition-colors"
              >
                Back to Sign In
              </button>
            </div>
          </form>
        );

      case 'signup':
        return (
          <form onSubmit={handleSignUp} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
                placeholder="Enter your password"
                minLength={8}
              />
              <div className="mt-2 text-sm text-gray-500">
                <p>Password must contain:</p>
                <ul className="list-disc list-inside">
                  <li>At least 8 characters</li>
                  <li>Uppercase and lowercase letters</li>
                  <li>Numbers</li>
                  <li>Special characters</li>
                </ul>
              </div>
            </div>

            <div className="flex flex-col space-y-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Creating Account...' : 'Sign Up'}
              </button>
              
              <button
                type="button"
                onClick={() => {
                  setMode('signin');
                  setError(null);
                }}
                className="w-full px-4 py-2 text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50 transition-colors"
              >
                Already have an account? Sign In
              </button>
            </div>
          </form>
        );

      default:
        return (
          <form onSubmit={handleSignIn} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
                placeholder="Enter your password"
              />
            </div>

            <div className="flex flex-col space-y-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </button>
              
              <div className="flex flex-col space-y-2">
                <button
                  type="button"
                  onClick={() => {
                    setMode('signup');
                    setError(null);
                  }}
                  className="w-full px-4 py-2 text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50 transition-colors"
                >
                  Need an account? Sign Up
                </button>
                
                <button
                  type="button"
                  onClick={() => {
                    setMode('forgot-password');
                    setError(null);
                  }}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  Forgot your password?
                </button>
              </div>
            </div>
          </form>
        );
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="space-y-2 text-center">
          <h2 className="text-2xl font-bold">Welcome to Ulster</h2>
          {mode === 'forgot-password' && (
            <p className="text-sm text-gray-600">
              Enter your email address and we'll send you instructions to reset your password.
            </p>
          )}
        </div>
        
        {error && (
          <div className={`p-4 rounded-md flex items-start space-x-3 ${
            error.type === 'error' ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'
          }`}>
            {error.type === 'error' ? (
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
            ) : (
              <CheckCircle className="w-5 h-5 flex-shrink-0" />
            )}
            <div className="flex-1">
              <p className="text-sm">{error.message}</p>
              {error.action && (
                <button
                  onClick={error.action.onClick}
                  className="mt-1 text-sm font-medium hover:underline"
                >
                  {error.action.label}
                </button>
              )}
            </div>
          </div>
        )}

        {renderForm()}
      </div>
    </div>
  );
} 