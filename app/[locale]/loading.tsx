import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export default function HomeLoading() {
  return (
    <div className="flex flex-col min-h-screen bg-[var(--background)]">
      {/* Hero Carousel Skeleton */}
      <section className="relative bg-gradient-to-br from-green-600 to-blue-600">
        <div className="container mx-auto px-0 sm:px-4 py-0 sm:py-8 lg:py-12">
          <div className="relative rounded-2xl overflow-hidden shadow-xl">
            <div className="flex flex-col items-center justify-center text-center p-0 min-h-[350px] sm:min-h-[420px] lg:min-h-[500px] relative bg-gray-200">
              {/* Carousel Image Skeleton */}
              <div className="absolute inset-0 w-full h-full">
                <Skeleton className="w-full h-full" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
              </div>
              
              {/* Carousel Content Skeleton */}
              <div className="relative z-20 flex flex-col items-center justify-center h-full w-full px-4 py-8">
                <Skeleton className="h-6 w-24 mb-4 rounded-full" />
                <Skeleton className="h-10 w-64 mb-2" />
                <Skeleton className="h-6 w-80 mb-4" />
                <Skeleton className="h-12 w-40" />
              </div>
              
              {/* Navigation Buttons Skeleton */}
              <div className="absolute left-4 top-1/2 -translate-y-1/2 z-30">
                <Skeleton className="h-10 w-10 rounded-full" />
              </div>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 z-30">
                <Skeleton className="h-10 w-10 rounded-full" />
              </div>
              
              {/* Play/Pause Button Skeleton */}
              <div className="absolute left-4 bottom-4 z-30">
                <Skeleton className="h-10 w-10 rounded-full" />
              </div>
              
              {/* Indicators Skeleton */}
              <div className="absolute bottom-4 right-4 z-30 flex space-x-1.5">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Skeleton key={i} className="w-2 h-2 rounded-full" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Overview Skeleton */}
      <section className="py-16 bg-[var(--background)]">
        <div className="container mx-auto px-4">
          <Skeleton className="h-10 w-64 mx-auto mb-12" />
          <div className="grid md:grid-cols-2 gap-8">
            {[1, 2].map((i) => (
              <Card key={i}>
                <CardHeader>
                  <div className="flex items-center space-x-2 mb-2">
                    <Skeleton className="h-8 w-8 rounded" />
                    <Skeleton className="h-7 w-40" />
                  </div>
                  <Skeleton className="h-5 w-full" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 mb-6">
                    {[1, 2, 3, 4].map((j) => (
                      <div key={j} className="flex items-center">
                        <Skeleton className="h-4 w-4 rounded-full mr-2" />
                        <Skeleton className="h-4 w-48" />
                      </div>
                    ))}
                  </div>
                  <Skeleton className="h-10 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Accessories Skeleton */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <Skeleton className="h-10 w-56" />
            <Skeleton className="h-10 w-32" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="overflow-hidden">
                <CardContent className="p-0">
                  <Skeleton className="w-full aspect-square" />
                  <div className="p-4 space-y-3">
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <div className="flex justify-between items-center">
                      <Skeleton className="h-6 w-20" />
                      <Skeleton className="h-5 w-16" />
                    </div>
                    <div className="flex gap-2">
                      <Skeleton className="h-9 flex-1" />
                      <Skeleton className="h-9 flex-1" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Parts Skeleton */}
      <section className="py-16 bg-[var(--background)]">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <Skeleton className="h-10 w-48" />
            <Skeleton className="h-10 w-32" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="overflow-hidden">
                <CardContent className="p-0">
                  <Skeleton className="w-full aspect-square" />
                  <div className="p-4 space-y-3">
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-6 w-24" />
                    <Skeleton className="h-9 w-full" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Services Skeleton */}
      <section className="py-16 bg-[var(--background)]">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <Skeleton className="h-10 w-56" />
            <Skeleton className="h-10 w-40" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i}>
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between mb-2">
                    <Skeleton className="h-10 w-10 rounded-lg" />
                    <Skeleton className="h-6 w-20 rounded-full" />
                  </div>
                  <Skeleton className="h-6 w-full mb-2" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Skeleton className="h-8 w-24" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                    <Skeleton className="h-9 w-24" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Device Categories Skeleton */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <Skeleton className="h-10 w-64 mx-auto mb-12" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i}>
                <CardContent className="p-6 text-center">
                  <Skeleton className="w-16 h-16 rounded-full mx-auto mb-4" />
                  <Skeleton className="h-6 w-32 mx-auto mb-2" />
                  <Skeleton className="h-4 w-full mb-3" />
                  <Skeleton className="h-6 w-24 mx-auto rounded-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Comparison Skeleton */}
      <section className="py-16 bg-[var(--background)]">
        <div className="container mx-auto px-4">
          <Skeleton className="h-10 w-64 mx-auto mb-12" />
          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-7 w-40 mx-auto" />
                </CardHeader>
                <CardContent className="space-y-4">
                  <Skeleton className="h-12 w-32 mx-auto" />
                  <div className="space-y-2">
                    {[1, 2, 3, 4].map((j) => (
                      <div key={j} className="flex items-center">
                        <Skeleton className="h-4 w-4 rounded-full mr-2" />
                        <Skeleton className="h-4 w-full" />
                      </div>
                    ))}
                  </div>
                  <Skeleton className="h-10 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Skeleton */}
      <section className="py-16 bg-[var(--background)]">
        <div className="container mx-auto px-4">
          <Skeleton className="h-10 w-56 mx-auto mb-12" />
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="text-center">
                <Skeleton className="w-16 h-16 rounded-full mx-auto mb-4" />
                <Skeleton className="h-6 w-48 mx-auto mb-2" />
                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-4 w-5/6 mx-auto" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Skeleton */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <Skeleton className="h-10 w-56 mx-auto mb-12" />
          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="flex items-center gap-1 mb-4">
                    {[1, 2, 3, 4, 5].map((j) => (
                      <Skeleton key={j} className="h-5 w-5" />
                    ))}
                  </div>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4 mb-4" />
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section Skeleton */}
      <section className="bg-green-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <Skeleton className="h-10 w-96 mx-auto mb-4 bg-white/20" />
          <Skeleton className="h-6 w-64 mx-auto mb-8 bg-white/20" />
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Skeleton className="h-12 w-40 mx-auto bg-white/20" />
            <Skeleton className="h-12 w-40 mx-auto bg-white/20" />
          </div>
        </div>
      </section>
    </div>
  );
}