'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Link } from "@/i18n/navigation"
import { HelpCircle, Star, Award, ArrowRight, MessageSquare, TrendingUp } from 'lucide-react'

export default function QuickLinksSection() {
  const quickLinks = [
    {
      icon: HelpCircle,
      title: "Veelgestelde Vragen",
      description: "Vind antwoorden op alle vragen over onze reparatiediensten",
      link: "/faq",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      badge: "11+ Vragen"
    },
    {
      icon: Star,
      title: "Klantbeoordelingen",
      description: "Lees wat onze 5000+ tevreden klanten over ons zeggen",
      link: "/reviews",
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
      badge: "4.9/5 Sterren"
    },
    {
      icon: Award,
      title: "Waarom 5G Phones?",
      description: "Ontdek waarom duizenden klanten voor ons kiezen",
      link: "/waarom-ons",
      color: "text-primary",
      bgColor: "bg-primary-50",
      badge: "Beste in Leuven"
    }
  ]

  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">
            Meer Weten?
          </h2>
          <p className="text-lg text-gray-600">
            Ontdek waarom 5G Phones de beste keuze is voor je reparatie
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {quickLinks.map((link, index) => {
            const IconComponent = link.icon
            return (
              <Link 
                key={index} 
                href={link.link}
                className="group"
              >
                <Card className="h-full hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 hover:border-primary">
                  <CardHeader>
                    <div className={`w-14 h-14 ${link.bgColor} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <IconComponent className={`w-7 h-7 ${link.color}`} />
                    </div>
                    
                    <div className="inline-block mb-2">
                      <span className={`text-xs font-semibold px-3 py-1 rounded-full ${link.bgColor} ${link.color}`}>
                        {link.badge}
                      </span>
                    </div>
                    
                    <CardTitle className="text-xl mb-2 group-hover:text-primary transition-colors">
                      {link.title}
                    </CardTitle>
                    <CardDescription className="text-base">
                      {link.description}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="flex items-center gap-2 text-primary font-semibold group-hover:gap-4 transition-all">
                      <span>Lees Meer</span>
                      <ArrowRight className="w-5 h-5" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>

        {/* Mini FAQ Preview */}
        <div className="mt-12 max-w-4xl mx-auto">
          <Card className="border-primary/20">
            <CardContent className="p-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MessageSquare className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Snelle Vragen?</h3>
                  <p className="text-gray-600">De meest gestelde vragen op een rij:</p>
                </div>
              </div>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-primary">?</span>
                  </div>
                  <p className="text-gray-700"><strong>Hoe lang duurt een reparatie?</strong> Meestal binnen 30 minuten!</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-primary">?</span>
                  </div>
                  <p className="text-gray-700"><strong>Krijg ik garantie?</strong> Ja, 6 maanden volledige garantie op alle reparaties.</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-primary">?</span>
                  </div>
                  <p className="text-gray-700"><strong>Zijn de prijzen transparant?</strong> Absoluut! Geen verborgen kosten.</p>
                </div>
              </div>

              <Button asChild variant="outline" className="w-full sm:w-auto">
                <Link href="/faq">
                  Bekijk Alle 11 Vragen
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
