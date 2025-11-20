import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { generatePageMetadata } from '@/lib/seo';

type Props = {
  params: Promise<{ locale: string }>;
  children: React.ReactNode;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'about' });
  
  return await generatePageMetadata({
    title: t('meta.title', { defaultValue: 'About Us - 5GPhones Fix Leuven' }),
    description: t('meta.description', { 
      defaultValue: 'Learn about 5GPhones Fix - professional device repair and accessories shop in Leuven. Expert technicians, quality service, 6 months warranty. Bondgenotenlaan 84A.' 
    }),
    path: '/about',
    keywords: [
      'about 5gphones',
      'phone repair shop leuven',
      'gsm reparatie winkel leuven',
      'about us leuven',
      'device repair experts leuven',
      'professional repair service leuven'
    ],
    locale
  });
}

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}

