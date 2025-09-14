// Simple Parts List Page for /parts
'use client';

import { useState } from 'react';
import { useCart } from '@/components/cart-context';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { FallbackImage } from '@/components/ui/fallback-image';
import { PaginationControls } from '@/components/ui/pagination-controls';
import { usePagination } from '@/hooks/use-pagination';
import { formatCurrency } from '@/lib/utils';
import { Link } from '@/i18n/navigation';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Star } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { PartActionButtons } from './[id]/part-action-buttons';
import { Skeleton } from '@/components/ui/skeleton';
import { useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';

export default function PartsPage() {
  const t = useTranslations('parts');
  const { addToCart } = useCart();
  const user = useSession().data;
  const searchParams = useSearchParams();
  const type = searchParams.get('type');
  const brand = searchParams.get('brand');
  const model = searchParams.get('model');

  // Fetch parts
  const {
    data: parts = [],
    isLoading: partsLoading,
  } = useQuery({
    queryKey: ['parts', type, brand, model],
    queryFn: async () => {
      // If no filters are provided, fetch all parts directly
      if (!type && !brand && !model) {
        const res = await fetch('/api/parts');
        if (res.ok) {
          let data = await res.json();
          if (data && Array.isArray(data.data)) {
            return data.data;
          } else if (!Array.isArray(data)) {
            return [];
          }
          return data;
        }
        return [];
      }
      
      // If filters are provided, use the filter API
      const params = [];
      if (type) params.push(`type=${encodeURIComponent(type)}`);
      if (brand) params.push(`brand=${encodeURIComponent(brand)}`);
      if (model) params.push(`model=${encodeURIComponent(model)}`);
      const query = params.length ? `?${params.join('&')}` : '';
      const res = await fetch(`/api/parts/filter${query}`);
      if (res.ok) {
        let data = await res.json();
        if (data && Array.isArray(data.data)) {
          return data.data;
        } else if (!Array.isArray(data)) {
          return [];
        }
        return data;
      } else {
        // fallback: fetch all parts and filter client-side
        const fallbackRes = await fetch('/api/parts');
        let data = await fallbackRes.json();
        if (data && Array.isArray(data.data)) {
          return data.data;
        } else if (!Array.isArray(data)) {
          return [];
        }
        return data;
      }
    },
  });

  // Fetch featured parts
  const {
    data: featuredParts = [],
    isLoading: featuredLoading,
  } = useQuery({
    queryKey: ['featuredParts', type, brand, model],
    queryFn: async () => {
      const params = [];
      if (type) params.push(`type=${encodeURIComponent(type)}`);
      if (brand) params.push(`brand=${encodeURIComponent(brand)}`);
      if (model) params.push(`model=${encodeURIComponent(model)}`);
      const query = params.length ? `?${params.join('&')}` : '';
      const featuredQuery = query ? `${query}&limit=4` : '?limit=4';
      const featuredRes = await fetch(`/api/parts/featured${featuredQuery}`);
      if (featuredRes.ok) {
        return await featuredRes.json();
      } else {
        return [];
      }
    },
  });

  // Use backend-filtered parts directly
  const pagination = usePagination({
    totalItems: parts.length,
    itemsPerPage: 12,
  });
  const paginatedParts = parts.slice(pagination.startIndex, pagination.endIndex + 1);

  if (partsLoading || featuredLoading) return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="p-2">
            <Skeleton className="w-full aspect-square mb-3" />
            <Skeleton className="w-2/3 h-5 mb-2" />
            <Skeleton className="w-1/2 h-4" />
            <Skeleton className="w-full h-8 mt-2" />
          </div>
        ))}
      </div>
    </div>
  );
  if (!parts.length) {
    // Import the not-found component dynamically to avoid SSR issues
    const PartsNotFound = require('./not-found').default;
    return <PartsNotFound />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      
      
      {/* Featured Parts Section */}
      {featuredParts.length > 0 && (
        <div className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {t('featuredParts.title', { defaultValue: 'Featured Parts' })}
            </h2>
            <p className="text-gray-600">
              {t('featuredParts.description', { defaultValue: 'Our most popular and high-quality parts' })}
            </p>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 mb-8 items-stretch">
            {featuredParts.map((part:any) => (
              <Card key={part.id} className="relative overflow-hidden hover:shadow-lg py-0 transition-shadow cursor-pointer group h-full flex flex-col">
                <Link href={`/parts/${part.id}`} className="block flex-1 flex flex-col">
                  {/* Image Section */}
                  <div className="relative h-40 bg-gray-50 flex items-center justify-center p-3">
                    {part.imageUrl ? (
                      <FallbackImage
                        src={part.imageUrl}
                        alt={part.name}
                        width={200}
                        height={200}
                        className="object-contain w-full h-full group-hover:scale-105 transition-transform duration-200"
                        fallbackContent={
                          <div className="w-full h-full flex items-center justify-center">
                            <ShoppingCart className="h-12 w-12 text-gray-400" />
                          </div>
                        }
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ShoppingCart className="h-12 w-12 text-gray-400" />
                      </div>
                    )}

                    {/* Quality Badge */}
                    {part.quality && (
                      <div className="absolute top-3 left-3 z-10">
                        <Badge 
                          variant="secondary" 
                          className="text-xs font-bold bg-white/95 backdrop-blur-sm border-2 shadow-lg text-gray-900"
                        >
                          {part.quality}
                        </Badge>
                      </div>
                    )}

                    {/* Stock Status Badge - Only show when out of stock */}
                    {part.inStock <= 0 && (
                      <div className="absolute top-3 right-3 z-10">
                        <Badge 
                          variant="secondary"
                          className="text-xs font-bold bg-red-500 text-white border-2 shadow-lg"
                        >
                          Out of Stock
                        </Badge>
                      </div>
                    )}
                  </div>

                  {/* Content Section */}
                  <div className="p-3 space-y-2 flex-1 flex flex-col">
                    <div className="flex-1 flex flex-col">
                      {/* Name */}
                      <h3 className="font-semibold text-gray-900 line-clamp-2 leading-tight">
                        {part.name}
                      </h3>
                      
                      {/* Price */}
                      <div className="flex items-center justify-between">
                        <span className="text-xl font-bold text-blue-600">
                          {formatCurrency(part.cost, 'EUR')}
                        </span>
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="pt-1 flex space-x-2">
                      <Button asChild size="sm" className="flex-1" variant="outline">
                        <Link href={`/quote?deviceType=${encodeURIComponent(part.deviceType ?? part.device_type ?? '')}&brand=${encodeURIComponent(part.brand ?? '')}&model=${encodeURIComponent(part.deviceModel ?? '')}&part=${encodeURIComponent(part.name)}&quality=${encodeURIComponent(part.quality ?? '')}&sku=${encodeURIComponent(part.sku ?? '')}&supplier=${encodeURIComponent(part.supplier ?? '')}`}>
                          Quote
                        </Link>
                      </Button>
                      <Button
                        size="sm"
                        variant="default"
                        disabled={part.inStock <= 0}
                        onClick={() => {
                          addToCart({
                            id: part.id,
                            name: part.name,
                            price: part.cost,
                            image: part.imageUrl,
                            type:"part"
                          });
                        }}
                      >
                        <ShoppingCart className="h-4 w-4" />
                        <span className="sr-only">
                          {part.inStock > 0 ? 'Add to Cart' : 'Out of Stock'}
                        </span>
                      </Button>
                    </div>
                  </div>
                </Link>
              </Card>
            ))}
          </div>
        </div>
      )}
      
      {/* All Parts Grid */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-6 text-center">{t('allPartsList', { defaultValue: 'All Parts' })}</h2>
         <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 items-stretch">
          {paginatedParts.map((part:any) => (
            <Card key={part.id} className="relative overflow-hidden hover:shadow-lg py-0 transition-shadow cursor-pointer group h-full flex flex-col">
              <Link href={`/parts/${part.id}`} className="block flex-1 flex flex-col">
                {/* Image Section */}
                <div className="relative h-40 bg-gray-50 flex items-center justify-center p-3">
                  {part.imageUrl ? (
                    <FallbackImage
                      src={part.imageUrl}
                      alt={part.name}
                      width={200}
                      height={200}
                      className="object-contain w-full h-full group-hover:scale-105 transition-transform duration-200"
                      fallbackContent={
                        <div className="w-full h-full flex items-center justify-center">
                          <ShoppingCart className="h-12 w-12 text-gray-400" />
                        </div>
                      }
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ShoppingCart className="h-12 w-12 text-gray-400" />
                    </div>
                  )}

                  {/* Quality Badge */}
                  {part.quality && (
                    <div className="absolute top-3 left-3 z-10">
                      <Badge 
                        variant="secondary" 
                        className="text-xs font-bold bg-white/95 backdrop-blur-sm border-2 shadow-lg text-gray-900"
                      >
                        {part.quality}
                      </Badge>
                    </div>
                  )}

                  {/* Stock Status Badge - Only show when out of stock */}
                  {part.inStock <= 0 && (
                    <div className="absolute top-3 right-3 z-10">
                      <Badge 
                        variant="secondary"
                        className="text-xs font-bold bg-red-500 text-white border-2 shadow-lg"
                      >
                        Out of Stock
                      </Badge>
                    </div>
                  )}
                </div>

                {/* Content Section */}
                <div className="p-3 space-y-2 flex-1 flex flex-col">
                  <div className="flex-1 flex flex-col">
                    {/* Name */}
                    <h3 className="font-semibold text-gray-900 line-clamp-2 leading-tight">
                      {part.name}
                    </h3>
                    
                    {/* Price */}
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold text-blue-600">
                        {formatCurrency(part.cost, 'EUR')}
                      </span>
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="pt-1 flex space-x-2">
                    <Button asChild size="sm" className="flex-1" variant="outline">
                      <Link href={`/quote?deviceType=${encodeURIComponent(part.deviceType ?? part.device_type ?? '')}&brand=${encodeURIComponent(part.brand ?? '')}&model=${encodeURIComponent(part.deviceModel ?? '')}&part=${encodeURIComponent(part.name)}&quality=${encodeURIComponent(part.quality ?? '')}&sku=${encodeURIComponent(part.sku ?? '')}&supplier=${encodeURIComponent(part.supplier ?? '')}`}>
                        Quote
                      </Link>
                    </Button>
                    <Button
                      size="sm"
                      variant="default"
                      disabled={part.inStock <= 0}
                      onClick={() => {
                        addToCart({
                          id: part.id,
                          name: part.name,
                          price: part.cost,
                          image: part.imageUrl,
                          type:"part"
                        });
                      }}
                    >
                      <ShoppingCart className="h-4 w-4" />
                      <span className="sr-only">
                        {part.inStock > 0 ? 'Add to Cart' : 'Out of Stock'}
                      </span>
                    </Button>
                  </div>
                </div>
              </Link>
            </Card>
          ))}
        </div>
      </div>

      {/* Improved Pagination Controls */}
      {parts.length > 12 && (
        <div className="mt-8">
          <PaginationControls 
            pagination={pagination}
            className="justify-center"
          />
        </div>
      )}
    </div>
  );
}
