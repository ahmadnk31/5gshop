'use client';

import dynamic from 'next/dynamic';

// Dynamically import GoogleAnalytics with no SSR to prevent build errors
const GoogleAnalytics = dynamic(() => import('./google-analytics').then(mod => ({ default: mod.GoogleAnalytics })), {
  ssr: false,
  loading: () => null
});

export { GoogleAnalytics };
