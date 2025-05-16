import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { BellRing, Calendar, Trash2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { format } from 'date-fns';

interface UserProfile {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
}

interface Notification {
  id?: number;
  user_id: string;
  title: string;
  message: string;
  created_at?: string;
}

export default function AdminNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editingNotification, setEditingNotification] = useState<Notification | null>(null);
  const [form, setForm] = useState<Omit<Notification, 'id'>>({
    user_id: '',
    title: '',
    message: '',
    created_at: new Date().toISOString()
  });
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch users for dropdown
        const { data: usersData, error: usersError } = await supabase
          .from('profiles')
          .select('id, email, first_name, last_name');

        if (usersError) {
          console.error('Error fetching users:', usersError);
          toast.error('Failed to load users');
        } else {
          setUsers(usersData || []);
        }

        // Fetch notifications
        const { data: notificationsData, error: notificationsError } = await supabase
          .from('notifications')
          .select('*')
          .order('created_at', { ascending: false });

        if (notificationsError) {
          console.error('Error fetching notifications:', notificationsError);
          toast.error('Failed to load notifications');
        } else {
          setNotifications(notificationsData || []);
        }
      } catch (error: any) {
        console.error('Error in data fetching:', error);
        toast.error('An unexpected error occurred while loading data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleEdit = (notification: Notification) => {
    setEditingNotification(notification);
    setForm({
      user_id: notification.user_id,
      title: notification.title,
      message: notification.message,
      created_at: notification.created_at || new Date().toISOString()
    });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Validate required fields
      if (!form.user_id || !form.title || !form.message) {
        toast.error('Please fill in all required fields');
        return;
      }

      if (editingNotification) {
        // Update existing notification
        const { error } = await supabase
          .from('notifications')
          .update({
            user_id: form.user_id,
            title: form.title,
            message: form.message,
            created_at: form.created_at
          })
          .eq('id', editingNotification.id);

        if (error) {
          console.error('Error updating notification:', error);
          toast.error(`Failed to update notification: ${error.message}`);
          return;
        }
      } else {
        // Create new notification
        const { error } = await supabase
          .from('notifications')
          .insert([{
            user_id: form.user_id,
            title: form.title,
            message: form.message,
            created_at: form.created_at,
            is_read: false
          }]);

        if (error) {
          console.error('Error creating notification:', error);
          toast.error(`Failed to create notification: ${error.message}`);
          return;
        }
      }

      // Refresh notifications
      const { data, error: fetchError } = await supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) {
        console.error('Error fetching notifications:', fetchError);
        toast.error('Operation successful but failed to refresh the list');
      } else {
        setNotifications(data || []);
        setForm({ user_id: '', title: '', message: '', created_at: new Date().toISOString() });
        setShowForm(false);
        setEditingNotification(null);
        toast.success(editingNotification ? 'Notification updated successfully' : 'Notification created successfully');
      }
    } catch (error: any) {
      console.error('Error in notification submission:', error);
      toast.error(`Failed to ${editingNotification ? 'update' : 'create'} notification: ${error.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingNotification(null);
    setForm({ user_id: '', title: '', message: '', created_at: new Date().toISOString() });
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this notification?')) {
      return;
    }

    setDeletingId(id);
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting notification:', error);
        toast.error(`Failed to delete notification: ${error.message}`);
        return;
      }

      // Update local state
      setNotifications(notifications.filter(n => n.id !== id));
      toast.success('Notification deleted successfully');
    } catch (error: any) {
      console.error('Error in notification deletion:', error);
      toast.error(`Failed to delete notification: ${error.message || 'Unknown error'}`);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Notifications</h1>
      <button
        className="mb-6 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded font-semibold"
        onClick={() => setShowForm((v) => !v)}
      >
        {showForm ? 'Cancel' : 'Add Notification'}
      </button>
      {showForm && (
        <form onSubmit={handleSubmit} className="mb-8 space-y-4 bg-white p-4 rounded shadow">
          <div>
            <label className="block mb-1 font-medium">User</label>
            <select name="user_id" value={form.user_id} onChange={handleChange} required className="w-full border p-2 rounded">
              <option value="">Select user</option>
              {users.map(u => (
                <option key={u.id} value={u.id}>
                  {u.first_name} {u.last_name} ({u.email})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-1 font-medium">Title</label>
            <input name="title" value={form.title} onChange={handleChange} required className="w-full border p-2 rounded" />
          </div>
          <div>
            <label className="block mb-1 font-medium">Message</label>
            <textarea name="message" value={form.message} onChange={handleChange} required className="w-full border p-2 rounded" />
          </div>
          <div>
            <label className="block mb-1 font-medium">Date</label>
            <div className="relative">
              <input
                type="datetime-local"
                name="created_at"
                value={form.created_at ? format(new Date(form.created_at), "yyyy-MM-dd'T'HH:mm") : ''}
                onChange={handleChange}
                required
                className="w-full border p-2 rounded pl-10"
              />
              <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded font-semibold disabled:opacity-50"
            >
              {loading ? 'Saving...' : editingNotification ? 'Update Notification' : 'Add Notification'}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 border border-gray-300 rounded font-semibold hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
      <div className="space-y-4">
        {notifications.map((n) => (
          <div
            key={n.id}
            className="flex p-4 rounded-lg border items-start bg-gray-50 border-gray-200 hover:bg-gray-100 transition-colors"
          >
            <BellRing className="w-6 h-6 text-gray-500 mr-3 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="font-medium text-gray-800">{n.title}</h3>
              <p className="text-sm text-gray-700 mt-1">{n.message}</p>
              <div className="text-xs text-gray-400 mt-1">User ID: {n.user_id}</div>
              <div className="text-xs text-gray-400 mt-1">
                Created: {format(new Date(n.created_at || ''), 'MMM d, yyyy HH:mm')}
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(n)}
                className="text-sm text-primary-600 hover:text-primary-700"
              >
                Edit
              </button>
              <button
                onClick={() => n.id && handleDelete(n.id)}
                disabled={deletingId === n.id}
                className="text-sm text-red-600 hover:text-red-700 disabled:opacity-50 flex items-center gap-1"
              >
                <Trash2 className="w-4 h-4" />
                {deletingId === n.id ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}