// filepath: /app/parts/[id].tsx
'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/components/cart-context';
import { FallbackImage } from '@/components/ui/fallback-image';
import { cn, formatCurrency } from '@/lib/utils';
import { RelatedPartCard } from './related-part-card';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ShoppingCart, Star, Truck, Shield, RotateCcw, Heart, Share2 } from "lucide-react";
import { useLocale, useTranslations } from 'next-intl';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb';
import { Link } from '@/i18n/navigation';
import { useSession } from 'next-auth/react';

export default function PartDetailPage() {
  const t = useTranslations('parts');
  const locale = useLocale();
  const { id } = useParams();
  const { addToCart, clearCart } = useCart();
  const router = useRouter();
  const [part, setPart] = useState<any>(null);
  const [relatedParts, setRelatedParts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();
  const [inWishlist, setInWishlist] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  // Debug session state
  console.log('🔍 Session state:', session);
  console.log('🔍 User logged in:', !!session?.user?.id);

  useEffect(() => {
    async function fetchPartAndRelated() {
      setLoading(true);
      try {
        // Fetch the part
        const res = await fetch(`/api/parts/${id}`);
        let partData = null;
        if (res.ok) partData = await res.json();
        setPart(partData);
        
        if (partData) {
          // Fetch related parts using the new backend API
          const relatedRes = await fetch(`/api/parts/${id}/related?limit=4`);
          if (relatedRes.ok) {
            const relatedData = await relatedRes.json();
            console.log('🎯 Backend returned related parts:', relatedData.length);
            setRelatedParts(relatedData);
          } else {
            console.error('❌ Failed to fetch related parts from backend');
            setRelatedParts([]);
          }
        }
      } catch (error) {
        console.error('Error fetching part and related:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchPartAndRelated();
  }, [id]);

  // Check if part is in wishlist
  useEffect(() => {
    if (!session?.user?.id || !part?.id) return;
    fetch(`/api/wishlist/part/${part.id}`)
      .then(res => res.json())
      .then(data => setInWishlist(!!data.inWishlist));
  }, [session?.user?.id, part?.id]);

  const toggleWishlist = async () => {
    console.log('🔍 toggleWishlist called');
    console.log('🔍 session?.user?.id:', session?.user?.id);
    console.log('🔍 part?.id:', part?.id);
    
    if (!session?.user?.id || !part?.id) {
      console.log('❌ Early return - missing session or part id');
      return;
    }
    
    setWishlistLoading(true);
    const method = inWishlist ? 'DELETE' : 'POST';
    const url = `/api/wishlist/part/${part.id}`;
    
    console.log('🔍 Making request:', method, url);
    
    try {
      const response = await fetch(url, { method });
      console.log('🔍 Response status:', response.status);
      console.log('🔍 Response ok:', response.ok);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Wishlist request failed:', errorText);
      } else {
        console.log('✅ Wishlist request successful');
      }
    } catch (error) {
      console.error('❌ Wishlist request error:', error);
    }
    
    setInWishlist(!inWishlist);
    setWishlistLoading(false);
  };

  if (loading) return <div className="py-12 text-center">{t('loading')}</div>;
  if (!part) return <div className="py-12 text-center text-red-500">{t('notFound')}</div>;

  const isInStock = part.inStock > 0;
  const isLowStock = part.inStock <= part.minStock;

  return (
    <div className="flex flex-col min-h-screen">
      {/* Breadcrumbs & Back Button */}
      <div className="container mx-auto px-4 pt-6 pb-2 flex flex-col gap-2">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href={`/${locale}`}>Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href={`/${locale}/parts`}>{t('allParts')}</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{part.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <button
          type="button"
          className="inline-flex items-center text-sm text-blue-600 hover:underline w-fit mt-2"
          onClick={() => router.push('/parts')}
        >
          ← {t('back', { defaultValue: 'Back' })}
        </button>
      </div>
      {/* Main Product Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 border-gray-200 shadow-lg relative">
              {part.imageUrl ? (
                <FallbackImage
                  src={part.imageUrl}
                  alt={part.name}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  fallbackContent={<div className="w-full h-full flex items-center justify-center text-6xl">🧩</div>}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-6xl">🧩</div>
              )}
            </div>
            {/* Action buttons */}
            <div className="flex space-x-3 flex-wrap">
              
              <Button variant="outline" size="sm" className="flex-1">
                <Shield className="h-4 w-4 mr-2 text-green-600" />
                {t('warranty')}
              </Button>
              <Button variant="outline" size="sm" className="flex-1">
                <Share2 className="h-4 w-4 mr-2" />
                {t('share', { defaultValue: 'Share' })}
              </Button>
              {session?.user?.id && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={toggleWishlist}
                  disabled={wishlistLoading}
                >
                  {inWishlist ? (
                    <Heart className="h-4 w-4 mr-2 text-red-500 fill-red-500" />
                  ) : (
                    <Heart className="h-4 w-4 mr-2" />
                  )}
                  {inWishlist ? t('removeFromWishlist', { defaultValue: 'Remove from Wishlist' }) : t('addToWishlist', { defaultValue: 'Add to Wishlist' })}
                </Button>
              )}
            </div>
          </div>
          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary" className="text-xs">
                  {part.category}
                </Badge>
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
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{part.name}</h1>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span><strong>{t('sku')}:</strong> {part.sku}</span>
                <span><strong>{t('supplier')}:</strong> {part.supplier}</span>
                <span><strong>{t('quality')}:</strong> {part.quality ?? '-'}</span>
              </div>
            </div>
            {/* Price */}
            <div className="space-y-2">
              <div className="text-3xl font-bold text-blue-600">
                {formatCurrency(part.cost, "EUR")}
              </div>
              <p className="text-sm text-gray-600">
                {isInStock ? `${part.inStock} ${t('inStock')}` : t('currentlyUnavailable')}
              </p>
            </div>
            {/* Description */}
            {part.description && (
              <div className="space-y-2">
                <h3 className="font-semibold text-gray-900">{t('description')}</h3>
                <p className="text-gray-600 leading-relaxed">{part.description}</p>
              </div>
            )}
            {/* Add to Cart Section */}
            <div className="flex gap-2 flex-wrap">
              <Button className='flex-1' onClick={() => addToCart({ id: part.id, name: part.name, price: part.cost, image: part.imageUrl, type: 'part' })} disabled={!isInStock}>
                <ShoppingCart className="h-4 w-4 mr-2" />
               
              </Button>
              <Button asChild variant="outline" className='flex-1'>
                <Link
                  href={`/quote?${
                    [
                      part.deviceType ? `deviceType=${encodeURIComponent(part.deviceType)}` : '',
                      (part.brand || part.make) ? `brand=${encodeURIComponent(part.brand || part.make)}` : '',
                      (part.model || part.deviceModel) ? `model=${encodeURIComponent(part.model || part.deviceModel)}` : '',
                      part.service ? `service=${encodeURIComponent(part.service)}` : '',
                      part.name ? `part=${encodeURIComponent(part.name)}` : '',
                      part.quality ? `quality=${encodeURIComponent(part.quality)}` : '',
                      part.sku ? `sku=${encodeURIComponent(part.sku)}` : '',
                      part.supplier ? `supplier=${encodeURIComponent(part.supplier)}` : ''
                    ].filter(Boolean).join('&')
                  }`}
                >
                  {t('getQuote')}
                </Link>
              </Button>
              <Button
                variant="default"
                className='flex-1'
                disabled={!isInStock}
                onClick={() => {
                  if (!isInStock) return;
                  clearCart();
                  addToCart({ id: part.id, name: part.name, price: part.cost, image: part.imageUrl, type: 'part' });
                  router.push('/checkout');
                }}
              >
                {t('buyNow')}
              </Button>
            </div>
            {/* Features */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t">
              <div className="text-center">
                <Truck className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                <p className="text-sm font-medium">{t('features.freeShipping.title')}</p>
                <p className="text-xs text-gray-500">{t('features.freeShipping.description')}</p>
              </div>
              <div className="text-center">
                <Shield className="h-8 w-8 mx-auto mb-2 text-green-600" />
                <p className="text-sm font-medium">{t('features.warranty.title')}</p>
                <p className="text-xs text-gray-500">{t('features.warranty.description')}</p>
              </div>
              <div className="text-center">
                <RotateCcw className="h-8 w-8 mx-auto mb-2 text-orange-600" />
                <p className="text-sm font-medium">{t('features.returns.title')}</p>
                <p className="text-xs text-gray-500">{t('features.returns.description')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Related Products Section */}
      {relatedParts.length > 0 && (
        <div className="bg-gray-50 py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                {t('relatedProducts.title')}
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                {t('relatedProducts.description')}
              </p>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4 xl:gap-6">
              {relatedParts.map((relatedPart) => (
                <RelatedPartCard key={relatedPart.id} part={relatedPart} />
              ))}
            </div>
            <div className="text-center mt-8">
              <Link href="/parts">
                <Button variant="outline" size="lg">
                  {t('relatedProducts.viewAllParts')}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
