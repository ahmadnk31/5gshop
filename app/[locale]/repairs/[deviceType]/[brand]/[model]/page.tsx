import { Button } from "@/components/ui/button";
import { getTranslations } from "next-intl/server";
import { DeviceType } from "@/lib/types";
import { Link } from "@/i18n/navigation";
import { notFound } from "next/navigation";
import ModelRepairClient from "./page-client";

// Enable ISR with revalidation
export const revalidate = 300;

type PageProps = {
  params: Promise<{ locale: string; deviceType: string; brand: string; model: string }>;
};

const deviceTypeMap: Record<string, DeviceType> = {
  'smartphone': 'SMARTPHONE',
  'tablet': 'TABLET',
  'laptop': 'LAPTOP',
  'smartwatch': 'SMARTWATCH',
  'desktop': 'DESKTOP',
  'gaming-console': 'GAMING_CONSOLE',
};

export default async function ModelRepairPage({ params }: PageProps) {
  const { locale, deviceType, brand, model } = await params;
  const t = await getTranslations('repairs');

  // Map URL param to DeviceType
  const mappedDeviceType = deviceTypeMap[deviceType];
  
  if (!mappedDeviceType) {
    notFound();
  }

  // Convert slugs back to proper case
  const brandName = brand.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
  
  const modelName = model.split('-').map(word => 
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
          <nav className="flex items-center space-x-2 text-sm flex-wrap">
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
            <Link href={`/repairs/${deviceType}/${brand}`} className="text-gray-600 hover:text-green-600">
              {brandName}
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 font-medium">{modelName}</span>
          </nav>
        </div>
      </section>

      {/* Device Details, Parts, and Services - Client Component */}
      <ModelRepairClient 
        deviceType={deviceType}
        deviceTypeEnum={mappedDeviceType}
        brand={brand}
        model={model}
        brandName={brandName}
        modelName={modelName}
      />

      {/* CTA Section */}
      <section className="py-12 bg-gradient-to-br from-green-600 to-green-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-3">
            {t('cta.title', { defaultValue: 'Ready to Fix Your Device?' })}
          </h2>
          <p className="text-lg text-green-50 mb-6 max-w-2xl mx-auto">
            {t('cta.description', { defaultValue: 'Get a free quote and have your device repaired by certified technicians' })}
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button asChild size="lg" variant="secondary" className="shadow-lg">
              <Link href="/quote">{t('cta.button', { defaultValue: 'Get Free Quote' })}</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="bg-white/10 border-white hover:bg-white hover:text-green-700">
              <Link href="/contact">{t('cta.contact', { defaultValue: 'Contact Us' })}</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}