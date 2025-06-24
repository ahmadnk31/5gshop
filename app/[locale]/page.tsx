import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Smartphone, Wrench, ShoppingBag, Star, Clock, Shield, CheckCircle, ArrowRight, Zap, Cable, Headphones, Monitor } from "lucide-react";
import { Testimonials } from "@/components/testimonials";
import { PricingComparison } from "@/components/pricing-comparison";
import { getAccessories } from "@/app/actions/accessory-actions";
import { getRepairServices } from "@/app/actions/repair-services-actions";
import { getDeviceTypes } from "@/app/actions/device-catalog-actions";
import { Accessory, RepairService } from "@/lib/types";

import { PageSectionTracker, ScrollDepthTracker } from "@/components/analytics-components";
import { HomePageCTAs } from "@/components/homepage-ctas";
import { getTranslations } from 'next-intl/server';
import { Link } from "@/i18n/navigation";
import { formatCurrency } from "@/lib/utils";

export default async function Home() {
  const t = await getTranslations('homepage');

  // Fetch featured data
  const [accessories, services, deviceTypes] = await Promise.all([
    getAccessories(),
    getRepairServices(),
    getDeviceTypes()
  ]);

  // Get featured accessories (top 6 by stock)
  const featuredAccessories = accessories
    .filter((acc: Accessory) => acc.inStock > 0)
    .sort((a: Accessory, b: Accessory) => b.inStock - a.inStock)
    .slice(0, 6);

  // Get popular repair services (sorted by price for better UX)
  const popularServices = services
    .sort((a: RepairService, b: RepairService) => a.basePrice - b.basePrice)
    .slice(0, 6);

  // Device categories with counts and icons
  const deviceCategories = [
    {
      type: 'SMARTPHONE',
      name: t('deviceCategories.smartphones.name'),
      icon: Smartphone,
      color: 'bg-blue-500',
      description: t('deviceCategories.smartphones.description')
    },
    {
      type: 'LAPTOP',
      name: t('deviceCategories.laptops.name'),
      icon: Monitor,
      color: 'bg-purple-500',
      description: t('deviceCategories.laptops.description')
    },
    {
      type: 'TABLET',
      name: t('deviceCategories.tablets.name'),
      icon: Monitor,
      color: 'bg-green-500',
      description: t('deviceCategories.tablets.description')
    },
    {
      type: 'SMARTWATCH',
      name: t('deviceCategories.smartwatches.name'),
      icon: Clock,
      color: 'bg-orange-500',
      description: t('deviceCategories.smartwatches.description')
    }
  ];

  // Accessory category icons
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'CASE': return Shield;
      case 'CABLE': return Cable;
      case 'HEADPHONES': return Headphones;
      case 'CHARGER': return Zap;
      case 'SCREEN_PROTECTOR': return Shield;
      default: return ShoppingBag;
    }
  };

  const testimonials = [
    {
      id: 1,
      name: t('testimonials.customers.0.name'),
      rating: 5,
      review: t('testimonials.customers.0.review'),
      service: t('testimonials.customers.0.service'),
      date: t('testimonials.customers.0.date')
    },
    {
      id: 2,
      name: t('testimonials.customers.1.name'),
      rating: 5,
      review: t('testimonials.customers.1.review'),
      service: t('testimonials.customers.1.service'),
      date: t('testimonials.customers.1.date')
    },
    {
      id: 3,
      name: t('testimonials.customers.2.name'),
      rating: 5,
      review: t('testimonials.customers.2.review'),
      service: t('testimonials.customers.2.service'),
      date: t('testimonials.customers.2.date')
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-10 sm:py-16 lg:py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6">
            {t('hero.title')}
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl mb-6 sm:mb-8 max-w-3xl mx-auto leading-relaxed">
            {t('hero.subtitle')}
          </p>
          <HomePageCTAs />
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-16 bg-gray-50" data-section="services_overview">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">{t('services.title')}</h2>
          <PageSectionTracker sectionName="services_overview" />
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Wrench className="h-8 w-8 text-blue-600" />
                  <CardTitle className="text-2xl">{t('services.repairs.title')}</CardTitle>
                </div>
                <CardDescription>
                  {t('services.repairs.description')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    {t('services.repairs.features.screenReplacements')}
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    {t('services.repairs.features.batteryReplacements')}
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    {t('services.repairs.features.waterDamageRepair')}
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    {t('services.repairs.features.softwareTroubleshooting')}
                  </li>
                </ul>
                <Button asChild className="w-full">
                  <Link href="/repairs">{t('services.repairs.learnMore')}</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <ShoppingBag className="h-8 w-8 text-purple-600" />
                  <CardTitle className="text-2xl">{t('services.accessories.title')}</CardTitle>
                </div>
                <CardDescription>
                  {t('services.accessories.description')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    {t('services.accessories.features.casesProtectors')}
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    {t('services.accessories.features.chargersCables')}
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    {t('services.accessories.features.wirelessAccessories')}
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    {t('services.accessories.features.audioAccessories')}
                  </li>
                </ul>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/accessories">{t('services.accessories.shopNow')}</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Accessories */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold">{t('featuredAccessories.title')}</h2>
            <Button asChild variant="outline">
              <Link href="/accessories">
                {t('featuredAccessories.viewAll')}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredAccessories.map((accessory: Accessory) => {
              const IconComponent = getCategoryIcon(accessory.category);
              return (
                <Link key={accessory.id} href={`/accessories/${accessory.id}`}>
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between">
                        <div className="p-2 bg-gray-100 rounded-lg">
                          <IconComponent className="h-6 w-6 text-gray-600" />
                        </div>
                        <Badge variant="secondary">
                          {t('featuredAccessories.inStock', { count: accessory.inStock })}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg">{accessory.name}</CardTitle>
                      <CardDescription className="text-sm line-clamp-2">
                        {accessory.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-green-600">
                          {formatCurrency(accessory.price, "EUR")}
                        </span>
                        <Button size="sm" variant="outline">
                          {t('featuredAccessories.viewDetails')}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Popular Repair Services */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold">{t('popularServices.title')}</h2>
            <Button asChild variant="outline">
              <Link href="/repairs">
                {t('popularServices.viewAllServices')}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularServices.map((service: RepairService) => (
              <Link key={service.id} href={`/quote?service=${encodeURIComponent(service.name)}&deviceType=${service.deviceTypes?.[0] || ''}`}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Wrench className="h-6 w-6 text-blue-600" />
                      </div>
                      <Badge variant="outline">
                        {service.deviceTypes?.[0] || 'Multiple'}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg">{service.name}</CardTitle>
                    <CardDescription className="text-sm line-clamp-2">
                      {service.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-2xl font-bold text-blue-600">
                          {formatCurrency(service.basePrice, "EUR")}
                        </span>
                        <span className="text-sm text-gray-500 ml-1">{t('popularServices.starting')}</span>
                      </div>
                      <Button size="sm" variant="outline">
                        {t('popularServices.bookNow')}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Device Categories */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">{t('deviceCategories.title')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {deviceCategories.map((category) => {
              const IconComponent = category.icon;
              const deviceCount = deviceTypes.filter((type: string) => type === category.type).length;
              // Map device types to repair page parameter format
              const repairTypeMap: Record<string, string> = {
                'SMARTPHONE': 'smartphone',
                'LAPTOP': 'laptop',
                'TABLET': 'tablet',
                'SMARTWATCH': 'smartwatch'
              };
              const repairType = repairTypeMap[category.type] || 'smartphone';
              
              return (
                <Link key={category.type} href={`/repairs?type=${repairType}`}>
                  <Card className="hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer">
                    <CardContent className="p-6 text-center">
                      <div className={`w-16 h-16 ${category.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                        <IconComponent className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2">{category.name}</h3>
                      <p className="text-gray-600 text-sm mb-3">{category.description}</p>
                      <Badge variant="secondary">
                        {t('deviceCategories.modelsSupported', { count: deviceCount })}
                      </Badge>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pricing Comparison Section */}
      <PricingComparison />

      {/* Why Choose Us */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">{t('whyChooseUs.title')}</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{t('whyChooseUs.fastService.title')}</h3>
              <p className="text-gray-600">{t('whyChooseUs.fastService.description')}</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{t('whyChooseUs.qualityGuarantee.title')}</h3>
              <p className="text-gray-600">{t('whyChooseUs.qualityGuarantee.description')}</p>
            </div>
            <div className="text-center">
              <div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-yellow-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{t('whyChooseUs.expertTechnicians.title')}</h3>
              <p className="text-gray-600">{t('whyChooseUs.expertTechnicians.description')}</p>
            </div>
          </div>
        </div>
      </section>

      
      {/* Testimonials Component */}
      <Testimonials testimonials={testimonials} />

      {/* CTA Section */}
      <section className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">{t('cta.title')}</h2>
          <p className="text-xl mb-8">{t('cta.subtitle')}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="outline" className="text-black">
              <Link href="/contact">{t('cta.contactUs')}</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-white bg-transparent border-white hover:bg-white hover:text-gray-900">
              <Link href="/about">{t('cta.learnMore')}</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Analytics Tracking Components */}
      <PageSectionTracker sectionName="homepage_complete" />
      <ScrollDepthTracker />
    </div>
  );
}