import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, ShoppingCart, ChevronRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { DeviceType } from "@/lib/types";
import { getPartsByDeviceModel } from "@/app/actions/device-catalog-actions";
import { formatCurrency } from "@/lib/utils";
import { Link } from "@/i18n/navigation";
import { notFound } from "next/navigation";
import Image from "next/image";
import { prisma } from "@/lib/database";

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';
export const revalidate = 0;

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

// Helper function to create slug from name and ID
function createSlug(name: string, id: string): string {
  const nameSlug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return `${nameSlug}-${id}`;
}

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

  // Find the specific device
  let device: any = null;
  let parts: any[] = [];
  
  try {
    console.log(`[Model Page] Searching for device: ${mappedDeviceType} ${brandName} ${modelName}`);
    
    // Find device by type, brand, and model with timeout
    device = await Promise.race([
      prisma.device.findFirst({
        where: {
          type: mappedDeviceType,
          brand: {
            equals: brandName,
            mode: 'insensitive',
          },
          OR: [
            {
              model: {
                equals: modelName,
                mode: 'insensitive',
              },
            },
            {
              model: {
                contains: model.replace(/-/g, ' '),
                mode: 'insensitive',
              },
            },
          ],
        },
      }),
      new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error('Device query timeout')), 10000)
      )
    ]);
    
    if (device) {
      console.log(`[Model Page] Found device: ${device.model}`);
      
      // Fetch parts for this specific device model with timeout
      try {
        parts = await Promise.race([
          getPartsByDeviceModel(mappedDeviceType, brandName, device.model),
          new Promise<never>((_, reject) => 
            setTimeout(() => reject(new Error('Parts query timeout')), 15000)
          )
        ]);
        console.log(`[Model Page] Device: ${device.model}, Parts found: ${parts.length}`);
      } catch (error) {
        console.error('[Model Page] Error loading parts:', error);
        console.error('[Model Page] Parts error details:', {
          message: error instanceof Error ? error.message : String(error),
          deviceModel: device.model,
        });
        parts = [];
      }
    } else {
      console.log(`[Model Page] Device not found for: ${mappedDeviceType} ${brandName} ${modelName}`);
    }
  } catch (error) {
    console.error('[Model Page] Error loading device:', error);
    console.error('[Model Page] Device error details:', {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      deviceType: mappedDeviceType,
      brand: brandName,
      model: modelName,
    });
  }

  if (!device) {
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
            <span className="text-gray-900 font-medium">{device.model}</span>
          </nav>
        </div>
      </section>

      {/* Device Info Section */}
      <section className="relative bg-gradient-to-br from-green-600 to-green-700 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-8 items-center max-w-5xl mx-auto">
            {device.imageUrl && (
              <div className="relative h-64 w-64 bg-white/10 rounded-xl p-4 flex-shrink-0">
                <Image
                  src={device.imageUrl}
                  alt={`${device.brand} ${device.model}`}
                  fill
                  className="object-contain"
                />
              </div>
            )}
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold mb-3">
                {device.brand} {device.model}
              </h1>
              {device.series && (
                <Badge variant="secondary" className="mb-4">
                  {device.series}
                </Badge>
              )}
              {device.description && (
                <p className="text-lg text-green-50 mb-6">
                  {device.description}
                </p>
              )}
              <div className="flex gap-4">
                <Button asChild size="lg" variant="secondary" className="shadow-lg">
                  <Link href={`/quote?device=${device.id}`}>
                    {t('hero.getQuote', { defaultValue: 'Get Free Quote' })}
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Parts List */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-8 text-gray-900">
            {t('parts.availableParts', { defaultValue: 'Available Parts & Accessories' })}
          </h2>
          
          {parts.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {parts.map((part: any) => {
                const partSlug = createSlug(part.name, part.id);
                return (
                <Link key={part.id} href={`/parts/${partSlug}`} className="group">
                  <Card className="hover:shadow-lg transition-shadow border-gray-200 flex flex-col h-full">
                    <CardHeader className="flex-shrink-0">
                      {part.imageUrl && (
                        <div className="relative h-48 bg-gray-100 rounded-lg mb-3 overflow-hidden">
                          <Image
                            src={part.imageUrl}
                            alt={part.name}
                            fill
                            className="object-contain p-4 group-hover:scale-105 transition-transform"
                          />
                        </div>
                      )}
                      <div className="flex justify-between items-start mb-2">
                        <CardTitle className="text-lg font-semibold text-gray-900 group-hover:text-green-600 transition-colors">
                          {part.name}
                        </CardTitle>
                        {part.quality && (
                          <Badge variant="secondary" className="text-xs flex-shrink-0">
                            {part.quality}
                          </Badge>
                        )}
                      </div>
                      {part.description && (
                        <CardDescription className="text-sm text-gray-600 line-clamp-2">
                          {part.description}
                        </CardDescription>
                      )}
                    </CardHeader>
                    <CardContent className="flex-grow flex flex-col justify-end">
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <Package className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-600">
                              {part.inStock > 0 ? (
                                <span className="text-green-600 font-medium">In Stock ({part.inStock})</span>
                              ) : (
                                <span className="text-red-600">Out of Stock</span>
                              )}
                            </span>
                          </div>
                          <span className="text-2xl font-bold text-green-600">
                            {formatCurrency(part.cost, 'EUR')}
                          </span>
                        </div>
                        {part.sku && (
                          <p className="text-xs text-gray-500">SKU: {part.sku}</p>
                        )}
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <ChevronRight className="h-4 w-4" />
                          <span>{t('parts.viewDetails', { defaultValue: 'View Details' })}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
              })}
            </div>
          ) : (
            <Card className="max-w-2xl mx-auto text-center p-12">
              <p className="text-gray-600 mb-4">
                {t('parts.noParts', { defaultValue: 'No parts available for this device yet.' })}
              </p>
              <Button asChild>
                <Link href={`/quote?device=${device.id}`}>
                  {t('parts.requestPart', { defaultValue: 'Request a Part' })}
                </Link>
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
            {t('cta.description', { defaultValue: 'Get a free quote and have your device repaired by certified technicians' })}
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button asChild size="lg" variant="secondary" className="shadow-lg">
              <Link href={`/quote?device=${device.id}`}>{t('cta.button', { defaultValue: 'Get Free Quote' })}</Link>
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
