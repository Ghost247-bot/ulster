import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X, 
  TrendingUp,
  TrendingDown,
  PiggyBank,
  Award,
  DollarSign,
  BarChart3,
  Activity,
  Shield
} from 'lucide-react';

interface StatCard {
  id: string;
  user_id: string;
  title: string;
  value: string;
  change_value: number;
  change_type: 'positive' | 'negative' | 'neutral';
  icon_name: string;
  color: string;
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

const StatisticsCards = () => {
  const [statCards, setStatCards] = useState<StatCard[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCard, setEditingCard] = useState<StatCard | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    value: '',
    change_value: 0,
    change_type: 'positive' as 'positive' | 'negative' | 'neutral',
    icon_name: 'BarChart3',
    color: 'blue',
    display_order: 0,
    is_active: true
  });

  const iconOptions = [
    { value: 'TrendingUp', label: 'Trending Up', icon: <TrendingUp className="w-4 h-4" /> },
    { value: 'TrendingDown', label: 'Trending Down', icon: <TrendingDown className="w-4 h-4" /> },
    { value: 'PiggyBank', label: 'Piggy Bank', icon: <PiggyBank className="w-4 h-4" /> },
    { value: 'Award', label: 'Award', icon: <Award className="w-4 h-4" /> },
    { value: 'DollarSign', label: 'Dollar Sign', icon: <DollarSign className="w-4 h-4" /> },
    { value: 'BarChart3', label: 'Bar Chart', icon: <BarChart3 className="w-4 h-4" /> },
    { value: 'Activity', label: 'Activity', icon: <Activity className="w-4 h-4" /> },
    { value: 'Shield', label: 'Shield', icon: <Shield className="w-4 h-4" /> },
  ];

  const colorOptions = [
    { value: 'green', label: 'Green', color: 'bg-green-100 text-green-600' },
    { value: 'blue', label: 'Blue', color: 'bg-blue-100 text-blue-600' },
    { value: 'purple', label: 'Purple', color: 'bg-purple-100 text-purple-600' },
    { value: 'orange', label: 'Orange', color: 'bg-orange-100 text-orange-600' },
    { value: 'red', label: 'Red', color: 'bg-red-100 text-red-600' },
    { value: 'yellow', label: 'Yellow', color: 'bg-yellow-100 text-yellow-600' },
    { value: 'indigo', label: 'Indigo', color: 'bg-indigo-100 text-indigo-600' },
    { value: 'gray', label: 'Gray', color: 'bg-gray-100 text-gray-600' },
  ];

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (selectedUser) {
      fetchStatCards(selectedUser);
    }
  }, [selectedUser]);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, email, first_name, last_name')
        .order('first_name', { ascending: true });

      if (error) {
        console.error('Supabase error:', error);
        throw new Error(error.message || 'Failed to fetch users');
      }
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      alert(`Error fetching users: ${error instanceof Error ? error.message : 'Unknown error occurred'}`);
    }
  };

  const fetchStatCards = async (userId: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_statistics_cards')
        .select('*')
        .eq('user_id', userId)
        .order('display_order', { ascending: true });

      if (error) {
        console.error('Supabase error:', error);
        throw new Error(error.message || 'Failed to fetch statistics cards');
      }
      setStatCards(data || []);
    } catch (error) {
      console.error('Error fetching statistics cards:', error);
      alert(`Error fetching statistics cards: ${error instanceof Error ? error.message : 'Unknown error occurred'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingCard(null);
    setFormData({
      title: '',
      value: '',
      change_value: 0,
      change_type: 'positive',
      icon_name: 'BarChart3',
      color: 'blue',
      display_order: statCards.length,
      is_active: true
    });
    setShowModal(true);
  };

  const handleEdit = (card: StatCard) => {
    setEditingCard(card);
    setFormData({
      title: card.title,
      value: card.value,
      change_value: card.change_value,
      change_type: card.change_type,
      icon_name: card.icon_name,
      color: card.color,
      display_order: card.display_order,
      is_active: card.is_active
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!selectedUser) {
      alert('Please select a user first');
      return;
    }

    // Validate form data
    if (!formData.title.trim()) {
      alert('Please enter a title');
      return;
    }

    if (!formData.value.trim()) {
      alert('Please enter a value');
      return;
    }

    try {
      if (editingCard) {
        // Update existing card
        const { error } = await supabase
          .from('user_statistics_cards')
          .update(formData)
          .eq('id', editingCard.id);

        if (error) {
          console.error('Supabase error:', error);
          throw new Error(error.message || 'Failed to update statistics card');
        }
      } else {
        // Create new card
        const { error } = await supabase
          .from('user_statistics_cards')
          .insert({
            ...formData,
            user_id: selectedUser
          });

        if (error) {
          console.error('Supabase error:', error);
          throw new Error(error.message || 'Failed to create statistics card');
        }
      }

      setShowModal(false);
      fetchStatCards(selectedUser);
    } catch (error) {
      console.error('Error saving statistics card:', error);
      // Show user-friendly error message
      alert(`Error saving statistics card: ${error instanceof Error ? error.message : 'Unknown error occurred'}`);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this statistics card?')) return;

    try {
      const { error } = await supabase
        .from('user_statistics_cards')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Supabase error:', error);
        throw new Error(error.message || 'Failed to delete statistics card');
      }
      fetchStatCards(selectedUser);
    } catch (error) {
      console.error('Error deleting statistics card:', error);
      alert(`Error deleting statistics card: ${error instanceof Error ? error.message : 'Unknown error occurred'}`);
    }
  };

  const toggleActive = async (id: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('user_statistics_cards')
        .update({ is_active: !isActive })
        .eq('id', id);

      if (error) {
        console.error('Supabase error:', error);
        throw new Error(error.message || 'Failed to toggle statistics card');
      }
      fetchStatCards(selectedUser);
    } catch (error) {
      console.error('Error toggling statistics card:', error);
      alert(`Error toggling statistics card: ${error instanceof Error ? error.message : 'Unknown error occurred'}`);
    }
  };

  const getIconComponent = (iconName: string) => {
    const iconMap: { [key: string]: React.ReactNode } = {
      'TrendingUp': <TrendingUp className="w-4 h-4" />,
      'TrendingDown': <TrendingDown className="w-4 h-4" />,
      'PiggyBank': <PiggyBank className="w-4 h-4" />,
      'Award': <Award className="w-4 h-4" />,
      'DollarSign': <DollarSign className="w-4 h-4" />,
      'BarChart3': <BarChart3 className="w-4 h-4" />,
      'Activity': <Activity className="w-4 h-4" />,
      'Shield': <Shield className="w-4 h-4" />,
    };
    return iconMap[iconName] || <BarChart3 className="w-4 h-4" />;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Statistics Cards Management</h1>
          <p className="text-gray-600">Manage statistics cards for each user</p>
        </div>
        <button
          onClick={handleCreate}
          disabled={!selectedUser}
          className="btn btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus className="w-4 h-4" />
          Add Card
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

      {/* Statistics Cards List */}
      {selectedUser && (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b">
            <h2 className="text-lg font-semibold text-gray-900">
              Statistics Cards for {users.find(u => u.id === selectedUser)?.first_name || 'User'}
            </h2>
          </div>
          
          {isLoading ? (
            <div className="p-6 text-center text-gray-500">Loading...</div>
          ) : statCards.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              No statistics cards found for this user.
            </div>
          ) : (
            <div className="divide-y">
              {statCards.map((card) => (
                <div key={card.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-lg ${
                        card.color === 'green' ? 'bg-green-100 text-green-600' :
                        card.color === 'blue' ? 'bg-blue-100 text-blue-600' :
                        card.color === 'purple' ? 'bg-purple-100 text-purple-600' :
                        card.color === 'orange' ? 'bg-orange-100 text-orange-600' :
                        card.color === 'red' ? 'bg-red-100 text-red-600' :
                        card.color === 'yellow' ? 'bg-yellow-100 text-yellow-600' :
                        card.color === 'indigo' ? 'bg-indigo-100 text-indigo-600' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        {getIconComponent(card.icon_name)}
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{card.title}</h3>
                        <p className="text-sm text-gray-500">
                          {card.value} • {card.change_type} • Order: {card.display_order}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleActive(card.id, card.is_active)}
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          card.is_active 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {card.is_active ? 'Active' : 'Inactive'}
                      </button>
                      <button
                        onClick={() => handleEdit(card)}
                        className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(card.id)}
                        className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
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
              {editingCard ? 'Edit Statistics Card' : 'Create Statistics Card'}
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="form-label">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="form-input"
                  placeholder="e.g., Monthly Income"
                />
              </div>
              
              <div>
                <label className="form-label">Value</label>
                <input
                  type="text"
                  value={formData.value}
                  onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                  className="form-input"
                  placeholder="e.g., $8,500"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Change Value</label>
                  <input
                    type="number"
                    value={formData.change_value}
                    onChange={(e) => setFormData({ ...formData, change_value: parseFloat(e.target.value) || 0 })}
                    className="form-input"
                    placeholder="5.2"
                  />
                </div>
                <div>
                  <label className="form-label">Change Type</label>
                  <select
                    value={formData.change_type}
                    onChange={(e) => setFormData({ ...formData, change_type: e.target.value as 'positive' | 'negative' | 'neutral' })}
                    className="form-input"
                  >
                    <option value="positive">Positive</option>
                    <option value="negative">Negative</option>
                    <option value="neutral">Neutral</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="form-label">Icon</label>
                <div className="grid grid-cols-4 gap-2">
                  {iconOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setFormData({ ...formData, icon_name: option.value })}
                      className={`p-3 rounded-lg border-2 transition-colors ${
                        formData.icon_name === option.value
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {option.icon}
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="form-label">Color</label>
                <div className="grid grid-cols-4 gap-2">
                  {colorOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setFormData({ ...formData, color: option.value })}
                      className={`p-3 rounded-lg border-2 transition-colors ${
                        formData.color === option.value
                          ? 'border-primary-500'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className={`w-4 h-4 rounded-full ${option.color.split(' ')[0]}`} />
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
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleSave}
                className="btn btn-primary flex-1 flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                {editingCard ? 'Update' : 'Create'}
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

export default StatisticsCards;
