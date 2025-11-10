import { Button } from "@/components/ui/button";
import { getTranslations } from "next-intl/server";
import { DeviceType } from "@/lib/types";
import { Link } from "@/i18n/navigation";
import { notFound } from "next/navigation";
import BrandModelsClient from "./page-client";

// Enable ISR with revalidation
export const revalidate = 300;

type PageProps = {
  params: Promise<{ locale: string; deviceType: string; brand: string }>;
};

const deviceTypeMap: Record<string, DeviceType> = {
  'smartphone': 'SMARTPHONE',
  'tablet': 'TABLET',
  'laptop': 'LAPTOP',
  'smartwatch': 'SMARTWATCH',
  'desktop': 'DESKTOP',
  'gaming-console': 'GAMING_CONSOLE',
};

export default async function BrandModelsPage({ params }: PageProps) {
  const { locale, deviceType, brand } = await params;
  const t = await getTranslations('repairs');

  // Map URL param to DeviceType
  const mappedDeviceType = deviceTypeMap[deviceType];
  
  if (!mappedDeviceType) {
    notFound();
  }

  // Convert brand slug back to proper case
  const brandName = brand.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');

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
            <Link href={`/repairs/${deviceType}`} className="text-gray-600 hover:text-green-600">
              {deviceLabel}
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 font-medium">{brandName}</span>
          </nav>
        </div>
      </section>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-green-600 to-green-700 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-3xl md:text-4xl font-bold mb-3">
              {brandName} {deviceLabel} Repairs
            </h1>
            <p className="text-lg text-green-50 mb-6">
              {t('brandPage.subtitle', { defaultValue: 'Select your model to see repair options' })}
            </p>
          </div>
        </div>
      </section>

      {/* Models List - Client Component */}
      <BrandModelsClient 
        deviceType={deviceType}
        deviceTypeEnum={mappedDeviceType}
        brand={brand}
        brandName={brandName}
      />

      {/* CTA Section */}
      <section className="py-12 bg-gradient-to-br from-green-600 to-green-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-3">
            {t('cta.needHelp', { defaultValue: 'Need Help Finding Your Model?' })}
          </h2>
          <p className="text-lg text-green-50 mb-6 max-w-2xl mx-auto">
            {t('cta.contactDescription', { defaultValue: 'Contact us and we\'ll help you identify your device' })}
          </p>
          <Button asChild size="lg" variant="secondary" className="shadow-lg">
            <Link href="/contact">{t('cta.contactButton', { defaultValue: 'Contact Us' })}</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
