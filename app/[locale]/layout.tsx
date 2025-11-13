import type { Metadata } from "next";
import { Inter, Roboto, Poppins } from "next/font/google";
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
import { TawkToChat } from "@/components/tawk-to-chat";
import { QueryProvider } from "@/components/providers/query-provider";
import { MicrodataLocalBusiness } from "@/components/microdata-local-business";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: 'swap',
  preload: true,
  fallback: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
});

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["400", "500", "700"], // OPTIMIZED: Reduced from 5 to 3 weights
  display: 'swap',
  preload: false,
  fallback: ['Arial', 'sans-serif'],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "600", "700"], // OPTIMIZED: Reduced from 7 to 3 weights
  display: 'swap',
  preload: false,
  fallback: ['Arial', 'sans-serif'],
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
    <html lang={locale} className="light" style={{ colorScheme: 'light' }}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#16A34A" />
        <meta name="color-scheme" content="light" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        
       
        {/* Hreflang for international SEO */}
        <link rel="alternate" hrefLang="en" href="https://5gphones.be/en" />
        <link rel="alternate" hrefLang="nl" href="https://5gphones.be/nl" />
        <link rel="alternate" hrefLang="fr" href="https://5gphones.be/fr" />
        <link rel="alternate" hrefLang="x-default" href="https://5gphones.be/en" />
        
        {/* OPTIMIZED: High-priority preconnect for fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* OPTIMIZED: Strategic resource hints for Speed Index */}
        <link rel="dns-prefetch" href="//www.googletagmanager.com" />
        <link rel="dns-prefetch" href="//www.google-analytics.com" />
        <link rel="dns-prefetch" href="//tire-files.s3.us-east-1.amazonaws.com" />
        <link rel="dns-prefetch" href="//dl8rlqtc6lw1l.cloudfront.net" />
        <link rel="dns-prefetch" href="//embed.tawk.to" />
        
        {/* LCP OPTIMIZATION: Preload hero image for faster LCP */}
        <link
          rel="preload"
          as="image"
          href="/logo.svg"
          fetchPriority="high"
        />
        
        {/* Additional Open Graph meta tags for better Facebook compatibility */}
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:site_name" content="5GPhones Fix" />
        <meta property="og:image:alt" content="5gphones Fix Leuven - Phone Repair & Mobile Accessories | GSM Reparatie | iPad Reparatie | MacBook Air Herstel | iPad Scherm Vervangen | Smartphone Herstellingen | Phone Repair Leuven | Laptop Repair | iPad Repair | MacBook Reparatie" />


      </head>
      <body
        className={`${inter.variable} ${roboto.variable} ${poppins.variable} antialiased !bg-white !text-gray-900`}
        style={{ backgroundColor: '#FFFFFF', color: '#111827' }}
      >
         <Provider>
         <QueryProvider>
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
            
          </AccessibilityProvider>
          
          {/* Structured Data - JSON-LD */}
          <StructuredData data={[structuredData.organization, structuredData.localBusiness, structuredData.website]} />
          
          {/* Microdata - HTML attributes for search engines */}
          <MicrodataLocalBusiness />
          
          {/* Tawk.to Chat Widget */}
          <TawkToChat />
        </CookieConsentProvider>
        </NextIntlClientProvider>
        </QueryProvider>
        </Provider>
      </body>
    </html>
  );
}
