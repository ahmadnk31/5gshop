'use client';

import { useCookieConsent } from '@/components/cookie-consent-context';
import { useEffect } from 'react';

/**
 * Hook for analytics tracking with cookie consent
 */
export function useAnalytics() {
  const { consent } = useCookieConsent();

  const trackEvent = (eventName: string, parameters?: Record<string, any>) => {
    if (!consent?.analytics) return;
    
    // Google Analytics tracking
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', eventName, {
        event_category: 'engagement',
        ...parameters,
      });
    }
    
    // Add other analytics providers here
  };

  const trackPageView = (path: string) => {
    if (!consent?.analytics) return;
    
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('config', 'GA_MEASUREMENT_ID', {
        page_path: path,
        page_title: document.title,
        page_location: window.location.href,
      });
    }
  };

  const trackQuoteRequest = (deviceType: string, repairType: string, value?: number) => {
    if (!consent?.analytics) return;
    
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'generate_lead', {
        event_category: 'quote',
        event_label: `${deviceType}_${repairType}`,
        value: value,
        currency: 'EUR',
        device_type: deviceType,
        repair_type: repairType,
      });
    }
  };

  const trackContactForm = (formType: string) => {
    if (!consent?.analytics) return;
    
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'form_submit', {
        event_category: 'contact',
        event_label: formType,
        form_type: formType,
      });
    }
  };

  const trackPhoneCall = (phoneNumber: string) => {
    if (!consent?.analytics) return;
    
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'phone_call', {
        event_category: 'contact',
        event_label: phoneNumber,
        phone_number: phoneNumber,
      });
    }
  };

  return {
    trackEvent,
    trackPageView,
    trackQuoteRequest,
    trackContactForm,
    trackPhoneCall,
    analyticsEnabled: consent?.analytics ?? false
  };
}

/**
 * Hook for preference cookies
 */
export function usePreferences() {
  const { consent } = useCookieConsent();

  const setPreference = (key: string, value: string) => {
    if (!consent?.preferences) return;
    localStorage.setItem(`pref_${key}`, value);
  };

  const getPreference = (key: string, defaultValue?: string): string | null => {
    if (!consent?.preferences) return defaultValue ?? null;
    return localStorage.getItem(`pref_${key}`) ?? defaultValue ?? null;
  };

  const removePreference = (key: string) => {
    localStorage.removeItem(`pref_${key}`);
  };

  return {
    setPreference,
    getPreference,
    removePreference,
    preferencesEnabled: consent?.preferences ?? false
  };
}

/**
 * Hook for marketing/advertising cookies
 */
export function useMarketing() {
  const { consent } = useCookieConsent();

  const trackConversion = (conversionId: string, data?: Record<string, any>) => {
    if (!consent?.marketing) return;
    
    // Google Ads conversion tracking
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'conversion', {
        send_to: conversionId,
        ...data
      });
    }
  };

  const setMarketingData = (key: string, value: string) => {
    if (!consent?.marketing) return;
    localStorage.setItem(`marketing_${key}`, value);
  };

  return {
    trackConversion,
    setMarketingData,
    marketingEnabled: consent?.marketing ?? false
  };
}

/**
 * Hook to check if a specific cookie category is enabled
 */
export function useCookieCategory(category: 'necessary' | 'analytics' | 'preferences' | 'marketing') {
  const { consent } = useCookieConsent();
  
  return {
    enabled: consent?.[category] ?? false,
    consent
  };
}

/**
 * Custom hook for Google Analytics initialization
 */
export function useGoogleAnalytics(measurementId: string) {
  const { consent } = useCookieConsent();

  useEffect(() => {
    if (!measurementId) return;

    // Load Google Analytics script
    const script1 = document.createElement('script');
    script1.async = true;
    script1.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    document.head.appendChild(script1);

    const script2 = document.createElement('script');
    script2.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      
      // Initialize with denied consent
      gtag('consent', 'default', {
        'analytics_storage': 'denied',
        'ad_storage': 'denied',
        'ad_user_data': 'denied',
        'ad_personalization': 'denied'
      });
      
      gtag('config', '${measurementId}');
    `;
    document.head.appendChild(script2);

    return () => {
      // Cleanup scripts if needed
      document.head.removeChild(script1);
      document.head.removeChild(script2);
    };
  }, [measurementId]);

  // Update consent when it changes
  useEffect(() => {
    if (consent && typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('consent', 'update', {
        'analytics_storage': consent.analytics ? 'granted' : 'denied',
        'ad_storage': consent.marketing ? 'granted' : 'denied',
        'ad_user_data': consent.marketing ? 'granted' : 'denied',
        'ad_personalization': consent.marketing ? 'granted' : 'denied'
      });
    }
  }, [consent]);
}
