import { Button } from "@/components/ui/button";
import { getTranslations } from "next-intl/server";
import { DeviceType } from "@/lib/types";
import { Link } from "@/i18n/navigation";
import { notFound } from "next/navigation";
import DeviceRepairsClient from "./page-client";

// Enable ISR with revalidation
export const revalidate = 300;

type PageProps = {
  params: Promise<{ locale: string; deviceType: string }>;
};

const deviceTypeMap: Record<string, DeviceType> = {
  'smartphone': 'SMARTPHONE',
  'tablet': 'TABLET',
  'laptop': 'LAPTOP',
  'smartwatch': 'SMARTWATCH',
  'desktop': 'DESKTOP',
  'gaming-console': 'GAMING_CONSOLE',
};

export async function generateStaticParams() {
  return [
    { deviceType: 'smartphone' },
    { deviceType: 'tablet' },
    { deviceType: 'laptop' },
    { deviceType: 'smartwatch' },
    { deviceType: 'desktop' },
    { deviceType: 'gaming-console' },
  ];
}

export default async function DeviceRepairsPage({ params }: PageProps) {
  const { locale, deviceType } = await params;
  const t = await getTranslations('repairs');

  // Map URL param to DeviceType
  const mappedDeviceType = deviceTypeMap[deviceType];
  
  if (!mappedDeviceType) {
    notFound();
  }

  const getDeviceTypeLabel = (deviceType: DeviceType) => {
    const labels: Record<DeviceType, string> = {
      'SMARTPHONE': t('deviceTypes.smartphone'),
      'TABLET': t('deviceTypes.tablet'),
      'LAPTOP': t('deviceTypes.laptop'),
      'SMARTWATCH': t('deviceTypes.smartwatch'),
      'DESKTOP': t('deviceTypes.desktop'),
      'GAMING_CONSOLE': t('deviceTypes.gamingConsole'),
      'OTHER': t('deviceTypes.other')
    };
    return labels[deviceType];
  };

  const deviceLabel = getDeviceTypeLabel(mappedDeviceType);

  // Fetch brands data on server side for SSR/ISR
  let brandsData: { brand: string; count: number; imageUrl?: string }[] = [];
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/repairs/brands?type=${mappedDeviceType}`, {
      next: { revalidate: 300 } // Cache for 5 minutes
    });
    
    if (response.ok) {
      brandsData = await response.json();
    }
  } catch (error) {
    console.error('[Server] Error fetching brands:', error);
    // Continue rendering with empty data - client will handle retry
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <section className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center space-x-2 text-sm">
            <Link href="/" className="text-gray-600 hover:text-green-600">
              {t('breadcrumb.home', { defaultValue: 'Home' })}
            </Link>
            <span className="text-gray-400">/</span>
            <Link href="/repairs" className="text-gray-600 hover:text-green-600">
              {t('breadcrumb.repairs', { defaultValue: 'Repairs' })}
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 font-medium">{deviceLabel}</span>
          </nav>
        </div>
      </section>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-green-600 to-green-700 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-3xl md:text-4xl font-bold mb-3">
              {t('devicePage.title', { device: deviceLabel, defaultValue: `${deviceLabel} Repair Services` })}
            </h1>
            <p className="text-lg text-green-50 mb-6">
              {t('devicePage.subtitle', { defaultValue: 'Professional repairs with certified technicians and quality parts' })}
            </p>
            <Button asChild size="lg" variant="secondary" className="shadow-lg">
              <Link href="/quote">{t('hero.getQuote', { defaultValue: 'Get Free Quote' })}</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Brands List - Client Component */}
      <DeviceRepairsClient 
        deviceType={deviceType}
        deviceTypeEnum={mappedDeviceType}
        deviceLabel={deviceLabel}
        initialBrands={brandsData}
      />

      {/* CTA Section */}
      <section className="py-12 bg-gradient-to-br from-green-600 to-green-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-3">
            {t('cta.title', { defaultValue: 'Ready to Fix Your Device?' })}
          </h2>
          <p className="text-lg text-green-50 mb-6 max-w-2xl mx-auto">
            {t('cta.description', { defaultValue: 'Get a free quote today and have your device repaired by certified technicians' })}
          </p>
          <Button asChild size="lg" variant="secondary" className="shadow-lg">
            <Link href="/quote">{t('cta.button', { defaultValue: 'Get Free Quote' })}</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
