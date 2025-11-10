'use client'

import { useTranslations } from 'next-intl'
import { GraduationCap, Sparkles } from 'lucide-react'

export default function StudentDiscountBanner() {
  const t = useTranslations('studentDiscount')

  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl shadow-2xl">
      {/* Animated background effect */}
      <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,transparent,black)]" />
      
      <div className="relative px-6 py-8 sm:px-12 sm:py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Left side - Icon and text */}
          <div className="flex items-center gap-4 text-white">
            <div className="flex-shrink-0">
              <div className="relative">
                <GraduationCap className="w-16 h-16 sm:w-20 sm:h-20" />
                <Sparkles className="absolute -top-1 -right-1 w-6 h-6 text-yellow-300 animate-pulse" />
              </div>
            </div>
            <div>
              <h3 className="text-2xl sm:text-3xl font-bold mb-2">
                {t('title')}
              </h3>
              <p className="text-lg sm:text-xl text-blue-50">
                {t('subtitle')}
              </p>
            </div>
          </div>

          {/* Right side - CTA */}
          <div className="flex-shrink-0 text-center md:text-right">
            <div className="bg-white/20 backdrop-blur-sm rounded-xl px-6 py-4 border-2 border-white/30">
              <p className="text-sm font-medium text-white/90 mb-1">
                {t('show')}
              </p>
              <p className="text-4xl font-bold text-white">
                {t('discount')}
              </p>
              <p className="text-sm mt-1">
                {t('allServices')}
              </p>
            </div>
          </div>
        </div>

        {/* Bottom note */}
        <div className="mt-6 text-center md:text-left">
          <p className="text-sm text-white/80 flex items-center justify-center md:justify-start gap-2">
            <span className="inline-block w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            {t('valid')}
          </p>
        </div>
      </div>
    </div>
  )
}
