import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getTranslations } from "next-intl/server";
import { DeviceType } from "@/lib/types";
import { DatabaseService } from "@/lib/database";
import { Link } from "@/i18n/navigation";
import { notFound } from "next/navigation";
import Image from "next/image";

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

  // Fetch models for this brand and device type
  let models: any[] = [];
  try {
    // Fetch ALL devices without pagination
    const result = await DatabaseService.getDevices({ limit: 10000 }); // Get all devices
    console.log(`[Brand Page DEBUG] Total devices: ${result.data.length}`);
    console.log(`[Brand Page DEBUG] Looking for type: ${mappedDeviceType}, brand: ${brandName}`);
    
    // Filter devices by type and brand
    models = result.data.filter((device: any) => {
      const typeMatch = device.type.toUpperCase() === mappedDeviceType;
      const brandMatch = device.brand.toLowerCase() === brandName.toLowerCase();
      return typeMatch && brandMatch;
    }).sort((a: any, b: any) => a.model.localeCompare(b.model));
    
    console.log(`[Brand Page] Brand: ${brandName}, Models found: ${models.length}`);
    if (models.length > 0) {
      console.log(`[Brand Page] First 5 models:`, models.slice(0, 5).map((m: any) => m.model));
    }
  } catch (error) {
    console.error('Error loading models:', error);
    models = [];
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

      {/* Models List */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-8 text-gray-900">
            {t('services.selectModel', { defaultValue: 'Select Your Model' })}
          </h2>
          
          {models.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
              {models.map((device: any) => {
                const modelSlug = device.model.toLowerCase().replace(/\s+/g, '-').replace(/\//g, '-');
                return (
                  <Link
                    key={device.id}
                    href={`/repairs/${deviceType}/${brand}/${modelSlug}`}
                    className="group"
                  >
                    <Card className="hover:shadow-lg py-0 transition-shadow border-gray-200 overflow-hidden h-full">
                      {device.imageUrl && (
                        <div className="relative h-48 bg-gray-100">
                          <Image
                            src={device.imageUrl}
                            alt={`${device.brand} ${device.model}`}
                            fill
                            className="object-contain p-4 group-hover:scale-105 transition-transform"
                          />
                        </div>
                      )}
                      <CardHeader>
                        <CardTitle className="text-lg font-semibold text-gray-900 group-hover:text-green-600 transition-colors">
                          {device.model}
                        </CardTitle>
                        {device.series && (
                          <Badge variant="secondary" className="text-xs mt-1">
                            {device.series}
                          </Badge>
                        )}
                        {device.description && (
                          <CardDescription className="text-sm text-gray-600 line-clamp-2 mt-2">
                            {device.description}
                          </CardDescription>
                        )}
                      </CardHeader>
                    </Card>
                  </Link>
                );
              })}
            </div>
          ) : (
            <Card className="max-w-2xl mx-auto text-center p-12">
              <p className="text-gray-600 mb-4">
                {t('services.noModels', { defaultValue: 'No models available for this brand yet.' })}
              </p>
              <Button asChild>
                <Link href="/contact">{t('services.contactUs', { defaultValue: 'Contact Us' })}</Link>
              </Button>
            </Card>
          )}
        </div>
      </section>

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
