"use client";

import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Link } from '@/i18n/navigation';

export default function AccessoriesCheckoutPage() {
  const t = useTranslations('checkout');

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-3xl font-bold mb-4">
          {t('title', { defaultValue: 'Accessory Checkout' })}
        </h1>
        <p className="text-gray-600 mb-8">
          {t('description', { defaultValue: 'Complete your accessory purchase' })}
        </p>
        
        <div className="space-y-4">
          <Button asChild size="lg">
            <Link href="/accessories">
              {t('backToAccessories', { defaultValue: 'Back to Accessories' })}
            </Link>
          </Button>
          
          <div className="text-sm text-gray-500">
            {t('comingSoon', { defaultValue: 'Checkout functionality coming soon' })}
          </div>
        </div>
      </div>
    </div>
  );
}
