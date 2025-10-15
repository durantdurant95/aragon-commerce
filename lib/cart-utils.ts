"use client";

import { Cart, CartItem } from "lib/types";

const CART_STORAGE_KEY = "aragon-commerce-cart";

// Helper to create an empty cart
function createEmptyCart(): Cart {
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
}

// Calculate cart totals
function calculateCartTotals(lines: CartItem[]): Cart["cost"] {
  const subtotal = lines.reduce((sum, line) => {
    return sum + parseFloat(line.cost.totalAmount.amount);
  }, 0);

  const currencyCode = lines[0]?.cost.totalAmount.currencyCode || "USD";

  return {
    subtotalAmount: { amount: subtotal.toFixed(2), currencyCode },
    totalAmount: { amount: subtotal.toFixed(2), currencyCode },
    totalTaxAmount: { amount: "0.00", currencyCode },
  };
}

// Get cart from localStorage
export function getLocalCart(): Cart {
  if (typeof window === "undefined") {
    return createEmptyCart();
  }

  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    if (!stored) {
      return createEmptyCart();
    }
    return JSON.parse(stored);
  } catch (error) {
    console.error("Error reading cart from localStorage:", error);
    return createEmptyCart();
  }
}

// Save cart to localStorage
function saveLocalCart(cart: Cart): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  } catch (error) {
    console.error("Error saving cart to localStorage:", error);
  }
}

// Add item to cart
export function addToLocalCart(
  merchandiseId: string,
  quantity: number,
  product: {
    id: string;
    handle: string;
    title: string;
    featuredImage: any;
  },
  variant: {
    id: string;
    title: string;
    selectedOptions: { name: string; value: string }[];
    price: { amount: string; currencyCode: string };
  }
): Cart {
  const cart = getLocalCart();

  // Check if item already exists in cart
  const existingLine = cart.lines.find(
    (line: CartItem) => line.merchandise.id === merchandiseId
  );

  if (existingLine) {
    // Update quantity
    existingLine.quantity += quantity;
    existingLine.cost.totalAmount.amount = (
      parseFloat(variant.price.amount) * existingLine.quantity
    ).toFixed(2);
  } else {
    // Add new line
    const newLine: CartItem = {
      id: crypto.randomUUID(),
      quantity,
      cost: {
        totalAmount: {
          amount: (parseFloat(variant.price.amount) * quantity).toFixed(2),
          currencyCode: variant.price.currencyCode,
        },
      },
      merchandise: {
        id: merchandiseId,
        title: variant.title,
        selectedOptions: variant.selectedOptions,
        product: {
          id: product.id,
          handle: product.handle,
          title: product.title,
          featuredImage: product.featuredImage,
        },
      },
    };
    cart.lines.push(newLine);
  }

  // Recalculate totals
  cart.cost = calculateCartTotals(cart.lines);
  cart.totalQuantity = cart.lines.reduce((sum, line) => sum + line.quantity, 0);

  saveLocalCart(cart);
  return cart;
}

// Remove item from cart
export function removeFromLocalCart(merchandiseId: string): Cart {
  const cart = getLocalCart();

  cart.lines = cart.lines.filter(
    (line: CartItem) => line.merchandise.id !== merchandiseId
  );

  // Recalculate totals
  cart.cost = calculateCartTotals(cart.lines);
  cart.totalQuantity = cart.lines.reduce(
    (sum: number, line: CartItem) => sum + line.quantity,
    0
  );

  saveLocalCart(cart);
  return cart;
}

// Update item quantity
export function updateLocalCartItem(
  merchandiseId: string,
  quantity: number,
  variantPrice: { amount: string; currencyCode: string }
): Cart {
  const cart = getLocalCart();

  const line = cart.lines.find(
    (line: CartItem) => line.merchandise.id === merchandiseId
  );

  if (line) {
    if (quantity === 0) {
      // Remove item
      return removeFromLocalCart(merchandiseId);
    }

    line.quantity = quantity;
    line.cost.totalAmount.amount = (
      parseFloat(variantPrice.amount) * quantity
    ).toFixed(2);
  }

  // Recalculate totals
  cart.cost = calculateCartTotals(cart.lines);
  cart.totalQuantity = cart.lines.reduce(
    (sum: number, line: CartItem) => sum + line.quantity,
    0
  );

  saveLocalCart(cart);
  return cart;
}

// Clear cart
export function clearLocalCart(): Cart {
  const cart = createEmptyCart();
  saveLocalCart(cart);
  return cart;
}
