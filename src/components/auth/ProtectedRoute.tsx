import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import Loading from '../ui/Loading';

interface ProtectedRouteProps {
  allowedRole: 'user' | 'admin';
}

const ProtectedRoute = ({ allowedRole }: ProtectedRouteProps) => {
  const { user, profile } = useAuthStore();
  
  console.log('ProtectedRoute Debug:', {
    allowedRole,
    hasUser: !!user,
    hasProfile: !!profile,
    isAdmin: profile?.is_admin,
    userEmail: user?.email,
    profileData: profile
  });
  
  // Still loading
  if (user && !profile) {
    console.log('Still loading profile...');
    return <Loading />;
  }
  
  // Not logged in
  if (!user) {
    console.log('Not logged in, redirecting to login');
    return <Navigate to="/login" replace />;
  }
  
  // Admin check
  if (allowedRole === 'admin' && !profile?.is_admin) {
    console.log('Not an admin, redirecting to home');
    return <Navigate to="/" replace />;
  }
  
  // User check (admin can access user routes)
  if (allowedRole === 'user' && !profile) {
    console.log('No profile found, redirecting to login');
    return <Navigate to="/login" replace />;
  }
  
  console.log('Access granted to:', allowedRole);
  return <Outlet />;
};

export default ProtectedRoute;