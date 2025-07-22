"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Clock, 
  DollarSign,
  Wrench,
  Zap,
  Droplet,
  Settings,
  Shield,
  Star,
  Award
} from "lucide-react";
import { Skeleton } from '@/components/ui/skeleton';

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import DeviceCatalogBrowser from "@/components/device-catalog-browser";
import { RepairService, DeviceType } from "@/lib/types";
import { getRepairServicesForDevice } from "@/app/actions/device-catalog-actions";
import { formatCurrency } from "@/lib/utils";
import { Link } from "@/i18n/navigation";

function RepairsPageContent() {
  const t = useTranslations('repairs');
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<DeviceType>("SMARTPHONE");
  const [searchTerm, setSearchTerm] = useState("");
  const [services, setServices] = useState<RepairService[]>([]);
  const [loading, setLoading] = useState(true);

  // Device type mapping for tabs
  const deviceTypes: { value: DeviceType; label: string }[] = [
    { value: "SMARTPHONE", label: t('deviceTypes.smartphone') },
    { value: "TABLET", label: t('deviceTypes.tablet') },
    { value: "LAPTOP", label: t('deviceTypes.laptop') },
    { value: "SMARTWATCH", label: t('deviceTypes.smartwatch') },
  ];

  // Get device type and search term from URL parameters
  useEffect(() => {
    const type = searchParams.get('type');
    const search = searchParams.get('search');
    const brand = searchParams.get('brand');
    const model = searchParams.get('model');
    
    if (search) {
      setSearchTerm(search);
    }
    
    if (type) {
      // Map URL parameter to DeviceType
      const deviceTypeMap: Record<string, DeviceType> = {
        'smartphone': 'SMARTPHONE',
        'tablet': 'TABLET', 
        'laptop': 'LAPTOP',
        'smartwatch': 'SMARTWATCH',
        'desktop': 'LAPTOP', // Map desktop to laptop for now
        'gaming_console': 'SMARTPHONE', // Map to smartphone for now
        'other': 'SMARTPHONE' // Map to smartphone for now
      };
      
      const mappedType = deviceTypeMap[type] || 'SMARTPHONE';
      setActiveTab(mappedType);
    }
    
    // Load initial services for the active tab, brand, and model
    loadServicesForDevice(activeTab, brand, model);
  }, [searchParams]);

  // Load services when tab changes
  useEffect(() => {
    loadServicesForDevice(activeTab);
  }, [activeTab]);

  const loadServicesForDevice = async (deviceType: DeviceType, brand?: string | null, model?: string | null) => {
    setLoading(true);
    try {
      const servicesData = await getRepairServicesForDevice(deviceType, brand || undefined, model || undefined);
      setServices(servicesData);
    } catch (error) {
      console.error('Error loading services:', error);
    } finally {
      setLoading(false);
    }
  };

  const whyChooseUs = [
    {
      icon: Award,
      title: t('whyChooseUs.features.expertTechnicians.title'),
      description: t('whyChooseUs.features.expertTechnicians.description')
    },
    {
      icon: Shield,
      title: t('whyChooseUs.features.qualityGuarantee.title'),
      description: t('whyChooseUs.features.qualityGuarantee.description')
    },
    {
      icon: Clock,
      title: t('whyChooseUs.features.fastTurnaround.title'),
      description: t('whyChooseUs.features.fastTurnaround.description')
    },
    {
      icon: Star,
      title: t('whyChooseUs.features.qualityParts.title'),
      description: t('whyChooseUs.features.qualityParts.description')
    }
  ];

  // Get popular services from the loaded services
  const getPopularServices = () => {
    return services
      .filter(service => service.popularity && typeof service.popularity === 'number' && service.popularity > 80)
      .slice(0, 4)
      .map(service => ({
        icon: getServiceIcon(service.name),
        title: service.name,
        description: service.description,
        timeframe: t('popularServices.timeframe', { time: service.estimatedTime }),
        warranty: t('popularServices.warranty', { days: 90 }),
        price: `${formatCurrency(service.basePrice,"EUR")}`
      }));
  };

  const getServiceIcon = (serviceName: string) => {
    if (serviceName.toLowerCase().includes('screen')) return Zap;
    if (serviceName.toLowerCase().includes('battery')) return Zap;
    if (serviceName.toLowerCase().includes('water')) return Droplet;
    return Settings;
  };

  const getDeviceTypeLabel = (deviceType: DeviceType) => {
    const deviceTypeMap: Record<DeviceType, string> = {
      'SMARTPHONE': t('deviceTypes.smartphone'),
      'TABLET': t('deviceTypes.tablet'),
      'LAPTOP': t('deviceTypes.laptop'),
      'SMARTWATCH': t('deviceTypes.smartwatch'),
      'DESKTOP': t('deviceTypes.desktop'),
      'GAMING_CONSOLE': t('deviceTypes.gamingConsole'),
      'OTHER': t('deviceTypes.other')
    };
    return deviceTypeMap[deviceType];
  };

  if (loading) return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="p-2">
            <Skeleton className="w-full aspect-square mb-3" />
            <Skeleton className="w-2/3 h-5 mb-2" />
            <Skeleton className="w-1/2 h-4" />
            <Skeleton className="w-full h-8 mt-2" />
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 to-blue-800 text-white py-6 sm:py-10 lg:py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-lg sm:text-2xl md:text-3xl lg:text-5xl font-bold mb-3 sm:mb-6">
            {t('hero.title')}
          </h1>
          <p className="text-sm sm:text-base md:text-lg mb-4 sm:mb-8 max-w-3xl mx-auto leading-relaxed">
            {t('hero.description')}
          </p>
          <Button asChild size="lg" variant="secondary" className="text-xs sm:text-sm sm:text-base">
            <Link href="/quote">{t('hero.cta')}</Link>
          </Button>
        </div>
      </section>

      {/* Search Results Indicator */}
      {searchTerm && (
        <section className="py-8 bg-blue-50 border-b">
          <div className="container mx-auto px-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-blue-900">
                  {t('searchResults.title', { searchTerm })}
                </h2>
                <p className="text-blue-700">
                  {t('searchResults.description')}
                </p>
              </div>
              <div className="mt-2 sm:mt-0 w-full sm:w-auto flex-shrink-0">
                <Button
                  variant="outline"
                  className="w-full sm:w-auto"
                  onClick={() => {
                    setSearchTerm("");
                    // Remove search param from URL
                    const url = new URL(window.location.href);
                    url.searchParams.delete('search');
                    window.history.replaceState({}, '', url.toString());
                  }}
                >
                  {t('searchResults.clearSearch')}
                </Button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Device Catalog Browser */}
      <section id="device-browser" className="py-16 scroll-mt-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">{t('deviceBrowser.title')}</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t('deviceBrowser.description')}
            </p>
          </div>
          
          <DeviceCatalogBrowser searchTerm={searchTerm} />
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-8 sm:py-12 md:py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-center mb-6 sm:mb-12">{t('whyChooseUs.title')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {whyChooseUs.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <Icon className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 text-blue-600 mx-auto mb-2 sm:mb-4" />
                    <CardTitle className="text-base sm:text-lg md:text-xl">{feature.title}</CardTitle>
                    <CardDescription className="text-xs sm:text-sm md:text-base">{feature.description}</CardDescription>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Popular Repair Services */}
      <section className="py-8 sm:py-12 md:py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-center mb-6 sm:mb-12">{t('popularServices.title')}</h2>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {getPopularServices().map((repair, index) => (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <repair.icon className="h-10 w-10 sm:h-12 sm:w-12 md:h-16 md:w-16 text-blue-600 mx-auto mb-2 sm:mb-4" />
                    <CardTitle className="text-base sm:text-lg md:text-xl">{repair.title}</CardTitle>
                    <CardDescription className="text-xs sm:text-sm md:text-base">{repair.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center justify-center space-x-2">
                      <Clock className="h-4 w-4 text-gray-600" />
                      <span className="text-xs sm:text-sm text-gray-600">{repair.timeframe}</span>
                    </div>
                    <div className="flex items-center justify-center space-x-2">
                      <DollarSign className="h-4 w-4 text-gray-600" />
                      <span className="text-xs sm:text-sm font-semibold">{repair.price}</span>
                    </div>
                    <Badge variant="outline" className="text-xs sm:text-sm">{repair.warranty}</Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Process */}
      <section className="py-8 sm:py-12 md:py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-center mb-6 sm:mb-12">{t('process.title')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-4 text-lg sm:text-xl md:text-2xl font-bold text-blue-600">
                1
              </div>
              <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-1 sm:mb-2">{t('process.steps.diagnosis.title')}</h3>
              <p className="text-xs sm:text-sm md:text-base text-gray-600">{t('process.steps.diagnosis.description')}</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-4 text-lg sm:text-xl md:text-2xl font-bold text-blue-600">
                2
              </div>
              <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-1 sm:mb-2">{t('process.steps.quote.title')}</h3>
              <p className="text-xs sm:text-sm md:text-base text-gray-600">{t('process.steps.quote.description')}</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-4 text-lg sm:text-xl md:text-2xl font-bold text-blue-600">
                3
              </div>
              <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-1 sm:mb-2">{t('process.steps.repair.title')}</h3>
              <p className="text-xs sm:text-sm md:text-base text-gray-600">{t('process.steps.repair.description')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Dynamic Pricing */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">{t('pricing.title')}</h2>
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as DeviceType)} className="max-w-4xl mx-auto">
            <TabsList className="grid w-full grid-cols-4">
              {deviceTypes.map((deviceType) => (
                <TabsTrigger key={deviceType.value} value={deviceType.value}>
                  {deviceType.label}
                </TabsTrigger>
              ))}
            </TabsList>
            
            {deviceTypes.map((deviceType) => (
              <TabsContent key={deviceType.value} value={deviceType.value} className="mt-8">
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 gap-6">
                    {services.length > 0 ? (
                      <>
                        <Card>
                          <CardHeader>
                            <CardTitle>
                              {t('pricing.commonRepairs', { deviceType: getDeviceTypeLabel(deviceType.value) })}
                            </CardTitle>
                            <CardDescription>
                              {t('pricing.commonRepairsDescription', { 
                                deviceType: getDeviceTypeLabel(deviceType.value).toLowerCase() 
                              })}
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            {services.slice(0, Math.ceil(services.length / 2)).map((service) => (
                              <div key={service.id} className="flex justify-between items-center">
                                <span className="flex-1">{service.name}</span>
                                <span className="font-semibold text-blue-600">
                                  {formatCurrency(service.basePrice, "EUR")}
                                  {service.priceVariations && Object.keys(service.priceVariations).length > 0 && '+'}
                                </span>
                              </div>
                            ))}
                          </CardContent>
                        </Card>
                        
                        {services.length > 1 && (
                          <Card>
                            <CardHeader>
                              <CardTitle>{t('pricing.additionalServices')}</CardTitle>
                              <CardDescription>
                                {t('pricing.additionalServicesDescription')}
                              </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                              {services.slice(Math.ceil(services.length / 2)).map((service) => (
                                <div key={service.id} className="flex justify-between items-center">
                                  <span className="flex-1">{service.name}</span>
                                  <span className="font-semibold text-blue-600">
                                    {formatCurrency(service.basePrice, "EUR")}
                                    {service.priceVariations && Object.keys(service.priceVariations).length > 0 && '+'}
                                  </span>
                                </div>
                              ))}
                            </CardContent>
                          </Card>
                        )}
                      </>
                    ) : (
                      <Card className="md:col-span-2">
                        <CardContent className="text-center py-12">
                          <Wrench className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                          <h3 className="text-lg font-semibold mb-2">{t('pricing.noServicesFound.title')}</h3>
                          <p className="text-gray-600">
                            {t('pricing.noServicesFound.description', { 
                              deviceType: getDeviceTypeLabel(deviceType.value).toLowerCase() 
                            })}
                          </p>
                          <Button asChild className="mt-4">
                            <Link href="/contact">{t('pricing.noServicesFound.cta')}</Link>
                          </Button>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
          
          <div className="text-center mt-8">
            <p className="text-sm text-gray-600 mb-4">
              {t('pricing.disclaimer')}
            </p>
            <Button asChild size="lg">
              <Link href="/quote">{t('pricing.cta')}</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-blue-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">{t('finalCta.title')}</h2>
          <p className="text-xl mb-8">{t('finalCta.description')}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="secondary">
              <Link href="/quote">{t('finalCta.primaryCta')}</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-white bg-transparent border-white hover:bg-white hover:text-blue-600">
              <Link href="/contact">{t('finalCta.secondaryCta')}</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default function RepairsPage() {
  const t = useTranslations('repairs');
  
  return (
    <Suspense fallback={<div className="flex justify-center items-center min-h-screen">{t('loading')}</div>}>
      <RepairsPageContent />
    </Suspense>
  );
}