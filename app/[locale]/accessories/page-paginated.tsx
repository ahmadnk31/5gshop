"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PaginationControls } from "@/components/ui/pagination-controls";
import { usePagination } from "@/hooks/use-pagination";
import { 
  Headphones, 
  Shield,
  ShoppingCart,
  Truck,
  RotateCcw,
  Search,
  Package,
  Cable,
  Monitor,
  Edit,
  Box,
  Zap,
  X,
  Grid,
  List
} from "lucide-react";
import Link from "next/link";
import { getAccessoriesWithFiltersPaginated } from "@/app/actions/pagination-actions";
import { Accessory, AccessoryCategory } from "@/lib/types";
import { useTranslations } from "next-intl";
import { formatCurrency } from "@/lib/utils";
// Category configurations matching the database schema
const getCategoryConfigs = (t: any) => ({
  CASE: { icon: Shield, label: t('accessories.categories.labels.CASE') },
  CHARGER: { icon: Zap, label: t('accessories.categories.labels.CHARGER') },
  CABLE: { icon: Cable, label: t('accessories.categories.labels.CABLE') },
  HEADPHONES: { icon: Headphones, label: t('accessories.categories.labels.HEADPHONES') },
  SCREEN_PROTECTOR: { icon: Shield, label: t('accessories.categories.labels.SCREEN_PROTECTOR') },
  KEYBOARD: { icon: Monitor, label: t('accessories.categories.labels.KEYBOARD') },
  MOUSE: { icon: Monitor, label: t('accessories.categories.labels.MOUSE') },
  STYLUS: { icon: Edit, label: t('accessories.categories.labels.STYLUS') },
  STAND: { icon: Monitor, label: t('accessories.categories.labels.STAND') },
  MOUNT: { icon: Monitor, label: t('accessories.categories.labels.MOUNT') },
  OTHER: { icon: Box, label: t('accessories.categories.labels.OTHER') },
});

const getCategoryDescriptions = (t: any) => ({
  CASE: t('accessories.categories.descriptions.CASE'),
  CHARGER: t('accessories.categories.descriptions.CHARGER'),
  CABLE: t('accessories.categories.descriptions.CABLE'),
  HEADPHONES: t('accessories.categories.descriptions.HEADPHONES'),
  SCREEN_PROTECTOR: t('accessories.categories.descriptions.SCREEN_PROTECTOR'),
  KEYBOARD: t('accessories.categories.descriptions.KEYBOARD'),
  MOUSE: t('accessories.categories.descriptions.MOUSE'),
  STYLUS: t('accessories.categories.descriptions.STYLUS'),
  STAND: t('accessories.categories.descriptions.STAND'),
  MOUNT: t('accessories.categories.descriptions.MOUNT'),
  OTHER: t('accessories.categories.descriptions.OTHER'),
});
// Category configurations matching the database schema
const categoryConfigs = {
  CASE: { icon: Shield, label: "Cases & Covers" },
  CHARGER: { icon: Zap, label: "Chargers & Power" },
  CABLE: { icon: Cable, label: "Cables & Adapters" },
  HEADPHONES: { icon: Headphones, label: "Audio & Headphones" },
  SCREEN_PROTECTOR: { icon: Shield, label: "Screen Protection" },
  KEYBOARD: { icon: Monitor, label: "Keyboards" },
  MOUSE: { icon: Monitor, label: "Mice & Trackpads" },
  STYLUS: { icon: Edit, label: "Stylus & Pens" },
  STAND: { icon: Monitor, label: "Stands & Holders" },
  MOUNT: { icon: Monitor, label: "Mounts & Brackets" },
  OTHER: { icon: Box, label: "Other Accessories" },
};

const ITEMS_PER_PAGE_OPTIONS = [12, 24, 48];

