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
  Gamepad2
} from "lucide-react";

import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { generatePageMetadata } from "@/lib/seo";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return await generatePageMetadata({
    title: "Reparatie Leuven | Hardware & Software - iPhone, Laptop, Windows Installatie ⭐",
    description: "⭐ Complete reparatie service Leuven - Hardware: iPhone scherm, MacBook batterij, Laptop herstel • Software: Windows installatie, Password reset, Virus verwijdering, Data recovery ✓ Same-day service ✓ 6 maanden garantie ✓ Bondgenotenlaan 84A. All tech problems solved!",
    path: "/repairs",
    keywords: [
      // Primary Repair Keywords
      "gsm herstellen leuven",
      "gsm reparatie leuven",
      "smartphone reparatie leuven",
      "telefoon reparatie leuven",
      "mobiel herstel leuven",
      
      // iPhone Repair
      "iphone reparatie leuven",
      "iphone herstel leuven",
      "iphone scherm vervangen leuven",
      "iphone battery replacement leuven",
      "iphone repair leuven",
      
      // MacBook Repair
      "macbook reparatie leuven",
      "macbook herstel leuven",
      "macbook repair leuven",
      "macbook scherm vervangen leuven",
      "macbook battery replacement leuven",
      "macbook keyboard reparatie",
      
      // Laptop Repair
      "laptop reparatie leuven",
      "laptop herstel leuven",
      "laptop repair leuven",
      "laptop scherm vervangen leuven",
      "windows laptop repair leuven",
      "notebook reparatie leuven",
      
      // iPad & Tablet Repair
      "ipad reparatie leuven",
      "ipad herstel leuven",
      "ipad screen repair leuven",
      "tablet reparatie leuven",
      "tablet herstel leuven",
      "samsung tablet repair leuven",
      
      // Desktop & Computer
      "desktop reparatie leuven",
      "computer reparatie leuven",
      "pc reparatie leuven",
      "imac reparatie leuven",
      "computer herstel leuven",
      
      // Service Types
      "scherm reparatie leuven",
      "batterij vervanging leuven",
      "waterschade reparatie leuven",
      "snelle reparatie leuven",
      "screen repair leuven",
      "battery replacement leuven",
      
      // Brands
      "samsung reparatie leuven",
      "huawei reparatie leuven",
      "xiaomi reparatie leuven",
      "apple reparatie leuven",
      "hp laptop repair leuven",
      "dell laptop repair leuven",
      
      // SOFTWARE SERVICES - HIGH PRIORITY
      // Windows & OS Installation
      "windows installatie leuven",
      "windows installation leuven",
      "windows herinstalleren leuven",
      "windows 10 installatie leuven",
      "windows 11 installatie leuven",
      "os installation leuven",
      "macos installatie leuven",
      "operating system install leuven",
      
      // Software Repair
      "software reparatie leuven",
      "software repair leuven",
      "iphone software repair leuven",
      "iphone software probleem leuven",
      "samsung software repair leuven",
      "android software repair leuven",
      "macbook software repair leuven",
      "laptop software repair leuven",
      "computer software problems leuven",
      
      // Password & Security
      "password reset leuven",
      "wachtwoord vergeten leuven",
      "iphone password reset leuven",
      "samsung password reset leuven",
      "windows password reset leuven",
      "laptop password reset leuven",
      "forgot password leuven",
      "unlock iphone leuven",
      "unlock samsung leuven",
      "icloud unlock leuven",
      "google account recovery leuven",
      "bitlocker recovery leuven",
      
      // Virus & Malware
      "virus verwijdering leuven",
      "virus removal leuven",
      "malware removal leuven",
      "spyware removal leuven",
      "ransomware removal leuven",
      "computer virus leuven",
      "laptop virus leuven",
      
      // Performance Issues
      "computer slow leuven",
      "laptop traag leuven",
      "slow computer repair leuven",
      "computer troubleshooting leuven",
      "laptop troubleshooting leuven",
      "pc optimization leuven",
      "computer cleanup leuven",
      
      // Data Services
      "data recovery leuven",
      "data herstel leuven",
      "data backup leuven",
      "data transfer leuven",
      "iphone data recovery leuven",
      "laptop data recovery leuven",
      "hard drive recovery leuven",
      "ssd data recovery leuven",
      
      // System Services
      "system update leuven",
      "ios update leuven",
      "android update leuven",
      "windows update leuven",
      "software update leuven",
      "firmware update leuven",
      "bios update leuven",
      "driver installation leuven",
      
      // Technical Issues
      "technische problemen leuven",
      "technical issues leuven",
      "computer problems leuven",
      "laptop problems leuven",
      "blue screen repair leuven",
      "boot problems leuven",
      "startup issues leuven",
      
      // Location-specific
      "reparatie leuven centrum",
      "smartphone herstel bondgenotenlaan",
      "device repair leuven",
      "phone repair leuven",
      "mobile repair leuven",
      "computer service leuven",
      "it support leuven"
    ]
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
];

export default async function RepairsPage() {
  const t = await getTranslations('repairs');

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
