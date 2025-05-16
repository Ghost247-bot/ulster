import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Users, CreditCard, LogOut, LayoutDashboard, 
  DollarSign, FileText, Menu, X, ShieldAlert, BellRing 
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import BackToTop from '../ui/BackToTop';
import BackToDashboard from '../ui/BackToDashboard';

const AdminLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { profile, signOut } = useAuthStore();
  
  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };
  
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };
  
  const navLinks = [
    { path: '/admin', icon: <LayoutDashboard className="w-5 h-5" />, label: 'Dashboard' },
    { path: '/admin/notifications', icon: (
      <span className="relative">
        <BellRing className="w-5 h-5" />
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">3</span>
      </span>
    ), label: 'Notifications' },
    { path: '/admin/users', icon: <Users className="w-5 h-5" />, label: 'Users' },
    { path: '/admin/accounts', icon: <DollarSign className="w-5 h-5" />, label: 'Accounts' },
    { path: '/admin/cards', icon: <CreditCard className="w-5 h-5" />, label: 'Cards' },
    { path: '/admin/transactions', icon: <FileText className="w-5 h-5" />, label: 'Transactions' },
  ];
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-primary-900 shadow-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Logo & Mobile Menu Button */}
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Link to="/admin" className="flex items-center">
                  <ShieldAlert className="h-8 w-8 text-accent-gold" />
                  <span className="ml-2 text-xl font-bold text-white hidden md:block">Ulster Delt Admin</span>
                </Link>
              </div>
              <button
                type="button"
                className="md:hidden ml-2 mt-3 inline-flex items-center justify-center p-2 rounded-md text-gray-300 hover:text-white hover:bg-primary-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-accent-gold"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <span className="sr-only">Open main menu</span>
                {isMobileMenuOpen ? (
                  <X className="block h-6 w-6" aria-hidden="true" />
                ) : (
                  <Menu className="block h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:ml-6 md:flex md:space-x-6">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    isActive(link.path)
                      ? 'border-accent-gold text-white'
                      : 'border-transparent text-gray-300 hover:border-gray-400 hover:text-white'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            
            {/* User Menu */}
            <div className="hidden md:ml-6 md:flex md:items-center">
              <div className="ml-3 relative flex items-center space-x-3">
                <div className="text-white text-sm">
                  {profile?.first_name} {profile?.last_name}
                </div>
                
                <button
                  onClick={handleSignOut}
                  className="p-1 rounded-full text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-primary-900 focus:ring-accent-gold"
                >
                  <span className="sr-only">Sign out</span>
                  <LogOut className="h-6 w-6" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>
      
      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-primary-800 shadow-md">
          <div className="pt-2 pb-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center px-4 py-2 text-base font-medium ${
                  isActive(link.path)
                    ? 'bg-primary-700 border-l-4 border-accent-gold text-white'
                    : 'border-l-4 border-transparent text-gray-300 hover:bg-primary-700 hover:border-gray-400 hover:text-white'
                }`}
                onClick={closeMobileMenu}
              >
                {link.icon}
                <span className="ml-3">{link.label}</span>
              </Link>
            ))}
          </div>
          
          <div className="border-t border-primary-700 pt-4 pb-3">
            <div className="flex items-center px-4">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-primary-600 flex items-center justify-center">
                  <ShieldAlert className="h-6 w-6 text-accent-gold" />
                </div>
              </div>
              <div className="ml-3">
                <div className="text-base font-medium text-white">
                  {profile?.first_name} {profile?.last_name}
                </div>
              </div>
            </div>
            <div className="mt-3 space-y-1">
              <button
                onClick={() => {
                  closeMobileMenu();
                  handleSignOut();
                }}
                className="flex w-full items-center px-4 py-2 text-base font-medium text-gray-300 hover:bg-primary-700 hover:text-white"
              >
                <LogOut className="w-5 h-5 mr-3" />
                Sign out
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Main content */}
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <Outlet />
        </div>
      </main>
      
      {/* Footer */}
      <footer className="bg-primary-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="text-center text-sm">
            <p>© {new Date().getFullYear()} Ulster Delt Bank. Administrator Access.</p>
          </div>
        </div>
      </footer>
      <BackToTop />
      <BackToDashboard />
    </div>
  );
};

export default AdminLayout;