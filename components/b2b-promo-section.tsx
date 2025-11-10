'use client';

import { Building2, TrendingDown, Shield, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';

export default function B2BPromoSection() {
  const t = useTranslations('homepage');

  return (
    <section className="py-16 bg-gradient-to-br from-primary-50 to-primary-100">
      <div className="container mx-auto px-4">
        <Card className="max-w-5xl mx-auto overflow-hidden py-0 border-2 border-primary-200 shadow-xl hover:shadow-2xl transition-shadow duration-300 hover:border-green-700">
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-8 px-6 md:px-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Building2 className="w-8 h-8" />
              <h2 className="text-3xl md:text-4xl font-bold text-center">
                {t('b2bPromo.title')}
              </h2>
            </div>
            <p className="text-xl text-center text-primary-100 max-w-3xl mx-auto">
              {t('b2bPromo.subtitle')}
            </p>
          </div>

          <CardContent className="py-8 px-6 md:px-8">
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                  <TrendingDown className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{t('b2bPromo.benefit1.title')}</h3>
                <p className="text-gray-600 text-sm">{t('b2bPromo.benefit1.description')}</p>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                  <Shield className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{t('b2bPromo.benefit2.title')}</h3>
                <p className="text-gray-600 text-sm">{t('b2bPromo.benefit2.description')}</p>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                  <Truck className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{t('b2bPromo.benefit3.title')}</h3>
                <p className="text-gray-600 text-sm">{t('b2bPromo.benefit3.description')}</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-green-600 hover:bg-green-700" asChild>
                <Link href="/b2b">
                  {t('b2bPromo.ctaPrimary')}
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-green-600 text-green-600 hover:bg-green-50" asChild>
                <Link href="/contact?subject=b2b">
                  {t('b2bPromo.ctaSecondary')}
                </Link>
              </Button>
            </div>

            <p className="text-center text-sm text-gray-600 mt-6">
              {t('b2bPromo.note')}
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
