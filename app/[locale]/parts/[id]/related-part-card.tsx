"use client"
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { FallbackImage } from "@/components/ui/fallback-image";
import { ShoppingCart, Star, Heart } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCart } from "@/components/cart-context";
import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { Link } from "@/i18n/navigation";
import { formatCurrency } from "@/lib/utils";

interface RelatedPartCardProps {
  part: any;
}

export function RelatedPartCard({ part }: RelatedPartCardProps) {
  const t = useTranslations('');
  const { addToCart } = useCart();
  const { data: session } = useSession();
  const [inWishlist, setInWishlist] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  // Check if part is in wishlist
  useEffect(() => {
    if (!session?.user?.id || !part?.id) return;
    fetch(`/api/wishlist/part/${part.id}`)
      .then(res => res.json())
      .then(data => setInWishlist(!!data.inWishlist));
  }, [session?.user?.id, part?.id]);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation if this is inside a link
    e.stopPropagation(); // Prevent event bubbling
    
    console.log('🔍 Add to Cart clicked for related part:', part.id);
    console.log('🔍 Related part data:', {
      id: part.id,
      name: part.name,
      price: part.cost,
      image: part.imageUrl,
      type: 'part'
    });
    
    addToCart({
      id: part.id,
      name: part.name,
      price: part.cost,
      image: part.imageUrl || undefined,
      type: 'part',
    });
    
    console.log('✅ addToCart called successfully for related part');
  };

  const toggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation if this is inside a link
    e.stopPropagation(); // Prevent event bubbling
    
    if (!session?.user?.id || !part?.id) return;
    
    setWishlistLoading(true);
    const method = inWishlist ? 'DELETE' : 'POST';
    const url = `/api/wishlist/part/${part.id}`;
    
    console.log('🔍 Making wishlist request:', method, url);
    
    try {
      const response = await fetch(url, { method });
      console.log('🔍 Wishlist response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Wishlist request failed:', errorText);
      } else {
        console.log('✅ Wishlist request successful');
        setInWishlist(!inWishlist);
      }
    } catch (error) {
      console.error('❌ Wishlist request error:', error);
    }
    
    setWishlistLoading(false);
  };

  const isInStock = part.inStock > 0;
  const isLowStock = part.inStock <= part.minStock;

  return (
    <Card className="hover:shadow-lg relative transition-shadow group py-0 h-full flex flex-col">
      <CardHeader className="p-0">
        <Link href={`/parts/${part.id}`} className="block relative overflow-hidden rounded-t-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
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
          {isLowStock && isInStock && (
            <Badge className="absolute top-2 left-2" variant="outline">
              {t('product.lowStock')}
            </Badge>
          )}
        </Link>
      </CardHeader>
      <div className="absolute top-2 right-2 z-10">
        <Badge
          variant={isInStock ? "default" : "destructive"}
          className={
            isInStock
              ? "bg-blue-100 text-blue-800 border-blue-200"
              : "bg-red-100 text-red-800 border-red-200"
          }
        >
          {isInStock
            ? `${t('parts.inStock')}`
            : t('parts.outOfStock')}
        </Badge>
      </div>
      <CardContent className="p-4 flex-1 flex flex-col">
        <div className="flex-1 flex flex-col">
          <h3 className="font-semibold text-lg mb-2 line-clamp-2">{part.name}</h3>
          
          <div className="flex items-center mb-3">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
              ))}
            </div>
            <span className="text-sm text-gray-500 ml-2">(4.5)</span>
          </div>

          <div className="flex items-center justify-between mb-4">
            <span className="text-sm md:text-lg xl:text-xl font-bold text-blue-600">
              {formatCurrency(part.cost, "EUR")}
            </span>
            <Badge variant="secondary" className="text-xs">
              {part.category}
            </Badge>
          </div>
        </div>

        <div className="mt-3 flex items-center gap-2">
          <Button 
            size="sm" 
            disabled={!isInStock}
            className="px-3 flex-1"
            onClick={handleAddToCart}
          >
            <ShoppingCart className="h-4 w-4" />
            
          </Button>
          
          {/* Wishlist Button */}
          {session?.user?.id && (
            <Button
              variant="outline"
              size="sm"
              onClick={toggleWishlist}
              disabled={wishlistLoading}
              className="px-3"
              
            >
              {inWishlist ? (
                <Heart className="h-4 w-4 text-red-500 fill-red-500" />
              ) : (
                <Heart className="h-4 w-4" />
              )}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 