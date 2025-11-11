// Simple Parts List Page for /parts
'use client';

import { useState, useMemo } from 'react';
import { useCart } from '@/components/cart-context';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { FallbackImage } from '@/components/ui/fallback-image';
import { PaginationControls } from '@/components/ui/pagination-controls';
import { usePagination } from '@/hooks/use-pagination';
import { formatCurrency } from '@/lib/utils';
import { Link, useRouter } from '@/i18n/navigation';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Star, Filter, X, Heart, ArrowUpDown, Search, Package } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { Skeleton } from '@/components/ui/skeleton';
import { useSearchParams } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';

// Helper function to create slug from name and ID
function createSlug(name: string, id: string): string {
  const nameSlug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return `${nameSlug}-${id}`;
}

interface PartsPageProps {
  initialType?: string;
  initialBrand?: string;
  initialModel?: string;
}

export default function PartsPage({ initialType, initialBrand, initialModel }: PartsPageProps = {}) {
  const t = useTranslations('parts');
  const { addToCart } = useCart();
  const user = useSession().data;
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const router = useRouter();
  const type = initialType || searchParams.get('type');
  const brand = initialBrand || searchParams.get('brand');
  const model = initialModel || searchParams.get('model');
  
  const [selectedType, setSelectedType] = useState(type || '');
  const [selectedBrand, setSelectedBrand] = useState(brand || '');
  const [selectedModel, setSelectedModel] = useState(model || '');
  const [sortBy, setSortBy] = useState('name-asc');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Fetch wishlist items
  const { data: wishlistData, isLoading: wishlistLoading } = useQuery({
    queryKey: ['wishlist'],
    queryFn: async () => {
      if (!user?.user?.id) return [];
      try {
        const res = await fetch('/api/wishlist');
        if (res.ok) {
          const data = await res.json();
          // Ensure we return an array
          if (Array.isArray(data)) {
            return data;
          } else if (data && Array.isArray(data.items)) {
            return data.items;
          } else if (data && Array.isArray(data.data)) {
            return data.data;
          }
          return [];
        }
        return [];
      } catch (error) {
        console.error('Error fetching wishlist:', error);
        return [];
      }
    },
    enabled: !!user?.user?.id,
  });

  // Ensure wishlistItems is always an array
  const wishlistItems = Array.isArray(wishlistData) ? wishlistData : [];

  // Toggle wishlist mutation
  const toggleWishlistMutation = useMutation({
    mutationFn: async (partId: string) => {
      const res = await fetch('/api/wishlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ partId }),
      });
      if (!res.ok) throw new Error('Failed to toggle wishlist');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
    },
  });

  const isInWishlist = (partId: string) => {
    if (!Array.isArray(wishlistItems)) return false;
    return wishlistItems.some((item: any) => item.partId === partId);
  };

  const handleToggleWishlist = (e: React.MouseEvent, partId: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user?.user?.id) {
      router.push('/auth/signin');
      return;
    }
    toggleWishlistMutation.mutate(partId);
  };

  // Fetch parts
  const {
    data: parts = [],
    isLoading: partsLoading,
  } = useQuery({
    queryKey: ['parts', type, brand, model],
    queryFn: async () => {
      // If no filters are provided, fetch all parts directly
      if (!type && !brand && !model) {
        const res = await fetch('/api/parts');
        if (res.ok) {
          let data = await res.json();
          if (data && Array.isArray(data.data)) {
            return data.data;
          } else if (!Array.isArray(data)) {
            return [];
          }
          return data;
        }
        return [];
      }
      
      // If filters are provided, use the filter API
      const params = [];
      if (type) params.push(`type=${encodeURIComponent(type)}`);
      if (brand) params.push(`brand=${encodeURIComponent(brand)}`);
      if (model) params.push(`model=${encodeURIComponent(model)}`);
      const query = params.length ? `?${params.join('&')}` : '';
      const res = await fetch(`/api/parts/filter${query}`);
      if (res.ok) {
        let data = await res.json();
        if (data && Array.isArray(data.data)) {
          return data.data;
        } else if (!Array.isArray(data)) {
          return [];
        }
        return data;
      } else {
        // fallback: fetch all parts and filter client-side
        const fallbackRes = await fetch('/api/parts');
        let data = await fallbackRes.json();
        if (data && Array.isArray(data.data)) {
          return data.data;
        } else if (!Array.isArray(data)) {
          return [];
        }
        return data;
      }
    },
  });

  // Fetch featured parts
  const {
    data: featuredParts = [],
    isLoading: featuredLoading,
  } = useQuery({
    queryKey: ['featuredParts', type, brand, model],
    queryFn: async () => {
      const params = [];
      if (type) params.push(`type=${encodeURIComponent(type)}`);
      if (brand) params.push(`brand=${encodeURIComponent(brand)}`);
      if (model) params.push(`model=${encodeURIComponent(model)}`);
      const query = params.length ? `?${params.join('&')}` : '';
      const featuredQuery = query ? `${query}&limit=4` : '?limit=4';
      const featuredRes = await fetch(`/api/parts/featured${featuredQuery}`);
      if (featuredRes.ok) {
        return await featuredRes.json();
      } else {
        return [];
      }
    },
  });

  // Extract unique brands and models from parts data
  // Since parts don't have a brand field, we'll extract brands from deviceModel
  const availableBrands = useMemo(() => {
    if (!selectedType) return [];
    const brands = new Set<string>();
    parts.forEach((part: any) => {
      if (part.deviceModel && (!selectedType || part.deviceType === selectedType)) {
        // Extract brand from deviceModel (e.g., "iPhone 14" -> "iPhone", "Samsung Galaxy S23" -> "Samsung")
        const model = part.deviceModel.trim();
        const firstWord = model.split(' ')[0];
        if (firstWord) {
          brands.add(firstWord);
        }
      }
    });
    return Array.from(brands).sort();
  }, [parts, selectedType]);

  const availableModels = useMemo(() => {
    if (!selectedBrand) return [];
    const models = new Set<string>();
    parts.forEach((part: any) => {
      if (part.deviceModel && 
          (!selectedType || part.deviceType === selectedType)) {
        // Check if the model starts with the selected brand
        if (part.deviceModel.toLowerCase().startsWith(selectedBrand.toLowerCase())) {
          models.add(part.deviceModel);
        }
      }
    });
    return Array.from(models).sort();
  }, [parts, selectedType, selectedBrand]);

  // Use backend-filtered parts directly
  const filteredAndSortedParts = useMemo(() => {
    let result = [...parts];
    
    // Apply search filter
    if (searchQuery) {
      result = result.filter(part => 
        part.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        part.sku?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        part.deviceModel?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply sorting
    switch (sortBy) {
      case 'name-asc':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'price-asc':
        result.sort((a, b) => a.cost - b.cost);
        break;
      case 'price-desc':
        result.sort((a, b) => b.cost - a.cost);
        break;
      case 'stock':
        result.sort((a, b) => b.inStock - a.inStock);
        break;
      default:
        break;
    }
    
    return result;
  }, [parts, searchQuery, sortBy]);

  const pagination = usePagination({
    totalItems: filteredAndSortedParts.length,
    itemsPerPage: 12,
  });
  const paginatedParts = filteredAndSortedParts.slice(pagination.startIndex, pagination.endIndex + 1);

  if (partsLoading || featuredLoading) return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="p-2">
            <Skeleton className="w-full aspect-square mb-3" />
            <Skeleton className="w-2/3 h-5 mb-2" />
            <Skeleton className="w-1/2 h-4" />
            <Skeleton className="w-full h-8 mt-2" />
          </div>
        ))}
      </div>
    </div>
  );
  if (!parts.length) {
    // Import the not-found component dynamically to avoid SSR issues
    const PartsNotFound = require('./not-found').default;
    return <PartsNotFound />;
  }

  return (
    <div className="min-h-screen !bg-white">
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold !text-gray-900 mb-3">
            {t('pageTitle', { defaultValue: 'Shop Parts & Accessories' })}
          </h1>
          <p className="text-lg !text-gray-600 max-w-2xl mx-auto">
            {t('pageDescription', { defaultValue: 'Find high-quality replacement parts for all your devices' })}
          </p>
        </div>

        {/* Filter Section */}
        <div className="mb-8 !bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center gap-2 flex-1">
              <Filter className="h-6 w-6 text-green-600" />
              <h2 className="text-xl font-semibold !text-gray-900">
                {t('filterParts', { defaultValue: 'Filter Parts' })}
              </h2>
            </div>
            {(selectedType || selectedBrand || selectedModel || searchQuery) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSelectedType('');
                  setSelectedBrand('');
                  setSelectedModel('');
                  setSearchQuery('');
                  router.push('/parts');
                }}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <X className="h-4 w-4 mr-1" />
                {t('clearFilters', { defaultValue: 'Clear Filters' })}
              </Button>
            )}
          </div>

          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder={t('searchPlaceholder', { defaultValue: 'Search by name, SKU, or model...' })}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 text-base bg-white text-gray-900 border-gray-300 focus:ring-2 focus:ring-green-500 placeholder:text-gray-500"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Device Type Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium !text-gray-700">
                {t('deviceType', { defaultValue: 'Device Type' })}
              </label>
              <Select
                value={selectedType || 'all'}
                onValueChange={(value) => {
                  const newType = value === 'all' ? '' : value;
                  setSelectedType(newType);
                  setSelectedBrand('');
                  setSelectedModel('');
                  const params = new URLSearchParams();
                  if (newType) params.set('type', newType);
                  router.push(`/parts${params.toString() ? '?' + params.toString() : ''}`);
                }}
              >
                <SelectTrigger className="h-12 text-base bg-white text-gray-900 border-gray-300">
                  <SelectValue placeholder={t('allDeviceTypes', { defaultValue: 'All Device Types' })} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('allDeviceTypes', { defaultValue: 'All Device Types' })}</SelectItem>
                  <SelectItem value="SMARTPHONE">📱 {t('smartphones', { defaultValue: 'Smartphones' })}</SelectItem>
                  <SelectItem value="TABLET">📲 {t('tablets', { defaultValue: 'Tablets' })}</SelectItem>
                  <SelectItem value="LAPTOP">💻 {t('laptops', { defaultValue: 'Laptops' })}</SelectItem>
                  <SelectItem value="SMARTWATCH">⌚ {t('smartwatches', { defaultValue: 'Smartwatches' })}</SelectItem>
                  <SelectItem value="DESKTOP">🖥️ {t('desktops', { defaultValue: 'Desktops' })}</SelectItem>
                  <SelectItem value="GAMING_CONSOLE">🎮 {t('gamingConsoles', { defaultValue: 'Gaming Consoles' })}</SelectItem>
                  <SelectItem value="OTHER">📦 {t('otherDevices', { defaultValue: 'Other Devices' })}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Brand Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium !text-gray-700">
                {t('brand', { defaultValue: 'Brand' })}
              </label>
              <Select
                value={selectedBrand || 'all'}
                onValueChange={(value) => {
                  const newBrand = value === 'all' ? '' : value;
                  setSelectedBrand(newBrand);
                  setSelectedModel('');
                  const params = new URLSearchParams();
                  if (selectedType) params.set('type', selectedType);
                  if (newBrand) params.set('brand', newBrand);
                  router.push(`/parts${params.toString() ? '?' + params.toString() : ''}`);
                }}
                disabled={!selectedType}
              >
                <SelectTrigger className="h-12 text-base bg-white text-gray-900 border-gray-300">
                  <SelectValue placeholder={selectedType && selectedType !== 'all' ? t('selectBrand', { defaultValue: 'Select Brand' }) : t('selectTypeFirst', { defaultValue: 'Select Type First' })} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('allBrands', { defaultValue: 'All Brands' })}</SelectItem>
                  {availableBrands.length > 0 ? (
                    availableBrands.map((brand) => (
                      <SelectItem key={brand} value={brand}>
                        {brand}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="none" disabled>
                      {t('noBrandsAvailable', { defaultValue: 'No brands available' })}
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* Model Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium !text-gray-700">
                {t('model', { defaultValue: 'Model' })}
              </label>
              <Select
                value={selectedModel || 'all'}
                onValueChange={(value) => {
                  const newModel = value === 'all' ? '' : value;
                  setSelectedModel(newModel);
                  const params = new URLSearchParams();
                  if (selectedType) params.set('type', selectedType);
                  if (selectedBrand) params.set('brand', selectedBrand);
                  if (newModel) params.set('model', newModel);
                  router.push(`/parts${params.toString() ? '?' + params.toString() : ''}`);
                }}
                disabled={!selectedBrand}
              >
                <SelectTrigger className="h-12 text-base bg-white text-gray-900 border-gray-300">
                  <SelectValue placeholder={selectedBrand && selectedBrand !== 'all' ? t('selectModel', { defaultValue: 'Select Model' }) : t('selectBrandFirst', { defaultValue: 'Select Brand First' })} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('allModels', { defaultValue: 'All Models' })}</SelectItem>
                  {availableModels.length > 0 ? (
                    availableModels.map((model) => (
                      <SelectItem key={model} value={model}>
                        {model}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="none" disabled>
                      {t('noModelsAvailable', { defaultValue: 'No models available' })}
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* Sort By */}
            <div className="space-y-2">
              <label className="text-sm font-medium !text-gray-700">
                {t('sortBy', { defaultValue: 'Sort By' })}
              </label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="h-12 text-base bg-white text-gray-900 border-gray-300">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name-asc">🔤 {t('nameAZ', { defaultValue: 'Name (A-Z)' })}</SelectItem>
                  <SelectItem value="name-desc">🔤 {t('nameZA', { defaultValue: 'Name (Z-A)' })}</SelectItem>
                  <SelectItem value="price-asc">💰 {t('priceLowHigh', { defaultValue: 'Price (Low-High)' })}</SelectItem>
                  <SelectItem value="price-desc">💰 {t('priceHighLow', { defaultValue: 'Price (High-Low)' })}</SelectItem>
                  <SelectItem value="stock">📦 {t('availability', { defaultValue: 'Availability' })}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* Active Filters Display */}
          {(selectedType || selectedBrand || selectedModel || searchQuery) && (
            <div className="mt-6 flex flex-wrap gap-2 pt-4 border-t border-gray-200">
              <span className="text-sm font-medium !text-gray-600">
                {t('activeFilters', { defaultValue: 'Active Filters:' })}
              </span>
              {searchQuery && (
                <Badge variant="secondary" className="text-sm bg-green-100 text-green-800">
                  🔍 Search: "{searchQuery}"
                </Badge>
              )}
              {selectedType && (
                <Badge variant="secondary" className="text-sm bg-green-100 text-green-800">
                  📱 Type: {selectedType}
                </Badge>
              )}
              {selectedBrand && (
                <Badge variant="secondary" className="text-sm bg-green-100 text-green-800">
                  🏷️ Brand: {selectedBrand}
                </Badge>
              )}
              {selectedModel && (
                <Badge variant="secondary" className="text-sm bg-green-100 text-green-800">
                  📋 Model: {selectedModel}
                </Badge>
              )}
            </div>
          )}

          {/* Results Count */}
          <div className="mt-4 text-center">
            <p className="text-sm !text-gray-600">
              {t('showingResults', { 
                defaultValue: `Showing ${filteredAndSortedParts.length} of ${parts.length} parts`,
                count: filteredAndSortedParts.length,
                total: parts.length
              })}
            </p>
          </div>
        </div>
      
      
      {/* Featured Parts Section */}
      {featuredParts.length > 0 && (
        <div className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold !text-gray-900 mb-3">
              ⭐ {t('featuredParts.title', { defaultValue: 'Featured Parts' })}
            </h2>
            <p className="!text-gray-600 text-lg">
              {t('featuredParts.description', { defaultValue: 'Our most popular and high-quality parts' })}
            </p>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 items-stretch">
            {featuredParts.map((part:any) => {
              const partSlug = createSlug(part.name, part.id);
              const inWishlist = isInWishlist(part.id);
              return (
              <Card key={part.id} className="relative overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer group h-full flex flex-col border-2 hover:border-green-400 !bg-white !text-gray-900">
                {/* Wishlist Button - Top Right */}
                <button
                  onClick={(e) => handleToggleWishlist(e, part.id)}
                  className="absolute top-3 right-3 z-20 bg-white/95 backdrop-blur-sm rounded-full p-2.5 shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-200"
                  aria-label={inWishlist ? t('removeFromWishlist') : t('addToWishlist')}
                >
                  <Heart
                    className={`h-5 w-5 transition-all duration-200 ${
                      inWishlist ? 'fill-red-500 text-red-500 scale-110' : 'text-gray-600 hover:text-red-500'
                    }`}
                  />
                </button>

                {/* Image and Content - Clickable to product page */}
                <Link href={`/parts/${partSlug}`} className="block">
                  {/* Image Section */}
                  <div className="relative h-48 flex items-center justify-center p-4 product-image-container">
                    {part.imageUrl ? (
                      <FallbackImage
                        src={part.imageUrl}
                        alt={part.name}
                        width={200}
                        height={200}
                        className="object-contain w-full h-full group-hover:scale-110 transition-transform duration-300 remove-white-bg"
                        fallbackContent={
                          <div className="w-full h-full flex items-center justify-center">
                            <Package className="h-16 w-16 text-gray-400" />
                          </div>
                        }
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="h-16 w-16 text-gray-400" />
                      </div>
                    )}

                    {/* Quality Badge */}
                    {part.quality && (
                      <div className="absolute top-3 left-3 z-10">
                        <Badge 
                          variant="secondary" 
                          className="text-xs font-bold bg-gradient-to-r from-green-500 to-green-600 text-white border-0 shadow-lg px-3 py-1"
                        >
                          ✓ {part.quality}
                        </Badge>
                      </div>
                    )}

                    {/* Stock Status Badge */}
                    {part.inStock <= 0 && (
                      <div className="absolute bottom-3 right-3 z-10">
                        <Badge 
                          variant="secondary"
                          className="text-xs font-bold bg-red-500 text-white border-0 shadow-lg animate-pulse"
                        >
                          ❌ Out of Stock
                        </Badge>
                      </div>
                    )}
                    {part.inStock > 0 && part.inStock <= 5 && (
                      <div className="absolute bottom-3 right-3 z-10">
                        <Badge 
                          variant="secondary"
                          className="text-xs font-bold bg-orange-500 text-white border-0 shadow-lg"
                        >
                          ⚠️ Low Stock
                        </Badge>
                      </div>
                    )}
                  </div>

                  {/* Content Section */}
                  <div className="p-4 space-y-3 flex-1 flex flex-col !bg-white">
                    <div className="flex-1 flex flex-col">
                      {/* Name */}
                      <h3 className="font-semibold !text-gray-900 line-clamp-2 leading-tight mb-2 group-hover:text-green-600 transition-colors">
                        {part.name}
                      </h3>
                      
                      {/* Device Info */}
                      {part.deviceModel && (
                        <p className="text-xs text-gray-500 mb-2">
                          📱 {part.deviceModel}
                        </p>
                      )}
                      
                      {/* Price */}
                      <div className="flex items-center justify-between mt-auto">
                        <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">
                          {formatCurrency(part.cost, 'EUR')}
                        </span>
                        {part.inStock > 5 && (
                          <Badge variant="outline" className="text-xs text-green-600 border-green-600">
                            ✓ In Stock
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
                    
                {/* Action Buttons - Outside Link to prevent nesting */}
                <div className="p-4 pt-0 flex space-x-2 !bg-white">
                  <Button 
                    asChild 
                    size="sm" 
                    className="flex-1 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-900" 
                    variant="outline"
                    onClick={(e: React.MouseEvent) => e.stopPropagation()}
                  >
                    <Link href={`/quote?deviceType=${encodeURIComponent(part.deviceType ?? part.device_type ?? '')}&brand=${encodeURIComponent(part.brand ?? '')}&model=${encodeURIComponent(part.deviceModel ?? '')}&part=${encodeURIComponent(part.name)}&quality=${encodeURIComponent(part.quality ?? '')}&sku=${encodeURIComponent(part.sku ?? '')}&supplier=${encodeURIComponent(part.supplier ?? '')}`}>
                      💬 Quote
                    </Link>
                  </Button>
                  <Button
                    size="sm"
                    variant="default"
                    disabled={part.inStock <= 0}
                    className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 disabled:from-gray-400 disabled:to-gray-500"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      addToCart({
                        id: part.id,
                        name: part.name,
                        price: part.cost,
                        image: part.imageUrl,
                        type:"part"
                      });
                    }}
                  >
                    <ShoppingCart className="h-4 w-4" />
                    <span className="sr-only">
                      {part.inStock > 0 ? 'Add to Cart' : 'Out of Stock'}
                    </span>
                  </Button>
                </div>
              </Card>
            );
            })}
          </div>
        </div>
      )}
      
      {/* All Parts Grid */}
      <div className="mb-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold !text-gray-900 mb-2">
            📦 {t('allPartsList', { defaultValue: 'All Parts' })}
          </h2>
          <p className="!text-gray-600">
            {t('browseAllParts', { defaultValue: 'Browse our complete catalog of high-quality parts' })}
          </p>
        </div>
         <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 items-stretch">
          {paginatedParts.map((part:any) => {
            const partSlug = createSlug(part.name, part.id);
            const inWishlist = isInWishlist(part.id);
            return (
            <Card key={part.id} className="relative overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer group h-full flex flex-col border-2 hover:border-green-400 !bg-white !text-gray-900">
              {/* Wishlist Button - Top Right */}
              <button
                onClick={(e) => handleToggleWishlist(e, part.id)}
                className="absolute top-3 right-3 z-20 bg-white/95 backdrop-blur-sm rounded-full p-2.5 shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-200"
                aria-label={inWishlist ? t('removeFromWishlist') : t('addToWishlist')}
              >
                <Heart
                  className={`h-5 w-5 transition-all duration-200 ${
                    inWishlist ? 'fill-red-500 text-red-500 scale-110' : 'text-gray-600 hover:text-red-500'
                  }`}
                />
              </button>

              {/* Image and Content - Clickable to product page */}
              <Link href={`/parts/${partSlug}`} className="block">
                {/* Image Section */}
                <div className="relative h-48 flex items-center justify-center p-4 product-image-container">
                  {part.imageUrl ? (
                    <FallbackImage
                      src={part.imageUrl}
                      alt={part.name}
                      width={200}
                      height={200}
                      className="object-contain w-full h-full group-hover:scale-110 transition-transform duration-300 remove-white-bg"
                      fallbackContent={
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="h-16 w-16 text-gray-400" />
                        </div>
                      }
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="h-16 w-16 text-gray-400" />
                    </div>
                  )}

                  {/* Quality Badge */}
                  {part.quality && (
                    <div className="absolute top-3 left-3 z-10">
                      <Badge 
                        variant="secondary" 
                        className="text-xs font-bold bg-gradient-to-r from-green-500 to-green-600 text-white border-0 shadow-lg px-3 py-1"
                      >
                        ✓ {part.quality}
                      </Badge>
                    </div>
                  )}

                  {/* Stock Status Badge */}
                  {part.inStock <= 0 && (
                    <div className="absolute bottom-3 right-3 z-10">
                      <Badge 
                        variant="secondary"
                        className="text-xs font-bold bg-red-500 text-white border-0 shadow-lg animate-pulse"
                      >
                        ❌ Out of Stock
                      </Badge>
                    </div>
                  )}
                  {part.inStock > 0 && part.inStock <= 5 && (
                    <div className="absolute bottom-3 right-3 z-10">
                      <Badge 
                        variant="secondary"
                        className="text-xs font-bold bg-orange-500 text-white border-0 shadow-lg"
                      >
                        ⚠️ Low Stock
                      </Badge>
                    </div>
                  )}
                </div>

                {/* Content Section */}
                <div className="p-4 space-y-3 flex-1 flex flex-col !bg-white">
                  <div className="flex-1 flex flex-col">
                    {/* Name */}
                    <h3 className="font-semibold !text-gray-900 line-clamp-2 leading-tight mb-2 group-hover:text-green-600 transition-colors">
                      {part.name}
                    </h3>
                    
                    {/* Device Info */}
                    {part.deviceModel && (
                      <p className="text-xs text-gray-500 mb-2">
                        📱 {part.deviceModel}
                      </p>
                    )}
                    
                    {/* Price */}
                    <div className="flex items-center justify-between mt-auto">
                      <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">
                        {formatCurrency(part.cost, 'EUR')}
                      </span>
                      {part.inStock > 5 && (
                        <Badge variant="outline" className="text-xs text-green-600 border-green-600">
                          ✓ In Stock
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
                  
              {/* Action Buttons - Outside Link to prevent nesting */}
              <div className="p-4 pt-0 flex space-x-2 !bg-white">
                <Button 
                  asChild 
                  size="sm" 
                  className="flex-1 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-900" 
                  variant="outline"
                  onClick={(e: React.MouseEvent) => e.stopPropagation()}
                >
                  <Link href={`/quote?deviceType=${encodeURIComponent(part.deviceType ?? part.device_type ?? '')}&brand=${encodeURIComponent(part.brand ?? '')}&model=${encodeURIComponent(part.deviceModel ?? '')}&part=${encodeURIComponent(part.name)}&quality=${encodeURIComponent(part.quality ?? '')}&sku=${encodeURIComponent(part.sku ?? '')}&supplier=${encodeURIComponent(part.supplier ?? '')}`}>
                    💬 Quote
                  </Link>
                </Button>
                <Button
                  size="sm"
                  variant="default"
                  disabled={part.inStock <= 0}
                  className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 disabled:from-gray-400 disabled:to-gray-500"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    addToCart({
                      id: part.id,
                      name: part.name,
                      price: part.cost,
                      image: part.imageUrl,
                      type:"part"
                    });
                  }}
                >
                  <ShoppingCart className="h-4 w-4" />
                  <span className="sr-only">
                    {part.inStock > 0 ? 'Add to Cart' : 'Out of Stock'}
                  </span>
                </Button>
              </div>
            </Card>
          );
          })}
        </div>
      </div>

      {/* Improved Pagination Controls */}
      {filteredAndSortedParts.length > 12 && (
        <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
          <PaginationControls 
            pagination={pagination}
            className="justify-center"
          />
        </div>
      )}

      {/* CTA Section */}
      <div className="mt-12 bg-gradient-to-r from-green-600 to-green-700 rounded-2xl shadow-2xl p-8 text-center text-white">
        <h2 className="text-3xl font-bold mb-4">
          {t('cta.title', { defaultValue: "Can't Find What You're Looking For?" })}
        </h2>
        <p className="text-lg mb-6 opacity-90">
          {t('cta.description', { defaultValue: 'Our team can help you find the perfect part for your device' })}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" className="bg-white text-green-600 hover:bg-gray-100">
            <Link href="/contact">
              📞 {t('cta.contact', { defaultValue: 'Contact Us' })}
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white/10">
            <Link href="/quote">
              💬 {t('cta.quote', { defaultValue: 'Request a Quote' })}
            </Link>
          </Button>
        </div>
      </div>
    </div>
    </div>
  );
}
                    