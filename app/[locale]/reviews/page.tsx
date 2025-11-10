import { getTranslations } from 'next-intl/server'
import { Star, Quote, CheckCircle2, Clock, Shield, Award, Users, TrendingUp } from 'lucide-react'
import { Testimonials } from "@/components/testimonials"
import { PricingComparison } from "@/components/pricing-comparison"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Link } from "@/i18n/navigation"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'reviewsPage' })
  
  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
    keywords: t('metaKeywords'),
    openGraph: {
      title: t('metaTitle'),
      description: t('metaDescription'),
      type: 'website',
    },
  }
}

export default async function ReviewsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations('homepage')
  const tReviews = await getTranslations('reviewsPage')

  const testimonials = [
    {
      id: 1,
      name: t('testimonials.customers.0.name'),
      rating: 5,
      review: t('testimonials.customers.0.review'),
      service: t('testimonials.customers.0.service'),
      date: t('testimonials.customers.0.date')
    },
    {
      id: 2,
      name: t('testimonials.customers.1.name'),
      rating: 5,
      review: t('testimonials.customers.1.review'),
      service: t('testimonials.customers.1.service'),
      date: t('testimonials.customers.1.date')
    },
    {
      id: 3,
      name: t('testimonials.customers.2.name'),
      rating: 5,
      review: t('testimonials.customers.2.review'),
      service: t('testimonials.customers.2.service'),
      date: t('testimonials.customers.2.date')
    }
  ]

  const stats = [
    {
      icon: Users,
      value: "5000+",
      label: tReviews('stats.customers'),
      color: "text-primary"
    },
    {
      icon: Star,
      value: "4.9/5",
      label: tReviews('stats.rating'),
      color: "text-yellow-500"
    },
    {
      icon: Award,
      value: "98%",
      label: tReviews('stats.satisfaction'),
      color: "text-primary"
    },
    {
      icon: TrendingUp,
      value: "95%",
      label: tReviews('stats.recommend'),
      color: "text-primary"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-6 py-2 mb-6">
              <Star className="w-5 h-5 text-yellow-300 fill-yellow-300" />
              <span className="font-semibold">{tReviews('hero.badge')}</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              {tReviews('hero.title')}
            </h1>
            
            <p className="text-xl md:text-2xl mb-8 text-primary-100">
              {tReviews('hero.subtitle')}
            </p>

            {/* Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
              {stats.map((stat, index) => {
                const IconComponent = stat.icon
                return (
                  <div key={index} className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                    <IconComponent className={`w-8 h-8 mx-auto mb-2 ${stat.color}`} />
                    <div className="text-3xl font-bold mb-1">{stat.value}</div>
                    <div className="text-sm text-primary-100">{stat.label}</div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <Testimonials testimonials={testimonials} />

      {/* Pricing Comparison */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <PricingComparison />
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            {tReviews('trustBadges.title')}
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                  <CheckCircle2 className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>{tReviews('trustBadges.badge1.title')}</CardTitle>
                <CardDescription>
                  {tReviews('trustBadges.badge1.description')}
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>{tReviews('trustBadges.badge2.title')}</CardTitle>
                <CardDescription>
                  {tReviews('trustBadges.badge2.description')}
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                  <Clock className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>{tReviews('trustBadges.badge3.title')}</CardTitle>
                <CardDescription>
                  {tReviews('trustBadges.badge3.description')}
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Review Platforms */}
      <section className="py-16 bg-gradient-to-br from-primary-50 to-primary-100">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">
              {tReviews('platforms.title')}
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              {tReviews('platforms.subtitle')}
            </p>
            
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className="flex items-center justify-center gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                  <div className="text-2xl font-bold text-primary mb-1">4.9/5</div>
                  <div className="text-sm text-gray-600">{tReviews('platforms.google')}</div>
                  <Badge variant="secondary" className="mt-2">{tReviews('platforms.reviewsCount', { count: '500' })}</Badge>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className="flex items-center justify-center gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                  <div className="text-2xl font-bold text-primary mb-1">4.8/5</div>
                  <div className="text-sm text-gray-600">{tReviews('platforms.facebook')}</div>
                  <Badge variant="secondary" className="mt-2">{tReviews('platforms.reviewsCount', { count: '300' })}</Badge>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className="flex items-center justify-center gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                  <div className="text-2xl font-bold text-primary mb-1">4.9/5</div>
                  <div className="text-sm text-gray-600">{tReviews('platforms.trustpilot')}</div>
                  <Badge variant="secondary" className="mt-2">{tReviews('platforms.reviewsCount', { count: '200' })}</Badge>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary-600 to-primary-700 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              {tReviews('cta.title')}
            </h2>
            <p className="text-xl mb-8 text-primary-100">
              {tReviews('cta.subtitle')}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-white text-primary hover:bg-primary-50">
                <Link href="/repairs">
                  {tReviews('cta.button1')}
                </Link>
              </Button>
              
              <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                <Link href="/contact">
                  {tReviews('cta.button2')}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
