import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Bell, User, LogOut, Building2, ChevronDown, Settings } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

const DashboardHeader: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { user, profile, signOut } = useAuthStore();
  const navigate = useNavigate();
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm backdrop-blur-sm bg-white/95">
      <div className="max-w-[2000px] mx-auto px-2 xs:px-3 sm:px-4 md:px-6 lg:px-8 xl:px-12">
        <div className="flex justify-between items-center h-14 sm:h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link to="/dashboard" className="flex items-center space-x-2 sm:space-x-3 group">
              <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg bg-gradient-to-br from-primary-600 to-primary-700 flex items-center justify-center shadow-md group-hover:shadow-lg group-hover:scale-105 transition-all duration-300 ease-out">
                <Building2 className="h-4 w-4 sm:h-6 sm:w-6 text-white group-hover:rotate-3 transition-transform duration-300" />
              </div>
              <div className="hidden xs:block">
                <h1 className="text-lg sm:text-xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors duration-300">Ulster Bank</h1>
                <p className="text-[10px] sm:text-xs text-gray-500 -mt-1 group-hover:text-gray-600 transition-colors duration-300">Online Banking</p>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            <Link
              to="/dashboard"
              className="relative px-3 xl:px-4 py-2 text-sm font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-md transition-all duration-300 ease-out hover:scale-105 group"
            >
              <span className="relative z-10">Dashboard</span>
              <div className="absolute inset-0 bg-gradient-to-r from-primary-50 to-primary-100 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>
            <Link
              to="/accounts"
              className="relative px-3 xl:px-4 py-2 text-sm font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-md transition-all duration-300 ease-out hover:scale-105 group"
            >
              <span className="relative z-10">Accounts</span>
              <div className="absolute inset-0 bg-gradient-to-r from-primary-50 to-primary-100 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>
            <Link
              to="/transactions"
              className="relative px-3 xl:px-4 py-2 text-sm font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-md transition-all duration-300 ease-out hover:scale-105 group"
            >
              <span className="relative z-10">Transactions</span>
              <div className="absolute inset-0 bg-gradient-to-r from-primary-50 to-primary-100 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>
            <Link
              to="/cards"
              className="relative px-3 xl:px-4 py-2 text-sm font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-md transition-all duration-300 ease-out hover:scale-105 group"
            >
              <span className="relative z-10">Cards</span>
              <div className="absolute inset-0 bg-gradient-to-r from-primary-50 to-primary-100 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>
            <Link
              to="/payments"
              className="relative px-3 xl:px-4 py-2 text-sm font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-md transition-all duration-300 ease-out hover:scale-105 group"
            >
              <span className="relative z-10">Payments</span>
              <div className="absolute inset-0 bg-gradient-to-r from-primary-50 to-primary-100 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-1 sm:space-x-2">
            {/* Notifications */}
            <Link
              to="/notifications"
              className="relative p-1.5 sm:p-2 text-gray-600 hover:text-primary-600 hover:bg-gray-100 rounded-full transition-all duration-300 ease-out hover:scale-110 group"
            >
              <Bell className="h-4 w-4 sm:h-5 sm:w-5 group-hover:animate-pulse" />
              <span className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 h-3 w-3 sm:h-4 sm:w-4 bg-red-500 text-white text-[10px] sm:text-xs rounded-full flex items-center justify-center animate-pulse group-hover:animate-bounce">
                3
              </span>
            </Link>

            {/* User Menu */}
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center space-x-1 sm:space-x-2 p-1.5 sm:p-2 text-gray-700 hover:text-primary-600 hover:bg-gray-100 rounded-lg transition-all duration-300 ease-out hover:scale-105 group"
              >
                <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-sm group-hover:shadow-md transition-all duration-300">
                  <span className="text-xs sm:text-sm font-semibold text-white group-hover:scale-110 transition-transform duration-300">
                    {user?.email?.[0]?.toUpperCase() || 'U'}
                  </span>
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-medium text-gray-900 group-hover:text-primary-600 transition-colors duration-300">
                    {profile?.first_name ? `${profile.first_name} ${profile.last_name}` : 'User'}
                  </p>
                  <p className="text-xs text-gray-500 group-hover:text-gray-600 transition-colors duration-300">{user?.email}</p>
                </div>
                <ChevronDown className={`h-3 w-3 sm:h-4 sm:w-4 text-gray-400 transition-transform duration-300 ${isUserMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* User Dropdown */}
              <div className={`absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50 transition-all duration-300 ease-out ${
                isUserMenuOpen 
                  ? 'opacity-100 translate-y-0 scale-100' 
                  : 'opacity-0 translate-y-2 scale-95 pointer-events-none'
              }`}>
                <Link
                  to="/profile"
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-primary-600 transition-all duration-200 ease-out hover:translate-x-1 group"
                  onClick={() => setIsUserMenuOpen(false)}
                >
                  <User className="h-4 w-4 mr-3 group-hover:scale-110 transition-transform duration-200" />
                  Your Profile
                </Link>
                <Link
                  to="/settings"
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-primary-600 transition-all duration-200 ease-out hover:translate-x-1 group"
                  onClick={() => setIsUserMenuOpen(false)}
                >
                  <Settings className="h-4 w-4 mr-3 group-hover:scale-110 transition-transform duration-200" />
                  Settings
                </Link>
                <hr className="my-1" />
                <button
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    handleSignOut();
                  }}
                  className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition-all duration-200 ease-out hover:translate-x-1 group"
                >
                  <LogOut className="h-4 w-4 mr-3 group-hover:scale-110 transition-transform duration-200" />
                  Sign out
                </button>
              </div>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-1.5 sm:p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-all duration-300 ease-out hover:scale-110 group"
            >
              <span className="sr-only">Open main menu</span>
              <div className="relative">
                <X className={`h-5 w-5 sm:h-6 sm:w-6 absolute transition-all duration-300 ease-out ${isMobileMenuOpen ? 'rotate-0 opacity-100' : 'rotate-90 opacity-0'}`} />
                <Menu className={`h-5 w-5 sm:h-6 sm:w-6 transition-all duration-300 ease-out ${isMobileMenuOpen ? 'rotate-90 opacity-0' : 'rotate-0 opacity-100'}`} />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`lg:hidden transition-all duration-500 ease-out ${
        isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
      }`}>
        <div className="bg-white border-t border-gray-200 shadow-lg backdrop-blur-sm bg-white/95">
          <div className="px-2 xs:px-3 sm:px-4 py-3 space-y-1">
            <Link
              to="/dashboard"
              className="block px-3 py-2 text-sm sm:text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-md transition-all duration-300 ease-out hover:translate-x-2 hover:scale-105 group"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <span className="group-hover:font-semibold transition-all duration-300">Dashboard</span>
            </Link>
            <Link
              to="/accounts"
              className="block px-3 py-2 text-sm sm:text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-md transition-all duration-300 ease-out hover:translate-x-2 hover:scale-105 group"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <span className="group-hover:font-semibold transition-all duration-300">Accounts</span>
            </Link>
            <Link
              to="/transactions"
              className="block px-3 py-2 text-sm sm:text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-md transition-all duration-300 ease-out hover:translate-x-2 hover:scale-105 group"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <span className="group-hover:font-semibold transition-all duration-300">Transactions</span>
            </Link>
            <Link
              to="/cards"
              className="block px-3 py-2 text-sm sm:text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-md transition-all duration-300 ease-out hover:translate-x-2 hover:scale-105 group"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <span className="group-hover:font-semibold transition-all duration-300">Cards</span>
            </Link>
            <Link
              to="/payments"
              className="block px-3 py-2 text-sm sm:text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-md transition-all duration-300 ease-out hover:translate-x-2 hover:scale-105 group"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <span className="group-hover:font-semibold transition-all duration-300">Payments</span>
            </Link>
          </div>
          
          <div className="border-t border-gray-200 px-2 xs:px-3 sm:px-4 py-3">
            <div className="flex items-center space-x-2 sm:space-x-3 mb-3 group">
              <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <span className="text-xs sm:text-sm font-semibold text-white">
                  {user?.email?.[0]?.toUpperCase() || 'U'}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 group-hover:text-primary-600 transition-colors duration-300">
                  {profile?.first_name ? `${profile.first_name} ${profile.last_name}` : 'User'}
                </p>
                <p className="text-xs text-gray-500 group-hover:text-gray-600 transition-colors duration-300">{user?.email}</p>
              </div>
            </div>
            
            <div className="space-y-1">
              <Link
                to="/notifications"
                className="flex items-center px-3 py-2 text-sm text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-md transition-all duration-300 ease-out hover:translate-x-2 group"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Bell className="h-4 w-4 mr-3 group-hover:scale-110 transition-transform duration-300" />
                <span className="group-hover:font-semibold transition-all duration-300">Notifications</span>
              </Link>
              <Link
                to="/profile"
                className="flex items-center px-3 py-2 text-sm text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-md transition-all duration-300 ease-out hover:translate-x-2 group"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <User className="h-4 w-4 mr-3 group-hover:scale-110 transition-transform duration-300" />
                <span className="group-hover:font-semibold transition-all duration-300">Your Profile</span>
              </Link>
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  handleSignOut();
                }}
                className="flex items-center w-full px-3 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-all duration-300 ease-out hover:translate-x-2 group"
              >
                <LogOut className="h-4 w-4 mr-3 group-hover:scale-110 transition-transform duration-300" />
                <span className="group-hover:font-semibold transition-all duration-300">Sign out</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader; 