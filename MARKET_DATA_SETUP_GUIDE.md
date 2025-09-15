# Market Data Setup Guide

This guide shows you how to integrate real-time market data from Google Finance and other sources into your banking application.

## 🚀 Quick Start

### 1. Basic Integration

Add the Market Overview component to any page:

```typescript
import MarketOverview from '../components/MarketOverview';

const MyPage = () => {
  return (
    <div>
      <h1>My Page</h1>
      <MarketOverview 
        className="mb-6"
        showControls={true}
        refreshInterval={60000}
      />
    </div>
  );
};
```

### 2. Using Hooks

```typescript
import { useMarketOverview } from '../hooks/useMarketData';

const MyComponent = () => {
  const { overview, loading, error } = useMarketOverview(60000);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {overview?.stocks.map(stock => (
        <div key={stock.symbol}>
          {stock.symbol}: ${stock.price}
        </div>
      ))}
    </div>
  );
};
```

## 📊 Features

### ✅ What's Included

- **Real-time Market Data**: Live stock prices and market indices
- **Multiple Data Sources**: Yahoo Finance, Alpha Vantage, with fallback to mock data
- **Auto-refresh**: Configurable refresh intervals (30s to 10min)
- **Caching**: Built-in caching for better performance
- **Error Handling**: Retry mechanisms and graceful fallbacks
- **TypeScript Support**: Full type safety
- **Responsive Design**: Works on all screen sizes
- **Customizable**: Easy to style and integrate

### 🎯 Data Sources

1. **Alpha Vantage** (Primary - requires API key)
2. **Yahoo Finance** (Secondary - free, no API key)
3. **Mock Data** (Fallback - for development)

## 🔧 Setup Instructions

### Step 1: Environment Variables

Create a `.env` file in your project root:

```env
# Optional: Alpha Vantage API key for better data
VITE_ALPHA_VANTAGE_API_KEY=your_api_key_here
```

