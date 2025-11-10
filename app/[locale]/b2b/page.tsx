import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { Building2, Users, Shield, TrendingDown, Truck, HeadphonesIcon, Package, Award, Clock, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

type PageProps = {
  params: Promise<{ locale: string }>;
};

const siteName = '5GPhones.be';
const siteUrl = 'https://www.5gphones.be';

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'b2b' });

  return {
    title: `${t('meta.title')} | ${siteName}`,
    description: t('meta.description'),
    keywords: t('meta.keywords'),
    openGraph: {
      title: t('meta.title'),
      description: t('meta.description'),
      url: `${siteUrl}/${locale}/b2b`,
      siteName,
      locale: locale,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: t('meta.title'),
      description: t('meta.description'),
    },
    alternates: {
      canonical: `${siteUrl}/${locale}/b2b`,
      languages: {
        'nl': `${siteUrl}/nl/b2b`,
        'fr': `${siteUrl}/fr/b2b`,
        'en': `${siteUrl}/en/b2b`,
      },
    },
  };
}

export default async function B2BPage({ params }: PageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'b2b' });

  const benefits = [
    {
      icon: TrendingDown,
      title: t('benefits.volumeDiscount.title'),
      description: t('benefits.volumeDiscount.description'),
    },
    {
      icon: Shield,
      title: t('benefits.warranty.title'),
      description: t('benefits.warranty.description'),
    },
    {
      icon: Users,
      title: t('benefits.accountManager.title'),
      description: t('benefits.accountManager.description'),
    },
    {
      icon: Truck,
      title: t('benefits.delivery.title'),
      description: t('benefits.delivery.description'),
    },
    {
      icon: Clock,
      title: t('benefits.priority.title'),
      description: t('benefits.priority.description'),
    },
    {
      icon: FileText,
      title: t('benefits.invoicing.title'),
      description: t('benefits.invoicing.description'),
    },
  ];

  const services = [
    {
      icon: Package,
      title: t('services.bulkAccessories.title'),
      description: t('services.bulkAccessories.description'),
    },
    {
      icon: HeadphonesIcon,
      title: t('services.repairContracts.title'),
      description: t('services.repairContracts.description'),
    },
    {
      icon: Building2,
      title: t('services.corporateGifts.title'),
      description: t('services.corporateGifts.description'),
    },
    {
      icon: Award,
      title: t('services.customBranding.title'),
      description: t('services.customBranding.description'),
    },
  ];

  const industries = [
    { name: t('industries.education'), emoji: '🎓' },
    { name: t('industries.hospitality'), emoji: '🏨' },
    { name: t('industries.retail'), emoji: '🏪' },
    { name: t('industries.healthcare'), emoji: '🏥' },
    { name: t('industries.corporate'), emoji: '🏢' },
    { name: t('industries.events'), emoji: '🎪' },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white py-20 md:py-32">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <Building2 className="w-5 h-5" />
              <span className="text-sm font-semibold">{t('hero.badge')}</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              {t('hero.title')}
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-green-100 max-w-3xl mx-auto">
              {t('hero.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-green-600 hover:bg-green-500 hover:text-white" asChild>
                <Link href={`/${locale}/contact?subject=b2b`}>
                  {t('hero.ctaPrimary')}
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10" asChild>
                <Link href="#services">
                  {t('hero.ctaSecondary')}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-gray-50 border-b">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-primary-600">500+</div>
              <div className="text-gray-600 mt-2">{t('stats.products')}</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary-600">1000+</div>
              <div className="text-gray-600 mt-2">{t('stats.businesses')}</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary-600">24h</div>
              <div className="text-gray-600 mt-2">{t('stats.delivery')}</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary-600">98%</div>
              <div className="text-gray-600 mt-2">{t('stats.satisfaction')}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('benefits.heading')}</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {t('benefits.subheading')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <Card key={index} className="border-2 hover:border-primary-500 transition-colors">
                  <CardHeader>
                    <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-primary-600" />
                    </div>
                    <CardTitle className="text-xl">{benefit.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">
                      {benefit.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('services.heading')}</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {t('services.subheading')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <Card key={index} className="bg-white">
                  <CardHeader>
                    <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-700 rounded-xl flex items-center justify-center mb-4">
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-2xl">{service.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base leading-relaxed">
                      {service.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Industries Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('industries.heading')}</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {t('industries.subheading')}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {industries.map((industry, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="pt-8 pb-6">
                  <div className="text-5xl mb-4">{industry.emoji}</div>
                  <div className="font-semibold text-lg">{industry.name}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-green-500 to-green-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            {t('cta.heading')}
          </h2>
          <p className="text-xl md:text-2xl mb-8 text-green-100 max-w-3xl mx-auto">
            {t('cta.subheading')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-green-600 hover:text-white hover:bg-green-500" asChild>
              <Link href={`/${locale}/contact?subject=b2b`}>
                {t('cta.button')}
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10" asChild>
              <a href="tel:+32467871205">
                {t('cta.phone')}
              </a>
            </Button>
          </div>
          <p className="mt-8 text-green-100">
            {t('cta.responseTime')}
          </p>
        </div>
      </section>
    </div>
  );
}
