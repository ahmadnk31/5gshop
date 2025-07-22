'use client';

import dynamic from 'next/dynamic';

// Dynamically import the PerformanceMonitor to avoid SSR hydration issues
const PerformanceMonitorClient = dynamic(
  () => import('./performance-monitor-client').then(mod => ({ default: mod.PerformanceMonitorClient })),
  { 
    ssr: false,
    loading: () => null
  }
);

export function PerformanceMonitor() {
  return <PerformanceMonitorClient />;
}
