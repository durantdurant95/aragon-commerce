import { HIDDEN_PRODUCT_TAG } from "lib/constants";
import { Cart, Collection, Menu, Page, Product } from "lib/types";

// Import static data
import collectionsData from "./collections.json";
import menusData from "./menus.json";
import pagesData from "./pages.json";
import productsData from "./products.json";

// Helper to simulate async operations
const delay = (ms: number = 0) =>
  new Promise((resolve) => setTimeout(resolve, ms));

// Cart operations will be handled client-side with localStorage
export async function createCart(): Promise<Cart> {
  await delay();
  return {
    id: crypto.randomUUID(),
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

export async function addToCart(
  lines: { merchandiseId: string; quantity: number }[]
): Promise<Cart> {
  await delay();
  // This will be handled by client-side cart management
  const cart = await getCart();
  return cart!;
}

export async function removeFromCart(lineIds: string[]): Promise<Cart> {
  await delay();
  // This will be handled by client-side cart management
  const cart = await getCart();
  return cart!;
}

export async function updateCart(
  lines: { id: string; merchandiseId: string; quantity: number }[]
): Promise<Cart> {
  await delay();
  // This will be handled by client-side cart management
  const cart = await getCart();
  return cart!;
}

export async function getCart(): Promise<Cart | undefined> {
  await delay();
  // Cart is managed client-side, return empty cart
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

export async function getCollection(
  handle: string
): Promise<Collection | undefined> {
  await delay();

  const collection = collectionsData.find((c) => c.handle === handle);

  if (!collection) {
    return undefined;
  }

  return {
    ...collection,
    path: `/search/${collection.handle}`,
  };
}

export async function getCollectionProducts({
  collection,
  reverse,
  sortKey,
}: {
  collection: string;
  reverse?: boolean;
  sortKey?: string;
}): Promise<Product[]> {
  await delay();

  const col = collectionsData.find((c) => c.handle === collection);

  if (!col) {
    return [];
  }

  let products = productsData
    .filter((p) => col.productHandles.includes(p.handle))
    .filter((p) => !p.tags.includes(HIDDEN_PRODUCT_TAG)) as Product[];

  // Apply sorting
  if (sortKey === "PRICE") {
    products.sort((a, b) => {
      const priceA = parseFloat(a.priceRange.minVariantPrice.amount);
      const priceB = parseFloat(b.priceRange.minVariantPrice.amount);
      return reverse ? priceB - priceA : priceA - priceB;
    });
  } else if (sortKey === "CREATED_AT" || sortKey === "CREATED") {
    products.sort((a, b) => {
      const dateA = new Date(a.updatedAt).getTime();
      const dateB = new Date(b.updatedAt).getTime();
      return reverse ? dateB - dateA : dateA - dateB;
    });
  }

  return products;
}

export async function getCollections(): Promise<Collection[]> {
  await delay();

  return [
    {
      handle: "",
      title: "All",
      description: "All products",
      seo: {
        title: "All",
        description: "All products",
      },
      path: "/search",
      updatedAt: new Date().toISOString(),
    },
    ...collectionsData
      .filter((collection) => !collection.handle.startsWith("hidden"))
      .map((collection) => ({
        ...collection,
        path: `/search/${collection.handle}`,
      })),
  ];
}

export async function getMenu(handle: string): Promise<Menu[]> {
  await delay();

  const menu = menusData[handle as keyof typeof menusData];

  if (!menu) {
    return [];
  }

  return menu;
}

export async function getPage(handle: string): Promise<Page> {
  await delay();

  const page = pagesData.find((p) => p.handle === handle);

  if (!page) {
    throw new Error(`Page not found: ${handle}`);
  }

  return page;
}

export async function getPages(): Promise<Page[]> {
  await delay();
  return pagesData;
}

export async function getProduct(handle: string): Promise<Product | undefined> {
  await delay();

  const product = productsData.find((p) => p.handle === handle);

  if (!product) {
    return undefined;
  }

  return product as Product;
}

export async function getProductRecommendations(
  productId: string
): Promise<Product[]> {
  await delay();

  // Return random products as recommendations (excluding the current product)
  const recommendations = productsData
    .filter((p) => p.id !== productId && !p.tags.includes(HIDDEN_PRODUCT_TAG))
    .slice(0, 3) as Product[];

  return recommendations;
}

export async function getProducts({
  query,
  reverse,
  sortKey,
}: {
  query?: string;
  reverse?: boolean;
  sortKey?: string;
}): Promise<Product[]> {
  await delay();

  let products = productsData.filter(
    (p) => !p.tags.includes(HIDDEN_PRODUCT_TAG)
  ) as Product[];

  // Apply search query
  if (query) {
    const lowerQuery = query.toLowerCase();
    products = products.filter(
      (p) =>
        p.title.toLowerCase().includes(lowerQuery) ||
        p.description.toLowerCase().includes(lowerQuery) ||
        p.tags.some((tag: string) => tag.toLowerCase().includes(lowerQuery))
    );
  }

  // Apply sorting
  if (sortKey === "PRICE") {
    products.sort((a, b) => {
      const priceA = parseFloat(a.priceRange.minVariantPrice.amount);
      const priceB = parseFloat(b.priceRange.minVariantPrice.amount);
      return reverse ? priceB - priceA : priceA - priceB;
    });
  } else if (sortKey === "CREATED_AT") {
    products.sort((a, b) => {
      const dateA = new Date(a.updatedAt).getTime();
      const dateB = new Date(b.updatedAt).getTime();
      return reverse ? dateB - dateA : dateA - dateB;
    });
  } else if (sortKey === "BEST_SELLING") {
    // For demo purposes, show featured products first
    products.sort((a, b) => {
      const aFeatured = a.tags.includes("featured") ? 1 : 0;
      const bFeatured = b.tags.includes("featured") ? 1 : 0;
      return reverse ? aFeatured - bFeatured : bFeatured - aFeatured;
    });
  }

  return products;
}

// Revalidate function is not needed for static data
export async function revalidate(): Promise<any> {
  return { status: 200 };
}
