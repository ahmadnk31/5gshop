'use client'

import { useTranslations } from 'next-intl'
import { Clock, Zap, CheckCircle2, TrendingUp } from 'lucide-react'

export default function SpeedComparison() {
  const t = useTranslations('speedComparison')

  return (
    <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-3xl p-8 sm:p-12 shadow-xl">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-semibold mb-4">
          <TrendingUp className="w-4 h-4" />
          {t('badge')}
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
          {t('title')}
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          {t('subtitle')}
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {/* Competitors */}
        <div className="bg-white rounded-2xl p-8 border-2 border-gray-200 relative">
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gray-400 text-white px-6 py-1 rounded-full text-sm font-semibold">
            {t('competitors')}
          </div>
          
          <div className="mt-4 text-center">
            <Clock className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <div className="text-6xl font-bold text-gray-700 mb-2">60</div>
            <div className="text-xl text-gray-500 mb-6">{t('minutes')}</div>
            
            <div className="space-y-3 text-left">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-2 h-2 rounded-full bg-gray-400" />
                </div>
                <span className="text-gray-600">{t('competitor1')}</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-2 h-2 rounded-full bg-gray-400" />
                </div>
                <span className="text-gray-600">{t('competitor2')}</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-2 h-2 rounded-full bg-gray-400" />
                </div>
                <span className="text-gray-600">{t('competitor3')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* 5G Phones */}
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-8 border-2 border-green-400 relative shadow-2xl transform md:scale-105">
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-yellow-400 text-gray-900 px-6 py-1 rounded-full text-sm font-bold animate-pulse">
            {t('us')} ⚡
          </div>
          
          <div className="mt-4 text-center">
            <Zap className="w-16 h-16 mx-auto text-yellow-300 mb-4 animate-bounce" />
            <div className="text-6xl font-bold text-white mb-2">30</div>
            <div className="text-xl text-green-100 mb-6">{t('minutes')}</div>
            
            <div className="space-y-3 text-left">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-200 flex-shrink-0 mt-0.5" />
                <span className="text-white font-medium">{t('advantage1')}</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-200 flex-shrink-0 mt-0.5" />
                <span className="text-white font-medium">{t('advantage2')}</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-200 flex-shrink-0 mt-0.5" />
                <span className="text-white font-medium">{t('advantage3')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom stats */}
      <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
        <div className="text-center">
          <div className="text-3xl font-bold text-green-600 mb-2">2x</div>
          <div className="text-sm text-gray-600">{t('stat1')}</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-green-600 mb-2">6</div>
          <div className="text-sm text-gray-600">{t('stat2')}</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-green-600 mb-2">100%</div>
          <div className="text-sm text-gray-600">{t('stat3')}</div>
        </div>
      </div>
    </div>
  )
}
