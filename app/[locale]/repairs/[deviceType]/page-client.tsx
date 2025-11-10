'use client';

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import { useBrandsWithDetails } from "@/hooks/use-data";

interface DeviceRepairsClientProps {
  deviceType: string;
  deviceTypeEnum: string;
  deviceLabel: string;
}

export default function DeviceRepairsClient({ 
  deviceType, 
  deviceTypeEnum, 
  deviceLabel 
}: DeviceRepairsClientProps) {
  const t = useTranslations('repairs');
  
  // Fetch brands using TanStack Query
  const { data: brands = [], isLoading, error } = useBrandsWithDetails(deviceTypeEnum);

  // Loading state
  if (isLoading) {
    return (
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-8 text-gray-900">
            {t('services.selectBrand', { defaultValue: 'Select Your Brand' })}
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {[...Array(8)].map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="h-40 w-full" />
                <CardHeader className="text-center">
                  <Skeleton className="h-6 w-3/4 mx-auto mb-2" />
                  <Skeleton className="h-4 w-1/2 mx-auto" />
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section className="py-12">
        <div className="container mx-auto px-4">
          <Card className="max-w-2xl mx-auto text-center p-12 border-red-200 bg-red-50">
            <h2 className="text-xl font-bold text-red-600 mb-4">
              {t('services.errorTitle', { defaultValue: 'Error Loading Brands' })}
            </h2>
            <p className="text-gray-600 mb-4">
              {t('services.errorMessage', { defaultValue: 'There was a problem loading the brands. Please try again.' })}
            </p>
            <Button 
              onClick={() => window.location.reload()} 
              variant="outline"
              className="border-red-600 text-red-600 hover:bg-red-50"
            >
              {t('services.retry', { defaultValue: 'Try Again' })}
            </Button>
          </Card>
        </div>
      </section>
    );
  }

  // Empty state
  if (!brands.length) {
    return (
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-8 text-gray-900">
            {t('services.selectBrand', { defaultValue: 'Select Your Brand' })}
          </h2>
          <Card className="max-w-2xl mx-auto text-center p-12">
            <p className="text-gray-600 mb-4">
              {t('services.noBrands', { defaultValue: 'No brands available for this device type yet.' })}
            </p>
            <Button asChild>
              <Link href="/contact">{t('services.contactUs', { defaultValue: 'Contact Us' })}</Link>
            </Button>
          </Card>
        </div>
      </section>
    );
  }

  // Success state with data
  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-center mb-8 text-gray-900">
          {t('services.selectBrand', { defaultValue: 'Select Your Brand' })}
        </h2>
        
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
      </div>
    </section>
  );
}
