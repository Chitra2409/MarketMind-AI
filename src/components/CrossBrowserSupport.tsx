import React, { useState, useEffect } from 'react';
import { AlertTriangle, CheckCircle, Globe, Smartphone, Monitor } from 'lucide-react';

interface BrowserInfo {
  name: string;
  version: string;
  isSupported: boolean;
  features: {
    [key: string]: boolean;
  };
}

export function CrossBrowserSupport() {
  const [browserInfo, setBrowserInfo] = useState<BrowserInfo | null>(null);
  const [deviceInfo, setDeviceInfo] = useState<{
    type: 'desktop' | 'tablet' | 'mobile';
    screenSize: string;
    orientation: string;
  } | null>(null);

  useEffect(() => {
    const detectBrowser = () => {
      const userAgent = navigator.userAgent;
      let name = 'Unknown';
      let version = 'Unknown';
      let isSupported = true;

      // Detect browser
      if (userAgent.includes('Chrome')) {
        name = 'Chrome';
        const match = userAgent.match(/Chrome\/(\d+)/);
        version = match ? match[1] : 'Unknown';
        isSupported = parseInt(version) >= 90;
      } else if (userAgent.includes('Firefox')) {
        name = 'Firefox';
        const match = userAgent.match(/Firefox\/(\d+)/);
        version = match ? match[1] : 'Unknown';
        isSupported = parseInt(version) >= 88;
      } else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) {
        name = 'Safari';
        const match = userAgent.match(/Version\/(\d+)/);
        version = match ? match[1] : 'Unknown';
        isSupported = parseInt(version) >= 14;
      } else if (userAgent.includes('Edge')) {
        name = 'Edge';
        const match = userAgent.match(/Edg\/(\d+)/);
        version = match ? match[1] : 'Unknown';
        isSupported = parseInt(version) >= 90;
      }

      // Test browser features
      const features = {
        webGL: !!window.WebGLRenderingContext,
        localStorage: !!window.localStorage,
        sessionStorage: !!window.sessionStorage,
        indexedDB: !!window.indexedDB,
        webWorkers: !!window.Worker,
        fetch: !!window.fetch,
        promises: !!window.Promise,
        es6Modules: 'noModule' in document.createElement('script'),
        css3: CSS.supports('display', 'grid'),
        flexbox: CSS.supports('display', 'flex'),
        webSockets: !!window.WebSocket,
        geolocation: !!navigator.geolocation,
        notifications: !!window.Notification,
        serviceWorker: 'serviceWorker' in navigator
      };

      setBrowserInfo({
        name,
        version,
        isSupported,
        features
      });
    };

    const detectDevice = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      let type: 'desktop' | 'tablet' | 'mobile' = 'desktop';
      if (width <= 768) {
        type = 'mobile';
      } else if (width <= 1024) {
        type = 'tablet';
      }

      const orientation = width > height ? 'landscape' : 'portrait';
      const screenSize = `${width}x${height}`;

      setDeviceInfo({
        type,
        screenSize,
        orientation
      });
    };

    detectBrowser();
    detectDevice();

    // Listen for resize events
    const handleResize = () => {
      detectDevice();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!browserInfo || !deviceInfo) {
    return null;
  }

  const getDeviceIcon = () => {
    switch (deviceInfo.type) {
      case 'mobile':
        return <Smartphone className="w-4 h-4" />;
      case 'tablet':
        return <Smartphone className="w-4 h-4" />;
      default:
        return <Monitor className="w-4 h-4" />;
    }
  };

  const unsupportedFeatures = Object.entries(browserInfo.features)
    .filter(([_, supported]) => !supported)
    .map(([feature]) => feature);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Globe className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">Browser Compatibility</h3>
        </div>
        
        <div className="flex items-center space-x-2">
          {browserInfo.isSupported ? (
            <CheckCircle className="w-5 h-5 text-green-500" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-red-500" />
          )}
          <span className={`text-sm font-medium ${
            browserInfo.isSupported 
              ? 'text-green-600 dark:text-green-400' 
              : 'text-red-600 dark:text-red-400'
          }`}>
            {browserInfo.isSupported ? 'Supported' : 'Limited Support'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <div className="text-sm text-gray-500 dark:text-gray-400">Browser</div>
          <div className="font-medium text-gray-900 dark:text-gray-100">
            {browserInfo.name} {browserInfo.version}
          </div>
        </div>
        
        <div>
          <div className="text-sm text-gray-500 dark:text-gray-400">Device</div>
          <div className="flex items-center space-x-2">
            {getDeviceIcon()}
            <span className="font-medium text-gray-900 dark:text-gray-100 capitalize">
              {deviceInfo.type}
            </span>
          </div>
        </div>
        
        <div>
          <div className="text-sm text-gray-500 dark:text-gray-400">Screen Size</div>
          <div className="font-medium text-gray-900 dark:text-gray-100">
            {deviceInfo.screenSize}
          </div>
        </div>
        
        <div>
          <div className="text-sm text-gray-500 dark:text-gray-400">Orientation</div>
          <div className="font-medium text-gray-900 dark:text-gray-100 capitalize">
            {deviceInfo.orientation}
          </div>
        </div>
      </div>

      {!browserInfo.isSupported && (
        <div className="bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-700 rounded-lg p-3 mb-4">
          <div className="flex items-center space-x-2 mb-2">
            <AlertTriangle className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
            <span className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
              Browser Compatibility Warning
            </span>
          </div>
          <p className="text-sm text-yellow-700 dark:text-yellow-300">
            Your browser version may not support all features. Please consider updating to the latest version.
          </p>
        </div>
      )}

      {unsupportedFeatures.length > 0 && (
        <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-lg p-3">
          <div className="flex items-center space-x-2 mb-2">
            <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400" />
            <span className="text-sm font-medium text-red-800 dark:text-red-200">
              Missing Features
            </span>
          </div>
          <div className="flex flex-wrap gap-1">
            {unsupportedFeatures.map((feature) => (
              <span
                key={feature}
                className="px-2 py-1 bg-red-100 dark:bg-red-800 text-red-700 dark:text-red-200 text-xs rounded"
              >
                {feature}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}