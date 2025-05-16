import { Outlet } from 'react-router-dom';
import { LandmarkIcon } from 'lucide-react';
import BackToTop from '../ui/BackToTop';
import { useAutoLogout } from '../../hooks/useAutoLogout';

const AuthLayout = () => {
  // Initialize auto logout
  useAutoLogout();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <LandmarkIcon className="h-6 w-6 sm:h-8 sm:w-8 text-primary-600" />
              <span className="ml-2 text-lg sm:text-xl font-bold text-primary-900">Ulster Delt Bank</span>
            </div>
          </div>
        </div>
      </header>
      
      <main className="flex-grow flex items-center justify-center py-6 sm:py-8 md:py-12 px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-6 sm:space-y-8">
          <Outlet />
        </div>
      </main>
      
      <footer className="bg-white">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-4">
          <div className="text-center text-xs sm:text-sm text-gray-500">
            <p>© {new Date().getFullYear()} Ulster Delt Bank. All rights reserved.</p>
          </div>
        </div>
      </footer>
      <BackToTop />
    </div>
  );
};

export default AuthLayout;