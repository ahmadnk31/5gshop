"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { Input } from "@/components/ui/input";
import { 
  Headphones, 
  Shield,
  ShoppingCart,
  Truck,
  RotateCcw,
  Search,
  Filter,
  Package,
  Cable,
  Monitor,
  Edit,
  Box,
  Zap,
  X
} from "lucide-react";
import Link from "next/link";
import { getAccessories } from "@/app/actions/accessory-actions";
import { Accessory, AccessoryCategory } from "@/lib/types";

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

export default function AccessoriesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [allAccessories, setAllAccessories] = useState<Accessory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState<AccessoryCategory | null>(
    (searchParams.get('category') as AccessoryCategory) || null
  );

  // Load accessories on component mount
  useEffect(() => {
    const loadAccessories = async () => {
      try {
        setLoading(true);
        const accessories = await getAccessories();
        setAllAccessories(accessories);
      } catch (error) {
        console.error('Failed to load accessories:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAccessories();
  }, []);

  // Update URL when filters change
  const updateURL = (category: AccessoryCategory | null, search: string) => {
    const params = new URLSearchParams();
    if (category) params.set('category', category);
    if (search) params.set('search', search);
    
    const newURL = params.toString() ? `/accessories?${params.toString()}` : '/accessories';
    router.push(newURL, { scroll: false });
  };

  // Handle category selection
  const handleCategorySelect = (category: AccessoryCategory | null) => {
    setSelectedCategory(category);
    updateURL(category, searchTerm);
  };

  // Handle search
  const handleSearch = (search: string) => {
    setSearchTerm(search);
    updateURL(selectedCategory, search);
  };

  // Clear all filters
  const clearFilters = () => {
    setSelectedCategory(null);
    setSearchTerm('');
    router.push('/accessories', { scroll: false });
  };

  // Filter accessories based on current filters
  const filteredAccessories = allAccessories.filter(accessory => {
    const matchesCategory = !selectedCategory || accessory.category === selectedCategory;
    const matchesSearch = !searchTerm || 
      accessory.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      accessory.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      accessory.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesCategory && matchesSearch && accessory.inStock > 0;
  });

  // Group accessories by category for statistics
  const categoryCounts = allAccessories.reduce((acc, accessory) => {
    if (accessory.inStock > 0) {
      acc[accessory.category] = (acc[accessory.category] || 0) + 1;
    }
    return acc;
  }, {} as Record<AccessoryCategory, number>);

  // Create category list with real counts
  const categories = Object.entries(categoryConfigs).map(([key, config]) => ({
    key: key as AccessoryCategory,
    icon: config.icon,
    name: config.label,
    description: `High-quality ${config.label.toLowerCase()}`,
    count: categoryCounts[key as AccessoryCategory] || 0
  }));

  const featuredAccessories = allAccessories
    .filter(accessory => accessory.inStock > 0)
    .sort((a, b) => b.inStock - a.inStock) // Sort by stock level
    .slice(0, 8); // Get top 8 as featured

  const totalAccessories = allAccessories.filter(accessory => accessory.inStock > 0).length;
  const hasActiveFilters = selectedCategory || searchTerm;

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <section className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Premium Device Accessories
            </h1>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              Loading our curated selection of high-quality accessories...
            </p>
          </div>
        </section>
        <div className="flex-1 flex items-center justify-center py-16">
          <div className="text-center">
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4 animate-pulse" />
            <p className="text-lg text-gray-600">Loading accessories...</p>
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
            Premium Device Accessories
          </h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Enhance and protect your devices with our curated selection of {totalAccessories}+ high-quality accessories
          </p>
          <Button asChild size="lg" variant="secondary">
            <Link href="#categories">Shop Now</Link>
          </Button>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-8 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search accessories..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-gray-600" />
                <span className="text-sm text-gray-600">
                  Showing {filteredAccessories.length} of {totalAccessories} accessories
                </span>
              </div>
              
              {hasActiveFilters && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={clearFilters}
                  className="text-sm"
                >
                  <X className="h-4 w-4 mr-1" />
                  Clear Filters
                </Button>
              )}
            </div>
          </div>
          
          {/* Active Filters Display */}
          {hasActiveFilters && (
            <div className="mt-4 flex flex-wrap gap-2">
              {selectedCategory && (
                <Badge variant="secondary" className="px-3 py-1">
                  Category: {categoryConfigs[selectedCategory].label}
                  <button 
                    onClick={() => handleCategorySelect(null)}
                    className="ml-2 hover:text-red-600"
                  >
                    ×
                  </button>
                </Badge>
              )}
              {searchTerm && (
                <Badge variant="secondary" className="px-3 py-1">
                  Search: "{searchTerm}"
                  <button 
                    onClick={() => handleSearch('')}
                    className="ml-2 hover:text-red-600"
                  >
                    ×
                  </button>
                </Badge>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Categories Section */}
      <section id="categories" className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Shop by Category</h2>
            <p className="text-xl text-gray-600">Find the perfect accessories for your devices</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {categories.map((category) => {
              const IconComponent = category.icon;
              const isSelected = selectedCategory === category.key;
              
              return (
                <button
                  key={category.key}
                  onClick={() => handleCategorySelect(category.key)}
                  className="group w-full"
                >
                  <Card className={`transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer ${
                    isSelected ? 'ring-2 ring-purple-500 shadow-lg' : ''
                  }`}>
                    <CardContent className="p-6 text-center">
                      <div className={`w-16 h-16 mx-auto bg-gradient-to-br rounded-full flex items-center justify-center mb-4 transition-colors ${
                        isSelected 
                          ? 'from-purple-200 to-pink-200' 
                          : 'from-purple-100 to-pink-100 group-hover:from-purple-200 group-hover:to-pink-200'
                      }`}>
                        <IconComponent className="h-8 w-8 text-purple-600" />
                      </div>
                      <h3 className="font-semibold text-lg mb-2">{category.name}</h3>
                      <p className="text-gray-600 text-sm mb-3">{category.description}</p>
                      <Badge variant={isSelected ? "default" : "secondary"}>
                        {category.count} items
                      </Badge>
                    </CardContent>
                  </Card>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              {hasActiveFilters ? 'Filtered Results' : 'Featured Accessories'}
            </h2>
            <p className="text-xl text-gray-600">
              {hasActiveFilters 
                ? `${filteredAccessories.length} accessories found`
                : 'Our most popular and highest-rated products'
              }
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {(hasActiveFilters ? filteredAccessories : featuredAccessories).map((accessory) => {
              const categoryConfig = categoryConfigs[accessory.category];
              const IconComponent = categoryConfig.icon;
              
              return (
                <Card key={accessory.id} className="group hover:shadow-lg transition-all duration-300">
                  <CardHeader className="p-0">
                    <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-t-lg flex items-center justify-center">
                      {accessory.imageUrl ? (
                        <img 
                          src={accessory.imageUrl} 
                          alt={accessory.name}
                          className="w-full h-full object-cover rounded-t-lg"
                        />
                      ) : (
                        <IconComponent className="h-16 w-16 text-gray-400" />
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <Badge variant="outline" className="text-xs">
                        {categoryConfig.label}
                      </Badge>
                      {accessory.inStock <= accessory.minStock && (
                        <Badge variant="destructive" className="text-xs">
                          Low Stock
                        </Badge>
                      )}
                    </div>
                    
                    <h3 className="font-semibold text-lg mb-1 line-clamp-2">{accessory.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{accessory.brand}</p>
                    
                    {accessory.description && (
                      <p className="text-xs text-gray-500 mb-3 line-clamp-2">{accessory.description}</p>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-2xl font-bold text-green-600">
                          ${accessory.price.toFixed(2)}
                        </span>
                        <span className="text-xs text-gray-500">
                          {accessory.inStock} in stock
                        </span>
                      </div>
                      <Button size="sm" className="shrink-0">
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Add to Cart
                      </Button>
                    </div>
                    
                    {accessory.compatibility && (
                      <div className="mt-3 pt-3 border-t">
                        <p className="text-xs text-gray-500">
                          <strong>Compatible:</strong> {accessory.compatibility}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
          
          {filteredAccessories.length === 0 && !loading && (
            <div className="text-center py-12">
              <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No accessories found</h3>
              <p className="text-gray-500 mb-4">
                {hasActiveFilters 
                  ? 'Try adjusting your filters or browse our categories above.'
                  : 'We\'re working on adding more accessories to our catalog.'
                }
              </p>
              {hasActiveFilters && (
                <Button onClick={clearFilters} variant="outline">
                  Clear Filters
                </Button>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4">
                <Truck className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Free Shipping</h3>
              <p className="text-gray-600">Free delivery on orders over $50</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Shield className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Quality Guarantee</h3>
              <p className="text-gray-600">30-day money-back guarantee</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <RotateCcw className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Easy Returns</h3>
              <p className="text-gray-600">Hassle-free return process</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
