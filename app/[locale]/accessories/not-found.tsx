import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Package, Home, Search } from 'lucide-react';
import { Link } from '@/i18n/navigation';

export default function AccessoriesNotFound() {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="container mx-auto px-4 py-16">
        <Card className="max-w-2xl mx-auto">
          <CardContent className="p-12 text-center">
            <div className="mb-6">
              <Package className="h-20 w-20 text-gray-400 mx-auto mb-4" />
              <h1 className="text-6xl font-bold text-gray-900 mb-2">404</h1>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Accessory Not Found
              </h2>
              <p className="text-gray-600 mb-6">
                Sorry, we couldn't find the accessory you're looking for. It may have been removed or the link might be incorrect.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/accessories">
                <Button className="gap-2 w-full sm:w-auto">
                  <Search className="h-4 w-4" />
                  Browse All Accessories
                </Button>
              </Link>
              <Link href="/">
                <Button variant="outline" className="gap-2 w-full sm:w-auto">
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
