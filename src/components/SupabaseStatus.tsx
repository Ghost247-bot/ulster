import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Database, CheckCircle, XCircle, Loader2, Wifi, WifiOff } from 'lucide-react';

interface ConnectionInfo {
  status: 'connecting' | 'connected' | 'error' | 'disconnected';
  message: string;
  databaseConnected: boolean;
  authWorking: boolean;
  projectInfo?: {
    name: string;
    region: string;
    url: string;
  };
}

const SupabaseStatus: React.FC = () => {
  const [connectionInfo, setConnectionInfo] = useState<ConnectionInfo>({
    status: 'connecting',
    message: 'Testing Supabase connection...',
    databaseConnected: false,
    authWorking: false
  });

  useEffect(() => {
    const testConnection = async () => {
      try {
        setConnectionInfo(prev => ({ ...prev, status: 'connecting', message: 'Connecting to Supabase...' }));

        // Test database connection
        const { data: dbData, error: dbError } = await supabase
          .from('accounts')
          .select('count')
          .limit(1);

        // Test auth
        const { data: { session }, error: authError } = await supabase.auth.getSession();

        // Test project info
        const projectUrl = import.meta.env.VITE_SUPABASE_URL;
        const projectInfo = projectUrl ? {
          name: 'Ulster Banking',
          region: 'Central EU (Frankfurt)',
          url: projectUrl
        } : undefined;

        if (dbError) {
          setConnectionInfo({
            status: 'error',
            message: `Database connection failed: ${dbError.message}`,
            databaseConnected: false,
            authWorking: !authError,
            projectInfo
          });
          return;
        }

        setConnectionInfo({
          status: 'connected',
          message: 'Supabase connected successfully!',
          databaseConnected: true,
          authWorking: !authError,
          projectInfo
        });

      } catch (error) {
        setConnectionInfo({
          status: 'error',
          message: `Connection failed: ${error}`,
          databaseConnected: false,
          authWorking: false
        });
      }
    };

    testConnection();
  }, []);

  const getStatusIcon = () => {
    switch (connectionInfo.status) {
      case 'connecting':
        return <Loader2 className="w-5 h-5 animate-spin text-blue-500" />;
      case 'connected':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'disconnected':
        return <WifiOff className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = () => {
    switch (connectionInfo.status) {
      case 'connecting':
        return 'border-blue-200 bg-blue-50';
      case 'connected':
        return 'border-green-200 bg-green-50';
      case 'error':
        return 'border-red-200 bg-red-50';
      case 'disconnected':
        return 'border-gray-200 bg-gray-50';
    }
  };

  return (
    <div className={`p-4 border rounded-lg ${getStatusColor()}`}>
      <div className="flex items-center gap-3 mb-3">
        {getStatusIcon()}
        <h3 className="font-semibold text-gray-900">Supabase Connection</h3>
        <div className="flex items-center gap-1 ml-auto">
          <Wifi className="w-4 h-4 text-gray-500" />
          <span className="text-sm text-gray-600">Live</span>
        </div>
      </div>
      
      <p className="text-sm text-gray-700 mb-3">{connectionInfo.message}</p>
      
      <div className="grid grid-cols-2 gap-4 text-xs">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${connectionInfo.databaseConnected ? 'bg-green-500' : 'bg-red-500'}`} />
          <span>Database: {connectionInfo.databaseConnected ? 'Connected' : 'Disconnected'}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${connectionInfo.authWorking ? 'bg-green-500' : 'bg-red-500'}`} />
          <span>Auth: {connectionInfo.authWorking ? 'Working' : 'Error'}</span>
        </div>
      </div>

      {connectionInfo.projectInfo && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <div className="text-xs text-gray-600 space-y-1">
            <div className="flex justify-between">
              <span className="font-medium">Project:</span>
              <span>{connectionInfo.projectInfo.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Region:</span>
              <span>{connectionInfo.projectInfo.region}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupabaseStatus;
