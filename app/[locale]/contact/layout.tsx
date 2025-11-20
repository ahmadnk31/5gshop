import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { generatePageMetadata } from '@/lib/seo';

type Props = {
  params: Promise<{ locale: string }>;
  children: React.ReactNode;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'contact' });
  
  return await generatePageMetadata({
    title: t('meta.title', { defaultValue: 'Contact Us - 5GPhones Fix Leuven' }),
    description: t('meta.description', { 
      defaultValue: 'Contact 5GPhones Fix in Leuven. Phone repair, accessories, and device services. Bondgenotenlaan 84A, Leuven. Call, email, or visit us today.' 
    }),
    path: '/contact',
    keywords: [
      'contact 5gphones',
      'phone repair contact leuven',
      'gsm reparatie contact leuven',
      'contact telefoon winkel leuven',
      '5gphones adres leuven',
      'bondgenotenlaan 84a',
      'contact repair shop leuven'
    ],
    locale
  });
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}

