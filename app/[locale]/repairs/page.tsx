import { Button } from "@/components/ui/button";
import { 
  Clock,
  Shield,
  Star,
  Award,
  Smartphone,
  Tablet,
  Laptop,
  Watch,
  Monitor,
  Gamepad2,
  X
} from "lucide-react";

import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { generatePageMetadata } from "@/lib/seo";
import { Metadata } from "next";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'repairs' });
  
  return await generatePageMetadata({
    title: t('meta.title'),
    description: t('meta.description'),
    path: "/repairs",
    keywords: t('meta.keywords').split(',').map((k: string) => k.trim())
  });
}

type DeviceIcon = typeof Smartphone | typeof Tablet | typeof Laptop | typeof Watch | typeof Monitor | typeof Gamepad2;

const deviceTypeInfo: Array<{
  slug: string;
  icon: DeviceIcon;
  labelKey: string;
}> = [
  { slug: 'smartphone', icon: Smartphone, labelKey: 'smartphone' },
  { slug: 'tablet', icon: Tablet, labelKey: 'tablet' },
  { slug: 'laptop', icon: Laptop, labelKey: 'laptop' },
  { slug: 'smartwatch', icon: Watch, labelKey: 'smartwatch' },
  { slug: 'desktop', icon: Monitor, labelKey: 'desktop' },
  { slug: 'gaming-console', icon: Gamepad2, labelKey: 'gamingConsole' },
  { slug: 'other', icon: X, labelKey: 'other' },
];

export default async function RepairsPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'repairs' });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-green-600 to-green-700 text-white py-16 overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {t('hero.title', { defaultValue: 'Professional Device Repair Services' })}
            </h1>
            <p className="text-xl text-green-50 mb-8">
              {t('hero.subtitle', { defaultValue: 'Fast, reliable, and affordable repairs for all your devices' })}
            </p>
            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg" variant="secondary" className="shadow-lg">
                <Link href="/quote">{t('hero.getQuote', { defaultValue: 'Get Free Quote' })}</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="bg-white/10 border-white hover:bg-white hover:text-green-700">
                <Link href="/contact">{t('hero.contact', { defaultValue: 'Contact Us' })}</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-8 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <Award className="h-8 w-8 mx-auto mb-2 text-green-600" />
              <p className="font-semibold text-gray-900">{t('trust.certified', { defaultValue: 'Certified Technicians' })}</p>
            </div>
            <div>
              <Shield className="h-8 w-8 mx-auto mb-2 text-green-600" />
              <p className="font-semibold text-gray-900">{t('trust.warranty', { defaultValue: '90-Day Warranty' })}</p>
            </div>
            <div>
              <Clock className="h-8 w-8 mx-auto mb-2 text-green-600" />
              <p className="font-semibold text-gray-900">{t('trust.fast', { defaultValue: 'Same-Day Service' })}</p>
            </div>
            <div>
              <Star className="h-8 w-8 mx-auto mb-2 text-green-600" />
              <p className="font-semibold text-gray-900">{t('trust.quality', { defaultValue: 'Quality Parts' })}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Device Selection */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-900">
            {t('selectDevice.title', { defaultValue: 'Select Your Device Type' })}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {deviceTypeInfo.map((device) => {
              const Icon = device.icon;
              return (
                <Link
                  key={device.slug}
                  href={`/repairs/${device.slug}`}
                  className="p-8 rounded-xl border-2 border-gray-200 bg-white hover:border-green-300 hover:shadow-lg transition-all group"
                >
                  <Icon className="h-16 w-16 mx-auto mb-4 text-gray-400 group-hover:text-green-600 transition-colors" />
                  <p className="font-semibold text-gray-700 group-hover:text-green-700 text-center text-lg transition-colors">
                    {t(`deviceTypes.${device.labelKey}`)}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            {t('whyChoose.title', { defaultValue: 'Why Choose Our Repair Services?' })}
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">
                {t('whyChoose.expertise.title', { defaultValue: 'Expert Technicians' })}
              </h3>
              <p className="text-gray-600">
                {t('whyChoose.expertise.desc', { defaultValue: 'Certified professionals with years of experience' })}
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">
                {t('whyChoose.warranty.title', { defaultValue: 'Quality Guarantee' })}
              </h3>
              <p className="text-gray-600">
                {t('whyChoose.warranty.desc', { defaultValue: '90-day warranty on all repairs and parts' })}
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">
                {t('whyChoose.speed.title', { defaultValue: 'Fast Turnaround' })}
              </h3>
              <p className="text-gray-600">
                {t('whyChoose.speed.desc', { defaultValue: 'Most repairs completed same day' })}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-green-600 to-green-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            {t('cta.title', { defaultValue: 'Ready to Fix Your Device?' })}
          </h2>
          <p className="text-xl text-green-50 mb-8 max-w-2xl mx-auto">
            {t('cta.description', { defaultValue: 'Get a free quote today and have your device repaired by certified technicians' })}
          </p>
          <Button asChild size="lg" variant="secondary" className="shadow-lg">
            <Link href="/quote">{t('cta.button', { defaultValue: 'Get Free Quote' })}</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
