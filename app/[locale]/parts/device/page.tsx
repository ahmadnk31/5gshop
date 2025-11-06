import { notFound, redirect } from 'next/navigation';
import { DeviceType } from '@/lib/types';
import PartsPageClient from '../page-client';
import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';

type PageProps = {
  params: Promise<{ locale: string; deviceType: string }>;
  searchParams: Promise<{ brand?: string; model?: string }>;
};

// Valid device type slugs
const DEVICE_TYPE_SLUGS: Record<string, DeviceType> = {
  'smartphone': 'SMARTPHONE',
  'tablet': 'TABLET',
  'laptop': 'LAPTOP',
  'smartwatch': 'SMARTWATCH',
  'desktop': 'DESKTOP',
  'gaming-console': 'GAMING_CONSOLE',
  'other': 'OTHER',
};

// Reverse mapping for slugs
const DEVICE_TYPE_TO_SLUG: Record<DeviceType, string> = {
  SMARTPHONE: 'smartphone',
  TABLET: 'tablet',
  LAPTOP: 'laptop',
  SMARTWATCH: 'smartwatch',
  DESKTOP: 'desktop',
  GAMING_CONSOLE: 'gaming-console',
  OTHER: 'other',
};

const DEVICE_DISPLAY_NAMES: Record<DeviceType, string> = {
  SMARTPHONE: 'Smartphones',
  TABLET: 'Tablets',
  LAPTOP: 'Laptops',
  SMARTWATCH: 'Smart Watches',
  DESKTOP: 'Desktops',
  GAMING_CONSOLE: 'Gaming Consoles',
  OTHER: 'Other Devices',
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, deviceType } = await params;
  const normalizedType = DEVICE_TYPE_SLUGS[deviceType.toLowerCase()];
  
  if (!normalizedType) {
    return {
      title: 'Parts Not Found',
    };
  }

  const displayName = DEVICE_DISPLAY_NAMES[normalizedType];
  
  return {
    title: `${displayName} Parts & Accessories - 5gphones Leuven`,
    description: `Browse our selection of high-quality ${displayName.toLowerCase()} parts and accessories. Replacement screens, batteries, cameras, and more with warranty.`,
    keywords: [
      displayName,
      `${displayName} parts`,
      `${displayName} accessories`,
      `${displayName} repair`,
      'replacement parts',
      'Leuven',
      '5gphones'
    ],
    openGraph: {
      title: `${displayName} Parts & Accessories`,
      description: `Shop high-quality ${displayName.toLowerCase()} parts and accessories at 5gphones Leuven`,
      type: 'website',
      locale: locale,
    },
    alternates: {
      canonical: `/${locale}/parts/${deviceType}`,
      languages: {
        en: `/en/parts/${deviceType}`,
        nl: `/nl/parts/${deviceType}`,
      },
    },
  };
}

export default async function DeviceTypePartsPage({ params, searchParams }: PageProps) {
  const { locale, deviceType } = await params;
  const { brand, model } = await searchParams;
  
  // Normalize the device type slug to the enum value
  const normalizedType = DEVICE_TYPE_SLUGS[deviceType.toLowerCase()];
  
  // If device type is invalid, return 404
  if (!normalizedType) {
    notFound();
  }

  // Render the client component with the device type as a query parameter
  // We'll need to modify PartsPageClient to accept initialFilters prop
  return <PartsPageClient initialType={normalizedType} initialBrand={brand} initialModel={model} />;
}

// Generate static params for all device types
export async function generateStaticParams() {
  return Object.keys(DEVICE_TYPE_SLUGS).map((slug) => ({
    deviceType: slug,
  }));
}
