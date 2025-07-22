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
      // Delay non-critical tracking
      const timer = setTimeout(() => {
        trackEvent('page_section_view', { section_name: sectionName });
      }, 1000);
      return () => clearTimeout(timer);
    }

    // Use a lighter intersection observer implementation
    let hasTracked = false;
    const observer = new IntersectionObserver(
      (entries) => {
        if (hasTracked) return;
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            hasTracked = true;
            trackEvent('page_section_view', { section_name: sectionName });
            observer.disconnect();
          }
        });
      },
      { 
        threshold: 0.3, // Lower threshold for faster triggering
        rootMargin: '50px' // Trigger earlier
      }
    );

    // Use requestIdleCallback for non-critical setup
    const setupObserver = () => {
      const element = document.querySelector(`[data-section="${sectionName}"]`);
      if (element) {
        observer.observe(element);
      }
    };

    if ('requestIdleCallback' in window) {
      requestIdleCallback(setupObserver, { timeout: 2000 });
    } else {
      setTimeout(setupObserver, 1000);
    }

    return () => observer.disconnect();
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

    const scrollDepths = [50, 90]; // Reduced tracking points for performance
    const trackedDepths = new Set<number>();
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollPercent = Math.round(
            (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
          );

          scrollDepths.forEach(depth => {
            if (scrollPercent >= depth && !trackedDepths.has(depth)) {
              trackedDepths.add(depth);
              // Delay tracking to avoid blocking scroll
              setTimeout(() => {
                trackEvent('scroll_depth', { 
                  scroll_depth: depth,
                  page_type: 'mobile'
                });
              }, 100);
            }
          });
          ticking = false;
        });
        ticking = true;
      }
    };

    // Delay the scroll listener setup
    const timer = setTimeout(() => {
      window.addEventListener('scroll', handleScroll, { passive: true });
    }, 3000); // Wait 3 seconds before starting scroll tracking

    return () => {
      clearTimeout(timer);
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
