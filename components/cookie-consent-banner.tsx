'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  Cookie, 
  Shield, 
  BarChart3, 
  Settings, 
  Target,
  X,
  Info,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useCookieConsent, type CookieConsent } from './cookie-consent-context';

export function CookieConsentBanner() {
  const { showBanner, acceptAll, rejectAll, openSettings } = useCookieConsent();

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="flex items-start space-x-3 flex-1">
            <Cookie className="h-6 w-6 text-blue-600 mt-1 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-2">
                🍪 We use cookies to enhance your experience
              </h3>
              <p className="text-sm text-gray-600">
                We use essential cookies for website functionality and optional cookies for analytics 
                and personalization. You can choose which cookies to accept.
                <a 
                  href="/privacy#cookies" 
                  className="text-blue-600 hover:underline ml-1"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Learn more in our Privacy Policy
                </a>
              </p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={rejectAll}
              className="w-full sm:w-auto"
            >
              Reject All
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={openSettings}
              className="w-full sm:w-auto"
            >
              <Settings className="h-4 w-4 mr-2" />
              Cookie Settings
            </Button>
            <Button
              size="sm"
              onClick={acceptAll}
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700"
            >
              Accept All
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function CookieSettingsModal() {
  const { 
    showSettings, 
    closeSettings, 
    acceptSelected, 
    consent 
  } = useCookieConsent();

  const [localConsent, setLocalConsent] = useState<CookieConsent>(() => ({
    necessary: true,
    analytics: consent?.analytics ?? false,
    preferences: consent?.preferences ?? false,
    marketing: consent?.marketing ?? false,
  }));

  const [expandedSections, setExpandedSections] = useState<string[]>([]);

  const toggleSection = (section: string) => {
    setExpandedSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const handleSave = () => {
    acceptSelected(localConsent);
  };

  const cookieCategories = [
    {
      id: 'necessary',
      title: 'Necessary Cookies',
      description: 'These cookies are essential for the website to function properly.',
      icon: Shield,
      required: true,
      examples: 'Session management, security, form submissions',
      details: 'Necessary cookies enable core website functionality such as security, navigation, and access to secure areas. The website cannot function properly without these cookies.'
    },
    {
      id: 'analytics',
      title: 'Analytics Cookies',
      description: 'Help us understand how visitors interact with our website.',
      icon: BarChart3,
      required: false,
      examples: 'Google Analytics, page views, user behavior',
      details: 'Analytics cookies collect information about how you use our website, such as which pages you visit most often. This helps us improve our website and understand user behavior patterns.'
    },
    {
      id: 'preferences',
      title: 'Preference Cookies',
      description: 'Remember your settings and preferences.',
      icon: Settings,
      required: false,
      examples: 'Language settings, theme preferences, form data',
      details: 'Preference cookies allow our website to remember information that changes how it behaves or looks, such as your preferred language or region.'
    },
    {
      id: 'marketing',
      title: 'Marketing Cookies',
      description: 'Used to deliver personalized advertisements.',
      icon: Target,
      required: false,
      examples: 'Ad targeting, conversion tracking, social media integration',
      details: 'Marketing cookies track your online activity to help advertisers deliver more relevant advertising or limit how many times you see an ad.'
    }
  ];

  if (!showSettings) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle className="flex items-center space-x-2">
              <Cookie className="h-6 w-6 text-blue-600" />
              <span>Cookie Preferences</span>
            </CardTitle>
            <p className="text-sm text-gray-600 mt-2">
              Manage your cookie preferences. You can enable or disable different types of cookies below.
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={closeSettings}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {cookieCategories.map((category) => {
            const Icon = category.icon;
            const isExpanded = expandedSections.includes(category.id);
            const isEnabled = localConsent[category.id as keyof CookieConsent];
            
            return (
              <div key={category.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 flex-1">
                    <Icon className="h-5 w-5 text-gray-600" />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium">{category.title}</h4>
                        {category.required && (
                          <Badge variant="secondary" className="text-xs">
                            Required
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{category.description}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={isEnabled}
                      disabled={category.required}
                      onCheckedChange={(checked) => {
                        if (!category.required) {
                          setLocalConsent(prev => ({
                            ...prev,
                            [category.id]: checked
                          }));
                        }
                      }}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleSection(category.id)}
                    >
                      {isExpanded ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
                
                {isExpanded && (
                  <div className="mt-4 pt-4 border-t space-y-2">
                    <div className="bg-gray-50 p-3 rounded">
                      <p className="text-sm text-gray-700">{category.details}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-600 mb-1">Examples:</p>
                      <p className="text-xs text-gray-500">{category.examples}</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
          
          <div className="flex items-start space-x-2 p-4 bg-blue-50 rounded-lg">
            <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">Your Privacy Rights</p>
              <p>
                You can change these settings at any time by clicking the cookie icon in our footer. 
                For more information, see our{' '}
                <a href="/privacy" className="underline hover:no-underline">
                  Privacy Policy
                </a>.
              </p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2 pt-4">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => {
                setLocalConsent({
                  necessary: true,
                  analytics: false,
                  preferences: false,
                  marketing: false
                });
              }}
            >
              Reject All Optional
            </Button>
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => {
                setLocalConsent({
                  necessary: true,
                  analytics: true,
                  preferences: true,
                  marketing: true
                });
              }}
            >
              Accept All
            </Button>
            <Button
              className="flex-1 bg-blue-600 hover:bg-blue-700"
              onClick={handleSave}
            >
              Save Preferences
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