export default function AccessoriesPagePaginated() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations();
  
  // State
  const [accessories, setAccessories] = useState<Accessory[]>([]);
  const [allAccessories, setAllAccessories] = useState<Accessory[]>([]);
  const [categoryCounts, setCategoryCounts] = useState<Record<AccessoryCategory, number>>({} as Record<AccessoryCategory, number>);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [searchInput, setSearchInput] = useState(searchParams.get('search') || ''); // Separate input state
  const [searchSuggestions, setSearchSuggestions] = useState<Accessory[]>([]);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  const [selectedCategory, setSelectedCategory] = useState<AccessoryCategory | null>(
    (searchParams.get('category') as AccessoryCategory) || null
  );
  const [itemsPerPage, setItemsPerPage] = useState(
    parseInt(searchParams.get('limit') || '12')
  );
  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || 'name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>(
    (searchParams.get('sortOrder') as 'asc' | 'desc') || 'asc'
  );
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Pagination state
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(
    parseInt(searchParams.get('page') || '1')
  );

  const pagination = usePagination({
    totalItems,
    itemsPerPage,
    initialPage: currentPage,
  });

  // Load accessories with pagination
  const loadAccessories = async (page = 1) => {
    try {
      setLoading(true);
      const result = await getAccessoriesWithFiltersPaginated({
        page,
        limit: itemsPerPage,
        sortBy,
        sortOrder,
        // If searching, don't apply category filter
        category: searchTerm ? undefined : (selectedCategory || undefined),
        search: searchTerm || undefined,
        inStockOnly: true,
      });

      setAccessories(result.data);
      setTotalItems(result.pagination.totalItems);
      setCurrentPage(result.pagination.currentPage);
    } catch (error) {
      console.error('Failed to load accessories:', error);
    } finally {
      setLoading(false);
    }
  };

  // Debounced search effect
  useEffect(() => {
    if (searchInput !== searchTerm) {
      setSearchLoading(true);
    }
    
    const timeoutId = setTimeout(async () => {
      setSearchTerm(searchInput);
      setSearchLoading(false);
      
      // Generate search suggestions if there's a search input
      if (searchInput.trim() && searchInput.length >= 2) {
        try {
          const suggestions = await getAccessoriesWithFiltersPaginated({
            page: 1,
            limit: 5, // Limit suggestions
            search: searchInput,
            inStockOnly: true,
          });
          setSearchSuggestions(suggestions.data);
          setShowSearchDropdown(true);
        } catch (error) {
          console.error('Failed to load search suggestions:', error);
          setSearchSuggestions([]);
        }
      } else {
        setSearchSuggestions([]);
        setShowSearchDropdown(false);
      }
    }, 300); // Faster response for suggestions

    return () => {
      clearTimeout(timeoutId);
      setSearchLoading(false);
    };
  }, [searchInput, searchTerm]);

  // Load accessories when dependencies change
  useEffect(() => {
    loadAccessories(currentPage);
  }, [currentPage, itemsPerPage, sortBy, sortOrder, selectedCategory, searchTerm]);

  // Update URL only when necessary and with minimal impact
  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedCategory) params.set('category', selectedCategory);
    if (searchTerm) params.set('search', searchTerm);
    if (currentPage > 1) params.set('page', currentPage.toString());
    if (itemsPerPage !== 12) params.set('limit', itemsPerPage.toString());
    if (sortBy !== 'name') params.set('sortBy', sortBy);
    if (sortOrder !== 'asc') params.set('sortOrder', sortOrder);
    
    const newURL = params.toString() ? `/accessories?${params.toString()}` : '/accessories';
    
    // Only update URL if it's actually different from current URL
    if (window.location.pathname + (window.location.search || '') !== newURL) {
      router.replace(newURL, { scroll: false });
    }
  }, [selectedCategory, searchTerm, currentPage, itemsPerPage, sortBy, sortOrder, router]);

  // Handle pagination
  useEffect(() => {
    setCurrentPage(pagination.currentPage);
  }, [pagination.currentPage]);

  // Handle filters
  const handleCategorySelect = (category: AccessoryCategory | null) => {
    setSelectedCategory(category);
    setCurrentPage(1);
    pagination.goToFirstPage();
    
    // Scroll to results section after filter is applied
    if (category) {
      setTimeout(() => {
        const resultsSection = document.getElementById('results-section');
        if (resultsSection) {
          resultsSection.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
          });
        }
      }, 100); // Small delay to ensure state updates
    }
  };

  const handleSearch = (search: string) => {
    setSearchInput(search); // Update input immediately for responsive UI
    setSelectedSuggestionIndex(-1); // Reset selection when typing
    // Only reset page if search actually changes (not just input)
    if (search !== searchTerm) {
      setCurrentPage(1);
      pagination.goToFirstPage();
      // Clear category filter when searching
      if (search.trim() && selectedCategory) {
        setSelectedCategory(null);
      }
    }
  };

  const handleSearchSuggestionClick = (accessory: Accessory) => {
    setSearchInput(accessory.name);
    setSearchTerm(accessory.name);
    setShowSearchDropdown(false);
    setCurrentPage(1);
    pagination.goToFirstPage();
    if (selectedCategory) {
      setSelectedCategory(null);
    }
    // Redirect to accessory detail page after a short delay to allow state/blur to finish
    if (accessory.id) {
      setTimeout(() => {
        router.push(`/accessories/${accessory.id}`);
      }, 30);
    }
  };

  const handleSearchInputFocus = () => {
    if (searchSuggestions.length > 0 && searchInput.trim().length >= 2) {
      setShowSearchDropdown(true);
    }
  };

  const handleSearchInputBlur = () => {
    // Delay hiding dropdown to allow clicking on suggestions
    setTimeout(() => setShowSearchDropdown(false), 200);
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (!showSearchDropdown || searchSuggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedSuggestionIndex(prev => 
          prev < searchSuggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedSuggestionIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedSuggestionIndex >= 0) {
          handleSearchSuggestionClick(searchSuggestions[selectedSuggestionIndex]);
        } else {
          // Just search with current input
          setSearchTerm(searchInput);
          setShowSearchDropdown(false);
          if (selectedCategory) {
            setSelectedCategory(null);
          }
        }
        break;
      case 'Escape':
        setShowSearchDropdown(false);
        setSelectedSuggestionIndex(-1);
        break;
    }
  };

  const handleItemsPerPageChange = (newLimit: string) => {
    setItemsPerPage(parseInt(newLimit));
    setCurrentPage(1);
    pagination.goToFirstPage();
  };

  const handleSortChange = (newSortBy: string) => {
    setSortBy(newSortBy);
    setCurrentPage(1);
    pagination.goToFirstPage();
  };

  const handleSortOrderChange = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    setCurrentPage(1);
    pagination.goToFirstPage();
  };

  const clearFilters = () => {
    setSelectedCategory(null);
    setSearchTerm('');
    setSearchInput(''); // Clear both search states
    setCurrentPage(1);
    pagination.goToFirstPage();
  };

  // Load all accessories for category counts (only on initial load)
  useEffect(() => {
    const loadAllAccessories = async () => {
      try {
        console.log('Loading all accessories for category counts...');
        const result = await getAccessoriesWithFiltersPaginated({
          page: 1,
          limit: 1000, // Large number to get all accessories
          inStockOnly: true,
        });
        console.log('All accessories loaded:', result.data.length);
        setAllAccessories(result.data);
        
        // Calculate category counts
        const counts = result.data.reduce((acc, accessory) => {
          if (accessory.inStock > 0 && categoryConfigs[accessory.category]) {
            acc[accessory.category] = (acc[accessory.category] || 0) + 1;
          }
          return acc;
        }, {} as Record<AccessoryCategory, number>);
        
        console.log('Category counts calculated:', counts);
        setCategoryCounts(counts);
      } catch (error) {
        console.error('Failed to load category counts:', error);
      }
    };

    loadAllAccessories();
  }, []);

  const categories = Object.entries(categoryConfigs).map(([key, config]) => ({
    key: key as AccessoryCategory,
    icon: config.icon,
    name: config.label,
    description: `High-quality ${config.label.toLowerCase()}`,
    count: categoryCounts[key as AccessoryCategory] || 0,
  }));

  const hasActiveFilters = selectedCategory || searchTerm;

  if (loading && accessories.length === 0) {
    return (
      <div className="flex flex-col min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">{t('accessories.loading.message')}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            {t('accessories.title')}
          </h1>
          <p className="text-xl mb-8 opacity-90">
            {t('accessories.subtitle')}
          </p>
          <div className="flex justify-center space-x-4 text-sm">
            <div className="flex items-center space-x-2">
              <Truck className="h-5 w-5" />
              <span>{t('accessories.features.freeShipping')}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5" />
              <span>{t('accessories.features.qualityGuarantee')}</span>
            </div>
            <div className="flex items-center space-x-2">
              <RotateCcw className="h-5 w-5" />
              <span>{t('accessories.features.easyReturns')}</span>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between mb-6">
            {/* Search */}
            <form 
              className="relative flex-1 max-w-md"
              onSubmit={(e) => e.preventDefault()}
            >
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 z-10" />
              {searchLoading && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 z-10">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                </div>
              )}
              <Input
                type="text"
                placeholder={t('accessories.search.placeholder')}
                value={searchInput}
                onChange={(e) => handleSearch(e.target.value)}
                onFocus={handleSearchInputFocus}
                onBlur={handleSearchInputBlur}
                onKeyDown={handleSearchKeyDown}
                className="pl-10 pr-10"
              />
              
              {/* Search Dropdown */}
              {showSearchDropdown && searchSuggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-md shadow-lg z-50 mt-1 max-h-80 overflow-y-auto">
                  {searchSuggestions.map((accessory, index) => (
                    <div
                      key={accessory.id}
                      className={`p-3 cursor-pointer border-b last:border-b-0 flex items-center space-x-3 ${
                        index === selectedSuggestionIndex 
                          ? 'bg-blue-50 border-blue-200' 
                          : 'hover:bg-gray-50'
                      }`}
                      onMouseDown={() => handleSearchSuggestionClick(accessory)}
                    >
                      <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center flex-shrink-0">
                        {accessory.imageUrl ? (
                          <img 
                            src={accessory.imageUrl} 
                            alt={accessory.name}
                            className="w-full h-full object-cover rounded"
                          />
                        ) : (
                          <Package className="h-6 w-6 text-gray-400" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm truncate">{accessory.name}</div>
                        <div className="text-xs text-gray-500 truncate">{accessory.brand}</div>
                        <div className="text-sm font-semibold text-blue-600">{formatCurrency(accessory.price, "EUR")}</div>
                      </div>
                      <div className="text-xs text-gray-500">
                        {categoryConfigs[accessory.category]?.label}
                      </div>
                    </div>
                  ))}
                  {searchInput.trim() && (
                    <div className="p-3 bg-gray-50 border-t">
                      <div className="text-sm text-gray-600">
                        {t('accessories.search.pressEnter', { query: searchInput })}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </form>

            {/* Controls */}
            <div className="flex flex-wrap gap-2 items-center">
              {/* View Mode Toggle */}
              <div className="flex border rounded-md">
                <Button
                  type="button"
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="rounded-r-none"
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="rounded-l-none"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>

              {/* Items per page */}
              <Select value={itemsPerPage.toString()} onValueChange={handleItemsPerPageChange}>
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ITEMS_PER_PAGE_OPTIONS.map(option => (
                    <SelectItem key={option} value={option.toString()}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Sort */}
              <Select value={sortBy} onValueChange={handleSortChange}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">{t('accessories.sorting.name')}</SelectItem>
                  <SelectItem value="price">{t('accessories.sorting.price')}</SelectItem>
                  <SelectItem value="inStock">{t('accessories.sorting.stock')}</SelectItem>
                  <SelectItem value="createdAt">{t('accessories.sorting.dateAdded')}</SelectItem>
                </SelectContent>
              </Select>

              {/* Sort Order */}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleSortOrderChange}
                className="px-3"
              >
                {sortOrder === 'asc' ? '↑' : '↓'}
              </Button>

              {/* Clear Filters */}
              {hasActiveFilters && (
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  onClick={clearFilters}
                >
                  <X className="h-4 w-4 mr-1" />
                  {t('accessories.filters.clear')}
                </Button>
              )}
            </div>
          </div>

          {/* Active Filters */}
          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2 mb-4">
              {selectedCategory && (
                <Badge variant="secondary" className="px-3 py-1">
                  {t('accessories.filters.category', { category: categoryConfigs[selectedCategory].label })}
                  <X 
                    className="h-3 w-3 ml-2 cursor-pointer" 
                    onClick={() => handleCategorySelect(null)}
                  />
                </Badge>
              )}
              {searchTerm && (
                <Badge variant="secondary" className="px-3 py-1">
                  {t('accessories.filters.searchFilter', { query: searchTerm })}
                  <X 
                    className="h-3 w-3 ml-2 cursor-pointer" 
                    onClick={() => handleSearch('')}
                  />
                </Badge>
              )}
            </div>
          )}
        </div>

        {/* Categories Grid */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-center mb-8">
            {hasActiveFilters ? 'Categories' : 'Shop by Category'}
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {categories.map((category) => {
              const IconComponent = category.icon;
              const isSelected = selectedCategory === category.key;
              return (
                <Card 
                  key={category.key} 
                  className={`hover:shadow-lg transition-shadow cursor-pointer group ${
                    isSelected ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                  }`}
                  onClick={() => handleCategorySelect(category.key)}
                >
                  <CardHeader className="text-center pb-2">
                    <div className={`mx-auto w-12 h-12 rounded-full flex items-center justify-center mb-3 transition-colors ${
                      isSelected 
                        ? 'bg-blue-200' 
                        : 'bg-blue-100 group-hover:bg-blue-200'
                    }`}>
                      <IconComponent className={`h-6 w-6 ${
                        isSelected ? 'text-blue-700' : 'text-blue-600'
                      }`} />
                    </div>
                    <CardTitle className={`text-lg ${
                      isSelected ? 'text-blue-700' : ''
                    }`}>
                      {category.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-center pt-0">
                    <CardDescription className="mb-2">
                      {category.description}
                    </CardDescription>
                    {category.count > 0 && (
  <Badge variant={isSelected ? 'default' : 'outline'}>
    {t('accessories.categories.items', { count: category.count })}
  </Badge>
)}
                  </CardContent>
                </Card>
              );
            })}
          </div>
          {hasActiveFilters && (
            <div className="text-center mt-6">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => handleCategorySelect(null)}
              >
                <X className="h-4 w-4 mr-2" />
                {t('accessories.categories.showAll')}
              </Button>
            </div>
          )}
        </div>

        {/* Results Header */}
        <div  id="results-section" className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold">
             {hasActiveFilters ? t('accessories.search.searchResults') : t('accessories.results.title')}
            </h2>
            <p className="text-gray-600">
             {loading ? t('accessories.search.loading') : t('accessories.search.found', { count: totalItems })}
            </p>
          </div>
        </div>

        {/* Accessories Grid/List */}
        {accessories.length > 0 ? (
          <>
            <div  className={viewMode === 'grid' 
              ? "grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8"
              : "space-y-4 mb-8"
            }>
              {accessories.map((accessory) => {
                const categoryConfig = categoryConfigs[accessory.category as keyof typeof categoryConfigs];
                const IconComponent = categoryConfig?.icon || Package;
                const isLowStock = accessory.inStock <= accessory.minStock;

                return (
                  <Card key={accessory.id} className="hover:shadow-lg transition-shadow group">
                    <CardHeader className="p-0">
                      <div className="relative overflow-hidden rounded-t-lg">
                        <div className="w-full h-48 bg-gray-200 flex items-center justify-center group-hover:scale-105 transition-transform">
                          {accessory.imageUrl ? (
                            <img 
                              src={accessory.imageUrl} 
                              alt={accessory.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="text-gray-400 text-center">
                              <IconComponent className="h-16 w-16 mx-auto mb-2" />
                              <p className="text-sm">
                                {t('accessories.product.productImage')}
                              </p>
                            </div>
                          )}
                        </div>
                        {isLowStock && (
                          <Badge 
                            variant="destructive" 
                            className="absolute top-2 right-2"
                          >
                            {t('accessories.product.lowStock')}
                          </Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        {/* Product Name */}
                        <h3 className="font-semibold text-lg leading-tight line-clamp-2">
                          {accessory.name}
                        </h3>

                        {/* Brand */}
                        <p className="text-sm text-gray-600">{accessory.brand}</p>

                        {/* Description */}
                        {accessory.description && (
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {accessory.description}
                          </p>
                        )}

                        {/* Price */}
                        <div className="flex items-center justify-between">
                          <span className="text-xl font-bold text-blue-600">
                            {formatCurrency(accessory.price, "EUR")}
                          </span>
                          <Badge variant="outline">{t('accessories.product.inStock', { count: accessory.inStock })}</Badge>
                        </div>

                        {/* Category */}
                        <Badge variant="secondary" className="text-xs">
                          {categoryConfig?.label || accessory.category}
                        </Badge>

                        {/* Action Button */}
                        <Link href={`/accessories/${accessory.id}`}>
                          <Button className="w-full mt-4">
                            <ShoppingCart className="h-4 w-4 mr-2" />
                            {t('accessories.product.viewDetails')}
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Pagination Controls */}
            <PaginationControls 
              pagination={pagination}
              className="mt-8"
            />
          </>
        ) : (
          <div className="text-center py-12">
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              {t('accessories.noResults.title')}
            </h3>
            <p className="text-gray-500 mb-4">
              {hasActiveFilters
                ? t('accessories.noResults.message')
                : t('accessories.noResults.messageNoFilters')}
            </p>
            {hasActiveFilters && (
              <Button 
                type="button" 
                onClick={clearFilters} 
                variant="outline"
              >
                {t('accessories.filters.clearAll')}
                <X className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
