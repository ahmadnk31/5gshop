'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import { useDeviceModels } from "@/hooks/use-data";
import { ChevronDown, ChevronRight } from "lucide-react";

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
  const [expandedSeries, setExpandedSeries] = useState<string[]>([]);
  
  // Fetch models using TanStack Query
  const { data: models = [], isLoading, error } = useDeviceModels(deviceTypeEnum, brandName);

  const toggleSeries = (seriesName: string) => {
    setExpandedSeries(prev => 
      prev.includes(seriesName) 
        ? prev.filter(s => s !== seriesName)
        : [...prev, seriesName]
    );
  };

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

  // Group models by series
  const groupedModels = models.reduce((acc: any, device: any) => {
    const seriesName = device.series || 'Other Models';
    if (!acc[seriesName]) {
      acc[seriesName] = [];
    }
    acc[seriesName].push(device);
    return acc;
  }, {});

  // Sort series: named series first (alphabetically), then "Other Models" last
  const sortedSeries = Object.keys(groupedModels).sort((a, b) => {
    if (a === 'Other Models') return 1;
    if (b === 'Other Models') return -1;
    return a.localeCompare(b);
  });

  // Success state with data
  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-center mb-8 text-gray-900">
          {t('services.selectModel', { defaultValue: 'Select Your Model' })}
        </h2>
        
        <div className="max-w-7xl mx-auto space-y-4">
          {sortedSeries.map((seriesName) => {
            const isExpanded = expandedSeries.includes(seriesName);
            const seriesModels = groupedModels[seriesName];
            
            return (
              <Card 
                key={seriesName} 
                className="overflow-hidden border-2 hover:border-green-500 transition-all"
              >
                {/* Series Card Header - Clickable */}
                <CardHeader 
                  className="cursor-pointer bg-gradient-to-r from-gray-50 to-white hover:from-green-50 hover:to-white transition-colors"
                  onClick={() => toggleSeries(seriesName)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {isExpanded ? (
                        <ChevronDown className="h-6 w-6 text-green-600" />
                      ) : (
                        <ChevronRight className="h-6 w-6 text-gray-600" />
                      )}
                      <div>
                        <CardTitle className="text-xl font-bold text-gray-900">
                          {seriesName}
                        </CardTitle>
                        <CardDescription className="text-sm text-gray-600 mt-1">
                          {seriesModels.length} {seriesModels.length === 1 ? 'model' : 'models'} available
                        </CardDescription>
                      </div>
                    </div>
                    <Badge 
                      variant={isExpanded ? "default" : "outline"}
                      className={isExpanded ? "bg-green-600" : ""}
                    >
                      {isExpanded ? 'Collapse' : 'Expand'}
                    </Badge>
                  </div>
                </CardHeader>

                {/* Series Card Content - Expandable */}
                {isExpanded && (
                  <CardContent className="pt-6 bg-gray-50">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {seriesModels.map((device: any) => {
                        const modelSlug = device.model.toLowerCase().replace(/\s+/g, '-').replace(/\//g, '-');
                        return (
                          <Link
                            key={device.id}
                            href={`/repairs/${deviceType}/${brand}/${modelSlug}`}
                            className="group"
                          >
                            <Card className="hover:shadow-lg pt-0 transition-shadow border-gray-200 overflow-hidden h-full bg-white">
                              {device.imageUrl && (
                                <div className="relative h-48 product-image-container">
                                  <Image
                                    src={device.imageUrl}
                                    alt={`${device.brand} ${device.model}`}
                                    fill
                                    className="object-contain p-4 group-hover:scale-105 transition-transform remove-white-bg"
                                  />
                                </div>
                              )}
                              <CardHeader>
                                <CardTitle className="text-lg font-semibold text-gray-900 group-hover:text-green-600 transition-colors">
                                  {device.model}
                                </CardTitle>
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
                  </CardContent>
                )}
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
