'use client';

import { useEffect, useState } from 'react';

interface PerformanceMetrics {
  fcp: number | null;
  lcp: number | null;
  fid: number | null;
  cls: number | null;
  ttfb: number | null;
  domContentLoaded: number | null;
  memoryUsage: number | null;
}

export function PerformanceMonitorClient() {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fcp: null,
    lcp: null,
    fid: null,
    cls: null,
    ttfb: null,
    domContentLoaded: null,
    memoryUsage: null,
  });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only show in development after mounting
    if (process.env.NODE_ENV !== 'development') return;
    
    // Delay showing to ensure proper hydration
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 1000);

    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        setMetrics(prev => {
          const updated = { ...prev };
          
          switch (entry.name) {
            case 'first-contentful-paint':
              updated.fcp = entry.startTime;
              break;
            case 'largest-contentful-paint':
              updated.lcp = entry.startTime;
              break;
            case 'first-input':
              updated.fid = (entry as any).processingStart - entry.startTime;
              break;
            case 'layout-shift':
              if (!(entry as any).hadRecentInput) {
                updated.cls = (updated.cls || 0) + (entry as any).value;
              }
              break;
          }
          
          return updated;
        });
      });
    });

    try {
      observer.observe({ entryTypes: ['paint', 'largest-contentful-paint', 'first-input', 'layout-shift'] });
    } catch (e) {
      console.warn('Performance Observer not supported');
    }

    const getNavigationTiming = () => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navigation) {
        setMetrics(prev => ({
          ...prev,
          ttfb: navigation.responseStart - navigation.requestStart,
          domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        }));
      }
    };

    const getMemoryUsage = () => {
      if ('memory' in performance) {
        const memory = (performance as any).memory;
        setMetrics(prev => ({
          ...prev,
          memoryUsage: memory.usedJSHeapSize / 1024 / 1024,
        }));
      }
    };

    if (document.readyState === 'complete') {
      getNavigationTiming();
      getMemoryUsage();
    } else {
      window.addEventListener('load', () => {
        getNavigationTiming();
        getMemoryUsage();
      });
    }

    const memoryInterval = setInterval(getMemoryUsage, 5000);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
      clearInterval(memoryInterval);
    };
  }, []);

  if (!isVisible) return null;

  const formatTime = (time: number | null) => {
    if (time === null) return 'N/A';
    return `${time.toFixed(0)}ms`;
  };

  const formatMemory = (memory: number | null) => {
    if (memory === null) return 'N/A';
    return `${memory.toFixed(1)}MB`;
  };

  const getScoreColor = (metric: string, value: number | null) => {
    if (value === null) return 'text-gray-400';
    
    switch (metric) {
      case 'fcp':
        return value < 1800 ? 'text-green-400' : value < 3000 ? 'text-yellow-400' : 'text-red-400';
      case 'lcp':
        return value < 2500 ? 'text-green-400' : value < 4000 ? 'text-yellow-400' : 'text-red-400';
      case 'fid':
        return value < 100 ? 'text-green-400' : value < 300 ? 'text-yellow-400' : 'text-red-400';
      case 'cls':
        return value < 0.1 ? 'text-green-400' : value < 0.25 ? 'text-yellow-400' : 'text-red-400';
      case 'ttfb':
        return value < 800 ? 'text-green-400' : value < 1800 ? 'text-yellow-400' : 'text-red-400';
      default:
        return 'text-blue-400';
    }
  };

  const getTTFBSuggestion = (ttfb: number | null) => {
    if (ttfb === null) return null;
    if (ttfb > 5000) return '🚨 Critical: Check database connections & server optimization';
    if (ttfb > 2000) return '⚠️ High: Optimize server-side rendering & API calls';
    if (ttfb > 800) return '💡 Consider: Database query optimization';
    return '✅ Good server response time';
  };

  return (
    <div className="fixed bottom-4 right-4 bg-black/95 text-white p-3 rounded-lg text-xs font-mono z-[200] max-w-sm shadow-2xl border border-gray-700">
      <div className="font-bold mb-2 text-blue-400">⚡ Performance Metrics</div>
      <div className="space-y-1">
        <div className="flex justify-between">
          <span>FCP:</span>
          <span className={getScoreColor('fcp', metrics.fcp)}>{formatTime(metrics.fcp)}</span>
        </div>
        <div className="flex justify-between">
          <span>LCP:</span>
          <span className={getScoreColor('lcp', metrics.lcp)}>{formatTime(metrics.lcp)}</span>
        </div>
        <div className="flex justify-between">
          <span>FID:</span>
          <span className={getScoreColor('fid', metrics.fid)}>{formatTime(metrics.fid)}</span>
        </div>
        <div className="flex justify-between">
          <span>CLS:</span>
          <span className={getScoreColor('cls', metrics.cls)}>
            {metrics.cls !== null ? metrics.cls.toFixed(3) : 'N/A'}
          </span>
        </div>
        <div className="flex justify-between">
          <span>TTFB:</span>
          <span className={getScoreColor('ttfb', metrics.ttfb)}>{formatTime(metrics.ttfb)}</span>
        </div>
        <div className="flex justify-between">
          <span>DOM:</span>
          <span className="text-blue-400">{formatTime(metrics.domContentLoaded)}</span>
        </div>
        <div className="flex justify-between">
          <span>Memory:</span>
          <span className="text-purple-400">{formatMemory(metrics.memoryUsage)}</span>
        </div>
      </div>
      
      {getTTFBSuggestion(metrics.ttfb) && (
        <div className="mt-2 pt-2 border-t border-gray-600">
          <div className="text-yellow-300 text-[10px] leading-tight">
            {getTTFBSuggestion(metrics.ttfb)}
          </div>
        </div>
      )}
      
      <div className="mt-2 pt-1 border-t border-gray-600 text-gray-400 text-[10px]">
        Green: Good | Yellow: Needs Improvement | Red: Poor
      </div>
    </div>
  );
}
