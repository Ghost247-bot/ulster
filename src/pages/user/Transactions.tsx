import { useState, useEffect } from 'react';
import { format, subDays } from 'date-fns';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../store/authStore';
import { ChevronDown, Filter, Search, ArrowUpRight, ArrowDownRight, Download, ArrowUp, ArrowDown } from 'lucide-react';
import TransactionList from '../../components/ui/TransactionList';
import Loading from '../../components/ui/Loading';

interface Transaction {
  id: number;
  account_id: number;
  amount: number;
  description: string;
  transaction_type: string;
  created_at: string;
}

interface Account {
  id: number;
  account_type: string;
  account_number: string;
}

interface TransactionStats {
  totalDeposits: number;
  totalWithdrawals: number;
  netAmount: number;
  transactionCount: number;
}

const ITEMS_PER_PAGE = 10;

const Transactions = () => {
  const { user } = useAuthStore();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAccount, setSelectedAccount] = useState<number | 'all'>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [dateRange, setDateRange] = useState<{start: string | null, end: string | null}>({
    start: null, 
    end: null
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Transaction;
    direction: 'asc' | 'desc';
  }>({ key: 'created_at', direction: 'desc' });
  const [stats, setStats] = useState<TransactionStats>({
    totalDeposits: 0,
    totalWithdrawals: 0,
    netAmount: 0,
    transactionCount: 0
  });

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!user) return;

      try {
        // Fetch user accounts first
        const { data: accountsData, error: accountsError } = await supabase
          .from('accounts')
          .select('id, account_type, account_number')
          .eq('user_id', user.id);

        if (accountsError) throw accountsError;
        setAccounts(accountsData || []);

        // If user has accounts, fetch transactions
        if (accountsData && accountsData.length > 0) {
          const accountIds = accountsData.map((account) => account.id);
          
          const { data: transactionsData, error: transactionsError } = await supabase
            .from('transactions')
            .select('*')
            .in('account_id', accountIds)
            .order('created_at', { ascending: false });

          if (transactionsError) throw transactionsError;
          setTransactions(transactionsData || []);
          setFilteredTransactions(transactionsData || []);
        }
      } catch (error) {
        console.error('Error fetching transactions:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactions();
  }, [user]);

  // Apply filters
  useEffect(() => {
    let filtered = [...transactions];
    
    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (transaction) => 
          transaction.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filter by account
    if (selectedAccount !== 'all') {
      filtered = filtered.filter(
        (transaction) => transaction.account_id === selectedAccount
      );
    }
    
    // Filter by transaction type
    if (selectedType !== 'all') {
      filtered = filtered.filter(
        (transaction) => transaction.transaction_type === selectedType
      );
    }
    
    // Filter by date range
    if (dateRange.start) {
      filtered = filtered.filter(
        (transaction) => new Date(transaction.created_at) >= new Date(dateRange.start!)
      );
    }
    
    if (dateRange.end) {
      filtered = filtered.filter(
        (transaction) => new Date(transaction.created_at) <= new Date(dateRange.end!)
      );
    }
    
    setFilteredTransactions(filtered);
  }, [searchTerm, selectedAccount, selectedType, dateRange, transactions]);

  // Calculate statistics
  useEffect(() => {
    const calculateStats = () => {
      const stats = filteredTransactions.reduce((acc, transaction) => {
        const amount = transaction.amount;
        if (transaction.transaction_type === 'deposit') {
          acc.totalDeposits += amount;
        } else if (transaction.transaction_type === 'withdrawal') {
          acc.totalWithdrawals += amount;
        }
        acc.transactionCount += 1;
        return acc;
      }, {
        totalDeposits: 0,
        totalWithdrawals: 0,
        netAmount: 0,
        transactionCount: 0
      });

      stats.netAmount = stats.totalDeposits - stats.totalWithdrawals;
      setStats(stats);
    };

    calculateStats();
  }, [filteredTransactions]);

  // Sort transactions
  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    if (sortConfig.key === 'created_at') {
      return sortConfig.direction === 'asc' 
        ? new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        : new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }
    
    if (typeof a[sortConfig.key] === 'string') {
      return sortConfig.direction === 'asc'
        ? String(a[sortConfig.key]).localeCompare(String(b[sortConfig.key]))
        : String(b[sortConfig.key]).localeCompare(String(a[sortConfig.key]));
    }
    
    return sortConfig.direction === 'asc'
      ? Number(a[sortConfig.key]) - Number(b[sortConfig.key])
      : Number(b[sortConfig.key]) - Number(a[sortConfig.key]);
  });

  // Pagination
  const totalPages = Math.ceil(sortedTransactions.length / ITEMS_PER_PAGE);
  const paginatedTransactions = sortedTransactions.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleSort = (key: keyof Transaction) => {
    setSortConfig(current => ({
      key,
      direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleQuickDateRange = (days: number) => {
    const end = new Date();
    const start = subDays(end, days);
    setDateRange({
      start: format(start, 'yyyy-MM-dd'),
      end: format(end, 'yyyy-MM-dd')
    });
  };

  // Create a mapping of account IDs to account names
  const accountMap = accounts.reduce<Record<number, string>>((acc, account) => {
    acc[account.id] = `${account.account_type} (${account.account_number.slice(-4)})`;
    return acc;
  }, {});

  const handleDateChange = (type: 'start' | 'end', value: string) => {
    setDateRange(prev => ({
      ...prev,
      [type]: value || null
    }));
  };

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedAccount('all');
    setSelectedType('all');
    setDateRange({ start: null, end: null });
  };

  const exportTransactions = () => {
    // Create CSV header
    const headers = ['Date', 'Account', 'Type', 'Description', 'Amount'];
    const csvContent = [headers.join(',')];

    // Add transaction rows
    filteredTransactions.forEach(transaction => {
      const row = [
        format(new Date(transaction.created_at), 'yyyy-MM-dd'),
        accountMap[transaction.account_id] || 'Unknown Account',
        transaction.transaction_type,
        `"${transaction.description.replace(/"/g, '""')}"`, // Escape quotes in description
        transaction.amount.toFixed(2)
      ];
      csvContent.push(row.join(','));
    });

    // Create and download the file
    const blob = new Blob([csvContent.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `transactions_${format(new Date(), 'yyyy-MM-dd')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
          <p className="text-gray-600 mt-1">View and manage your transaction history</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button 
            className="btn btn-outline flex items-center"
            onClick={exportTransactions}
            disabled={filteredTransactions.length === 0}
          >
            <Download className="w-4 h-4 mr-1" />
            Export
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-md p-4">
          <h3 className="text-sm font-medium text-gray-500">Total Deposits</h3>
          <p className="text-2xl font-bold text-green-600">${stats.totalDeposits.toFixed(2)}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <h3 className="text-sm font-medium text-gray-500">Total Withdrawals</h3>
          <p className="text-2xl font-bold text-red-600">${stats.totalWithdrawals.toFixed(2)}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <h3 className="text-sm font-medium text-gray-500">Net Amount</h3>
          <p className={`text-2xl font-bold ${stats.netAmount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            ${stats.netAmount.toFixed(2)}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <h3 className="text-sm font-medium text-gray-500">Transaction Count</h3>
          <p className="text-2xl font-bold text-gray-900">{stats.transactionCount}</p>
        </div>
      </div>

      {/* Quick Date Range Buttons */}
      <div className="flex gap-2">
        <button 
          className="btn btn-sm btn-outline"
          onClick={() => handleQuickDateRange(7)}
        >
          Last 7 Days
        </button>
        <button 
          className="btn btn-sm btn-outline"
          onClick={() => handleQuickDateRange(30)}
        >
          Last 30 Days
        </button>
        <button 
          className="btn btn-sm btn-outline"
          onClick={() => handleQuickDateRange(90)}
        >
          Last 90 Days
        </button>
      </div>

      {/* Filters Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search transactions..."
                className="form-input pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Account Filter */}
          <div className="w-full md:w-48">
            <div className="relative">
              <select
                className="form-input appearance-none pr-10"
                value={selectedAccount === 'all' ? 'all' : selectedAccount}
                onChange={(e) => setSelectedAccount(e.target.value === 'all' ? 'all' : Number(e.target.value))}
              >
                <option value="all">All Accounts</option>
                {accounts.map((account) => (
                  <option key={account.id} value={account.id}>
                    {account.account_type.charAt(0).toUpperCase() + account.account_type.slice(1)} ({account.account_number.slice(-4)})
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Transaction Type Filter */}
          <div className="w-full md:w-48">
            <div className="relative">
              <select
                className="form-input appearance-none pr-10"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
              >
                <option value="all">All Types</option>
                <option value="deposit">Deposits</option>
                <option value="withdrawal">Withdrawals</option>
                <option value="transfer">Transfers</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Date Filters */}
        <div className="mt-4 flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 items-end">
          <div className="w-full md:w-48">
            <label htmlFor="date-start" className="form-label">
              From Date
            </label>
            <input
              id="date-start"
              type="date"
              className="form-input"
              value={dateRange.start || ''}
              onChange={(e) => handleDateChange('start', e.target.value)}
            />
          </div>
          <div className="w-full md:w-48">
            <label htmlFor="date-end" className="form-label">
              To Date
            </label>
            <input
              id="date-end"
              type="date"
              className="form-input"
              value={dateRange.end || ''}
              onChange={(e) => handleDateChange('end', e.target.value)}
            />
          </div>
          <div className="md:ml-auto">
            <button
              onClick={resetFilters}
              className="btn btn-outline flex items-center"
            >
              <Filter className="w-4 h-4 mr-2" />
              Reset Filters
            </button>
          </div>
        </div>
      </div>

      {/* Transactions List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-medium text-gray-900">
            {filteredTransactions.length} {filteredTransactions.length === 1 ? 'Transaction' : 'Transactions'}
          </h2>
        </div>
        
        <TransactionList 
          transactions={paginatedTransactions} 
          accountMap={accountMap}
          showAccountName={selectedAccount === 'all'}
          onSort={handleSort}
          sortConfig={sortConfig}
        />
        
        {filteredTransactions.length === 0 && (
          <div className="py-8 text-center text-gray-500">
            No transactions match your filters
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500">
                Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, filteredTransactions.length)} of {filteredTransactions.length} transactions
              </div>
              <div className="flex gap-2">
                <button
                  className="btn btn-sm btn-outline"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
                <button
                  className="btn btn-sm btn-outline"
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Transactions;