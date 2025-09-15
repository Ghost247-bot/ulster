# Database Fetching Guide

This guide provides comprehensive examples and patterns for fetching data from your Supabase database in the banking application.

## Table of Contents

1. [Quick Start](#quick-start)
2. [Database Service Layer](#database-service-layer)
3. [React Hooks](#react-hooks)
4. [Common Patterns](#common-patterns)
5. [Real-time Data](#real-time-data)
6. [Error Handling](#error-handling)
7. [Performance Tips](#performance-tips)
8. [Examples](#examples)

## Quick Start

### Basic Data Fetching

```typescript
import { supabase } from '../lib/supabase';

// Fetch user accounts
const fetchAccounts = async (userId: string) => {
  const { data, error } = await supabase
    .from('accounts')
    .select('*')
    .eq('user_id', userId);
    
  if (error) throw error;
  return data;
};
```

### Using the Database Service

```typescript
import { db } from '../lib/databaseService';

// Fetch user accounts with built-in error handling
const accounts = await db.accounts.getUserAccounts(userId);

// Fetch transactions with filters
const transactions = await db.transactions.getUserTransactions(userId, {
  startDate: '2024-01-01',
  endDate: '2024-01-31',
  transactionType: 'deposit'
});
```

### Using React Hooks

```typescript
import { useUserAccounts, useUserTransactions } from '../hooks/useDatabase';

const MyComponent = () => {
  const { data: accounts, loading, error } = useUserAccounts(userId);
  const { data: transactions } = useUserTransactions(userId, {
    transactionType: 'deposit'
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {accounts?.map(account => (
        <div key={account.id}>{account.account_type}</div>
      ))}
    </div>
  );
};
```

## Database Service Layer

The `databaseService.ts` file provides a comprehensive set of functions for all database operations:

### Available Services

- **`db.accounts`** - Account management
- **`db.transactions`** - Transaction operations
- **`db.cards`** - Card management
- **`db.profiles`** - User profiles
- **`db.notifications`** - Notifications
- **`db.realtime`** - Real-time subscriptions
- **`db.utils`** - Utility functions

### Account Operations

```typescript
// Get all user accounts
const accounts = await db.accounts.getUserAccounts(userId);

// Get single account
const account = await db.accounts.getAccount(accountId);

// Update account balance
await db.accounts.updateBalance(accountId, newBalance);

// Freeze/unfreeze account
await db.accounts.toggleFreeze(accountId, true);
```

### Transaction Operations

```typescript
// Get transactions with filters
const transactions = await db.transactions.getUserTransactions(userId, {
  startDate: '2024-01-01',
  endDate: '2024-01-31',
  transactionType: 'deposit',
  minAmount: 100
});

// Get paginated transactions
const paginated = await db.transactions.getUserTransactionsPaginated(
  userId, 
  1, // page
  10, // page size
  { transactionType: 'withdrawal' }
);

// Get transaction statistics
const stats = await db.transactions.getTransactionStats(userId, {
  startDate: '2024-01-01'
});

// Create new transaction
const newTransaction = await db.transactions.createTransaction({
  account_id: 1,
  amount: 100,
  description: 'Deposit',
  transaction_type: 'deposit'
});
```

## React Hooks

The `useDatabase.ts` file provides custom hooks for common database operations:

### Basic Hooks

```typescript
// Fetch user accounts
const { data: accounts, loading, error, refetch } = useUserAccounts(userId);

// Fetch transactions with filters
const { data: transactions } = useUserTransactions(userId, {
  transactionType: 'deposit'
});

// Fetch paginated transactions
const { data, loading, error } = usePaginatedTransactions(
  userId, 
  1, // page
  10, // page size
  { startDate: '2024-01-01' }
);

// Fetch transaction statistics
const { data: stats } = useTransactionStats(userId, {
  startDate: '2024-01-01'
});
```

### Advanced Hooks

```typescript
// Real-time data
const { data, connected } = useRealtimeTransactions(userId);

// Form submission with loading states
const { submit, loading, error } = useFormSubmission(async (data) => {
  return await db.transactions.createTransaction(data);
});

// Search with debouncing
const { query, setQuery, results, loading } = useSearch(
  async (searchQuery) => {
    return await db.transactions.getUserTransactions(userId, {
      description: searchQuery
    });
  }
);

// Infinite scrolling
const { data, loadMore, hasMore } = useInfiniteScroll(
  (page, pageSize) => db.transactions.getUserTransactionsPaginated(
    userId, page, pageSize
  )
);
```

## Common Patterns

### 1. Loading States

```typescript
const MyComponent = () => {
  const { data, loading, error } = useUserAccounts(userId);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;
  if (!data) return <EmptyState />;

  return <DataDisplay data={data} />;
};
```

### 2. Error Handling

```typescript
const handleDataFetch = async () => {
  try {
    const data = await db.accounts.getUserAccounts(userId);
    setAccounts(data);
  } catch (error) {
    console.error('Failed to fetch accounts:', error);
    toast.error('Failed to load accounts');
  }
};
```

### 3. Optimistic Updates

```typescript
const { data, isUpdating, update } = useOptimisticUpdate(
  currentData,
  async (newData) => {
    return await db.accounts.updateBalance(accountId, newData.balance);
  },
  (result) => toast.success('Balance updated!'),
  (error) => toast.error('Update failed!')
);
```

### 4. Conditional Fetching

```typescript
const { data: transactions } = useUserTransactions(
  user?.id, // Only fetch if user exists
  { transactionType: 'deposit' },
  { limit: 10 }
);
```

## Real-time Data

### Basic Real-time Subscription

```typescript
useEffect(() => {
  const subscription = supabase
    .channel('transactions')
    .on('postgres_changes', 
      { 
        event: '*', 
        schema: 'public', 
        table: 'transactions',
        filter: `user_id=eq.${userId}`
      }, 
      (payload) => {
        console.log('Change received!', payload);
        // Update your state
      }
    )
    .subscribe();

  return () => subscription.unsubscribe();
}, [userId]);
```

### Using Real-time Hooks

```typescript
// Real-time transactions
const { data, connected } = useRealtimeTransactions(userId);

// Real-time accounts
const { data, connected } = useRealtimeAccounts(userId);

// Real-time notifications
const { data, connected } = useRealtimeNotifications(userId);
```

## Error Handling

### Service Level Error Handling

```typescript
// The database service automatically throws errors
try {
  const accounts = await db.accounts.getUserAccounts(userId);
} catch (error) {
  // Handle error
  console.error('Database error:', error);
}
```

### Hook Level Error Handling

```typescript
const { data, loading, error } = useUserAccounts(userId);

useEffect(() => {
  if (error) {
    toast.error(`Failed to load accounts: ${error.message}`);
  }
}, [error]);
```

### Retry Logic

```typescript
// Automatic retry with exponential backoff
const data = await db.utils.retryOperation(
  () => db.accounts.getUserAccounts(userId),
  3, // max retries
  1000 // base delay in ms
);
```

## Performance Tips

### 1. Use Specific Selects

```typescript
// Good: Only fetch needed fields
const { data } = await supabase
  .from('transactions')
  .select('id, amount, description, created_at')
  .eq('user_id', userId);

// Avoid: Fetching all fields
const { data } = await supabase
  .from('transactions')
  .select('*')
  .eq('user_id', userId);
```

### 2. Implement Pagination

```typescript
// Use pagination for large datasets
const { data } = usePaginatedTransactions(userId, 1, 10);
```

### 3. Use Filters

```typescript
// Filter data at the database level
const transactions = await db.transactions.getUserTransactions(userId, {
  startDate: '2024-01-01',
  endDate: '2024-01-31'
});
```

### 4. Cache Results

```typescript
// The hooks automatically handle caching
const { data } = useUserAccounts(userId); // Cached on subsequent calls
```

### 5. Batch Operations

```typescript
// Use batch operations for multiple inserts
await db.utils.batchInsert('transactions', transactionData, 1000);
```

## Examples

### Complete Transaction List Component

```typescript
import React, { useState } from 'react';
import { useUserTransactions, useTransactionStats } from '../hooks/useDatabase';

const TransactionList: React.FC = () => {
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    transactionType: ''
  });

  const { data: transactions, loading, error } = useUserTransactions(
    userId,
    filters,
    { limit: 50, orderBy: 'created_at', ascending: false }
  );

  const { data: stats } = useTransactionStats(userId, filters);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {/* Statistics */}
      {stats && (
        <div>
          <p>Total Deposits: ${stats.totalDeposits}</p>
          <p>Total Withdrawals: ${stats.totalWithdrawals}</p>
          <p>Net Amount: ${stats.netAmount}</p>
        </div>
      )}

      {/* Filters */}
      <div>
        <input
          type="date"
          value={filters.startDate}
          onChange={(e) => setFilters(prev => ({ ...prev, startDate: e.target.value }))}
        />
        <input
          type="date"
          value={filters.endDate}
          onChange={(e) => setFilters(prev => ({ ...prev, endDate: e.target.value }))}
        />
        <select
          value={filters.transactionType}
          onChange={(e) => setFilters(prev => ({ ...prev, transactionType: e.target.value }))}
        >
          <option value="">All Types</option>
          <option value="deposit">Deposits</option>
          <option value="withdrawal">Withdrawals</option>
        </select>
      </div>

      {/* Transaction List */}
      {transactions?.map(transaction => (
        <div key={transaction.id}>
          <h4>{transaction.description}</h4>
          <p>Amount: ${transaction.amount}</p>
          <p>Date: {new Date(transaction.created_at).toLocaleDateString()}</p>
        </div>
      ))}
    </div>
  );
};
```

### Real-time Dashboard

```typescript
import React from 'react';
import { 
  useUserAccounts, 
  useUserTransactions, 
  useRealtimeTransactions,
  useRealtimeAccounts 
} from '../hooks/useDatabase';

const Dashboard: React.FC = () => {
  const { data: accounts } = useUserAccounts(userId);
  const { data: recentTransactions } = useUserTransactions(
    userId, 
    {}, 
    { limit: 5 }
  );
  
  const { connected: transactionsConnected } = useRealtimeTransactions(userId);
  const { connected: accountsConnected } = useRealtimeAccounts(userId);

  return (
    <div>
      <h1>Dashboard</h1>
      
      {/* Connection Status */}
      <div>
        <p>Transactions: {transactionsConnected ? '🟢' : '🔴'}</p>
        <p>Accounts: {accountsConnected ? '🟢' : '🔴'}</p>
      </div>

      {/* Accounts Summary */}
      <div>
        <h2>Accounts</h2>
        {accounts?.map(account => (
          <div key={account.id}>
            <h3>{account.account_type}</h3>
            <p>Balance: ${account.balance}</p>
          </div>
        ))}
      </div>

      {/* Recent Transactions */}
      <div>
        <h2>Recent Transactions</h2>
        {recentTransactions?.map(transaction => (
          <div key={transaction.id}>
            <h4>{transaction.description}</h4>
            <p>Amount: ${transaction.amount}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
```

## Best Practices

1. **Always handle loading and error states**
2. **Use TypeScript for type safety**
3. **Implement proper error boundaries**
4. **Use pagination for large datasets**
5. **Filter data at the database level**
6. **Implement real-time updates where appropriate**
7. **Cache frequently accessed data**
8. **Use optimistic updates for better UX**
9. **Implement retry logic for network failures**
10. **Monitor and log database performance**

## Troubleshooting

### Common Issues

1. **"User not authenticated" errors**
   - Ensure user is logged in before making database calls
   - Check if `user?.id` exists before using it

2. **Real-time subscriptions not working**
   - Verify RLS policies allow the user to access the data
   - Check if the subscription is properly set up

3. **Performance issues**
   - Use specific field selects instead of `*`
   - Implement pagination for large datasets
   - Add proper database indexes

4. **Type errors**
   - Ensure your TypeScript types match your database schema
   - Update types when database schema changes

For more examples, see the `DatabaseFetchingExamples.tsx` file in the examples directory.
