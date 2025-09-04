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
  CreditCard, 
  PlusCircle,
  Wallet,
  PiggyBank,
  TrendingUp,
  Bell,
  FileText,
  Target
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
  const { user, profile } = useAuthStore();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalBalance, setTotalBalance] = useState(0);
  const [budgets] = useState<Budget[]>([
    { category: 'Food & Dining', spent: 450, limit: 600 },
    { category: 'Shopping', spent: 800, limit: 1000 },
    { category: 'Transportation', spent: 200, limit: 300 },
    { category: 'Entertainment', spent: 150, limit: 200 },
  ]);
  const [goals] = useState<FinancialGoal[]>([
    { id: 1, title: 'Emergency Fund', target: 10000, current: 7500, deadline: '2024-12-31' },
    { id: 2, title: 'New Car', target: 25000, current: 15000, deadline: '2025-06-30' },
  ]);

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
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', id);

      if (error) {
        console.error('Error marking notification as read:', error);
        return;
      }

      // Update local state to remove the notification
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


  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="space-y-4 sm:space-y-6 px-4 sm:px-6 lg:px-8 max-w-[2000px] mx-auto">
      {/* Banners */}
      <div className="animate-fade-in">
        <BannerDisplay />
      </div>

      {/* Header Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-slide-in-up">
        <div className="flex-1 min-w-0">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 animate-fade-in truncate">
            Welcome back, {profile?.first_name && profile?.last_name ? `${profile.first_name} ${profile.last_name}` : user?.email?.split('@')[0].charAt(0).toUpperCase() + user?.email?.split('@')[0].slice(1)}
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1 animate-fade-in-delay">Here's an overview of your finances</p>
        </div>
        <div className="flex flex-col xs:flex-row gap-2 w-full sm:w-auto animate-slide-in-right">
          <Link
            to="/accounts"
            className="btn btn-primary flex items-center justify-center text-sm sm:text-base transform hover:scale-105 transition-all duration-200 hover:shadow-lg w-full xs:w-auto"
          >
            <PlusCircle className="w-4 h-4 mr-1" />
            <span className="hidden xs:inline">New Account</span>
            <span className="xs:hidden">New</span>
          </Link>
          <Link
            to="/transactions"
            className="btn btn-outline flex items-center justify-center text-sm sm:text-base transform hover:scale-105 transition-all duration-200 hover:shadow-md w-full xs:w-auto"
          >
            <FileText className="w-4 h-4 mr-1" />
            <span className="hidden xs:inline">View All Transactions</span>
            <span className="xs:hidden">Transactions</span>
          </Link>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <Link 
          to="/cards" 
          className="group p-3 sm:p-4 bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col items-center justify-center gap-2 transform hover:scale-105 hover:-translate-y-1 animate-slide-in-up"
          style={{ animationDelay: '0.1s' }}
        >
          <div className="p-2 rounded-full bg-primary-100 group-hover:bg-primary-200 transition-colors duration-300">
            <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 text-primary-600 group-hover:scale-110 transition-transform duration-300" />
          </div>
          <span className="text-xs sm:text-sm font-medium capitalize group-hover:text-primary-700 transition-colors duration-300 text-center">Cards</span>
        </Link>
        <Link 
          to="/payments" 
          className="group p-3 sm:p-4 bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col items-center justify-center gap-2 transform hover:scale-105 hover:-translate-y-1 animate-slide-in-up"
          style={{ animationDelay: '0.2s' }}
        >
          <div className="p-2 rounded-full bg-green-100 group-hover:bg-green-200 transition-colors duration-300">
            <Wallet className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 group-hover:scale-110 transition-transform duration-300" />
          </div>
          <span className="text-xs sm:text-sm font-medium capitalize group-hover:text-green-700 transition-colors duration-300 text-center">Payments</span>
        </Link>
        <Link 
          to="/savings" 
          className="group p-3 sm:p-4 bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col items-center justify-center gap-2 transform hover:scale-105 hover:-translate-y-1 animate-slide-in-up"
          style={{ animationDelay: '0.3s' }}
        >
          <div className="p-2 rounded-full bg-yellow-100 group-hover:bg-yellow-200 transition-colors duration-300">
            <PiggyBank className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600 group-hover:scale-110 transition-transform duration-300" />
          </div>
          <span className="text-xs sm:text-sm font-medium capitalize group-hover:text-yellow-700 transition-colors duration-300 text-center">Savings</span>
        </Link>
        <Link 
          to="/investments" 
          className="group p-3 sm:p-4 bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col items-center justify-center gap-2 transform hover:scale-105 hover:-translate-y-1 animate-slide-in-up"
          style={{ animationDelay: '0.4s' }}
        >
          <div className="p-2 rounded-full bg-purple-100 group-hover:bg-purple-200 transition-colors duration-300">
            <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 group-hover:scale-110 transition-transform duration-300" />
          </div>
          <span className="text-xs sm:text-sm font-medium capitalize group-hover:text-purple-700 transition-colors duration-300 text-center">Investments</span>
        </Link>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
        {/* Left Column - Accounts & Balance */}
        <div className="xl:col-span-2 space-y-4 sm:space-y-6">
          {/* Total Balance Card */}
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl p-4 sm:p-6 text-white animate-slide-in-up shadow-xl hover:shadow-2xl transition-all duration-500">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
              <div className="animate-fade-in flex-1 min-w-0">
                <p className="text-primary-100 font-medium text-sm sm:text-base">Total Balance</p>
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mt-1 animate-count-up break-all">${totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h2>
              </div>
              <div className="bg-white/10 p-2 rounded-lg animate-pulse-slow flex-shrink-0">
                <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
            </div>
            <div className="mt-4 animate-fade-in-delay hover:animate-chart-hover transition-all duration-300">
              <Line data={chartData} options={chartOptions} />
            </div>
          </div>

          {/* Budget Tracker */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden animate-slide-in-up hover:shadow-lg transition-all duration-300">
            <div className="p-3 sm:p-4 border-b flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900">Budget Tracker</h2>
              <Link to="/budget" className="text-sm text-primary-600 hover:text-primary-700 font-medium transition-colors duration-200">
                View Details
              </Link>
            </div>
            <div className="p-3 sm:p-4 space-y-3 sm:space-y-4">
              {budgets.map((budget, index) => (
                <div key={index} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className="flex flex-col xs:flex-row justify-between items-start xs:items-center mb-1 gap-1">
                    <span className="text-sm font-medium text-gray-700 capitalize truncate flex-1 min-w-0">{budget.category}</span>
                    <span className="text-xs sm:text-sm text-gray-500 font-medium whitespace-nowrap">
                      ${budget.spent.toLocaleString()} / ${budget.limit.toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div
                      className="progress-bar-enhanced h-2 rounded-full transition-all duration-1000 ease-out animate-progress-bar"
                      style={{ 
                        width: `${(budget.spent / budget.limit) * 100}%`,
                        animationDelay: `${index * 0.2}s`,
                        '--progress-width': `${(budget.spent / budget.limit) * 100}%`
                      } as React.CSSProperties}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Accounts List */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden animate-slide-in-up hover:shadow-lg transition-all duration-300">
            <div className="p-3 sm:p-4 border-b">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900">Your Accounts</h2>
            </div>
            <div className="divide-y">
              {accounts.map((account, index) => (
                <div 
                  key={account.id} 
                  className="p-3 sm:p-4 hover:bg-gray-50 transition-all duration-300 animate-slide-in-left group"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                    <div className="group-hover:translate-x-1 transition-transform duration-300 flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 capitalize truncate">
                        {account.account_type.charAt(0).toUpperCase() + account.account_type.slice(1)}
                      </h3>
                      <p className="text-sm text-gray-500">****{account.account_number.slice(-4)}</p>
                    </div>
                    <div className="text-left sm:text-right group-hover:translate-x-1 transition-transform duration-300 flex-shrink-0">
                      <p className="font-semibold text-gray-900 animate-count-up break-all">${account.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
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
          <div className="bg-white rounded-xl shadow-sm overflow-hidden animate-slide-in-right hover:shadow-lg transition-all duration-300">
            <div className="p-3 sm:p-4 border-b flex items-center justify-between">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900">Notifications</h2>
              <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 animate-pulse" />
            </div>
            <div className="divide-y">
              {notifications.length > 0 ? (
                notifications.map((notification, index) => (
                  <div
                    key={notification.id}
                    className="p-3 sm:p-4 hover:bg-gray-50 transition-all duration-300 animate-slide-in-up group"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex items-start gap-2 sm:gap-3">
                      <div className="mt-1 group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                        <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 capitalize group-hover:text-primary-700 transition-colors duration-300 text-sm sm:text-base truncate">{notification.title}</h3>
                        <p className="text-xs sm:text-sm text-gray-600 mt-1 line-clamp-2">{notification.message}</p>
                        <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between mt-2 gap-1">
                          <span className="text-xs text-gray-500 font-medium">
                            {format(new Date(notification.created_at), 'MMM d, yyyy')}
                          </span>
                          <button
                            onClick={() => markNotificationAsRead(notification.id)}
                            className="text-xs text-primary-600 hover:text-primary-700 font-medium transform hover:scale-105 transition-all duration-200 whitespace-nowrap"
                          >
                            Mark as read
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-3 sm:p-4 text-center text-gray-500 font-medium animate-fade-in text-sm sm:text-base">
                  No new notifications
                </div>
              )}
            </div>
          </div>

          {/* Financial Goals */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden animate-slide-in-right hover:shadow-lg transition-all duration-300">
            <div className="p-3 sm:p-4 border-b flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900">Financial Goals</h2>
              <Link to="/goals" className="text-sm text-primary-600 hover:text-primary-700 font-medium transition-colors duration-200">
                View All
              </Link>
            </div>
            <div className="p-3 sm:p-4 space-y-3 sm:space-y-4">
              {goals.map((goal, index) => (
                <div key={goal.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-slide-in-up group" style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className="flex items-center gap-2 sm:gap-3 group-hover:translate-x-1 transition-transform duration-300 flex-1 min-w-0">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                      <Target className="w-4 h-4 sm:w-5 sm:h-5 text-primary-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 capitalize group-hover:text-primary-700 transition-colors duration-300 text-sm sm:text-base truncate">{goal.title}</h3>
                      <p className="text-xs sm:text-sm text-gray-500 font-medium">
                        ${goal.current.toLocaleString()} / ${goal.target.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="w-12 h-12 sm:w-16 sm:h-16 group-hover:scale-110 transition-transform duration-300 flex-shrink-0 mx-auto sm:mx-0">
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