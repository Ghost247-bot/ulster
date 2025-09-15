import { supabase } from './supabase';

// Types for market data
export interface MarketData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume?: number;
  marketCap?: number;
  lastUpdated: string;
}

export interface MarketIndex {
  symbol: string;
  name: string;
  value: number;
  change: number;
  changePercent: number;
  lastUpdated: string;
}

export interface MarketOverview {
  indices: MarketIndex[];
  stocks: MarketData[];
  lastUpdated: string;
}

// Cache for market data
const marketDataCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 60000; // 1 minute cache

// Default symbols to fetch
export const DEFAULT_INDICES = ['^GSPC', '^IXIC', 'GC=F', 'TSLA'];
export const DEFAULT_STOCKS = ['AAPL', 'TSLA', 'AMZN', 'GOOGL', 'MSFT'];

/**
 * Google Finance API Service
 * Note: Google Finance doesn't have a public API, so we'll use alternative methods
 */
export class MarketService {
  private static instance: MarketService;
  private apiKey: string | null = null;

  private constructor() {
    // You can add API keys for services like Alpha Vantage, Yahoo Finance, etc.
    this.apiKey = import.meta.env.VITE_ALPHA_VANTAGE_API_KEY || null;
  }

  public static getInstance(): MarketService {
    if (!MarketService.instance) {
      MarketService.instance = new MarketService();
    }
    return MarketService.instance;
  }

  /**
   * Fetch market data using multiple sources
   */
  async fetchMarketData(symbols: string[]): Promise<MarketData[]> {
    const results: MarketData[] = [];
    
    // Try multiple data sources
    try {
      // Method 1: Try Alpha Vantage if API key is available
      if (this.apiKey) {
        const alphaVantageData = await this.fetchFromAlphaVantage(symbols);
        if (alphaVantageData.length > 0) {
          return alphaVantageData;
        }
      }

      // Method 2: Try Yahoo Finance (free, no API key required)
      const yahooData = await this.fetchFromYahooFinance(symbols);
      if (yahooData.length > 0) {
        return yahooData;
      }

      // Method 3: Use mock data as fallback
      return this.getMockMarketData(symbols);
    } catch (error) {
      console.error('Error fetching market data:', error);
      return this.getMockMarketData(symbols);
    }
  }

  /**
   * Fetch from Alpha Vantage API
   */
  private async fetchFromAlphaVantage(symbols: string[]): Promise<MarketData[]> {
    if (!this.apiKey) return [];

    const results: MarketData[] = [];
    
    for (const symbol of symbols) {
      try {
        const cacheKey = `alpha_vantage_${symbol}`;
        const cached = this.getCachedData(cacheKey);
        if (cached) {
          results.push(cached);
          continue;
        }

        const response = await fetch(
          `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${this.apiKey}`
        );
        
        if (!response.ok) continue;
        
        const data = await response.json();
        const quote = data['Global Quote'];
        
        if (quote && quote['01. symbol']) {
          const marketData: MarketData = {
            symbol: quote['01. symbol'],
            name: this.getCompanyName(symbol),
            price: parseFloat(quote['05. price']),
            change: parseFloat(quote['09. change']),
            changePercent: parseFloat(quote['10. change percent'].replace('%', '')),
            volume: parseInt(quote['06. volume']),
            lastUpdated: new Date().toISOString()
          };
          
          this.setCachedData(cacheKey, marketData);
          results.push(marketData);
        }
      } catch (error) {
        console.error(`Error fetching ${symbol} from Alpha Vantage:`, error);
      }
    }
    
    return results;
  }

  /**
   * Fetch from Yahoo Finance (using a proxy or direct method)
   */
  private async fetchFromYahooFinance(symbols: string[]): Promise<MarketData[]> {
    const results: MarketData[] = [];
    
    try {
      // Using a CORS proxy or direct Yahoo Finance API
      const symbolsString = symbols.join(',');
      const response = await fetch(
        `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${symbolsString}`,
        {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
          }
        }
      );
      
      if (!response.ok) return results;
      
      const data = await response.json();
      const quotes = data.quoteResponse?.result || [];
      
      for (const quote of quotes) {
        const marketData: MarketData = {
          symbol: quote.symbol,
          name: quote.longName || quote.shortName || this.getCompanyName(quote.symbol),
          price: quote.regularMarketPrice || quote.price,
          change: quote.regularMarketChange || quote.change,
          changePercent: quote.regularMarketChangePercent || quote.changePercent,
          volume: quote.regularMarketVolume || quote.volume,
          lastUpdated: new Date().toISOString()
        };
        
        results.push(marketData);
      }
    } catch (error) {
      console.error('Error fetching from Yahoo Finance:', error);
    }
    
