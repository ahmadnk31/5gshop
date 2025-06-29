"use client"
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { FallbackImage } from "@/components/ui/fallback-image";
import { ShoppingCart, Star } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCart } from "@/components/cart-context";
import { Link } from "@/i18n/navigation";
import { formatCurrency } from "@/lib/utils";
import { AccessoryActionButtons } from "./accessory-action-buttons";

interface RelatedAccessoryCardProps {
  accessory: any;
  categoryConfig: any;
}

export function RelatedAccessoryCard({ accessory, categoryConfig }: RelatedAccessoryCardProps) {
  const t = useTranslations('');
  const { addToCart } = useCart();

  // Get category label from translations
  const getCategoryLabel = (category: string) => {
    return t(`categories.${category}`) || category;
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation if this is inside a link
    e.stopPropagation(); // Prevent event bubbling
    
    console.log('🔍 Add to Cart clicked for related accessory:', accessory.id);
    console.log('🔍 Related accessory data:', {
      id: accessory.id,
      name: accessory.name,
      price: accessory.price,
      image: accessory.imageUrl,
      type: 'accessory'
    });
    
    addToCart({
      id: accessory.id,
      name: accessory.name,
      price: accessory.price,
      image: accessory.imageUrl || undefined,
      type: 'accessory',
    });
    
    console.log('✅ addToCart called successfully for related accessory');
  };

  return (
    <Card className="hover:shadow-lg relative transition-shadow group py-0">
      <CardHeader className="p-0">
        <Link href={`/accessories/${accessory.id}`} className="block relative overflow-hidden rounded-t-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
          <div className="w-full h-48 bg-gray-200 flex items-center justify-center group-hover:scale-105 transition-transform relative overflow-hidden">
            {accessory.imageUrl ? (
              <FallbackImage
                src={accessory.imageUrl}
                alt={accessory.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
                fallbackContent={
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <div className="text-center">
                      <span className="text-4xl block">{categoryConfig?.icon || '📦'}</span>
                      <p className="text-sm mt-2">{t('product.imageNotAvailable')}</p>
                    </div>
                  </div>
                }
              />
            ) : (
              <div className="text-center text-gray-400">
                <span className="text-4xl">{categoryConfig?.icon || '📦'}</span>
                <p className="text-sm mt-2">{t('relatedProducts.productImage')}</p>
              </div>
            )}
          </div>
          {accessory.inStock <= accessory.minStock && (
            <Badge className="absolute top-2 left-2" variant="outline">
              {t('product.lowStock')}
            </Badge>
          )}
        </Link>
      </CardHeader>
      <div className="absolute top-2 right-2 z-10">
        <Badge
          variant={accessory.inStock > 0 ? "default" : "destructive"}
          className={
            accessory.inStock > 0
              ? "bg-blue-100 text-blue-800 border-blue-200"
              : "bg-red-100 text-red-800 border-red-200"
          }
        >
          {accessory.inStock > 0
            ? `${t('parts.inStock')}`
            : t('parts.outOfStock')}
        </Badge>
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-2">{accessory.name}</h3>
        
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
            {formatCurrency(accessory.price, "EUR")}
          </span>
          <Badge variant="secondary" className="text-xs">
            {getCategoryLabel(accessory.category)}
          </Badge>
        </div>

        
      <div className="mt-3 flex items-center gap-2">
      <Button 
          size="sm" 
          disabled={accessory.inStock === 0}
          className="px-3 flex-1"
          onClick={handleAddToCart}
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
        </Button>
        <AccessoryActionButtons accessory={accessory} />
      </div>
      </CardContent>
    </Card>
  );
} 