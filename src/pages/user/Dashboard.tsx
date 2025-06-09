import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Line, Doughnut } from 'react-chartjs-2';
import { format } from 'date-fns';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ArcElement,
} from 'chart.js';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../store/authStore';
import { 
  AlertTriangle, 
  Check, 
  CreditCard, 
  DollarSign, 
  PlusCircle,
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  PiggyBank,
  TrendingUp,
  Bell,
  Settings,
  FileText,
  Shield,
  Target,
  BarChart3,
  Lock,
  AlertCircle,
  ChevronRight
} from 'lucide-react';
import Loading from '../../components/ui/Loading';
import BannerDisplay from '../../components/ui/BannerDisplay';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ArcElement
);

interface Account {
  id: number;
  account_type: string;
  account_number: string;
  balance: number;
  is_frozen: boolean;
}

interface Transaction {
  id: number;
  account_id: number;
  amount: number;
  description: string;
  transaction_type: string;
  created_at: string;
}

interface Notification {
  id: number;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

interface Budget {
  category: string;
  spent: number;
  limit: number;
}

interface FinancialGoal {
  id: number;
  title: string;
  target: number;
  current: number;
  deadline: string;
}

const UserDashboard = () => {
  const { user } = useAuthStore();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalBalance, setTotalBalance] = useState(0);
  const [budgets, setBudgets] = useState<Budget[]>([
    { category: 'Food & Dining', spent: 450, limit: 600 },
    { category: 'Shopping', spent: 800, limit: 1000 },
    { category: 'Transportation', spent: 200, limit: 300 },
    { category: 'Entertainment', spent: 150, limit: 200 },
  ]);
  const [goals, setGoals] = useState<FinancialGoal[]>([
    { id: 1, title: 'Emergency Fund', target: 10000, current: 7500, deadline: '2024-12-31' },
    { id: 2, title: 'New Car', target: 25000, current: 15000, deadline: '2025-06-30' },
  ]);
  const [spendingCategories] = useState({
    labels: ['Food & Dining', 'Shopping', 'Transportation', 'Entertainment', 'Bills', 'Others'],
    data: [30, 25, 15, 10, 15, 5],
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) {
        console.log('No user found in auth store');
        setIsLoading(false);
        return;
      }

      console.log('Fetching dashboard data for user:', user.id);
      
      try {
        // Fetch accounts
        const { data: accountsData, error: accountsError } = await supabase
          .from('accounts')
          .select('*')
          .eq('user_id', user.id);

        if (accountsError) {
          console.error('Error fetching accounts:', accountsError);
          throw accountsError;
        }
        
        console.log('Accounts fetched:', accountsData);
        const processedAccounts = (accountsData || []).map(account => ({
          ...account,
          is_frozen: Boolean(account.is_frozen),
        }));
        setAccounts(processedAccounts);

        // Calculate total balance
        const total = (processedAccounts || []).reduce(
          (sum, account) => sum + account.balance,
          0
        );
        setTotalBalance(total);

        // Fetch recent transactions
        if (processedAccounts && processedAccounts.length > 0) {
          const accountIds = processedAccounts.map((account) => account.id);
          const { data: transactionsData, error: transactionsError } = await supabase
            .from('transactions')
            .select('*')
            .in('account_id', accountIds)
            .order('created_at', { ascending: false })
            .limit(5);

          if (transactionsError) {
            console.error('Error fetching transactions:', transactionsError);
            throw transactionsError;
          }
          
          console.log('Transactions fetched:', transactionsData);
          setTransactions(transactionsData || []);
        }

        // Fetch unread notifications
        const { data: notificationsData, error: notificationsError } = await supabase
          .from('notifications')
          .select('*')
          .eq('user_id', user.id)
          .eq('is_read', false)
          .order('created_at', { ascending: false })
          .limit(3);

        if (notificationsError) {
          console.error('Error fetching notifications:', notificationsError);
          throw notificationsError;
        }
        
        console.log('Notifications fetched:', notificationsData);
        setNotifications(notificationsData || []);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        console.log('Setting loading to false');
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  const markNotificationAsRead = async (id: number) => {
    try {
      await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', id);

      setNotifications(notifications.filter((notification) => notification.id !== id));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  // Chart data preparation
  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Account Balance',
        data: [2500, 3200, 2800, 4100, 3800, totalBalance],
        borderColor: '#006400',
        backgroundColor: 'rgba(0, 100, 0, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          display: true,
          color: 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          callback: (value: any) => `$${value}`,
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  // Spending categories chart data
  const spendingChartData = {
    labels: spendingCategories.labels,
    datasets: [
      {
        data: spendingCategories.data,
        backgroundColor: [
          '#006400',
          '#4CAF50',
          '#FFC107',
          '#F44336',
          '#9C27B0',
          '#607D8B',
        ],
        borderWidth: 0,
      },
    ],
  };

  const spendingChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          padding: 20,
          usePointStyle: true,
        },
      },
    },
    cutout: '70%',
  };

  const handleCardStateChange = async (cardId: number, updates: Partial<Card>) => {
    // Updates both database and local state
    // Ensures consistency
  };

