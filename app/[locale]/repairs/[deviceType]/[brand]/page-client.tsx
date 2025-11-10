'use client';

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import { useDeviceModels } from "@/hooks/use-data";

interface BrandModelsClientProps {
  deviceType: string;
  deviceTypeEnum: string;
  brand: string;
  brandName: string;
}

export default function BrandModelsClient({ 
  deviceType, 
  deviceTypeEnum, 
  brand, 
  brandName 
}: BrandModelsClientProps) {
  const t = useTranslations('repairs');
  
  // Fetch models using TanStack Query
  const { data: models = [], isLoading, error } = useDeviceModels(deviceTypeEnum, brandName);

  // Loading state
  if (isLoading) {
    return (
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-8 text-gray-900">
            {t('services.selectModel', { defaultValue: 'Select Your Model' })}
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {[...Array(8)].map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="h-48 w-full" />
                <CardHeader>
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
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
              {t('services.errorTitle', { defaultValue: 'Error Loading Models' })}
            </h2>
            <p className="text-gray-600 mb-4">
              {t('services.errorMessage', { defaultValue: 'There was a problem loading the models. Please try again.' })}
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
  if (!models.length) {
    return (
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-8 text-gray-900">
            {t('services.selectModel', { defaultValue: 'Select Your Model' })}
          </h2>
          <Card className="max-w-2xl mx-auto text-center p-12">
            <p className="text-gray-600 mb-4">
              {t('services.noModels', { defaultValue: 'No models available for this brand yet.' })}
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
          {t('services.selectModel', { defaultValue: 'Select Your Model' })}
        </h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {models.map((device: any) => {
            const modelSlug = device.model.toLowerCase().replace(/\s+/g, '-').replace(/\//g, '-');
            return (
              <Link
                key={device.id}
                href={`/repairs/${deviceType}/${brand}/${modelSlug}`}
                className="group"
              >
                <Card className="hover:shadow-lg transition-shadow border-gray-200 overflow-hidden h-full">
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
      </div>
    </section>
  );
}
