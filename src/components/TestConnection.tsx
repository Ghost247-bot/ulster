import { useEffect, useState } from 'react';
import { testDatabaseConnection } from '../lib/test-db';

export default function TestConnection() {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);

  useEffect(() => {
    async function checkConnection() {
      const connected = await testDatabaseConnection();
      setIsConnected(connected);
    }
    checkConnection();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Database Connection Status</h2>
      {isConnected === null ? (
        <p>Checking connection...</p>
      ) : isConnected ? (
        <p className="text-green-600">✅ Database is connected!</p>
      ) : (
        <p className="text-red-600">❌ Database connection failed</p>
      )}
    </div>
  );
} 