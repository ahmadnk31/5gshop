"use client"
import { useCart } from "@/components/cart-context";
import { Button } from "@/components/ui/button";
import { useRouter } from "@/i18n/navigation";
import { ShoppingCart } from "lucide-react";
import { useTranslations } from "next-intl";

export function AccessoryDetailClientActions({ accessory, isInStock }: { accessory: any, isInStock: boolean }) {
  const { addToCart, clearCart } = useCart();
  const router = useRouter();
  const t = useTranslations('');

  return (
    <div className="space-y-4">
      <div className="flex space-x-4">
        <Button
          size="lg"
          className="flex-1"
          disabled={!isInStock}
          onClick={() => {
            addToCart({
              id: accessory.id,
              name: accessory.name,
              price: accessory.price,
              image: accessory.imageUrl || undefined,
              type: 'accessory',
            });
          }}
        >
          <ShoppingCart className="h-5 w-5 mr-2" />
          {isInStock ? t('accessories.cart.addToCart', { defaultValue: 'Add to Cart' }) : t('accessories.cart.outOfStock', { defaultValue: 'Out of Stock' })}
        </Button>
        <Button
          variant="outline"
          size="lg"
          className="flex-1"
          onClick={() => {
            if (!isInStock) return;
            // Use context clearCart and addToCart for correct state update (like parts)
            clearCart();
            addToCart({
              id: accessory.id,
              name: accessory.name,
              price: accessory.price,
              image: accessory.imageUrl || undefined,
              type: 'accessory',
            });
            router.push('/checkout');
          }}
          disabled={!isInStock}
        >
            <ShoppingCart className="h-5 w-5 mr-2" />
            {isInStock ? t('accessories.cart.buyNow', { defaultValue: 'Buy Now' }) : t('accessories.cart.outOfStock', { defaultValue: 'Out of Stock' })}
        </Button>

      </div>
      {isInStock && (
        <p className="text-sm text-gray-500 text-center">
            {t('product.freeShipping', { defaultValue: 'Free Shipping' })}
        </p>
      )}
    </div>
  );
}