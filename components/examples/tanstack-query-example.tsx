'use client'

import { useFeaturedAccessories, usePopularServices, useHomepageParts } from '@/hooks/use-data'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

/**
 * Example component demonstrating TanStack Query usage
 * This shows best practices for loading states, error handling, and data display
 */

export function TanStackQueryExample() {
  // Fetch data using custom hooks
  const accessories = useFeaturedAccessories(6)
  const services = usePopularServices(3)
  const parts = useHomepageParts()

  return (
    <div className="container mx-auto py-8 space-y-8">
      <h1 className="text-3xl font-bold">TanStack Query Example</h1>
      
      {/* Featured Accessories Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Featured Accessories</h2>
        
        {/* Loading State */}
        {accessories.isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-3/4" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-2/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        )}
        
        {/* Error State */}
        {accessories.error && (
          <Card className="border-red-300 bg-red-50">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2 text-red-600">
                <AlertCircle className="h-5 w-5" />
                <p>Failed to load accessories: {accessories.error.message}</p>
              </div>
              <Button 
                onClick={() => accessories.refetch()} 
                className="mt-4"
                variant="outline"
              >
                Try Again
              </Button>
            </CardContent>
          </Card>
        )}
        
        {/* Success State */}
        {accessories.data && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {accessories.data.map((accessory) => (
              <Card key={accessory.id}>
                <CardHeader>
                  <CardTitle className="text-lg">{accessory.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">{accessory.brand}</p>
                  <p className="text-lg font-bold text-green-600 mt-2">
                    €{accessory.price.toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Stock: {accessory.inStock}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
        
        {/* Data Status Info */}
        <div className="mt-4 p-4 bg-gray-100 rounded-lg text-sm">
          <p><strong>Status:</strong> {accessories.status}</p>
          <p><strong>Is Fetching:</strong> {accessories.isFetching ? 'Yes' : 'No'}</p>
          <p><strong>Data Age:</strong> {accessories.dataUpdatedAt ? new Date(accessories.dataUpdatedAt).toLocaleTimeString() : 'Never'}</p>
        </div>
      </section>

      {/* Popular Services Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Popular Services</h2>
        
        {services.isLoading && <Skeleton className="h-32 w-full" />}
        
        {services.error && (
          <div className="text-red-600">
            Error: {services.error.message}
            <Button onClick={() => services.refetch()} className="ml-4">
              Retry
            </Button>
          </div>
        )}
        
        {services.data && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {services.data.map((service) => (
              <Card key={service.id}>
                <CardHeader>
                  <CardTitle>{service.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">{service.description}</p>
                  <p className="text-lg font-bold text-green-600 mt-2">
                    From €{service.basePrice.toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-500">
                    ~{service.estimatedTime} minutes
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Homepage Parts Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Homepage Parts</h2>
        
        {parts.isLoading && <Skeleton className="h-32 w-full" />}
        
        {parts.error && (
          <div className="text-red-600">
            Error: {parts.error.message}
          </div>
        )}
        
        {parts.data && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {parts.data.map((part) => (
              <Card key={part.id}>
                <CardHeader>
                  <CardTitle className="text-base">{part.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">
                    {part.deviceModel || 'Universal'}
                  </p>
                  <p className="text-lg font-bold text-green-600 mt-2">
                    €{part.cost.toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-500">
                    Quality: {part.quality || 'Standard'}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Refetch All Button */}
      <div className="flex justify-center space-x-4">
        <Button 
          onClick={() => {
            accessories.refetch()
            services.refetch()
            parts.refetch()
          }}
          disabled={accessories.isFetching || services.isFetching || parts.isFetching}
        >
          {(accessories.isFetching || services.isFetching || parts.isFetching) 
            ? 'Refreshing...' 
            : 'Refresh All Data'}
        </Button>
      </div>

      {/* DevTools Info */}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="font-semibold mb-2">🛠️ TanStack Query DevTools</h3>
        <p className="text-sm text-gray-700">
          In development mode, check the bottom-right corner for the React Query DevTools.
          You can inspect all queries, their cache status, and manually trigger refetches.
        </p>
      </div>
    </div>
  )
}
