import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { ChevronDown, Edit, Plus, Search, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import Loading from '../../components/ui/Loading';
import toast from 'react-hot-toast';

interface Transaction {
  id: number;
  account_id: number;
  amount: number;
  description: string;
  transaction_type: 'deposit' | 'withdrawal' | 'transfer';
  created_at: string;
}

interface Account {
  id: number;
  user_id: string;
  account_type: string;
  account_number: string;
}

interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
}

const AdminTransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [transactionTypeFilter, setTransactionTypeFilter] = useState<string>('all');
  const [accountFilter, setAccountFilter] = useState<number | 'all'>('all');
  const [dateRange, setDateRange] = useState<{start: string | null, end: string | null}>({
    start: null, 
    end: null
  });
  
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState<Partial<Transaction>>({});
  const [selectedAccountId, setSelectedAccountId] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch users first
        const { data: usersData, error: usersError } = await supabase
          .from('profiles')
          .select('id, first_name, last_name, email');

        if (usersError) throw usersError;
        setUsers(usersData || []);

        // Fetch accounts
        const { data: accountsData, error: accountsError } = await supabase
          .from('accounts')
          .select('id, user_id, account_type, account_number');

        if (accountsError) throw accountsError;
        setAccounts(accountsData || []);

        // Fetch transactions
        const { data: transactionsData, error: transactionsError } = await supabase
          .from('transactions')
          .select('*')
          .order('created_at', { ascending: false });

        if (transactionsError) throw transactionsError;
        setTransactions(transactionsData || []);
        setFilteredTransactions(transactionsData || []);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load transaction data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    // Apply filters
    let filtered = [...transactions];
    
    // Search term filter
    if (searchTerm) {
      filtered = filtered.filter(
        (transaction) =>
          transaction.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Transaction type filter
    if (transactionTypeFilter !== 'all') {
      filtered = filtered.filter((transaction) => transaction.transaction_type === transactionTypeFilter);
    }
    
    // Account filter
    if (accountFilter !== 'all') {
      filtered = filtered.filter((transaction) => transaction.account_id === accountFilter);
    }
    
    // Date range filter
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
  }, [searchTerm, transactionTypeFilter, accountFilter, dateRange, transactions]);

  const getAccountInfo = (accountId: number) => {
    const account = accounts.find((a) => a.id === accountId);
    
    if (!account) return { name: 'Unknown Account', owner: 'Unknown User' };
    
    const user = users.find((u) => u.id === account.user_id);
    const userName = user ? `${user.first_name} ${user.last_name}` : 'Unknown User';
    
    return {
      name: `${account.account_type.charAt(0).toUpperCase() + account.account_type.slice(1)} (${account.account_number.slice(-4)})`,
      owner: userName,
    };
  };

  const handleDateChange = (type: 'start' | 'end', value: string) => {
    setDateRange(prev => ({
      ...prev,
      [type]: value || null
    }));
  };

  const resetFilters = () => {
    setSearchTerm('');
    setTransactionTypeFilter('all');
    setAccountFilter('all');
    setDateRange({ start: null, end: null });
  };

  const openEditModal = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setFormData(transaction);
    setSelectedAccountId(transaction.account_id);
    setIsModalOpen(true);
    setIsCreating(false);
  };

  const openCreateModal = () => {
    setSelectedTransaction(null);
    setFormData({
      amount: 0,
      description: '',
      transaction_type: 'deposit',
      created_at: new Date().toISOString().split('T')[0],
    });
    setSelectedAccountId(accounts.length > 0 ? accounts[0].id : null);
    setIsModalOpen(true);
    setIsCreating(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTransaction(null);
    setFormData({});
    setSelectedAccountId(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === 'amount') {
      setFormData({ ...formData, [name]: parseFloat(value) || 0 });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedAccountId) {
      toast.error('Please select an account');
      return;
    }

    // Check authentication
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !session) {
      toast.error('You must be logged in to perform this action');
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
      toast.error('Error checking permissions');
      return;
    }

    if (!profile?.is_admin) {
      toast.error('You do not have permission to perform this action');
      return;
    }
    
    try {
      if (isCreating) {
        // Get account to update balance
        const { data: accountData, error: accountError } = await supabase
          .from('accounts')
          .select('balance, user_id, is_frozen')
          .eq('id', selectedAccountId)
          .single();
        
        if (accountError) {
          console.error('Error fetching account:', accountError);
          throw accountError;
        }

        // Check if account is frozen
        if (accountData.is_frozen) {
          toast.error('Cannot process transactions for a frozen account');
          return;
        }
        
        // Calculate new balance
        let newBalance = accountData.balance;
        if (formData.transaction_type === 'deposit') {
          newBalance += formData.amount || 0;
        } else if (formData.transaction_type === 'withdrawal') {
          newBalance -= formData.amount || 0;
        }
        
        // Create transaction with selected date
        const newTransaction = {
          ...formData,
          account_id: selectedAccountId,
          created_at: formData.created_at ? new Date(formData.created_at).toISOString() : new Date().toISOString(),
        };

        console.log('Creating transaction:', newTransaction); // Debug log
        
        const { data, error } = await supabase
          .from('transactions')
          .insert(newTransaction)
          .select();

        if (error) {
          console.error('Transaction insert error:', error);
          throw error;
        }
        
        // Update account balance
        const { error: updateError } = await supabase
          .from('accounts')
          .update({ balance: newBalance })
          .eq('id', selectedAccountId);
          
        if (updateError) {
          console.error('Error updating account balance:', updateError);
          throw updateError;
        }
        
        // Create notification
        const { error: notificationError } = await supabase.from('notifications').insert({
          user_id: accountData.user_id,
          title: `New ${formData.transaction_type} Transaction`,
          message: `A ${formData.transaction_type} of $${formData.amount?.toFixed(2)} has been applied to your account: ${formData.description}`,
        });

        if (notificationError) {
          console.error('Error creating notification:', notificationError);
          // Don't throw here, as the transaction was successful
        }
        
        // Update local state
        setTransactions([data![0], ...transactions]);
        
        toast.success('Transaction created successfully');
      } else if (selectedTransaction) {
        // For editing we don't update the account balance to avoid complications
        // since we're not tracking the original transaction type and amount impact
        
        const { error } = await supabase
          .from('transactions')
          .update(formData)
          .eq('id', selectedTransaction.id);

        if (error) throw error;
        
        // Update local state
        setTransactions(
          transactions.map((t) =>
            t.id === selectedTransaction.id ? { ...t, ...formData } as Transaction : t
          )
        );
        
        toast.success('Transaction updated successfully');
      }
      
      closeModal();
    } catch (error) {
      console.error('Error saving transaction:', error);
      toast.error('Failed to save transaction');
    }
  };

  const handleDelete = async () => {
    if (!selectedTransaction) return;
    
    try {
      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', selectedTransaction.id);

      if (error) throw error;
      
      // Update local state
      setTransactions(transactions.filter((t) => t.id !== selectedTransaction.id));
      
      toast.success('Transaction deleted successfully');
      closeModal();
    } catch (error) {
      console.error('Error deleting transaction:', error);
      toast.error('Failed to delete transaction');
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
          <p className="text-gray-600 mt-1">Manage and view transaction history</p>
        </div>
        <button
          onClick={openCreateModal}
          className="btn btn-primary flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Transaction
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by description..."
              className="form-input pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="w-full md:w-48">
            <div className="relative">
              <select
                className="form-input appearance-none pr-10"
                value={transactionTypeFilter}
                onChange={(e) => setTransactionTypeFilter(e.target.value)}
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
          
          <div className="w-full md:w-64">
            <div className="relative">
              <select
                className="form-input appearance-none pr-10"
                value={accountFilter === 'all' ? 'all' : accountFilter}
                onChange={(e) => setAccountFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))}
              >
                <option value="all">All Accounts</option>
                {accounts.map((account) => (
                  <option key={account.id} value={account.id}>
                    {account.account_type} ({account.account_number.slice(-4)})
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Date Range Filters */}
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
              className="btn btn-outline"
            >
              Reset Filters
            </button>
          </div>
        </div>
      </div>

      {/* Transactions List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date & Time
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Account
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                    No transactions found
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((transaction) => {
                  const accountInfo = getAccountInfo(transaction.account_id);
                  const isDeposit = transaction.transaction_type === 'deposit';
                  const isTransfer = transaction.transaction_type === 'transfer';
                  
                  return (
                    <tr key={transaction.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div>{format(new Date(transaction.created_at), 'MMM d, yyyy')}</div>
                        <div>{format(new Date(transaction.created_at), 'h:mm a')}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {accountInfo.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {accountInfo.owner}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {transaction.description}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          isDeposit
                            ? 'bg-success-100 text-success-800'
                            : isTransfer
                              ? 'bg-primary-100 text-primary-800'
                              : 'bg-error-100 text-error-800'
                        }`}>
                          {transaction.transaction_type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <span className={
                          isDeposit
                            ? 'text-success-600'
                            : isTransfer
                              ? 'text-primary-600'
                              : 'text-error-600'
                        }>
                          {isDeposit ? '+' : isTransfer ? '↔' : '-'}
                          ${transaction.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => openEditModal(transaction)}
                          className="text-primary-600 hover:text-primary-900"
                        >
                          <Edit className="h-5 w-5" />
                          <span className="sr-only">Edit</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Transaction Edit/Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">
                {isCreating ? 'Create Transaction' : 'Edit Transaction'}
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-500"
              >
                <span className="sr-only">Close</span>
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {isCreating && (
                <div>
                  <label htmlFor="account_id" className="form-label">
                    Account
                  </label>
                  <select
                    id="account_id"
                    name="account_id"
                    value={selectedAccountId || ''}
                    onChange={(e) => setSelectedAccountId(Number(e.target.value))}
                    className="form-input"
                    required
                  >
                    <option value="">Select an account</option>
                    {accounts.map((account) => {
                      const user = users.find((u) => u.id === account.user_id);
                      const userName = user ? `${user.first_name} ${user.last_name}` : 'Unknown User';
                      
                      return (
                        <option key={account.id} value={account.id}>
                          {account.account_type} ({account.account_number.slice(-4)}) - {userName}
                        </option>
                      );
                    })}
                  </select>
                </div>
              )}

              <div>
                <label htmlFor="transaction_type" className="form-label">
                  Transaction Type
                </label>
                <select
                  id="transaction_type"
                  name="transaction_type"
                  value={formData.transaction_type || 'deposit'}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                  disabled={!isCreating}
                >
                  <option value="deposit">Deposit</option>
                  <option value="withdrawal">Withdrawal</option>
                  <option value="transfer">Transfer</option>
                </select>
                {!isCreating && (
                  <p className="text-xs text-gray-500 mt-1">
                    Transaction type cannot be changed after creation to maintain balance integrity
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="amount" className="form-label">
                  Amount
                </label>
                <input
                  id="amount"
                  name="amount"
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={formData.amount !== undefined ? formData.amount : ''}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                  disabled={!isCreating}
                />
                {!isCreating && (
                  <p className="text-xs text-gray-500 mt-1">
                    Amount cannot be changed after creation to maintain balance integrity
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="created_at" className="form-label">
                  Transaction Date
                </label>
                <input
                  id="created_at"
                  name="created_at"
                  type="date"
                  value={formData.created_at ? new Date(formData.created_at).toISOString().split('T')[0] : ''}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                  disabled={!isCreating}
                />
                {!isCreating && (
                  <p className="text-xs text-gray-500 mt-1">
                    Transaction date cannot be changed after creation
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="description" className="form-label">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  value={formData.description || ''}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                />
              </div>

              {isCreating && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 mt-2">
                  <div className="flex">
                    <div>
                      <p className="text-sm text-yellow-700">
                        Creating a transaction will automatically update the account balance and notify the customer.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-between pt-4 border-t border-gray-200">
                {!isCreating && (
                  <button
                    type="button"
                    onClick={handleDelete}
                    className="btn bg-error-50 text-error-700 hover:bg-error-100 border border-error-200 flex items-center"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </button>
                )}
                <div className="flex space-x-3 ml-auto">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="btn btn-outline"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {isCreating ? 'Create Transaction' : 'Save Changes'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTransactions;