'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, ShoppingCart, Truck, Shield, CheckCircle, XCircle } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { ImageZoom } from "@/components/ui/image-zoom";
import { useCart } from "@/components/cart-context";
import { useTranslations } from "next-intl";
import { useState } from "react";

type ProductDetailClientProps = {
  part: any;
  relatedParts: any[];
};

// Helper function to create slug from name
function createSlug(name: string, id: string): string {
  const nameSlug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return `${nameSlug}-${id}`;
}

// Helper function to extract brand from part name or device model
function extractBrand(part: any): string {
  // Try to extract from deviceModel first
  if (part.deviceModel) {
    const model = part.deviceModel.toLowerCase();
    if (model.includes('iphone') || model.includes('ipad') || model.includes('macbook') || model.includes('apple')) {
      return 'Apple';
    }
    if (model.includes('samsung') || model.includes('galaxy')) {
      return 'Samsung';
    }
    if (model.includes('huawei')) {
      return 'Huawei';
    }
    if (model.includes('xiaomi')) {
      return 'Xiaomi';
    }
    if (model.includes('oppo')) {
      return 'Oppo';
    }
    if (model.includes('oneplus')) {
      return 'OnePlus';
    }
    if (model.includes('google') || model.includes('pixel')) {
      return 'Google';
    }
    if (model.includes('nokia')) {
      return 'Nokia';
    }
    if (model.includes('motorola')) {
      return 'Motorola';
    }
    if (model.includes('sony')) {
      return 'Sony';
    }
    if (model.includes('lg')) {
      return 'LG';
    }
  }
  
  // Try to extract from part name
  const name = part.name.toLowerCase();
  if (name.includes('iphone') || name.includes('ipad') || name.includes('macbook') || name.includes('apple')) {
    return 'Apple';
  }
  if (name.includes('samsung') || name.includes('galaxy')) {
    return 'Samsung';
  }
  if (name.includes('huawei')) {
    return 'Huawei';
  }
  if (name.includes('xiaomi')) {
    return 'Xiaomi';
  }
  if (name.includes('oppo')) {
    return 'Oppo';
  }
  if (name.includes('oneplus')) {
    return 'OnePlus';
  }
  if (name.includes('google') || name.includes('pixel')) {
    return 'Google';
  }
  if (name.includes('nokia')) {
    return 'Nokia';
  }
  if (name.includes('motorola')) {
    return 'Motorola';
  }
  if (name.includes('sony')) {
    return 'Sony';
  }
  if (name.includes('lg')) {
    return 'LG';
  }
  
  return '';
}

export default function ProductDetailClient({ part, relatedParts }: ProductDetailClientProps) {
  const t = useTranslations('parts');
  const { addToCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);

  const isInStock = part.inStock > 0;
  const isLowStock = part.inStock > 0 && part.inStock <= part.minStock;
  
  // Extract brand for quote link
  const brand = extractBrand(part);

  const handleAddToCart = () => {
    setIsAdding(true);
    addToCart({
      id: part.id,
      name: part.name,
      price: part.cost,
      image: part.imageUrl,
      type: "part"
    });
    setTimeout(() => setIsAdding(false), 1000);
  };

  return (
    <>
      {/* Product Detail Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12">
              {/* Product Image */}
              <div className="space-y-4">
                <div className="relative bg-white rounded-lg border-2 border-gray-200 overflow-hidden aspect-square">
                  {part.imageUrl ? (
                    <ImageZoom
                      src={part.imageUrl}
                      alt={part.name}
                      className="object-contain p-8"
                      fallbackContent={
                        <div className="w-full h-full flex items-center justify-center bg-gray-100">
                          <Package className="h-32 w-32 text-gray-300" />
                        </div>
                      }
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100">
                      <Package className="h-32 w-32 text-gray-300" />
                    </div>
                  )}
                </div>
                
                {/* Trust Badges */}
                <div className="grid grid-cols-3 gap-4">
                  <Card className="text-center p-4">
                    <Shield className="h-8 w-8 mx-auto text-green-600 mb-2" />
                    <p className="text-xs font-medium text-gray-900">
                      {t('badges.warranty', { defaultValue: 'Warranty' })}
                    </p>
                    <p className="text-xs text-gray-600">
                      {t('badges.90days', { defaultValue: '90 Days' })}
                    </p>
                  </Card>
                  <Card className="text-center p-4">
                    <Truck className="h-8 w-8 mx-auto text-green-600 mb-2" />
                    <p className="text-xs font-medium text-gray-900">
                      {t('badges.shipping', { defaultValue: 'Fast Shipping' })}
                    </p>
                    <p className="text-xs text-gray-600">
                      {t('badges.24h', { defaultValue: '24-48h' })}
                    </p>
                  </Card>
                  <Card className="text-center p-4">
                    <CheckCircle className="h-8 w-8 mx-auto text-green-600 mb-2" />
                    <p className="text-xs font-medium text-gray-900">
                      {t('badges.quality', { defaultValue: 'Quality' })}
                    </p>
                    <p className="text-xs text-gray-600">
                      {t('badges.guaranteed', { defaultValue: 'Guaranteed' })}
                    </p>
                  </Card>
                </div>
              </div>

              {/* Product Info */}
              <div className="space-y-6">
                <div>
                  <div className="flex items-start justify-between mb-3">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 flex-1">
                      {part.name}
                    </h1>
                    {part.quality && (
                      <Badge variant="secondary" className="ml-4 flex-shrink-0">
                        {part.quality}
                      </Badge>
                    )}
                  </div>
                  
                  {part.sku && (
                    <p className="text-sm text-gray-600 mb-4">
                      SKU: <span className="font-mono font-semibold">{part.sku}</span>
                    </p>
                  )}

                  {/* Device Compatibility */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {part.deviceModel && (
                      <Badge variant="outline" className="text-sm">
                        {part.deviceModel}
                      </Badge>
                    )}
                    {part.deviceType && (
                      <Badge variant="outline" className="text-sm">
                        {part.deviceType}
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Price & Stock */}
                <Card className="border-2 border-green-600">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">
                          {t('price', { defaultValue: 'Price' })}
                        </p>
                        <p className="text-4xl font-bold text-green-600">
                          {formatCurrency(part.cost, 'EUR')}
                        </p>
                      </div>
                      <div className="text-right">
                        {isInStock ? (
                          <>
                            <div className="flex items-center gap-2 text-green-600 mb-1">
                              <CheckCircle className="h-5 w-5" />
                              <span className="font-semibold">
                                {t('inStock', { defaultValue: 'In Stock' })}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600">
                              {part.inStock} {t('available', { defaultValue: 'available' })}
                            </p>
                            {isLowStock && (
                              <Badge variant="destructive" className="mt-1">
                                {t('lowStock', { defaultValue: 'Low Stock' })}
                              </Badge>
                            )}
                          </>
                        ) : (
                          <div className="flex items-center gap-2 text-red-600">
                            <XCircle className="h-5 w-5" />
                            <span className="font-semibold">
                              {t('outOfStock', { defaultValue: 'Out of Stock' })}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Button 
                        className="w-full" 
                        size="lg"
                        disabled={!isInStock || isAdding}
                        onClick={handleAddToCart}
                      >
                        <ShoppingCart className="h-5 w-5 mr-2" />
                        {isAdding
                          ? t('adding', { defaultValue: 'Adding...' })
                          : isInStock 
                            ? t('addToCart', { defaultValue: 'Add to Cart' })
                            : t('outOfStock', { defaultValue: 'Out of Stock' })
                        }
                      </Button>
                      
                      <Button 
                        asChild
                        variant="outline" 
                        className="w-full" 
                        size="lg"
                      >
                        <Link href={`/quote?part=${encodeURIComponent(part.name)}&brand=${encodeURIComponent(brand)}&model=${encodeURIComponent(part.deviceModel || '')}&quality=${encodeURIComponent(part.quality || '')}&sku=${encodeURIComponent(part.sku || '')}&supplier=${encodeURIComponent(part.supplier || '')}`}>
                          {t('requestQuote', { defaultValue: 'Request Quote' })}
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Description - Always Visible with Prominent Styling */}
                <Card className="border-2 border-green-300 bg-gradient-to-r from-green-50 to-indigo-50 shadow-md">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-gray-900 text-xl">
                      <span className="text-2xl">📝</span>
                      {t('description', { defaultValue: 'Product Description' })}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-800 leading-relaxed text-base">
                      {part.description || `High-quality ${part.name} ${part.deviceModel ? `for ${part.deviceModel}` : part.deviceType ? `for ${part.deviceType}` : ''}. ${part.quality ? `${part.quality} grade` : 'Premium quality'} replacement part with ${t('warrantyPeriod', { defaultValue: '90 days' })} warranty. Professional installation recommended. Fast shipping available.`}
                    </p>
                  </CardContent>
                </Card>

                {/* Additional Info */}
                <Card>
                  <CardHeader>
                    <CardTitle>{t('specifications', { defaultValue: 'Specifications' })}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-gray-600">{t('supplier', { defaultValue: 'Supplier' })}</span>
                      <span className="font-semibold">{part.supplier}</span>
                    </div>
                    {part.quality && (
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-600">{t('qualityGrade', { defaultValue: 'Quality Grade' })}</span>
                        <span className="font-semibold">{part.quality}</span>
                      </div>
                    )}
                    {part.deviceModel && (
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-600">{t('compatibility', { defaultValue: 'Compatible With' })}</span>
                        <span className="font-semibold">{part.deviceModel}</span>
                      </div>
                    )}
                    <div className="flex justify-between py-2">
                      <span className="text-gray-600">{t('warranty', { defaultValue: 'Warranty' })}</span>
                      <span className="font-semibold">{t('warrantyPeriod', { defaultValue: '90 Days' })}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Parts */}
      {relatedParts.length > 0 && (
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-2xl font-bold text-center mb-8 text-gray-900">
                {t('relatedParts', { defaultValue: 'Related Parts' })}
              </h2>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedParts.map((relatedPart: any) => {
                  const relatedSlug = createSlug(relatedPart.name, relatedPart.id);
                  return (
                    <Link key={relatedPart.id} href={`/parts/${relatedSlug}`}>
                      <Card className="hover:shadow-lg transition-shadow border-gray-200 h-full flex flex-col">
                        <CardHeader className="flex-shrink-0">
                          {relatedPart.imageUrl && (
                            <div className="relative h-40 bg-gray-100 rounded-lg mb-3 overflow-hidden">
                              <Image
                                src={relatedPart.imageUrl}
                                alt={relatedPart.name}
                                fill
                                className="object-contain p-4"
                              />
                            </div>
                          )}
                          <CardTitle className="text-base font-semibold text-gray-900 line-clamp-2">
                            {relatedPart.name}
                          </CardTitle>
                          {relatedPart.quality && (
                            <Badge variant="secondary" className="text-xs mt-2 w-fit">
                              {relatedPart.quality}
                            </Badge>
                          )}
                        </CardHeader>
                        <CardContent className="flex-grow flex flex-col justify-end">
                          <div className="flex justify-between items-center">
                            <span className="text-xl font-bold text-green-600">
                              {formatCurrency(relatedPart.cost, 'EUR')}
                            </span>
                            {relatedPart.inStock > 0 ? (
                              <Badge variant="outline" className="text-green-600">
                                {t('inStock', { defaultValue: 'In Stock' })}
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="text-red-600">
                                {t('outOfStock', { defaultValue: 'Out of Stock' })}
                              </Badge>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-12 bg-gradient-to-br from-green-600 to-green-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-3">
            {t('cta.title', { defaultValue: 'Need Help?' })}
          </h2>
          <p className="text-lg text-green-50 mb-6 max-w-2xl mx-auto">
            {t('cta.description', { defaultValue: 'Our experts are ready to help you find the right part for your device' })}
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button asChild size="lg" variant="secondary" className="shadow-lg">
              <Link href="/contact">{t('cta.contact', { defaultValue: 'Contact Us' })}</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="bg-white/10 border-white hover:bg-white hover:text-green-700">
              <Link href={`/quote?part=${encodeURIComponent(part.name)}&brand=${encodeURIComponent(brand)}&model=${encodeURIComponent(part.deviceModel || '')}&quality=${encodeURIComponent(part.quality || '')}&sku=${encodeURIComponent(part.sku || '')}&supplier=${encodeURIComponent(part.supplier || '')}`}>{t('cta.quote', { defaultValue: 'Request Quote' })}</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
