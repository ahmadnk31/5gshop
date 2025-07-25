import type { Metadata } from "next";
import { Geist, Geist_Mono,Lato } from "next/font/google";
import "../globals.css";
import { Analytics } from "@vercel/analytics/next"
import { baseMetadata } from "@/lib/seo";
import { PerformanceMonitor } from "@/components/performance-monitor-wrapper";

// Add a declaration for window.dataLayer to avoid TypeScript errors
declare global {
  interface Window {
    dataLayer: any[];
  }
}
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { CookieConsentProvider } from "@/components/cookie-consent-context";
import { CookieConsentBanner, CookieSettingsModal } from "@/components/cookie-consent-banner";
import { GoogleAnalytics } from "@/components/google-analytics";
import { AccessibilityProvider } from "@/components/accessibility";
import {NextIntlClientProvider, hasLocale} from 'next-intl';
import {notFound} from 'next/navigation';
import {routing} from '@/i18n/routing';
import Provider from "@/components/provider";
import { StructuredData } from "@/components/structured-data";
import { generateOrganizationSchema, generateLocalBusinessSchema, generateWebsiteSchema } from "@/lib/seo";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: 'swap',
  preload: true, // Enable preload for critical font
  fallback: ['system-ui', 'arial'], // Add fallback fonts
});

const lato = Lato({
  variable: "--font-lato",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: 'swap',
  preload: false, // Keep secondary font as non-preload
  fallback: ['system-ui', 'arial'],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: 'swap',
  preload: false, // Mono font not critical
  fallback: ['monospace'],
});

export const metadata: Metadata = baseMetadata;

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string; }>;
  
}>) {
  const { locale } = await params;
  
  // Fast locale validation without expensive operations
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  // Pre-generate structured data to avoid runtime computation
  const structuredData = {
    organization: generateOrganizationSchema(),
    localBusiness: generateLocalBusinessSchema(), 
    website: generateWebsiteSchema()
  };

  return (
    <html lang={locale}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#16A34A" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        
        {/* Hreflang for international SEO */}
        <link rel="alternate" hrefLang="en" href="https://5gphones.be/en" />
        <link rel="alternate" hrefLang="nl" href="https://5gphones.be/nl" />
        <link rel="alternate" hrefLang="fr" href="https://5gphones.be/fr" />
        <link rel="alternate" hrefLang="x-default" href="https://5gphones.be/en" />
        
        {/* Optimized font loading - preconnect for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Resource hints for critical external resources */}
        <link rel="dns-prefetch" href="//www.googletagmanager.com" />
        <link rel="dns-prefetch" href="//tire-files.s3.us-east-1.amazonaws.com" />
        
        {/* Preload critical CSS */}
        <link rel="preload" href="/_next/static/css/app/layout.css" as="style" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${lato.variable} antialiased`}
      >
         <Provider>
         <NextIntlClientProvider>
        <CookieConsentProvider>
          <AccessibilityProvider>
            {/* Skip Link for keyboard navigation */}
            <a 
              href="#main-content" 
              className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded-md focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              Skip to main content
            </a>
            
            <GoogleAnalytics />
            <Navigation />
            <main id="main-content" role="main">{children}</main>
            <Footer />
            <CookieConsentBanner />
            <CookieSettingsModal />
            {/* Load Analytics after main content */}
            <Analytics />
            {/* Performance monitoring in development */}
            <PerformanceMonitor />
          </AccessibilityProvider>
          
          {/* Structured Data */}
          <StructuredData data={[structuredData.organization, structuredData.localBusiness, structuredData.website]} />
        </CookieConsentProvider>
        </NextIntlClientProvider>
        </Provider>
      </body>
    </html>
  );
}
