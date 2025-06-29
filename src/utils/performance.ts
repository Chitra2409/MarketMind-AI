export const measurePerformance = () => {
  const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
  
  return {
    pageLoadTime: navigation.loadEventEnd - navigation.fetchStart,
    domContentLoaded: navigation.domContentLoadedEventEnd - navigation.fetchStart,
    firstByte: navigation.responseStart - navigation.fetchStart,
    domInteractive: navigation.domInteractive - navigation.fetchStart,
    resourceLoadTime: navigation.loadEventEnd - navigation.domContentLoadedEventEnd
  };
};

export const optimizeImages = () => {
  const images = document.querySelectorAll('img');
  
  images.forEach(img => {
    // Add loading="lazy" for images below the fold
    if (!img.hasAttribute('loading')) {
      const rect = img.getBoundingClientRect();
      if (rect.top > window.innerHeight) {
        img.setAttribute('loading', 'lazy');
      }
    }
    
    // Add proper alt text if missing
    if (!img.hasAttribute('alt')) {
      img.setAttribute('alt', 'Image');
    }
  });
};

export const preloadCriticalResources = () => {
  const criticalResources = [
    '/api/agents',
    '/api/insights',
    '/api/reports'
  ];
  
  criticalResources.forEach(url => {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = url;
    document.head.appendChild(link);
  });
};

export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};