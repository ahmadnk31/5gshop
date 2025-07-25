import { Button } from "@/components/ui/button";
import { FeaturedPartsSection } from "@/components/FeaturedPartsSection";
import { FeaturedAccessoriesSection } from "@/components/FeaturedAccessoriesSection";
import { RecentlyViewedSection } from "@/components/recently-viewed-section";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Smartphone, Wrench, ShoppingBag, Star, Clock, Shield, CheckCircle, ArrowRight, Zap, Cable, Headphones, Monitor, ShoppingCart } from "lucide-react";
import { Testimonials } from "@/components/testimonials";
import { PricingComparison } from "@/components/pricing-comparison";
import { getAccessories } from "@/app/actions/accessory-actions";
import { getRepairServices } from "@/app/actions/repair-services-actions";
import { getDeviceTypes } from "@/app/actions/device-catalog-actions";
import { getHomepageParts } from "@/app/actions/homepage-parts";
import { Accessory, RepairService, Part } from "@/lib/types";
import { getAllDevices } from '@/app/actions/device-management-actions';
import { generatePageMetadata, generateLocalBusinessSchema, generateFAQSchema } from "@/lib/seo";
import { Metadata } from "next";
import { StructuredData } from "@/components/structured-data";
import { generateLocalSEOFAQ, generateRepairServiceSchema, generateEnhancedLocalBusiness } from "@/lib/local-seo";
import { generateCompleteLocalBusinessSchema } from "@/lib/local-business";

import { getTranslations } from 'next-intl/server';
import { Link } from "@/i18n/navigation";
import { formatCurrency } from "@/lib/utils";
import HomepageHeroCarouselClient from '@/components/homepage-hero-carousel-client';

export async function generateMetadata(): Promise<Metadata> {
  return await generatePageMetadata({
    title: "GSM Reparatie Leuven | Telefoon Reparatie | 5gphones",
    description: "Professionele GSM reparatie en telefoon reparatie in Leuven. iPhone, Samsung, Huawei reparatie ✓ Scherm vervanging ✓ Batterij reparatie ✓ Snelle service ✓ Garantie. Bondgenotenlaan 84A, Leuven.",
    path: "",
    keywords: [
      // Primary Dutch keywords for local search
      "gsm reparatie leuven",
      "telefoon reparatie leuven",
      "smartphone reparatie leuven", 
      "iphone reparatie leuven",
      "samsung reparatie leuven",
      "huawei reparatie leuven",
      "xiaomi reparatie leuven",
      "scherm reparatie leuven",
      "batterij vervanging leuven",
      "gsm winkel leuven",
      "telefoon winkel leuven",
      "smartphone winkel leuven",
      "gsm onderdelen leuven",
      "telefoon accessoires leuven",
      
      // English keywords for international students/visitors
      "phone repair leuven",
      "device repair leuven",
      "smartphone repair leuven", 
      "mobile repair leuven",
      "cell phone repair leuven",
      "iphone repair leuven",
      "samsung repair leuven",
      "screen replacement leuven",
      "battery replacement leuven",
      "phone shop leuven",
      "electronics repair leuven",
      
      // Location-specific variations
      "leuven gsm reparatie",
      "leuven telefoon reparatie", 
      "reparatie leuven centrum",
      "gsm reparatie centrum leuven",
      "telefoon reparatie bondgenotenlaan",
      "smartphone reparatie vlaams brabant",
      
      // Service-specific
      "snelle reparatie leuven",
      "goedkope reparatie leuven", 
      "professionele reparatie leuven",
      "reparatie met garantie leuven",
      "same day repair leuven",
      "fast repair leuven",
      "reliable repair leuven",
      "professional repair leuven"
    ]
  });
}

