import { useTranslations } from 'next-intl'
import { getTranslations } from 'next-intl/server'
import { Clock, Zap, CheckCircle2, ArrowRight, Phone, MapPin } from 'lucide-react'
import Link from 'next/link'
import SpeedComparison from '@/components/speed-comparison'

import { generatePageMetadata } from '@/lib/seo';
import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'speedPage' })
  
  return await generatePageMetadata({
    title: t('metaTitle'),
    description: t('metaDescription'),
    path: '/30-minuten-reparatie',
    keywords: t('metaKeywords').split(',').map((k: string) => k.trim()),
    locale
  })
}

export default async function SpeedRepairPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-6 py-2 mb-6">
              <Zap className="w-5 h-5 text-primary-300 animate-pulse" />
              <span className="font-semibold">Express Service</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Smartphone Reparatie in <span className="text-primary-300">30 Minuten</span>
            </h1>
            
            <p className="text-xl md:text-2xl mb-8 text-primary-100">
              2X Sneller dan Andere Winkels in Leuven
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href={`/${locale}/contact`}
                className="inline-flex items-center gap-2 bg-primary text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-primary-700 transition-colors"
              >
                Reserveer Nu
                <ArrowRight className="w-5 h-5" />
              </Link>
              
              <Link 
                href={`/${locale}/services`}
                className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm ring-1 ring-white/30 px-8 py-4 rounded-lg font-bold text-lg hover:bg-white/30 transition-colors"
              >
                Bekijk Diensten
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Speed Comparison */}
      <section className="py-16 bg-gradient-to-b from-white to-slate-50">
        <div className="container mx-auto px-4">
          <SpeedComparison />
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              Hoe Werkt Onze 30-Minuten Service?
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary-600">1</span>
                </div>
                <h3 className="text-xl font-bold mb-3">Kom Binnen</h3>
                <p className="text-gray-600">
                  Loop gewoon binnen, geen afspraak nodig. Bondgenotenlaan 84A, Leuven.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary-600">2</span>
                </div>
                <h3 className="text-xl font-bold mb-3">Gratis Diagnose</h3>
                <p className="text-gray-600">
                  Onze expert controleert je toestel en geeft direct een prijsindicatie.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary-600">3</span>
                </div>
                <h3 className="text-xl font-bold mb-3">Klaar in 30 Min</h3>
                <p className="text-gray-600">
                  Wacht even of kom terug - je toestel is klaar in 30 minuten!
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 bg-gradient-to-br from-primary-50 to-primary-100">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              Waarom 30 Minuten Service Kiezen?
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-md">
                <CheckCircle2 className="w-8 h-8 text-primary mb-3" />
                <h3 className="text-xl font-bold mb-2">Bespaar Tijd</h3>
                <p className="text-gray-600">
                  Geen hele dag wachten. 30 minuten en je bent weer onderweg.
                </p>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-md">
                <CheckCircle2 className="w-8 h-8 text-primary mb-3" />
                <h3 className="text-xl font-bold mb-2">Geen Afspraak</h3>
                <p className="text-gray-600">
                  Kom wanneer het jou uitkomt. Walk-in altijd welkom.
                </p>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-md">
                <CheckCircle2 className="w-8 h-8 text-primary mb-3" />
                <h3 className="text-xl font-bold mb-2">Expert Technici</h3>
                <p className="text-gray-600">
                  Snelheid zonder compromis op kwaliteit. Professionals aan het werk.
                </p>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-md">
                <CheckCircle2 className="w-8 h-8 text-primary mb-3" />
                <h3 className="text-xl font-bold mb-2">6 Maanden Garantie</h3>
                <p className="text-gray-600">
                  Snel én betrouwbaar. Volledige garantie op alle reparaties.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Supported Devices */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-8">
              Alle Merken in 30 Minuten
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              iPhone, Samsung, Huawei, OnePlus, Google Pixel, Xiaomi en meer
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-left">
              <div className="bg-primary-50 rounded-lg p-4">
                <Zap className="w-6 h-6 text-primary mb-2" />
                <h4 className="font-bold">iPhone</h4>
                <p className="text-sm text-gray-600">Alle modellen</p>
              </div>
              <div className="bg-primary-50 rounded-lg p-4">
                <Zap className="w-6 h-6 text-primary mb-2" />
                <h4 className="font-bold">Samsung</h4>
                <p className="text-sm text-gray-600">Galaxy serie</p>
              </div>
              <div className="bg-primary-50 rounded-lg p-4">
                <Zap className="w-6 h-6 text-primary mb-2" />
                <h4 className="font-bold">Huawei</h4>
                <p className="text-sm text-gray-600">P & Mate serie</p>
              </div>
              <div className="bg-primary-50 rounded-lg p-4">
                <Zap className="w-6 h-6 text-primary mb-2" />
                <h4 className="font-bold">Meer</h4>
                <p className="text-sm text-gray-600">OnePlus, Pixel, etc</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary-600 to-primary-700 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Klaar om 30 Minuten te Besparen?
            </h2>
            <p className="text-xl mb-8 text-primary-100">
              Kom langs bij 5G Phones - geen afspraak nodig!
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Link 
                href={`/${locale}/contact`}
                className="inline-flex items-center gap-2 bg-white text-primary px-8 py-4 rounded-lg font-bold text-lg hover:bg-primary-50 transition-colors"
              >
                <Phone className="w-5 h-5" />
                Contact
              </Link>
              
              <Link 
                href="https://maps.google.com/?q=Bondgenotenlaan+84A+Leuven"
                target="_blank"
                className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-8 py-4 rounded-lg font-bold text-lg hover:bg-white/30 transition-colors"
              >
                <MapPin className="w-5 h-5" />
                Vind Ons
              </Link>
            </div>
            
            <p className="text-sm text-primary-100">
              📍 Bondgenotenlaan 84A, 3000 Leuven | ⏰ Ma-Za 10:00-18:00
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
