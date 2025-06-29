import React, { useState, useEffect } from 'react';
import { Globe, CheckCircle, AlertCircle, Clock, Zap } from 'lucide-react';

interface APIEndpoint {
  id: string;
  name: string;
  url: string;
  status: 'active' | 'inactive' | 'error' | 'testing';
  lastResponse: number;
  uptime: number;
}

export function APIIntegration() {
  const [endpoints, setEndpoints] = useState<APIEndpoint[]>([
    {
      id: '1',
      name: 'Market Data API',
      url: 'https://api.marketdata.com/v1',
      status: 'active',
      lastResponse: 245,
      uptime: 99.8
    },
    {
      id: '2',
      name: 'News Intelligence API',
      url: 'https://api.newsintel.com/v2',
      status: 'active',
      lastResponse: 180,
      uptime: 99.9
    },
    {
      id: '3',
      name: 'Social Media API',
      url: 'https://api.socialmedia.com/v1',
      status: 'inactive',
      lastResponse: 0,
      uptime: 95.2
    },
    {
      id: '4',
      name: 'Competitor Analysis API',
      url: 'https://api.competitor.com/v3',
      status: 'error',
      lastResponse: 5000,
      uptime: 87.5
    }
  ]);

  const testEndpoint = async (endpointId: string) => {
    setEndpoints(prev => prev.map(ep => 
      ep.id === endpointId 
        ? { ...ep, status: 'testing' }
        : ep
    ));

    // Simulate API test
    setTimeout(() => {
      const success = Math.random() > 0.2; // 80% success rate
      const responseTime = Math.floor(Math.random() * 1000) + 100;
      
      setEndpoints(prev => prev.map(ep => 
        ep.id === endpointId 
          ? { 
              ...ep, 
              status: success ? 'active' : 'error',
              lastResponse: success ? responseTime : 0,
              uptime: success ? Math.min(ep.uptime + 0.1, 100) : Math.max(ep.uptime - 1, 0)
            }
          : ep
      ));
    }, 2000);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'testing':
        return <Clock className="w-4 h-4 text-blue-500 animate-spin" />;
      default:
        return <Globe className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'error':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'testing':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  // Auto-refresh endpoints every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      endpoints.forEach(endpoint => {
        if (endpoint.status !== 'testing') {
          testEndpoint(endpoint.id);
        }
      });
    }, 30000);

    return () => clearInterval(interval);
  }, [endpoints]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Zap className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">API Integrations</h3>
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {endpoints.filter(ep => ep.status === 'active').length} of {endpoints.length} active
        </div>
      </div>

      <div className="space-y-4">
        {endpoints.map((endpoint) => (
          <div key={endpoint.id} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
            <div className="flex items-center space-x-4">
              {getStatusIcon(endpoint.status)}
              <div>
                <h4 className="font-medium text-gray-900 dark:text-gray-100">{endpoint.name}</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">{endpoint.url}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {endpoint.lastResponse > 0 ? `${endpoint.lastResponse}ms` : 'N/A'}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Response time</div>
              </div>
              
              <div className="text-right">
                <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {endpoint.uptime.toFixed(1)}%
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Uptime</div>
              </div>
              
              <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(endpoint.status)}`}>
                {endpoint.status.charAt(0).toUpperCase() + endpoint.status.slice(1)}
              </span>
              
              <button
                onClick={() => testEndpoint(endpoint.id)}
                disabled={endpoint.status === 'testing'}
                className="px-3 py-1 text-xs bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors"
              >
                Test
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}