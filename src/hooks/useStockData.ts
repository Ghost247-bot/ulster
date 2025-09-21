import { useState, useEffect, useCallback } from 'react';
import { getStockData, StockData, formatStockData } from '../lib/stockService';

interface UseStockDataOptions {
  symbols?: string[];
  refreshInterval?: number;
  autoRefresh?: boolean;
}

interface UseStockDataReturn {
  stockData: StockData[];
  isLoading: boolean;
  error: string | null;
  lastUpdated: string | null;
  refresh: () => Promise<void>;
  isRefreshing: boolean;
}

export const useStockData = ({
  symbols = ['AAPL', 'GOOGL', 'MSFT', 'TSLA'],
  refreshInterval = 30000, // 30 seconds
  autoRefresh = true,
}: UseStockDataOptions = {}): UseStockDataReturn => {
  const [stockData, setStockData] = useState<StockData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  const fetchData = useCallback(async (isManualRefresh = false) => {
    try {
      if (isManualRefresh) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }
      setError(null);
      
      const data = await getStockData(symbols);
      setStockData(data);
      setLastUpdated(new Date().toISOString());
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch stock data';
      setError(errorMessage);
      console.error('Error fetching stock data:', err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [symbols]);

  const refresh = useCallback(() => fetchData(true), [fetchData]);

  // Separate effect for initial fetch and auto-refresh setup
  useEffect(() => {
    fetchData();
  }, [symbols]); // Only depend on symbols for initial fetch

  useEffect(() => {
    if (!autoRefresh) return;
    
    const interval = setInterval(() => {
      fetchData();
    }, refreshInterval);
    
    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, fetchData]);

  return {
    stockData,
    isLoading,
    error,
    lastUpdated,
    refresh,
    isRefreshing,
  };
};