    return results;
  }

  /**
   * Get mock market data for development/fallback
   */
  private getMockMarketData(symbols: string[]): MarketData[] {
    const mockData: Record<string, MarketData> = {
      'AAPL': {
        symbol: 'AAPL',
        name: 'Apple Inc.',
        price: 185.50,
        change: 2.30,
        changePercent: 1.25,
        volume: 45000000,
        lastUpdated: new Date().toISOString()
      },
      'TSLA': {
        symbol: 'TSLA',
        name: 'Tesla Inc.',
        price: 245.60,
        change: -3.20,
        changePercent: -1.29,
        volume: 25000000,
        lastUpdated: new Date().toISOString()
      },
      'AMZN': {
        symbol: 'AMZN',
        name: 'Amazon.com Inc.',
        price: 152.30,
        change: 1.80,
        changePercent: 1.20,
        volume: 30000000,
        lastUpdated: new Date().toISOString()
      },
      'GOOGL': {
        symbol: 'GOOGL',
        name: 'Alphabet Inc.',
        price: 142.80,
        change: -1.20,
        changePercent: -0.83,
        volume: 20000000,
        lastUpdated: new Date().toISOString()
      },
      'MSFT': {
        symbol: 'MSFT',
        name: 'Microsoft Corp.',
        price: 378.90,
        change: 5.40,
        changePercent: 1.45,
        volume: 18000000,
        lastUpdated: new Date().toISOString()
      },
      '^GSPC': {
        symbol: '^GSPC',
        name: 'S&P 500',
        price: 4852.0,
        change: 31.5,
        changePercent: 0.65,
        lastUpdated: new Date().toISOString()
      },
      '^IXIC': {
        symbol: '^IXIC',
        name: 'NASDAQ',
        price: 15258.0,
        change: 105.2,
        changePercent: 0.69,
        lastUpdated: new Date().toISOString()
      },
      'GC=F': {
        symbol: 'GC=F',
        name: 'Gold',
        price: 2057.5,
        change: 25.0,
        changePercent: 1.23,
        lastUpdated: new Date().toISOString()
      }
    };

    return symbols.map(symbol => mockData[symbol]).filter(Boolean);
  }

  /**
   * Get market indices data
   */
  async fetchMarketIndices(): Promise<MarketIndex[]> {
    const indicesData = await this.fetchMarketData(DEFAULT_INDICES);
    
    return indicesData.map(data => ({
      symbol: data.symbol,
      name: this.getIndexName(data.symbol),
      value: data.price,
      change: data.change,
      changePercent: data.changePercent,
      lastUpdated: data.lastUpdated
    }));
  }

  /**
   * Get individual stocks data
   */
  async fetchStocks(): Promise<MarketData[]> {
    return this.fetchMarketData(DEFAULT_STOCKS);
  }

  /**
   * Get complete market overview
   */
  async fetchMarketOverview(): Promise<MarketOverview> {
    const [indices, stocks] = await Promise.all([
      this.fetchMarketIndices(),
      this.fetchStocks()
    ]);

    return {
      indices,
      stocks,
      lastUpdated: new Date().toISOString()
    };
  }

  /**
   * Get company name for symbol
   */
  private getCompanyName(symbol: string): string {
    const names: Record<string, string> = {
      'AAPL': 'Apple Inc.',
      'TSLA': 'Tesla Inc.',
      'AMZN': 'Amazon.com Inc.',
      'GOOGL': 'Alphabet Inc.',
      'MSFT': 'Microsoft Corp.',
      'META': 'Meta Platforms Inc.',
      'NVDA': 'NVIDIA Corp.',
      'NFLX': 'Netflix Inc.',
      '^GSPC': 'S&P 500',
      '^IXIC': 'NASDAQ',
      '^DJI': 'Dow Jones',
      'GC=F': 'Gold',
      'CL=F': 'Crude Oil',
      'BTC-USD': 'Bitcoin'
    };
    
    return names[symbol] || symbol;
  }

  /**
   * Get index name for symbol
   */
  private getIndexName(symbol: string): string {
    const names: Record<string, string> = {
      '^GSPC': 'S&P 500',
      '^IXIC': 'NASDAQ',
      '^DJI': 'Dow Jones',
      'GC=F': 'Gold',
      'CL=F': 'Crude Oil',
      'BTC-USD': 'Bitcoin'
    };
    
    return names[symbol] || symbol;
  }

  /**
   * Cache management
   */
  private getCachedData(key: string): any {
    const cached = marketDataCache.get(key);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.data;
    }
    return null;
  }

  private setCachedData(key: string, data: any): void {
    marketDataCache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    marketDataCache.clear();
  }

  /**
   * Get cache status
   */
  getCacheStatus(): { size: number; keys: string[] } {
    return {
      size: marketDataCache.size,
      keys: Array.from(marketDataCache.keys())
    };
  }
}

// Export singleton instance
export const marketService = MarketService.getInstance();

// Export utility functions
export const formatPrice = (price: number): string => {
  return price.toFixed(2);
};

export const formatChange = (change: number): string => {
  const sign = change >= 0 ? '+' : '';
  return `${sign}${change.toFixed(2)}`;
};

export const formatChangePercent = (changePercent: number): string => {
  const sign = changePercent >= 0 ? '+' : '';
  return `${sign}${changePercent.toFixed(2)}%`;
};

export const getChangeColor = (change: number): string => {
  return change >= 0 ? 'text-green-600' : 'text-red-600';
};

export const getChangeBgColor = (change: number): string => {
  return change >= 0 ? 'bg-green-100' : 'bg-red-100';
};
