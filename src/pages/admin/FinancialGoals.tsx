import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Edit, Eye, Search, Target, Plus, Trash2, Calendar, Tag } from 'lucide-react';
import Loading from '../../components/ui/Loading';
import toast from 'react-hot-toast';
import { useAuthStore } from '../../store/authStore';
import { testFinancialGoalsAccess } from '../../lib/test-financial-goals';

interface UserProfile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string;
}

interface FinancialGoal {
  id: string;
  user_id: string;
  title: string;
  target_amount: number;
  current_amount: number;
  deadline: string | null;
  description: string | null;
  category: string;
  icon_name: string;
  color: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  profiles?: UserProfile;
}

const AdminFinancialGoals = () => {
  const { user, profile } = useAuthStore();
  const [goals, setGoals] = useState<FinancialGoal[]>([]);
  const [filteredGoals, setFilteredGoals] = useState<FinancialGoal[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [selectedGoal, setSelectedGoal] = useState<FinancialGoal | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState<Partial<FinancialGoal>>({});

  // Debug authentication status
  useEffect(() => {
    console.log('AdminFinancialGoals - Auth Debug:', {
      hasUser: !!user,
      hasProfile: !!profile,
      isAdmin: profile?.is_admin,
      userEmail: user?.email,
      userId: user?.id,
      profileData: profile
    });
  }, [user, profile]);

  const goalCategories = [
    'Emergency',
    'Transportation',
    'Housing',
    'Travel',
    'Education',
    'Retirement',
    'General',
    'Investment',
    'Wedding',
    'Home Improvement'
  ];

  const goalColors = [
    'green',
    'blue',
    'purple',
    'orange',
    'red',
    'yellow',
    'pink',
    'indigo',
    'teal',
    'gray'
  ];

  const goalIcons = [
    'Target',
    'Car',
    'Home',
    'Plane',
    'GraduationCap',
    'PiggyBank',
    'DollarSign',
    'TrendingUp',
    'Heart',
    'Wrench'
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Check if user has admin privileges
        if (!profile?.is_admin) {
          console.error('User does not have admin privileges');
          toast.error('Access denied. Admin privileges required.');
          setIsLoading(false);
          return;
        }

        console.log('Fetching financial goals data...');
        
        // Fetch goals and profiles separately (join not working due to foreign key issues)
        const goalsResult = await supabase
          .from('user_financial_goals')
          .select('*')
          .order('created_at', { ascending: false });
        
        const profilesResult = await supabase
          .from('profiles')
          .select('id, first_name, last_name, email');
        
        if (goalsResult.error) throw goalsResult.error;
        if (profilesResult.error) throw profilesResult.error;
        
        // Manually join the data
        const goalsData = goalsResult.data?.map(goal => ({
          ...goal,
          profiles: profilesResult.data?.find(profile => profile.id === goal.user_id) || null
        })) as FinancialGoal[];


        // Fetch all users for the dropdown
        const { data: usersData, error: usersError } = await supabase
          .from('profiles')
          .select('id, first_name, last_name, email')
          .order('last_name', { ascending: true });

        if (usersError) throw usersError;

        setGoals(goalsData || []);
        setFilteredGoals(goalsData || []);
        setUsers((usersData || []) as UserProfile[]);
      } catch (error: any) {
        console.error('Error fetching data:', error);
        console.error('Error details:', {
          message: error?.message || 'No message available',
          details: error?.details || 'No details available',
          hint: error?.hint || 'No hint available',
          code: error?.code || 'No code available',
          status: error?.status || 'No status available',
          statusText: error?.statusText || 'No status text available'
        });
        
        // More specific error messages based on error type
        let errorMessage = 'Unknown error';
        if (error?.code === 'PGRST301') {
          errorMessage = 'Access denied. You may not have admin privileges.';
        } else if (error?.code === 'PGRST116') {
          errorMessage = 'No data found. The table may be empty.';
        } else if (error?.message?.includes('permission denied')) {
          errorMessage = 'Permission denied. Please check your admin privileges.';
        } else if (error?.message?.includes('relation') && error?.message?.includes('does not exist')) {
          errorMessage = 'Database table not found. Please check your database setup.';
        } else {
          errorMessage = error?.message || 'Unknown error';
        }
        
        toast.error(`Failed to load financial goals: ${errorMessage}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [profile]);

  useEffect(() => {
    let filtered = goals;

    if (searchTerm) {
      filtered = filtered.filter(
        (goal) =>
          goal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          goal.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
          goal.profiles?.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          goal.profiles?.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          goal.profiles?.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedUser) {
      filtered = filtered.filter((goal) => goal.user_id === selectedUser);
    }

    setFilteredGoals(filtered);
  }, [searchTerm, selectedUser, goals]);

  const openGoalView = (goal: FinancialGoal) => {
    setSelectedGoal(goal);
    setFormData(goal);
    setIsViewOpen(true);
    setIsEditing(false);
    setIsCreating(false);
  };

  const openGoalEdit = (goal: FinancialGoal) => {
    setSelectedGoal(goal);
    setFormData(goal);
    setIsViewOpen(true);
    setIsEditing(true);
    setIsCreating(false);
  };

  const openGoalCreate = () => {
    setSelectedGoal(null);
    setFormData({
      title: '',
      target_amount: 0,
      current_amount: 0,
      deadline: '',
      description: '',
      category: 'General',
      icon_name: 'Target',
      color: 'green',
      display_order: 0,
      is_active: true,
      user_id: selectedUser || users[0]?.id || ''
    });
    setIsViewOpen(true);
    setIsEditing(false);
    setIsCreating(true);
  };

  const closeModal = () => {
    setIsViewOpen(false);
    setSelectedGoal(null);
    setIsEditing(false);
    setIsCreating(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'number') {
      setFormData({ ...formData, [name]: parseFloat(value) || 0 });
    } else if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.user_id) {
      toast.error('Please select a user');
      return;
    }

    if (!formData.title || !formData.target_amount) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      if (isCreating) {
        const { error } = await supabase
          .from('user_financial_goals')
          .insert([{
            user_id: formData.user_id,
            title: formData.title,
            target_amount: formData.target_amount,
            current_amount: formData.current_amount || 0,
            deadline: formData.deadline || null,
            description: formData.description || null,
            category: formData.category,
            icon_name: formData.icon_name,
            color: formData.color,
            display_order: formData.display_order || 0,
            is_active: formData.is_active !== false
          }]);

        if (error) throw error;
        toast.success('Financial goal created successfully');
      } else if (isEditing && selectedGoal) {
        const { error } = await supabase
          .from('user_financial_goals')
          .update({
            title: formData.title,
            target_amount: formData.target_amount,
            current_amount: formData.current_amount,
            deadline: formData.deadline || null,
            description: formData.description || null,
            category: formData.category,
            icon_name: formData.icon_name,
            color: formData.color,
            display_order: formData.display_order,
            is_active: formData.is_active
          })
          .eq('id', selectedGoal.id);

        if (error) throw error;
        toast.success('Financial goal updated successfully');
      }

      // Refresh data
      const goalsResult = await supabase
        .from('user_financial_goals')
        .select('*')
        .order('created_at', { ascending: false });
      
      const profilesResult = await supabase
        .from('profiles')
        .select('id, first_name, last_name, email');
      
      if (goalsResult.error) throw goalsResult.error;
      if (profilesResult.error) throw profilesResult.error;
      
      // Manually join the data
      const goalsData = goalsResult.data?.map(goal => ({
        ...goal,
        profiles: profilesResult.data?.find(profile => profile.id === goal.user_id) || null
      })) as FinancialGoal[];
      setGoals(goalsData || []);
      closeModal();
    } catch (error: any) {
      console.error('Error saving financial goal:', error);
      toast.error(error?.message || 'Failed to save financial goal');
    }
  };

  const handleDelete = async (goal: FinancialGoal) => {
    if (!confirm('Are you sure you want to delete this financial goal?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('user_financial_goals')
        .delete()
        .eq('id', goal.id);

      if (error) throw error;

      setGoals(goals.filter(g => g.id !== goal.id));
      toast.success('Financial goal deleted successfully');
    } catch (error: any) {
      console.error('Error deleting financial goal:', error);
      toast.error(error?.message || 'Failed to delete financial goal');
    }
  };

  const getProgressPercentage = (current: number, target: number) => {
    if (target === 0) return 0;
    return Math.min((current / target) * 100, 100);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Financial Goals Management</h1>
        <div className="flex gap-2">
          <button
            onClick={testFinancialGoalsAccess}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 flex items-center gap-2"
          >
            Test Access
          </button>
          <button
            onClick={openGoalCreate}
            className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Goal
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search goals, users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          
          <select
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">All Users</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.first_name || 'Unknown'} {user.last_name || 'User'} ({user.email})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Goals Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Goal
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Progress
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Deadline
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredGoals.map((goal) => {
                const progressPercentage = getProgressPercentage(goal.current_amount, goal.target_amount);
                const isCompleted = goal.current_amount >= goal.target_amount;
                
                return (
                  <tr key={goal.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className={`w-8 h-8 rounded-full bg-${goal.color}-100 flex items-center justify-center mr-3`}>
                          <Target className={`w-4 h-4 text-${goal.color}-600`} />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{goal.title}</div>
                          <div className="text-sm text-gray-500">
                            {formatCurrency(goal.current_amount)} / {formatCurrency(goal.target_amount)}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {goal.profiles?.first_name || 'Unknown'} {goal.profiles?.last_name || 'User'}
                      </div>
                      <div className="text-sm text-gray-500">{goal.profiles?.email || 'No email'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                          <div
                            className={`h-2 rounded-full ${
                              isCompleted ? 'bg-green-500' : 'bg-primary-500'
                            }`}
                            style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-600">
                          {progressPercentage.toFixed(1)}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        <Tag className="w-3 h-3 mr-1" />
                        {goal.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {goal.deadline ? (
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1 text-gray-400" />
                          {new Date(goal.deadline).toLocaleDateString()}
                        </div>
                      ) : (
                        <span className="text-gray-400">No deadline</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        isCompleted 
                          ? 'bg-green-100 text-green-800' 
                          : goal.is_active 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-gray-100 text-gray-800'
                      }`}>
                        {isCompleted ? 'Completed' : goal.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => openGoalView(goal)}
                          className="text-primary-600 hover:text-primary-900"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openGoalEdit(goal)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(goal)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        {filteredGoals.length === 0 && (
          <div className="text-center py-12">
            <Target className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No financial goals found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || selectedUser ? 'Try adjusting your search criteria.' : 'Get started by creating a new financial goal.'}
            </p>
          </div>
        )}
      </div>

      {/* Modal */}
      {isViewOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  {isCreating ? 'Create Financial Goal' : isEditing ? 'Edit Financial Goal' : 'View Financial Goal'}
                </h3>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <span className="sr-only">Close</span>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      User *
                    </label>
                    <select
                      name="user_id"
                      value={formData.user_id || ''}
                      onChange={handleInputChange}
                      required
                      disabled={!isCreating}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="">Select a user</option>
                      {users.length === 0 ? (
                        <option value="" disabled>No users available</option>
                      ) : (
                        users.map((user) => (
                          <option key={user.id} value={user.id}>
                            {user.first_name || 'Unknown'} {user.last_name || 'User'} ({user.email})
                          </option>
                        ))
                      )}
                    </select>
                    {users.length === 0 && (
                      <p className="mt-1 text-sm text-gray-500">
                        No users found. Please ensure users are registered in the system.
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Title *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title || ''}
                      onChange={handleInputChange}
                      required
                      disabled={!isEditing && !isCreating}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Target Amount *
                    </label>
                    <input
                      type="number"
                      name="target_amount"
                      value={formData.target_amount || ''}
                      onChange={handleInputChange}
                      required
                      min="0"
                      step="0.01"
                      disabled={!isEditing && !isCreating}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Current Amount
                    </label>
                    <input
                      type="number"
                      name="current_amount"
                      value={formData.current_amount || ''}
                      onChange={handleInputChange}
                      min="0"
                      step="0.01"
                      disabled={!isEditing && !isCreating}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Deadline
                    </label>
                    <input
                      type="date"
                      name="deadline"
                      value={formData.deadline || ''}
                      onChange={handleInputChange}
                      disabled={!isEditing && !isCreating}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category
                    </label>
                    <select
                      name="category"
                      value={formData.category || ''}
                      onChange={handleInputChange}
                      disabled={!isEditing && !isCreating}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      {goalCategories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Icon
                    </label>
                    <select
                      name="icon_name"
                      value={formData.icon_name || ''}
                      onChange={handleInputChange}
                      disabled={!isEditing && !isCreating}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      {goalIcons.map((icon) => (
                        <option key={icon} value={icon}>
                          {icon}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Color
                    </label>
                    <select
                      name="color"
                      value={formData.color || ''}
                      onChange={handleInputChange}
                      disabled={!isEditing && !isCreating}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      {goalColors.map((color) => (
                        <option key={color} value={color}>
                          {color.charAt(0).toUpperCase() + color.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Display Order
                    </label>
                    <input
                      type="number"
                      name="display_order"
                      value={formData.display_order || ''}
                      onChange={handleInputChange}
                      min="0"
                      disabled={!isEditing && !isCreating}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description || ''}
                    onChange={handleInputChange}
                    rows={3}
                    disabled={!isEditing && !isCreating}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                {!isCreating && (
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="is_active"
                      checked={formData.is_active || false}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 block text-sm text-gray-900">
                      Active
                    </label>
                  </div>
                )}

                {(isEditing || isCreating) && (
                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={closeModal}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                      {isCreating ? 'Create Goal' : 'Update Goal'}
                    </button>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminFinancialGoals;
