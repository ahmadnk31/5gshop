// Simple Parts List Page for /parts
'use client';

import { useEffect, useState } from 'react';
import { useCart } from '@/components/cart-context';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { FallbackImage } from '@/components/ui/fallback-image';
import { formatCurrency } from '@/lib/utils';
import { Link } from '@/i18n/navigation';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';

const PAGE_SIZE = 12;

export default function PartsPage() {
  const t = useTranslations('parts');
  const [parts, setParts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const { addToCart } = useCart();

  useEffect(() => {
    async function fetchParts() {
      setLoading(true);
      try {
        const res = await fetch('/api/parts');
        if (res.ok) {
          let data = await res.json();
          if (!Array.isArray(data)) {
            if (data && Array.isArray(data.data)) {
              data = data.data;
            } else {
              data = [];
            }
          }
          setParts(data);
        }
      } finally {
        setLoading(false);
      }
    }
    fetchParts();
  }, []);

  if (loading) return <div className="py-12 text-center">{t('loading')}</div>;
  if (!parts.length) return <div className="py-12 text-center text-red-500">{t('notFound')}</div>;

  // Pagination logic
  const totalPages = Math.ceil(parts.length / PAGE_SIZE);
  const paginatedParts = parts.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">{t('allParts')}</h1>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {paginatedParts.map((part) => (
          <Card key={part.id} className="hover:shadow-lg transition-shadow group">
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
            <CardContent className="p-4">
              <h3 className="font-semibold text-lg mb-2 line-clamp-2">{part.name}</h3>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xl font-bold text-blue-600">
                  {formatCurrency(part.cost, "EUR")}
                </span>
                <Badge variant="secondary" className="text-xs">
                  {part.category}
                </Badge>
              </div>
              <div className="flex space-x-2">
                <Link href={`/parts/${part.id}`} className="flex-1">
                  <Button variant="outline" size="sm" className="w-full">
                    {t('relatedProducts.viewDetails')}
                  </Button>
                </Link>
                <Button
                  variant="default"
                  size="sm"
                  className="px-3"
                  disabled={part.inStock === 0}
                  onClick={() => addToCart({ id: part.id, name: part.name, price: part.cost, image: part.imageUrl, type: 'part' })}
                  title={t('addToCart')}
                >
                  <ShoppingCart className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-8 space-x-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            {t('previous', { defaultValue: 'Previous' })}
          </Button>
          {Array.from({ length: totalPages }, (_, i) => (
            <Button
              key={i + 1}
              variant={page === i + 1 ? 'default' : 'outline'}
              size="sm"
              onClick={() => setPage(i + 1)}
            >
              {i + 1}
            </Button>
          ))}
          <Button
            variant="outline"
            size="sm"
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
          >
            {t('next', { defaultValue: 'Next' })}
          </Button>
        </div>
      )}
    </div>
  );
}
