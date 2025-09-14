import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Search, Package, ArrowLeft, RefreshCw } from 'lucide-react';

interface DeviceTypeNavbarNotFoundProps {
  deviceType?: string;
  onRetry?: () => void;
}

export default function DeviceTypeNavbarNotFound({ deviceType, onRetry }: DeviceTypeNavbarNotFoundProps) {
  const t = useTranslations('deviceTypeNavbar');

  return (
    <div className="p-6">
      <Card className="max-w-md mx-auto">
        <CardContent className="p-6 text-center">
          {/* Icon */}
          <div className="mb-4">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
              <Package className="h-8 w-8 text-gray-400" />
            </div>
          </div>

          {/* Title */}
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {t('notFound.title', { 
              defaultValue: deviceType ? `No ${deviceType} Found` : 'No Items Found' 
            })}
          </h3>

          {/* Description */}
          <p className="text-sm text-gray-600 mb-4">
            {t('notFound.description', { 
              defaultValue: deviceType 
                ? `We couldn't find any ${deviceType.toLowerCase()} models or parts at the moment.`
                : 'We couldn\'t find any items matching your selection.'
            })}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col gap-2">
            {onRetry && (
              <Button 
                onClick={onRetry} 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                {t('notFound.retry', { defaultValue: 'Try Again' })}
              </Button>
            )}
            
            <Button asChild variant="outline" size="sm" className="flex items-center gap-2">
              <Link href="/parts">
                <Search className="h-4 w-4" />
                {t('notFound.browseAll', { defaultValue: 'Browse All Parts' })}
              </Link>
            </Button>
          </div>

          {/* Additional Help */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500 mb-2">
              {t('notFound.needHelp', { defaultValue: 'Need help?' })}
            </p>
            <Button asChild variant="ghost" size="sm" className="text-xs">
              <Link href="/contact">
                {t('notFound.contactUs', { defaultValue: 'Contact Us' })}
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
