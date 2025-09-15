import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X, 
  Calendar,
  Clock,
  DollarSign,
  CreditCard,
  Home,
  Shield,
  Wifi,
  Car,
  Users
} from 'lucide-react';

interface UpcomingBill {
  id: string;
  user_id: string;
  name: string;
  amount: number;
  due_date: string;
  category: string;
  is_paid: boolean;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface User {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
}

const UpcomingBills = () => {
  const [upcomingBills, setUpcomingBills] = useState<UpcomingBill[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingBill, setEditingBill] = useState<UpcomingBill | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    amount: 0,
    due_date: '',
    category: 'Utilities',
    is_paid: false,
    display_order: 0,
    is_active: true
  });

  const categoryOptions = [
    { value: 'Utilities', label: 'Utilities', icon: <Home className="w-4 h-4" /> },
    { value: 'Credit', label: 'Credit', icon: <CreditCard className="w-4 h-4" /> },
    { value: 'Insurance', label: 'Insurance', icon: <Shield className="w-4 h-4" /> },
    { value: 'Internet', label: 'Internet', icon: <Wifi className="w-4 h-4" /> },
    { value: 'Transportation', label: 'Transportation', icon: <Car className="w-4 h-4" /> },
    { value: 'Other', label: 'Other', icon: <DollarSign className="w-4 h-4" /> },
  ];

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (selectedUser) {
      fetchUpcomingBills(selectedUser);
    }
  }, [selectedUser]);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, email, first_name, last_name')
        .order('first_name', { ascending: true });

      if (error) {
        console.error('Error fetching users:', error);
        alert(`Error fetching users: ${error.message}`);
        return;
      }
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      alert(`Unexpected error fetching users: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const fetchUpcomingBills = async (userId: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_upcoming_bills')
        .select('*')
        .eq('user_id', userId)
        .order('due_date', { ascending: true });

      if (error) {
        console.error('Error fetching upcoming bills:', error);
        alert(`Error fetching upcoming bills: ${error.message}`);
        return;
      }
      setUpcomingBills(data || []);
    } catch (error) {
      console.error('Error fetching upcoming bills:', error);
      alert(`Unexpected error fetching upcoming bills: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingBill(null);
    setFormData({
      name: '',
      amount: 0,
      due_date: '',
      category: 'Utilities',
      is_paid: false,
      display_order: upcomingBills.length,
      is_active: true
    });
    setShowModal(true);
  };

  const handleEdit = (bill: UpcomingBill) => {
    setEditingBill(bill);
    setFormData({
      name: bill.name,
      amount: bill.amount,
      due_date: bill.due_date,
      category: bill.category,
      is_paid: bill.is_paid,
      display_order: bill.display_order,
      is_active: bill.is_active
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!selectedUser) return;

    try {
      // Check authentication and admin status
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !session) {
        console.error('Authentication error:', sessionError);
        alert('You must be logged in to perform this action');
        return;
      }

      // Check if user is admin
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', session.user.id)
        .single();

      if (profileError) {
        console.error('Error checking admin status:', profileError);
        alert('Error checking permissions');
        return;
      }

      if (!profile?.is_admin) {
        console.error('User is not an admin');
        alert('You do not have permission to perform this action');
        return;
      }

      if (editingBill) {
        // Update existing bill
        const { error } = await supabase
          .from('user_upcoming_bills')
          .update(formData)
          .eq('id', editingBill.id);

        if (error) {
          console.error('Error updating upcoming bill:', error);
          alert(`Error updating bill: ${error.message}`);
          return;
        }
      } else {
        // Create new bill
        const { error } = await supabase
          .from('user_upcoming_bills')
          .insert({
            ...formData,
            user_id: selectedUser
          });

        if (error) {
          console.error('Error creating upcoming bill:', error);
          alert(`Error creating bill: ${error.message}`);
          return;
        }
      }

      setShowModal(false);
      fetchUpcomingBills(selectedUser);
    } catch (error) {
      console.error('Error saving upcoming bill:', error);
      alert(`Unexpected error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this upcoming bill?')) return;

    try {
      const { error } = await supabase
        .from('user_upcoming_bills')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchUpcomingBills(selectedUser);
    } catch (error) {
      console.error('Error deleting upcoming bill:', error);
    }
  };

  const toggleActive = async (id: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('user_upcoming_bills')
        .update({ is_active: !isActive })
        .eq('id', id);

      if (error) throw error;
      fetchUpcomingBills(selectedUser);
    } catch (error) {
      console.error('Error toggling upcoming bill:', error);
    }
  };

  const togglePaid = async (id: string, isPaid: boolean) => {
    try {
      const { error } = await supabase
        .from('user_upcoming_bills')
        .update({ is_paid: !isPaid })
        .eq('id', id);

      if (error) throw error;
      fetchUpcomingBills(selectedUser);
    } catch (error) {
      console.error('Error toggling paid status:', error);
    }
  };

  const getCategoryIcon = (category: string) => {
    const categoryOption = categoryOptions.find(option => option.value === category);
    return categoryOption ? categoryOption.icon : <DollarSign className="w-4 h-4" />;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date() && !upcomingBills.find(bill => bill.due_date === dueDate)?.is_paid;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Upcoming Bills Management</h1>
          <p className="text-gray-600">Manage upcoming bills for each user</p>
        </div>
        <button
          onClick={handleCreate}
          disabled={!selectedUser}
          className="btn btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus className="w-4 h-4" />
          Add Bill
        </button>
      </div>

      {/* User Selection */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select User
        </label>
        <select
          value={selectedUser}
          onChange={(e) => setSelectedUser(e.target.value)}
          className="form-input w-full max-w-md"
        >
          <option value="">Choose a user...</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.first_name && user.last_name 
                ? `${user.first_name} ${user.last_name}` 
                : user.email}
            </option>
          ))}
        </select>
      </div>

      {/* Upcoming Bills List */}
      {selectedUser && (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b">
            <h2 className="text-lg font-semibold text-gray-900">
              Upcoming Bills for {users.find(u => u.id === selectedUser)?.first_name || 'User'}
            </h2>
          </div>
          
          {isLoading ? (
            <div className="p-6 text-center text-gray-500">Loading...</div>
          ) : upcomingBills.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              No upcoming bills found for this user.
            </div>
          ) : (
            <div className="divide-y">
              {upcomingBills.map((bill) => (
                <div key={bill.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-2 rounded-full bg-yellow-100 text-yellow-600">
                        {getCategoryIcon(bill.category)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium text-gray-900">{bill.name}</h3>
                          {isOverdue(bill.due_date) && (
                            <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                              Overdue
                            </span>
                          )}
                          {bill.is_paid && (
                            <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                              Paid
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500">
                          {bill.category} • Due {formatDate(bill.due_date)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">
                          ${bill.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>
                        <p className="text-sm text-gray-500">Order: {bill.display_order}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => togglePaid(bill.id, bill.is_paid)}
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            bill.is_paid 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {bill.is_paid ? 'Paid' : 'Unpaid'}
                        </button>
                        <button
                          onClick={() => toggleActive(bill.id, bill.is_active)}
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            bill.is_active 
                              ? 'bg-blue-100 text-blue-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {bill.is_active ? 'Active' : 'Inactive'}
                        </button>
                        <button
                          onClick={() => handleEdit(bill)}
                          className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(bill.id)}
                          className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md relative">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-black transition-colors"
              onClick={() => setShowModal(false)}
            >
              <X className="w-6 h-6" />
            </button>
            
            <h2 className="text-xl font-semibold mb-6">
              {editingBill ? 'Edit Upcoming Bill' : 'Create Upcoming Bill'}
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="form-label">Bill Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="form-input"
                  placeholder="e.g., Electric Bill"
                />
              </div>
              
              <div>
                <label className="form-label">Amount</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
                    className="form-input pl-8"
                    placeholder="125.50"
                  />
                </div>
              </div>
              
              <div>
                <label className="form-label">Due Date</label>
                <input
                  type="date"
                  value={formData.due_date}
                  onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                  className="form-input"
                />
              </div>
              
              <div>
                <label className="form-label">Category</label>
                <div className="grid grid-cols-3 gap-2">
                  {categoryOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setFormData({ ...formData, category: option.value })}
                      className={`p-3 rounded-lg border-2 transition-colors flex flex-col items-center gap-2 ${
                        formData.category === option.value
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {option.icon}
                      <span className="text-xs font-medium">{option.label}</span>
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="form-label">Display Order</label>
                <input
                  type="number"
                  value={formData.display_order}
                  onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                  className="form-input"
                  placeholder="0"
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="is_paid"
                    checked={formData.is_paid}
                    onChange={(e) => setFormData({ ...formData, is_paid: e.target.checked })}
                    className="rounded"
                  />
                  <label htmlFor="is_paid" className="text-sm font-medium text-gray-700">
                    Paid
                  </label>
                </div>
                
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="is_active"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    className="rounded"
                  />
                  <label htmlFor="is_active" className="text-sm font-medium text-gray-700">
                    Active
                  </label>
                </div>
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleSave}
                className="btn btn-primary flex-1 flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                {editingBill ? 'Update' : 'Create'}
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="btn btn-outline"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UpcomingBills;
