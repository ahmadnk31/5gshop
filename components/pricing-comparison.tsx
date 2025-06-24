import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, TrendingDown, Star, Clock, Shield, Award, Users } from "lucide-react";
import Link from "next/link";
import { getCompetitivePricing, getPricingStats } from "@/app/actions/competitive-pricing-actions";
import { getTranslations } from "next-intl/server";

export async function PricingComparison() {
  // Fetch competitive pricing data from the database
  const pricingData = await getCompetitivePricing(undefined, 12);
  const stats = await getPricingStats();

  const t = await getTranslations('pricingComparison');

  return (
    <section className="py-16 bg-gradient-to-br from-green-50 to-blue-50">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
            {t('title')}
          </h2>
          <p className="text-lg md:text-xl text-gray-600 mb-6 max-w-3xl mx-auto">
            {t('subtitle')}
          </p>
          <div className="inline-flex items-center space-x-2 bg-green-100 text-green-800 px-6 py-3 rounded-full font-semibold">
            <TrendingDown className="h-5 w-5" />
            <span>{t('averageSavings', { amount: stats.averageSavings })}</span>
          </div>
        </div>

        <div className="max-w-6xl mx-auto">
          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="text-center p-6 shadow-md">
              <div className="text-3xl font-bold text-green-600 mb-2">{pricingData.length}</div>
              <div className="text-gray-600">{t('stats.servicesCompared')}</div>
            </Card>
            <Card className="text-center p-6 shadow-md">
              <div className="text-3xl font-bold text-blue-600 mb-2">€{stats.averageSavings}</div>
              <div className="text-gray-600">{t('stats.averageSavings')}</div>
            </Card>
            <Card className="text-center p-6 shadow-md">
              <div className="text-3xl font-bold text-purple-600 mb-2">{Math.round(stats.averageSavingsPercentage)}%</div>
              <div className="text-gray-600">{t('stats.averageDiscount')}</div>
            </Card>
          </div>

          {/* Main Comparison */}
          <Card className="shadow-lg">
            <CardHeader className="pb-6">
              <CardTitle className="text-2xl text-gray-900 mb-2">{t('comparison.title')}</CardTitle>
              <CardDescription className="text-lg text-gray-600">
                {t('comparison.subtitle')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Desktop Header - Hidden on mobile */}
                <div className="hidden lg:grid lg:grid-cols-4 gap-6 p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg border font-semibold">
                  <div className="text-left">{t('comparison.headers.service')}</div>
                  <div className="text-center">{t('comparison.headers.ourPrice')}</div>
                  <div className="text-center">{t('comparison.headers.ifixersPrice')}</div>
                  <div className="text-center">{t('comparison.headers.youSave')}</div>
                </div>
                
                {/* Service Rows */}
                {pricingData.map((item) => (
                  <div
                    key={item.id}
                    className={`border rounded-lg p-6 transition-all hover:shadow-md ${
                      item.popular ? 'bg-yellow-50 border-yellow-300 shadow-sm' : 'bg-white border-gray-200'
                    }`}
                  >
                    {/* Mobile Layout */}
                    <div className="lg:hidden">
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-lg text-gray-900">{item.service}</h3>
                          {item.popular && (
                            <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                              <Star className="h-3 w-3 mr-1" />
                              {t('comparison.popular')}
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <Badge variant="outline" className="text-xs">
                            {item.deviceType.toLowerCase().replace('_', ' ')}
                          </Badge>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>{item.estimatedTime}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4">
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                          <p className="text-xs text-gray-500 mb-1">{t('comparison.headers.ourPrice')}</p>
                          <p className="text-xl font-bold text-green-600">€{item.ourPrice}</p>
                        </div>
                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                          <p className="text-xs text-gray-500 mb-1">{t('comparison.headers.ifixersPrice')}</p>
                          <p className="text-xl text-gray-600 line-through">€{item.ifixersPrice}</p>
                        </div>
                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                          <p className="text-xs text-gray-500 mb-1">{t('comparison.headers.youSave')}</p>
                          <p className="text-xl font-bold text-blue-600">€{item.savings}</p>
                          <p className="text-sm text-blue-600">({item.savingsPercentage}%)</p>
                        </div>
                      </div>
                    </div>

                    {/* Desktop Layout */}
                    <div className="hidden lg:grid lg:grid-cols-4 gap-6 items-center">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-lg text-gray-900">{item.service}</h3>
                          {item.popular && (
                            <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                              <Star className="h-3 w-3 mr-1" />
                              {t('comparison.popular')}
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <Badge variant="outline" className="text-xs">
                            {item.deviceType.toLowerCase().replace('_', ' ')}
                          </Badge>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>{item.estimatedTime}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-center">
                        <span className="text-2xl font-bold text-green-600">€{item.ourPrice}</span>
                      </div>
                      
                      <div className="text-center">
                        <span className="text-2xl text-gray-600 line-through">€{item.ifixersPrice}</span>
                      </div>
                      
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600 mb-1">€{item.savings}</div>
                        <div className="text-sm text-blue-600 font-medium">({item.savingsPercentage}%)</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Benefits Section */}
        <div className="max-w-4xl mx-auto mt-16">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Benefits Card */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-3 text-xl text-gray-900">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                  <span>{t('benefits.title')}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-green-100 p-3 rounded-full">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">{t('benefits.lowerPrices.title')}</h4>
                    <p className="text-gray-600">
                      {t('benefits.lowerPrices.description', { amount: stats.averageSavings })}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <Clock className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">{t('benefits.sameDayService.title')}</h4>
                    <p className="text-gray-600">
                      {t('benefits.sameDayService.description')}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="bg-purple-100 p-3 rounded-full">
                    <Shield className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">{t('benefits.qualityGuarantee.title')}</h4>
                    <p className="text-gray-600">
                      {t('benefits.qualityGuarantee.description')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* CTA Card */}
            <Card className="bg-gradient-to-r from-green-600 to-blue-600 text-white shadow-lg">
              <CardContent className="p-8 text-center">
                <h3 className="text-2xl font-bold mb-4">
                  {t('cta.title')}
                </h3>
                <p className="mb-6 text-green-100 text-lg">
                  {t('cta.subtitle')}
                </p>
                <Button asChild size="lg" variant="secondary" className="w-full py-3 text-lg">
                  <Link href="/quote">
                    {t('cta.button')}
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="max-w-5xl mx-auto mt-16">
          <Card className="bg-white shadow-lg">
            <CardContent className="p-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                <div>
                  <div className="flex items-center justify-center mb-3">
                    <Users className="h-10 w-10 text-green-600" />
                  </div>
                  <div className="text-3xl font-bold text-green-600 mb-2">500+</div>
                  <p className="text-gray-600">{t('trustIndicators.happyCustomers')}</p>
                </div>
                <div>
                  <div className="flex items-center justify-center mb-3">
                    <Clock className="h-10 w-10 text-blue-600" />
                  </div>
                  <div className="text-3xl font-bold text-blue-600 mb-2">24-48h</div>
                  <p className="text-gray-600">{t('trustIndicators.averageRepairTime')}</p>
                </div>
                <div>
                  <div className="flex items-center justify-center mb-3">
                    <Shield className="h-10 w-10 text-purple-600" />
                  </div>
                  <div className="text-3xl font-bold text-purple-600 mb-2">90 Days</div>
                  <p className="text-gray-600">{t('trustIndicators.warrantyPeriod')}</p>
                </div>
                <div>
                  <div className="flex items-center justify-center mb-3">
                    <TrendingDown className="h-10 w-10 text-orange-600" />
                  </div>
                  <div className="text-3xl font-bold text-orange-600 mb-2">€{stats.averageSavings}</div>
                  <p className="text-gray-600">{t('trustIndicators.averageSavings')}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-gray-500 max-w-2xl mx-auto">
            {t('disclaimer', { date: new Date().toLocaleDateString() })}
          </p>
        </div>
      </div>
    </section>
  );
}