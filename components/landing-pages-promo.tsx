'use client'

import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { Zap, GraduationCap, ArrowRight } from 'lucide-react'

export default function LandingPagesPromo() {
  const t = useTranslations('homepage')
  
  return (
    <section className="py-16 bg-gradient-to-br from-primary-50 to-primary-100">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Speed Service Card */}
          <Link 
            href="/nl/30-minuten-reparatie"
            className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-primary"
          >
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-16 h-16 bg-primary rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Zap className="w-8 h-8 text-white animate-pulse" />
              </div>
              
              <div className="flex-1">
                <div className="inline-flex items-center gap-2 bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm font-bold mb-3">
                  ⚡ Express Service
                </div>
                
                <h3 className="text-2xl font-bold mb-2 group-hover:text-primary transition-colors">
                  30 Minuten Reparatie
                </h3>
                
                <p className="text-gray-600 mb-4">
                  2X sneller dan andere winkels. Zonder afspraak welkom!
                </p>
                
                <div className="flex items-center gap-2 text-primary font-bold group-hover:gap-4 transition-all">
                  Ontdek meer
                  <ArrowRight className="w-5 h-5" />
                </div>
              </div>
            </div>
          </Link>

          {/* Student Discount Card */}
          <Link 
            href="/nl/studentenkorting"
            className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-primary"
          >
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-16 h-16 bg-primary rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <GraduationCap className="w-8 h-8 text-white" />
              </div>
              
              <div className="flex-1">
                <div className="inline-flex items-center gap-2 bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm font-bold mb-3">
                  🎓 Student Deal
                </div>
                
                <h3 className="text-2xl font-bold mb-2 group-hover:text-primary transition-colors">
                  10% Studentenkorting
                </h3>
                
                <p className="text-gray-600 mb-4">
                  Toon je studentenkaart en bespaar op alle reparaties!
                </p>
                
                <div className="flex items-center gap-2 text-primary font-bold group-hover:gap-4 transition-all">
                  Claim korting
                  <ArrowRight className="w-5 h-5" />
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </section>
  )
}
