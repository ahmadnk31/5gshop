'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useCookieConsent } from '@/components/cookie-consent-context';
import { initGoogleAnalytics, updateGoogleAnalyticsConsent, gtag, GA_MEASUREMENT_ID } from '@/lib/google-analytics';

interface GoogleAnalyticsProps {
  measurementId?: string;
}

export function GoogleAnalytics({ measurementId = GA_MEASUREMENT_ID }: GoogleAnalyticsProps) {
  const { consent } = useCookieConsent();
  const pathname = usePathname();

  // Initialize Google Analytics when component mounts
  useEffect(() => {
    if (measurementId) {
      initGoogleAnalytics(measurementId);
    }
  }, [measurementId]);

  // Update consent when user preferences change
  useEffect(() => {
    if (consent) {
      updateGoogleAnalyticsConsent({
        analytics: consent.analytics,
        marketing: consent.marketing,
        preferences: consent.preferences,
      });
    }
  }, [consent]);

  // Track page views when route changes (only if analytics consent is given)
  useEffect(() => {
    if (consent?.analytics && pathname) {
      gtag.pageView(pathname);
    }
  }, [pathname, consent?.analytics]);

  return null; // This component doesn't render anything
}

// HOC to wrap components with automatic event tracking
export function withAnalytics<T extends object>(
  Component: React.ComponentType<T>,
  eventName: string,
  eventParams?: Record<string, any>
) {
  return function AnalyticsWrappedComponent(props: T) {
    const { consent } = useCookieConsent();

    const handleClick = () => {
      if (consent?.analytics) {
        gtag.event(eventName, eventParams);
      }
    };

    return (
      <div onClick={handleClick}>
        <Component {...props} />
      </div>
    );
  };
}

// Custom hook for Google Analytics tracking
export function useGoogleAnalytics() {
  const { consent } = useCookieConsent();

  const trackEvent = (action: string, parameters?: Record<string, any>) => {
    if (consent?.analytics) {
      gtag.event(action, parameters);
    }
  };

  const trackPageView = (url: string) => {
    if (consent?.analytics) {
      gtag.pageView(url);
    }
  };

  const trackQuoteRequest = (deviceType: string, repairType: string, value?: number) => {
    if (consent?.analytics) {
      gtag.quoteRequest(deviceType, repairType, value);
    }
  };

  const trackContactForm = (formType: string) => {
    if (consent?.analytics) {
      gtag.contactForm(formType);
    }
  };

  const trackPhoneCall = (phoneNumber: string) => {
    if (consent?.analytics) {
      gtag.phoneCall(phoneNumber);
    }
  };

  const trackPurchase = (transactionId: string, items: any[], value: number, currency: string = 'EUR') => {
    if (consent?.analytics) {
      gtag.purchase(transactionId, items, value, currency);
    }
  };

  return {
    trackEvent,
    trackPageView,
    trackQuoteRequest,
    trackContactForm,
    trackPhoneCall,
    trackPurchase,
    isEnabled: consent?.analytics ?? false,
  };
}
