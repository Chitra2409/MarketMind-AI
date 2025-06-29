import React, { useState, useEffect } from 'react';
import { Database, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';

interface DatabaseConnectionProps {
  onConnectionChange: (isConnected: boolean) => void;
}

export function DatabaseConnection({ onConnectionChange }: DatabaseConnectionProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'connecting' | 'connected' | 'error'>('idle');
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  const testConnection = async () => {
    setIsConnecting(true);
    setConnectionStatus('connecting');

    try {
      // Simulate database connection test
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock successful connection
      const success = Math.random() > 0.1; // 90% success rate
      
      if (success) {
        setIsConnected(true);
        setConnectionStatus('connected');
        onConnectionChange(true);
      } else {
        throw new Error('Connection failed');
      }
    } catch (error) {
      setIsConnected(false);
      setConnectionStatus('error');
      onConnectionChange(false);
    } finally {
      setIsConnecting(false);
      setLastChecked(new Date());
    }
  };

  useEffect(() => {
    // Auto-test connection on mount
    testConnection();
    
    // Set up periodic connection checks
    const interval = setInterval(testConnection, 30000); // Check every 30 seconds
    
    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = () => {
    switch (connectionStatus) {
      case 'connected':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'connecting':
        return <RefreshCw className="w-5 h-5 text-blue-500 animate-spin" />;
      default:
        return <Database className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusText = () => {
    switch (connectionStatus) {
      case 'connected':
        return 'Connected';
      case 'error':
        return 'Connection Failed';
      case 'connecting':
        return 'Connecting...';
      default:
        return 'Not Connected';
    }
  };

  const getStatusColor = () => {
    switch (connectionStatus) {
      case 'connected':
        return 'text-green-600 bg-green-100 border-green-200';
      case 'error':
        return 'text-red-600 bg-red-100 border-red-200';
      case 'connecting':
        return 'text-blue-600 bg-blue-100 border-blue-200';
      default:
        return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  return (
    <div className="flex items-center space-x-3">
      <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor()}`}>
        {getStatusIcon()}
        <span>{getStatusText()}</span>
      </div>
      
      {lastChecked && (
        <span className="text-xs text-gray-500">
          Last checked: {lastChecked.toLocaleTimeString()}
        </span>
      )}
      
      <button
        onClick={testConnection}
        disabled={isConnecting}
        className="p-1 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
        title="Test connection"
      >
        <RefreshCw className={`w-4 h-4 ${isConnecting ? 'animate-spin' : ''}`} />
      </button>
    </div>
  );
}