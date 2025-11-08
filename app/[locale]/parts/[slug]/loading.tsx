import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export default function PartDetailLoading() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb Skeleton */}
      <section className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center space-x-2 text-sm">
            <Skeleton className="h-4 w-12" />
            <span className="text-gray-400">/</span>
            <Skeleton className="h-4 w-12" />
            <span className="text-gray-400">/</span>
            <Skeleton className="h-4 w-32" />
          </nav>
        </div>
      </section>

      {/* Product Detail Section Skeleton */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12">
              {/* Product Image Skeleton */}
              <div className="space-y-4">
                {/* Main Image */}
                <div className="relative bg-white rounded-lg border-2 border-gray-200 overflow-hidden aspect-square">
                  <Skeleton className="w-full h-full" />
                </div>
                
                {/* Trust Badges Skeleton */}
                <div className="grid grid-cols-3 gap-4">
                  {[1, 2, 3].map((i) => (
                    <Card key={i} className="text-center p-4">
                      <Skeleton className="h-8 w-8 mx-auto mb-2 rounded-full" />
                      <Skeleton className="h-4 w-16 mx-auto mb-1" />
                      <Skeleton className="h-3 w-12 mx-auto" />
                    </Card>
                  ))}
                </div>
              </div>

              {/* Product Info Skeleton */}
              <div className="space-y-6">
                {/* Title and Badge */}
                <div>
                  <div className="flex items-start justify-between mb-3">
                    <Skeleton className="h-10 w-3/4" />
                    <Skeleton className="h-6 w-16 ml-4" />
                  </div>
                  
                  {/* SKU */}
                  <Skeleton className="h-4 w-32 mb-4" />

                  {/* Device Compatibility Badges */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Skeleton className="h-6 w-24" />
                    <Skeleton className="h-6 w-20" />
                  </div>
                </div>

                {/* Price & Stock Card Skeleton */}
                <Card className="border-2 border-gray-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <Skeleton className="h-4 w-16 mb-2" />
                        <Skeleton className="h-10 w-24" />
                      </div>
                      <div className="text-right">
                        <Skeleton className="h-5 w-20 mb-1 ml-auto" />
                        <Skeleton className="h-4 w-24 ml-auto" />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Skeleton className="h-12 w-full" />
                      <Skeleton className="h-12 w-full" />
                    </div>
                  </CardContent>
                </Card>

                {/* Description Card Skeleton */}
                <Card>
                  <CardHeader>
                    <Skeleton className="h-6 w-28" />
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                    </div>
                  </CardContent>
                </Card>

                {/* Specifications Card Skeleton */}
                <Card>
                  <CardHeader>
                    <Skeleton className="h-6 w-32" />
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="flex justify-between py-2 border-b last:border-0">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-4 w-32" />
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Parts Section Skeleton */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <Skeleton className="h-8 w-48 mx-auto mb-8" />
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i} className="h-full flex flex-col">
                  <CardHeader className="flex-shrink-0">
                    <Skeleton className="h-40 w-full rounded-lg mb-3" />
                    <Skeleton className="h-5 w-full mb-2" />
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-5 w-16 mt-2" />
                  </CardHeader>
                  <CardContent className="flex-grow flex flex-col justify-end">
                    <div className="flex justify-between items-center">
                      <Skeleton className="h-7 w-16" />
                      <Skeleton className="h-6 w-20" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section Skeleton */}
      <section className="py-12 bg-gradient-to-br from-green-600 to-green-700">
        <div className="container mx-auto px-4 text-center">
          <Skeleton className="h-8 w-48 mx-auto mb-3 bg-white/20" />
          <Skeleton className="h-6 w-96 mx-auto mb-6 bg-white/20" />
          <div className="flex gap-4 justify-center flex-wrap">
            <Skeleton className="h-12 w-32 bg-white/20" />
            <Skeleton className="h-12 w-32 bg-white/20" />
          </div>
        </div>
      </section>
    </div>
  );
}
