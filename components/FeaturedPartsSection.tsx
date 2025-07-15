"use client";
import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import { FallbackImage } from "@/components/ui/fallback-image";

import { useCart } from "@/components/cart-context";


export function FeaturedPartsSection({ parts, t }: { parts: any[]; t: any }) {
  const [isPending, startTransition] = useTransition();
  const { addToCart } = useCart();

  const handleAddToCart = (part: any) => {
    startTransition(() => {
      addToCart({
        id: part.id,
        name: part.name,
        price: part.cost,
        image: part.imageUrl || "",
        type: "part"
      });
    });
  };

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-3xl font-bold">{t("parts.allParts", { defaultValue: "Featured Repair Parts" })}</h2>
          <Button asChild variant="outline">
            <Link href="/parts">
              {t("featuredAccessories.viewAll")}
            </Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {parts.map((part) => (
            <Card key={part.id} className="hover:shadow-lg transition-shadow group">
              <CardHeader className="p-0">
                <div className="relative overflow-hidden rounded-t-lg">
                  <div className="w-full h-48 bg-gray-200 flex items-center justify-center group-hover:scale-105 transition-transform relative overflow-hidden">
                    <FallbackImage
                      src={part.imageUrl || ''}
                      alt={part.name}
                      width={220}
                      height={192}
                      className="object-contain w-full h-full"
                      fallbackContent={
                        <div className="text-center text-gray-400">
                          <span className="text-4xl">🧩</span>
                          <p className="text-sm mt-2">{t("parts.relatedProducts.productImage")}</p>
                        </div>
                      }
                    />
                  </div>
                  <div className="flex flex-col gap-1 absolute top-2 left-2 z-10">
                    {part.inStock <= part.minStock && (
                      <Badge variant="outline">
                        {t("parts.lowStock")}
                      </Badge>
                    )}
                    <Badge variant="secondary" className="text-xs">
                      {part.category}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <h3 className="font-semibold text-lg mb-2 line-clamp-2 min-h-[3.5rem]">{part.name}</h3>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xl font-bold text-blue-600">
                    {part.cost} €
                  </span>
                </div>
                <div className="flex space-x-2">
                  <Link href={`/parts/${part.id}`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full">
                      {t("parts.relatedProducts.viewDetails")}
                    </Button>
                  </Link>
                  <Button
                    variant="default"
                    size="sm"
                    className="flex-1"
                    disabled={part.inStock === 0 || isPending}
                    title={t("parts.addToCart")}
                    type="button"
                    onClick={() => handleAddToCart(part)}
                  >
                    <ShoppingCart className="h-4 w-4" />
                    <span className="sr-only">{t("parts.addToCart")}</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
