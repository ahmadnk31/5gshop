'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle, Home, RefreshCw, ShoppingCart } from 'lucide-react';
import { Link } from '@/i18n/navigation';

export default function CheckoutError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Checkout error:', error);
  }, [error]);

  return (
    <div className="flex flex-col min-h-screen">
      <div className="container mx-auto px-4 py-16">
        <Card className="max-w-2xl mx-auto">
          <CardContent className="p-12 text-center">
            <div className="mb-6">
              <AlertCircle className="h-20 w-20 text-red-500 mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Checkout Error
              </h1>
              <p className="text-gray-600 mb-4">
                We encountered an error while processing your checkout.
              </p>
              {error.message && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                  <p className="text-sm text-red-800 font-mono">{error.message}</p>
                  {error.digest && (
                    <p className="text-xs text-red-600 mt-2">Error ID: {error.digest}</p>
                  )}
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={reset} className="gap-2">
                <RefreshCw className="h-4 w-4" />
                Try Again
              </Button>
              <Link href="/checkout">
                <Button variant="outline" className="gap-2 w-full sm:w-auto">
                  <ShoppingCart className="h-4 w-4" />
                  Back to Checkout
                </Button>
              </Link>
              <Link href="/">
                <Button variant="ghost" className="gap-2 w-full sm:w-auto">
                  <Home className="h-4 w-4" />
                  Go Home
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
