import React from 'react';
import { useAuthStore } from '../store/authStore';
import MarketOverview from '../components/MarketOverview';
import { useMarketOverview } from '../hooks/useMarketData';

/**
 * Example 1: Simple Market Overview Integration
 * Add this to your dashboard or any page
 */
export const SimpleMarketIntegration: React.FC = () => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Market Overview</h2>
      <MarketOverview 
        className="mb-6"
        showControls={true}
        refreshInterval={60000}
      />
    </div>
  );
};

/**
 * Example 2: Market Data in Dashboard
 * Integrate market data into your existing dashboard
 */
export const DashboardWithMarketData: React.FC = () => {
  const { user } = useAuthStore();
  const { overview, loading, error } = useMarketOverview(60000);

  return (
    <div className="space-y-6 p-6">
      {/* Your existing dashboard content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - Your existing content */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Your Accounts</h3>
            {/* Your existing account components */}
            <p className="text-gray-600">Your account data goes here...</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Recent Transactions</h3>
            {/* Your existing transaction components */}
            <p className="text-gray-600">Your transaction data goes here...</p>
          </div>
        </div>

        {/* Right column - Market data */}
        <div className="space-y-6">
          <MarketOverview 
            className="w-full"
            showControls={false}
            refreshInterval={300000} // 5 minutes for dashboard
          />
          
          {/* Quick market summary */}
          {overview && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">Market Summary</h3>
              <div className="space-y-3">
                {overview.indices.slice(0, 2).map((index) => (
                  <div key={index.symbol} className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">{index.name}</span>
                    <div className="text-right">
                      <div className="font-semibold">{index.value.toFixed(2)}</div>
                      <div className={`text-xs ${index.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {index.change >= 0 ? '+' : ''}{index.change.toFixed(2)} ({index.changePercent.toFixed(2)}%)
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/**
 * Example 3: Market Widget for Sidebar
 * Compact market widget for sidebars or smaller spaces
 */
export const MarketWidget: React.FC = () => {
  const { overview, loading } = useMarketOverview(300000); // 5 minute refresh

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-3"></div>
          <div className="space-y-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-8 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h3 className="text-sm font-semibold text-gray-900 mb-3">Market</h3>
      <div className="space-y-2">
        {overview?.stocks.slice(0, 3).map((stock) => (
          <div key={stock.symbol} className="flex justify-between items-center text-sm">
            <span className="font-medium">{stock.symbol}</span>
            <div className="text-right">
              <div className="font-semibold">${stock.price.toFixed(2)}</div>
              <div className={`text-xs ${stock.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * Example 4: Market Data in Header/Navigation
 * Add market data to your app header
 */
export const HeaderWithMarketData: React.FC = () => {
  const { overview } = useMarketOverview(600000); // 10 minute refresh

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Your existing header content */}
          <div className="flex items-center">
            <h1 className="text-xl font-bold">Your Banking App</h1>
          </div>
          
          {/* Market data in header */}
          {overview && (
            <div className="hidden md:flex items-center space-x-6">
              {overview.indices.slice(0, 2).map((index) => (
                <div key={index.symbol} className="text-sm">
                  <div className="font-medium">{index.name}</div>
                  <div className={`${index.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {index.value.toFixed(2)} ({index.change >= 0 ? '+' : ''}{index.changePercent.toFixed(2)}%)
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* Your existing header actions */}
          <div className="flex items-center space-x-4">
            <button className="btn btn-outline btn-sm">Login</button>
          </div>
        </div>
      </div>
    </header>
  );
};

/**
 * Example 5: Market Data Modal
 * Market data in a modal/popup
 */
export const MarketDataModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ 
  isOpen, 
  onClose 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold">Market Data</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>
        
        <div className="p-6">
          <MarketOverview 
            className="w-full"
            showControls={true}
            refreshInterval={30000}
          />
        </div>
      </div>
    </div>
  );
};

/**
 * Example 6: Market Data with Custom Styling
 * Custom styled market overview
 */
export const CustomStyledMarketOverview: React.FC = () => {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Live Market Data</h2>
      <MarketOverview 
        className="bg-white/80 backdrop-blur-sm border-0 shadow-lg"
        showControls={true}
        refreshInterval={60000}
      />
    </div>
  );
};

/**
 * Example 7: Market Data with Error Boundary
 * Market data with error handling
 */
export const MarketDataWithErrorBoundary: React.FC = () => {
  const { overview, loading, error, refresh } = useMarketOverview(60000);

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Market Data Unavailable
          </h3>
          <p className="text-gray-600 mb-4">
            Unable to fetch market data. Please check your connection and try again.
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
    <MarketOverview 
      className="w-full"
      showControls={true}
      refreshInterval={60000}
    />
  );
};

// Export all examples
export const MarketDataExamples = {
  SimpleMarketIntegration,
  DashboardWithMarketData,
  MarketWidget,
  HeaderWithMarketData,
  MarketDataModal,
  CustomStyledMarketOverview,
  MarketDataWithErrorBoundary
};
