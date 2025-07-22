import { Metadata } from 'next'
import { generatePageMetadata } from '@/lib/seo'
import { StructuredData } from '@/components/structured-data'
import { generateLocalSEOFAQ, generateRepairServiceSchema } from '@/lib/local-seo'
import { generateCompleteLocalBusinessSchema } from '@/lib/local-business'

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  return generatePageMetadata({
    title: 'Telefoon Reparatie Leuven | GSM Herstelling | iPhone Samsung Reparatie',
    description: 'Professionele telefoon reparatie in Leuven. iPhone, Samsung, Huawei herstelling ✓ Scherm reparatie ✓ Batterij vervanging ✓ Snelle service ✓ Garantie. Bondgenotenlaan 84A.',
    path: '/repairs',
    locale: params.locale,
    keywords: [
      // Primary local repair keywords
      'telefoon reparatie leuven',
      'gsm reparatie leuven',
      'smartphone reparatie leuven',
      'iphone reparatie leuven',
      'samsung reparatie leuven',
      'phone repair leuven',
      'screen repair leuven',
      'battery replacement leuven',
      
      // Service-specific keywords
      'scherm reparatie leuven',
      'batterij vervanging leuven',
      'waterschade herstel leuven',
      'iphone scherm leuven',
      'samsung scherm leuven',
      'snelle reparatie leuven',
      'same day repair leuven',
      
      // Location + service combinations
      'leuven gsm winkel',
      'leuven telefoon service',
      'bondgenotenlaan reparatie',
      'centrum leuven telefoon',
      'professional repair leuven',
      'reliable phone repair'
    ]
  })
}

export default function RepairsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {/* Enhanced Local SEO Structured Data */}
      <StructuredData data={generateCompleteLocalBusinessSchema()} />
      <StructuredData data={generateRepairServiceSchema()} />
      <StructuredData data={generateLocalSEOFAQ()} />
      
      {children}
    </>
  )
}
