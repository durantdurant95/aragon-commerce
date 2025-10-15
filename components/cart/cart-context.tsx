"use client";

import {
  addToLocalCart,
  getLocalCart,
  updateLocalCartItem,
} from "lib/cart-utils";
import type { Cart, CartItem, Product, ProductVariant } from "lib/types";
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type UpdateType = "plus" | "minus" | "delete";

type CartContextType = {
  cart: Cart;
  updateCartItem: (merchandiseId: string, updateType: UpdateType) => void;
  addCartItem: (variant: ProductVariant, product: Product) => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<Cart>(() => {
    // Initialize with empty cart on server/first render
    return {
      id: "local-cart",
      checkoutUrl: "#",
      cost: {
        subtotalAmount: { amount: "0.00", currencyCode: "USD" },
        totalAmount: { amount: "0.00", currencyCode: "USD" },
        totalTaxAmount: { amount: "0.00", currencyCode: "USD" },
      },
      lines: [],
      totalQuantity: 0,
    };
  });

  // Load cart from localStorage on mount
  useEffect(() => {
    const localCart = getLocalCart();
    setCart(localCart);
  }, []);

  const updateCartItem = (merchandiseId: string, updateType: UpdateType) => {
    const item = cart.lines.find(
      (line: CartItem) => line.merchandise.id === merchandiseId
    );
    if (!item) return;

    let newQuantity = item.quantity;
    if (updateType === "plus") {
      newQuantity += 1;
    } else if (updateType === "minus") {
      newQuantity -= 1;
    } else if (updateType === "delete") {
      newQuantity = 0;
    }

    const singleItemPrice = {
      amount: (
        parseFloat(item.cost.totalAmount.amount) / item.quantity
      ).toFixed(2),
      currencyCode: item.cost.totalAmount.currencyCode,
    };

    const updatedCart = updateLocalCartItem(
      merchandiseId,
      newQuantity,
      singleItemPrice
    );
    setCart(updatedCart);
  };

  const addCartItem = (variant: ProductVariant, product: Product) => {
    const updatedCart = addToLocalCart(
      variant.id,
      1,
      {
        id: product.id,
        handle: product.handle,
        title: product.title,
        featuredImage: product.featuredImage,
      },
      variant
    );
    setCart(updatedCart);
  };

  const value = useMemo(
    () => ({
      cart,
      updateCartItem,
      addCartItem,
    }),
    [cart]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
