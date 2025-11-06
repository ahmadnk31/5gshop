"use client";

import { useState, useEffect, useRef, useMemo } from "react";

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
  List,
  Filter
} from "lucide-react";

import { getAccessoriesWithFiltersPaginated } from "@/app/actions/pagination-actions";
import { Accessory, AccessoryCategory } from "@/lib/types";
import { useTranslations } from "next-intl";
import { formatCurrency } from "@/lib/utils";
import { addSearchHistory } from "@/lib/view-history";
import { useCart } from "@/components/cart-context";
import { FallbackImage } from "@/components/ui/fallback-image";
import { Link, useRouter } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";
import { AccessoryActionButtons } from "./components/accessory-action-buttons";
import { useSession } from "next-auth/react";
import AccessoriesFilterSidebar, { AccessoryFilters } from "@/components/accessories-filter-sidebar";
import { useAccessoryFilters } from "@/hooks/use-accessory-filters";


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

// Improved Helper: Generate related search terms based on the current searchTerm and allAccessories
function getRelatedSearches(searchTerm: string, allAccessories: Accessory[]): string[] {
  if (!searchTerm || !allAccessories.length) return [];
  
  console.log('🔍 Generating related searches for:', searchTerm);
  console.log('📦 Total accessories available:', allAccessories.length);
  
  // Extract device model from search term (e.g., "iPhone 15", "Galaxy S24")
  const deviceMatch = searchTerm.match(/(iphone|ipad|galaxy|samsung|pixel|oneplus|huawei|xiaomi|sony|nokia|lg|motorola|htc|asus|acer|dell|hp|lenovo|surface|chromebook|airpods|watch|macbook)?\s*(\d{1,3})/i);
  
  if (!deviceMatch) {
    console.log('❌ No device model found in search term');
    // Fallback: show accessories with similar keywords
    const keywords = searchTerm.toLowerCase().split(' ');
    const related = allAccessories
      .filter(accessory => {
        const searchText = [
          accessory.name,
          accessory.description || '',
          accessory.compatibility || ''
        ].join(' ').toLowerCase();
        return keywords.some(keyword => searchText.includes(keyword));
      })
      .slice(0, 3)
      .map(accessory => {
        // Extract the main part of the name (first 3-4 words)
        const nameParts = accessory.name.split(' ');
        return nameParts.slice(0, 4).join(' ');
      });
    
    console.log('🔄 Fallback related searches:', related);
    return related;
  }
  
  const [_, brand, modelNum] = deviceMatch;
  const currentModel = parseInt(modelNum, 10);
  
  console.log('📱 Found device:', { brand, modelNum, currentModel });
  
  if (isNaN(currentModel)) return [];
  
  // Look for accessories with adjacent model numbers
  const relatedModels = [currentModel - 1, currentModel + 1];
  const related: string[] = [];
  
  for (const relatedModel of relatedModels) {
    if (relatedModel <= 0) continue;
    
    console.log(`🔍 Looking for ${brand} ${relatedModel}...`);
    
    // Search in name, description, and compatibility for the related model
    const found = allAccessories.find(accessory => {
      const searchText = [
        accessory.name,
        accessory.description || '',
        accessory.compatibility || ''
      ].join(' ').toLowerCase();
      
      const brandLower = brand.toLowerCase();
      const modelStr = relatedModel.toString();
      
      return searchText.includes(brandLower) && searchText.includes(modelStr);
    });
    
    if (found) {
      console.log(`✅ Found related accessory: ${found.name}`);
      // Create a search term that matches the original pattern
      // If original was "iPhone 15 case", create "iPhone 14 case"
      const originalWords = searchTerm.toLowerCase().split(' ');
      const brandIndex = originalWords.findIndex(word => word.includes(brand.toLowerCase()));
      
      if (brandIndex !== -1 && originalWords[brandIndex + 1] === modelNum) {
        // Replace the model number in the original search
        const newWords = [...originalWords];
        newWords[brandIndex + 1] = relatedModel.toString();
        const relatedSearch = newWords.join(' ');
        if (!related.includes(relatedSearch)) {
          related.push(relatedSearch);
        }
      } else {
        // Fallback: just use brand + model
        const relatedSearch = `${brand} ${relatedModel}`;
        if (!related.includes(relatedSearch)) {
          related.push(relatedSearch);
        }
      }
    } else {
      console.log(`❌ No accessories found for ${brand} ${relatedModel}`);
    }
  }
  
  console.log('🎯 Final related searches:', related);
  return related.slice(0, 4); // Limit to 4 related searches
}

