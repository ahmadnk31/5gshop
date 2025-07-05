'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FallbackImage } from '@/components/ui/fallback-image';
import { useCart } from '@/components/cart-context';
import { Link } from '@/i18n/navigation';
import { formatCurrency } from '@/lib/utils';
import { Package, Clock, Search, Eye, ShoppingCart } from 'lucide-react';

interface RecentlyViewedItem {
  id: string;
  name: string;
  price: number;
  imageUrl?: string;
  type: 'part' | 'accessory';
  category?: string;
  url: string;
  viewedAt: number;
}

interface SearchBasedItem {
  id: string;
  name: string;
  price: number;
  imageUrl?: string;
  type: 'part' | 'accessory';
  category?: string;
  url: string;
  searchTerm: string;
}

const MAX_RECENT_ITEMS = 6;
const MAX_SEARCH_ITEMS = 6;

export function RecentlyViewedSection() {
  const t = useTranslations();
  const { addToCart } = useCart();
  const [recentlyViewed, setRecentlyViewed] = useState<RecentlyViewedItem[]>([]);
  const [searchBasedItems, setSearchBasedItems] = useState<SearchBasedItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load recently viewed items from localStorage
    const loadRecentlyViewed = () => {
      try {
        const stored = localStorage.getItem('recentlyViewed');
        if (stored) {
          const items: RecentlyViewedItem[] = JSON.parse(stored);
          // Sort by most recent and limit
          const sorted = items
            .sort((a, b) => b.viewedAt - a.viewedAt)
            .slice(0, MAX_RECENT_ITEMS);
          setRecentlyViewed(sorted);
        }
      } catch (error) {
        console.error('Error loading recently viewed items:', error);
      }
    };

    // Load search-based recommendations
    const loadSearchBasedItems = async () => {
      try {
        const stored = localStorage.getItem('searchHistory');
        if (stored) {
          const searchHistory: string[] = JSON.parse(stored);
          console.log('Search history from localStorage:', searchHistory);
          // Get the most recent searches and fetch recommendations
          const recentSearches = searchHistory.slice(-3); // Last 3 searches
          console.log('Recent searches:', recentSearches);
          
          // Remove duplicates while preserving order
          const uniqueSearches = Array.from(new Set(recentSearches));
          console.log('Unique searches:', uniqueSearches);
          
          // Fetch real search results from API
          const searchResults: SearchBasedItem[] = [];
          
          for (const searchTerm of uniqueSearches) {
            try {
              // Search for parts
              const partsResponse = await fetch(`/api/search/repairs?q=${encodeURIComponent(searchTerm)}&limit=2`);
              if (partsResponse.ok) {
                const partsData = await partsResponse.json();
                partsData.forEach((part: any) => {
                  searchResults.push({
                    id: `part-${part.id}`,
                    name: part.name || part.title,
                    price: part.price || part.cost || 0,
                    type: 'part' as const,
                    category: part.category || 'Replacement Part',
                    imageUrl: part.imageUrl,
                    url: `/parts/${part.id}`,
                    searchTerm
                  });
                });
              }
              
              // Search for accessories
              const accessoriesResponse = await fetch(`/api/search/accessories?q=${encodeURIComponent(searchTerm)}&limit=2`);
              if (accessoriesResponse.ok) {
                const accessoriesData = await accessoriesResponse.json();
                accessoriesData.forEach((accessory: any) => {
                  searchResults.push({
                    id: `accessory-${accessory.id}`,
                    name: accessory.name || accessory.title,
                    price: accessory.price || 0,
                    type: 'accessory' as const,
                    category: accessory.category || 'Accessory',
                    imageUrl: accessory.imageUrl,
                    url: `/accessories/${accessory.id}`,
                    searchTerm
                  });
                });
              }
            } catch (error) {
              console.error(`Error fetching results for "${searchTerm}":`, error);
            }
          }
          
          // Limit to MAX_SEARCH_ITEMS and set state
          const limitedResults = searchResults.slice(0, MAX_SEARCH_ITEMS);
          console.log('Real search results:', limitedResults);
          setSearchBasedItems(limitedResults);
        }
      } catch (error) {
        console.error('Error loading search-based items:', error);
      }
    };

    loadRecentlyViewed();
    loadSearchBasedItems().then(() => {
      setLoading(false);
    });
  }, []);

  const handleAddToCart = (item: RecentlyViewedItem | SearchBasedItem) => {
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.imageUrl,
      type: item.type
    });
  };

  if (loading) {
    return null;
  }

  // Don't render if no items
  if (recentlyViewed.length === 0 && searchBasedItems.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Recently Viewed Items */}
          {recentlyViewed.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-6">
                <Clock className="h-6 w-6 text-blue-600" />
                <h2 className="text-2xl font-bold">{t('recentlyViewed.title', { defaultValue: 'Recently Viewed' })}</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {recentlyViewed.map((item) => (
                  <Card key={item.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary" className="text-xs">
                          {item.type === 'part' ? t('badges.part', { defaultValue: 'Part' }) : t('badges.accessory', { defaultValue: 'Accessory' })}
                        </Badge>
                        <Eye className="h-4 w-4 text-gray-400" />
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="aspect-square mb-3">
                        <FallbackImage
                          src={item.imageUrl || ''}
                          alt={item.name}
                          className="w-full h-full object-cover rounded-md"
                          fallbackContent={<Package className="h-full w-full text-gray-300" />}
                        />
                      </div>
                      <h3 className="font-medium text-sm mb-2 truncate">{item.name}</h3>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-green-600">
                          {formatCurrency(item.price, 'EUR')}
                        </span>
                        <Button
                          size="sm"
                          onClick={() => handleAddToCart(item)}
                          className="h-8 w-8 p-0"
                        >
                          <ShoppingCart className="h-4 w-4" />
                        </Button>
                      </div>
                      <Link href={item.url} className="block mt-2">
                        <Button variant="outline" size="sm" className="w-full">
                          {t('recentlyViewed.viewDetails', { defaultValue: 'View Details' })}
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Based on Your Search */}
          {searchBasedItems.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-6">
                <Search className="h-6 w-6 text-green-600" />
                <h2 className="text-2xl font-bold">{t('searchBased.title', { defaultValue: 'Based on Your Search' })}</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {searchBasedItems.map((item) => (
                  <Card key={item.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary" className="text-xs">
                          {item.type === 'part' ? t('badges.part', { defaultValue: 'Part' }) : t('badges.accessory', { defaultValue: 'Accessory' })}
                        </Badge>
                        <Search className="h-4 w-4 text-gray-400" />
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="aspect-square mb-3">
                        <FallbackImage
                          src={item.imageUrl || ''}
                          alt={item.name}
                          className="w-full h-full object-cover rounded-md"
                          fallbackContent={<Package className="h-full w-full text-gray-300" />}
                        />
                      </div>
                      <h3 className="font-medium text-sm mb-2 truncate">{item.name}</h3>
                      <p className="text-xs text-gray-500 mb-2">
                        {t('searchBased.basedOn', { defaultValue: 'Based on' })} "{item.searchTerm}"
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-green-600">
                          {formatCurrency(item.price, 'EUR')}
                        </span>
                        <Button
                          size="sm"
                          onClick={() => handleAddToCart(item)}
                          className="h-8 w-8 p-0"
                        >
                          <ShoppingCart className="h-4 w-4" />
                        </Button>
                      </div>
                      <Link href={item.url} className="block mt-2">
                        <Button variant="outline" size="sm" className="w-full">
                          {t('searchBased.viewMore', { defaultValue: 'View More' })}
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
} 