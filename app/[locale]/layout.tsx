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
import {NextIntlClientProvider, hasLocale} from 'next-intl';
import {notFound} from 'next/navigation';
import {routing} from '@/i18n/routing';
import Provider from "@/components/provider";
import { StructuredData } from "@/components/structured-data";
import { generateOrganizationSchema, generateLocalBusinessSchema, generateWebsiteSchema } from "@/lib/seo";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const lato=Lato({
  variable:"--font-lato",
  subsets:["latin","latin-ext"],
  weight:["100","300","400","700","900"]
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = baseMetadata;

export default  async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string; };
  
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
        <meta name="theme-color" content="#000000" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Geist+Sans:wght@100;200;300;400;500;600;700;800;900&family=Geist+Mono:wght@100;200;300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        {/* DNS Prefetch for external resources */}
        <link rel="dns-prefetch" href="//www.googletagmanager.com" />
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />
        
        {/* Preload critical resources */}
        <link rel="preload" href="/fonts/geist-sans.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
      </head>
       <script async src="https://www.googletagmanager.com/gtag/js?id=G-Q17J2K3TRC"></script>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${lato.variable} antialiased`}
      >
         <Provider>
         <NextIntlClientProvider>
        <CookieConsentProvider>
          <GoogleAnalytics />
          <Navigation />
          <Analytics />
          <main>{children}</main>
          <Footer />
          <CookieConsentBanner />
          <CookieSettingsModal />
          
          {/* Structured Data */}
          <StructuredData data={[organizationSchema, localBusinessSchema, websiteSchema]} />
        </CookieConsentProvider>
        </NextIntlClientProvider>
        </Provider>
      </body>
    </html>
  );
}
