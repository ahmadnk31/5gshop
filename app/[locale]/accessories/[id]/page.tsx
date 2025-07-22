import { ArrowLeft, Heart, Share2, ShoppingCart, Star, Shield, Truck, RotateCcw, ChevronLeft, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FallbackImage } from "@/components/ui/fallback-image";
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Link } from "@/i18n/navigation";
import { formatCurrency } from "@/lib/utils";
import { getAccessories, getAccessoryById } from "@/app/actions/accessory-actions";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { useCart } from "@/components/cart-context";
import { AccessoryDetailClientActions } from './accessory-actions';
import { AccessoryActionButtons } from './accessory-action-buttons';
import { RelatedAccessoryCard } from './related-accessory-card';
import { AccessoryViewTracker } from './accessory-view-tracker';
import { generateProductMetadata } from "@/lib/seo";
import { Metadata } from "next";

interface AccessoryDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: AccessoryDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const accessory = await getAccessoryById(id);

  if (!accessory) {
    return {
      title: 'Accessory Not Found',
      description: 'The requested accessory could not be found.'
    };
  }

  return await generateProductMetadata({
    productName: accessory.name,
    description: accessory.description || `High-quality ${accessory.name} for ${accessory.model || 'various devices'}. ${accessory.category} accessory with premium quality and fast shipping.`,
    price: accessory.price,
    images: accessory.imageUrl ? [accessory.imageUrl] : undefined,
    category: accessory.category,
    brand: accessory.brand,
    availability: accessory.inStock > 0 ? 'in_stock' : 'out_of_stock',
    path: `/accessories/${accessory.id}`
  });
}

// Category configurations for related products
const categoryConfigs = {
  CASE: { icon: '📱' },
  CHARGER: { icon: '🔌' },
  CABLE: { icon: '🔗' },
  HEADPHONES: { icon: '🎧' },
  SCREEN_PROTECTOR: { icon: '🛡️' },
  KEYBOARD: { icon: '⌨️' },
  MOUSE: { icon: '🖱️' },
  STYLUS: { icon: '✏️' },
  STAND: { icon: '🔺' },
  MOUNT: { icon: '📐' },
  OTHER: { icon: '📦' }
};

