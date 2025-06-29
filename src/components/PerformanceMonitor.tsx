import React, { useState, useEffect } from 'react';
import { Activity, Clock, Zap, Database, Globe } from 'lucide-react';

interface PerformanceMetrics {
  pageLoadTime: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  cumulativeLayoutShift: number;
  firstInputDelay: number;
  memoryUsage: number;
  networkRequests: number;
}

export function PerformanceMonitor() {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    pageLoadTime: 0,
    firstContentfulPaint: 0,
    largestContentfulPaint: 0,
    cumulativeLayoutShift: 0,
    firstInputDelay: 0,
    memoryUsage: 0,
    networkRequests: 0
  });

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const measurePerformance = () => {
      // Page Load Time
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      const pageLoadTime = navigation.loadEventEnd - navigation.fetchStart;

      // Core Web Vitals
      let fcp = 0;
      let lcp = 0;
      let cls = 0;
      let fid = 0;

      // First Contentful Paint
      const fcpEntry = performance.getEntriesByName('first-contentful-paint')[0];
      if (fcpEntry) {
        fcp = fcpEntry.startTime;
      }

      // Largest Contentful Paint
      if ('PerformanceObserver' in window) {
        try {
          const lcpObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const lastEntry = entries[entries.length - 1];
            lcp = lastEntry.startTime;
          });
          lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
        } catch (e) {
          console.warn('LCP measurement not supported');
        }
      }

      // Memory usage (if available)
      let memoryUsage = 0;
      if ('memory' in performance) {
        const memory = (performance as any).memory;
        memoryUsage = memory.usedJSHeapSize / 1024 / 1024; // Convert to MB
      }

      // Network requests
      const resourceEntries = performance.getEntriesByType('resource');
      const networkRequests = resourceEntries.length;

      setMetrics({
        pageLoadTime: Math.round(pageLoadTime),
        firstContentfulPaint: Math.round(fcp),
        largestContentfulPaint: Math.round(lcp),
        cumulativeLayoutShift: cls,
        firstInputDelay: fid,
        memoryUsage: Math.round(memoryUsage * 100) / 100,
        networkRequests
      });
    };

    // Initial measurement
    if (document.readyState === 'complete') {
      measurePerformance();
    } else {
      window.addEventListener('load', measurePerformance);
    }

    // Update metrics periodically
    const interval = setInterval(measurePerformance, 5000);

    return () => {
      window.removeEventListener('load', measurePerformance);
      clearInterval(interval);
    };
  }, []);

  const getPerformanceScore = (metric: string, value: number) => {
    switch (metric) {
      case 'pageLoadTime':
        return value < 3000 ? 'good' : value < 5000 ? 'needs-improvement' : 'poor';
      case 'firstContentfulPaint':
        return value < 1800 ? 'good' : value < 3000 ? 'needs-improvement' : 'poor';
      case 'largestContentfulPaint':
        return value < 2500 ? 'good' : value < 4000 ? 'needs-improvement' : 'poor';
      default:
        return 'good';
    }
  };

  const getScoreColor = (score: string) => {
    switch (score) {
      case 'good':
        return 'text-green-600 bg-green-100 border-green-200';
      case 'needs-improvement':
        return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      case 'poor':
        return 'text-red-600 bg-red-100 border-red-200';
      default:
        return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 right-4 p-3 bg-purple-600 text-white rounded-full shadow-lg hover:bg-purple-700 transition-colors z-50"
        title="Show Performance Metrics"
      >
        <Activity className="w-5 h-5" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4 w-80 z-50">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Activity className="w-5 h-5 text-purple-600" />
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">Performance</h3>
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          ×
        </button>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-700 dark:text-gray-300">Page Load</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {(metrics.pageLoadTime / 1000).toFixed(2)}s
            </span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getScoreColor(getPerformanceScore('pageLoadTime', metrics.pageLoadTime))}`}>
              {getPerformanceScore('pageLoadTime', metrics.pageLoadTime)}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Zap className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-700 dark:text-gray-300">FCP</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {(metrics.firstContentfulPaint / 1000).toFixed(2)}s
            </span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getScoreColor(getPerformanceScore('firstContentfulPaint', metrics.firstContentfulPaint))}`}>
              {getPerformanceScore('firstContentfulPaint', metrics.firstContentfulPaint)}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Database className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-700 dark:text-gray-300">Memory</span>
          </div>
          <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
            {metrics.memoryUsage} MB
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Globe className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-700 dark:text-gray-300">Requests</span>
          </div>
          <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
            {metrics.networkRequests}
          </span>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-600">
        <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
          Updates every 5 seconds
        </div>
      </div>
    </div>
  );
}