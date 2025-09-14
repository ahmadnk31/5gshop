"use client";

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { 
  Filter, 
  X, 
  ChevronDown, 
  ChevronUp,
  Zap,
  Shield,
  Cable,
  Headphones,
  Monitor,
  Edit,
  Box,
  DollarSign,
  Package
} from 'lucide-react';
import { Accessory, AccessoryCategory } from '@/lib/types';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface AccessoriesFilterSidebarProps {
  accessories: Accessory[];
  onFiltersChange: (filters: AccessoryFilters) => void;
  className?: string;
}

export interface AccessoryFilters {
  categories: AccessoryCategory[];
  brands: string[];
  priceRange: [number, number];
  inStock: boolean;
  compatibility: string[];
  searchTerm: string;
}

const categoryIcons: Record<AccessoryCategory, React.ComponentType<any>> = {
  CASE: Shield,
  CHARGER: Zap,
  CABLE: Cable,
  HEADPHONES: Headphones,
  SCREEN_PROTECTOR: Shield,
  KEYBOARD: Monitor,
  MOUSE: Monitor,
  STYLUS: Edit,
  STAND: Monitor,
  MOUNT: Monitor,
  OTHER: Box,
};

const categoryLabels: Record<AccessoryCategory, string> = {
  CASE: 'Cases & Covers',
  CHARGER: 'Chargers & Power',
  CABLE: 'Cables & Adapters',
  HEADPHONES: 'Audio & Headphones',
  SCREEN_PROTECTOR: 'Screen Protection',
  KEYBOARD: 'Keyboards',
  MOUSE: 'Mice & Trackpads',
  STYLUS: 'Stylus & Pens',
  STAND: 'Stands & Holders',
  MOUNT: 'Mounts & Brackets',
  OTHER: 'Other Accessories',
};

