import React, { useState } from 'react';
import { X, Clock, CheckCircle, AlertCircle, Search, Trash2, Play, BarChart3, Download, Filter } from 'lucide-react';
import { useQueryHistory, QueryHistoryItem } from '../hooks/useQueryHistory';

interface QueryHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRerunQuery?: (query: string) => void;
}

export function QueryHistoryModal({ isOpen, onClose, onRerunQuery }: QueryHistoryModalProps) {
  const { queryHistory, deleteQuery, clearHistory, getQueryStats, searchQueries, exportHistory } = useQueryHistory();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'completed' | 'processing' | 'failed'>('all');
  const [sortBy, setSortBy] = useState<'timestamp' | 'confidence' | 'executionTime'>('timestamp');

  if (!isOpen) return null;

  const stats = getQueryStats();
  
  const filteredQueries = searchTerm 
    ? searchQueries(searchTerm)
    : queryHistory;

  const statusFilteredQueries = filterStatus === 'all' 
    ? filteredQueries 
    : filteredQueries.filter(q => q.status === filterStatus);

  // Sort queries
  const sortedQueries = [...statusFilteredQueries].sort((a, b) => {
    switch (sortBy) {
      case 'confidence':
        return (b.confidence || 0) - (a.confidence || 0);
      case 'executionTime':
        return (a.executionTime || 0) - (b.executionTime || 0);
      default:
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    }
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'processing': return <Clock className="w-4 h-4 text-blue-500 animate-spin" />;
      case 'failed': return <AlertCircle className="w-4 h-4 text-red-500" />;
      default: return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'processing': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'failed': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const handleRerun = (query: string) => {
    if (onRerunQuery) {
      onRerunQuery(query);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-6xl max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <BarChart3 className="w-6 h-6 text-purple-600" />
            <h3 className="text-xl font-semibold text-gray-900">Query History & Analytics</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stats Overview */}
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-blue-50">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center p-4 bg-white rounded-lg shadow-sm">
              <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
              <div className="text-sm text-gray-500">Total Queries</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg shadow-sm">
              <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
              <div className="text-sm text-gray-500">Completed</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg shadow-sm">
              <div className="text-2xl font-bold text-blue-600">{stats.processing}</div>
              <div className="text-sm text-gray-500">Processing</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg shadow-sm">
              <div className="text-2xl font-bold text-purple-600">{stats.totalInsights}</div>
              <div className="text-sm text-gray-500">Insights Generated</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg shadow-sm">
              <div className="text-2xl font-bold text-orange-600">{stats.successRate}%</div>
              <div className="text-sm text-gray-500">Success Rate</div>
            </div>
          </div>
        </div>

        {/* Filters and Controls */}
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search queries, agents, or results..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex space-x-2">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="completed">Completed</option>
                <option value="processing">Processing</option>
                <option value="failed">Failed</option>
              </select>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="timestamp">Sort by Date</option>
                <option value="confidence">Sort by Confidence</option>
                <option value="executionTime">Sort by Speed</option>
              </select>
              <button
                onClick={exportHistory}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>
              <button
                onClick={clearHistory}
                className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center space-x-2"
              >
                <Trash2 className="w-4 h-4" />
                <span>Clear All</span>
              </button>
            </div>
          </div>
        </div>

        {/* Query List */}
        <div className="flex-1 overflow-y-auto max-h-96">
          {sortedQueries.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-lg font-medium mb-2">No queries found</p>
              <p>Try adjusting your search criteria or filters.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {sortedQueries.map((query) => (
                <div key={query.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        {getStatusIcon(query.status)}
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(query.status)}`}>
                          {query.status.charAt(0).toUpperCase() + query.status.slice(1)}
                        </span>
                        <span className="text-sm text-gray-500">{formatTimestamp(query.timestamp)}</span>
                        {query.agent && (
                          <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                            {query.agent}
                          </span>
                        )}
                      </div>
                      
                      <p className="text-gray-900 font-medium mb-3 text-lg">"{query.query}"</p>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        {query.executionTime && (
                          <div className="flex items-center space-x-2">
                            <Clock className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-600">
                              <span className="font-medium">{query.executionTime}ms</span> execution
                            </span>
                          </div>
                        )}
                        {query.insightCount && (
                          <div className="flex items-center space-x-2">
                            <BarChart3 className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-600">
                              <span className="font-medium">{query.insightCount}</span> insights
                            </span>
                          </div>
                        )}
                        {query.confidence && (
                          <div className="flex items-center space-x-2">
                            <div className={`w-4 h-4 rounded-full ${
                              query.confidence >= 80 ? 'bg-green-500' :
                              query.confidence >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}></div>
                            <span className="text-gray-600">
                              <span className="font-medium">{query.confidence}%</span> confidence
                            </span>
                          </div>
                        )}
                        {query.status === 'failed' && query.errorMessage && (
                          <div className="col-span-full">
                            <div className="flex items-center space-x-2 text-red-600">
                              <AlertCircle className="w-4 h-4" />
                              <span className="text-sm">{query.errorMessage}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      {query.status === 'completed' && onRerunQuery && (
                        <button
                          onClick={() => handleRerun(query.query)}
                          className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                          title="Rerun query"
                        >
                          <Play className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => deleteQuery(query.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete query"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50 text-center">
          <p className="text-sm text-gray-500">
            Showing {sortedQueries.length} of {queryHistory.length} queries
          </p>
        </div>
      </div>
    </div>
  );
}