function shuffleArray(array: any[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

async function HomepageHeroCarousel() {
  const t = await getTranslations('homepageHero');
  // Use fixed slides for best practice
  const slides = [
    {
      type: 'brand',
      id: 'brand',
      name: t('brandTitle'),
      subtitle: t('brandSubtitle'),
      imageUrl: '/hero-lifestyle.jpg',
      link: '/accessories',
      cta: t('brandCta'),
    },
    {
      type: 'accessory',
      id: 'accessory',
      name: t('accessoryTitle'),
      subtitle: t('accessorySubtitle'),
      imageUrl: '/hero-accessories.jpg',
      link: '/accessories',
      cta: t('accessoryCta'),
    },
    {
      type: 'part',
      id: 'part',
      name: t('partTitle'),
      subtitle: t('partSubtitle'),
      imageUrl: '/hero-parts.jpg',
      link: '/parts',
      cta: t('partCta'),
    },
    {
      type: 'repair',
      id: 'repair',
      name: t('repairTitle'),
      subtitle: t('repairSubtitle'),
      imageUrl: '/hero-repairs.jpg',
      link: '/repairs',
      cta: t('repairCta'),
    },
    {
      type: 'usp',
      id: 'usp',
      name: t('uspTitle'),
      subtitle: t('uspSubtitle'),
      imageUrl: '/hero-usp.png',
      link: '/about',
      cta: t('uspCta'),
    },
  ];
  return <HomepageHeroCarouselClient items={slides} />;
}

export default async function Home() {
  const t = await getTranslations('homepage');

  // Fetch featured data
  const [accessories, services, deviceTypes, homepageParts, allDevices] = await Promise.all([
    getAccessories(),
    getRepairServices(),
    getDeviceTypes(),
    getHomepageParts(),
    getAllDevices()
  ]);

  // Get featured accessories (top 6 by stock)
  const featuredAccessories = accessories
    .filter((acc: Accessory) => acc.inStock > 0)
    .sort((a: Accessory, b: Accessory) => b.inStock - a.inStock)
    .slice(0, 6);

  // Get homepage parts (top 6 in-stock)
  const featuredParts = homepageParts as Part[];

  // Get popular repair services (sorted by price for better UX)
  const popularServices = services
    .sort((a: RepairService, b: RepairService) => a.basePrice - b.basePrice)
    .slice(0, 6);
      {/* Featured Repair Parts */}
      <FeaturedPartsSection parts={featuredParts} t={t} />

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
    <div className="flex flex-col min-h-screen bg-[var(--background)]">
      {/* Enhanced Local SEO Structured Data */}
      <StructuredData data={generateCompleteLocalBusinessSchema()} />
      <StructuredData data={generateLocalSEOFAQ()} />
      <StructuredData data={generateRepairServiceSchema()} />
      
      {/* Hero Section */}
      <HomepageHeroCarousel />

      {/* Services Overview */}
      <section className="py-16 bg-[var(--background)]" data-section="services_overview" aria-labelledby="services-title">
        <div className="container mx-auto px-4">
          <h2 id="services-title" className="text-3xl font-bold text-center mb-12">{t('services.title')}</h2>
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
                <ul className="space-y-2 mb-6" role="list" aria-label="Repair services offered">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" aria-hidden="true" />
                    {t('services.repairs.features.screenReplacements')}
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" aria-hidden="true" />
                    {t('services.repairs.features.batteryReplacements')}
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" aria-hidden="true" />
                    {t('services.repairs.features.waterDamageRepair')}
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" aria-hidden="true" />
                    {t('services.repairs.features.softwareTroubleshooting')}
                  </li>
                </ul>
                <Button asChild className="w-full bg-green-700 hover:bg-green-600 focus:ring-4 focus:ring-green-300 focus:outline-none">
                  <Link href="/repairs" aria-label="Learn more about our repair services">
                    {t('services.repairs.learnMore')}
                  </Link>
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
                <ul className="space-y-2 mb-6" role="list" aria-label="Accessory products available">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" aria-hidden="true" />
                    {t('services.accessories.features.casesProtectors')}
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" aria-hidden="true" />
                    {t('services.accessories.features.chargersCables')}
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" aria-hidden="true" />
                    {t('services.accessories.features.wirelessAccessories')}
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" aria-hidden="true" />
                    {t('services.accessories.features.audioAccessories')}
                  </li>
                </ul>
                <Button asChild variant="outline" className="w-full focus:ring-4 focus:ring-blue-300 focus:outline-none">
                  <Link href="/accessories" aria-label="Browse and shop our accessories">
                    {t('services.accessories.shopNow')}
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Accessories */}
      <FeaturedAccessoriesSection
        accessories={featuredAccessories}
        translations={{
          title: t('featuredAccessories.title'),
          viewAll: t('featuredAccessories.viewAll'),
          inStock: t('featuredAccessories.inStock', { count: '{count}' }),
          viewDetails: t('featuredAccessories.viewDetails'),
          addToCart: t('accessories.product.addToCart', { defaultValue: 'Add to Cart' }),
          buyNow: t('accessories.product.buyNow'),
          productImage: t('accessories.product.productImage'),
        }}
      />

      {/* Recently Viewed & Search-Based Recommendations */}
      <RecentlyViewedSection />

      {/* Popular Repair Services */}
      <section className="py-16 bg-[var(--background)]" aria-labelledby="popular-services-title">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <h2 id="popular-services-title" className="text-lg md:text-3xl text-truncate font-bold">
              {t('popularServices.title')}
            </h2>
            <Button asChild variant="outline" className="focus:ring-4 focus:ring-blue-300 focus:outline-none">
              <Link href="/repairs" aria-label="View all repair services">
                {t('popularServices.viewAllServices')}
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" role="list" aria-label="Popular repair services">
            {popularServices.map((service: RepairService) => {
              // Build quote URL with all possible fields for auto-population
              // Try to include model, quality, brand if available on the service object
              const params = new URLSearchParams();
              params.set('service', service.name);
              if (service.deviceTypes?.[0]) params.set('deviceType', service.deviceTypes[0]);
              if (service.specificBrand) params.set('brand', service.specificBrand);
              if (service.specificModel) params.set('model', service.specificModel);
              // No quality field on RepairService
              // Add more fields as needed
              const quoteUrl = `/quote?${params.toString()}`;
              return (
                <Link 
                  key={service.id} 
                  href={quoteUrl} 
                  prefetch={false}
                  className="focus:ring-4 focus:ring-blue-300 focus:outline-none rounded-lg"
                  aria-label={`Get quote for ${service.name} starting at ${formatCurrency(service.basePrice, "EUR")}`}
                >
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between">
                        <div className="p-2 bg-green-100 rounded-lg">
                          <Wrench className="h-6 w-6 text-green-600" />
                        </div>
                        <Badge variant="outline">
                          {service.deviceTypes?.[0] || 'Multiple'}
                        </Badge>
                      </div>
                      <CardTitle className="text-sm md:text-lg">{service.name}</CardTitle>
                      <CardDescription className="text-sm line-clamp-2">
                        {service.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-2xl font-bold text-green-600">
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
              );
            })}
          </div>
        </div>
      </section>

      {/* Device Categories */}
      <section className="py-16 bg-[var(--primary)]" aria-labelledby="device-categories-title">
        <div className="container mx-auto px-4">
          <h2 id="device-categories-title" className="text-3xl font-bold text-center mb-12">
            {t('deviceCategories.title')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" role="list" aria-label="Device repair categories">
            {deviceCategories.map((category) => {
              const IconComponent = category.icon;
              const modelCount = allDevices.filter((device: any) => device.type === category.type).length;
              // Map device types to repair page parameter format
              const repairTypeMap: Record<string, string> = {
                'SMARTPHONE': 'smartphone',
                'LAPTOP': 'laptop',
                'TABLET': 'tablet',
                'SMARTWATCH': 'smartwatch'
              };
              const repairType = repairTypeMap[category.type] || 'smartphone';
              
              return (
                <Link 
                  key={category.type} 
                  href={`/repairs?type=${repairType}`}
                  className="focus:ring-4 focus:ring-blue-300 focus:outline-none rounded-lg"
                  aria-label={`Repair services for ${category.name} - ${modelCount} models supported`}
                >
                  <Card className="hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer" role="listitem">
                    <CardContent className="p-6 text-center">
                      <div className={`w-16 h-16 ${category.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                        <IconComponent className="h-8 w-8 text-white" aria-hidden="true" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2">{category.name}</h3>
                      <p className="text-gray-600 text-sm mb-3">{category.description}</p>
                      <Badge variant="secondary">
                        {t('deviceCategories.modelsSupported', { count: modelCount })}
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
      <section className="py-16 bg-[var(--background)]" aria-labelledby="why-choose-us-title">
        <div className="container mx-auto px-4">
          <h2 id="why-choose-us-title" className="text-3xl font-bold text-center mb-12">
            {t('whyChooseUs.title')}
          </h2>
          <div className="grid md:grid-cols-3 gap-8" role="list" aria-label="Reasons to choose our service">
            <div className="text-center" role="listitem">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" aria-hidden="true">
                <Clock className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{t('whyChooseUs.fastService.title')}</h3>
              <p className="text-gray-600">{t('whyChooseUs.fastService.description')}</p>
            </div>
            <div className="text-center" role="listitem">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" aria-hidden="true">
                <Shield className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{t('whyChooseUs.qualityGuarantee.title')}</h3>
              <p className="text-gray-600">{t('whyChooseUs.qualityGuarantee.description')}</p>
            </div>
            <div className="text-center" role="listitem">
              <div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" aria-hidden="true">
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
      <section className="bg-[var(--primary)] text-white py-16" aria-labelledby="final-cta-title">
        <div className="container mx-auto px-4 text-center">
          <h2 id="final-cta-title" className="text-3xl font-bold mb-4">{t('cta.title')}</h2>
          <p className="text-xl mb-8">{t('cta.subtitle')}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              asChild 
              size="lg" 
              variant="outline" 
              className="text-black focus:ring-4 focus:ring-white/50 focus:outline-none"
            >
              <Link href="/contact" aria-label="Contact us for assistance">
                {t('cta.contactUs')}
              </Link>
            </Button>
            <Button 
              asChild 
              size="lg" 
              variant="outline" 
              className="text-white bg-transparent border-white hover:bg-white hover:text-gray-900 focus:ring-4 focus:ring-white/50 focus:outline-none"
            >
              <Link href="/about" aria-label="Learn more about our company">
                {t('cta.learnMore')}
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}