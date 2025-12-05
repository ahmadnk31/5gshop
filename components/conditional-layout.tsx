"use client";

import { usePathname } from "next/navigation";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { CookieConsentBanner } from "@/components/cookie-consent-banner";

export function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname?.includes("/auth") || false;

  return (
    <>
      {!isAuthPage && <Navigation />}
      {children}
      {!isAuthPage && <Footer />}
      {!isAuthPage && <CookieConsentBanner />}
    </>
  );
}

