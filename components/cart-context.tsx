"use client";
import React, { createContext, useContext, useState, useEffect } from "react";

export type CartItem = {
  id: string;
  name: string;
  price: number;
  image?: string;
  quantity: number;
  type?: "part" | "accessory" 
};

interface CartContextType {
  items: CartItem[];
  buyNowCart: CartItem[] | null;
  addToCart: (item: Omit<CartItem, "quantity">) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  updateQuantity: (id: string, quantity: number) => void;
  setCart: (items: CartItem[]) => void;
  setBuyNowCart: (items: CartItem[] | null) => void;
  getTotal: () => number;
  getBuyNowTotal: () => number;
  // Add cart alias for items
  cart: CartItem[];
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
};

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("cart");
      return stored ? JSON.parse(stored) : [];
    }
    return [];
  });

  const [buyNowCart, setBuyNowCart] = useState<CartItem[] | null>(null);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(items));
  }, [items]);

  // Clear buyNowCart when items change (user adds/removes from main cart)
  useEffect(() => {
    if (buyNowCart) {
      setBuyNowCart(null);
    }
  }, [items]);

  const addToCart = (item: Omit<CartItem, "quantity">) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const clearCart = () => setItems([]);

  const updateQuantity = (id: string, quantity: number) => {
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, quantity } : i))
    );
  };

  const setCart = (newItems: CartItem[]) => {
    setItems(newItems);
  };

  const getTotal = () => items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const getBuyNowTotal = () => buyNowCart ? buyNowCart.reduce((sum, item) => sum + item.price * item.quantity, 0) : 0;

  return (
    <CartContext.Provider value={{ 
      items, 
      buyNowCart,
      addToCart, 
      removeFromCart, 
      clearCart, 
      updateQuantity, 
      setCart, 
      setBuyNowCart,
      getTotal, 
      getBuyNowTotal,
      cart: buyNowCart || items 
    }}>
      {children}
    </CartContext.Provider>
  );
};
