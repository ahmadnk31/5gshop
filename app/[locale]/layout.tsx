import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";

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

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "5gphones Leuven - Device Repair & Accessories",
  description: "Professional device repair services and premium accessories for all your devices",
};

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
      </head>
<script async src="https://www.googletagmanager.com/gtag/js?id=G-Q17J2K3TRC"></script>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
         <Provider>
         <NextIntlClientProvider>
        <CookieConsentProvider>
          <GoogleAnalytics />
          <Navigation />
          <main>{children}</main>
          <Footer />
          <CookieConsentBanner />
          <CookieSettingsModal />
        </CookieConsentProvider>
        </NextIntlClientProvider>
        </Provider>
      </body>
    </html>
  );
}
