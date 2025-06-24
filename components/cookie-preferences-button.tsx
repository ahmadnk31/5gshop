'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Cookie } from 'lucide-react';
import { useCookieConsent } from './cookie-consent-context';

export function CookiePreferencesButton() {
  const { openSettings, consent } = useCookieConsent();

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={openSettings}
      className="flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      aria-label="Manage Cookie Preferences"
      data-testid="cookie-preferences-button"
      data-track-event="cookie_preferences_button_click"
      data-track-event-category="cookie_preferences"
      data-track-event-action="click"
      data-track-event-label="Cookie Preferences Button"
      data-track-event-value={consent ? 'consented' : 'not_consented'}
      data-track-event-noninteraction="true"
      data-track-event-transport="beacon"
      data-track-event-async="true"
      title="Manage Cookie Preferences"
    >
      <Cookie className="h-4 w-4 mr-2" />
      <span className="hidden sm:inline">Cookie Preferences</span>
      <span className="sm:hidden">Cookies</span>
      {consent && (
        <span className="ml-2 w-2 h-2 bg-green-400 rounded-full"></span>
      )}
    </Button>
  );
}
