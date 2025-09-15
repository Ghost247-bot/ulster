import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { db } from '../lib/databaseService';
import { 
  useUserAccounts, 
  useUserTransactions, 
  usePaginatedTransactions,
  useTransactionStats,
  useRealtimeTransactions,
  useFormSubmission,
  useSearch
} from '../hooks/useDatabase';
import type { TransactionFilters } from '../lib/databaseService';

/**
 * Example 1: Basic Account Fetching
 */
export const BasicAccountFetching: React.FC = () => {
  const { user } = useAuthStore();
  const { data: accounts, loading, error, refetch } = useUserAccounts(user?.id);

  if (loading) return <div>Loading accounts...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h2>Your Accounts</h2>
      <button onClick={refetch}>Refresh</button>
      {accounts?.map(account => (
        <div key={account.id}>
          <h3>{account.account_type}</h3>
          <p>Balance: ${account.balance}</p>
          <p>Account #: {account.account_number}</p>
        </div>
      ))}
    </div>
  );
};

/**
 * Example 2: Transaction Fetching with Filters
 */
export const TransactionFetchingWithFilters: React.FC = () => {
  const { user } = useAuthStore();
  const [filters, setFilters] = useState<TransactionFilters>({
    startDate: '',
    endDate: '',
    transactionType: '',
    minAmount: undefined,
    maxAmount: undefined
  });

  const { data: transactions, loading, error } = useUserTransactions(
    user?.id,
    filters,
    { limit: 20, orderBy: 'created_at', ascending: false }
  );

  const handleFilterChange = (key: keyof TransactionFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  if (loading) return <div>Loading transactions...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h2>Transactions</h2>
      
      {/* Filter Controls */}
      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <input
          type="date"
          placeholder="Start Date"
          value={filters.startDate || ''}
          onChange={(e) => handleFilterChange('startDate', e.target.value)}
        />
        <input
          type="date"
          placeholder="End Date"
          value={filters.endDate || ''}
          onChange={(e) => handleFilterChange('endDate', e.target.value)}
        />
        <select
          value={filters.transactionType || ''}
          onChange={(e) => handleFilterChange('transactionType', e.target.value)}
        >
          <option value="">All Types</option>
          <option value="deposit">Deposits</option>
          <option value="withdrawal">Withdrawals</option>
          <option value="transfer">Transfers</option>
        </select>
        <input
          type="number"
          placeholder="Min Amount"
          value={filters.minAmount || ''}
          onChange={(e) => handleFilterChange('minAmount', e.target.value ? Number(e.target.value) : undefined)}
        />
        <input
          type="number"
          placeholder="Max Amount"
          value={filters.maxAmount || ''}
          onChange={(e) => handleFilterChange('maxAmount', e.target.value ? Number(e.target.value) : undefined)}
        />
      </div>

      {/* Transaction List */}
      {transactions?.map(transaction => (
        <div key={transaction.id} style={{ border: '1px solid #ccc', padding: '10px', margin: '5px 0' }}>
          <h4>{transaction.description}</h4>
          <p>Amount: ${transaction.amount}</p>
          <p>Type: {transaction.transaction_type}</p>
          <p>Date: {new Date(transaction.created_at).toLocaleDateString()}</p>
        </div>
      ))}
    </div>
  );
};

/**
 * Example 3: Paginated Transactions
 */
