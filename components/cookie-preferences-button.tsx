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
      className="text-gray-300 bg-transparent border-gray-700 hover:bg-gray-800 hover:text-green-400 hover:border-green-400 focus:ring-green-500 focus:ring-offset-gray-900 dark:border-gray-700 dark:hover:bg-gray-800"
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
      <Cookie className="h-4 w-4" />
      <span className="hidden sm:inline">Cookie Preferences</span>
      <span className="sm:hidden">Cookies</span>
      {consent && (
        <span className="w-2 h-2 bg-green-400 rounded-full"></span>
      )}
    </Button>
  );
}
