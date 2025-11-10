import { getTranslations } from 'next-intl/server'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Link } from "@/i18n/navigation"
import { HelpCircle, Phone, Mail, MessageCircle, Clock } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'faqPage' })
  
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

export default async function FAQPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations('homepage')
  const tFaq = await getTranslations('faqPage')

  const faqCategories = [
    {
      id: 'general',
      title: 'Algemeen',
      icon: HelpCircle,
      questions: [1, 2, 3, 4]
    },
    {
      id: 'repair',
      title: 'Reparaties',
      icon: Clock,
      questions: [5, 6, 7, 8]
    },
    {
      id: 'pricing',
      title: 'Prijzen & Garantie',
      icon: MessageCircle,
      questions: [9, 10, 11]
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-6 py-2 mb-6">
              <HelpCircle className="w-5 h-5 text-primary-300" />
              <span className="font-semibold">Veelgestelde Vragen</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Hoe Kunnen We Je Helpen?
            </h1>
            
            <p className="text-xl md:text-2xl mb-8 text-primary-100">
              Alle antwoorden op je vragen over onze reparatiediensten
            </p>
          </div>
        </div>
      </section>

      {/* Quick Contact Cards */}
      <section className="py-12 -mt-10">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                  <Phone className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-lg">Bel Ons</CardTitle>
                <CardDescription>
                  Directe hulp van onze experts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full">
                  <Link href="/contact">
                    Bel Nu
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                  <Mail className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-lg">Email Ons</CardTitle>
                <CardDescription>
                  Krijg antwoord binnen 24 uur
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/contact">
                    Stuur Email
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                  <MessageCircle className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-lg">Kom Langs</CardTitle>
                <CardDescription>
                  Bondgenotenlaan 84A, Leuven
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/contact">
                    Routebeschrijving
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ by Category */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          {faqCategories.map((category) => {
            const IconComponent = category.icon
            return (
              <div key={category.id} className="mb-12">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                    <IconComponent className="w-6 h-6 text-primary" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold">{category.title}</h2>
                </div>
                
                <Accordion type="single" collapsible className="w-full space-y-4">
                  {category.questions.map((num) => (
                    <AccordionItem 
                      key={`q${num}`} 
                      value={`item-${num}`}
                      className="bg-white rounded-lg shadow-sm border border-gray-200"
                    >
                      <AccordionTrigger className="px-6 py-4 text-left text-lg font-semibold text-gray-900 hover:no-underline">
                        {t(`faq.questions.q${num}.question`)}
                      </AccordionTrigger>
                      <AccordionContent className="px-6 pb-4">
                        <div className="text-gray-700 prose prose-sm max-w-none">
                          {t.rich(`faq.questions.q${num}.answer`, {
                            strong: (chunks) => <strong>{chunks}</strong>
                          })}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            )
          })}
        </div>
      </section>

      {/* Still Have Questions */}
      <section className="py-16 bg-gradient-to-br from-primary-50 to-primary-100">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <HelpCircle className="w-16 h-16 text-primary mx-auto mb-6" />
            <h2 className="text-3xl font-bold mb-4">
              Nog Steeds Vragen?
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              {t('faq.subtitle')}
            </p>
            <Button asChild size="lg" className="bg-primary hover:bg-primary-700">
              <Link href="/contact">
                {t('faq.contactCta')}
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Popular Topics */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">
              Populaire Onderwerpen
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <Link href="/30-minuten-reparatie" className="group">
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <Clock className="w-8 h-8 text-primary mb-2" />
                    <CardTitle className="group-hover:text-primary transition-colors">
                      30 Minuten Reparatie
                    </CardTitle>
                    <CardDescription>
                      Alles over onze snelle express service
                    </CardDescription>
                  </CardHeader>
                </Card>
              </Link>

              <Link href="/studentenkorting" className="group">
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <MessageCircle className="w-8 h-8 text-primary mb-2" />
                    <CardTitle className="group-hover:text-primary transition-colors">
                      Studentenkorting
                    </CardTitle>
                    <CardDescription>
                      10% korting voor studenten
                    </CardDescription>
                  </CardHeader>
                </Card>
              </Link>

              <Link href="/reviews" className="group">
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <HelpCircle className="w-8 h-8 text-primary mb-2" />
                    <CardTitle className="group-hover:text-primary transition-colors">
                      Klantenreviews
                    </CardTitle>
                    <CardDescription>
                      Lees wat onze klanten zeggen
                    </CardDescription>
                  </CardHeader>
                </Card>
              </Link>

              <Link href="/repairs" className="group">
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <Phone className="w-8 h-8 text-primary mb-2" />
                    <CardTitle className="group-hover:text-primary transition-colors">
                      Alle Reparaties
                    </CardTitle>
                    <CardDescription>
                      Bekijk ons complete aanbod
                    </CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary-600 to-primary-700 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Klaar om Je Toestel te Laten Repareren?
            </h2>
            <p className="text-xl mb-8 text-primary-100">
              Boek nu je afspraak of kom direct langs!
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-white text-primary hover:bg-primary-50">
                <Link href="/repairs">
                  Bekijk Diensten
                </Link>
              </Button>
              
              <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                <Link href="/contact">
                  Contact
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