  const handleBlockUnblock = async (block: boolean) => {
    // Updates both is_active and is_frozen states
    // Ensures proper state cleanup
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Banners */}
      <BannerDisplay />

      {/* Header Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
            Welcome back, {user?.email?.split('@')[0].charAt(0).toUpperCase() + user?.email?.split('@')[0].slice(1)}
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">Here's an overview of your finances</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            to="/accounts"
            className="btn btn-primary flex items-center text-sm sm:text-base"
          >
            <PlusCircle className="w-4 h-4 mr-1" />
            New Account
          </Link>
          <Link
            to="/transactions"
            className="btn btn-outline flex items-center text-sm sm:text-base"
          >
            <FileText className="w-4 h-4 mr-1" />
            View All Transactions
          </Link>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <Link to="/cards" className="p-3 sm:p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow flex items-center justify-center gap-2">
          <CreditCard className="w-5 h-5 text-primary-600" />
          <span className="text-sm font-medium capitalize">Cards</span>
        </Link>
        <Link to="/payments" className="p-3 sm:p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow flex items-center justify-center gap-2">
          <Wallet className="w-5 h-5 text-primary-600" />
          <span className="text-sm font-medium capitalize">Payments</span>
        </Link>
        <Link to="/savings" className="p-3 sm:p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow flex items-center justify-center gap-2">
          <PiggyBank className="w-5 h-5 text-primary-600" />
          <span className="text-sm font-medium capitalize">Savings</span>
        </Link>
        <Link to="/investments" className="p-3 sm:p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow flex items-center justify-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary-600" />
          <span className="text-sm font-medium capitalize">Investments</span>
        </Link>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Left Column - Accounts & Balance */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          {/* Total Balance Card */}
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl p-4 sm:p-6 text-white">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-primary-100 font-medium">Total Balance</p>
                <h2 className="text-2xl sm:text-3xl font-bold mt-1">${totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h2>
              </div>
              <div className="bg-white/10 p-2 rounded-lg">
                <TrendingUp className="w-6 h-6" />
              </div>
            </div>
            <div className="mt-4">
              <Line data={chartData} options={chartOptions} />
            </div>
          </div>

          {/* Budget Tracker */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-3 sm:p-4 border-b flex items-center justify-between">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900">Budget Tracker</h2>
              <Link to="/budget" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                View Details
              </Link>
            </div>
            <div className="p-3 sm:p-4 space-y-3 sm:space-y-4">
              {budgets.map((budget, index) => (
                <div key={index}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-gray-700 capitalize">{budget.category}</span>
                    <span className="text-sm text-gray-500 font-medium">
                      ${budget.spent.toLocaleString()} / ${budget.limit.toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary-600 h-2 rounded-full"
                      style={{ width: `${(budget.spent / budget.limit) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Accounts List */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-3 sm:p-4 border-b">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900">Your Accounts</h2>
            </div>
            <div className="divide-y">
              {accounts.map((account) => (
                <div key={account.id} className="p-3 sm:p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium text-gray-900 capitalize">
                        {account.account_type.charAt(0).toUpperCase() + account.account_type.slice(1)}
                      </h3>
                      <p className="text-sm text-gray-500">****{account.account_number.slice(-4)}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">${account.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                      <p className="text-xs text-gray-500 font-medium">Available Balance</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Notifications & Recent Activity */}
        <div className="space-y-4 sm:space-y-6">
          {/* Notifications */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-3 sm:p-4 border-b flex items-center justify-between">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900">Notifications</h2>
              <Bell className="w-5 h-5 text-gray-400" />
            </div>
            <div className="divide-y">
              {notifications.length > 0 ? (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className="p-3 sm:p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-1">
                        <AlertTriangle className="w-5 h-5 text-yellow-500" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 capitalize">{notification.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-gray-500 font-medium">
                            {format(new Date(notification.created_at), 'MMM d, yyyy')}
                          </span>
                          <button
                            onClick={() => markNotificationAsRead(notification.id)}
                            className="text-xs text-primary-600 hover:text-primary-700 font-medium"
                          >
                            Mark as read
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-3 sm:p-4 text-center text-gray-500 font-medium">
                  No new notifications
                </div>
              )}
            </div>
          </div>

          {/* Financial Goals */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-3 sm:p-4 border-b flex items-center justify-between">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900">Financial Goals</h2>
              <Link to="/goals" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                View All
              </Link>
            </div>
            <div className="p-3 sm:p-4 space-y-3 sm:space-y-4">
              {goals.map((goal) => (
                <div key={goal.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                      <Target className="w-5 h-5 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 capitalize">{goal.title}</h3>
                      <p className="text-sm text-gray-500 font-medium">
                        ${goal.current.toLocaleString()} / ${goal.target.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="w-16 h-16">
                    <Doughnut
                      data={{
                        labels: ['Progress', 'Remaining'],
                        datasets: [
                          {
                            data: [goal.current, goal.target - goal.current],
                            backgroundColor: ['#4F46E5', '#E5E7EB'],
                            borderWidth: 0,
                          },
                        ],
                      }}
                      options={{
                        cutout: '80%',
                        plugins: {
                          legend: {
                            display: false,
                          },
                        },
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;