export default async function AccessoryDetailPage({ params }: AccessoryDetailPageProps) {
  const t = await getTranslations();
  const { id } = await params;
  const accessory = await getAccessoryById(id);

  if (!accessory) {
    notFound();
  }

  // Get related accessories (same category, different id)
  const allAccessories = await getAccessories();
  console.log('All accessories:', allAccessories);
  console.log('Current accessory:', accessory);
  console.log('Accessory category:', accessory.category);
  const relatedAccessories = allAccessories
    .filter(item => 
      item.category === accessory.category && 
      item.id !== accessory.id && 
      item.inStock > 0
    )
    .slice(0, 4);

  // If not enough related in same category, get popular accessories from other categories
  if (relatedAccessories.length < 4) {
    const otherAccessories = allAccessories
      .filter(item => 
        item.id !== accessory.id && 
        item.inStock > 0 &&
        !relatedAccessories.some(related => related.id === item.id)
      )
      .sort((a, b) => b.inStock - a.inStock) // Sort by stock (popularity indicator)
      .slice(0, 4 - relatedAccessories.length);
    
    relatedAccessories.push(...otherAccessories);
  }

  const categoryConfig = categoryConfigs[accessory.category as keyof typeof categoryConfigs];
  const isInStock = accessory.inStock > 0;
  const isLowStock = accessory.inStock <= accessory.minStock;

  // Get category label from translations
  const getCategoryLabel = (category: string) => {
    return t(`categories.${category}`) || category;
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Track this accessory as recently viewed */}
      <AccessoryViewTracker accessory={accessory} />
      
      {/* Breadcrumb Navigation */}
      <div className="bg-gray-50 border-b">
        <div className="container mx-auto px-4 py-3">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">{t('navigationAccessory.home')}</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/accessories">{t('navigationAccessory.accessories')}</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href={`/accessories?category=${accessory.category}`}>
                  {getCategoryLabel(accessory.category)}
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbPage>{accessory.name}</BreadcrumbPage>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      {/* Back Navigation */}
      <div className="container mx-auto px-4 py-4">
        <Link 
          href="/accessories" 
          className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t('navigationAccessory.backToAccessories')}
        </Link>
      </div>

      {/* Main Product Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 border-gray-200 shadow-lg relative">
              {accessory.imageUrl ? (
                <FallbackImage
                  src={accessory.imageUrl}
                  alt={accessory.name}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  fallbackContent={
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                      <div className="text-center text-gray-500">
                        <span className="text-6xl mb-4 block">{categoryConfig?.icon || '📦'}</span>
                        <p className="text-lg font-medium text-gray-700">{accessory.name}</p>
                        <p className="text-sm text-gray-500 mt-2">{t('product.imageNotAvailable')}</p>
                      </div>
                    </div>
                  }
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                  <div className="text-center text-gray-500">
                    <span className="text-6xl mb-4 block">{categoryConfig?.icon || '📦'}</span>
                    <p className="text-lg font-medium text-gray-700">{accessory.name}</p>
                    <p className="text-sm text-gray-500 mt-2">{t('product.noImageAvailable')}</p>
                  </div>
                </div>
              )}
            </div>
            
            {/* Image Info */}
            {accessory.imageUrl && (
              <div className="text-center text-xs text-gray-500">
                {t('product.clickToZoom')}
              </div>
            )}
            
            {/* Action buttons */}
            <div className="flex space-x-3">
              
              <Button variant="outline" size="sm" className="flex-1">
                <Share2 className="h-4 w-4 mr-2" />
                {t('product.share')}
              </Button>
              <AccessoryActionButtons accessory={accessory} />
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            {/* Header */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary" className="text-xs">
                  {getCategoryLabel(accessory.category)}
                </Badge>
                {!isInStock && (
                  <Badge variant="destructive" className="text-xs">
                    {t('product.outOfStock')}
                  </Badge>
                )}
                {isLowStock && isInStock && (
                  <Badge variant="outline" className="text-xs border-orange-200 text-orange-700">
                    {t('product.lowStock')}
                  </Badge>
                )}
              </div>
              
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{accessory.name}</h1>
              
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span><strong>{t('product.brand')}:</strong> {accessory.brand}</span>
                {accessory.model && (
                  <span><strong>{t('product.model')}:</strong> {accessory.model}</span>
                )}
              </div>
            </div>

            {/* Rating */}
            <div className="flex items-center space-x-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <span className="text-sm text-gray-600">(4.8)</span>
              <span className="text-sm text-gray-500">• 127 {t('product.rating.reviews')}</span>
            </div>

            {/* Price */}
            <div className="space-y-2">
              <div className="text-3xl font-bold text-blue-600">
                {formatCurrency(accessory.price, "EUR")}
              </div>
              <p className="text-sm text-gray-600">
                {isInStock ? `${accessory.inStock} ${t('product.inStock')}` : t('product.currentlyUnavailable')}
              </p>
            </div>

            {/* Compatibility */}
            {accessory.compatibility && (
              <div className="space-y-2">
                <h3 className="font-semibold text-gray-900">{t('product.compatibility')}</h3>
                <p className="text-gray-600">{accessory.compatibility}</p>
              </div>
            )}

            {/* Description */}
            {accessory.description && (
              <div className="space-y-2">
                <h3 className="font-semibold text-gray-900">{t('product.description')}</h3>
                <p className="text-gray-600 leading-relaxed">{accessory.description}</p>
              </div>
            )}

            {/* Add to Cart Section */}
            <AccessoryDetailClientActions accessory={accessory} isInStock={isInStock} />

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

     
      {/* Product Specifications */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">{t('specifications.title')}</h2>
          
          <Card>
            <CardContent className="p-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="font-medium text-gray-700">{t('specifications.productName')}</span>
                    <span className="text-gray-900">{accessory.name}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="font-medium text-gray-700">{t('specifications.brand')}</span>
                    <span className="text-gray-900">{accessory.brand}</span>
                  </div>
                  {accessory.model && (
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="font-medium text-gray-700">{t('specifications.model')}</span>
                      <span className="text-gray-900">{accessory.model}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="font-medium text-gray-700">{t('specifications.category')}</span>
                    <span className="text-gray-900">{getCategoryLabel(accessory.category)}</span>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="font-medium text-gray-700">{t('specifications.price')}</span>
                    <span className="text-gray-900 font-bold">{formatCurrency(accessory.price, "EUR")}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="font-medium text-gray-700">{t('specifications.availability')}</span>
                    <span className={`font-medium ${isInStock ? 'text-green-600' : 'text-red-600'}`}>
                      {isInStock ? `${accessory.inStock} ${t('product.inStock')}` : t('specifications.outOfStock')}
                    </span>
                  </div>
                  {accessory.compatibility && (
                    <div className="flex justify-between items-start py-2 border-b border-gray-100">
                      <span className="font-medium text-gray-700">{t('specifications.compatibility')}</span>
                      <span className="text-gray-900 text-right max-w-xs">{accessory.compatibility}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="font-medium text-gray-700">{t('specifications.productId')}</span>
                    <span className="text-gray-500 text-sm font-mono">{accessory.id}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
       {/* Related Products Section */}
       {relatedAccessories.length > 0 && (
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

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedAccessories.map((relatedAccessory) => {
                const relatedCategoryConfig = categoryConfigs[relatedAccessory.category as keyof typeof categoryConfigs];
                return (
                  <RelatedAccessoryCard
                    key={relatedAccessory.id}
                    accessory={relatedAccessory}
                    categoryConfig={relatedCategoryConfig}
                  />
                );
              })}
            </div>

            <div className="text-center mt-8">
              <Link href="/accessories">
                <Button variant="outline" size="lg">
                  {t('relatedProducts.viewAllAccessories')}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

