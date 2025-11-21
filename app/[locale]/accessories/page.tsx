import AccessoriesPagePaginated from "./page-paginated";
import { Metadata } from "next";
import { getTranslations } from 'next-intl/server';

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'accessories' });
  
  const siteName = '5G Phones';
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.5gphones.be';
  
  // Get localized metadata
  const title = t('meta.title');
  const description = t('meta.description');
  const keywords = t('meta.keywords');

  return {
    title: `${title} | ${siteName}`,
    description: description,
    keywords: keywords,
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
      canonical: `${siteUrl}/${locale}/accessories`,
      languages: {
        'en': `${siteUrl}/en/accessories`,
        'nl': `${siteUrl}/nl/accessories`,
        'fr': `${siteUrl}/fr/accessories`,
        'x-default': `${siteUrl}/en/accessories`
      }
    }
  };
}

// Removed Suspense wrapper - loading.tsx handles initial load
// This prevents double skeleton animations
export default AccessoriesPagePaginated;
