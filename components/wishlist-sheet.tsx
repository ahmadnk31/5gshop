'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { useCart } from '@/components/cart-context';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FallbackImage } from '@/components/ui/fallback-image';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Heart, ShoppingCart, Trash2, X } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { Link } from '@/i18n/navigation';
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
  };
  accessory?: {
    id: string;
    name: string;
    price: number;
    imageUrl?: string;
    inStock: number;
    minStock: number;
    category: string;
  };
  createdAt: string;
}

export function WishlistSheet() {
  const { data: session } = useSession();
  const { addToCart } = useCart();
  const t = useTranslations('wishlist');
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: wishlistItems = [], isLoading: loading, refetch } = useQuery({
    queryKey: ['wishlist', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id || !open) return [];
      const res = await fetch('/api/wishlist');
      if (!res.ok) throw new Error('Failed to fetch wishlist');
      const data = await res.json();
      return data.items || [];
    },
    enabled: !!session?.user?.id && open,
    staleTime: 1000 * 60 * 2,
  });

  const removeFromWishlist = async (itemType: 'part' | 'accessory', itemId: string) => {
    try {
      await fetch(`/api/wishlist/${itemType}/${itemId}`, { method: 'DELETE' });
      await queryClient.invalidateQueries({ queryKey: ['wishlist', session?.user?.id] });
    } catch (error) {
      console.error('Error removing from wishlist:', error);
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
    return null;
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          <Heart className="h-5 w-5" />
          {wishlistItems.length > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
            >
              {wishlistItems.length}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5" />
            {t('title')}
            {wishlistItems.length > 0 && (
              <Badge variant="secondary">{wishlistItems.length}</Badge>
            )}
          </SheetTitle>
        </SheetHeader>

        <div className="mt-6">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
              <p className="mt-2 text-sm text-gray-600">{t('loading')}</p>
            </div>
          ) : wishlistItems.length === 0 ? (
            <div className="text-center py-8">
              <Heart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">{t('emptyTitle')}</h3>
              <p className="text-sm text-gray-600 mb-4">{t('emptyDescription')}</p>
              <div className="space-x-2">
                <Link href="/parts">
                  <Button variant="outline" size="sm">{t('browseParts')}</Button>
                </Link>
                <Link href="/accessories">
                  <Button variant="outline" size="sm">{t('browseAccessories')}</Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto">
              {wishlistItems.map((item: WishlistItem) => {
                const product = item.part || item.accessory;
                const itemType = item.part ? 'part' : 'accessory';
                const isInStock = product && product.inStock > 0;
                const isLowStock = product && product.inStock <= product.minStock;

                if (!product) return null;

                return (
                  <div key={`${itemType}-${product.id}`} className="flex gap-3 p-3 border rounded-lg">
                    <Link href={`/${itemType}s/${product.id}`} className="flex-shrink-0">
                      <div className="w-16 h-16 bg-gray-100 rounded-md overflow-hidden">
                        {product.imageUrl ? (
                          <FallbackImage
                            src={product.imageUrl}
                            alt={product.name}
                            fill
                            className="object-cover"
                            sizes="64px"
                            fallbackContent={<div className="w-full h-full flex items-center justify-center text-lg">📦</div>}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-lg">📦</div>
                        )}
                      </div>
                    </Link>

                    <div className="flex-1 min-w-0">
                      <Link href={`/${itemType}s/${product.id}`}>
                        <h4 className="font-medium text-sm line-clamp-2 hover:text-blue-600">
                          {product.name}
                        </h4>
                      </Link>
                      
                      <div className="flex items-center gap-2 mt-1">
                        <span className="font-bold text-blue-600">
                          {formatCurrency(item.part ? item.part.cost : item.accessory!.price, "EUR")}
                        </span>
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
                      </div>

                      <div className="flex gap-2 mt-2">
                        <Button
                          size="sm"
                          className="flex-1"
                          disabled={!isInStock}
                          onClick={() => addToCartFromWishlist(item)}
                        >
                          <ShoppingCart className="h-3 w-3 mr-1" />
                          {isInStock ? t('addToCart') : t('outOfStock')}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFromWishlist(itemType, product.id)}
                        >
                          <Trash2 className="h-3 w-3 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
} 