import { Button } from "@/components/ui/button";
import { FeaturedPartsSection } from "@/components/FeaturedPartsSection";
import { FeaturedAccessoriesSection } from "@/components/FeaturedAccessoriesSection";
import { RecentlyViewedSection } from "@/components/recently-viewed-section";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
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
    title: "GSM Reparatie Leuven | iPhone, MacBook, Software & Windows Installatie ⭐ 5G Phones",
    description: "⭐ Professionele reparatie & software service Leuven - iPhone, MacBook, iPad, Laptop herstel ✓ Windows installatie ✓ Password reset ✓ Software troubleshooting ✓ Virus verwijdering ✓ Data recovery ✓ 6 maanden garantie ✓ Bondgenotenlaan 84A. Hardware & Software solutions!",
    path: "",
    keywords: [
      // TIER 1: High Priority GSC Keywords (300+ impressions)
      "gsm leuven", // 300 impressions - BIGGEST OPPORTUNITY
      "gsm winkel leuven", // 198 impressions
      "smartphone reparatie wespelaar", // 134 impressions
      "iphone reparatie leuven", // 119 impressions
      "gsm herstellen leuven", // 108 impressions
      
      // TIER 2: Proven Performers (clicks + good position)
      "gsm reparatie leuven", // 6 clicks, position 4.48 - TOP PERFORMER
      "gsm repair leuven", // 4 clicks, position 4.83
      "telefoon reparatie leuven", // 3 clicks
      "smartphone reparatie leuven",
      "gsm reparatie", // 1 click, position 7.69
      
      // Apple Devices - High Priority
      "macbook reparatie leuven",
      "macbook herstel leuven",
      "macbook repair leuven",
      "ipad reparatie leuven",
      "ipad herstel leuven",
      "ipad repair leuven",
      "imac reparatie leuven",
      "mac reparatie leuven",
      "apple reparatie leuven",
      "macbook scherm vervangen leuven",
      "macbook battery replacement leuven",
      "ipad screen repair leuven",
      
      // Laptop & Computer Keywords
      "laptop reparatie leuven",
      "laptop herstel leuven",
      "laptop repair leuven",
      "computer reparatie leuven",
      "computer herstel leuven",
      "computer repair leuven",
      "desktop reparatie leuven",
      "desktop repair leuven",
      "pc reparatie leuven",
      "windows laptop repair leuven",
      "laptop scherm vervangen leuven",
      "laptop battery replacement leuven",
      
      // Tablet Keywords
      "tablet reparatie leuven",
      "tablet herstel leuven",
      "tablet repair leuven",
      "samsung tablet repair leuven",
      "android tablet reparatie leuven",
      "tablet scherm vervangen leuven",
      
      // Software Services - HIGH PRIORITY
      "windows installatie leuven",
      "windows installation leuven",
      "windows herinstalleren leuven",
      "os installation leuven",
      "software reparatie leuven",
      "software repair leuven",
      "iphone software repair leuven",
      "iphone software probleem leuven",
      "samsung software repair leuven",
      "android software repair leuven",
      "macbook software repair leuven",
      "laptop software repair leuven",
      
      // Password & Security Services
      "password reset leuven",
      "wachtwoord vergeten leuven",
      "iphone password reset leuven",
      "samsung password reset leuven",
      "windows password reset leuven",
      "laptop password reset leuven",
      "forgot password leuven",
      "unlock iphone leuven",
      "unlock samsung leuven",
      
      // Technical Troubleshooting
      "virus verwijdering leuven",
      "virus removal leuven",
      "malware removal leuven",
      "computer slow leuven",
      "laptop traag leuven",
      "computer troubleshooting leuven",
      "laptop troubleshooting leuven",
      "technische problemen leuven",
      "technical issues leuven",
      
      // Data Services
      "data recovery leuven",
      "data herstel leuven",
      "data backup leuven",
      "data transfer leuven",
      "iphone data recovery leuven",
      "laptop data recovery leuven",
      
      // System Services
      "system update leuven",
      "ios update leuven",
      "android update leuven",
      "windows update leuven",
      "software update leuven",
      "firmware update leuven",
      
      // TIER 3: English Keywords for Students/Expats
      "phone repair leuven",
      "mobile repair leuven",
      "iphone repair leuven",
      "samsung repair leuven",
      "screen repair leuven",
      "battery replacement leuven",
      "phone shop leuven",
      "mobile shop leuven",
      
      // Device-Specific Dutch
      "iphone reparatie leuven",
      "samsung reparatie leuven",
      "huawei reparatie leuven",
      "xiaomi reparatie leuven",
      "tablet reparatie leuven",
      "ipad reparatie leuven",
      "macbook reparatie leuven",
      "laptop reparatie leuven",
      
      // Service-Specific Dutch
      "scherm reparatie leuven",
      "batterij vervanging leuven",
      "gsm herstel leuven",
      "telefoon herstel leuven",
      "smartphone herstel leuven",
      "gsm scherm vervangen leuven",
      "waterschade reparatie leuven",
      
      // Location Variations (Nearby Cities)
      "smartphone reparatie wespelaar",
      "gsm reparatie haacht",
      "telefoon reparatie rotselaar",
      "gsm winkel haacht",
      
      // French Keywords (Belgian French speakers)
      "réparation gsm louvain",
      "réparation téléphone louvain",
      "réparation smartphone louvain",
      "réparation iphone louvain",
      "réparation écran louvain",
      
      // Accessories Keywords
      "gsm accessoires leuven",
      "telefoon accessoires leuven",
      "smartphone accessoires leuven",
      "telefoon hoesjes leuven",
      "gsm hoesjes leuven",
      "telefoon opladers leuven",
      "phone accessories leuven",
      "phone cases leuven",
      
      // Service Quality Keywords
      "snelle reparatie leuven",
      "goedkope reparatie leuven",
      "professionele reparatie leuven",
      "reparatie met garantie leuven",
      "betrouwbare gsm reparatie",
      "fast phone repair leuven",
      "affordable repair leuven",
      "professional repair leuven",
      
      // Location-Specific Long-tail
      "gsm reparatie centrum leuven",
      "gsm winkel centrum leuven",
      "phone repair bondgenotenlaan",
      "reparatie leuven centrum",
      "gsm shop leuven",
      "telefoon winkel leuven",
      
      // Student-Focused
      "student phone repair leuven",
      "cheap phone repair leuven",
      "budget repair leuven",
      "studenten gsm reparatie"
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

  // Helper function to create slugs
  const createSlug = (name: string, id: string): string => {
    const nameSlug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    return `${nameSlug}-${id}`;
  };

  // Get featured accessories (top 6 by stock)
  const featuredAccessories = accessories
    .filter((acc: Accessory) => acc.inStock > 0)
    .sort((a: Accessory, b: Accessory) => b.inStock - a.inStock)
    .slice(0, 6)
    .map((acc: Accessory) => ({
      ...acc,
      slug: createSlug(acc.name, acc.id)
    }));

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

      {/* SEO-Optimized Intro Section */}
      <section className="py-12 bg-gradient-to-b from-white to-gray-50" aria-labelledby="intro-title">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 id="intro-title" className="text-3xl md:text-4xl font-bold text-center mb-6 text-gray-900">
            {t('intro.title')}
          </h1>
          <div className="text-center text-lg text-gray-700 space-y-4">
            <p>
              {t.rich('intro.welcome', {
                strong: (chunks) => <strong>{chunks}</strong>
              })}
            </p>
            <p className="text-base font-medium">
              {t.rich('intro.hardware', {
                strong: (chunks) => <strong>{chunks}</strong>
              })}
            </p>
            <p className="text-base font-medium">
              {t.rich('intro.accessories', {
                strong: (chunks) => <strong>{chunks}</strong>
              })}
            </p>
            <p className="text-base font-medium">
              {t.rich('intro.software', {
                strong: (chunks) => <strong>{chunks}</strong>
              })}
            </p>
            <p className="text-base">
              {t('intro.guarantee')}
            </p>
            <div className="flex flex-wrap justify-center gap-3 pt-4">
              <Button asChild size="lg" className="bg-green-600 hover:bg-green-700">
                <Link href="/repairs">{t('intro.bookRepair')}</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/contact">{t('intro.contact')}</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-16 bg-[var(--background)]" data-section="services_overview" aria-labelledby="services-title">
        <div className="container mx-auto px-4">
          <h2 id="services-title" className="text-3xl font-bold text-center mb-12">{t('services.title')}</h2>
          <div className="grid md:grid-cols-2 gap-8 my-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Wrench className="h-8 w-8 text-green-600" />
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
                  href={`/repairs/${repairType}`}
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
                <Clock className="h-8 w-8 text-green-600" />
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

      {/* FAQ Section - Accordion with i18n Support */}
      <section className="py-16 bg-gray-50" aria-labelledby="faq-title">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 id="faq-title" className="text-3xl font-bold text-center mb-12">
            {t('faq.title')}
          </h2>
          
          <Accordion type="single" collapsible className="w-full space-y-4">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((num) => (
              <AccordionItem 
                key={`q${num}`} 
                value={`item-${num}`}
                className="bg-white rounded-lg shadow-sm border border-gray-200"
              >
                <AccordionTrigger className="px-6 py-4 text-left text-lg font-semibold text-gray-900 hover:no-underline">
                  {t(`faq.questions.q${num}.question`)}
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4">
                  <div className="text-gray-700 prose prose-sm max-w-none">
                    {t.rich(`faq.questions.q${num}.answer`, {
                      strong: (chunks) => <strong>{chunks}</strong>
                    })}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="text-center mt-10">
            <p className="text-gray-600 mb-4">{t('faq.subtitle')}</p>
            <Button asChild size="lg" className="bg-green-600 hover:bg-green-700">
              <Link href="/contact">{t('faq.contactCta')}</Link>
            </Button>
          </div>
        </div>
      </section>

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