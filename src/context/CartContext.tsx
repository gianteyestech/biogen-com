"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import type { CMSProduct as Product } from "@/lib/cms";


export interface CartItem {
  product: Product;
  quantity: number;
  selectedWeight: string;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, weight: string, quantity?: number) => void;
  removeFromCart: (productId: string, weight: string) => void;
  updateQuantity: (productId: string, weight: string, quantity: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
  cartTotal: number;
  cartCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const savedCart = localStorage.getItem("cart");
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (e) {
      console.error("Failed to parse cart from localStorage", e);
      return [];
    }
  });
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Save cart to localStorage
  const saveCart = (newCart: CartItem[]) => {
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
  };

  const addToCart = (product: Product, weight: string, quantity: number = 1) => {
    const existingIndex = cart.findIndex(
      (item) => item.product.id === product.id && item.selectedWeight === weight
    );

    if (existingIndex > -1) {
      const newCart = [...cart];
      newCart[existingIndex].quantity += quantity;
      saveCart(newCart);
    } else {
      saveCart([...cart, { product, selectedWeight: weight, quantity }]);
    }
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: string, weight: string) => {
    const newCart = cart.filter(
      (item) => !(item.product.id === productId && item.selectedWeight === weight)
    );
    saveCart(newCart);
  };

  const updateQuantity = (productId: string, weight: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, weight);
      return;
    }
    const newCart = cart.map((item) =>
      item.product.id === productId && item.selectedWeight === weight
        ? { ...item, quantity }
        : item
    );
    saveCart(newCart);
  };

  const clearCart = () => {
    saveCart([]);
  };

  const cartTotal = cart.reduce((total, item) => {
    const pricePerUnit = item.product.prices[item.selectedWeight] || 0;
    return total + pricePerUnit * item.quantity;
  }, 0);

  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        cartTotal,
        cartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
