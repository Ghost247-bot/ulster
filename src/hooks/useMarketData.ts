import { useState, useEffect, useCallback, useRef } from 'react';
import { 
  marketService, 
  type MarketData, 
  type MarketIndex, 
  type MarketOverview 
} from '../lib/marketService';

// Hook for fetching market data with auto-refresh
export function useMarketData(
  symbols: string[],
  refreshInterval: number = 60000, // 1 minute default
  autoRefresh: boolean = true
) {
  const [data, setData] = useState<MarketData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setError(null);
      const marketData = await marketService.fetchMarketData(symbols);
      setData(marketData);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err as Error);
      console.error('Error fetching market data:', err);
    } finally {
      setLoading(false);
    }
  }, [symbols]);

  const startAutoRefresh = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    if (autoRefresh && refreshInterval > 0) {
      intervalRef.current = setInterval(fetchData, refreshInterval);
    }
  }, [autoRefresh, refreshInterval, fetchData]);

  const stopAutoRefresh = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const refresh = useCallback(() => {
    setLoading(true);
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    fetchData();
    startAutoRefresh();

    return () => {
      stopAutoRefresh();
    };
  }, [fetchData, startAutoRefresh, stopAutoRefresh]);

  return {
    data,
    loading,
    error,
    lastUpdated,
    refresh,
    startAutoRefresh,
    stopAutoRefresh,
    isAutoRefreshing: intervalRef.current !== null
  };
}

