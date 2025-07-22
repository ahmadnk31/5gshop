'use client';

// Google Analytics 4 integration with Cookie Consent
// Replace 'GA_MEASUREMENT_ID' with your actual Google Analytics Measurement ID

export const GA_MEASUREMENT_ID = 'G-Q17J2K3TRC'; // Replace with your GA4 Measurement ID

// Initialize Google Analytics with lazy loading for better performance
export function initGoogleAnalytics(measurementId: string = GA_MEASUREMENT_ID) {
  // Only load if not already loaded
  if (isGoogleAnalyticsLoaded()) {
    return;
  }

  // Use requestIdleCallback for non-critical script loading
  const loadAnalytics = () => {
    // Create and load the Google Analytics script
    const script1 = document.createElement('script');
    script1.async = true;
    script1.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    document.head.appendChild(script1);

    // Initialize gtag with consent mode
    const script2 = document.createElement('script');
    script2.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      
      // Configure default consent state (denied until user consents)
      gtag('consent', 'default', {
        'analytics_storage': 'denied',
        'ad_storage': 'denied',
        'ad_user_data': 'denied',
        'ad_personalization': 'denied',
        'functionality_storage': 'denied',
        'personalization_storage': 'denied',
        'security_storage': 'granted'
      });
      
      // Configure Google Analytics
      gtag('config', '${measurementId}', {
        page_title: document.title,
        page_location: window.location.href,
        anonymize_ip: true,
        send_page_view: false // Don't auto-send page views
      });
    `;
    document.head.appendChild(script2);
  };

  // Load analytics when the browser is idle or after 3 seconds
  if ('requestIdleCallback' in window) {
    requestIdleCallback(loadAnalytics, { timeout: 3000 });
  } else {
    setTimeout(loadAnalytics, 3000);
  }
}

// Update consent based on user preferences
export function updateGoogleAnalyticsConsent(consent: {
  analytics: boolean;
  marketing: boolean;
  preferences: boolean;
}) {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('consent', 'update', {
      'analytics_storage': consent.analytics ? 'granted' : 'denied',
      'ad_storage': consent.marketing ? 'granted' : 'denied',
      'ad_user_data': consent.marketing ? 'granted' : 'denied',
      'ad_personalization': consent.marketing ? 'granted' : 'denied',
      'functionality_storage': consent.preferences ? 'granted' : 'denied',
      'personalization_storage': consent.preferences ? 'granted' : 'denied',
    });
  }
}

// Google Analytics tracking functions
export const gtag = {
  // Track page views
  pageView: (url: string) => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('config', GA_MEASUREMENT_ID, {
        page_path: url,
        page_title: document.title,
        page_location: window.location.href,
      });
    }
  },

  // Track custom events
  event: (action: string, parameters?: Record<string, any>) => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', action, {
        event_category: 'engagement',
        event_label: parameters?.label,
        value: parameters?.value,
        ...parameters,
      });
    }
  },

  // Track ecommerce events
  purchase: (transactionId: string, items: any[], value: number, currency: string = 'EUR') => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'purchase', {
        transaction_id: transactionId,
        value: value,
        currency: currency,
        items: items,
      });
    }
  },

  // Track quote requests (custom for repair shop)
  quoteRequest: (deviceType: string, repairType: string, value?: number) => {
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
  },

  // Track contact form submissions
  contactForm: (formType: string) => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'form_submit', {
        event_category: 'contact',
        event_label: formType,
        form_type: formType,
      });
    }
  },

  // Track phone calls (for call tracking)
  phoneCall: (phoneNumber: string) => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'phone_call', {
        event_category: 'contact',
        event_label: phoneNumber,
        phone_number: phoneNumber,
      });
    }
  },

  // Track scroll depth
  scrollDepth: (percentage: number) => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'scroll', {
        event_category: 'engagement',
        event_label: `${percentage}%`,
        value: percentage,
      });
    }
  },

  // Track file downloads
  download: (fileName: string, fileType: string) => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'file_download', {
        event_category: 'download',
        event_label: fileName,
        file_name: fileName,
        file_type: fileType,
      });
    }
  },

  // Track external link clicks
  externalLink: (url: string, linkText: string) => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'click', {
        event_category: 'external_link',
        event_label: linkText,
        link_url: url,
      });
    }
  }
};

// Enhanced ecommerce tracking for repair shop
export const ecommerce = {
  // View item (service/product page)
  viewItem: (itemId: string, itemName: string, category: string, value: number) => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'view_item', {
        currency: 'EUR',
        value: value,
        items: [{
          item_id: itemId,
          item_name: itemName,
          category: category,
          price: value,
          quantity: 1,
        }]
      });
    }
  },

  // Add to cart (quote request)
  addToCart: (itemId: string, itemName: string, category: string, value: number) => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'add_to_cart', {
        currency: 'EUR',
        value: value,
        items: [{
          item_id: itemId,
          item_name: itemName,
          category: category,
          price: value,
          quantity: 1,
        }]
      });
    }
  },

  // Begin checkout (quote confirmation)
  beginCheckout: (items: any[], value: number) => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'begin_checkout', {
        currency: 'EUR',
        value: value,
        items: items,
      });
    }
  },

  // Purchase completion
  purchase: (transactionId: string, items: any[], value: number, tax?: number, shipping?: number) => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'purchase', {
        transaction_id: transactionId,
        currency: 'EUR',
        value: value,
        tax: tax || 0,
        shipping: shipping || 0,
        items: items,
      });
    }
  }
};

// Utility function to check if Google Analytics is loaded
export function isGoogleAnalyticsLoaded(): boolean {
  return typeof window !== 'undefined' && 
         typeof (window as any).gtag === 'function' &&
         typeof (window as any).dataLayer !== 'undefined';
}

// Get Google Analytics client ID (useful for cross-platform tracking)
export function getGoogleAnalyticsClientId(): Promise<string | null> {
  return new Promise((resolve) => {
    if (!isGoogleAnalyticsLoaded()) {
      resolve(null);
      return;
    }

    (window as any).gtag('get', GA_MEASUREMENT_ID, 'client_id', (clientId: string) => {
      resolve(clientId);
    });
  });
}
