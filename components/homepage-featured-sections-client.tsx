'use client'

import { useFeaturedAccessories, usePopularServices, useHomepageParts } from '@/hooks/use-data'
import { FeaturedAccessoriesSection } from '@/components/FeaturedAccessoriesSection'
import { FeaturedPartsSection } from '@/components/FeaturedPartsSection'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Link } from '@/i18n/navigation'
import { formatCurrency } from '@/lib/utils'
import { Smartphone, Clock, ArrowRight, Loader2 } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import type { Accessory, Part } from '@/lib/types'

type AccessoryWithSlug = Accessory & { slug: string }

// Helper function to create slugs
const createSlug = (name: string, id: string): string => {
  const nameSlug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
  return `${nameSlug}-${id}`
}

type Props = {
  translations: {
    accessories: {
      title: string
      viewAll: string
      inStock: string
      viewDetails: string
      addToCart: string
      buyNow: string
      productImage: string
    }
    parts: {
      title: string
      viewAll: string
      inStock: string
      viewDetails: string
      addToCart: string
      getQuote: string
      quality: string
      forModel: string
      productImage: string
    }
    services: {
      title: string
      viewAll: string
      from: string
      estimatedTime: string
      bookNow: string
      learnMore: string
      minutes: string
    }
    loading: string
    error: string
    retry: string
  }
}

export function HomepageFeaturedSections({ translations }: Props) {
  const accessories = useFeaturedAccessories(6)
  const services = usePopularServices(3)
  const parts = useHomepageParts()

  return (
    <>
      {/* Featured Accessories Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-lg md:text-2xl font-bold">{translations.accessories.title}</h2>
            <Button asChild variant="outline">
              <Link href="/accessories">
                {translations.accessories.viewAll}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          {/* Loading State */}
          {accessories.isLoading && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4 xl:gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="p-4">
                  <Skeleton className="h-48 w-full mb-4" />
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2 mb-4" />
                  <Skeleton className="h-10 w-full" />
                </Card>
              ))}
            </div>
          )}

          {/* Error State */}
          {accessories.error && (
            <Card className="border-red-300 bg-red-50">
              <CardContent className="pt-6">
                <p className="text-red-600 mb-4">{translations.error}: {accessories.error.message}</p>
                <Button onClick={() => accessories.refetch()} variant="outline">
                  {translations.retry}
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Success State */}
          {accessories.data && (
            <FeaturedAccessoriesSection
              accessories={accessories.data.map((acc: Accessory) => ({
                ...acc,
                slug: createSlug(acc.name, acc.id),
              }))}
              translations={translations.accessories}
            />
          )}
        </div>
      </section>

      {/* Popular Services Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-lg md:text-2xl font-bold">{translations.services.title}</h2>
            <Button asChild variant="outline">
              <Link href="/repairs">
                {translations.services.viewAll}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          {/* Loading State */}
          {services.isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="p-6">
                  <Skeleton className="h-8 w-8 mb-4" />
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full mb-4" />
                  <Skeleton className="h-10 w-full" />
                </Card>
              ))}
            </div>
          )}

          {/* Error State */}
          {services.error && (
            <Card className="border-red-300 bg-red-50">
              <CardContent className="pt-6">
                <p className="text-red-600 mb-4">{translations.error}: {services.error.message}</p>
                <Button onClick={() => services.refetch()} variant="outline">
                  {translations.retry}
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Success State */}
          {services.data && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {services.data.map((service) => (
                <Card key={service.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="p-3 bg-green-100 rounded-full">
                        <Smartphone className="h-6 w-6 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-lg">{service.name}</CardTitle>
                        {service.popularity && (
                          <Badge variant="secondary" className="mt-1">
                            {service.popularity}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4 text-sm line-clamp-2">
                      {service.description}
                    </p>
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-sm text-gray-500">{translations.services.from}</p>
                        <p className="text-2xl font-bold text-green-600">
                          {formatCurrency(service.basePrice, 'EUR')}
                        </p>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Clock className="h-4 w-4 mr-1" />
                        <span className="text-sm">
                          {service.estimatedTime} {translations.services.minutes}
                        </span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button asChild className="flex-1 bg-green-600 hover:bg-green-700">
                        <Link href={`/repairs?service=${service.id}`}>
                          {translations.services.bookNow}
                        </Link>
                      </Button>
                      <Button asChild variant="outline" className="flex-1">
                        <Link href="/repairs">
                          {translations.services.learnMore}
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Featured Parts Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-lg md:text-2xl font-bold">{translations.parts.title}</h2>
            <Button asChild variant="outline">
              <Link href="/parts">
                {translations.parts.viewAll}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          {/* Loading State */}
          {parts.isLoading && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4 xl:gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="p-4">
                  <Skeleton className="h-48 w-full mb-4" />
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2 mb-4" />
                  <Skeleton className="h-10 w-full" />
                </Card>
              ))}
            </div>
          )}

          {/* Error State */}
          {parts.error && (
            <Card className="border-red-300 bg-red-50">
              <CardContent className="pt-6">
                <p className="text-red-600 mb-4">{translations.error}: {parts.error.message}</p>
                <Button onClick={() => parts.refetch()} variant="outline">
                  {translations.retry}
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Success State */}
          {parts.data && (
            <FeaturedPartsSection parts={parts.data as Part[]} t={translations.parts} />
          )}
        </div>
      </section>

      {/* Background Refetch Indicator */}
      {(accessories.isFetching || services.isFetching || parts.isFetching) && (
        <div className="fixed bottom-4 right-4 bg-black/80 text-white px-4 py-2 rounded-lg flex items-center space-x-2 z-50">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span className="text-sm">{translations.loading}</span>
        </div>
      )}
    </>
  )
}
