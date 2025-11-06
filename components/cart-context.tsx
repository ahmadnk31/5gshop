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
      try {
        const stored = localStorage.getItem("cart");
        if (stored) {
          const parsed = JSON.parse(stored);
          // Ensure parsed data is an array
          return Array.isArray(parsed) ? parsed : [];
        }
      } catch (error) {
        console.error("Error parsing cart from localStorage:", error);
        // Clear corrupted data
        localStorage.removeItem("cart");
      }
    }
    return [];
  });

  const [buyNowCart, setBuyNowCart] = useState<CartItem[] | null>(null);

  useEffect(() => {
    // Only save if items is a valid array
    if (Array.isArray(items)) {
      try {
        localStorage.setItem("cart", JSON.stringify(items));
      } catch (error) {
        console.error("Error saving cart to localStorage:", error);
      }
    }
  }, [items]);

  // Clear buyNowCart when items change (user adds/removes from main cart)
  useEffect(() => {
    if (buyNowCart) {
      setBuyNowCart(null);
    }
  }, [items]);

  const addToCart = (item: Omit<CartItem, "quantity">) => {
    setItems((prev) => {
      // Ensure prev is always an array
      const prevItems = Array.isArray(prev) ? prev : [];
      const existing = prevItems.find((i) => i.id === item.id);
      if (existing) {
        return prevItems.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prevItems, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setItems((prev) => {
      // Ensure prev is always an array
      const prevItems = Array.isArray(prev) ? prev : [];
      return prevItems.filter((i) => i.id !== id);
    });
  };

  const clearCart = () => setItems([]);

  const updateQuantity = (id: string, quantity: number) => {
    setItems((prev) => {
      // Ensure prev is always an array
      const prevItems = Array.isArray(prev) ? prev : [];
      return prevItems.map((i) => (i.id === id ? { ...i, quantity } : i));
    });
  };

  const setCart = (newItems: CartItem[]) => {
    setItems(newItems);
  };

  const getTotal = () => Array.isArray(items) ? items.reduce((sum, item) => sum + item.price * item.quantity, 0) : 0;

  const getBuyNowTotal = () => buyNowCart && Array.isArray(buyNowCart) ? buyNowCart.reduce((sum, item) => sum + item.price * item.quantity, 0) : 0;

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
