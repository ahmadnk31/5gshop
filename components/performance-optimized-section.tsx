'use client';

import { useState, useEffect, useRef } from 'react';

interface PerformanceOptimizedSectionProps {
  children: React.ReactNode;
  delay?: number;
  threshold?: number;
  fallback?: React.ReactNode;
  priority?: 'high' | 'low';
}

export function PerformanceOptimizedSection({
  children,
  delay = 1000,
  threshold = 0.1,
  fallback = <div className="animate-pulse bg-gray-200 h-32 rounded" />,
  priority = 'low'
}: PerformanceOptimizedSectionProps) {
  const [shouldRender, setShouldRender] = useState(priority === 'high');
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (priority === 'high') return;

    // For low priority sections, use intersection observer
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin: '100px' }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => observer.disconnect();
  }, [threshold, priority]);

  useEffect(() => {
    if (priority === 'high') {
      // High priority sections render after a small delay
      const timer = setTimeout(() => setShouldRender(true), 100);
      return () => clearTimeout(timer);
    }

    if (isVisible) {
      // Low priority sections render when visible + delay
      const timer = setTimeout(() => setShouldRender(true), delay);
      return () => clearTimeout(timer);
    }
  }, [isVisible, delay, priority]);

  return (
    <div ref={ref}>
      {shouldRender ? children : fallback}
    </div>
  );
}

// Hook for deferring heavy operations
export function useDeferredValue<T>(value: T, delay: number = 300): T {
  const [deferredValue, setDeferredValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDeferredValue(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return deferredValue;
}

// Component to lazy load heavy components
export function LazyComponent({ 
  component: Component, 
  fallback = <div className="animate-pulse bg-gray-200 h-32 rounded" />,
  delay = 2000 
}: {
  component: React.ComponentType<any>;
  fallback?: React.ReactNode;
  delay?: number;
  [key: string]: any;
}) {
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShouldLoad(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  if (!shouldLoad) {
    return <>{fallback}</>;
  }

  return <Component />;
}
