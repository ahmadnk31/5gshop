'use client';

import { useState } from 'react'
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { useCart } from '@/components/cart-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FallbackImage } from '@/components/ui/fallback-image';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { Link } from '@/i18n/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import { useQuery, useQueryClient } from '@tanstack/react-query';

interface WishlistItem {
  id: string;
  part?: {
    id: string;
    name: string;
    cost: number;
    imageUrl?: string;
    inStock: number;
    minStock: number;
    category?: string;
    quality?: string;
  };
  accessory?: {
    id: string;
    name: string;
    price: number;
    imageUrl?: string;
    inStock: number;
    minStock: number;
    category: string;
    quality?: string;
  };
  createdAt: string;
}

export default function WishlistPage() {
  const { data: session } = useSession();
  const { addToCart } = useCart();
  const t = useTranslations('wishlist');
  const queryClient = useQueryClient();
  const [removingId, setRemovingId] = useState<string | null>(null);
  const { data: wishlistItems = [], isLoading: loading, refetch } = useQuery({
    queryKey: ['wishlist', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return [];
      const res = await fetch('/api/wishlist');
      if (!res.ok) throw new Error('Failed to fetch wishlist');
      const data = await res.json();
      return data.items || [];
    },
    enabled: !!session?.user?.id,
    staleTime: 1000 * 60 * 2,
  });

  const removeFromWishlist = async (itemType: 'part' | 'accessory', itemId: string) => {
    setRemovingId(itemId);
    try {
      const body = itemType === 'part' ? { partId: itemId } : { accessoryId: itemId };
      const response = await fetch('/api/wishlist', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to remove from wishlist');
      }

      const result = await response.json();
      console.log('Remove from wishlist result:', result);
      
      // Force refetch of wishlist data
      await queryClient.invalidateQueries({ queryKey: ['wishlist'] });
      await refetch();
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      alert('Failed to remove item from wishlist. Please try again.');
    } finally {
      setRemovingId(null);
    }
  };

  const addToCartFromWishlist = (item: WishlistItem) => {
    if (item.part) {
      addToCart({
        id: item.part.id,
        name: item.part.name,
        price: item.part.cost,
        image: item.part.imageUrl,
        type: 'part'
      });
    } else if (item.accessory) {
      addToCart({
        id: item.accessory.id,
        name: item.accessory.name,
        price: item.accessory.price,
        image: item.accessory.imageUrl,
        type: 'accessory'
      });
    }
  };

  if (!session?.user?.id) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">{t('loginRequired')}</h1>
          <p className="text-gray-600 mb-6">{t('loginRequiredMessage')}</p>
          <Link href="/auth/login">
            <Button>{t('login')}</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-2 md:gap-4 xl:gap-6">
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
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('title')}</h1>
        <p className="text-gray-600">{t('description')}</p>
      </div>

      {wishlistItems.length === 0 ? (
        <div className="text-center py-12">
          <Heart className="h-20 w-20 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">{t('emptyTitle')}</h2>
          <p className="text-gray-600 mb-6">{t('emptyDescription')}</p>
          <div className="space-x-4">
            <Link href="/parts">
              <Button variant="outline">{t('browseParts')}</Button>
            </Link>
            <Link href="/accessories">
              <Button variant="outline">{t('browseAccessories')}</Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-2 md:gap-4 xl:gap-6">
          {wishlistItems.map((item: WishlistItem) => {
            if (item.part) {
              const product = item.part;
              const itemType = 'part';
              const isInStock = product.inStock > 0;
              const isLowStock = product.inStock <= product.minStock;
              return (
                <Card key={`part-${product.id}`} className="hover:shadow-lg py-0 gap-0 transition-shadow">
                  <CardHeader className="p-0">
                    <div className="relative">
                      <Link href={`/${itemType}s/${product.id}`}>
                        <div className="aspect-square bg-gray-100 relative overflow-hidden">
                          {product.imageUrl ? (
                            <FallbackImage
                              src={product.imageUrl}
                              alt={product.name}
                              fill
                              className="object-cover"
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                              fallbackContent={<div className="w-full h-full flex items-center justify-center text-4xl">📦</div>}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-4xl">📦</div>
                          )}
                        </div>
                      </Link>
                      {/* Stock badges */}
                      <div className="absolute top-2 left-2">
                        {!isInStock && (
                          <Badge variant="destructive" className="text-xs">
                            {t('outOfStock')}
                          </Badge>
                        )}
                        {isLowStock && isInStock && (
                          <Badge variant="outline" className="text-xs border-orange-200 text-orange-700">
                            {t('lowStock')}
                          </Badge>
                        )}
                        {/* Quality badge */}
                        {product.quality && (
                          <div className="">
                            <Badge variant="secondary" className="text-xs">
                              {t(`qualityOptions.${product.quality.toLowerCase()}`) || product.quality}
                            </Badge>
                          </div>
                        )}
                      </div>
                      {/* Remove from wishlist button */}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                        onClick={() => removeFromWishlist(itemType, product.id)}
                        disabled={removingId === product.id}
                      >
                        <Trash2 className={`h-4 w-4 ${removingId === product.id ? 'text-gray-400 animate-pulse' : 'text-red-500'}`} />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4">
                    <Link href={`/${itemType}s/${product.id}`}>
                      <h3 className="font-semibold text-lg mb-2 line-clamp-2">{product.name}</h3>
                      <div className="flex items-center mb-3">
                        <span className="text-xl font-bold text-green-600">
                          {formatCurrency(product.cost, "EUR")}
                        </span>
                        {product.category && (
                          <Badge variant="secondary" className="text-xs ml-2">
                            {product.category}
                          </Badge>
                        )}
                      </div>
                    </Link>
                    <Button
                      variant="default"
                      size="sm"
                      className="px-3 w-full"
                      disabled={product.inStock === 0}
                      onClick={() => addToCartFromWishlist(item)}
                      title={t('addToCart')}
                    >
                      <ShoppingCart className="h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              );
            } else if (item.accessory) {
              const product = item.accessory;
              const itemType = 'accessory';
              const isInStock = product.inStock > 0;
              const isLowStock = product.inStock <= product.minStock;
              return (
                <Card key={`accessory-${product.id}`} className="hover:shadow-lg py-0 gap-0 transition-shadow">
                  <CardHeader className="p-0">
                    <div className="relative">
                      <Link href={`/${itemType}s/${product.id}`}>
                        <div className="aspect-square bg-gray-100 relative overflow-hidden">
                          {product.imageUrl ? (
                            <FallbackImage
                              src={product.imageUrl}
                              alt={product.name}
                              fill
                              className="object-cover"
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                              fallbackContent={<div className="w-full h-full flex items-center justify-center text-4xl">📦</div>}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-4xl">📦</div>
                          )}
                        </div>
                      </Link>
                      {/* Stock badges */}
                      <div className="absolute top-2 left-2">
                        {!isInStock && (
                          <Badge variant="destructive" className="text-xs">
                            {t('outOfStock')}
                          </Badge>
                        )}
                        {isLowStock && isInStock && (
                          <Badge variant="outline" className="text-xs border-orange-200 text-orange-700">
                            {t('lowStock')}
                          </Badge>
                        )}
                        {/* Quality badge */}
                        {typeof product.quality === 'string' && product.quality && (
                          <div className="mt-8">
                            <Badge variant="secondary" className="text-xs">
                              {t(`qualityOptions.${product.quality.toLowerCase()}`) || product.quality}
                            </Badge>
                          </div>
                        )}
                      </div>
                      {/* Remove from wishlist button */}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                        onClick={() => removeFromWishlist(itemType, product.id)}
                        disabled={removingId === product.id}
                      >
                        <Trash2 className={`h-4 w-4 ${removingId === product.id ? 'text-gray-400 animate-pulse' : 'text-red-500'}`} />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4">
                    <Link href={`/${itemType}s/${product.id}`}>
                      <h3 className="font-semibold text-lg mb-2 line-clamp-2">{product.name}</h3>
                      <div className="flex items-center mb-3">
                        <span className="text-xl font-bold text-green-600">
                          {formatCurrency(product.price, "EUR")}
                        </span>
                        {product.category && (
                          <Badge variant="secondary" className="text-xs ml-2">
                            {product.category}
                          </Badge>
                        )}
                      </div>
                    </Link>
                    <Button
                      variant="default"
                      size="sm"
                      className="px-3 w-full"
                      disabled={product.inStock === 0}
                      onClick={() => addToCartFromWishlist(item)}
                      title={t('addToCart')}
                    >
                      <ShoppingCart className="h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              );
            } else {
              return null;
            }
          })}
        </div>
      )}
    </div>
  );
} 