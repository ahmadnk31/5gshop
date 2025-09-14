import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Search, Package, ArrowLeft, Home } from 'lucide-react';

export default function PartsNotFound() {
  const t = useTranslations('parts');

  return (
    <div className="min-h-[60vh] flex items-center justify-center py-12">
      <div className="container mx-auto px-4">
        <Card className="max-w-2xl mx-auto text-center">
          <CardContent className="p-8 sm:p-12">
            {/* Icon */}
            <div className="mb-6">
              <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center">
                <Package className="h-12 w-12 text-gray-400" />
              </div>
            </div>

            {/* Title */}
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {t('notFound.title', { defaultValue: 'No Parts Found' })}
            </h1>

            {/* Description */}
            <p className="text-lg text-gray-600 mb-8">
              {t('notFound.description', { 
                defaultValue: 'We couldn\'t find any parts matching your search criteria. Try adjusting your filters or browse our available parts.' 
              })}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild variant="outline" className="flex items-center gap-2">
                <Link href="/parts">
                  <Search className="h-4 w-4" />
                  {t('notFound.browseAll', { defaultValue: 'Browse All Parts' })}
                </Link>
              </Button>
              
              <Button asChild className="flex items-center gap-2">
                <Link href="/repairs">
                  <ArrowLeft className="h-4 w-4" />
                  {t('notFound.backToRepairs', { defaultValue: 'Back to Repairs' })}
                </Link>
              </Button>
            </div>

            {/* Additional Help */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-500 mb-4">
                {t('notFound.needHelp', { defaultValue: 'Need help finding what you\'re looking for?' })}
              </p>
              <Button asChild variant="ghost" size="sm" className="flex items-center gap-2 mx-auto">
                <Link href="/contact">
                  <Home className="h-4 w-4" />
                  {t('notFound.contactUs', { defaultValue: 'Contact Us' })}
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
