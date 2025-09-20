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
import { useStockData } from '../../hooks/useStockData';
import { 
  AlertTriangle, 
  CreditCard, 
  PlusCircle,
  Wallet,
  PiggyBank,
  TrendingUp,
  Bell,
  FileText,
  Target,
  Plus,
  X,
  CheckCircle,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Clock,
  Shield,
  BarChart3,
  ArrowRightLeft,
  TrendingDown,
  Activity,
  Award
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
  type: string;
  is_read: boolean;
  created_at: string;
  updated_at: string;
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


interface StatCard {
  id: string;
  title: string;
  value: string;
  change_value: number;
  change_type: 'positive' | 'negative' | 'neutral';
  icon_name: string;
  color: string;
  display_order: number;
  is_active: boolean;
}

interface UpcomingBill {
  id: string;
  name: string;
  amount: number;
  due_date: string;
  category: string;
  is_paid: boolean;
  display_order: number;
  is_active: boolean;
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
  const [goals, setGoals] = useState<FinancialGoal[]>([
    { id: 1, title: 'Emergency Fund', target: 10000, current: 7500, deadline: '2024-12-31' },
    { id: 2, title: 'New Car', target: 25000, current: 15000, deadline: '2025-06-30' },
  ]);
  const [selectedGoal, setSelectedGoal] = useState<FinancialGoal | null>(null);
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [addAmount, setAddAmount] = useState('');
  const [showAddMoneyModal, setShowAddMoneyModal] = useState(false);
  const [upcomingBills, setBills] = useState<UpcomingBill[]>([]);
  const [isBillsLoading, setIsBillsLoading] = useState(false);
  const [financialHealthScore] = useState(85);
  const [statCards, setStatCards] = useState<StatCard[]>([]);
  const [selectedBill, setSelectedBill] = useState<UpcomingBill | null>(null);
  const [showBillModal, setShowBillModal] = useState(false);
  
  // Real-time stock data
  const { 
    stockData: marketData, 
    isLoading: isMarketLoading, 
    error: marketError, 
    lastUpdated: marketLastUpdated,
    refresh: refreshMarketData 
  } = useStockData({
    symbols: ['AAPL', 'TSLA', 'AMZN', 'GOOGL', 'MSFT', 'META', 'NVDA', 'NFLX', 'AMD', 'INTC', 'GOLD', 'SPY', 'QQQ'],
    refreshInterval: 30000, // 30 seconds
    autoRefresh: true,
  });

  // Mock data initialization
  useEffect(() => {
    // Upcoming bills will be fetched from database in the main useEffect
    // Market data is now fetched in real-time using the useStockData hook
  }, []);

  // Icon mapping for statistics cards
  const getIconComponent = (iconName: string) => {
    const iconMap: { [key: string]: React.ReactNode } = {
      'TrendingUp': <TrendingUp className="w-5 h-5" />,
      'TrendingDown': <TrendingDown className="w-5 h-5" />,
      'PiggyBank': <PiggyBank className="w-5 h-5" />,
      'Award': <Award className="w-5 h-5" />,
      'DollarSign': <DollarSign className="w-5 h-5" />,
      'BarChart3': <BarChart3 className="w-5 h-5" />,
      'Activity': <Activity className="w-5 h-5" />,
      'Shield': <Shield className="w-5 h-5" />,
    };
    return iconMap[iconName] || <BarChart3 className="w-5 h-5" />;
  };

  // Goal interaction functions
  const handleGoalClick = (goal: FinancialGoal) => {
    setSelectedGoal(goal);
    setShowGoalModal(true);
  };

  const handleBillClick = (bill: UpcomingBill) => {
    console.log('Bill clicked:', bill);
    setSelectedBill(bill);
    setShowBillModal(true);
    console.log('Modal should be showing');
  };

  const handleAddMoney = (goalId: number, amount: number) => {
    setGoals(prevGoals => 
      prevGoals.map(goal => 
        goal.id === goalId 
          ? { ...goal, current: Math.min(goal.current + amount, goal.target) }
          : goal
      )
    );
    setAddAmount('');
    setShowAddMoneyModal(false);
  };

  const getProgressPercentage = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  const isGoalCompleted = (current: number, target: number) => {
    return current >= target;
  };

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

        // Fetch user statistics cards
        const { data: statCardsData, error: statCardsError } = await supabase
          .from('user_statistics_cards')
          .select('*')
          .eq('user_id', user.id)
          .eq('is_active', true)
          .order('display_order', { ascending: true });

        if (statCardsError) {
          console.error('Error fetching statistics cards:', statCardsError);
          throw statCardsError;
        }
        
        console.log('Statistics cards fetched:', statCardsData);
        setStatCards(statCardsData || []);

        // Fetch upcoming bills
        const { data: billsData, error: billsError } = await supabase
          .from('user_upcoming_bills')
          .select('*')
          .eq('user_id', user.id)
          .eq('is_active', true)
          .order('due_date', { ascending: true });

        if (billsError) {
          console.error('Error fetching upcoming bills:', billsError);
          throw billsError;
        }

        // Fetch financial goals
        const { data: goalsData, error: goalsError } = await supabase
          .from('user_financial_goals')
          .select('*')
          .eq('user_id', user.id)
          .eq('is_active', true)
          .order('display_order', { ascending: true });

        if (goalsError) {
          console.error('Error fetching financial goals:', goalsError);
          throw goalsError;
        }
        
        console.log('Financial goals fetched:', goalsData);
        // Convert database format to component format
        const processedGoals = (goalsData || []).map(goal => ({
          id: parseInt(goal.id.replace(/-/g, '').substring(0, 8), 16), // Convert UUID to number for compatibility
          title: goal.title,
          target: goal.target_amount,
          current: goal.current_amount,
          deadline: goal.deadline
        }));
        setGoals(processedGoals);
        
        console.log('Upcoming bills fetched:', billsData);
        setBills(billsData || []);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        console.log('Setting loading to false');
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  // Real-time subscription for upcoming bills
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('user_upcoming_bills_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_upcoming_bills',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          console.log('Upcoming bills real-time update:', payload);
          
          // Refetch upcoming bills when there are changes
          const fetchUpcomingBills = async () => {
            try {
              setIsBillsLoading(true);
              const { data: billsData, error: billsError } = await supabase
                .from('user_upcoming_bills')
                .select('*')
                .eq('user_id', user.id)
                .eq('is_active', true)
                .order('due_date', { ascending: true });

              if (billsError) {
                console.error('Error fetching updated upcoming bills:', billsError);
                return;
              }

              setBills(billsData || []);
            } catch (error) {
              console.error('Error in real-time bills update:', error);
            } finally {
              setIsBillsLoading(false);
            }
          };

          fetchUpcomingBills();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
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
    <div className="space-y-3 sm:space-y-4 md:space-y-6">
      {/* Banners */}
      <div className="animate-fade-in">
        <BannerDisplay />
      </div>

      {/* Header Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 animate-slide-in-up">
        <div className="flex-1 min-w-0">
          <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 animate-fade-in truncate">
            Welcome back, {profile?.first_name && profile?.last_name ? `${profile.first_name} ${profile.last_name}` : user?.email?.split('@')[0].charAt(0).toUpperCase() + user?.email?.split('@')[0].slice(1)}
          </h1>
          <p className="text-xs sm:text-sm md:text-base text-gray-600 mt-1 animate-fade-in-delay">Here's an overview of your finances</p>
        </div>
        <div className="flex flex-col xs:flex-row gap-2 w-full sm:w-auto animate-slide-in-right">
          <Link
            to="/accounts"
            className="btn btn-primary flex items-center justify-center text-xs sm:text-sm md:text-base transform hover:scale-105 transition-all duration-200 hover:shadow-lg w-full xs:w-auto px-3 sm:px-4 py-2"
          >
            <PlusCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
            <span className="hidden xs:inline">New Account</span>
            <span className="xs:hidden">New</span>
          </Link>
          <Link
            to="/transactions"
            className="btn btn-outline flex items-center justify-center text-xs sm:text-sm md:text-base transform hover:scale-105 transition-all duration-200 hover:shadow-md w-full xs:w-auto px-3 sm:px-4 py-2"
          >
            <FileText className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
            <span className="hidden xs:inline">View All Transactions</span>
            <span className="xs:hidden">Transactions</span>
          </Link>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-5 gap-2 xs:gap-3 sm:gap-4">
        <Link 
          to="/cards" 
          className="group p-2 xs:p-3 sm:p-4 bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col items-center justify-center gap-1 xs:gap-2 transform hover:scale-105 hover:-translate-y-1 animate-slide-in-up"
          style={{ animationDelay: '0.1s' }}
        >
          <div className="p-1.5 xs:p-2 rounded-full bg-primary-100 group-hover:bg-primary-200 transition-colors duration-300">
            <CreditCard className="w-3 h-3 xs:w-4 xs:h-4 sm:w-5 sm:h-5 text-primary-600 group-hover:scale-110 transition-transform duration-300" />
          </div>
          <span className="text-[10px] xs:text-xs sm:text-sm font-medium capitalize group-hover:text-primary-700 transition-colors duration-300 text-center leading-tight">Cards</span>
        </Link>
        <Link 
          to="/payments" 
          className="group p-2 xs:p-3 sm:p-4 bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col items-center justify-center gap-1 xs:gap-2 transform hover:scale-105 hover:-translate-y-1 animate-slide-in-up"
          style={{ animationDelay: '0.2s' }}
        >
          <div className="p-1.5 xs:p-2 rounded-full bg-green-100 group-hover:bg-green-200 transition-colors duration-300">
            <Wallet className="w-3 h-3 xs:w-4 xs:h-4 sm:w-5 sm:h-5 text-green-600 group-hover:scale-110 transition-transform duration-300" />
          </div>
          <span className="text-[10px] xs:text-xs sm:text-sm font-medium capitalize group-hover:text-green-700 transition-colors duration-300 text-center leading-tight">Payments</span>
        </Link>
        <Link 
          to="/savings" 
          className="group p-2 xs:p-3 sm:p-4 bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col items-center justify-center gap-1 xs:gap-2 transform hover:scale-105 hover:-translate-y-1 animate-slide-in-up"
          style={{ animationDelay: '0.3s' }}
        >
          <div className="p-1.5 xs:p-2 rounded-full bg-yellow-100 group-hover:bg-yellow-200 transition-colors duration-300">
            <PiggyBank className="w-3 h-3 xs:w-4 xs:h-4 sm:w-5 sm:h-5 text-yellow-600 group-hover:scale-110 transition-transform duration-300" />
          </div>
          <span className="text-[10px] xs:text-xs sm:text-sm font-medium capitalize group-hover:text-yellow-700 transition-colors duration-300 text-center leading-tight">Savings</span>
        </Link>
        <Link 
          to="/Investment" 
          className="group p-2 xs:p-3 sm:p-4 bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col items-center justify-center gap-1 xs:gap-2 transform hover:scale-105 hover:-translate-y-1 animate-slide-in-up"
          style={{ animationDelay: '0.4s' }}
        >
          <div className="p-1.5 xs:p-2 rounded-full bg-purple-100 group-hover:bg-purple-200 transition-colors duration-300">
            <TrendingUp className="w-3 h-3 xs:w-4 xs:h-4 sm:w-5 sm:h-5 text-purple-600 group-hover:scale-110 transition-transform duration-300" />
          </div>
          <span className="text-[10px] xs:text-xs sm:text-sm font-medium capitalize group-hover:text-purple-700 transition-colors duration-300 text-center leading-tight">Investments</span>
        </Link>
        <button 
          className="group p-2 xs:p-3 sm:p-4 bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col items-center justify-center gap-1 xs:gap-2 transform hover:scale-105 hover:-translate-y-1 animate-slide-in-up"
          style={{ animationDelay: '0.5s' }}
          onClick={() => {/* Add transfer modal logic here */}}
        >
          <div className="p-1.5 xs:p-2 rounded-full bg-indigo-100 group-hover:bg-indigo-200 transition-colors duration-300">
            <ArrowRightLeft className="w-3 h-3 xs:w-4 xs:h-4 sm:w-5 sm:h-5 text-indigo-600 group-hover:scale-110 transition-transform duration-300" />
          </div>
          <span className="text-[10px] xs:text-xs sm:text-sm font-medium capitalize group-hover:text-indigo-700 transition-colors duration-300 text-center leading-tight">Transfer</span>
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 animate-slide-in-up">
        {statCards.map((card, index) => (
          <div 
            key={card.id}
            className="bg-white rounded-xl p-3 sm:p-4 md:p-6 shadow-sm hover:shadow-lg transition-all duration-300 group animate-fade-in"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className={`p-1.5 sm:p-2 rounded-lg ${
                card.color === 'green' ? 'bg-green-100 text-green-600' :
                card.color === 'blue' ? 'bg-blue-100 text-blue-600' :
                card.color === 'purple' ? 'bg-purple-100 text-purple-600' :
                card.color === 'orange' ? 'bg-orange-100 text-orange-600' :
                card.color === 'red' ? 'bg-red-100 text-red-600' :
                card.color === 'yellow' ? 'bg-yellow-100 text-yellow-600' :
                card.color === 'indigo' ? 'bg-indigo-100 text-indigo-600' :
                'bg-gray-100 text-gray-600'
              } group-hover:scale-110 transition-transform duration-300`}>
                {getIconComponent(card.icon_name)}
              </div>
              <div className={`flex items-center text-xs sm:text-sm font-medium ${
                card.change_type === 'positive' ? 'text-green-600' : 
                card.change_type === 'negative' ? 'text-red-600' : 'text-gray-600'
              }`}>
                {card.change_type === 'positive' ? (
                  <ArrowUpRight className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                ) : card.change_type === 'negative' ? (
                  <ArrowDownRight className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                ) : null}
                {Math.abs(card.change_value)}%
              </div>
            </div>
            <div className="space-y-1">
              <h3 className="text-xs sm:text-sm font-medium text-gray-600 group-hover:text-gray-800 transition-colors duration-300">
                {card.title}
              </h3>
              <p className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 group-hover:text-primary-700 transition-colors duration-300 break-all">
                {card.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
        {/* Left Column - Accounts & Balance */}
        <div className="xl:col-span-2 space-y-3 sm:space-y-4 md:space-y-6">
          {/* Total Balance Card */}
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl p-3 sm:p-4 md:p-6 text-white animate-slide-in-up shadow-xl hover:shadow-2xl transition-all duration-500">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-3 sm:gap-4">
              <div className="animate-fade-in flex-1 min-w-0">
                <p className="text-primary-100 font-medium text-xs sm:text-sm md:text-base">Total Balance</p>
                <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold mt-1 animate-count-up break-all">${totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h2>
              </div>
              <div className="bg-white/10 p-1.5 sm:p-2 rounded-lg animate-pulse-slow flex-shrink-0">
                <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
              </div>
            </div>
            <div className="mt-3 sm:mt-4 animate-fade-in-delay hover:animate-chart-hover transition-all duration-300">
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

          {/* Financial Goals - Redesigned */}
          <div className="bg-gradient-to-br from-white via-white to-primary-50/30 rounded-xl shadow-sm overflow-hidden animate-slide-in-right hover:shadow-lg transition-all duration-300 border border-primary-100/50">
            <div className="p-3 sm:p-4 border-b border-primary-100/50 bg-gradient-to-r from-primary-50/50 to-transparent">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-primary-100">
                    <Target className="w-4 h-4 sm:w-5 sm:h-5 text-primary-600" />
                  </div>
                  <h2 className="text-base sm:text-lg font-semibold text-gray-900">Financial Goals</h2>
                </div>
                <Link to="/goals" className="text-sm text-primary-600 hover:text-primary-700 font-medium transition-colors duration-200 flex items-center gap-1">
                  View All
                  <ArrowUpRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
            
            <div className="p-3 sm:p-4 space-y-4">
              {goals.length > 0 && (
                <div className="bg-gradient-to-r from-primary-50 to-primary-100/50 rounded-lg p-3 mb-4 border border-primary-200/50">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-primary-500 flex items-center justify-center">
                      <span className="text-white text-xs font-bold">🎯</span>
                    </div>
                    <p className="text-sm text-primary-800 font-medium">
                      You're making great progress on {goals.filter(g => !isGoalCompleted(g.current, g.target)).length} active goal{goals.filter(g => !isGoalCompleted(g.current, g.target)).length !== 1 ? 's' : ''}!
                    </p>
                  </div>
                </div>
              )}
              
              {goals.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center animate-pulse-slow">
                    <Target className="w-10 h-10 text-primary-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Start Your Financial Journey</h3>
                  <p className="text-sm text-gray-500 mb-4 max-w-sm mx-auto">
                    Set your first financial goal and track your progress towards achieving your dreams.
                  </p>
                  <Link to="/goals" className="btn btn-primary btn-sm inline-flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    Create Your First Goal
                  </Link>
                </div>
              ) : (
                goals.map((goal, index) => {
                  const progressPercentage = getProgressPercentage(goal.current, goal.target);
                  const isCompleted = isGoalCompleted(goal.current, goal.target);
                  const remainingAmount = goal.target - goal.current;
                  const daysUntilDeadline = Math.ceil((new Date(goal.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                  
                  return (
                    <div 
                      key={goal.id} 
                      className="group cursor-pointer animate-slide-in-up" 
                      style={{ animationDelay: `${index * 0.1}s` }}
                      onClick={() => handleGoalClick(goal)}
                    >
                      <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-gray-100 hover:border-primary-200 hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                        {/* Goal Header */}
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 ${
                              isCompleted 
                                ? 'bg-gradient-to-br from-green-100 to-green-200' 
                                : 'bg-gradient-to-br from-primary-100 to-primary-200'
                            }`}>
                              {isCompleted ? (
                                <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                              ) : (
                                <Target className="w-5 h-5 sm:w-6 sm:h-6 text-primary-600" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className={`font-semibold text-sm sm:text-base group-hover:text-primary-700 transition-colors duration-300 truncate ${
                                  isCompleted ? 'text-green-700' : 'text-gray-900'
                                }`}>
                                  {goal.title}
                                </h3>
                                {isCompleted && (
                                  <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                                    ✓ Done
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-gray-500">
                                Due {new Date(goal.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                {daysUntilDeadline > 0 && !isCompleted && (
                                  <span className="ml-2 text-orange-600 font-medium">
                                    ({daysUntilDeadline} days left)
                                  </span>
                                )}
                              </p>
                            </div>
                          </div>
                          
                          {/* Progress Circle */}
                          <div className="relative w-12 h-12 sm:w-14 sm:h-14 group-hover:scale-110 transition-transform duration-300">
                            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                              <path
                                className="text-gray-200"
                                stroke="currentColor"
                                strokeWidth="3"
                                fill="none"
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                              />
                              <path
                                className={isCompleted ? 'text-green-500' : 'text-primary-500'}
                                stroke="currentColor"
                                strokeWidth="3"
                                fill="none"
                                strokeLinecap="round"
                                strokeDasharray={`${progressPercentage}, 100`}
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                style={{
                                  transition: 'stroke-dasharray 1.5s ease-out',
                                  filter: isCompleted ? 'drop-shadow(0 0 4px rgba(16, 185, 129, 0.3))' : 'drop-shadow(0 0 4px rgba(79, 70, 229, 0.3))'
                                }}
                              />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                              <span className="text-xs font-bold text-gray-700">
                                {Math.round(progressPercentage)}%
                              </span>
                            </div>
                            {isCompleted && (
                              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                                <CheckCircle className="w-2.5 h-2.5 text-white" />
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="mb-3">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-xs font-medium text-gray-600">Progress</span>
                            <span className="text-xs font-semibold text-gray-900">
                              ${goal.current.toLocaleString()} / ${goal.target.toLocaleString()}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden relative">
                            <div 
                              className={`h-2 rounded-full transition-all duration-700 ease-out relative ${
                                isCompleted 
                                  ? 'bg-gradient-to-r from-green-400 to-green-500' 
                                  : 'bg-gradient-to-r from-primary-400 to-primary-500'
                              }`}
                              style={{ width: `${progressPercentage}%` }}
                            >
                              {!isCompleted && progressPercentage > 0 && (
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-goal-shimmer rounded-full"></div>
                              )}
                            </div>
                            {isCompleted && (
                              <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-green-500/20 rounded-full animate-pulse"></div>
                            )}
                          </div>
                        </div>

                        {/* Goal Details */}
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1">
                              <div className="w-2 h-2 rounded-full bg-primary-500"></div>
                              <span className="text-gray-600">Saved</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                              <span className="text-gray-600">Remaining</span>
                            </div>
                          </div>
                          {!isCompleted && remainingAmount > 0 && (
                            <span className="text-orange-600 font-medium">
                              ${remainingAmount.toLocaleString()} to go
                            </span>
                          )}
                        </div>

                        {/* Action Button */}
                        <div className="mt-3 pt-3 border-t border-gray-100">
                          <button className="w-full text-xs font-medium text-primary-600 hover:text-primary-700 py-2 rounded-lg hover:bg-primary-50 transition-all duration-200 flex items-center justify-center gap-1">
                            {isCompleted ? 'View Details' : 'Add Money'}
                            <ArrowUpRight className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Upcoming Bills */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden animate-slide-in-right hover:shadow-lg transition-all duration-300">
            <div className="p-3 sm:p-4 border-b flex items-center justify-between">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900">Upcoming Bills</h2>
              <div className="flex items-center gap-2">
                {isBillsLoading && (
                  <div className="w-4 h-4 border-2 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
                )}
                <button
                  onClick={async () => {
                    if (!user || isBillsLoading) return;
                    setIsBillsLoading(true);
                    try {
                      const { data: billsData, error: billsError } = await supabase
                        .from('user_upcoming_bills')
                        .select('*')
                        .eq('user_id', user.id)
                        .eq('is_active', true)
                        .order('due_date', { ascending: true });

                      if (billsError) {
                        console.error('Error refreshing upcoming bills:', billsError);
                        return;
                      }

                      setBills(billsData || []);
                    } catch (error) {
                      console.error('Error refreshing upcoming bills:', error);
                    } finally {
                      setIsBillsLoading(false);
                    }
                  }}
                  className="p-1 text-gray-400 hover:text-primary-600 transition-colors"
                  title="Refresh upcoming bills"
                  disabled={isBillsLoading}
                >
                  <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
            </div>
            <div className="divide-y">
              {upcomingBills.length === 0 && (
                <div className="p-4 text-center text-gray-500">
                  No upcoming bills found
                </div>
              )}
              {upcomingBills.map((bill, index) => (
                <div
                  key={bill.id}
                  className="p-3 sm:p-4 hover:bg-gray-50 transition-all duration-300 animate-slide-in-up group cursor-pointer"
                  style={{ animationDelay: `${index * 0.1}s` }}
                  onClick={() => handleBillClick(bill)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 group-hover:translate-x-1 transition-transform duration-300">
                      <div className="p-2 rounded-full bg-yellow-100 text-yellow-600 group-hover:scale-110 transition-transform duration-300">
                        <Clock className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 capitalize group-hover:text-primary-700 transition-colors duration-300 text-sm sm:text-base truncate">
                          {bill.name}
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-500 font-medium capitalize">
                          {bill.category} • Due {format(new Date(bill.due_date), 'MMM d')}
                        </p>
                      </div>
                    </div>
                    <div className="text-right group-hover:translate-x-1 transition-transform duration-300 flex-shrink-0">
                      <p className="font-semibold text-sm sm:text-base text-gray-900">
                        ${bill.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </p>
                      <button 
                        className="text-xs text-primary-600 hover:text-primary-700 font-medium transition-colors duration-200"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Handle pay now action
                        }}
                      >
                        Pay Now
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Market Overview */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden animate-slide-in-right hover:shadow-lg transition-all duration-300">
            <div className="p-3 sm:p-4 border-b flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-semibold text-gray-900">Market Overview</h2>
                {isMarketLoading && (
                  <div className="w-4 h-4 border-2 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
                )}
              </div>
              <div className="flex items-center gap-2">
                {marketLastUpdated && (
                  <span className="text-xs text-gray-500">
                    {new Date(marketLastUpdated).toLocaleTimeString()}
                  </span>
                )}
                <button
                  onClick={refreshMarketData}
                  className="p-1 text-gray-400 hover:text-primary-600 transition-colors"
                  title="Refresh market data"
                >
                  <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
            </div>
            
            {marketError ? (
              <div className="p-4 text-center">
                <p className="text-sm text-red-600 mb-2">Failed to load market data</p>
                <button
                  onClick={refreshMarketData}
                  className="text-xs text-primary-600 hover:text-primary-700 font-medium"
                >
                  Try again
                </button>
              </div>
            ) : (
              <>
                {/* Market Summary */}
                {marketData.length > 0 && (
                  <div className="p-4 bg-gray-50 border-b">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                      <div>
                        <p className="text-xs text-gray-500 font-medium">S&P 500</p>
                        <p className="text-sm font-semibold text-gray-900">
                          {marketData.find(s => s.symbol === 'SPY')?.price.toFixed(2) || 'N/A'}
                        </p>
                        <p className={`text-xs font-medium ${
                          (marketData.find(s => s.symbol === 'SPY')?.change || 0) >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {marketData.find(s => s.symbol === 'SPY')?.changePercent.toFixed(2) || '0.00'}%
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 font-medium">NASDAQ</p>
                        <p className="text-sm font-semibold text-gray-900">
                          {marketData.find(s => s.symbol === 'QQQ')?.price.toFixed(2) || 'N/A'}
                        </p>
                        <p className={`text-xs font-medium ${
                          (marketData.find(s => s.symbol === 'QQQ')?.change || 0) >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {marketData.find(s => s.symbol === 'QQQ')?.changePercent.toFixed(2) || '0.00'}%
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 font-medium">Gold</p>
                        <p className="text-sm font-semibold text-gray-900">
                          {marketData.find(s => s.symbol === 'GOLD')?.price.toFixed(2) || 'N/A'}
                        </p>
                        <p className={`text-xs font-medium ${
                          (marketData.find(s => s.symbol === 'GOLD')?.change || 0) >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {marketData.find(s => s.symbol === 'GOLD')?.changePercent.toFixed(2) || '0.00'}%
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 font-medium">Tesla</p>
                        <p className="text-sm font-semibold text-gray-900">
                          {marketData.find(s => s.symbol === 'TSLA')?.price.toFixed(2) || 'N/A'}
                        </p>
                        <p className={`text-xs font-medium ${
                          (marketData.find(s => s.symbol === 'TSLA')?.change || 0) >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {marketData.find(s => s.symbol === 'TSLA')?.changePercent.toFixed(2) || '0.00'}%
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              <div className="divide-y max-h-96 overflow-y-auto">
                {marketData.length === 0 && isMarketLoading ? (
                  <div className="p-4 text-center text-gray-500">
                    <div className="w-6 h-6 border-2 border-gray-300 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                    <p className="text-sm">Loading market data...</p>
                  </div>
                ) : (
                  marketData.map((stock, index) => (
                    <div
                      key={stock.symbol}
                      className="p-3 sm:p-4 hover:bg-gray-50 transition-all duration-300 animate-slide-in-up group"
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 group-hover:translate-x-1 transition-transform duration-300">
                          <div className={`p-2 rounded-full group-hover:scale-110 transition-transform duration-300 ${
                            stock.symbol === 'GOLD' ? 'bg-yellow-100 text-yellow-600' :
                            stock.symbol === 'SPY' || stock.symbol === 'QQQ' ? 'bg-purple-100 text-purple-600' :
                            stock.symbol === 'TSLA' ? 'bg-red-100 text-red-600' :
                            stock.symbol === 'AAPL' ? 'bg-gray-100 text-gray-600' :
                            stock.symbol === 'AMZN' ? 'bg-orange-100 text-orange-600' :
                            'bg-blue-100 text-blue-600'
                          }`}>
                            <Activity className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-gray-900 group-hover:text-primary-700 transition-colors duration-300 text-sm sm:text-base truncate">
                              {stock.symbol}
                            </h3>
                            <p className="text-xs sm:text-sm text-gray-500 font-medium truncate">
                              {stock.name}
                            </p>
                          </div>
                        </div>
                        <div className="text-right group-hover:translate-x-1 transition-transform duration-300 flex-shrink-0">
                          <p className="font-semibold text-sm sm:text-base text-gray-900">
                            ${stock.price.toFixed(2)}
                          </p>
                          <p className={`text-xs font-medium ${
                            stock.change >= 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)} ({stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%)
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
              </>
            )}
          </div>

          {/* Financial Health Score */}
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl p-4 sm:p-6 text-white animate-slide-in-right hover:shadow-lg transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-white/20">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-semibold">Financial Health</h2>
                  <p className="text-xs sm:text-sm text-indigo-100">Your overall score</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl sm:text-3xl font-bold">{financialHealthScore}</div>
                <div className="text-xs sm:text-sm text-indigo-100">out of 100</div>
              </div>
            </div>
            <div className="w-full bg-white/20 rounded-full h-2 mb-3">
              <div 
                className="bg-white rounded-full h-2 transition-all duration-1000 ease-out"
                style={{ width: `${financialHealthScore}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <span className="text-indigo-100">Excellent</span>
              <span className="text-indigo-100">Keep it up!</span>
            </div>
          </div>
        </div>
      </div>

      {/* Goal Details Modal */}
      {showGoalModal && selectedGoal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md relative animate-fade-in-up">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-black text-2xl font-bold transition-colors duration-200"
              onClick={() => setShowGoalModal(false)}
              aria-label="Close"
            >
              <X className="w-6 h-6" />
            </button>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3 mb-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  isGoalCompleted(selectedGoal.current, selectedGoal.target) ? 'bg-green-100' : 'bg-primary-100'
                }`}>
                  {isGoalCompleted(selectedGoal.current, selectedGoal.target) ? (
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  ) : (
                    <Target className="w-6 h-6 text-primary-600" />
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{selectedGoal.title}</h3>
                  <p className="text-sm text-gray-500">Deadline: {new Date(selectedGoal.deadline).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>{getProgressPercentage(selectedGoal.current, selectedGoal.target).toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-500 ${
                      isGoalCompleted(selectedGoal.current, selectedGoal.target) ? 'bg-green-500' : 'bg-primary-600'
                    }`}
                    style={{ width: `${getProgressPercentage(selectedGoal.current, selectedGoal.target)}%` }}
                  />
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>${selectedGoal.current.toLocaleString()}</span>
                  <span>${selectedGoal.target.toLocaleString()}</span>
                </div>
                <div className="text-sm text-gray-500">
                  ${(selectedGoal.target - selectedGoal.current).toLocaleString()} remaining
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <button
                  onClick={() => {
                    setShowGoalModal(false);
                    setShowAddMoneyModal(true);
                  }}
                  className="flex-1 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors duration-200 flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Money
                </button>
                <button
                  onClick={() => setShowGoalModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Money Modal */}
      {showAddMoneyModal && selectedGoal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md relative animate-fade-in-up">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-black text-2xl font-bold transition-colors duration-200"
              onClick={() => setShowAddMoneyModal(false)}
              aria-label="Close"
            >
              <X className="w-6 h-6" />
            </button>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Add Money to {selectedGoal.title}</h3>
                  <p className="text-sm text-gray-500">Current: ${selectedGoal.current.toLocaleString()}</p>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Amount to Add
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                    <input
                      type="number"
                      value={addAmount}
                      onChange={(e) => setAddAmount(e.target.value)}
                      className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="0.00"
                      min="0"
                      max={selectedGoal.target - selectedGoal.current}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {[100, 500, 1000].map((amount) => (
                    <button
                      key={amount}
                      onClick={() => setAddAmount(amount.toString())}
                      className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                    >
                      ${amount}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <button
                  onClick={() => {
                    const amount = parseFloat(addAmount);
                    if (amount > 0) {
                      handleAddMoney(selectedGoal.id, amount);
                    }
                  }}
                  disabled={!addAmount || parseFloat(addAmount) <= 0}
                  className="flex-1 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors duration-200 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add ${addAmount || '0'}
                </button>
                <button
                  onClick={() => {
                    setShowAddMoneyModal(false);
                    setAddAmount('');
                  }}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bill Details Modal */}
      {showBillModal && selectedBill && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-lg relative max-h-[90vh] overflow-y-auto">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-black text-2xl font-bold transition-colors duration-200"
              onClick={() => setShowBillModal(false)}
              aria-label="Close"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="mb-6">
              {/* Header */}
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
                  <Clock className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-gray-900 capitalize">{selectedBill.name}</h2>
                  <p className="text-sm text-gray-500 capitalize">{selectedBill.category}</p>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                  selectedBill.is_paid 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {selectedBill.is_paid ? 'Paid' : 'Pending'}
                </div>
              </div>

              {/* Bill Details */}
              <div className="space-y-4 mb-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">Bill Information</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 font-medium">Amount Due</span>
                      <span className="text-xl font-bold text-gray-900">
                        ${selectedBill.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 font-medium">Due Date</span>
                      <span className="text-gray-900 font-medium">
                        {format(new Date(selectedBill.due_date), 'EEEE, MMMM d, yyyy')}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 font-medium">Days Until Due</span>
                      <span className={`font-medium ${
                        Math.ceil((new Date(selectedBill.due_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) <= 3
                          ? 'text-red-600'
                          : Math.ceil((new Date(selectedBill.due_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) <= 7
                          ? 'text-yellow-600'
                          : 'text-gray-900'
                      }`}>
                        {Math.ceil((new Date(selectedBill.due_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 font-medium">Bill ID</span>
                      <span className="text-gray-900 font-mono text-sm">{selectedBill.id}</span>
                    </div>
                  </div>
                </div>

                {/* Payment Options */}
                <div className="bg-blue-50 rounded-lg p-4">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">Payment Options</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Pay from checking account</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>Pay with debit card</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span>Set up automatic payments</span>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">Quick Actions</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <button className="p-2 text-xs bg-white rounded border hover:bg-gray-50 transition-colors">
                      📅 Set Reminder
                    </button>
                    <button className="p-2 text-xs bg-white rounded border hover:bg-gray-50 transition-colors">
                      📧 Email Bill
                    </button>
                    <button className="p-2 text-xs bg-white rounded border hover:bg-gray-50 transition-colors">
                      📱 Add to Calendar
                    </button>
                    <button className="p-2 text-xs bg-white rounded border hover:bg-gray-50 transition-colors">
                      💳 Auto Pay
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              {/* Primary Actions */}
              <div className="flex gap-3">
                {!selectedBill.is_paid && (
                  <button
                    onClick={() => {
                      // Handle pay now action
                      console.log('Pay now clicked for bill:', selectedBill.id);
                      // TODO: Implement payment processing
                      setShowBillModal(false);
                    }}
                    className="flex-1 bg-primary-600 text-white px-4 py-3 rounded-lg hover:bg-primary-700 transition-colors duration-200 flex items-center justify-center gap-2 font-medium"
                  >
                    <CreditCard className="w-4 h-4" />
                    Pay Now
                  </button>
                )}
                <button
                  onClick={() => {
                    // Handle schedule payment
                    console.log('Schedule payment for bill:', selectedBill.id);
                    // TODO: Implement payment scheduling
                  }}
                  className="flex-1 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center gap-2 font-medium"
                >
                  <Clock className="w-4 h-4" />
                  Schedule
                </button>
              </div>

              {/* Secondary Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    // Handle set reminder
                    console.log('Set reminder for bill:', selectedBill.id);
                    // TODO: Implement reminder setting
                  }}
                  className="flex-1 bg-gray-100 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-200 transition-colors duration-200 text-sm font-medium"
                >
                  Set Reminder
                </button>
                <button
                  onClick={() => {
                    // Handle view history
                    console.log('View payment history for bill:', selectedBill.id);
                    // TODO: Implement payment history view
                  }}
                  className="flex-1 bg-gray-100 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-200 transition-colors duration-200 text-sm font-medium"
                >
                  View History
                </button>
                <button
                  onClick={() => setShowBillModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;