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
    { path: '/dashboard', icon: <Home className="w-5 h-5" />, label: 'Dashboard' },
    { path: '/accounts', icon: <DollarSign className="w-5 h-5" />, label: 'Accounts' },
    { path: '/cards', icon: <CreditCard className="w-5 h-5" />, label: 'Cards' },
    { path: '/transactions', icon: <FileText className="w-5 h-5" />, label: 'Transactions' },
  ];
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <DashboardHeader />
      
      {/* Mobile Navigation Menu */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
        <div className="flex justify-around items-center h-16">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`flex flex-col items-center justify-center w-full h-full ${
                isActive(link.path) ? 'text-primary-600' : 'text-gray-600'
              }`}
              onClick={closeMobileMenu}
            >
              {link.icon}
              <span className="text-xs mt-1">{link.label}</span>
            </Link>
          ))}
        </div>
      </div>
      
      <main className="flex-grow pb-16 md:pb-0">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
          <Outlet />
        </div>
      </main>
      
      <Footer />
      <BackToTop />
    </div>
  );
};

export default UserLayout;