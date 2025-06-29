import { useState, useEffect, useCallback } from 'react';

export interface QueryHistoryItem {
  id: string;
  query: string;
  timestamp: string;
  status: 'completed' | 'processing' | 'failed';
  results?: any[];
  agent?: string;
  confidence?: number;
  executionTime?: number;
  insightCount?: number;
  errorMessage?: string;
}

export function useQueryHistory() {
  const [queryHistory, setQueryHistory] = useState<QueryHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load query history from localStorage on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('marketmind-query-history');
    if (savedHistory) {
      try {
        const parsed = JSON.parse(savedHistory);
        setQueryHistory(parsed);
      } catch (error) {
        console.error('Failed to parse query history:', error);
      }
    }
    setIsLoading(false);
  }, []);

  // Save to localStorage whenever history changes
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('marketmind-query-history', JSON.stringify(queryHistory));
    }
  }, [queryHistory, isLoading]);

  const addQuery = useCallback((query: string, agent?: string) => {
    const newQuery: QueryHistoryItem = {
      id: Date.now().toString(),
      query,
      timestamp: new Date().toISOString(),
      status: 'processing',
      agent,
      executionTime: 0
    };

    setQueryHistory(prev => [newQuery, ...prev.slice(0, 99)]); // Keep only last 100 queries
    return newQuery.id;
  }, []);

  const updateQueryStatus = useCallback((queryId: string, updates: Partial<QueryHistoryItem>) => {
    setQueryHistory(prev => prev.map(item => 
      item.id === queryId 
        ? { ...item, ...updates, timestamp: item.timestamp } // Preserve original timestamp
        : item
    ));
  }, []);

  const completeQuery = useCallback((queryId: string, results: any[], insightCount: number, executionTime: number) => {
    updateQueryStatus(queryId, {
      status: 'completed',
      results,
      insightCount,
      executionTime,
      confidence: Math.floor(Math.random() * 20) + 75 // Simulate confidence score
    });
  }, [updateQueryStatus]);

  const failQuery = useCallback((queryId: string, error?: string) => {
    updateQueryStatus(queryId, {
      status: 'failed',
      errorMessage: error,
      results: error ? [{ error }] : undefined
    });
  }, [updateQueryStatus]);

  const deleteQuery = useCallback((queryId: string) => {
    setQueryHistory(prev => prev.filter(item => item.id !== queryId));
  }, []);

  const clearHistory = useCallback(() => {
    if (confirm('Are you sure you want to clear all query history? This action cannot be undone.')) {
      setQueryHistory([]);
      localStorage.removeItem('marketmind-query-history');
    }
  }, []);

  const getRecentQueries = useCallback((limit: number = 5) => {
    return queryHistory
      .filter(item => item.status === 'completed')
      .slice(0, limit);
  }, [queryHistory]);

  const searchQueries = useCallback((searchTerm: string) => {
    return queryHistory.filter(item => 
      item.query.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.agent?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [queryHistory]);

  const getQueryStats = useCallback(() => {
    const total = queryHistory.length;
    const completed = queryHistory.filter(q => q.status === 'completed').length;
    const failed = queryHistory.filter(q => q.status === 'failed').length;
    const processing = queryHistory.filter(q => q.status === 'processing').length;
    
    const avgExecutionTime = queryHistory
      .filter(q => q.executionTime && q.executionTime > 0)
      .reduce((sum, q) => sum + (q.executionTime || 0), 0) / 
      Math.max(1, queryHistory.filter(q => q.executionTime && q.executionTime > 0).length);

    const totalInsights = queryHistory
      .reduce((sum, q) => sum + (q.insightCount || 0), 0);

    return {
      total,
      completed,
      failed,
      processing,
      avgExecutionTime: Math.round(avgExecutionTime) || 0,
      totalInsights,
      successRate: total > 0 ? Math.round((completed / total) * 100) : 0
    };
  }, [queryHistory]);

  const exportHistory = useCallback(() => {
    const dataStr = JSON.stringify(queryHistory, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `query-history-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [queryHistory]);

  return {
    queryHistory,
    isLoading,
    addQuery,
    updateQueryStatus,
    completeQuery,
    failQuery,
    deleteQuery,
    clearHistory,
    getRecentQueries,
    searchQueries,
    getQueryStats,
    exportHistory
  };
}