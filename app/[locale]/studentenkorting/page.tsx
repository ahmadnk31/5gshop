import { useTranslations } from 'next-intl'
import { getTranslations } from 'next-intl/server'
import { GraduationCap, Sparkles, CheckCircle2, ArrowRight, Phone, CreditCard } from 'lucide-react'
import Link from 'next/link'
import StudentDiscountBanner from '@/components/student-discount-banner'

import { generatePageMetadata } from '@/lib/seo';
import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'studentPage' })
  
  return await generatePageMetadata({
    title: t('metaTitle'),
    description: t('metaDescription'),
    path: '/studentenkorting',
    keywords: t('metaKeywords').split(',').map((k: string) => k.trim()),
    locale
  })
}

export default async function StudentDiscountPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-6 py-2 mb-6">
              <GraduationCap className="w-5 h-5 text-primary-300" />
              <span className="font-semibold">Student Deal</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="text-primary-300">10% Korting</span> voor Studenten
            </h1>
            
            <p className="text-xl md:text-2xl mb-8 text-primary-100">
              Toon je studentenkaart en bespaar direct op alle reparaties
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href={`/${locale}/contact`}
                className="inline-flex bg-green-600 text-white items-center gap-2 px-8 py-4 rounded-lg font-bold text-lg hover:bg-green-700 transition-colors"
              >
                Claim Je Korting
                <ArrowRight className="w-5 h-5" />
              </Link>
              
              <Link 
                href={`/${locale}/services`}
                className="inline-flex items-center gap-2 bg-white/20 border-green-600 border text-green-600 hover:bg-green-600 hover:text-white backdrop-blur-sm px-8 py-4 rounded-lg font-bold text-lg transition-colors"
              >
                Bekijk Prijzen
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Banner */}
      <section className="py-16 bg-gradient-to-b from-white to-slate-50">
        <div className="container mx-auto px-4">
          <StudentDiscountBanner />
        </div>
      </section>

      {/* How to Get Discount */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              Hoe Krijg Je de Studentenkorting?
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary-600">1</span>
                </div>
                <h3 className="text-xl font-bold mb-3">Breng Je Kaart Mee</h3>
                <p className="text-gray-600">
                  Geldige studentenkaart van KU Leuven, Groep T, UCLL of andere onderwijsinstellingen.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary-600">2</span>
                </div>
                <h3 className="text-xl font-bold mb-3">Toon Bij Afrekenen</h3>
                <p className="text-gray-600">
                  Laat je kaart zien voordat we de reparatie starten. Simpel en snel!
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary-600">3</span>
                </div>
                <h3 className="text-xl font-bold mb-3">10% Korting</h3>
                <p className="text-gray-600">
                  Direct 10% korting op je totale reparatieprijs. Geen gedoe!
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
              Waarom Studenten Ons Kiezen
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-md">
                <CheckCircle2 className="w-8 h-8 text-primary mb-3" />
                <h3 className="text-xl font-bold mb-2">Betaalbare Prijzen</h3>
                <p className="text-gray-600">
                  10% korting bovenop onze al scherpe prijzen. Geen verborgen kosten.
                </p>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-md">
                <CheckCircle2 className="w-8 h-8 text-primary mb-3" />
                <h3 className="text-xl font-bold mb-2">Super Snel</h3>
                <p className="text-gray-600">
                  30 minuten express service. Perfect tussen colleges door!
                </p>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-md">
                <CheckCircle2 className="w-8 h-8 text-primary mb-3" />
                <h3 className="text-xl font-bold mb-2">Dichtbij Campus</h3>
                <p className="text-gray-600">
                  Bondgenotenlaan 84A - makkelijk bereikbaar vanaf alle campussen in Leuven.
                </p>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-md">
                <CheckCircle2 className="w-8 h-8 text-primary mb-3" />
                <h3 className="text-xl font-bold mb-2">Flexibel Betalen</h3>
                <p className="text-gray-600">
                  Cash, Bancontact, creditcard - betaal zoals je wilt.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Common Repairs */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
              Populaire Studenten Reparaties
            </h2>
            <p className="text-center text-gray-600 mb-12">
              Met 10% studentenkorting toegepast
            </p>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="border-2 border-primary-200 rounded-xl p-6 hover:border-primary-400 transition-colors">
                <h3 className="text-xl font-bold mb-2">iPhone Scherm</h3>
                <p className="text-sm text-gray-600 mb-3">Meest voorkomende reparatie</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-primary">€63</span>
                  <span className="text-lg text-gray-500 line-through">€70</span>
                </div>
                <p className="text-xs text-primary mt-2">✓ 10% bespaard</p>
              </div>
              
              <div className="border-2 border-primary-200 rounded-xl p-6 hover:border-primary-400 transition-colors">
                <h3 className="text-xl font-bold mb-2">Samsung Scherm</h3>
                <p className="text-sm text-gray-600 mb-3">Galaxy S & A serie</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-primary">€54</span>
                  <span className="text-lg text-gray-500 line-through">€60</span>
                </div>
                <p className="text-xs text-primary mt-2">✓ 10% bespaard</p>
              </div>
              
              <div className="border-2 border-primary-200 rounded-xl p-6 hover:border-primary-400 transition-colors">
                <h3 className="text-xl font-bold mb-2">Batterij Vervangen</h3>
                <p className="text-sm text-gray-600 mb-3">Alle merken</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-primary">€45</span>
                  <span className="text-lg text-gray-500 line-through">€50</span>
                </div>
                <p className="text-xs text-primary mt-2">✓ 10% bespaard</p>
              </div>
            </div>
            
            <p className="text-center text-sm text-gray-500 mt-8">
              * Prijzen zijn voorbeelden en kunnen variëren per model. Gratis diagnose altijd inbegrepen.
            </p>
          </div>
        </div>
      </section>

      {/* Accepted Cards */}
      <section className="py-16 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-8">
              Welke Studentenkaarten Accepteren We?
            </h2>
            
            <div className="grid md:grid-cols-2 gap-4 text-left">
              <div className="bg-white rounded-lg p-6 flex items-start gap-4">
                <GraduationCap className="w-8 h-8 text-primary flex-shrink-0" />
                <div>
                  <h3 className="font-bold mb-1">KU Leuven</h3>
                  <p className="text-sm text-gray-600">Alle faculteiten en campussen</p>
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-6 flex items-start gap-4">
                <GraduationCap className="w-8 h-8 text-primary flex-shrink-0" />
                <div>
                  <h3 className="font-bold mb-1">UCLL</h3>
                  <p className="text-sm text-gray-600">UC Leuven-Limburg</p>
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-6 flex items-start gap-4">
                <GraduationCap className="w-8 h-8 text-primary flex-shrink-0" />
                <div>
                  <h3 className="font-bold mb-1">Groep T</h3>
                  <p className="text-sm text-gray-600">Hogeschool campus</p>
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-6 flex items-start gap-4">
                <GraduationCap className="w-8 h-8 text-primary flex-shrink-0" />
                <div>
                  <h3 className="font-bold mb-1">Andere</h3>
                  <p className="text-sm text-gray-600">Geldige studentenkaart? Je bent welkom!</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary-600 to-primary-700 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <Sparkles className="w-16 h-16 text-primary-300 mx-auto mb-6 animate-pulse" />
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Klaar om 10% te Besparen?
            </h2>
            <p className="text-xl mb-8 text-primary-100">
              Kom langs met je studentenkaart - geen afspraak nodig!
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Link 
                href={`/${locale}/contact`}
                className="inline-flex items-center bg-green-600 gap-2 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-green-700 transition-colors"
              >
                <Phone className="w-5 h-5" />
                Vraag Info
              </Link>
              
              <Link 
                href={`/${locale}/services`}
                className="inline-flex items-center text-green-600 border border-green-600 hover:text-white hover:bg-green-600 gap-2 bg-white/20 backdrop-blur-sm text-white px-8 py-4 rounded-lg font-bold text-lg transition-colors"
              >
                <CreditCard className="w-5 h-5" />
                Bekijk Prijzen
              </Link>
            </div>
            
            <p className="text-sm text-primary-100">
              📍 Bondgenotenlaan 84A, 3000 Leuven | 🎓 10% korting met studentenkaart
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
