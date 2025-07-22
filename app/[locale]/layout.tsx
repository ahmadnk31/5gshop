import type { Metadata } from "next";
import { Geist, Geist_Mono,Lato } from "next/font/google";
import "../globals.css";
import { Analytics } from "@vercel/analytics/next"
import { baseMetadata } from "@/lib/seo";

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
  display: 'swap', // Add font-display swap for better performance
  preload: false, // Disable preload to improve initial load
});

const lato = Lato({
  variable: "--font-lato",
  subsets: ["latin"], // Remove latin-ext to reduce load
  weight: ["400", "700"], // Reduce font weights to essential ones only
  display: 'swap',
  preload: false,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: 'swap',
  preload: false,
});

export const metadata: Metadata = baseMetadata;

export default  async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string; }>;
  
}>) {
   const {locale} = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  // Generate structured data
  const organizationSchema = generateOrganizationSchema();
  const localBusinessSchema = generateLocalBusinessSchema();
  const websiteSchema = generateWebsiteSchema();

  return (
    <html lang={locale}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#16A34A" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        
        
        
        {/* Optimized font loading */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* DNS Prefetch for external resources - only essential ones */}
        <link rel="dns-prefetch" href="//www.googletagmanager.com" />
        
        {/* Remove duplicate Google Analytics script - will be loaded by component */}
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
          </AccessibilityProvider>
          
          {/* Structured Data */}
          <StructuredData data={[organizationSchema, localBusinessSchema, websiteSchema]} />
        </CookieConsentProvider>
        </NextIntlClientProvider>
        </Provider>
      </body>
    </html>
  );
}
