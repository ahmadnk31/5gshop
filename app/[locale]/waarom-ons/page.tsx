import { getTranslations } from 'next-intl/server'
import { Clock, Shield, Wrench, Star, MapPin, Euro, Users, Award, CheckCircle2, Phone, Mail, Heart, Zap, ThumbsUp } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Link } from "@/i18n/navigation"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'whyChoosePage' })
  
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

export default async function WhyChooseUsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations('whyChoosePage')

  const mainBenefits = [
    {
      icon: Clock,
      title: t('mainBenefits.benefit1.title'),
      description: t('mainBenefits.benefit1.description'),
      details: t('mainBenefits.benefit1.details'),
      color: "text-blue-600",
      bgColor: "bg-blue-100"
    },
    {
      icon: Shield,
      title: t('mainBenefits.benefit2.title'),
      description: t('mainBenefits.benefit2.description'),
      details: t('mainBenefits.benefit2.details'),
      color: "text-primary",
      bgColor: "bg-primary-100"
    },
    {
      icon: Wrench,
      title: t('mainBenefits.benefit3.title'),
      description: t('mainBenefits.benefit3.description'),
      details: t('mainBenefits.benefit3.details'),
      color: "text-purple-600",
      bgColor: "bg-purple-100"
    }
  ]

  const additionalBenefits = [
    {
      icon: MapPin,
      title: t('additionalBenefits.benefit1.title'),
      description: t('additionalBenefits.benefit1.description'),
      color: "text-red-600"
    },
    {
      icon: Euro,
      title: t('additionalBenefits.benefit2.title'),
      description: t('additionalBenefits.benefit2.description'),
      color: "text-green-600"
    },
    {
      icon: Users,
      title: t('additionalBenefits.benefit3.title'),
      description: t('additionalBenefits.benefit3.description'),
      color: "text-yellow-600"
    },
    {
      icon: Award,
      title: t('additionalBenefits.benefit4.title'),
      description: t('additionalBenefits.benefit4.description'),
      color: "text-primary"
    },
    {
      icon: Zap,
      title: t('additionalBenefits.benefit5.title'),
      description: t('additionalBenefits.benefit5.description'),
      color: "text-orange-600"
    },
    {
      icon: ThumbsUp,
      title: t('additionalBenefits.benefit6.title'),
      description: t('additionalBenefits.benefit6.description'),
      color: "text-indigo-600"
    }
  ]

  const values = [
    {
      icon: Heart,
      title: t('values.value1.title'),
      description: t('values.value1.description')
    },
    {
      icon: CheckCircle2,
      title: t('values.value2.title'),
      description: t('values.value2.description')
    },
    {
      icon: Star,
      title: t('values.value3.title'),
      description: t('values.value3.description')
    }
  ]

  const process = [
    {
      number: "01",
      title: t('process.step1.title'),
      description: t('process.step1.description')
    },
    {
      number: "02",
      title: t('process.step2.title'),
      description: t('process.step2.description')
    },
    {
      number: "03",
      title: t('process.step3.title'),
      description: t('process.step3.description')
    },
    {
      number: "04",
      title: t('process.step4.title'),
      description: t('process.step4.description')
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 via-primary-700 to-primary-800 text-white py-12 sm:py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="bg-white/20 text-white mb-4 sm:mb-6 px-4 sm:px-6 py-1.5 sm:py-2 text-sm sm:text-base">
              {t('hero.badge')}
            </Badge>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight">
              {t('hero.title')} <span className="text-primary-300">{t('hero.titleHighlight')}</span>?
            </h1>
            
            <p className="text-lg sm:text-xl md:text-2xl mb-6 sm:mb-8 text-primary-100 px-4">
              {t('hero.subtitle')}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mt-8 sm:mt-12 max-w-2xl mx-auto">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 sm:p-6">
                <div className="text-3xl sm:text-4xl font-bold mb-1">5000+</div>
                <div className="text-sm sm:text-base text-primary-100">{t('hero.stat1')}</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 sm:p-6">
                <div className="text-3xl sm:text-4xl font-bold mb-1">30 min</div>
                <div className="text-sm sm:text-base text-primary-100">{t('hero.stat2')}</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 sm:p-6">
                <div className="text-3xl sm:text-4xl font-bold mb-1">4.9/5</div>
                <div className="text-sm sm:text-base text-primary-100">{t('hero.stat3')}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Benefits - Detailed */}
      <section className="py-20 -mt-10">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {mainBenefits.map((benefit, index) => {
              const IconComponent = benefit.icon
              return (
                <Card key={index} className="hover:shadow-2xl transition-all duration-300 border-2 hover:border-primary">
                  <CardHeader>
                    <div className={`w-16 h-16 ${benefit.bgColor} rounded-lg flex items-center justify-center mb-4`}>
                      <IconComponent className={`w-8 h-8 ${benefit.color}`} />
                    </div>
                    <CardTitle className="text-2xl mb-2">{benefit.title}</CardTitle>
                    <CardDescription className="text-base">{benefit.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 leading-relaxed">
                      {benefit.details}
                    </p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Additional Benefits Grid */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            {t('additionalBenefits.sectionTitle')}
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {additionalBenefits.map((benefit, index) => {
              const IconComponent = benefit.icon
              return (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <IconComponent className={`w-8 h-8 ${benefit.color} flex-shrink-0`} />
                      <div>
                        <CardTitle className="text-lg mb-2">{benefit.title}</CardTitle>
                        <CardDescription>{benefit.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Our Process */}
      <section className="py-16 bg-gradient-to-br from-primary-50 to-primary-100">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              {t('process.title')}
            </h2>
            
            <div className="grid md:grid-cols-4 gap-8">
              {process.map((step, index) => (
                <div key={index} className="text-center">
                  <div className="w-20 h-20 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold shadow-lg">
                    {step.number}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            {t('values.title')}
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {values.map((value, index) => {
              const IconComponent = value.icon
              return (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <IconComponent className="w-8 h-8 text-primary" />
                    </div>
                    <CardTitle className="text-xl mb-2">{value.title}</CardTitle>
                    <CardDescription className="text-base">{value.description}</CardDescription>
                  </CardHeader>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">
              {t('socialProof.title')}
            </h2>
            
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <Card>
                <CardContent className="p-6">
                  <div className="text-4xl font-bold text-primary mb-2">98%</div>
                  <div className="text-gray-600">{t('socialProof.stat1')}</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="text-4xl font-bold text-primary mb-2">4.9/5</div>
                  <div className="text-gray-600">{t('socialProof.stat2')}</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="text-4xl font-bold text-primary mb-2">1000+</div>
                  <div className="text-gray-600">{t('socialProof.stat3')}</div>
                </CardContent>
              </Card>
            </div>

            <div className="text-center mt-8">
              <Button asChild variant="outline" size="lg">
                <Link href="/reviews">
                  {t('socialProof.cta')}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary-600 to-primary-700 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              {t('cta.title')}
            </h2>
            <p className="text-xl mb-8 text-primary-100">
              {t('cta.subtitle')}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-white text-primary hover:bg-primary-50">
                <Link href="/repairs">
                  {t('cta.button1')}
                </Link>
              </Button>
              
              <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                <Link href="/contact">
                  <MapPin className="w-5 h-5 mr-2" />
                  {t('cta.button2')}
                </Link>
              </Button>
            </div>

            <div className="mt-8 flex items-center justify-center gap-6 text-primary-100">
              <div className="flex items-center gap-2">
                <Phone className="w-5 h-5" />
                <span>{t('cta.phone')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5" />
                <span>{t('cta.email')}</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
