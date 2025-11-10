'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, ChevronRight, Wrench, Clock, DollarSign } from "lucide-react";
import { useTranslations } from "next-intl";
import { formatCurrency } from "@/lib/utils";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import { useDeviceDetails } from "@/hooks/use-data";
import { DescriptionModal } from "@/components/ui/description-modal";

interface ModelRepairClientProps {
  deviceType: string;
  deviceTypeEnum: string;
  brand: string;
  model: string;
  brandName: string;
  modelName: string;
}

// Helper function to create slug from name and ID
function createSlug(name: string, id: string): string {
  const nameSlug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return `${nameSlug}-${id}`;
}

export default function ModelRepairClient({ 
  deviceType, 
  deviceTypeEnum, 
  brand, 
  model, 
  brandName, 
  modelName 
}: ModelRepairClientProps) {
  const t = useTranslations('repairs');
  
  // Fetch device details with parts and services using TanStack Query
  const { data, isLoading, error } = useDeviceDetails(deviceTypeEnum, brandName, modelName);
  
  const device = data?.device;
  const parts = data?.parts || [];
  const services = data?.services || [];

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Device Info Section Skeleton */}
        <section className="relative bg-gradient-to-br from-green-600 to-green-700 text-white py-12">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row gap-8 items-center max-w-5xl mx-auto">
              <Skeleton className="h-64 w-64 bg-white/20 rounded-xl" />
              <div className="flex-1 space-y-4 w-full">
                <Skeleton className="h-10 w-3/4 bg-white/20" />
                <Skeleton className="h-6 w-1/2 bg-white/20" />
                <Skeleton className="h-20 w-full bg-white/20" />
                <Skeleton className="h-12 w-40 bg-white/20" />
              </div>
            </div>
          </div>
        </section>

        {/* Parts Section Skeleton */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <Skeleton className="h-8 w-64 mx-auto mb-8" />
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {[...Array(6)].map((_, i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-48 w-full mb-3" />
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-full" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-6 w-1/2" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </div>
    );
  }

  // Error state
  if (error || !device) {
    return (
      <div className="min-h-screen bg-gray-50">
        <section className="py-12">
          <div className="container mx-auto px-4">
            <Card className="max-w-2xl mx-auto text-center p-12 border-red-200 bg-red-50">
              <h2 className="text-xl font-bold text-red-600 mb-4">
                {t('services.errorTitle', { defaultValue: 'Error Loading Device' })}
              </h2>
              <p className="text-gray-600 mb-4">
                {error ? 
                  t('services.errorMessage', { defaultValue: 'There was a problem loading the device details. Please try again.' }) :
                  t('services.deviceNotFound', { defaultValue: 'Device not found. Please check the URL and try again.' })
                }
              </p>
              <div className="flex gap-4 justify-center">
                <Button 
                  onClick={() => window.location.reload()} 
                  variant="outline"
                  className="border-red-600 text-red-600 hover:bg-red-50"
                >
                  {t('services.retry', { defaultValue: 'Try Again' })}
                </Button>
                <Button asChild variant="default">
                  <Link href="/repairs">{t('services.backToRepairs', { defaultValue: 'Back to Repairs' })}</Link>
                </Button>
              </div>
            </Card>
          </div>
        </section>
      </div>
    );
  }

  // Success state with data
  return (
    <>
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
                <div className="mb-6">
                  <DescriptionModal 
                    description={device.description}
                    title={`${device.brand} ${device.model}`}
                    maxLength={150}
                  />
                </div>
              )}
              <div className="flex gap-4">
                <Button asChild size="lg" variant="secondary" className="shadow-lg">
                  <Link href={`/quote?deviceType=${encodeURIComponent(device.type)}&brand=${encodeURIComponent(device.brand)}&model=${encodeURIComponent(device.model)}`}>
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
                <Link href={`/quote?deviceType=${encodeURIComponent(device.type)}&brand=${encodeURIComponent(device.brand)}&model=${encodeURIComponent(device.model)}`}>
                  {t('parts.requestPart', { defaultValue: 'Request a Part' })}
                </Link>
              </Button>
            </Card>
          )}
        </div>
      </section>

      {/* Services Section */}
      {services.length > 0 && (
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-center mb-8 text-gray-900">
              {t('services.availableServices', { defaultValue: 'Available Repair Services' })}
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {services.map((service: any) => (
                <Card key={service.id} className="hover:shadow-lg transition-shadow border-gray-200 flex flex-col h-full">
                  <CardHeader className="flex-shrink-0">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        {service.icon && (
                          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Wrench className="h-5 w-5 text-green-600" />
                          </div>
                        )}
                        <div className="flex-1">
                          <CardTitle className="text-lg font-semibold text-gray-900">
                            {service.name}
                          </CardTitle>
                          {service.popularity && (
                            <Badge variant="secondary" className="text-xs mt-1">
                              {service.popularity}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    {service.description && (
                      <div className="mb-3">
                        <DescriptionModal
                          description={service.description}
                          title={service.name}
                          maxLength={100}
                          variant="admin"
                        />
                      </div>
                    )}
                  </CardHeader>
                  <CardContent className="flex-grow flex flex-col justify-end">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-gray-400" />
                          <span>{service.estimatedTime} min</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-gray-400" />
                          <span className="text-2xl font-bold text-green-600">
                            {formatCurrency(service.basePrice, 'EUR')}
                          </span>
                        </div>
                      </div>
                      {service.specificModel && (
                        <Badge variant="outline" className="text-xs">
                          {service.specificBrand} {service.specificModel} only
                        </Badge>
                      )}
                      {service.specificBrand && !service.specificModel && (
                        <Badge variant="outline" className="text-xs">
                          All {service.specificBrand} devices
                        </Badge>
                      )}
                      <Button asChild className="w-full">
                        <Link href={`/quote?deviceType=${encodeURIComponent(device.type)}&brand=${encodeURIComponent(device.brand)}&model=${encodeURIComponent(device.model)}&service=${encodeURIComponent(service.name)}`}>
                          {t('services.bookService', { defaultValue: 'Book This Service' })}
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
