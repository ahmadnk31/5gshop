'use client';

import { useEffect, useState } from 'react';
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

export default function WishlistPage() {
  const { data: session } = useSession();
  const { addToCart } = useCart();
  const t = useTranslations('wishlist');
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session?.user?.id) return;
    
    fetch('/api/wishlist')
      .then(res => res.json())
      .then(data => {
        setWishlistItems(data.items || []);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching wishlist:', error);
        setLoading(false);
      });
  }, [session?.user?.id]);

  const removeFromWishlist = async (itemType: 'part' | 'accessory', itemId: string) => {
    try {
      await fetch(`/api/wishlist/${itemType}/${itemId}`, { method: 'DELETE' });
      setWishlistItems(prev => prev.filter(item => 
        (itemType === 'part' && item.part?.id !== itemId) ||
        (itemType === 'accessory' && item.accessory?.id !== itemId)
      ));
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
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">{t('loading')}</div>
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
          <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlistItems.map((item) => {
            const product = item.part || item.accessory;
            const itemType = item.part ? 'part' : 'accessory';
            const isInStock = product && product.inStock > 0;
            const isLowStock = product && product.inStock <= product.minStock;

            if (!product) return null;

            return (
              <Card key={`${itemType}-${product.id}`} className="hover:shadow-lg transition-shadow">
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
                    </div>

                    {/* Remove from wishlist button */}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                      onClick={() => removeFromWishlist(itemType, product.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </CardHeader>

                <CardContent className="p-4">
                  <Link href={`/${itemType}s/${product.id}`}>
                    <h3 className="font-semibold text-sm mb-2 line-clamp-2 hover:text-blue-600">
                      {product.name}
                    </h3>
                  </Link>
                  
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-lg font-bold text-blue-600">
                      {formatCurrency(item.part ? item.part.cost : item.accessory!.price, "EUR")}
                    </span>
                    <Badge variant="secondary" className="text-xs">
                      {product.category}
                    </Badge>
                  </div>

                  <Button
                    size="sm"
                    className="w-full"
                    disabled={!isInStock}
                    onClick={() => addToCartFromWishlist(item)}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    {isInStock ? t('addToCart') : t('outOfStock')}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
} 