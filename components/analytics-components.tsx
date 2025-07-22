'use client';

import { useEffect } from 'react';
import { useGoogleAnalytics } from '@/components/google-analytics';
import { useCookieConsent } from '@/components/cookie-consent-context';

// Example components showing Google Analytics integration

// Button with automatic click tracking
export function AnalyticsButton({ 
  children, 
  eventName, 
  eventParams = {},
  onClick,
  className = "",
  ...props 
}: {
  children: React.ReactNode;
  eventName: string;
  eventParams?: Record<string, any>;
  onClick?: () => void;
  className?: string;
  [key: string]: any;
}) {
  const { trackEvent } = useGoogleAnalytics();

  const handleClick = () => {
    trackEvent(eventName, eventParams);
    onClick?.();
  };

  return (
    <button 
      className={`px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 ${className}`}
      onClick={handleClick}
      {...props}
    >
      {children}
    </button>
  );
}

// Phone number link with call tracking
export function TrackablePhoneLink({ 
  phoneNumber, 
  children,
  className = ""
}: {
  phoneNumber: string;
  children: React.ReactNode;
  className?: string;
}) {
  const { trackPhoneCall } = useGoogleAnalytics();

  const handleClick = () => {
    trackPhoneCall(phoneNumber);
  };

  return (
    <a 
      href={`tel:${phoneNumber}`}
      onClick={handleClick}
      className={`text-blue-600 hover:underline ${className}`}
    >
      {children}
    </a>
  );
}

// Form wrapper with submission tracking
export function AnalyticsForm({ 
  children, 
  formType,
  onSubmit,
  className = "",
  ...props 
}: {
  children: React.ReactNode;
  formType: string;
  onSubmit?: (e: React.FormEvent) => void;
  className?: string;
  [key: string]: any;
}) {
  const { trackContactForm } = useGoogleAnalytics();

  const handleSubmit = (e: React.FormEvent) => {
    trackContactForm(formType);
    onSubmit?.(e);
  };

  return (
    <form 
      onSubmit={handleSubmit}
      className={className}
      {...props}
    >
      {children}
    </form>
  );
}

// External link with tracking
export function AnalyticsExternalLink({ 
  href, 
  children,
  linkText,
  className = "",
  ...props 
}: {
  href: string;
  children: React.ReactNode;
  linkText: string;
  className?: string;
  [key: string]: any;
}) {
  const { trackEvent } = useGoogleAnalytics();

  const handleClick = () => {
    trackEvent('external_link_click', {
      link_url: href,
      link_text: linkText,
    });
  };

  return (
    <a 
      href={href}
      onClick={handleClick}
      target="_blank"
      rel="noopener noreferrer"
      className={`text-blue-600 hover:underline ${className}`}
      {...props}
    >
      {children}
    </a>
  );
}

// Quote request tracking component
export function QuoteRequestTracker({ 
  deviceType, 
  repairType, 
  estimatedValue 
}: {
  deviceType: string;
  repairType: string;
  estimatedValue?: number;
}) {
  const { trackQuoteRequest } = useGoogleAnalytics();

  useEffect(() => {
    trackQuoteRequest(deviceType, repairType, estimatedValue);
  }, [deviceType, repairType, estimatedValue, trackQuoteRequest]);

  return null; // This component doesn't render anything
}

