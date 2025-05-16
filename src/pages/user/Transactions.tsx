import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../store/authStore';
import { ChevronDown, Filter, Search, ArrowUpRight, ArrowDownRight, Download } from 'lucide-react';
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
          <button className="btn btn-outline flex items-center">
            <Download className="w-4 h-4 mr-1" />
            Export
          </button>
        </div>
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
          transactions={filteredTransactions} 
          accountMap={accountMap}
          showAccountName={selectedAccount === 'all'}
        />
        
        {filteredTransactions.length === 0 && (
          <div className="py-8 text-center text-gray-500">
            No transactions match your filters
          </div>
        )}
      </div>
    </div>
  );
};

export default Transactions;