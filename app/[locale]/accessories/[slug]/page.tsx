import { ArrowLeft, Heart, Share2, ShoppingCart, Star, Shield, Truck, RotateCcw, ChevronLeft, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FallbackImage } from "@/components/ui/fallback-image";
import { ImageZoom } from "@/components/ui/image-zoom";
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Link } from "@/i18n/navigation";
import { formatCurrency } from "@/lib/utils";
import { getAccessories, getAccessoryById } from "@/app/actions/accessory-actions";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { useCart } from "@/components/cart-context";
import { AccessoryDetailClientActions } from '../components/accessory-actions';
import { AccessoryActionButtons } from '../components/accessory-action-buttons';
import { RelatedAccessoryCard } from '../components/related-accessory-card';
import { AccessoryViewTracker } from '../components/accessory-view-tracker';
import { generateProductMetadata } from "@/lib/seo";
import { Metadata } from "next";

interface AccessoryDetailPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

// Helper function to extract ID from slug
function extractIdFromSlug(slug: string): string {
  const parts = slug.split('-');
  return parts[parts.length - 1];
}

// Helper function to create slug from name and ID
function createSlug(name: string, id: string): string {
  const nameSlug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return `${nameSlug}-${id}`;
}

export async function generateMetadata({ params }: AccessoryDetailPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const accessoryId = extractIdFromSlug(slug);
  const accessory = await getAccessoryById(accessoryId);

  if (!accessory) {
    return {
      title: 'Accessory Not Found',
      description: 'The requested accessory could not be found.',
      robots: {
        index: false,
        follow: false
      }
    };
  }

  const siteName = '5G Shop';
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.5gphones.be';
  const fullUrl = `${siteUrl}/${locale}/accessories/${slug}`;
  const imageUrl = accessory.imageUrl ? 
    (accessory.imageUrl.startsWith('http') ? accessory.imageUrl : `${siteUrl}${accessory.imageUrl}`) 
    : `${siteUrl}/placeholder-accessory.jpg`;

  const categoryLabels: Record<string, string> = {
    CASE: 'Phone Cases',
    CHARGER: 'Chargers',
    CABLE: 'Cables',
    HEADPHONES: 'Headphones',
    SCREEN_PROTECTOR: 'Screen Protectors',
    KEYBOARD: 'Keyboards',
    MOUSE: 'Mice & Trackpads',
    STYLUS: 'Stylus Pens',
    STAND: 'Stands & Holders',
    MOUNT: 'Mounts & Brackets',
    OTHER: 'Other Accessories'
  };

  const categoryLabel = categoryLabels[accessory.category as keyof typeof categoryLabels] || accessory.category;
  const stockStatus = accessory.inStock > 0 ? 'In Stock' : 'Out of Stock';
  const enhancedDescription = accessory.description || 
    `Shop ${accessory.name} - ${categoryLabel} by ${accessory.brand}. ${stockStatus}. Premium quality ${accessory.category.toLowerCase()} accessory ${accessory.model ? `for ${accessory.model}` : 'for various devices'}. Fast shipping, warranty included, secure payment. Buy now at ${siteName}.`;

  return {
    title: `${accessory.name} - ${accessory.brand} ${categoryLabel} | ${siteName}`,
    description: enhancedDescription.substring(0, 160),
    keywords: [
      accessory.name,
      accessory.brand,
      categoryLabel,
      accessory.model || '',
      'phone accessory',
      'mobile accessory',
      'buy online',
      siteName,
      'Netherlands',
      'Europe',
      accessory.compatibility || ''
    ].filter(Boolean).join(', '),
    authors: [{ name: siteName }],
    publisher: siteName,
    openGraph: {
      title: `${accessory.name} - ${accessory.brand}`,
      description: enhancedDescription.substring(0, 200),
      url: fullUrl,
      siteName: siteName,
      locale: locale,
      type: 'website',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 1200,
          alt: `${accessory.name} - ${accessory.brand} ${categoryLabel}`
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title: `${accessory.name} - ${accessory.brand}`,
      description: enhancedDescription.substring(0, 200),
      images: [imageUrl],
      creator: '@5gshop'
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
        'max-video-preview': -1
      }
    },
    alternates: {
      canonical: fullUrl,
      languages: {
        'en': `${siteUrl}/en/accessories/${slug}`,
        'nl': `${siteUrl}/nl/accessories/${slug}`
      }
    },
    other: {
      'price:amount': accessory.price.toString(),
      'price:currency': 'EUR',
      'availability': accessory.inStock > 0 ? 'in stock' : 'out of stock',
      'brand': accessory.brand,
      'category': categoryLabel
    }
  };
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
  const { locale, slug } = await params;
  const accessoryId = extractIdFromSlug(slug);
  const accessory = await getAccessoryById(accessoryId);

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

  // Structured Data (JSON-LD) for SEO
  const siteName = '5G Shop';
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.5gshop.nl';
  const fullUrl = `${siteUrl}/${locale}/accessories/${slug}`;
  const imageUrl = accessory.imageUrl ? 
    (accessory.imageUrl.startsWith('http') ? accessory.imageUrl : `${siteUrl}${accessory.imageUrl}`) 
    : `${siteUrl}/placeholder-accessory.jpg`;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": accessory.name,
    "description": accessory.description || `High-quality ${accessory.name} by ${accessory.brand}. ${getCategoryLabel(accessory.category)} accessory ${accessory.model ? `for ${accessory.model}` : 'for various devices'}.`,
    "image": imageUrl,
    "brand": {
      "@type": "Brand",
      "name": accessory.brand
    },
    "sku": accessory.id,
    "mpn": accessory.id,
    "offers": {
      "@type": "Offer",
      "url": fullUrl,
      "priceCurrency": "EUR",
      "price": accessory.price,
      "priceValidUntil": new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
      "availability": accessory.inStock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "itemCondition": "https://schema.org/NewCondition",
      "seller": {
        "@type": "Organization",
        "name": siteName,
        "url": siteUrl
      },
      "shippingDetails": {
        "@type": "OfferShippingDetails",
        "shippingRate": {
          "@type": "MonetaryAmount",
          "value": "0",
          "currency": "EUR"
        },
        "shippingDestination": {
          "@type": "DefinedRegion",
          "addressCountry": "NL"
        },
        "deliveryTime": {
          "@type": "ShippingDeliveryTime",
          "handlingTime": {
            "@type": "QuantitativeValue",
            "minValue": 1,
            "maxValue": 2,
            "unitCode": "DAY"
          },
          "transitTime": {
            "@type": "QuantitativeValue",
            "minValue": 1,
            "maxValue": 3,
            "unitCode": "DAY"
          }
        }
      }
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "127",
      "bestRating": "5",
      "worstRating": "1"
    },
    "category": getCategoryLabel(accessory.category),
    ...(accessory.model && { "model": accessory.model }),
    ...(accessory.compatibility && { "additionalProperty": {
      "@type": "PropertyValue",
      "name": "Compatibility",
      "value": accessory.compatibility
    }})
  };

  // Breadcrumb structured data
  const breadcrumbStructuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": `${siteUrl}/${locale}`
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Accessories",
        "item": `${siteUrl}/${locale}/accessories`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": getCategoryLabel(accessory.category),
        "item": `${siteUrl}/${locale}/accessories?category=${accessory.category}`
      },
      {
        "@type": "ListItem",
        "position": 4,
        "name": accessory.name,
        "item": fullUrl
      }
    ]
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbStructuredData) }}
      />
      
      {/* Track this accessory as recently viewed */}
      <AccessoryViewTracker accessory={accessory} />
      
      {/* Breadcrumb Navigation */}
      <div className="bg-gray-50 border-b">
        <div className="container mx-auto px-4">
          <Breadcrumb>
            <BreadcrumbList className="flex-wrap text-xs sm:text-sm">
              <BreadcrumbItem>
                <BreadcrumbLink href="/" className="hover:text-green-600">{t('navigationAccessory.home')}</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="mx-1" />
              <BreadcrumbItem>
                <BreadcrumbLink href="/accessories" className="hover:text-green-600">{t('navigationAccessory.accessories')}</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="mx-1 hidden sm:inline" />
              <BreadcrumbItem className="hidden sm:inline-flex">
                <BreadcrumbLink href={`/accessories?category=${accessory.category}`} className="hover:text-green-600">
                  {getCategoryLabel(accessory.category)}
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="mx-1 hidden sm:inline" />
              <BreadcrumbPage className="hidden sm:inline truncate max-w-[200px] md:max-w-none">{accessory.name}</BreadcrumbPage>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      {/* Back Navigation */}
      <div className="container mx-auto px-4 py-2">
        <Link 
          href="/accessories" 
          className="inline-flex items-center text-sm text-green-600 hover:text-green-800 transition-colors"
        >
          <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
          {t('navigationAccessory.backToAccessories')}
        </Link>
      </div>

      {/* Main Product Section */}
      <div className="container mx-auto px-4 ">
        <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 md:gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 border-gray-200 shadow-lg relative">
              {accessory.imageUrl ? (
                <ImageZoom
                  src={accessory.imageUrl}
                  alt={accessory.name}
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
              <div className="text-3xl font-bold text-green-600">
                {formatCurrency(accessory.price, "EUR")}
              </div>
              <p className="text-sm text-gray-600">
                {isInStock ? `${accessory.inStock} ${t('product.inStock')}` : t('product.currentlyUnavailable')}
              </p>
            </div>

            {/* Description - Always Visible with Prominent Styling */}
            <div className="space-y-3 bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border-2 border-blue-200 shadow-sm">
              <h3 className="font-bold text-gray-900 text-xl flex items-center gap-2">
                <span className="text-2xl">📝</span>
                {t('product.description')}
              </h3>
              <p className="text-gray-800 leading-relaxed text-base">
                {accessory.description || `${accessory.name} by ${accessory.brand}. High-quality ${getCategoryLabel(accessory.category).toLowerCase()} accessory ${accessory.model ? `designed for ${accessory.model}` : 'for various devices'}. Premium build quality with excellent durability. Fast shipping and warranty included.`}
              </p>
            </div>

            {/* Compatibility */}
            {accessory.compatibility && (
              <div className="space-y-2">
                <h3 className="font-semibold text-gray-900">{t('product.compatibility')}</h3>
                <p className="text-gray-600">{accessory.compatibility}</p>
              </div>
            )}

            {/* Add to Cart Section */}
            <AccessoryDetailClientActions accessory={accessory} isInStock={isInStock} />

            {/* Features */}
            <div className="grid grid-cols-3 gap-2 sm:gap-4 pt-4 sm:pt-6 border-t">
              <div className="text-center">
                <Truck className="h-6 w-6 sm:h-8 sm:w-8 mx-auto mb-1 sm:mb-2 text-green-600" />
                <p className="text-xs sm:text-sm font-medium">{t('features.freeShipping.title')}</p>
                <p className="text-xs text-gray-500 hidden sm:block">{t('features.freeShipping.description')}</p>
              </div>
              <div className="text-center">
                <Shield className="h-6 w-6 sm:h-8 sm:w-8 mx-auto mb-1 sm:mb-2 text-green-600" />
                <p className="text-xs sm:text-sm font-medium">{t('features.warranty.title')}</p>
                <p className="text-xs text-gray-500 hidden sm:block">{t('features.warranty.description')}</p>
              </div>
              <div className="text-center">
                <RotateCcw className="h-6 w-6 sm:h-8 sm:w-8 mx-auto mb-1 sm:mb-2 text-orange-600" />
                <p className="text-xs sm:text-sm font-medium">{t('features.returns.title')}</p>
                <p className="text-xs text-gray-500 hidden sm:block">{t('features.returns.description')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

     
      {/* Product Specifications */}
      <div className="container mx-auto px-4 py-8 sm:py-12">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8 text-center">{t('specifications.title')}</h2>
          
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
        <div className="bg-gray-50 py-8 sm:py-12">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 sm:mb-4">
                {t('relatedProducts.title')}
              </h2>
              <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto">
                {t('relatedProducts.description')}
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 items-stretch">
              {relatedAccessories.map((relatedAccessory) => {
                const relatedCategoryConfig = categoryConfigs[relatedAccessory.category as keyof typeof categoryConfigs];
                return (
                  <div key={relatedAccessory.id} className="flex">
                    <RelatedAccessoryCard
                      accessory={relatedAccessory}
                      categoryConfig={relatedCategoryConfig}
                    />
                  </div>
                );
              })}
            </div>

            <div className="text-center mt-6 sm:mt-8">
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
