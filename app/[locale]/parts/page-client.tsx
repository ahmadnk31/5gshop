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
      const featuredRes = await fetch(`/api/parts/featured${query}&limit=4`.replace('?&', '?'));
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
  if (!parts.length) return <div className="py-12 text-center text-red-500">{t('notFound')}</div>;

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
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4 xl:gap-6 mb-8">
            {featuredParts.map((part:any) => (
              <Card key={part.id} className="hover:shadow-lg relative transition-shadow group py-0 gap-0">
                <Link href={`/parts/${part.id}`}>
                <CardHeader className="p-0">
                  <div className="relative overflow-hidden rounded-t-lg">
                    <div className="w-full h-48 bg-gray-200 flex items-center justify-center group-hover:scale-105 transition-transform relative overflow-hidden">
                      {part.imageUrl ? (
                        <FallbackImage
                          src={part.imageUrl}
                          alt={part.name}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
                          fallbackContent={<div className="w-full h-full flex items-center justify-center text-4xl">🧩</div>}
                        />
                      ) : (
                        <div className="text-center text-gray-400">
                          <span className="text-4xl">🧩</span>
                          <p className="text-sm mt-2">{t('relatedProducts.productImage')}</p>
                        </div>
                      )}
                    </div>
                    {part.inStock <= part.minStock && (
                      <Badge className="absolute top-2 left-2" variant="outline">
                        {t('lowStock')}
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <div className="absolute top-2 right-2 z-10">
                  <PartActionButtons part={part} />
                </div>
                </Link>
                {part.inStock === 0 && (
                  <div className="absolute top-2 right-2">
                    <Badge variant="destructive" className="text-xs">
                      {t('outOfStock', { defaultValue: 'Out of Stock' })}
                    </Badge>
                  </div>
                )}
                {part.quality && (
                  <div className="absolute top-2 left-2">
                    <Badge variant="secondary" className="text-xs">
                      {t(`qualityOptions.${part.quality.toLowerCase()}`) || part.quality}
                    </Badge>
                  </div>
                )}
                <CardContent className="p-4">
                  <Link href={`/parts/${part.id}`}>
                  <h3 className="font-semibold text-sm md:text-lg xl:text-xl mb-2 line-clamp-2">{part.name}</h3>
                  <div className="flex items-center mb-3">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <span className="text-sm text-gray-500 ml-2">(4.5)</span>
                  </div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xl font-bold text-blue-600">
                      {formatCurrency(part.cost, "EUR")}
                    </span>
                    <Badge variant="secondary" className="text-xs">
                      {part.category}
                    </Badge>
                  </div>
                  </Link>
                  
                   
                    <Button
                      variant="default"
                      size="sm"
                      className="px-3 w-full"
                      disabled={part.inStock === 0}
                      onClick={() => addToCart({ id: part.id, name: part.name, price: part.cost, image: part.imageUrl, type: 'part' })}
                      title={t('addToCart')}
                    >
                      <ShoppingCart className="h-4 w-4" />
                    </Button>
                  
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
      
      {/* All Parts Grid */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-6 text-center">{t('allPartsList', { defaultValue: 'All Parts' })}</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4 xl:gap-6">
          {paginatedParts.map((part:any) => (
            <Card key={part.id} className="hover:shadow-lg relative transition-shadow group py-0 gap-0">
              <Link href={`/parts/${part.id}`}>
              <CardHeader className="p-0">
                <div className="relative overflow-hidden rounded-t-lg">
                  <div className="w-full h-48 bg-gray-200 flex items-center justify-center group-hover:scale-105 transition-transform relative overflow-hidden">
                    {part.imageUrl ? (
                      <FallbackImage
                        src={part.imageUrl}
                        alt={part.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
                        fallbackContent={<div className="w-full h-full flex items-center justify-center text-4xl">🧩</div>}
                      />
                    ) : (
                      <div className="text-center text-gray-400">
                        <span className="text-4xl">🧩</span>
                        <p className="text-sm mt-2">{t('relatedProducts.productImage')}</p>
                      </div>
                    )}
                  </div>
                  {part.inStock <= part.minStock && (
                    <Badge className="absolute top-2 left-2" variant="outline">
                      {t('lowStock')}
                    </Badge>
                  )}
                </div>
                <div className="absolute top-2 right-2 z-10">
                  <PartActionButtons part={part} />
                </div>
              </CardHeader>
                {/* Show quality badge if available */}
                {part.quality && (
                  <div className="absolute top-2 left-2">
                    <Badge variant="secondary" className="text-xs">
                      {t(`qualityOptions.${part.quality.toLowerCase()}`) || part.quality}
                    </Badge>
                  </div>
                )}
                
              {part.inStock === 0 && (
                <div className="absolute top-2 right-2">
                  <Badge variant="destructive" className="text-xs">
                    {t('outOfStock', { defaultValue: 'Out of Stock' })}
                  </Badge>
                </div>
              )}
              </Link>
              <CardContent className="p-4">
                <Link href={`/parts/${part.id}`}>
                <h3 className="font-semibold text-sm md:text-lg mb-2 line-clamp-2">{part.name}</h3>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-lg md:text-xl font-bold text-blue-600">
                    {formatCurrency(part.cost, "EUR")}
                  </span>
                  <Badge variant="secondary" className="text-xs">
                    {part.category}
                  </Badge>
                </div>
                </Link>
                  <Button
                    variant="default"
                    size="sm"
                    className="px-3 w-full"
                    disabled={part.inStock === 0}
                    onClick={() => addToCart({ id: part.id, name: part.name, price: part.cost, image: part.imageUrl, type: 'part' })}
                    title={t('addToCart')}
                  >
                    <ShoppingCart className="h-4 w-4" />
                  </Button>
                
              </CardContent>
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