export default function AccessoriesPagePaginated() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations();
  const { addToCart } = useCart();
  const user=useSession().data
  
  // Initialize URL parameters
  const initialCategory = searchParams.get('category') as AccessoryCategory;
  const initialSearch = searchParams.get('search') || '';
  
  // State
  const [accessories, setAccessories] = useState<Accessory[]>([]);
  const [allAccessories, setAllAccessories] = useState<Accessory[]>([]);
  const [categoryCounts, setCategoryCounts] = useState<Record<AccessoryCategory, number>>({} as Record<AccessoryCategory, number>);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [searchInput, setSearchInput] = useState(initialSearch); // Separate input state
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

  // Filter state - initialized with URL parameters
  const [sidebarFilters, setSidebarFilters] = useState<AccessoryFilters>({
    categories: initialCategory ? [initialCategory] : [],
    brands: [],
    priceRange: [0, 1000],
    inStock: false,
    compatibility: [],
    searchTerm: initialSearch,
  });

  // Pagination state
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(
    parseInt(searchParams.get('page') || '1')
  );

  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // Apply sidebar filters to all accessories
  const filteredAccessories = useAccessoryFilters(allAccessories, sidebarFilters);

  const pagination = usePagination({
    totalItems: filteredAccessories.length,
    itemsPerPage,
    initialPage: currentPage,
  });

  // Client-side pagination for filtered accessories
  const paginatedFilteredAccessories = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredAccessories.slice(startIndex, endIndex);
  }, [filteredAccessories, currentPage, itemsPerPage]);

  // Update total items when filters change
  useEffect(() => {
    setTotalItems(filteredAccessories.length);
  }, [filteredAccessories.length]);

  // Handle sidebar filter changes
  const handleSidebarFiltersChange = (newFilters: AccessoryFilters) => {
    setSidebarFilters(newFilters);
    setCurrentPage(1);
    pagination.goToFirstPage();
  };

  // Handle search input changes - update sidebar filters
  const handleSearchInputChange = (value: string) => {
    setSearchInput(value);
    setSidebarFilters(prev => ({
      ...prev,
      searchTerm: value,
    }));
    setSelectedSuggestionIndex(-1);
  };

  // Handle clearing individual filters
  const clearCategoryFilter = (category: AccessoryCategory) => {
    setSidebarFilters(prev => ({
      ...prev,
      categories: prev.categories.filter(c => c !== category),
    }));
  };

  const clearBrandFilter = (brand: string) => {
    setSidebarFilters(prev => ({
      ...prev,
      brands: prev.brands.filter(b => b !== brand),
    }));
  };

  const clearCompatibilityFilter = (compatibility: string) => {
    setSidebarFilters(prev => ({
      ...prev,
      compatibility: prev.compatibility.filter(c => c !== compatibility),
    }));
  };

  const clearSearchFilter = () => {
    setSearchInput('');
    setSidebarFilters(prev => ({
      ...prev,
      searchTerm: '',
    }));
  };

  const clearAllActiveFilters = () => {
    // Calculate actual price range from all accessories
    const priceRange = allAccessories.length > 0 
      ? allAccessories.reduce(
          (acc, accessory) => ({
            min: Math.min(acc.min, accessory.price),
            max: Math.max(acc.max, accessory.price),
          }),
          { min: Infinity, max: -Infinity }
        )
      : { min: 0, max: 1000 };
    
    setSearchInput('');
    setSidebarFilters({
      categories: [],
      brands: [],
      priceRange: [
        priceRange.min !== Infinity ? priceRange.min : 0,
        priceRange.max !== -Infinity ? priceRange.max : 1000
      ],
      inStock: false,
      compatibility: [],
      searchTerm: '',
    });
  };

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

  // Load accessories when dependencies change
  useEffect(() => {
    loadAccessories(currentPage);
  }, [currentPage, itemsPerPage, sortBy, sortOrder, selectedCategory, searchTerm]);

  // Trigger search when searchTerm changes
  useEffect(() => {
    if (searchTerm !== undefined) {
      loadAccessories(1);
    }
  }, [searchTerm]);

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
    const currentURL = window.location.pathname + (window.location.search || '');
    
    // Only update URL if it's actually different from current URL
    if (currentURL !== newURL) {
      // Use pushState instead of router.replace to avoid page refresh
      window.history.pushState({}, '', newURL);
    }
  }, [selectedCategory, searchTerm, currentPage, itemsPerPage, sortBy, sortOrder]);

  // Handle pagination
  useEffect(() => {
    setCurrentPage(pagination.currentPage);
  }, [pagination.currentPage]);

  const handleSearch = (search: string) => {
    setSearchInput(search); // Update input immediately for responsive UI
    setSelectedSuggestionIndex(-1); // Reset selection when typing
    
    // Update sidebar filters with search term
    setSidebarFilters(prev => ({
      ...prev,
      searchTerm: search,
    }));

    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (search.trim() && search.length >= 2) {
      setSearchLoading(true);
      debounceRef.current = setTimeout(() => {
        getAccessoriesWithFiltersPaginated({
          page: 1,
          limit: 5, // Limit suggestions
          search: search,
          inStockOnly: true,
        }).then(suggestions => {
          setSearchSuggestions(suggestions.data);
          setShowSearchDropdown(true);
          setSearchLoading(false);
        }).catch(error => {
          setSearchSuggestions([]);
          setSearchLoading(false);
        });
      }, 300); // 300ms debounce
    } else {
      setSearchSuggestions([]);
      setShowSearchDropdown(false);
      setSearchLoading(false);
    }
  };

  const handleSearchSuggestionClick = (accessory: Accessory) => {
    // Track search history when user clicks a suggestion
    if (searchInput.trim().length >= 2) {
      addSearchHistory(searchInput.trim());
    }
    // Navigate to the accessory detail page
    router.push(`/accessories/${accessory.id}`);
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
    if (e.key === 'Enter') {
      e.preventDefault();
      // Track search history when user presses Enter
      if (searchInput.trim().length >= 2) {
        addSearchHistory(searchInput.trim());
      }
      // Submit search with current input
      setSearchTerm(searchInput);
      setShowSearchDropdown(false);
      if (selectedCategory) {
        setSelectedCategory(null);
      }
      setCurrentPage(1);
      pagination.goToFirstPage();
      // Scroll to results section after a short delay to allow state updates
      setTimeout(() => {
        const resultsSection = document.getElementById('results-section');
        if (resultsSection) {
          resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 200);
      return;
    }

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

  // Load all accessories for category counts (only on initial load)
  useEffect(() => {
    const loadAllAccessories = async () => {
      try {
        console.log('Loading all accessories for category counts...');
        const result = await getAccessoriesWithFiltersPaginated({
          page: 1,
          limit: 1000, // Large number to get all accessories
          inStockOnly: false, // Get all accessories for filter sidebar
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
        
        // Log initial filters to verify URL params were captured
        console.log('Initial filters applied:', {
          categories: initialCategory ? [initialCategory] : [],
          searchTerm: initialSearch
        });
        
        setLoading(false);
      } catch (error) {
        console.error('Failed to load category counts:', error);
        setLoading(false);
      }
    };

    loadAllAccessories();
  }, []);


  const hasActiveFilters = 
    sidebarFilters.categories.length > 0 || 
    sidebarFilters.brands.length > 0 || 
    sidebarFilters.compatibility.length > 0 || 
    sidebarFilters.searchTerm.length > 0;

  const relatedSearches = getRelatedSearches(searchTerm, allAccessories);

  if (loading && accessories.length === 0) {
    return (
      <div className="flex flex-col min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Skeleton Sidebar */}
            <div className="lg:w-80 flex-shrink-0">
              <Card>
                <CardHeader>
                  <div className="h-6 w-32 bg-gray-200 rounded animate-pulse"></div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="space-y-2">
                      <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-8 w-full bg-gray-200 rounded animate-pulse"></div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
            
            {/* Skeleton Grid */}
            <div className="flex-1">
              <div className="mb-6">
                <div className="h-10 w-full max-w-md bg-gray-200 rounded animate-pulse mb-4"></div>
                <div className="h-8 w-48 bg-gray-200 rounded animate-pulse"></div>
              </div>
              
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 md:gap-4 xl:gap-6">
                {[...Array(12)].map((_, i) => (
                  <Card key={i} className="overflow-hidden">
                    <div className="aspect-square bg-gray-200 animate-pulse"></div>
                    <CardContent className="p-4 space-y-3">
                      <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-6 w-24 bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-9 w-full bg-gray-200 rounded animate-pulse"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Helper for low stock
  function isLowStock(accessory: Accessory) {
    return accessory.inStock > 0 && accessory.inStock <= (accessory.minStock || 1);
  }

  // Structured Data for SEO
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.5gshop.nl';
  const siteName = '5G Shop';
  
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Phone & Device Accessories",
    "description": "Shop high-quality mobile accessories including phone cases, chargers, cables, screen protectors, and more at 5G Shop Netherlands.",
    "url": `${siteUrl}/accessories`,
    "publisher": {
      "@type": "Organization",
      "name": siteName,
      "url": siteUrl
    },
    "mainEntity": {
      "@type": "ItemList",
      "numberOfItems": filteredAccessories.length,
      "itemListElement": filteredAccessories.slice(0, 12).map((accessory, index) => {
        const accessorySlug = `${accessory.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')}-${accessory.id}`;
        return {
          "@type": "ListItem",
          "position": index + 1,
          "item": {
            "@type": "Product",
            "name": accessory.name,
            "description": accessory.description || `${accessory.name} by ${accessory.brand}`,
            "image": accessory.imageUrl,
            "brand": {
              "@type": "Brand",
              "name": accessory.brand
            },
            "offers": {
              "@type": "Offer",
              "url": `${siteUrl}/accessories/${accessorySlug}`,
              "priceCurrency": "EUR",
              "price": accessory.price,
              "availability": accessory.inStock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
              "itemCondition": "https://schema.org/NewCondition"
            }
          }
        };
      })
    }
  };

  const breadcrumbStructuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": siteUrl
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Accessories",
        "item": `${siteUrl}/accessories`
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
      
      {/* Hero Section */}
     

      <div className="container mx-auto px-4 py-8">
        {/* Main Content Layout */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filter Sidebar */}
          <div className="lg:w-80 flex-shrink-0">
            {allAccessories.length > 0 ? (
              <AccessoriesFilterSidebar
                accessories={allAccessories}
                onFiltersChange={handleSidebarFiltersChange}
              />
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Filter className="h-5 w-5" />
                    Filters
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-sm text-gray-600">Loading filters...</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Search and Filters */}
            <div className="mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between mb-6">
            {/* Search */}
            <div className="relative w-full sm:flex-1 sm:max-w-md">
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
                onKeyDown={handleSearchKeyDown}
                onFocus={handleSearchInputFocus}
                onBlur={handleSearchInputBlur}
                className="pl-10 pr-10 w-full"
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
                        {categoryConfigs[accessory.category]?.label || accessory.category}
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
            </div>

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
                  onClick={clearAllActiveFilters}
                >
                  <X className="h-4 w-4 mr-1" />
                  {t('accessories.filters.clear')}
                </Button>
              )}
            </div>
          </div>

          {/* Active Filters */}
          {(sidebarFilters.categories.length > 0 || 
            sidebarFilters.brands.length > 0 || 
            sidebarFilters.compatibility.length > 0 || 
            sidebarFilters.searchTerm) && (
            <div className="flex flex-wrap gap-2 mb-4">
              {/* Category filters */}
              {sidebarFilters.categories.map((category) => (
                <Badge key={category} variant="secondary" className="px-3 py-1 flex items-center gap-2">
                  <span>{categoryConfigs[category]?.label || category}</span>
                  <button
                    type="button"
                    className="ml-1 hover:text-red-600 focus:outline-none"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      clearCategoryFilter(category);
                    }}
                    aria-label={`Remove ${category} filter`}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
              
              {/* Brand filters */}
              {sidebarFilters.brands.map((brand) => (
                <Badge key={brand} variant="secondary" className="px-3 py-1 flex items-center gap-2">
                  <span>Brand: {brand}</span>
                  <button
                    type="button"
                    className="ml-1 hover:text-red-600 focus:outline-none"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      clearBrandFilter(brand);
                    }}
                    aria-label={`Remove ${brand} filter`}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
              
              {/* Compatibility filters */}
              {sidebarFilters.compatibility.map((compatibility) => (
                <Badge key={compatibility} variant="secondary" className="px-3 py-1 flex items-center gap-2">
                  <span>Compatible: {compatibility}</span>
                  <button
                    type="button"
                    className="ml-1 hover:text-red-600 focus:outline-none"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      clearCompatibilityFilter(compatibility);
                    }}
                    aria-label={`Remove ${compatibility} filter`}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
              
              {/* Search filter */}
              {sidebarFilters.searchTerm && (
                <Badge variant="secondary" className="px-3 py-1 flex items-center gap-2">
                  <span>Search: "{sidebarFilters.searchTerm}"</span>
                  <button
                    type="button"
                    className="ml-1 hover:text-red-600 focus:outline-none"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      clearSearchFilter();
                    }}
                    aria-label="Remove search filter"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              
              {/* Clear all button */}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.preventDefault();
                  clearAllActiveFilters();
                }}
                className="h-7"
              >
                Clear All
              </Button>
            </div>
          )}
        </div>


        {/* Results Header */}
        <div id="results-section" className="mb-6">
          {/* Related Searches - always above categories, visually distinct */}
          
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-lg md:text-xl xl:text-2xl font-bold">
               {hasActiveFilters ? t('accessories.search.searchResults') : t('accessories.results.title')}
              </h2>
              <p className="text-gray-600">
               {loading ? t('accessories.search.loading') : t('accessories.search.found', { count: filteredAccessories.length })}
              </p>
            </div>
          </div>

          {/* Category Navigation Badges */}
          
        </div>
        {searchTerm && relatedSearches.length > 0 && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded">
              <div className="text-base font-semibold text-green-800 mb-2">Related searches for "{searchTerm}"</div>
              <div className="flex flex-wrap gap-2">
                {relatedSearches.map((term) => (
                  <Button
                    key={term}
                    variant="outline"
                    size="sm"
                    className="px-3 py-1 border border-green-300 text-green-700 hover:bg-green-100"
                    onClick={() => {
                      setSearchInput(term);
                      setSearchTerm(term);
                      setCurrentPage(1);
                      pagination.goToFirstPage();
                      setTimeout(() => {
                        const resultsSection = document.getElementById('results-section');
                        if (resultsSection) {
                          resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }
                      }, 200);
                    }}
                  >
                    {term}
                  </Button>
                ))}
              </div>
            </div>
          )}
        {/* Accessories Grid/List */}
        {filteredAccessories.length > 0 ? (
          <>
            <div  className={viewMode === 'grid' 
              ? "grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 md:gap-4 xl:gap-6 mb-8"
              : "space-y-4 mb-8"
            }>
              {paginatedFilteredAccessories.map((accessory) => {
                const categoryConfig = categoryConfigs[accessory.category];
                const IconComponent = categoryConfig?.icon || Box;
                const lowStock = isLowStock(accessory);
                
                // Create slug for SEO-friendly URL
                const createSlug = (name: string, id: string): string => {
                  const nameSlug = name
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, '-')
                    .replace(/^-+|-+$/g, '');
                  return `${nameSlug}-${id}`;
                };
                const accessorySlug = createSlug(accessory.name, accessory.id);
                
                return (
                  <Card key={accessory.id} className="hover:shadow-lg py-0 transition-shadow group h-full flex flex-col">
                    <CardHeader className="p-0">
                      <Link href={`/accessories/${accessorySlug}`} className="block">
                        <div className="relative overflow-hidden rounded-t-lg">
                          <div className="w-full h-full bg-gray-200 flex items-center justify-center group-hover:scale-105 transition-transform relative overflow-hidden">
                            <FallbackImage
                              src={accessory.imageUrl || ''}
                              alt={accessory.name}
                              className="object-cover w-full h-full aspect-square"
                              fallbackContent={
                                <div className="text-center text-gray-400 flex flex-col items-center justify-center w-full h-full">
                                  <IconComponent className="h-16 w-16 mx-auto mb-2" />
                                  <p className="text-sm">{t('accessories.product.productImage')}</p>
                                </div>
                              }
                            />
                          </div>
                          {lowStock && (
                            <Badge className="absolute top-2 left-2 opacity-50" variant="destructive">
                              {t('accessories.product.lowStock')}
                            </Badge>
                          )}
                        </div>
                      </Link>
                    </CardHeader>
                    <CardContent className="p-4 flex flex-col flex-1">
                      <h3 className="font-semibold text-sm md:text-lg mb-2 line-clamp-2">
                        <Link href={`/accessories/${accessorySlug}`} className="hover:underline">
                          {accessory.name}
                        </Link>
                      </h3>
                      <Link href={`/accessories/${accessorySlug}`} className="hover:underline">
                      <div className="flex flex-wrap gap-2 items-center justify-between mb-4">
                        <span className="text-sm md:text-lg font-bold text-green-600">
                          {formatCurrency(accessory.price, "EUR")}
                        </span>
                        <Badge variant="secondary" className="text-xs">
                          {categoryConfig?.label || accessory.category}
                        </Badge>
                      </div>
                      </Link>

                        <div className="mt-auto flex items-center gap-2">
                          <Button
                            variant="default"
                            size="sm"
                            className="px-3 flex-1"
                            disabled={accessory.inStock === 0}
                            onClick={() => addToCart({
                              id: accessory.id,
                              name: accessory.name,
                              price: accessory.price,
                              image: accessory.imageUrl || undefined,
                              type: 'accessory',
                            })}
                            title={t('accessories.product.addToCart', { defaultValue: 'Add to Cart' })}
                          >
                            <ShoppingCart className="h-4 w-4 mr-2" />
                          </Button>
                          {user && <AccessoryActionButtons accessory={accessory} />}
                        </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Pagination Controls */}
            {filteredAccessories.length > itemsPerPage && (
              <PaginationControls 
                pagination={pagination}
                className="mt-8"
              />
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              {t('accessories.results.noResults.title')}
            </h3>
            <p className="text-gray-500 mb-4">
              {hasActiveFilters
                ? t('accessories.results.noResults.message')
                : t('accessories.results.noResults.messageNoFilters')}
            </p>
            {hasActiveFilters && (
              <Button 
                type="button" 
                onClick={clearAllActiveFilters} 
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
      </div>
    </div>
  );
}