// Page view tracker for specific sections - optimized for performance
export function PageSectionTracker({ 
  sectionName, 
  trackOnVisible = true 
}: {
  sectionName: string;
  trackOnVisible?: boolean;
}) {
  const { trackEvent, isEnabled } = useGoogleAnalytics();

  useEffect(() => {
    // Don't run if analytics is disabled
    if (!isEnabled) return;

    if (!trackOnVisible) {
      // Use requestIdleCallback for non-critical tracking
      const scheduleTracking = () => {
        trackEvent('page_section_view', { section_name: sectionName });
      };

      if ('requestIdleCallback' in window) {
        const id = requestIdleCallback(scheduleTracking, { timeout: 2000 });
        return () => cancelIdleCallback(id);
      } else {
        const timer = setTimeout(scheduleTracking, 1000);
        return () => clearTimeout(timer);
      }
    }

    // Optimized intersection observer implementation
    let hasTracked = false;
    let observer: IntersectionObserver | null = null;
    
    const initObserver = () => {
      if (hasTracked) return;
      
      observer = new IntersectionObserver(
        (entries) => {
          if (hasTracked) return;
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              hasTracked = true;
              // Use requestIdleCallback for non-critical analytics
              if ('requestIdleCallback' in window) {
                requestIdleCallback(() => {
                  trackEvent('page_section_view', { section_name: sectionName });
                });
              } else {
                trackEvent('page_section_view', { section_name: sectionName });
              }
              observer?.disconnect();
            }
          });
        },
        { 
          threshold: 0.1, // Lower threshold for better performance
          rootMargin: '100px' // Larger root margin for earlier triggering
        }
      );

      const element = document.querySelector(`[data-section="${sectionName}"]`);
      if (element) {
        observer.observe(element);
      }
    };

    // Use requestIdleCallback for non-critical setup
    if ('requestIdleCallback' in window) {
      const id = requestIdleCallback(initObserver, { timeout: 3000 });
      return () => {
        cancelIdleCallback(id);
        observer?.disconnect();
      };
    } else {
      const timer = setTimeout(initObserver, 1500);
      return () => {
        clearTimeout(timer);
        observer?.disconnect();
      };
    }
  }, [sectionName, trackOnVisible, trackEvent, isEnabled]);

  return <div data-section={sectionName} style={{ height: 0, visibility: 'hidden' }} />;
}

// Download link tracker
export function AnalyticsDownloadLink({ 
  href, 
  fileName,
  fileType,
  children,
  className = "",
  ...props 
}: {
  href: string;
  fileName: string;
  fileType: string;
  children: React.ReactNode;
  className?: string;
  [key: string]: any;
}) {
  const { trackEvent } = useGoogleAnalytics();

  const handleClick = () => {
    trackEvent('file_download', {
      file_name: fileName,
      file_type: fileType,
      file_url: href,
    });
  };

  return (
    <a 
      href={href}
      onClick={handleClick}
      download
      className={`text-blue-600 hover:underline ${className}`}
      {...props}
    >
      {children}
    </a>
  );
}

// Scroll depth tracker - optimized with throttling and lazy loading
export function ScrollDepthTracker() {
  const { trackEvent, isEnabled } = useGoogleAnalytics();

  useEffect(() => {
    // Don't run if analytics is disabled
    if (!isEnabled) return;

    const scrollDepths = [50, 90]; // Essential tracking points only
    const trackedDepths = new Set<number>();
    let rafId: number | null = null;

    const handleScroll = () => {
      if (rafId) return; // Throttle using RAF
      
      rafId = requestAnimationFrame(() => {
        try {
          const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
          const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
          
          if (documentHeight <= 0) {
            rafId = null;
            return;
          }
          
          const scrollPercent = Math.round((scrollTop / documentHeight) * 100);

          scrollDepths.forEach(depth => {
            if (scrollPercent >= depth && !trackedDepths.has(depth)) {
              trackedDepths.add(depth);
              // Use requestIdleCallback for non-critical analytics
              if ('requestIdleCallback' in window) {
                requestIdleCallback(() => {
                  trackEvent('scroll_depth', { 
                    scroll_depth: depth,
                    page_type: window.innerWidth < 768 ? 'mobile' : 'desktop'
                  });
                });
              } else {
                setTimeout(() => {
                  trackEvent('scroll_depth', { 
                    scroll_depth: depth,
                    page_type: window.innerWidth < 768 ? 'mobile' : 'desktop'
                  });
                }, 50);
              }
            }
          });
        } catch (error) {
          console.warn('Scroll tracking error:', error);
        } finally {
          rafId = null;
        }
      });
    };

    // Delay the scroll listener setup to avoid blocking initial render
    const timer = setTimeout(() => {
      window.addEventListener('scroll', handleScroll, { 
        passive: true,
        capture: false 
      });
    }, 2000);

    return () => {
      clearTimeout(timer);
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
      window.removeEventListener('scroll', handleScroll);
    };
  }, [trackEvent, isEnabled]);

  return null;
}

// Analytics status indicator (for debugging)
export function AnalyticsStatus() {
  const { consent } = useCookieConsent();
  const { isEnabled } = useGoogleAnalytics();

  if (process.env.NODE_ENV !== 'development') return null;

  return (
    <div className="fixed bottom-4 left-4 bg-gray-800 text-white p-2 rounded text-sm z-40">
      <div>Analytics: {isEnabled ? '✅ Enabled' : '❌ Disabled'}</div>
      <div>Consent: {consent?.analytics ? '✅ Given' : '❌ Not given'}</div>
    </div>
  );
}
