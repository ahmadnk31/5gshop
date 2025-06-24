'use client';

import { useEffect } from 'react';
import { useAnalytics, usePreferences, useMarketing } from '@/hooks/use-cookies';
import { useCookieConsent } from '@/components/cookie-consent-context';

export function ExampleCookieUsage() {
  const { trackEvent, trackPageView, analyticsEnabled } = useAnalytics();
  const { setPreference, getPreference, preferencesEnabled } = usePreferences();
  const { trackConversion, marketingEnabled } = useMarketing();

  useEffect(() => {
    // Track page view only if analytics are enabled
    if (analyticsEnabled) {
      trackPageView(window.location.pathname);
    }

    // Load user preferences only if preference cookies are enabled
    if (preferencesEnabled) {
      const savedTheme = getPreference('theme', 'light');
      if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
      }
    }
  }, [analyticsEnabled, preferencesEnabled, trackPageView, getPreference]);

  const handleButtonClick = () => {
    // Track user interaction
    trackEvent('button_click', {
      button_name: 'example_button',
      page: window.location.pathname
    });
  };

  const handleThemeChange = (theme: string) => {
    // Save theme preference
    if (preferencesEnabled) {
      setPreference('theme', theme);
      document.documentElement.setAttribute('data-theme', theme);
    }
  };

  const handlePurchase = () => {
    // Track conversion for marketing
    if (marketingEnabled) {
      trackConversion('purchase', {
        value: 299,
        currency: 'EUR',
        transaction_id: 'order_12345'
      });
    }
  };

  return (
    <div className="p-4 space-y-4">
      <h3 className="font-bold">Cookie Usage Examples</h3>
      
      <div className="space-y-2">
        <p><strong>Analytics:</strong> {analyticsEnabled ? '✅ Enabled' : '❌ Disabled'}</p>
        <p><strong>Preferences:</strong> {preferencesEnabled ? '✅ Enabled' : '❌ Disabled'}</p>
        <p><strong>Marketing:</strong> {marketingEnabled ? '✅ Enabled' : '❌ Disabled'}</p>
      </div>

      <div className="space-x-2">
        <button 
          onClick={handleButtonClick}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Track Click Event
        </button>
        
        <button 
          onClick={() => handleThemeChange('dark')}
          className="px-4 py-2 bg-gray-800 text-white rounded"
        >
          Set Dark Theme
        </button>
        
        <button 
          onClick={handlePurchase}
          className="px-4 py-2 bg-green-500 text-white rounded"
        >
          Track Purchase
        </button>
      </div>
    </div>
  );
}

// Example: Using Google Analytics with consent
export function GoogleAnalyticsExample() {
  const { consent } = useCookieConsent();

  useEffect(() => {
    // Only load GA if user hasn't made a decision yet or has consented
    if (!consent || consent.analytics) {
      // Initialize Google Analytics
      const script = document.createElement('script');
      script.src = 'https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID';
      script.async = true;
      document.head.appendChild(script);

      const configScript = document.createElement('script');
      configScript.innerHTML = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        
        // Set default consent state
        gtag('consent', 'default', {
          'analytics_storage': '${consent?.analytics ? 'granted' : 'denied'}',
          'ad_storage': '${consent?.marketing ? 'granted' : 'denied'}'
        });
        
        gtag('config', 'GA_MEASUREMENT_ID');
      `;
      document.head.appendChild(configScript);

      return () => {
        document.head.removeChild(script);
        document.head.removeChild(configScript);
      };
    }
  }, [consent]);

  return null;
}
