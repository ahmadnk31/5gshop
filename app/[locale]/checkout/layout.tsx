import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/seo';

type Props = {
  params: Promise<{ locale: string }>;
  children: React.ReactNode;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  
  return await generatePageMetadata({
    title: 'Checkout - 5GPhones Fix',
    description: 'Complete your purchase - secure checkout for device repairs and accessories',
    path: '/checkout',
    noIndex: true, // Checkout pages should not be indexed
    locale
  });
}

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return children;
}

