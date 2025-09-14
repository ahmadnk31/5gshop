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
      <section className="relative bg-gradient-to-br from-green-600 via-blue-700 to-blue-900 text-white py-12 sm:py-16 lg:py-20 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-transparent via-transparent to-black/20"></div>
        
        <div className="relative container mx-auto px-4 text-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold mb-4 sm:mb-6 lg:mb-8 leading-tight">
            {t('hero.title')}
          </h1>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl mb-6 sm:mb-8 lg:mb-10 max-w-4xl mx-auto leading-relaxed opacity-95">
            {t('hero.description')}
          </p>
          <Button asChild size="lg" variant="secondary" className="text-sm sm:text-base md:text-lg px-6 sm:px-8 py-3 sm:py-4 shadow-lg hover:shadow-xl transition-all duration-300">
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
      <section id="device-browser" className="py-12 sm:py-16 lg:py-20 scroll-mt-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6 text-gray-900">
              {t('deviceBrowser.title')}
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              {t('deviceBrowser.description')}
            </p>
          </div>
          
          <DeviceCatalogBrowser searchTerm={searchTerm} />
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6 text-gray-900">
              {t('whyChooseUs.title')}
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {whyChooseUs.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="text-center hover:shadow-xl transition-all duration-300 border-0 shadow-md bg-white">
                  <CardHeader className="pb-4">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                      <Icon className="h-8 w-8 sm:h-10 sm:w-10 text-blue-600" />
                    </div>
                    <CardTitle className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                      {feature.title}
                    </CardTitle>
                    <CardDescription className="text-sm sm:text-base text-gray-600 leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Popular Repair Services */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6 text-gray-900">
              {t('popularServices.title')}
            </h2>
          </div>
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              {getPopularServices().map((repair, index) => (
                <Card key={index} className="text-center hover:shadow-xl transition-all duration-300 border-0 shadow-md bg-white group">
                  <CardHeader className="pb-4">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:bg-green-200 transition-colors duration-300">
                      <repair.icon className="h-8 w-8 sm:h-10 sm:w-10 text-green-600" />
                    </div>
                    <CardTitle className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                      {repair.title}
                    </CardTitle>
                    <CardDescription className="text-sm sm:text-base text-gray-600 leading-relaxed">
                      {repair.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3 pt-0">
                    <div className="flex items-center justify-center space-x-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">{repair.timeframe}</span>
                    </div>
                    <div className="flex items-center justify-center space-x-2">
                      <DollarSign className="h-4 w-4 text-gray-500" />
                      <span className="text-sm font-semibold text-green-600">{repair.price}</span>
                    </div>
                    <Badge variant="outline" className="text-xs border-green-200 text-green-700 bg-green-50">
                      {repair.warranty}
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Process */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6 text-gray-900">
              {t('process.title')}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12">
            <div className="text-center relative">
              <div className="bg-blue-600 w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 text-xl sm:text-2xl font-bold text-white shadow-lg">
                1
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-900">
                {t('process.steps.diagnosis.title')}
              </h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                {t('process.steps.diagnosis.description')}
              </p>
            </div>
            <div className="text-center relative">
              <div className="bg-blue-600 w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 text-xl sm:text-2xl font-bold text-white shadow-lg">
                2
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-900">
                {t('process.steps.quote.title')}
              </h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                {t('process.steps.quote.description')}
              </p>
            </div>
            <div className="text-center relative">
              <div className="bg-blue-600 w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 text-xl sm:text-2xl font-bold text-white shadow-lg">
                3
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-900">
                {t('process.steps.repair.title')}
              </h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                {t('process.steps.repair.description')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Dynamic Pricing */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6 text-gray-900">
              {t('pricing.title')}
            </h2>
          </div>
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as DeviceType)} className="max-w-6xl mx-auto">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 mb-8 bg-gray-100 p-1 rounded-lg">
              {deviceTypes.map((deviceType) => (
                <TabsTrigger 
                  key={deviceType.value} 
                  value={deviceType.value}
                  className="text-sm sm:text-base font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm"
                >
                  {deviceType.label}
                </TabsTrigger>
              ))}
            </TabsList>
            
            {deviceTypes.map((deviceType) => (
              <TabsContent key={deviceType.value} value={deviceType.value} className="mt-8">
                {loading ? (
                  <div className="flex items-center justify-center py-16">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                  </div>
                ) : (
                  <div className="grid lg:grid-cols-2 gap-8">
                    {services.length > 0 ? (
                      <>
                        <Card className="border-0 shadow-lg">
                          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
                            <CardTitle className="text-xl font-semibold text-gray-900">
                              {t('pricing.commonRepairs', { deviceType: getDeviceTypeLabel(deviceType.value) })}
                            </CardTitle>
                            <CardDescription className="text-gray-600">
                              {t('pricing.commonRepairsDescription', { 
                                deviceType: getDeviceTypeLabel(deviceType.value).toLowerCase() 
                              })}
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-4 p-6">
                            {services.slice(0, Math.ceil(services.length / 2)).map((service) => (
                              <div key={service.id} className="flex justify-between items-center py-3 border-b border-gray-100 last:border-b-0">
                                <span className="flex-1 text-gray-700 font-medium">{service.name}</span>
                                <span className="font-bold text-blue-600 text-lg">
                                  {formatCurrency(service.basePrice, "EUR")}
                                  {service.priceVariations && Object.keys(service.priceVariations).length > 0 && '+'}
                                </span>
                              </div>
                            ))}
                          </CardContent>
                        </Card>
                        
                        {services.length > 1 && (
                          <Card className="border-0 shadow-lg">
                            <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
                              <CardTitle className="text-xl font-semibold text-gray-900">
                                {t('pricing.additionalServices')}
                              </CardTitle>
                              <CardDescription className="text-gray-600">
                                {t('pricing.additionalServicesDescription')}
                              </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4 p-6">
                              {services.slice(Math.ceil(services.length / 2)).map((service) => (
                                <div key={service.id} className="flex justify-between items-center py-3 border-b border-gray-100 last:border-b-0">
                                  <span className="flex-1 text-gray-700 font-medium">{service.name}</span>
                                  <span className="font-bold text-green-600 text-lg">
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
                      <Card className="lg:col-span-2 border-0 shadow-lg">
                        <CardContent className="text-center py-16">
                          <Wrench className="h-20 w-20 mx-auto mb-6 text-gray-300" />
                          <h3 className="text-xl font-semibold mb-4 text-gray-900">{t('pricing.noServicesFound.title')}</h3>
                          <p className="text-gray-600 mb-6 max-w-md mx-auto">
                            {t('pricing.noServicesFound.description', { 
                              deviceType: getDeviceTypeLabel(deviceType.value).toLowerCase() 
                            })}
                          </p>
                          <Button asChild size="lg" className="px-8">
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
          
          <div className="text-center mt-12">
            <p className="text-sm sm:text-base text-gray-600 mb-6 max-w-2xl mx-auto">
              {t('pricing.disclaimer')}
            </p>
            <Button asChild size="lg" className="px-8 py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-300">
              <Link href="/quote">{t('pricing.cta')}</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white py-16 sm:py-20 lg:py-24 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-transparent via-transparent to-black/20"></div>
        
        <div className="relative container mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6">
            {t('finalCta.title')}
          </h2>
          <p className="text-lg sm:text-xl lg:text-2xl mb-8 sm:mb-10 max-w-3xl mx-auto opacity-95">
            {t('finalCta.description')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center">
            <Button asChild size="lg" variant="secondary" className="px-8 py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-300">
              <Link href="/quote">{t('finalCta.primaryCta')}</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="px-8 py-4 text-lg text-white bg-transparent border-2 border-white hover:bg-white hover:text-blue-600 transition-all duration-300">
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