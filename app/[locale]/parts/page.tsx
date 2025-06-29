// Simple Parts List Page for /parts
'use client';

import { useEffect, useState } from 'react';
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

export default function PartsPage() {
  const t = useTranslations('parts');
  const [parts, setParts] = useState<any[]>([]);
  const [featuredParts, setFeaturedParts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const user=useSession().data
  // Use the proper pagination hook
  const pagination = usePagination({
    totalItems: parts.length,
    itemsPerPage: 12,
  });

  useEffect(() => {
    async function fetchParts() {
      setLoading(true);
      try {
        // Fetch all parts
        const res = await fetch('/api/parts');
        if (res.ok) {
          let data = await res.json();
          if (data && Array.isArray(data.data)) {
            data = data.data;
          } else if (!Array.isArray(data)) {
            data = [];
          }
          setParts(data);
        }
        
        // Fetch featured parts using the new backend API
        const featuredRes = await fetch('/api/parts/featured?limit=4');
        if (featuredRes.ok) {
          const featuredData = await featuredRes.json();
          console.log('🎯 Backend returned featured parts:', featuredData.length);
          setFeaturedParts(featuredData);
        } else {
          console.error('❌ Failed to fetch featured parts from backend');
          setFeaturedParts([]);
        }
      } finally {
        setLoading(false);
      }
    }
    fetchParts();
  }, []);

  // Get paginated parts
  const paginatedParts = parts.slice(pagination.startIndex, pagination.endIndex + 1);

  if (loading) return <div className="py-12 text-center">{t('loading')}</div>;
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
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {featuredParts.map((part) => (
              <Card key={part.id} className="hover:shadow-lg relative transition-shadow group py-0">
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
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {paginatedParts.map((part) => (
            <Card key={part.id} className="hover:shadow-lg relative transition-shadow group py-0">
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
