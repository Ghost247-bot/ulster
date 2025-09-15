import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

interface ConnectionStatus {
  status: 'connecting' | 'connected' | 'error';
  message: string;
  details?: any;
}

const TestConnection: React.FC = () => {
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>({
    status: 'connecting',
    message: 'Testing connection...'
  });

  useEffect(() => {
    const testConnection = async () => {
      try {
        setConnectionStatus({ status: 'connecting', message: 'Testing Supabase connection...' });
        
        // Test basic connection
        const { data, error } = await supabase
          .from('accounts')
          .select('count')
          .limit(1);
        
        if (error) {
          setConnectionStatus({ 
            status: 'error', 
            message: `Connection failed: ${error.message}`,
            details: error
          });
          return;
        }
        
        // Test auth
        const { data: { session }, error: authError } = await supabase.auth.getSession();
        
        setConnectionStatus({ 
          status: 'connected', 
          message: 'Supabase connected successfully!',
          details: {
            database: 'Connected',
            auth: authError ? `Auth error: ${authError.message}` : session ? 'Logged in' : 'Not logged in',
            tables: 'Accessible'
          }
        });
        
      } catch (error) {
        setConnectionStatus({ 
          status: 'error', 
          message: `Unexpected error: ${error}`,
          details: error
        });
      }
    };

    testConnection();
  }, []);

  const getStatusIcon = () => {
    switch (connectionStatus.status) {
      case 'connecting':
        return <Loader2 className="w-5 h-5 animate-spin text-blue-500" />;
      case 'connected':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />;
    }
  };

  const getStatusColor = () => {
    switch (connectionStatus.status) {
      case 'connecting':
        return 'border-blue-200 bg-blue-50';
      case 'connected':
        return 'border-green-200 bg-green-50';
      case 'error':
        return 'border-red-200 bg-red-50';
    }
  };

  return (
    <div className={`p-4 border rounded-lg ${getStatusColor()}`}>
      <div className="flex items-center gap-3 mb-2">
        {getStatusIcon()}
        <h3 className="font-semibold text-gray-900">Supabase Connection Status</h3>
      </div>
      <p className="text-sm text-gray-700 mb-2">{connectionStatus.message}</p>
      
      {connectionStatus.details && (
        <div className="text-xs text-gray-600 space-y-1">
          {typeof connectionStatus.details === 'object' ? (
            Object.entries(connectionStatus.details).map(([key, value]) => (
              <div key={key} className="flex justify-between">
                <span className="font-medium capitalize">{key}:</span>
                <span>{String(value)}</span>
              </div>
            ))
          ) : (
            <div>Details: {JSON.stringify(connectionStatus.details)}</div>
          )}
        </div>
      )}
    </div>
  );
};

export default TestConnection;