import { useState, useEffect, useCallback } from 'react';
import { db, type TransactionFilters, type FetchOptions, type PaginatedResult } from '../lib/databaseService';
import type { Account, Transaction, Card, Profile, Notification } from '../types/supabase';

// Generic hook for data fetching with loading and error states
export function useAsyncData<T>(
  fetchFunction: () => Promise<T>,
  dependencies: any[] = []
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await fetchFunction();
      setData(result);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, dependencies);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch };
}

// Hook for fetching user accounts
export function useUserAccounts(userId: string | undefined) {
  return useAsyncData(
    () => {
      if (!userId) throw new Error('User ID is required');
      return db.accounts.getUserAccounts(userId);
    },
    [userId]
  );
}

// Hook for fetching user transactions with filters
export function useUserTransactions(
  userId: string | undefined,
  filters: TransactionFilters = {},
  options: FetchOptions = {}
) {
  return useAsyncData(
    () => {
      if (!userId) throw new Error('User ID is required');
      return db.transactions.getUserTransactions(userId, filters, options);
    },
    [userId, JSON.stringify(filters), JSON.stringify(options)]
  );
}

// Hook for paginated transactions
export function usePaginatedTransactions(
  userId: string | undefined,
  page: number = 1,
  pageSize: number = 10,
  filters: TransactionFilters = {}
) {
  const [data, setData] = useState<PaginatedResult<Transaction> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    if (!userId) {
      setData(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const result = await db.transactions.getUserTransactionsPaginated(
        userId,
        page,
        pageSize,
        filters
      );
      setData(result);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [userId, page, pageSize, JSON.stringify(filters)]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch };
}

// Hook for transaction statistics
export function useTransactionStats(
  userId: string | undefined,
  filters: TransactionFilters = {}
) {
  return useAsyncData(
    () => {
      if (!userId) throw new Error('User ID is required');
      return db.transactions.getTransactionStats(userId, filters);
    },
    [userId, JSON.stringify(filters)]
  );
}

// Hook for user cards
export function useUserCards(userId: string | undefined) {
  return useAsyncData(
    () => {
      if (!userId) throw new Error('User ID is required');
      return db.cards.getUserCards(userId);
    },
    [userId]
  );
}

// Hook for user profile
export function useUserProfile(userId: string | undefined) {
  return useAsyncData(
    () => {
      if (!userId) throw new Error('User ID is required');
      return db.profiles.getUserProfile(userId);
    },
    [userId]
  );
}

// Hook for user notifications
export function useUserNotifications(
  userId: string | undefined,
  unreadOnly: boolean = false
) {
  return useAsyncData(
    () => {
      if (!userId) throw new Error('User ID is required');
      return db.notifications.getUserNotifications(userId, unreadOnly);
    },
    [userId, unreadOnly]
  );
}

// Hook for real-time data with subscriptions
export function useRealtimeData<T>(
  subscriptionFunction: (callback: (payload: any) => void) => any,
  initialData: T | null = null
) {
  const [data, setData] = useState<T | null>(initialData);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const subscription = subscriptionFunction((payload) => {
      console.log('Real-time update received:', payload);
      // You can customize this based on your needs
      setData(prevData => {
        // Example: add new data to existing array
        if (Array.isArray(prevData)) {
          return [payload.new, ...prevData] as T;
        }
        return payload.new as T;
      });
    });

    setConnected(true);

    return () => {
      subscription.unsubscribe();
      setConnected(false);
    };
  }, [subscriptionFunction]);

  return { data, connected };
}

// Hook for real-time transactions
export function useRealtimeTransactions(userId: string | undefined) {
  return useRealtimeData(
    useCallback(
      (callback) => {
        if (!userId) return { unsubscribe: () => {} };
        return db.realtime.subscribeToUserTransactions(userId, callback);
      },
      [userId]
    )
  );
}

// Hook for real-time accounts
export function useRealtimeAccounts(userId: string | undefined) {
  return useRealtimeData(
    useCallback(
      (callback) => {
        if (!userId) return { unsubscribe: () => {} };
        return db.realtime.subscribeToUserAccounts(userId, callback);
      },
      [userId]
    )
  );
}

// Hook for real-time notifications
export function useRealtimeNotifications(userId: string | undefined) {
  return useRealtimeData(
    useCallback(
      (callback) => {
        if (!userId) return { unsubscribe: () => {} };
        return db.realtime.subscribeToUserNotifications(userId, callback);
      },
      [userId]
    )
  );
}

// Hook for optimistic updates
export function useOptimisticUpdate<T>(
  currentData: T | null,
  updateFunction: (data: T) => Promise<T>,
  onSuccess?: (data: T) => void,
  onError?: (error: Error) => void
) {
  const [optimisticData, setOptimisticData] = useState<T | null>(currentData);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    setOptimisticData(currentData);
  }, [currentData]);

  const update = useCallback(async (newData: T) => {
    // Optimistically update the UI
    setOptimisticData(newData);
    setIsUpdating(true);

    try {
      const result = await updateFunction(newData);
      setOptimisticData(result);
      onSuccess?.(result);
    } catch (error) {
      // Revert optimistic update on error
      setOptimisticData(currentData);
      onError?.(error as Error);
    } finally {
      setIsUpdating(false);
    }
  }, [currentData, updateFunction, onSuccess, onError]);

  return { data: optimisticData, isUpdating, update };
}

// Hook for form submission with loading states
export function useFormSubmission<T, R>(
  submitFunction: (data: T) => Promise<R>
) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<R | null>(null);

  const submit = useCallback(async (formData: T) => {
    try {
      setLoading(true);
      setError(null);
      const result = await submitFunction(formData);
      setData(result);
      return result;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [submitFunction]);

  const reset = useCallback(() => {
    setError(null);
    setData(null);
  }, []);

  return { submit, loading, error, data, reset };
}

// Hook for infinite scrolling
export function useInfiniteScroll<T>(
  fetchFunction: (page: number, pageSize: number) => Promise<PaginatedResult<T>>,
  pageSize: number = 10
) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;

    try {
      setLoading(true);
      setError(null);
      
      const result = await fetchFunction(currentPage, pageSize);
      
      if (currentPage === 1) {
        setData(result.data);
      } else {
        setData(prev => [...prev, ...result.data]);
      }
      
      setHasMore(result.currentPage < result.totalPages);
      setCurrentPage(prev => prev + 1);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [fetchFunction, currentPage, pageSize, loading, hasMore]);

  const reset = useCallback(() => {
    setData([]);
    setCurrentPage(1);
    setHasMore(true);
    setError(null);
  }, []);

  useEffect(() => {
    loadMore();
  }, []);

  return { data, loading, error, hasMore, loadMore, reset };
}

// Hook for search with debouncing
export function useSearch<T>(
  searchFunction: (query: string) => Promise<T[]>,
  delay: number = 300
) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timeoutId = setTimeout(async () => {
      try {
        setLoading(true);
        setError(null);
        const searchResults = await searchFunction(query);
        setResults(searchResults);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    }, delay);

    return () => clearTimeout(timeoutId);
  }, [query, searchFunction, delay]);

  return { query, setQuery, results, loading, error };
}

// Export all hooks
export const databaseHooks = {
  useAsyncData,
  useUserAccounts,
  useUserTransactions,
  usePaginatedTransactions,
  useTransactionStats,
  useUserCards,
  useUserProfile,
  useUserNotifications,
  useRealtimeData,
  useRealtimeTransactions,
  useRealtimeAccounts,
  useRealtimeNotifications,
  useOptimisticUpdate,
  useFormSubmission,
  useInfiniteScroll,
  useSearch
};