export default function AccessoriesFilterSidebar({ 
  accessories, 
  onFiltersChange, 
  className = "" 
}: AccessoriesFilterSidebarProps) {
  const t = useTranslations('accessories.filters');
  
  // Debug logging
  console.log('AccessoriesFilterSidebar rendered with accessories:', accessories.length);
  
  // Early return if no accessories
  if (accessories.length === 0) {
    return (
      <div className={`w-full lg:w-80 ${className}`}>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-sm text-gray-600">No accessories available for filtering</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  // Filter state
  const [filters, setFilters] = useState<AccessoryFilters>({
    categories: [],
    brands: [],
    priceRange: [0, 1000],
    inStock: false,
    compatibility: [],
    searchTerm: '',
  });

  // UI state
  const [isOpen, setIsOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    categories: true,
    brands: true,
    price: true,
    stock: true,
    compatibility: false,
  });

  // Extract unique values from accessories
  const uniqueBrands = Array.from(new Set(accessories.map(a => a.brand).filter(Boolean))).sort();
  const uniqueCompatibility = Array.from(new Set(
    accessories
      .map(a => a.compatibility)
      .filter(Boolean)
      .flatMap(comp => comp?.split(',').map(c => c.trim()) || [])
  )).sort();

  const categoryCounts = accessories.reduce((acc, accessory) => {
    acc[accessory.category] = (acc[accessory.category] || 0) + 1;
    return acc;
  }, {} as Record<AccessoryCategory, number>);

  const brandCounts = accessories.reduce((acc, accessory) => {
    if (accessory.brand) {
      acc[accessory.brand] = (acc[accessory.brand] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const priceRange = accessories.reduce(
    (acc, accessory) => ({
      min: Math.min(acc.min, accessory.price),
      max: Math.max(acc.max, accessory.price),
    }),
    { min: Infinity, max: -Infinity }
  );

  // Update filters when props change
  useEffect(() => {
    if (priceRange.min !== Infinity && priceRange.max !== -Infinity) {
      setFilters(prev => ({
        ...prev,
        priceRange: [priceRange.min, priceRange.max],
      }));
    }
  }, [priceRange.min, priceRange.max]);

  // Notify parent of filter changes
  useEffect(() => {
    onFiltersChange(filters);
  }, [filters, onFiltersChange]);

  const updateFilters = (updates: Partial<AccessoryFilters>) => {
    setFilters(prev => ({ ...prev, ...updates }));
  };

  const toggleCategory = (category: AccessoryCategory) => {
    setFilters(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category],
    }));
  };

  const toggleBrand = (brand: string) => {
    setFilters(prev => ({
      ...prev,
      brands: prev.brands.includes(brand)
        ? prev.brands.filter(b => b !== brand)
        : [...prev.brands, brand],
    }));
  };

  const toggleCompatibility = (compatibility: string) => {
    setFilters(prev => ({
      ...prev,
      compatibility: prev.compatibility.includes(compatibility)
        ? prev.compatibility.filter(c => c !== compatibility)
        : [...prev.compatibility, compatibility],
    }));
  };

  const clearAllFilters = () => {
    setFilters({
      categories: [],
      brands: [],
      priceRange: [priceRange.min, priceRange.max],
      inStock: false,
      compatibility: [],
      searchTerm: '',
    });
  };

  const hasActiveFilters = 
    filters.categories.length > 0 ||
    filters.brands.length > 0 ||
    filters.inStock ||
    filters.compatibility.length > 0 ||
    filters.priceRange[0] !== priceRange.min ||
    filters.priceRange[1] !== priceRange.max;

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return (
    <div className={`w-full lg:w-80 ${className}`}>
      {/* Mobile Toggle Button */}
      <div className="lg:hidden mb-4">
        <Button
          variant="outline"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full justify-between"
        >
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            <span>Filters</span>
            {hasActiveFilters && (
              <Badge variant="secondary" className="ml-2">
                {filters.categories.length + filters.brands.length + filters.compatibility.length + (filters.inStock ? 1 : 0)}
              </Badge>
            )}
          </div>
          {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>
      </div>

      {/* Filter Sidebar */}
      <div className={`${isOpen ? 'block' : 'hidden'} lg:block`}>
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filters
              </CardTitle>
              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAllFilters}
                  className="text-xs"
                >
                  <X className="h-3 w-3 mr-1" />
                  Clear All
                </Button>
              )}
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Categories */}
            <Collapsible
              open={expandedSections.categories}
              onOpenChange={() => toggleSection('categories')}
            >
              <CollapsibleTrigger asChild>
                <Button variant="ghost" className="w-full justify-between p-0 h-auto">
                  <span className="font-medium">Categories</span>
                  {expandedSections.categories ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-2 mt-3">
                {Object.entries(categoryCounts).map(([category, count]) => {
                  const IconComponent = categoryIcons[category as AccessoryCategory];
                  const isSelected = filters.categories.includes(category as AccessoryCategory);
                  
                  return (
                    <div
                      key={category}
                      className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded"
                      onClick={() => toggleCategory(category as AccessoryCategory)}
                    >
                      <Checkbox
                        checked={isSelected}
                        onChange={() => toggleCategory(category as AccessoryCategory)}
                      />
                      <IconComponent className="h-4 w-4 text-gray-600" />
                      <span className="flex-1 text-sm">{categoryLabels[category as AccessoryCategory]}</span>
                      <Badge variant="secondary" className="text-xs">
                        {count}
                      </Badge>
                    </div>
                  );
                })}
              </CollapsibleContent>
            </Collapsible>

            <Separator />

            {/* Brands */}
            <Collapsible
              open={expandedSections.brands}
              onOpenChange={() => toggleSection('brands')}
            >
              <CollapsibleTrigger asChild>
                <Button variant="ghost" className="w-full justify-between p-0 h-auto">
                  <span className="font-medium">Brands</span>
                  {expandedSections.brands ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-2 mt-3">
                {uniqueBrands.slice(0, 10).map((brand) => {
                  const isSelected = filters.brands.includes(brand);
                  const count = brandCounts[brand] || 0;
                  
                  return (
                    <div
                      key={brand}
                      className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded"
                      onClick={() => toggleBrand(brand)}
                    >
                      <Checkbox
                        checked={isSelected}
                        onChange={() => toggleBrand(brand)}
                      />
                      <span className="flex-1 text-sm">{brand}</span>
                      <Badge variant="secondary" className="text-xs">
                        {count}
                      </Badge>
                    </div>
                  );
                })}
                {uniqueBrands.length > 10 && (
                  <div className="text-xs text-gray-500 text-center pt-2">
                    +{uniqueBrands.length - 10} more brands
                  </div>
                )}
              </CollapsibleContent>
            </Collapsible>

            <Separator />

            {/* Price Range */}
            <Collapsible
              open={expandedSections.price}
              onOpenChange={() => toggleSection('price')}
            >
              <CollapsibleTrigger asChild>
                <Button variant="ghost" className="w-full justify-between p-0 h-auto">
                  <span className="font-medium flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Price Range
                  </span>
                  {expandedSections.price ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-4 mt-3">
                <div className="px-2">
                  <Slider
                    value={filters.priceRange}
                    onValueChange={(value) => updateFilters({ priceRange: value as [number, number] })}
                    min={priceRange.min}
                    max={priceRange.max}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-2">
                    <span>€{filters.priceRange[0]}</span>
                    <span>€{filters.priceRange[1]}</span>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>

            <Separator />

            {/* Stock Status */}
            <Collapsible
              open={expandedSections.stock}
              onOpenChange={() => toggleSection('stock')}
            >
              <CollapsibleTrigger asChild>
                <Button variant="ghost" className="w-full justify-between p-0 h-auto">
                  <span className="font-medium flex items-center gap-2">
                    <Package className="h-4 w-4" />
                    Stock Status
                  </span>
                  {expandedSections.stock ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-2 mt-3">
                <div
                  className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded"
                  onClick={() => updateFilters({ inStock: !filters.inStock })}
                >
                  <Checkbox
                    checked={filters.inStock}
                    onChange={() => updateFilters({ inStock: !filters.inStock })}
                  />
                  <span className="text-sm">In Stock Only</span>
                  <Badge variant="secondary" className="text-xs">
                    {accessories.filter(a => a.inStock > 0).length}
                  </Badge>
                </div>
              </CollapsibleContent>
            </Collapsible>

            {/* Compatibility */}
            {uniqueCompatibility.length > 0 && (
              <>
                <Separator />
                <Collapsible
                  open={expandedSections.compatibility}
                  onOpenChange={() => toggleSection('compatibility')}
                >
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" className="w-full justify-between p-0 h-auto">
                      <span className="font-medium">Compatibility</span>
                      {expandedSections.compatibility ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="space-y-2 mt-3">
                    {uniqueCompatibility.slice(0, 8).map((compatibility) => {
                      const isSelected = filters.compatibility.includes(compatibility);
                      
                      return (
                        <div
                          key={compatibility}
                          className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded"
                          onClick={() => toggleCompatibility(compatibility)}
                        >
                          <Checkbox
                            checked={isSelected}
                            onChange={() => toggleCompatibility(compatibility)}
                          />
                          <span className="flex-1 text-sm">{compatibility}</span>
                        </div>
                      );
                    })}
                    {uniqueCompatibility.length > 8 && (
                      <div className="text-xs text-gray-500 text-center pt-2">
                        +{uniqueCompatibility.length - 8} more devices
                      </div>
                    )}
                  </CollapsibleContent>
                </Collapsible>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