export const PaginatedTransactions: React.FC = () => {
  const { user } = useAuthStore();
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const { data, loading, error } = usePaginatedTransactions(
    user?.id,
    currentPage,
    pageSize
  );

  if (loading) return <div>Loading transactions...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h2>Paginated Transactions</h2>
      <p>Page {currentPage} of {data?.totalPages || 0}</p>
      <p>Total: {data?.totalCount || 0} transactions</p>

      {data?.data.map(transaction => (
        <div key={transaction.id} style={{ border: '1px solid #ccc', padding: '10px', margin: '5px 0' }}>
          <h4>{transaction.description}</h4>
          <p>Amount: ${transaction.amount}</p>
          <p>Date: {new Date(transaction.created_at).toLocaleDateString()}</p>
        </div>
      ))}

      {/* Pagination Controls */}
      <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
        <button 
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>Page {currentPage}</span>
        <button 
          onClick={() => setCurrentPage(prev => prev + 1)}
          disabled={currentPage >= (data?.totalPages || 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

/**
 * Example 4: Transaction Statistics
 */
export const TransactionStatistics: React.FC = () => {
  const { user } = useAuthStore();
  const [dateRange, setDateRange] = useState<{start: string, end: string}>({
    start: '',
    end: ''
  });

  const filters: TransactionFilters = {
    startDate: dateRange.start || undefined,
    endDate: dateRange.end || undefined
  };

  const { data: stats, loading, error } = useTransactionStats(user?.id, filters);

  if (loading) return <div>Loading statistics...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h2>Transaction Statistics</h2>
      
      {/* Date Range Selector */}
      <div style={{ marginBottom: '20px' }}>
        <input
          type="date"
          value={dateRange.start}
          onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
        />
        <input
          type="date"
          value={dateRange.end}
          onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
        />
      </div>

      {/* Statistics Display */}
      {stats && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
          <div style={{ border: '1px solid #ccc', padding: '20px', textAlign: 'center' }}>
            <h3>Total Deposits</h3>
            <p style={{ fontSize: '24px', color: 'green' }}>${stats.totalDeposits.toFixed(2)}</p>
          </div>
          <div style={{ border: '1px solid #ccc', padding: '20px', textAlign: 'center' }}>
            <h3>Total Withdrawals</h3>
            <p style={{ fontSize: '24px', color: 'red' }}>${stats.totalWithdrawals.toFixed(2)}</p>
          </div>
          <div style={{ border: '1px solid #ccc', padding: '20px', textAlign: 'center' }}>
            <h3>Net Amount</h3>
            <p style={{ fontSize: '24px', color: stats.netAmount >= 0 ? 'green' : 'red' }}>
              ${stats.netAmount.toFixed(2)}
            </p>
          </div>
          <div style={{ border: '1px solid #ccc', padding: '20px', textAlign: 'center' }}>
            <h3>Transaction Count</h3>
            <p style={{ fontSize: '24px' }}>{stats.transactionCount}</p>
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * Example 5: Real-time Transactions
 */
export const RealtimeTransactions: React.FC = () => {
  const { user } = useAuthStore();
  const { data: transactions, loading, error } = useUserTransactions(user?.id, {}, { limit: 10 });
  const { connected } = useRealtimeTransactions(user?.id);

  return (
    <div>
      <h2>Real-time Transactions</h2>
      <p>Connection Status: {connected ? '🟢 Connected' : '🔴 Disconnected'}</p>
      
      {loading && <div>Loading transactions...</div>}
      {error && <div>Error: {error.message}</div>}
      
      {transactions?.map(transaction => (
        <div key={transaction.id} style={{ border: '1px solid #ccc', padding: '10px', margin: '5px 0' }}>
          <h4>{transaction.description}</h4>
          <p>Amount: ${transaction.amount}</p>
          <p>Date: {new Date(transaction.created_at).toLocaleDateString()}</p>
        </div>
      ))}
    </div>
  );
};

/**
 * Example 6: Form Submission with Loading States
 */
export const TransactionForm: React.FC = () => {
  const { user } = useAuthStore();
  const [formData, setFormData] = useState({
    account_id: '',
    amount: '',
    description: '',
    transaction_type: 'deposit'
  });

  const { submit, loading, error, reset } = useFormSubmission(
    async (data) => {
      if (!user) throw new Error('User not authenticated');
      
      return await db.transactions.createTransaction({
        account_id: Number(data.account_id),
        amount: Number(data.amount),
        description: data.description,
        transaction_type: data.transaction_type
      });
    }
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await submit(formData);
      setFormData({ account_id: '', amount: '', description: '', transaction_type: 'deposit' });
      alert('Transaction created successfully!');
    } catch (err) {
      // Error is already handled by the hook
    }
  };

  return (
    <div>
      <h2>Create Transaction</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '10px' }}>
          <label>Account ID:</label>
          <input
            type="number"
            value={formData.account_id}
            onChange={(e) => setFormData(prev => ({ ...prev, account_id: e.target.value }))}
            required
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>Amount:</label>
          <input
            type="number"
            step="0.01"
            value={formData.amount}
            onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
            required
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>Description:</label>
          <input
            type="text"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            required
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>Type:</label>
          <select
            value={formData.transaction_type}
            onChange={(e) => setFormData(prev => ({ ...prev, transaction_type: e.target.value }))}
          >
            <option value="deposit">Deposit</option>
            <option value="withdrawal">Withdrawal</option>
            <option value="transfer">Transfer</option>
          </select>
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Create Transaction'}
        </button>
        {error && <div style={{ color: 'red' }}>Error: {error.message}</div>}
      </form>
    </div>
  );
};

/**
 * Example 7: Search Functionality
 */
export const TransactionSearch: React.FC = () => {
  const { user } = useAuthStore();
  
  const { query, setQuery, results, loading, error } = useSearch(
    async (searchQuery: string) => {
      if (!user) return [];
      return await db.transactions.getUserTransactions(user.id, {
        description: searchQuery
      });
    }
  );

  return (
    <div>
      <h2>Search Transactions</h2>
      <input
        type="text"
        placeholder="Search transactions..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{ width: '100%', padding: '10px', marginBottom: '20px' }}
      />
      
      {loading && <div>Searching...</div>}
      {error && <div>Error: {error.message}</div>}
      
      {results.map(transaction => (
        <div key={transaction.id} style={{ border: '1px solid #ccc', padding: '10px', margin: '5px 0' }}>
          <h4>{transaction.description}</h4>
          <p>Amount: ${transaction.amount}</p>
          <p>Date: {new Date(transaction.created_at).toLocaleDateString()}</p>
        </div>
      ))}
    </div>
  );
};

/**
 * Example 8: Complex Data Operations
 */
export const ComplexDataOperations: React.FC = () => {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleComplexOperation = async () => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Example: Transfer money between accounts
      const accounts = await db.accounts.getUserAccounts(user.id);
      if (accounts.length < 2) {
        throw new Error('You need at least 2 accounts to transfer money');
      }

      const fromAccount = accounts[0];
      const toAccount = accounts[1];
      const amount = 100;

      // Use the utility function to execute multiple operations
      await db.utils.executeTransaction([
        // Create withdrawal transaction
        () => db.transactions.createTransaction({
          account_id: fromAccount.id,
          amount: -amount,
          description: `Transfer to ${toAccount.account_type}`,
          transaction_type: 'transfer'
        }),
        // Create deposit transaction
        () => db.transactions.createTransaction({
          account_id: toAccount.id,
          amount: amount,
          description: `Transfer from ${fromAccount.account_type}`,
          transaction_type: 'transfer'
        }),
        // Update from account balance
        () => db.accounts.updateBalance(fromAccount.id, fromAccount.balance - amount),
        // Update to account balance
        () => db.accounts.updateBalance(toAccount.id, toAccount.balance + amount)
      ]);

      alert('Transfer completed successfully!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Complex Data Operations</h2>
      <button onClick={handleComplexOperation} disabled={loading}>
        {loading ? 'Processing...' : 'Execute Transfer (Demo)'}
      </button>
      {error && <div style={{ color: 'red' }}>Error: {error}</div>}
    </div>
  );
};

// Main component that demonstrates all examples
export const DatabaseFetchingExamples: React.FC = () => {
  const [activeExample, setActiveExample] = useState<string>('accounts');

  const examples = {
    accounts: BasicAccountFetching,
    transactions: TransactionFetchingWithFilters,
    paginated: PaginatedTransactions,
    stats: TransactionStatistics,
    realtime: RealtimeTransactions,
    form: TransactionForm,
    search: TransactionSearch,
    complex: ComplexDataOperations
  };

  const ActiveComponent = examples[activeExample as keyof typeof examples];

  return (
    <div style={{ padding: '20px' }}>
      <h1>Database Fetching Examples</h1>
      
      {/* Navigation */}
      <div style={{ marginBottom: '20px' }}>
        {Object.keys(examples).map(key => (
          <button
            key={key}
            onClick={() => setActiveExample(key)}
            style={{
              margin: '5px',
              padding: '10px',
              backgroundColor: activeExample === key ? '#007bff' : '#f8f9fa',
              color: activeExample === key ? 'white' : 'black',
              border: '1px solid #ccc',
              cursor: 'pointer'
            }}
          >
            {key.charAt(0).toUpperCase() + key.slice(1)}
          </button>
        ))}
      </div>

      {/* Active Example */}
      <div style={{ border: '1px solid #ccc', padding: '20px' }}>
        <ActiveComponent />
      </div>
    </div>
  );
};

export default DatabaseFetchingExamples;
