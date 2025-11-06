import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { DeviceType } from "@/lib/types";
import { getBrandsByType } from "@/app/actions/device-catalog-actions";
import { Link } from "@/i18n/navigation";
import { notFound } from "next/navigation";
import Image from "next/image";
import { prisma } from "@/lib/database";

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';
export const revalidate = 0;

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

  // Fetch brands with model counts for this device type
  let brands: { brand: string; count: number; imageUrl?: string }[] = [];
  try {
    console.log(`[Repairs Page] Fetching brands for device type: ${mappedDeviceType}`);
    
    // Get distinct brands with their device count with timeout
    const devicesWithBrands = await Promise.race([
      prisma.device.groupBy({
        by: ['brand'],
        where: {
          type: mappedDeviceType,
        },
        _count: {
          id: true,
        },
        orderBy: {
          brand: 'asc',
        },
      }),
      new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error('Database query timeout')), 10000)
      )
    ]);

    console.log(`[Repairs Page] Device Type: ${mappedDeviceType}, Brands found:`, devicesWithBrands.length);

    // Get image URL for each brand (first device image) with timeout
    const brandsWithImages = await Promise.race([
      Promise.all(
        devicesWithBrands.map(async (brandGroup) => {
          try {
            const firstDevice = await prisma.device.findFirst({
              where: {
                type: mappedDeviceType,
                brand: brandGroup.brand,
              },
              select: {
                imageUrl: true,
              },
            });

            return {
              brand: brandGroup.brand,
              count: brandGroup._count.id,
              imageUrl: firstDevice?.imageUrl || undefined,
            };
          } catch (err) {
            console.error(`[Repairs Page] Error fetching image for brand ${brandGroup.brand}:`, err);
            return {
              brand: brandGroup.brand,
              count: brandGroup._count.id,
              imageUrl: undefined,
            };
          }
        })
      ),
      new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error('Image fetch timeout')), 15000)
      )
    ]);

    brands = brandsWithImages;
    console.log(`[Repairs Page] Successfully loaded ${brands.length} brands with images`);
  } catch (error) {
    console.error('[Repairs Page] Error loading brands:', error);
    console.error('[Repairs Page] Error details:', {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      deviceType: mappedDeviceType,
    });
    // Return empty array instead of throwing to show "No brands" message
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
                    <Card className="hover:shadow-lg pt-0 transition-shadow border-gray-200 overflow-hidden h-full">
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
