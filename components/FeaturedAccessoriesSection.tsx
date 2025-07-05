"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { formatCurrency, generateSkuFromPartName } from "@/lib/utils";
import { useCart } from "@/components/cart-context";
import { FallbackImage } from "@/components/ui/fallback-image";

import { Accessory } from "@/lib/types";

type Translations = {
  title: string;
  viewAll: string;
  inStock: string; // e.g. "{count} in stock"
  viewDetails: string;
  addToCart: string;
  buyNow: string;
  productImage: string;
};

type Props = {
  accessories: Accessory[];
  translations: Translations;
};

export function FeaturedAccessoriesSection({ accessories, translations }: Props) {
  const { addToCart } = useCart();

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-lg md:text-2xl font-bold">{translations.title}</h2>
          <Button asChild variant="outline">
            <Link href="/accessories">
              {translations.viewAll}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4 xl:gap-6">
          {accessories.map((accessory) => (
            <Card key={accessory.id} className="hover:shadow-lg transition-shadow gap-0 cursor-pointer pt-0 relative">
              <Link href={`/accessories/${accessory.id}`} className="block group">
                <CardHeader className="p-0">
                  <div className="relative w-full  bg-gray-200 flex items-center justify-center rounded-t-lg overflow-hidden transition">
                    <FallbackImage
                      src={accessory.imageUrl || ''}
                      alt={accessory.name}
                      className="object-contain aspect-square w-full h-full"
                      fallbackContent={<div className="w-full h-full flex flex-col items-center justify-center text-gray-400"><span className="text-4xl">🧩</span><p className="text-sm mt-2">{translations.productImage}</p></div>}
                    />
                  </div>
                 
                </CardHeader>
              </Link>
              <CardContent>
              <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="absolute top-2 left-2">
                      {translations.inStock.replace("{count}", String(accessory.inStock))}
                    </Badge>
                  </div>
                  <CardTitle className="text-sm md:text-lg xl:text-xl my-2 group-hover:underline">{accessory.name}</CardTitle>
                  <div className="text-xs text-gray-500 mt-2">
                    SKU: {generateSkuFromPartName(accessory.name)}
                  </div>
                <div className="flex items-center justify-between my-4">
                  <span className="text-2xl font-bold text-green-600">
                    {formatCurrency(accessory.price, "EUR")}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="default"
                    size="sm"
                    className="flex-1 min-w-[0] px-3 truncate bg-green-700 hover:bg-green-600"
                    disabled={accessory.inStock === 0}
                    title={translations.addToCart}
                    onClick={() => addToCart({
                      id: accessory.id,
                      name: accessory.name,
                      price: accessory.price,
                      image: accessory.imageUrl || '',
                      type: 'accessory',
                    })}
                  >
                    <ShoppingCart className="h-4 w-4" />
                  </Button>
                  {/* Removed 'Get Quote'/'Buy Now' button for accessories */}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
