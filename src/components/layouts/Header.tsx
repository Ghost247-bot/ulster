import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { supabase } from '../../lib/supabase';

const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isPersonalDropdownOpen, setIsPersonalDropdownOpen] = useState(false);
  const [isBusinessDropdownOpen, setIsBusinessDropdownOpen] = useState(false);
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const personalDropdownRef = useRef<HTMLDivElement>(null);
  const businessDropdownRef = useRef<HTMLDivElement>(null);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (personalDropdownRef.current && !personalDropdownRef.current.contains(event.target as Node)) {
        setIsPersonalDropdownOpen(false);
      }
      if (businessDropdownRef.current && !businessDropdownRef.current.contains(event.target as Node)) {
        setIsBusinessDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="bg-gradient-to-r from-indigo-600 to-indigo-800 shadow-lg">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                </svg>
                <span className="text-2xl font-bold text-white">Ulster Delt</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden sm:ml-8 sm:flex sm:space-x-8">
              <Link
                to="/"
                className="text-white hover:text-indigo-200 inline-flex items-center px-1 pt-1 text-sm font-medium border-b-2 border-transparent hover:border-indigo-200"
              >
                Home
              </Link>

              {/* Personal Banking Dropdown */}
              <div className="relative" ref={personalDropdownRef}>
                <button
                  onClick={() => setIsPersonalDropdownOpen(!isPersonalDropdownOpen)}
                  className="text-white hover:text-indigo-200 inline-flex items-center px-1 pt-1 text-sm font-medium border-b-2 border-transparent hover:border-indigo-200"
                >
                  Personal Banking
                  <svg className="ml-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {isPersonalDropdownOpen && (
                  <div className="absolute z-10 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                    <div className="py-1" role="menu">
                      <Link to="/personal/accounts" className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50" role="menuitem">
                        Accounts
                      </Link>
                      <Link to="/personal/cards" className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50" role="menuitem">
                        Cards
                      </Link>
                      <Link to="/personal/loans" className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50" role="menuitem">
                        Loans
                      </Link>
                      <Link to="/personal/mortgages" className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50" role="menuitem">
                        Mortgages
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* Business Banking Dropdown */}
              <div className="relative" ref={businessDropdownRef}>
                <button
                  onClick={() => setIsBusinessDropdownOpen(!isBusinessDropdownOpen)}
                  className="text-white hover:text-indigo-200 inline-flex items-center px-1 pt-1 text-sm font-medium border-b-2 border-transparent hover:border-indigo-200"
                >
                  Business Banking
                  <svg className="ml-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {isBusinessDropdownOpen && (
                  <div className="absolute z-10 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                    <div className="py-1" role="menu">
                      <Link to="/business/accounts" className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50" role="menuitem">
                        Business Accounts
                      </Link>
                      <Link to="/business/loans" className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50" role="menuitem">
                        Business Loans
                      </Link>
                      <Link to="/business/cards" className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50" role="menuitem">
                        Business Cards
                      </Link>
                      <Link to="/business/merchant" className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50" role="menuitem">
                        Merchant Services
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              <Link
                to="/about"
                className="text-white hover:text-indigo-200 inline-flex items-center px-1 pt-1 text-sm font-medium border-b-2 border-transparent hover:border-indigo-200"
              >
                About
              </Link>
            </div>
          </div>

          {/* Auth Buttons */}
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {user ? (
              <div className="flex items-center space-x-4">
                <Link
                  to="/dashboard"
                  className="text-white hover:text-indigo-200 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleSignOut}
                  className="bg-white text-indigo-600 px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-50 transition-colors duration-200"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-white hover:text-indigo-200 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="bg-white text-indigo-600 px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-50 transition-colors duration-200"
                >
                  Open Account
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-indigo-200 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            >
              <span className="sr-only">Open main menu</span>
              {!isMobileMenuOpen ? (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="sm:hidden bg-indigo-700">
          <div className="pt-2 pb-3 space-y-1">
            <Link
              to="/"
              className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-white hover:bg-indigo-600 hover:border-indigo-200"
            >
              Home
            </Link>
            <div className="space-y-1">
              <button
                onClick={() => setIsPersonalDropdownOpen(!isPersonalDropdownOpen)}
                className="w-full text-left pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-white hover:bg-indigo-600 hover:border-indigo-200"
              >
                Personal Banking
              </button>
              {isPersonalDropdownOpen && (
                <div className="pl-6 space-y-1">
                  <Link to="/personal/accounts" className="block py-2 text-base font-medium text-indigo-200 hover:text-white">
                    Accounts
                  </Link>
                  <Link to="/personal/cards" className="block py-2 text-base font-medium text-indigo-200 hover:text-white">
                    Cards
                  </Link>
                  <Link to="/personal/loans" className="block py-2 text-base font-medium text-indigo-200 hover:text-white">
                    Loans
                  </Link>
                  <Link to="/personal/mortgages" className="block py-2 text-base font-medium text-indigo-200 hover:text-white">
                    Mortgages
                  </Link>
                </div>
              )}
            </div>
            <div className="space-y-1">
              <button
                onClick={() => setIsBusinessDropdownOpen(!isBusinessDropdownOpen)}
                className="w-full text-left pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-white hover:bg-indigo-600 hover:border-indigo-200"
              >
                Business Banking
              </button>
              {isBusinessDropdownOpen && (
                <div className="pl-6 space-y-1">
                  <Link to="/business/accounts" className="block py-2 text-base font-medium text-indigo-200 hover:text-white">
                    Business Accounts
                  </Link>
                  <Link to="/business/loans" className="block py-2 text-base font-medium text-indigo-200 hover:text-white">
                    Business Loans
                  </Link>
                  <Link to="/business/cards" className="block py-2 text-base font-medium text-indigo-200 hover:text-white">
                    Business Cards
                  </Link>
                  <Link to="/business/merchant" className="block py-2 text-base font-medium text-indigo-200 hover:text-white">
                    Merchant Services
                  </Link>
                </div>
              )}
            </div>
            <Link
              to="/about"
              className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-white hover:bg-indigo-600 hover:border-indigo-200"
            >
              About
            </Link>
          </div>
          <div className="pt-4 pb-3 border-t border-indigo-600">
            {user ? (
              <div className="space-y-1">
                <Link
                  to="/dashboard"
                  className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-white hover:bg-indigo-600 hover:border-indigo-200"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleSignOut}
                  className="block w-full text-left pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-white hover:bg-indigo-600 hover:border-indigo-200"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="space-y-1">
                <Link
                  to="/login"
                  className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-white hover:bg-indigo-600 hover:border-indigo-200"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-white hover:bg-indigo-600 hover:border-indigo-200"
                >
                  Open Account
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header; 