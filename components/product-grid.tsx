import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, ShoppingCart } from "lucide-react";

interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  image?: string;
  badge?: string;
  category: string;
}

interface ProductGridProps {
  products: Product[];
  onAddToCart?: (productId: number) => void;
}

export function ProductGrid({ products, onAddToCart }: ProductGridProps) {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <Card key={product.id} className="hover:shadow-lg transition-shadow group">
          <CardHeader className="p-0">
            <div className="relative overflow-hidden rounded-t-lg">
              <div className="w-full h-48 bg-gray-200 flex items-center justify-center group-hover:scale-105 transition-transform">
                {product.image ? (
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-gray-400 text-center">
                    <ShoppingCart className="h-16 w-16 mx-auto mb-2" />
                    <p className="text-sm">Product Image</p>
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-1 absolute top-2 left-2 z-10">
                {product.badge && (
                  <Badge 
                    variant={
                      product.badge === "Sale" ? "destructive" : 
                      product.badge === "New" ? "default" : 
                      "secondary"
                    }
                  >
                    {product.badge}
                  </Badge>
                )}
                <Badge variant="secondary" className="text-xs">
                  {product.category}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-4">
            <h3 className="font-semibold text-lg mb-2 line-clamp-2 min-h-[3.5rem]">{product.name}</h3>
            
            {/* Rating */}
            <div className="flex items-center mb-3">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`h-4 w-4 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600 ml-2">({product.reviews})</span>
            </div>

            {/* Price */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <span className="text-xl font-bold text-blue-600">${product.price}</span>
                {product.originalPrice && (
                  <span className="text-sm text-gray-500 line-through">${product.originalPrice}</span>
                )}
              </div>
              {product.originalPrice && (
                <Badge variant="outline" className="text-green-600">
                  Save ${(product.originalPrice - product.price).toFixed(2)}
                </Badge>
              )}
            </div>

            {/* Add to Cart Button */}
            <Button 
              className="w-full" 
              onClick={() => onAddToCart?.(product.id)}
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Add to Cart
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
