'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface CookieConsent {
  necessary: boolean;
  analytics: boolean;
  preferences: boolean;
  marketing: boolean;
}

interface CookieConsentContextType {
  consent: CookieConsent | null;
  showBanner: boolean;
  acceptAll: () => void;
  acceptSelected: (consent: CookieConsent) => void;
  rejectAll: () => void;
  openSettings: () => void;
  closeSettings: () => void;
  showSettings: boolean;
}

const CookieConsentContext = createContext<CookieConsentContextType | undefined>(undefined);

const defaultConsent: CookieConsent = {
  necessary: true, // Always required
  analytics: false,
  preferences: false,
  marketing: false,
};

export function CookieConsentProvider({ children }: { children: React.ReactNode }) {
  const [consent, setConsent] = useState<CookieConsent | null>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    // Check if consent has been given before
    const savedConsent = localStorage.getItem('cookie-consent');
    if (savedConsent) {
      try {
        const parsedConsent = JSON.parse(savedConsent);
        setConsent(parsedConsent);
        setShowBanner(false);
      } catch (error) {
        console.error('Error parsing saved consent:', error);
        setShowBanner(true);
      }
    } else {
      // Show banner if no consent has been given
      setShowBanner(true);
    }
  }, []);

  const saveConsent = (newConsent: CookieConsent) => {
    setConsent(newConsent);
    localStorage.setItem('cookie-consent', JSON.stringify(newConsent));
    localStorage.setItem('cookie-consent-date', new Date().toISOString());
    setShowBanner(false);
    setShowSettings(false);

    // Apply consent settings
    applyConsentSettings(newConsent);
  };

  const applyConsentSettings = (consent: CookieConsent) => {
    // Apply Google Analytics Consent Mode v2
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

    // Preferences cookies are handled client-side for UI preferences
    if (consent.preferences) {
      // Enable preference cookies (theme, language, etc.)
      localStorage.setItem('preferences-enabled', 'true');
    } else {
      // Clean up preference cookies if disabled
      localStorage.removeItem('preferences-enabled');
    }
  };

  const acceptAll = () => {
    const fullConsent: CookieConsent = {
      necessary: true,
      analytics: true,
      preferences: true,
      marketing: true,
    };
    saveConsent(fullConsent);
  };

  const acceptSelected = (selectedConsent: CookieConsent) => {
    // Ensure necessary cookies are always enabled
    const finalConsent = {
      ...selectedConsent,
      necessary: true,
    };
    saveConsent(finalConsent);
  };

  const rejectAll = () => {
    saveConsent(defaultConsent);
  };

  const openSettings = () => {
    setShowSettings(true);
  };

  const closeSettings = () => {
    setShowSettings(false);
  };

  return (
    <CookieConsentContext.Provider
      value={{
        consent,
        showBanner,
        acceptAll,
        acceptSelected,
        rejectAll,
        openSettings,
        closeSettings,
        showSettings,
      }}
    >
      {children}
    </CookieConsentContext.Provider>
  );
}

export function useCookieConsent() {
  const context = useContext(CookieConsentContext);
  if (context === undefined) {
    throw new Error('useCookieConsent must be used within a CookieConsentProvider');
  }
  return context;
}
