import { Suspense } from "react";
import AccessoriesPagePaginated from "./page-paginated";
import { Skeleton } from '@/components/ui/skeleton';
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const siteName = '5G Phones';
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.5gphones.be';
  const title = "GSM Accessoires Leuven | iPhone, MacBook, iPad, Laptop Cases & Chargers ⭐";
  const description = "⭐ GSM accessoires Leuven - iPhone hoesjes, MacBook sleeves, iPad cases, Laptop tassen, Samsung covers ✓ Screen protectors ✓ Opladers & kabels ✓ Powerbanks ✓ Draadloze oordopjes ✓ Direct op voorraad ✓ Bondgenotenlaan 84A ✓ Quality accessories for all devices!";

  return {
    title: `${title} | ${siteName}`,
    description: description,
    keywords: [
      // Primary Accessory Keywords
      "gsm accessoires leuven",
      "telefoon accessoires leuven",
      "smartphone accessoires leuven",
      "mobiel accessoires leuven",
      "phone accessories leuven",
      
      // iPhone Accessories
      "iphone hoesjes leuven",
      "iphone cases leuven",
      "iphone accessoires leuven",
      "iphone screen protector leuven",
      "iphone charger leuven",
      
      // MacBook Accessories
      "macbook accessoires leuven",
      "macbook sleeve leuven",
      "macbook case leuven",
      "macbook charger leuven",
      "macbook cover leuven",
      
      // iPad Accessories
      "ipad accessoires leuven",
      "ipad hoesjes leuven",
      "ipad cases leuven",
      "ipad cover leuven",
      "ipad keyboard leuven",
      
      // Laptop Accessories
      "laptop accessoires leuven",
      "laptop tas leuven",
      "laptop bag leuven",
      "laptop sleeve leuven",
      "laptop charger leuven",
      
      // Samsung & Android
      "samsung hoesjes leuven",
      "samsung accessoires leuven",
      "samsung cases leuven",
      "galaxy hoesjes leuven",
      "android accessoires leuven",
      
      // Tablet Accessories
      "tablet accessoires leuven",
      "tablet hoesjes leuven",
      "tablet cases leuven",
      
      // Product Types
      "telefoon hoesjes leuven",
      "smartphone hoesjes leuven",
      "screen protectors leuven",
      "scherm beschermers leuven",
      "telefoon opladers leuven",
      "phone chargers leuven",
      "usb c kabels leuven",
      "lightning kabels leuven",
      "powerbanks leuven",
      "draadloze oordopjes leuven",
      "wireless earbuds leuven",
      
      // Location-specific
      "accessoires leuven centrum",
      "gsm winkel leuven accessoires",
      "phone cases bondgenotenlaan",
      "mobile accessories leuven"
    ].join(', '),
    openGraph: {
      title: title,
      description: description,
      url: `${siteUrl}/accessories`,
      siteName: siteName,
      type: 'website',
      images: [
        {
          url: `${siteUrl}/og-accessories.jpg`,
          width: 1200,
          height: 630,
          alt: 'Phone and Device Accessories at 5G Shop'
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title: title,
      description: description,
      images: [`${siteUrl}/og-accessories.jpg`],
      creator: '@5gshop'
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
        'max-video-preview': -1
      }
    },
    alternates: {
      canonical: `${siteUrl}/accessories`,
      languages: {
        'en': `${siteUrl}/en/accessories`,
        'nl': `${siteUrl}/nl/accessories`
      }
    }
  };
}

function AccessoriesPageWithSuspense() {
  return (
    <Suspense fallback={
      <div className="flex flex-col min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="p-2">
                <Skeleton className="w-full aspect-square mb-3" />
                <Skeleton className="w-2/3 h-5 mb-2" />
                <Skeleton className="w-1/2 h-4" />
                <Skeleton className="w-full h-8 mt-2" />
              </div>
            ))}
          </div>
        </div>
      </div>
    }>
      <AccessoriesPagePaginated />
    </Suspense>
  );
}

export default AccessoriesPageWithSuspense;
