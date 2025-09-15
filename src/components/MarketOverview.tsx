import React, { useState } from 'react';
import { 
  RefreshCw, 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  Clock,
  Settings,
  Wifi,
  WifiOff
} from 'lucide-react';
import { 
  useMarketOverview, 
  useMarketDataWithControls 
} from '../hooks/useMarketData';
import { 
  formatPrice, 
  formatChange, 
  formatChangePercent, 
  getChangeColor, 
  getChangeBgColor 
} from '../lib/marketService';

interface MarketOverviewProps {
  className?: string;
  showControls?: boolean;
  refreshInterval?: number;
}

const MarketOverview: React.FC<MarketOverviewProps> = ({
  className = '',
  showControls = true,
  refreshInterval = 60000
}) => {
  const [showSettings, setShowSettings] = useState(false);
  const [customInterval, setCustomInterval] = useState(refreshInterval);
  
  const {
    overview,
    loading,
    error,
    lastUpdated,
    refresh,
    refreshInterval: currentInterval,
    isAutoRefreshEnabled,
    toggleAutoRefresh,
    updateRefreshInterval,
    clearCache
  } = useMarketDataWithControls(['AAPL', 'TSLA', 'AMZN', 'GOOGL', 'MSFT'], refreshInterval);

  const formatTime = (date: Date | null): string => {
    if (!date) return '';
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  };

  const getRefreshIntervalLabel = (interval: number): string => {
    if (interval < 60000) return `${interval / 1000}s`;
    if (interval < 3600000) return `${interval / 60000}m`;
    return `${interval / 3600000}h`;
  };

  if (loading && !overview) {
    return (
      <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <WifiOff className="w-12 h-12 mx-auto" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Market Data Unavailable
          </h3>
          <p className="text-gray-600 mb-4">
            {error.message || 'Unable to fetch market data. Please try again.'}
          </p>
          <button
            onClick={refresh}
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Retrying...' : 'Retry'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-md ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <h2 className="text-xl font-bold text-gray-900">Market Overview</h2>
          <div className="flex items-center space-x-2">
            {isAutoRefreshEnabled ? (
              <Wifi className="w-4 h-4 text-green-500" />
            ) : (
              <WifiOff className="w-4 h-4 text-gray-400" />
            )}
            <span className="text-sm text-gray-500">
              {isAutoRefreshEnabled ? 'Live' : 'Paused'}
            </span>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          {/* Last Updated Time */}
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Clock className="w-4 h-4" />
            <span>{formatTime(lastUpdated)}</span>
          </div>
          
          {/* Refresh Button */}
          <button
            onClick={refresh}
            disabled={loading}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            title="Refresh data"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          
          {/* Settings Button */}
          {showControls && (
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              title="Settings"
            >
              <Settings className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && showControls && (
        <div className="p-4 bg-gray-50 border-b border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Auto Refresh
              </label>
              <button
                onClick={toggleAutoRefresh}
                className={`btn ${isAutoRefreshEnabled ? 'btn-primary' : 'btn-outline'}`}
              >
                {isAutoRefreshEnabled ? 'Enabled' : 'Disabled'}
              </button>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Refresh Interval
              </label>
              <select
                value={currentInterval}
                onChange={(e) => updateRefreshInterval(Number(e.target.value))}
                className="form-input"
                disabled={!isAutoRefreshEnabled}
              >
                <option value={30000}>30 seconds</option>
                <option value={60000}>1 minute</option>
                <option value={300000}>5 minutes</option>
                <option value={600000}>10 minutes</option>
                <option value={0}>Manual only</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cache
              </label>
              <button
                onClick={clearCache}
                className="btn btn-outline"
              >
                Clear Cache
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="p-6">
        {/* Market Indices */}
        {overview?.indices && overview.indices.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Market Indices</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {overview.indices.map((index) => (
                <div
                  key={index.symbol}
                  className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">{index.name}</h4>
                    <div className={`p-1 rounded ${getChangeBgColor(index.change)}`}>
                      {index.change >= 0 ? (
                        <TrendingUp className="w-4 h-4 text-green-600" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-red-600" />
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-2xl font-bold text-gray-900">
                      {formatPrice(index.value)}
                    </p>
                    <div className="flex items-center space-x-2">
                      <span className={`text-sm font-medium ${getChangeColor(index.change)}`}>
                        {formatChange(index.change)}
                      </span>
                      <span className={`text-sm ${getChangeColor(index.change)}`}>
                        ({formatChangePercent(index.changePercent)})
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Individual Stocks */}
        {overview?.stocks && overview.stocks.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Top Stocks</h3>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <BarChart3 className="w-4 h-4" />
                <span>Real-time data</span>
              </div>
            </div>
            
            <div className="space-y-3">
              {overview.stocks.map((stock) => (
                <div
                  key={stock.symbol}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    {/* Stock Icon */}
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      stock.change >= 0 ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                      {stock.change >= 0 ? (
                        <TrendingUp className="w-5 h-5 text-green-600" />
                      ) : (
                        <TrendingDown className="w-5 h-5 text-red-600" />
                      )}
                    </div>
                    
                    {/* Stock Info */}
                    <div>
                      <h4 className="font-semibold text-gray-900">{stock.symbol}</h4>
                      <p className="text-sm text-gray-600">{stock.name}</p>
                    </div>
                  </div>
                  
                  {/* Price and Change */}
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900">
                      ${formatPrice(stock.price)}
                    </p>
                    <div className="flex items-center space-x-2">
                      <span className={`text-sm font-medium ${getChangeColor(stock.change)}`}>
                        {formatChange(stock.change)}
                      </span>
                      <span className={`text-sm ${getChangeColor(stock.change)}`}>
                        ({formatChangePercent(stock.changePercent)})
                      </span>
                    </div>
                    {stock.volume && (
                      <p className="text-xs text-gray-500 mt-1">
                        Vol: {(stock.volume / 1000000).toFixed(1)}M
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Loading Overlay */}
        {loading && overview && (
          <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center rounded-lg">
            <div className="flex items-center space-x-2">
              <RefreshCw className="w-5 h-5 animate-spin text-primary-600" />
              <span className="text-sm text-gray-600">Updating...</span>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 rounded-b-lg">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>
            Data provided by multiple sources • Last updated: {formatTime(lastUpdated)}
          </span>
          <span>
            Auto-refresh: {isAutoRefreshEnabled ? getRefreshIntervalLabel(currentInterval) : 'Off'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default MarketOverview;
