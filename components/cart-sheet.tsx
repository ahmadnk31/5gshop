import * as React from "react";
import { useCart } from "@/components/cart-context";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ShoppingCart, X } from "lucide-react";
import { useTranslations } from 'next-intl';
import { Link } from "@/i18n/navigation";

export function CartSheet({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const { items, removeFromCart, clearCart, updateQuantity } = useCart();
  const t = useTranslations('accessories');
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full max-w-md px-6 py-8">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" /> {t('cart.title', { defaultValue: 'Cart' })}
          </SheetTitle>
        </SheetHeader>
        <div className="mt-6 flex flex-col gap-6 h-full">
          {items.length === 0 ? (
            <div className="text-center text-gray-500">{t('cart.empty', { defaultValue: 'Your cart is empty.' })}</div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto divide-y">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center py-4 gap-4">
                    {item.image && (
                      <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{item.name}</div>
                      <div className="text-sm text-gray-500">€{item.price.toFixed(2)}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <Button size="icon" variant="outline" onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}>-</Button>
                        <span className="px-2">{item.quantity}</span>
                        <Button size="icon" variant="outline" onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</Button>
                      </div>
                    </div>
                    <Button size="icon" variant="ghost" onClick={() => removeFromCart(item.id)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
              <div className="border-t pt-6 mt-6">
                <div className="flex justify-between font-semibold text-lg mb-2">
                  <span>{t('cart.total', { defaultValue: 'Total' })}</span>
                  <span>€{total.toFixed(2)}</span>
                </div>
                <Button className="w-full mt-4" asChild>
                  <Link href="/checkout">{t('cart.checkout', { defaultValue: 'Checkout' })}</Link>
                </Button>
                <Button className="w-full mt-2" variant="outline" onClick={clearCart}>
                  {t('cart.clear', { defaultValue: 'Clear Cart' })}
                </Button>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
