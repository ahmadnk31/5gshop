import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { generatePageMetadata } from '@/lib/seo';

type Props = {
  params: Promise<{ locale: string }>;
  children: React.ReactNode;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'quote' });
  
  return await generatePageMetadata({
    title: t('meta.title', { defaultValue: 'Get Free Quote - Device Repair Leuven' }),
    description: t('meta.description', { 
      defaultValue: 'Get a free quote for your device repair in Leuven. Fast, professional service for smartphones, laptops, tablets, and more. Same-day service available.' 
    }),
    path: '/quote',
    keywords: [
      'free quote repair leuven',
      'repair quote leuven',
      'device repair estimate leuven',
      'phone repair quote leuven',
      'gsm reparatie offerte leuven',
      'repair price estimate leuven'
    ],
    locale
  });
}

export default function QuoteLayout({ children }: { children: React.ReactNode }) {
  return children;
}

