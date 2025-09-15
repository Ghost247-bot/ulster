import { supabase } from './supabase';
import type { Database } from '../types/supabase';

// Type definitions for better type safety
type Account = Database['public']['Tables']['accounts']['Row'];
type Transaction = Database['public']['Tables']['transactions']['Row'];
type Card = Database['public']['Tables']['cards']['Row'];
type Profile = Database['public']['Tables']['profiles']['Row'];
type Notification = Database['public']['Tables']['notifications']['Row'];

export interface FetchOptions {
  limit?: number;
  offset?: number;
  orderBy?: string;
  ascending?: boolean;
}

export interface TransactionFilters {
  startDate?: string;
  endDate?: string;
  accountId?: number;
  transactionType?: string;
  minAmount?: number;
  maxAmount?: number;
  description?: string;
}

export interface PaginatedResult<T> {
  data: T[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
}

/**
 * Account-related database operations
 */
export const accountService = {
  /**
   * Fetch all accounts for a user
   */
  async getUserAccounts(userId: string): Promise<Account[]> {
    const { data, error } = await supabase
      .from('accounts')
      .select('*')
      .eq('user_id', userId)
      .order('account_type', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  /**
   * Fetch a single account by ID
   */
  async getAccount(accountId: number): Promise<Account | null> {
    const { data, error } = await supabase
      .from('accounts')
      .select('*')
      .eq('id', accountId)
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Update account balance
   */
  async updateBalance(accountId: number, newBalance: number): Promise<void> {
    const { error } = await supabase
      .from('accounts')
      .update({ balance: newBalance })
      .eq('id', accountId);

    if (error) throw error;
  },

  /**
   * Freeze/unfreeze an account
   */
  async toggleFreeze(accountId: number, isFrozen: boolean): Promise<void> {
    const { error } = await supabase
      .from('accounts')
      .update({ is_frozen: isFrozen })
      .eq('id', accountId);

    if (error) throw error;
  },

  /**
   * Freeze an account by admin (sets frozen_by_admin flag)
   */
  async freezeByAdmin(accountId: number): Promise<void> {
    const { error } = await supabase
      .from('accounts')
      .update({ 
        is_frozen: true
      })
      .eq('id', accountId);

    if (error) throw error;
  },

  /**
   * Unfreeze an account by admin (clears frozen_by_admin flag)
   */
  async unfreezeByAdmin(accountId: number): Promise<void> {
    const { error } = await supabase
      .from('accounts')
      .update({ 
        is_frozen: false
      })
      .eq('id', accountId);

    if (error) throw error;
  },

  /**
   * Freeze an account by user (only if not already frozen by admin)
   */
  async freezeByUser(accountId: number): Promise<void> {
    // First check if account is already frozen by admin
    const { data: account, error: fetchError } = await supabase
      .from('accounts')
      .select('frozen_by_admin')
      .eq('id', accountId)
      .single();

    if (fetchError) throw fetchError;

    if (account.frozen_by_admin) {
      throw new Error('Cannot freeze account that is already frozen by admin');
    }

    const { error } = await supabase
      .from('accounts')
      .update({ 
        is_frozen: true,
        frozen_by_admin: false 
      })
      .eq('id', accountId);

    if (error) throw error;
  },

  /**
   * Unfreeze an account by user (only if not frozen by admin)
   */
  async unfreezeByUser(accountId: number): Promise<void> {
    const { error } = await supabase
      .from('accounts')
      .update({ 
        is_frozen: false
      })
      .eq('id', accountId);

    if (error) throw error;
  }
};

/**
 * Transaction-related database operations
 */
export const transactionService = {
  /**
   * Fetch transactions for a user with optional filters
   */
  async getUserTransactions(
    userId: string, 
    filters: TransactionFilters = {},
    options: FetchOptions = {}
  ): Promise<Transaction[]> {
    // First get user's account IDs
    const { data: accounts } = await supabase
      .from('accounts')
      .select('id')
      .eq('user_id', userId);

    if (!accounts || accounts.length === 0) return [];

    const accountIds = accounts.map(account => account.id);
    
    let query = supabase
      .from('transactions')
      .select('*')
      .in('account_id', accountIds);

    // Apply filters
    if (filters.startDate) {
      query = query.gte('created_at', filters.startDate);
    }
    
    if (filters.endDate) {
      query = query.lte('created_at', filters.endDate);
    }
    
    if (filters.accountId) {
      query = query.eq('account_id', filters.accountId);
    }
    
    if (filters.transactionType) {
      query = query.eq('transaction_type', filters.transactionType);
    }
    
    if (filters.minAmount) {
      query = query.gte('amount', filters.minAmount);
    }
    
    if (filters.maxAmount) {
      query = query.lte('amount', filters.maxAmount);
    }
    
    if (filters.description) {
      query = query.ilike('description', `%${filters.description}%`);
    }

    // Apply ordering and pagination
    const orderBy = options.orderBy || 'created_at';
    const ascending = options.ascending ?? false;
    query = query.order(orderBy, { ascending });

    if (options.limit) {
      const offset = options.offset || 0;
      query = query.range(offset, offset + options.limit - 1);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  },

  /**
   * Fetch transactions with pagination
   */
  async getUserTransactionsPaginated(
    userId: string,
    page: number = 1,
    pageSize: number = 10,
    filters: TransactionFilters = {}
  ): Promise<PaginatedResult<Transaction>> {
    const offset = (page - 1) * pageSize;
    
    // Get total count
    const { data: accounts } = await supabase
      .from('accounts')
      .select('id')
      .eq('user_id', userId);

    if (!accounts || accounts.length === 0) {
      return { data: [], totalCount: 0, totalPages: 0, currentPage: page };
    }

    const accountIds = accounts.map(account => account.id);
    
    let countQuery = supabase
      .from('transactions')
      .select('*', { count: 'exact', head: true })
      .in('account_id', accountIds);

    // Apply same filters to count query
    if (filters.startDate) countQuery = countQuery.gte('created_at', filters.startDate);
    if (filters.endDate) countQuery = countQuery.lte('created_at', filters.endDate);
    if (filters.accountId) countQuery = countQuery.eq('account_id', filters.accountId);
    if (filters.transactionType) countQuery = countQuery.eq('transaction_type', filters.transactionType);
    if (filters.minAmount) countQuery = countQuery.gte('amount', filters.minAmount);
    if (filters.maxAmount) countQuery = countQuery.lte('amount', filters.maxAmount);
    if (filters.description) countQuery = countQuery.ilike('description', `%${filters.description}%`);

    const { count, error: countError } = await countQuery;

    if (countError) throw countError;

    // Get paginated data
    const data = await this.getUserTransactions(userId, filters, {
      limit: pageSize,
      offset,
      orderBy: 'created_at',
      ascending: false
    });

    const totalCount = count || 0;
    const totalPages = Math.ceil(totalCount / pageSize);

    return {
      data,
      totalCount,
      totalPages,
      currentPage: page
    };
  },

  /**
   * Create a new transaction
   */
  async createTransaction(transaction: {
    account_id: number;
    amount: number;
    description: string;
    transaction_type: string;
    note?: string;
    category?: string;
  }): Promise<Transaction> {
    const { data, error } = await supabase
      .from('transactions')
      .insert(transaction)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Get transaction statistics for a user
   */
  async getTransactionStats(userId: string, filters: TransactionFilters = {}): Promise<{
    totalDeposits: number;
    totalWithdrawals: number;
    netAmount: number;
    transactionCount: number;
  }> {
    const transactions = await this.getUserTransactions(userId, filters);
    
    const stats = transactions.reduce((acc, transaction) => {
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
    return stats;
  }
};

/**
 * Card-related database operations
 */
export const cardService = {
  /**
   * Fetch all cards for a user
   */
  async getUserCards(userId: string): Promise<Card[]> {
    const { data, error } = await supabase
      .from('cards')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  /**
   * Fetch card transactions
   */
  async getCardTransactions(cardIds: number[], limit: number = 10): Promise<any[]> {
    const { data, error } = await supabase
      .from('card_transactions')
      .select('*')
      .in('card_id', cardIds)
      .order('date', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  }
};

/**
 * Profile-related database operations
 */
export const profileService = {
  /**
   * Fetch user profile
   */
  async getUserProfile(userId: string): Promise<Profile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Update user profile
   */
  async updateProfile(userId: string, updates: Partial<Profile>): Promise<Profile> {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};

/**
 * Notification-related database operations
 */
export const notificationService = {
  /**
   * Fetch user notifications
   */
  async getUserNotifications(userId: string, unreadOnly: boolean = false): Promise<Notification[]> {
    let query = supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (unreadOnly) {
      query = query.eq('is_read', false);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  },

  /**
   * Mark notification as read
   */
  async markAsRead(notificationId: number): Promise<void> {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', notificationId);

    if (error) throw error;
  },

  /**
   * Create a new notification
   */
  async createNotification(notification: {
    user_id: string;
    title: string;
    message: string;
  }): Promise<Notification> {
    const { data, error } = await supabase
      .from('notifications')
      .insert(notification)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};

/**
 * Real-time subscription helpers
 */
export const realtimeService = {
  /**
   * Subscribe to transaction changes for a user
   */
  subscribeToUserTransactions(userId: string, callback: (payload: any) => void) {
    return supabase
      .channel('user-transactions')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'transactions'
        }, 
        async (payload) => {
          // Verify the transaction belongs to the user
          const { data: account } = await supabase
            .from('accounts')
            .select('user_id')
            .eq('id', payload.new?.account_id || payload.old?.account_id)
            .single();

          if (account?.user_id === userId) {
            callback(payload);
          }
        }
      )
      .subscribe();
  },

  /**
   * Subscribe to account changes for a user
   */
  subscribeToUserAccounts(userId: string, callback: (payload: any) => void) {
    return supabase
      .channel('user-accounts')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'accounts',
          filter: `user_id=eq.${userId}`
        }, 
        callback
      )
      .subscribe();
  },

  /**
   * Subscribe to notification changes for a user
   */
  subscribeToUserNotifications(userId: string, callback: (payload: any) => void) {
    return supabase
      .channel('user-notifications')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'notifications',
          filter: `user_id=eq.${userId}`
        }, 
        callback
      )
      .subscribe();
  }
};

/**
 * Utility functions
 */
export const databaseUtils = {
  /**
   * Execute multiple operations in a transaction-like manner
   */
  async executeTransaction(operations: (() => Promise<any>)[]): Promise<any[]> {
    const results = [];
    for (const operation of operations) {
      try {
        const result = await operation();
        results.push(result);
      } catch (error) {
        // If any operation fails, you might want to rollback previous operations
        throw error;
      }
    }
    return results;
  },

  /**
   * Retry a database operation with exponential backoff
   */
  async retryOperation<T>(
    operation: () => Promise<T>,
    maxRetries: number = 3,
    baseDelay: number = 1000
  ): Promise<T> {
    let lastError: Error;
    
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error as Error;
        
        if (attempt === maxRetries - 1) {
          throw lastError;
        }
        
        const delay = baseDelay * Math.pow(2, attempt);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    
    throw lastError!;
  },

  /**
   * Batch insert with chunking for large datasets
   */
  async batchInsert<T>(
    table: string,
    data: T[],
    chunkSize: number = 1000
  ): Promise<void> {
    for (let i = 0; i < data.length; i += chunkSize) {
      const chunk = data.slice(i, i + chunkSize);
      const { error } = await supabase
        .from(table)
        .insert(chunk);
      
      if (error) throw error;
    }
  }
};

// Export all services as a single object for convenience
export const db = {
  accounts: accountService,
  transactions: transactionService,
  cards: cardService,
  profiles: profileService,
  notifications: notificationService,
  realtime: realtimeService,
  utils: databaseUtils
};