// Hook for market indices
export function useMarketIndices(refreshInterval: number = 60000) {
  const [indices, setIndices] = useState<MarketIndex[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const fetchIndices = useCallback(async () => {
    try {
      setError(null);
      const data = await marketService.fetchMarketIndices();
      setIndices(data);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err as Error);
      console.error('Error fetching market indices:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const refresh = useCallback(() => {
    setLoading(true);
    fetchIndices();
  }, [fetchIndices]);

  useEffect(() => {
    fetchIndices();
    
    if (refreshInterval > 0) {
      intervalRef.current = setInterval(fetchIndices, refreshInterval);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [fetchIndices, refreshInterval]);

  return {
    indices,
    loading,
    error,
    lastUpdated,
    refresh
  };
}

// Hook for individual stocks
export function useStocks(refreshInterval: number = 60000) {
  const [stocks, setStocks] = useState<MarketData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const fetchStocks = useCallback(async () => {
    try {
      setError(null);
      const data = await marketService.fetchStocks();
      setStocks(data);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err as Error);
      console.error('Error fetching stocks:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const refresh = useCallback(() => {
    setLoading(true);
    fetchStocks();
  }, [fetchStocks]);

  useEffect(() => {
    fetchStocks();
    
    if (refreshInterval > 0) {
      intervalRef.current = setInterval(fetchStocks, refreshInterval);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [fetchStocks, refreshInterval]);

  return {
    stocks,
    loading,
    error,
    lastUpdated,
    refresh
  };
}

// Hook for complete market overview
export function useMarketOverview(refreshInterval: number = 60000) {
  const [overview, setOverview] = useState<MarketOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const fetchOverview = useCallback(async () => {
    try {
      setError(null);
      const data = await marketService.fetchMarketOverview();
      setOverview(data);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err as Error);
      console.error('Error fetching market overview:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const refresh = useCallback(() => {
    setLoading(true);
    fetchOverview();
  }, [fetchOverview]);

  useEffect(() => {
    fetchOverview();
    
    if (refreshInterval > 0) {
      intervalRef.current = setInterval(fetchOverview, refreshInterval);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [fetchOverview, refreshInterval]);

  return {
    overview,
    loading,
    error,
    lastUpdated,
    refresh
  };
}

// Hook for specific stock with real-time updates
export function useStock(symbol: string, refreshInterval: number = 30000) {
  const [stock, setStock] = useState<MarketData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const fetchStock = useCallback(async () => {
    try {
      setError(null);
      const data = await marketService.fetchMarketData([symbol]);
      setStock(data[0] || null);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err as Error);
      console.error(`Error fetching stock ${symbol}:`, err);
    } finally {
      setLoading(false);
    }
  }, [symbol]);

  const refresh = useCallback(() => {
    setLoading(true);
    fetchStock();
  }, [fetchStock]);

  useEffect(() => {
    if (!symbol) return;
    
    fetchStock();
    
    if (refreshInterval > 0) {
      intervalRef.current = setInterval(fetchStock, refreshInterval);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [symbol, fetchStock, refreshInterval]);

  return {
    stock,
    loading,
    error,
    lastUpdated,
    refresh
  };
}

// Hook for market data with manual refresh control
export function useMarketDataWithControls(
  symbols: string[],
  initialRefreshInterval: number = 60000
) {
  const [refreshInterval, setRefreshInterval] = useState(initialRefreshInterval);
  const [isAutoRefreshEnabled, setIsAutoRefreshEnabled] = useState(true);
  
  const marketData = useMarketData(symbols, refreshInterval, isAutoRefreshEnabled);

  const toggleAutoRefresh = useCallback(() => {
    setIsAutoRefreshEnabled(prev => !prev);
  }, []);

  const updateRefreshInterval = useCallback((newInterval: number) => {
    setRefreshInterval(newInterval);
  }, []);

  const clearCache = useCallback(() => {
    marketService.clearCache();
    marketData.refresh();
  }, [marketData]);

  return {
    ...marketData,
    refreshInterval,
    isAutoRefreshEnabled,
    toggleAutoRefresh,
    updateRefreshInterval,
    clearCache
  };
}

// Hook for market data with error retry
export function useMarketDataWithRetry(
  symbols: string[],
  maxRetries: number = 3,
  retryDelay: number = 5000
) {
  const [retryCount, setRetryCount] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);
  
  const marketData = useMarketData(symbols, 0, false); // Disable auto-refresh initially

  const retry = useCallback(async () => {
    if (retryCount >= maxRetries) return;
    
    setIsRetrying(true);
    setRetryCount(prev => prev + 1);
    
    try {
      await marketData.refresh();
      setRetryCount(0); // Reset on success
    } catch (error) {
      console.error(`Retry ${retryCount} failed:`, error);
      
      if (retryCount < maxRetries - 1) {
        setTimeout(() => {
          setIsRetrying(false);
          retry();
        }, retryDelay);
      } else {
        setIsRetrying(false);
      }
    }
  }, [retryCount, maxRetries, retryDelay, marketData]);

  useEffect(() => {
    if (marketData.error && !isRetrying) {
      retry();
    }
  }, [marketData.error, isRetrying, retry]);

  return {
    ...marketData,
    retryCount,
    isRetrying,
    retry,
    canRetry: retryCount < maxRetries
  };
}

// Hook for market data comparison
export function useMarketDataComparison(
  symbols: string[],
  compareWith: string[] = []
) {
  const [currentData, setCurrentData] = useState<MarketData[]>([]);
  const [previousData, setPreviousData] = useState<MarketData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setError(null);
      const data = await marketService.fetchMarketData(symbols);
      
      // Store previous data for comparison
      if (currentData.length > 0) {
        setPreviousData(currentData);
      }
      
      setCurrentData(data);
    } catch (err) {
      setError(err as Error);
      console.error('Error fetching market data for comparison:', err);
    } finally {
      setLoading(false);
    }
  }, [symbols, currentData]);

  useEffect(() => {
    fetchData();
    
    const interval = setInterval(fetchData, 60000); // Refresh every minute
    
    return () => clearInterval(interval);
  }, [fetchData]);

  // Calculate changes between current and previous data
  const getChanges = useCallback(() => {
    if (previousData.length === 0) return {};
    
    const changes: Record<string, { priceChange: number; percentChange: number }> = {};
    
    currentData.forEach(current => {
      const previous = previousData.find(prev => prev.symbol === current.symbol);
      if (previous) {
        changes[current.symbol] = {
          priceChange: current.price - previous.price,
          percentChange: ((current.price - previous.price) / previous.price) * 100
        };
      }
    });
    
    return changes;
  }, [currentData, previousData]);

  return {
    currentData,
    previousData,
    loading,
    error,
    changes: getChanges(),
    refresh: fetchData
  };
}

// Export all hooks
export const marketHooks = {
  useMarketData,
  useMarketIndices,
  useStocks,
  useMarketOverview,
  useStock,
  useMarketDataWithControls,
  useMarketDataWithRetry,
  useMarketDataComparison
};
