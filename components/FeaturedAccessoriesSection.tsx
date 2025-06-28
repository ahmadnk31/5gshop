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
          <h2 className="text-3xl font-bold">{translations.title}</h2>
          <Button asChild variant="outline">
            <Link href="/accessories">
              {translations.viewAll}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {accessories.map((accessory) => (
            <Card key={accessory.id} className="hover:shadow-lg transition-shadow cursor-pointer">
              <Link href={`/accessories/${accessory.id}`} className="block group">
                <CardHeader className="pb-4">
                  <div className="relative w-full h-48 bg-gray-200 flex items-center justify-center rounded-t-lg overflow-hidden group-hover:ring-2 group-hover:ring-blue-400 transition">
                    <FallbackImage
                      src={accessory.imageUrl || ''}
                      alt={accessory.name}
                      className="object-contain w-full h-full"
                      fallbackContent={<div className="w-full h-full flex flex-col items-center justify-center text-gray-400"><span className="text-4xl">🧩</span><p className="text-sm mt-2">{translations.productImage}</p></div>}
                    />
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <Badge variant="secondary">
                      {translations.inStock.replace("{count}", String(accessory.inStock))}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg mt-2 group-hover:underline">{accessory.name}</CardTitle>
                  <CardDescription className="text-sm line-clamp-2">
                    {accessory.description}
                  </CardDescription>
                  <div className="text-xs text-gray-500 mt-1">
                    SKU: {generateSkuFromPartName(accessory.name)}
                  </div>
                </CardHeader>
              </Link>
              <CardContent>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl font-bold text-green-600">
                    {formatCurrency(accessory.price, "EUR")}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="default"
                    size="sm"
                    className="flex-1 min-w-[0] px-3 truncate"
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
