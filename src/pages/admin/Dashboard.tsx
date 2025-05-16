import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Users, CreditCard, DollarSign, BellRing } from 'lucide-react';
import Loading from '../../components/ui/Loading';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalAccounts: 0,
    totalCards: 0,
    totalBalance: 0,
    frozenAccounts: 0,
    accountsByType: {
      checking: 0,
      savings: 0,
      investment: 0,
      escrow: 0,
    },
  });
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch user count
        const { count: userCount, error: userError } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true });

        if (userError) throw userError;

        // Fetch accounts data
        const { data: accountsData, error: accountsError } = await supabase
          .from('accounts')
          .select('*');

        if (accountsError) throw accountsError;

        // Calculate account statistics
        const totalAccounts = accountsData?.length || 0;
        const totalBalance = accountsData?.reduce((sum, account) => sum + account.balance, 0) || 0;
        const frozenAccounts = accountsData?.filter(account => account.is_frozen).length || 0;
        
        // Count account types
        const accountsByType = {
          checking: accountsData?.filter(account => account.account_type === 'checking').length || 0,
          savings: accountsData?.filter(account => account.account_type === 'savings').length || 0,
          investment: accountsData?.filter(account => account.account_type === 'investment').length || 0,
          escrow: accountsData?.filter(account => account.account_type === 'escrow').length || 0,
        };

        // Fetch cards count
        const { count: cardCount, error: cardError } = await supabase
          .from('cards')
          .select('*', { count: 'exact', head: true });

        if (cardError) throw cardError;

        // Fetch recent transactions
        const { data: transactionsData, error: transactionsError } = await supabase
          .from('transactions')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(5);

        if (transactionsError) throw transactionsError;

        setStats({
          totalUsers: userCount || 0,
          totalAccounts,
          totalCards: cardCount || 0,
          totalBalance,
          frozenAccounts,
          accountsByType,
        });

        setRecentTransactions(transactionsData || []);
      } catch (error) {
        console.error('Error fetching admin dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Chart data for account balances
  const balanceData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Total Balance',
        data: [10000, 15000, 12000, 20000, 18000, stats.totalBalance],
        borderColor: '#0A2463',
        backgroundColor: 'rgba(10, 36, 99, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  // Chart data for account types
  const accountTypeData = {
    labels: ['Checking', 'Savings', 'Investment', 'Escrow'],
    datasets: [
      {
        data: [
          stats.accountsByType.checking,
          stats.accountsByType.savings,
          stats.accountsByType.investment,
          stats.accountsByType.escrow,
        ],
        backgroundColor: [
          'rgba(10, 36, 99, 0.8)',
          'rgba(255, 215, 0, 0.8)',
          'rgba(19, 184, 109, 0.8)',
          'rgba(227, 46, 31, 0.7)',
        ],
        borderColor: [
          '#0A2463',
          '#FFD700',
          '#13B86D',
          '#E32E1F',
        ],
        borderWidth: 1,
      },
    ],
  };

  // Chart data for transactions
  const transactionData = {
    labels: ['Deposits', 'Withdrawals', 'Transfers'],
    datasets: [
      {
        label: 'Transaction Count',
        data: [25, 18, 12],
        backgroundColor: [
          'rgba(19, 184, 109, 0.7)',
          'rgba(227, 46, 31, 0.7)',
          'rgba(10, 36, 99, 0.7)',
        ],
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
    },
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
              <Users className="w-6 h-6 text-primary-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-primary-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Accounts</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalAccounts}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-full bg-secondary-100 flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-secondary-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Cards</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalCards}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-full bg-success-100 flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-success-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Balance</p>
              <p className="text-2xl font-bold text-success-600">
                ${stats.totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6 lg:col-span-2">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Balance History</h2>
          <div className="h-64">
            <Line data={balanceData} options={chartOptions} />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Account Types</h2>
          <div className="h-64 flex items-center justify-center">
            <Doughnut data={accountTypeData} options={doughnutOptions} />
          </div>
        </div>
      </div>

      {/* Additional Stats Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Transaction Types</h2>
          <div className="h-64">
            <Bar data={transactionData} options={chartOptions} />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">System Status</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-success-500 mr-3"></div>
                <span className="font-medium">System Status</span>
              </div>
              <span className="text-success-600 font-medium">Operational</span>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-error-500 mr-3"></div>
                <span className="font-medium">Frozen Accounts</span>
              </div>
              <span className="text-error-600 font-medium">{stats.frozenAccounts}</span>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-success-500 mr-3"></div>
                <span className="font-medium">API Status</span>
              </div>
              <span className="text-success-600 font-medium">99.9% Uptime</span>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-success-500 mr-3"></div>
                <span className="font-medium">Database</span>
              </div>
              <span className="text-success-600 font-medium">Connected</span>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-warning-500 mr-3"></div>
                <span className="font-medium">Scheduled Maintenance</span>
              </div>
              <span className="text-warning-600 font-medium">In 3 days</span>
            </div>
          </div>
        </div>
      </div>

      {/* Alerts Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-gray-900">Recent System Alerts</h2>
          <button className="text-primary-600 hover:text-primary-800 text-sm font-medium">View All</button>
        </div>
        
        <div className="space-y-4">
          <div className="flex p-4 bg-warning-50 rounded-lg border border-warning-200">
            <BellRing className="w-5 h-5 text-warning-500 mr-3 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-warning-800">Scheduled Maintenance</h3>
              <p className="text-sm text-warning-700 mt-1">
                System maintenance scheduled for June 15, 2025 at 2:00 AM EST. Some services may be temporarily unavailable.
              </p>
            </div>
          </div>
          
          <div className="flex p-4 bg-error-50 rounded-lg border border-error-200">
            <BellRing className="w-5 h-5 text-error-500 mr-3 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-error-800">Security Alert</h3>
              <p className="text-sm text-error-700 mt-1">
                Unusual login activity detected from multiple IP addresses. Security team is investigating.
              </p>
            </div>
          </div>
          
          <div className="flex p-4 bg-success-50 rounded-lg border border-success-200">
            <BellRing className="w-5 h-5 text-success-500 mr-3 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-success-800">System Update Completed</h3>
              <p className="text-sm text-success-700 mt-1">
                The latest security patches and system updates have been successfully applied.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;