import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';
import { CheckCircle2, Bell, Sparkles } from 'lucide-react';

export default function TestNotifications() {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);

  const createTestNotification = async () => {
    if (!user) {
      toast.error('You must be logged in to create notifications');
      return;
    }

    setLoading(true);
    setSuccess(false);
    try {
      console.log('User:', user);
      console.log('Payload:', {
        user_id: user.id,
        title: 'Test Notification',
        message: 'This is a test notification.',
        type: 'info',
        is_read: false
      });

      const { error } = await supabase
        .from('notifications')
        .insert([{
          user_id: user.id,
          title: 'Test Notification',
          message: 'This is a test notification.',
          type: 'info',
          is_read: false
        }]);

      if (error) {
        console.error('Error creating notification:', error);
        toast.error('Failed to create notification: ' + error.message);
      } else {
        setSuccess(true);
        setNotificationCount(prev => prev + 1);
        
        // Show multiple success toasts with different messages
        toast.success('Notification created! 🎉', {
          icon: '✨',
          duration: 2000,
        });
        
        setTimeout(() => {
          toast.success('You can view it in your notifications list', {
            icon: '🔔',
            duration: 2000,
          });
        }, 1000);

        // Reset success state after 4 seconds
        setTimeout(() => setSuccess(false), 4000);
      }
    } catch (err) {
      console.error('Error:', err);
      toast.error('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Test Notifications</h2>
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <button
            onClick={createTestNotification}
            disabled={loading}
            className={`relative bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-all duration-300 ${
              success ? 'bg-green-600 hover:bg-green-700 scale-105' : ''
            }`}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Creating...
              </span>
            ) : success ? (
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" />
                Notification Created!
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Create Test Notification
              </span>
            )}
          </button>
          
          {notificationCount > 0 && (
            <div className="text-sm text-gray-600">
              Created {notificationCount} notification{notificationCount !== 1 ? 's' : ''}
            </div>
          )}
        </div>
        
        {success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-green-800 transform transition-all duration-300 ease-out animate-[fadeIn_0.3s_ease-out]">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0">
                <Sparkles className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="font-medium">Notification Created Successfully!</p>
                <p className="text-sm text-green-700 mt-1">
                  Your notification has been added to the database and is ready to be viewed.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 