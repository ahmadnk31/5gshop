import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { 
  Smartphone, 
  Tablet, 
  Laptop, 
  Headphones, 
  Battery, 
  Usb, 
  Shield, 
  Speaker,
  Watch,
  Camera,
  Star,
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
  Zap
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

interface AccessoriesPageProps {
  searchParams: { category?: string; search?: string; }
}

export default async function AccessoriesPage({ searchParams }: AccessoriesPageProps) {
  // Fetch real accessories from the database
  const allAccessories = await getAccessories();
  
  // Filter accessories based on search params
  const filteredAccessories = allAccessories.filter(accessory => {
    const matchesCategory = !searchParams.category || accessory.category === searchParams.category;
    const matchesSearch = !searchParams.search || 
      accessory.name.toLowerCase().includes(searchParams.search.toLowerCase()) ||
      accessory.brand.toLowerCase().includes(searchParams.search.toLowerCase()) ||
      accessory.description?.toLowerCase().includes(searchParams.search.toLowerCase());
    
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
    count: `${categoryCounts[key as AccessoryCategory] || 0} items`
  }));

  const featuredAccessories = allAccessories
    .filter(accessory => accessory.inStock > 0)
    .sort((a, b) => b.inStock - a.inStock) // Sort by stock level
    .slice(0, 8); // Get top 8 as featured

  const totalAccessories = allAccessories.filter(accessory => accessory.inStock > 0).length;

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
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-600" />
              <span className="text-sm text-gray-600">
                Showing {filteredAccessories.length} of {totalAccessories} accessories
              </span>
            </div>
          </div>
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
              return (
                <Link 
                  key={category.key}
                  href={`/accessories?category=${category.key}`}
                  className="group"
                >
                  <Card className="transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer">
                    <CardContent className="p-6 text-center">
                      <div className="w-16 h-16 mx-auto bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mb-4 group-hover:from-purple-200 group-hover:to-pink-200 transition-colors">
                        <IconComponent className="h-8 w-8 text-purple-600" />
                      </div>
                      <h3 className="font-semibold text-lg mb-2">{category.name}</h3>
                      <p className="text-gray-600 text-sm mb-3">{category.description}</p>
                      <Badge variant="secondary">{category.count}</Badge>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Featured Accessories</h2>
            <p className="text-xl text-gray-600">Our most popular and highest-rated products</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {featuredAccessories.map((accessory) => {
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
          
          {featuredAccessories.length === 0 && (
            <div className="text-center py-12">
              <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No accessories found</h3>
              <p className="text-gray-500">Try adjusting your search or browse our categories above.</p>
            </div>
          )}
        </div>
      </section>

      {/* All Products Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">All Accessories</h2>
            <p className="text-xl text-gray-600">Browse our complete collection</p>
          </div>
          
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 mb-8">
              <TabsTrigger value="all">All ({filteredAccessories.length})</TabsTrigger>
              <TabsTrigger value="bestsellers">Best Sellers</TabsTrigger>
              <TabsTrigger value="new">New Arrivals</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="space-y-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredAccessories.map((accessory) => {
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
                            <IconComponent className="h-12 w-12 text-gray-400" />
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
                        
                        <h3 className="font-semibold mb-1 line-clamp-2">{accessory.name}</h3>
                        <p className="text-sm text-gray-600 mb-2">{accessory.brand}</p>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-bold text-green-600">
                            ${accessory.price.toFixed(2)}
                          </span>
                          <Button size="sm" variant="outline">
                            <ShoppingCart className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>
            
            <TabsContent value="bestsellers">
              <div className="text-center py-12">
                <Star className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">Best Sellers Coming Soon</h3>
                <p className="text-gray-500">We're working on tracking our most popular items.</p>
              </div>
            </TabsContent>
            
            <TabsContent value="new">
              <div className="text-center py-12">
                <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">New Arrivals Coming Soon</h3>
                <p className="text-gray-500">Check back soon for our latest additions.</p>
              </div>
            </TabsContent>
          </Tabs>
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
