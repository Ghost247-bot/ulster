import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Target, Plus, Calendar, Tag, DollarSign, TrendingUp } from 'lucide-react';
import Loading from '../../components/ui/Loading';
import toast from 'react-hot-toast';
import { useAuthStore } from '../../store/authStore';

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
}

const UserFinancialGoals = () => {
  const { user } = useAuthStore();
  const [goals, setGoals] = useState<FinancialGoal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedGoal, setSelectedGoal] = useState<FinancialGoal | null>(null);
  const [showAddMoneyModal, setShowAddMoneyModal] = useState(false);
  const [addAmount, setAddAmount] = useState('');
  const [isAddingMoney, setIsAddingMoney] = useState(false);

  useEffect(() => {
    const fetchGoals = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        
        // Fetch user's financial goals
        const { data: goalsData, error: goalsError } = await supabase
          .from('user_financial_goals')
          .select('*')
          .eq('user_id', user.id)
          .eq('is_active', true)
          .order('display_order', { ascending: true });

        if (goalsError) throw goalsError;
        
        setGoals(goalsData || []);
      } catch (error: any) {
        console.error('Error fetching financial goals:', error);
        toast.error('Failed to load financial goals');
      } finally {
        setIsLoading(false);
      }
    };

    fetchGoals();
  }, [user]);

  const getProgressPercentage = (current: number, target: number) => {
    if (target === 0) return 0;
    return Math.min((current / target) * 100, 100);
  };

  const isGoalCompleted = (current: number, target: number) => {
    return current >= target;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'No deadline';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getIconComponent = (iconName: string) => {
    const iconMap: { [key: string]: any } = {
      Target,
      Car: Target,
      Home: Target,
      Plane: Target,
      GraduationCap: Target,
      PiggyBank: Target,
      DollarSign,
      TrendingUp,
      Heart: Target,
      Wrench: Target
    };
    return iconMap[iconName] || Target;
  };

  const handleAddMoney = async () => {
    if (!selectedGoal || !addAmount || parseFloat(addAmount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    try {
      setIsAddingMoney(true);
      
      const newAmount = selectedGoal.current_amount + parseFloat(addAmount);
      
      const { error } = await supabase
        .from('user_financial_goals')
        .update({ current_amount: newAmount })
        .eq('id', selectedGoal.id);

      if (error) throw error;

      // Update local state
      setGoals(goals.map(goal => 
        goal.id === selectedGoal.id 
          ? { ...goal, current_amount: newAmount }
          : goal
      ));

      toast.success(`Added ${formatCurrency(parseFloat(addAmount))} to ${selectedGoal.title}`);
      setShowAddMoneyModal(false);
      setAddAmount('');
      setSelectedGoal(null);
    } catch (error: any) {
      console.error('Error adding money to goal:', error);
      toast.error('Failed to add money to goal');
    } finally {
      setIsAddingMoney(false);
    }
  };

  const openAddMoneyModal = (goal: FinancialGoal) => {
    setSelectedGoal(goal);
    setShowAddMoneyModal(true);
    setAddAmount('');
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Financial Goals</h1>
          <p className="text-gray-600 mt-1">Track your progress towards your financial objectives</p>
        </div>
      </div>

      {goals.length === 0 ? (
        <div className="text-center py-12">
          <Target className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No financial goals</h3>
          <p className="mt-1 text-sm text-gray-500">
            You don't have any active financial goals yet. Contact support to set up your goals.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {goals.map((goal) => {
            const progressPercentage = getProgressPercentage(goal.current_amount, goal.target_amount);
            const isCompleted = isGoalCompleted(goal.current_amount, goal.target_amount);
            const IconComponent = getIconComponent(goal.icon_name);
            
            return (
              <div
                key={goal.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200"
              >
                {/* Goal Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-full bg-${goal.color}-100 flex items-center justify-center`}>
                    <IconComponent className={`w-6 h-6 text-${goal.color}-600`} />
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800`}>
                    <Tag className="w-3 h-3 mr-1" />
                    {goal.category}
                  </span>
                </div>

                {/* Goal Title and Description */}
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{goal.title}</h3>
                  {goal.description && (
                    <p className="text-sm text-gray-600">{goal.description}</p>
                  )}
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Progress</span>
                    <span className="text-sm font-medium text-gray-900">
                      {progressPercentage.toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full transition-all duration-300 ${
                        isCompleted ? 'bg-green-500' : `bg-${goal.color}-500`
                      }`}
                      style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                    />
                  </div>
                </div>

                {/* Amounts */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-gray-600">Current</span>
                    <span className="text-sm font-medium text-gray-900">
                      {formatCurrency(goal.current_amount)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Target</span>
                    <span className="text-sm font-medium text-gray-900">
                      {formatCurrency(goal.target_amount)}
                    </span>
                  </div>
                </div>

                {/* Deadline */}
                <div className="mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    {formatDate(goal.deadline)}
                  </div>
                </div>

                {/* Action Button */}
                <button
                  onClick={() => openAddMoneyModal(goal)}
                  disabled={isCompleted}
                  className={`w-full py-2 px-4 rounded-lg font-medium transition-colors duration-200 ${
                    isCompleted
                      ? 'bg-green-100 text-green-800 cursor-not-allowed'
                      : `bg-${goal.color}-600 text-white hover:bg-${goal.color}-700`
                  }`}
                >
                  {isCompleted ? 'Goal Completed!' : 'Add Money'}
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Money Modal */}
      {showAddMoneyModal && selectedGoal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-1/3 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Add Money to {selectedGoal.title}
                </h3>
                <button
                  onClick={() => setShowAddMoneyModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <span className="sr-only">Close</span>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="mb-4">
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Current Amount</span>
                    <span className="text-sm font-medium text-gray-900">
                      {formatCurrency(selectedGoal.current_amount)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Target Amount</span>
                    <span className="text-sm font-medium text-gray-900">
                      {formatCurrency(selectedGoal.target_amount)}
                    </span>
                  </div>
                </div>

                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount to Add
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="number"
                    value={addAmount}
                    onChange={(e) => setAddAmount(e.target.value)}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowAddMoneyModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddMoney}
                  disabled={isAddingMoney || !addAmount || parseFloat(addAmount) <= 0}
                  className="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isAddingMoney ? 'Adding...' : 'Add Money'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserFinancialGoals;