**Getting Alpha Vantage API Key:**
1. Go to [Alpha Vantage](https://www.alphavantage.co/support/#api-key)
2. Sign up for a free account
3. Get your API key
4. Add it to your `.env` file

### Step 2: Add to Your App

#### Option A: Add to Existing Page

```typescript
// In your existing page (e.g., Dashboard.tsx)
import MarketOverview from '../components/MarketOverview';

const Dashboard = () => {
  return (
    <div className="space-y-6">
      {/* Your existing content */}
      
      {/* Add market overview */}
      <MarketOverview 
        className="w-full"
        showControls={true}
        refreshInterval={60000}
      />
    </div>
  );
};
```

#### Option B: Create New Market Page

```typescript
// Create src/pages/MarketData.tsx
import React from 'react';
import MarketOverview from '../components/MarketOverview';

const MarketData = () => {
  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-bold">Market Data</h1>
      <MarketOverview 
        className="w-full"
        showControls={true}
        refreshInterval={60000}
      />
    </div>
  );
};

export default MarketData;
```

#### Option C: Add to Navigation

```typescript
// In your routing (e.g., App.tsx)
import MarketData from './pages/MarketData';

// Add route
<Route path="/market" element={<MarketData />} />
```

### Step 3: Customize Data Sources

Edit `src/lib/marketService.ts` to modify which stocks/indices to fetch:

```typescript
// Change default symbols
export const DEFAULT_INDICES = ['^GSPC', '^IXIC', 'GC=F', 'TSLA'];
export const DEFAULT_STOCKS = ['AAPL', 'TSLA', 'AMZN', 'GOOGL', 'MSFT'];
```

## 🎨 Customization

### Styling

The component uses Tailwind CSS classes. You can customize the appearance:

```typescript
<MarketOverview 
  className="bg-blue-50 border-2 border-blue-200"
  showControls={true}
  refreshInterval={60000}
/>
```

### Custom Refresh Intervals

```typescript
// 30 seconds
<MarketOverview refreshInterval={30000} />

// 5 minutes
<MarketOverview refreshInterval={300000} />

// Manual refresh only
<MarketOverview refreshInterval={0} />
```

### Hide Controls

```typescript
<MarketOverview 
  showControls={false}
  refreshInterval={60000}
/>
```

## 🔌 Advanced Usage

### Using Individual Hooks

```typescript
import { 
  useMarketIndices, 
  useStocks, 
  useStock 
} from '../hooks/useMarketData';

const MyComponent = () => {
  // Get market indices only
  const { indices, loading } = useMarketIndices(60000);
  
  // Get individual stocks
  const { stocks } = useStocks(60000);
  
  // Get specific stock
  const { stock } = useStock('AAPL', 30000);
  
  return (
    <div>
      {/* Your custom UI */}
    </div>
  );
};
```

### Error Handling with Retry

```typescript
import { useMarketDataWithRetry } from '../hooks/useMarketData';

const MyComponent = () => {
  const {
    data,
    loading,
    error,
    retryCount,
    retry,
    canRetry
  } = useMarketDataWithRetry(['AAPL', 'TSLA'], 3, 5000);

  if (error && canRetry) {
    return (
      <div>
        <p>Error: {error.message}</p>
        <button onClick={retry}>Retry ({retryCount}/3)</button>
      </div>
    );
  }

  return <div>{/* Your content */}</div>;
};
```

### Real-time Updates

```typescript
import { useMarketData } from '../hooks/useMarketData';

const MyComponent = () => {
  const { data, isAutoRefreshing } = useMarketData(
    ['AAPL', 'TSLA'], 
    30000, // 30 second refresh
    true   // auto-refresh enabled
  );

  return (
    <div>
      <p>Status: {isAutoRefreshing ? 'Live' : 'Paused'}</p>
      {/* Your content */}
    </div>
  );
};
```

## 📱 Integration Examples

### Dashboard Integration

```typescript
const Dashboard = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left column - existing content */}
      <div className="lg:col-span-2">
        {/* Your existing dashboard components */}
      </div>
      
      {/* Right column - market data */}
      <div>
        <MarketOverview 
          className="w-full"
          showControls={false}
          refreshInterval={300000} // 5 minutes
        />
      </div>
    </div>
  );
};
```

### Sidebar Widget

```typescript
const Sidebar = () => {
  return (
    <div className="w-64 bg-gray-100 p-4">
      <h3 className="font-semibold mb-4">Market</h3>
      <MarketOverview 
        className="w-full"
        showControls={false}
        refreshInterval={600000} // 10 minutes
      />
    </div>
  );
};
```

### Header Integration

```typescript
const Header = () => {
  const { overview } = useMarketOverview(600000);
  
  return (
    <header className="bg-white shadow-sm">
      <div className="flex justify-between items-center p-4">
        <h1>My App</h1>
        
        {overview && (
          <div className="flex space-x-4">
            {overview.indices.slice(0, 2).map(index => (
              <div key={index.symbol} className="text-sm">
                <div>{index.name}</div>
                <div className={index.change >= 0 ? 'text-green-600' : 'text-red-600'}>
                  {index.value.toFixed(2)} ({index.changePercent.toFixed(2)}%)
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </header>
  );
};
```

## 🛠️ Troubleshooting

### Common Issues

1. **No data showing**
   - Check if API keys are set correctly
   - Verify network connection
   - Check browser console for errors

2. **CORS errors**
   - The service includes CORS handling
   - If issues persist, use a CORS proxy

3. **Rate limiting**
   - Alpha Vantage has rate limits (5 calls/minute for free tier)
   - The service includes caching to reduce API calls

4. **Slow loading**
   - Increase refresh intervals
   - Check network connection
   - Clear browser cache

### Debug Mode

Enable debug logging:

```typescript
// In marketService.ts, add console.log statements
console.log('Fetching market data for:', symbols);
console.log('API response:', data);
```

### Testing with Mock Data

The service automatically falls back to mock data if APIs fail. You can force mock data by:

```typescript
// In marketService.ts, modify fetchMarketData method
async fetchMarketData(symbols: string[]): Promise<MarketData[]> {
  // Force mock data for testing
  return this.getMockMarketData(symbols);
}
```

## 📈 Performance Tips

1. **Use appropriate refresh intervals**
   - Dashboard: 5-10 minutes
   - Trading view: 30 seconds - 1 minute
   - General info: 10-30 minutes

2. **Cache data**
   - The service includes built-in caching
   - Cache duration: 1 minute by default

3. **Limit symbols**
   - Only fetch symbols you need
   - Default: 4 indices + 5 stocks

4. **Use pagination**
   - For large lists, implement pagination
   - Load more data on demand

## 🔒 Security Considerations

1. **API Keys**
   - Never expose API keys in client-side code
   - Use environment variables
   - Consider server-side proxy for sensitive APIs

2. **Rate Limiting**
   - Implement client-side rate limiting
   - Use caching to reduce API calls
   - Monitor API usage

3. **Data Validation**
   - Validate all incoming data
   - Handle malformed responses gracefully
   - Implement error boundaries

## 📚 API Documentation

### MarketService Methods

```typescript
// Get market overview
const overview = await marketService.fetchMarketOverview();

// Get specific stocks
const stocks = await marketService.fetchStocks();

// Get market indices
const indices = await marketService.fetchMarketIndices();

// Get custom symbols
const data = await marketService.fetchMarketData(['AAPL', 'TSLA']);

// Clear cache
marketService.clearCache();
```

### Hook Options

```typescript
// Basic usage
const { data, loading, error } = useMarketOverview(refreshInterval);

// With controls
const { data, loading, error, refresh, isAutoRefreshing } = useMarketDataWithControls(symbols, refreshInterval);

// With retry
const { data, loading, error, retry, canRetry } = useMarketDataWithRetry(symbols, maxRetries, retryDelay);

// Individual stock
const { stock, loading, error } = useStock(symbol, refreshInterval);
```

## 🎯 Next Steps

1. **Add to your dashboard** - Start with the basic integration
2. **Customize symbols** - Add stocks relevant to your users
3. **Style to match your app** - Adjust colors and layout
4. **Add more features** - Consider adding charts, alerts, etc.
5. **Monitor performance** - Watch API usage and optimize

## 📞 Support

If you encounter issues:

1. Check the browser console for errors
2. Verify your API keys are correct
3. Test with mock data first
4. Check network connectivity
5. Review the troubleshooting section above

The market data service is designed to be robust and handle various failure scenarios gracefully, so your app will continue to work even if external APIs are unavailable.
