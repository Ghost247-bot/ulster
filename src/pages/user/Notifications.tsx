import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../store/authStore';
import { Bell, Check, Trash2 } from 'lucide-react';
import Loading from '../../components/ui/Loading';
import toast from 'react-hot-toast';

interface Notification {
  id: number;
  title: string;
  message: string;
  type: string;
  is_read: boolean;
  created_at: string;
  updated_at: string;
}

const UserNotifications = () => {
  const { user } = useAuthStore();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('notifications')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setNotifications(data || []);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotifications();
  }, [user]);

  const markAsRead = async (id: number) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', id);

      if (error) throw error;

      // Update state
      setNotifications(
        notifications.map((notification) =>
          notification.id === id
            ? { ...notification, is_read: true }
            : notification
        )
      );
      
      toast.success('Notification marked as read');
    } catch (error) {
      console.error('Error marking notification as read:', error);
      toast.error('Failed to update notification');
    }
  };

  const deleteNotification = async (id: number) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Update state
      setNotifications(
        notifications.filter((notification) => notification.id !== id)
      );
      
      toast.success('Notification deleted');
    } catch (error) {
      console.error('Error deleting notification:', error);
      toast.error('Failed to delete notification');
    }
  };

  const markAllAsRead = async () => {
    if (notifications.filter(n => !n.is_read).length === 0) {
      toast.info('No unread notifications');
      return;
    }
    
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', user?.id)
        .eq('is_read', false);

      if (error) throw error;

      // Update state
      setNotifications(
        notifications.map((notification) => ({ ...notification, is_read: true }))
      );
      
      toast.success('All notifications marked as read');
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      toast.error('Failed to update notifications');
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return (
    <div>
      <div className="mb-6 flex justify-between items-center animate-slide-in-up">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 animate-fade-in">Notifications</h1>
          <p className="text-gray-600 mt-1 animate-fade-in-delay">
            {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
          </p>
        </div>
        {notifications.length > 0 && (
          <button
            onClick={markAllAsRead}
            className="btn btn-outline flex items-center transform hover:scale-105 transition-all duration-200 hover:shadow-md animate-slide-in-right"
          >
            <Check className="w-4 h-4 mr-2" />
            Mark All as Read
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center animate-slide-in-up hover:shadow-lg transition-all duration-300">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-100 text-primary-600 mb-4 animate-pulse-slow">
            <Bell className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 animate-fade-in">No notifications</h3>
          <p className="mt-1 text-sm text-gray-500 max-w-md mx-auto animate-fade-in-delay">
            You don't have any notifications yet. We'll notify you about important account updates and activities.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden animate-slide-in-up hover:shadow-lg transition-all duration-300">
          <div className="divide-y divide-gray-200">
            {notifications.map((notification, index) => (
              <div
                key={notification.id}
                className={`p-6 transition-all duration-300 animate-slide-in-up group ${
                  !notification.is_read ? 'bg-primary-50' : ''
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex">
                  <div
                    className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110 ${
                      !notification.is_read
                        ? 'bg-primary-100 text-primary-600'
                        : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    <Bell className="w-5 h-5" />
                  </div>
                  <div className="ml-4 flex-1">
                    <div className="flex items-center justify-between">
                      <h3
                        className={`text-lg font-medium transition-colors duration-300 group-hover:text-primary-700 ${
                          !notification.is_read
                            ? 'text-primary-900'
                            : 'text-gray-900'
                        }`}
                      >
                        {notification.title}
                        {!notification.is_read && (
                          <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800 animate-pulse">
                            New
                          </span>
                        )}
                      </h3>
                      <span className="text-sm text-gray-500">
                        {format(new Date(notification.created_at), 'MMM d, yyyy')}
                      </span>
                    </div>
                    <p className="mt-1 text-gray-700">{notification.message}</p>
                    <div className="mt-3 flex space-x-3">
                      {!notification.is_read && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className="inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-800 transform hover:scale-105 transition-all duration-200"
                        >
                          <Check className="w-4 h-4 mr-1" />
                          Mark as Read
                        </button>
                      )}
                      <button
                        onClick={() => deleteNotification(notification.id)}
                        className="inline-flex items-center text-sm font-medium text-error-600 hover:text-error-800 transform hover:scale-105 transition-all duration-200"
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserNotifications;