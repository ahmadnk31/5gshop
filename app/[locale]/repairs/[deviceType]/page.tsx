import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { DeviceType } from "@/lib/types";
import { DatabaseService } from "@/lib/database";
import { Link } from "@/i18n/navigation";
import { notFound } from "next/navigation";
import Image from "next/image";

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

  // Fetch devices and extract unique brands for this device type
  let brands: { brand: string; count: number; imageUrl?: string }[] = [];
  try {
    // Fetch ALL devices without pagination
    const result = await DatabaseService.getDevices({ limit: 10000 }); // Get all devices
    console.log(`[DEBUG] Total devices from DB: ${result.data.length}`);
    console.log(`[DEBUG] Looking for type: ${mappedDeviceType}`);
    
    // Filter devices by type
    const filteredDevices = result.data.filter((device: any) => {
      return device.type.toUpperCase() === mappedDeviceType;
    });
    
    console.log(`[DEBUG] Filtered devices count: ${filteredDevices.length}`);
    console.log(`[DEBUG] Sample devices:`, filteredDevices.slice(0, 5).map((d: any) => ({ brand: d.brand, model: d.model })));
    
    // Group by brand - extract brand from full product name if needed
    const brandMap = new Map<string, { count: number; imageUrl?: string; models: Set<string> }>();
    
    filteredDevices.forEach((device: any) => {
      // Extract the actual brand name from the model string
      // Examples: "iPhone 8" -> brand should be "Apple", "Samsung Galaxy S21" -> brand should be "Samsung"
      let brandName = device.brand;
      
      // If brand and model are the same or model contains brand, use just the brand
      if (device.model.startsWith(device.brand)) {
        brandName = device.brand;
      }
      
      const existing = brandMap.get(brandName) || { count: 0, imageUrl: undefined, models: new Set() };
      existing.models.add(device.model); // Track unique models
      
      brandMap.set(brandName, {
        count: existing.models.size, // Count unique models
        imageUrl: existing.imageUrl || device.imageUrl,
        models: existing.models
      });
    });
    
    brands = Array.from(brandMap.entries()).map(([brand, data]) => ({
      brand,
      count: data.count,
      imageUrl: data.imageUrl
    })).sort((a, b) => a.brand.localeCompare(b.brand));
    
    console.log(`[Repairs Page] Device Type: ${mappedDeviceType}, Brands found:`, brands.map(b => `${b.brand} (${b.count} models)`));
  } catch (error) {
    console.error('Error loading devices:', error);
    brands = [];
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

      {/* Brands List */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-8 text-gray-900">
            {t('services.selectBrand', { defaultValue: 'Select Your Brand' })}
          </h2>
          
          {brands.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {brands.map((brandData) => {
                const brandSlug = brandData.brand.toLowerCase().replace(/\s+/g, '-');
                return (
                  <Link
                    key={brandData.brand}
                    href={`/repairs/${deviceType}/${brandSlug}`}
                    className="group"
                  >
                    <Card className="hover:shadow-lg py-0 transition-shadow border-gray-200 overflow-hidden h-full">
                      {brandData.imageUrl && (
                        <div className="relative h-40 bg-gray-100">
                          <Image
                            src={brandData.imageUrl}
                            alt={brandData.brand}
                            fill
                            className="object-contain p-4 group-hover:scale-105 transition-transform"
                          />
                        </div>
                      )}
                      <CardHeader className="text-center">
                        <CardTitle className="text-xl font-semibold text-gray-900 group-hover:text-green-600 transition-colors">
                          {brandData.brand}
                        </CardTitle>
                        <CardDescription className="text-sm text-gray-600">
                          {brandData.count} {brandData.count === 1 ? 'model' : 'models'}
                        </CardDescription>
                      </CardHeader>
                    </Card>
                  </Link>
                );
              })}
            </div>
          ) : (
            <Card className="max-w-2xl mx-auto text-center p-12">
              <p className="text-gray-600 mb-4">
                {t('services.noBrands', { defaultValue: 'No brands available for this device type yet.' })}
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
