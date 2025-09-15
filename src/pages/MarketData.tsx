import React, { useState } from 'react';
import { 
  TrendingUp, 
  BarChart3, 
  Settings, 
  RefreshCw,
  Wifi,
  WifiOff,
  AlertCircle
} from 'lucide-react';
import MarketOverview from '../components/MarketOverview';
import { 
  useMarketDataWithRetry, 
  useMarketDataComparison,
  useStock 
} from '../hooks/useMarketData';
import { 
  formatPrice, 
  formatChange, 
  formatChangePercent, 
  getChangeColor 
} from '../lib/marketService';

const MarketData: React.FC = () => {
  const [selectedStock, setSelectedStock] = useState('AAPL');
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Example of using the retry hook
  const {
    data: retryData,
    loading: retryLoading,
    error: retryError,
    retryCount,
    isRetrying,
    retry,
    canRetry
  } = useMarketDataWithRetry(['AAPL', 'TSLA'], 3, 5000);

  // Example of using the comparison hook
  const {
    currentData,
    previousData,
    loading: comparisonLoading,
    changes
  } = useMarketDataComparison(['AAPL', 'TSLA', 'AMZN']);

  // Example of using individual stock hook
  const {
    stock,
    loading: stockLoading,
    error: stockError,
    lastUpdated: stockLastUpdated
  } = useStock(selectedStock, 30000);

  return (
    <div className="space-y-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Market Data
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">
            Real-time market data and financial information
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="btn btn-outline flex items-center"
          >
            <Settings className="w-4 h-4 mr-2" />
            {showAdvanced ? 'Hide' : 'Show'} Advanced
          </button>
        </div>
      </div>

      {/* Main Market Overview */}
      <MarketOverview 
        className="w-full"
        showControls={true}
        refreshInterval={60000}
      />

      {/* Advanced Features */}
      {showAdvanced && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Retry Example */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Retry Mechanism
              </h3>
              <div className="flex items-center space-x-2">
                {retryError ? (
                  <WifiOff className="w-5 h-5 text-red-500" />
                ) : (
                  <Wifi className="w-5 h-5 text-green-500" />
                )}
                <span className="text-sm text-gray-500">
                  Retries: {retryCount}
                </span>
              </div>
            </div>
            
            {retryError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center">
                  <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                  <span className="text-sm text-red-700">
                    {retryError.message}
                  </span>
                </div>
              </div>
            )}
            
            <div className="space-y-3">
              {retryData?.map((stock) => (
                <div key={stock.symbol} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium">{stock.symbol}</h4>
                    <p className="text-sm text-gray-600">{stock.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">${formatPrice(stock.price)}</p>
                    <p className={`text-sm ${getChangeColor(stock.change)}`}>
                      {formatChange(stock.change)} ({formatChangePercent(stock.changePercent)})
                    </p>
                  </div>
                </div>
              ))}
            </div>
            
            {canRetry && (
              <button
                onClick={retry}
                disabled={isRetrying}
                className="mt-4 btn btn-outline w-full"
              >
                {isRetrying ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Retrying...
                  </>
                ) : (
                  'Retry'
                )}
              </button>
            )}
          </div>

          {/* Comparison Example */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Price Comparison
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Compare current prices with previous values
            </p>
            
            <div className="space-y-3">
              {currentData?.map((stock) => {
                const change = changes[stock.symbol];
                return (
                  <div key={stock.symbol} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium">{stock.symbol}</h4>
                      <p className="text-sm text-gray-600">{stock.name}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">${formatPrice(stock.price)}</p>
                      {change && (
                        <p className={`text-sm ${getChangeColor(change.priceChange)}`}>
                          {formatChange(change.priceChange)} ({formatChangePercent(change.percentChange)})
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Individual Stock Example */}
          <div className="bg-white rounded-lg shadow-md p-6 lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Individual Stock Tracker
              </h3>
              <select
                value={selectedStock}
                onChange={(e) => setSelectedStock(e.target.value)}
                className="form-input"
              >
                <option value="AAPL">Apple (AAPL)</option>
                <option value="TSLA">Tesla (TSLA)</option>
                <option value="AMZN">Amazon (AMZN)</option>
                <option value="GOOGL">Google (GOOGL)</option>
                <option value="MSFT">Microsoft (MSFT)</option>
              </select>
            </div>
            
            {stockLoading ? (
              <div className="text-center py-8">
                <RefreshCw className="w-8 h-8 animate-spin text-primary-600 mx-auto mb-2" />
                <p className="text-gray-600">Loading stock data...</p>
              </div>
            ) : stockError ? (
              <div className="text-center py-8">
                <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
                <p className="text-red-600">Error loading stock data</p>
              </div>
            ) : stock ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <h4 className="text-2xl font-bold text-gray-900">
                    ${formatPrice(stock.price)}
                  </h4>
                  <p className="text-sm text-gray-600">Current Price</p>
                </div>
                
                <div className="text-center">
                  <p className={`text-xl font-semibold ${getChangeColor(stock.change)}`}>
                    {formatChange(stock.change)}
                  </p>
                  <p className="text-sm text-gray-600">Change</p>
                </div>
                
                <div className="text-center">
                  <p className={`text-xl font-semibold ${getChangeColor(stock.changePercent)}`}>
                    {formatChangePercent(stock.changePercent)}
                  </p>
                  <p className="text-sm text-gray-600">Change %</p>
                </div>
              </div>
            ) : null}
            
            {stockLastUpdated && (
              <p className="text-xs text-gray-500 mt-4 text-center">
                Last updated: {stockLastUpdated.toLocaleTimeString()}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Usage Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">
          How to Use Market Data
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
          <div>
            <h4 className="font-medium mb-2">Real-time Updates</h4>
            <ul className="space-y-1">
              <li>• Data refreshes automatically every minute</li>
              <li>• Toggle auto-refresh on/off in settings</li>
              <li>• Manual refresh available anytime</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">Data Sources</h4>
            <ul className="space-y-1">
              <li>• Multiple API sources for reliability</li>
              <li>• Fallback to mock data if APIs fail</li>
              <li>• Cached data for better performance</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketData;
