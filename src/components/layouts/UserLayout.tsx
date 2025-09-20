import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Bell, CreditCard, User, LogOut, Home, DollarSign, FileText, Menu, X } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { supabase } from '../../lib/supabase';
import DashboardHeader from '../layout/DashboardHeader';
import Footer from './Footer';
import BackToTop from '../ui/BackToTop';

const UserLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, profile, signOut } = useAuthStore();
  
  useEffect(() => {
    const fetchUnreadNotifications = async () => {
      if (!user) return;
      
      const { count, error } = await supabase
        .from('notifications')
        .select('*', { count: 'exact' })
        .eq('user_id', user.id)
        .eq('is_read', false);
      
      if (error) {
        console.error('Error fetching notifications:', error);
      } else if (count !== null) {
        setUnreadNotifications(count);
      }
    };
    
    fetchUnreadNotifications();
    
    // Subscribe to changes
    const subscription = supabase
      .channel('notifications_changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${user?.id}`,
      }, fetchUnreadNotifications)
      .subscribe();
    
    return () => {
      subscription.unsubscribe();
    };
  }, [user]);
  
  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };
  
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };
  
  const navLinks = [
    { path: '/dashboard', icon: <Home className="w-4 h-4 sm:w-5 sm:h-5" />, label: 'Dashboard' },
    { path: '/accounts', icon: <DollarSign className="w-4 h-4 sm:w-5 sm:h-5" />, label: 'Accounts' },
    { path: '/cards', icon: <CreditCard className="w-4 h-4 sm:w-5 sm:h-5" />, label: 'Cards' },
    { path: '/transactions', icon: <FileText className="w-4 h-4 sm:w-5 sm:h-5" />, label: 'Transactions' },
  ];
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col zoom-container">
      <DashboardHeader />
      
      {/* Mobile Navigation Menu - Enhanced for better responsiveness */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 shadow-lg backdrop-blur-sm bg-white/95">
        <div className="flex justify-around items-center h-16 px-2">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`flex flex-col items-center justify-center w-full h-full min-h-[60px] px-1 py-2 transition-all duration-200 ${
                isActive(link.path) 
                  ? 'text-primary-600 bg-primary-50 rounded-lg' 
                  : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50 rounded-lg'
              }`}
              onClick={closeMobileMenu}
            >
              <div className="flex-shrink-0">
                {link.icon}
              </div>
              <span className="text-[10px] xs:text-xs mt-1 font-medium text-center leading-tight">
                {link.label}
              </span>
            </Link>
          ))}
        </div>
      </div>
      
      <main className="flex-grow pb-16 md:pb-0">
        <div className="max-w-[2000px] mx-auto px-2 xs:px-3 sm:px-4 md:px-6 lg:px-8 xl:px-12 py-3 sm:py-4 md:py-6 lg:py-8">
          <Outlet />
        </div>
      </main>
      
      <Footer />
      <BackToTop />
    </div>
  );
};

export default UserLayout;