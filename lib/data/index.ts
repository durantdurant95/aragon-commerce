import { HIDDEN_PRODUCT_TAG } from "lib/constants";
import { prisma } from "lib/prisma";
import { Cart, Collection, Menu, Page, Product } from "lib/types";

// Helper to transform database product to frontend Product type
function transformProduct(dbProduct: any): Product {
  return {
    id: dbProduct.id,
    handle: dbProduct.handle,
    availableForSale: dbProduct.availableForSale,
    title: dbProduct.title,
    description: dbProduct.description,
    descriptionHtml: dbProduct.descriptionHtml,
    options:
      dbProduct.options?.map((opt: any) => ({
        id: opt.id,
        name: opt.name,
        values: opt.values,
      })) || [],
    priceRange: {
      maxVariantPrice: {
        amount: dbProduct.priceMax.toString(),
        currencyCode: dbProduct.currencyCode,
      },
      minVariantPrice: {
        amount: dbProduct.priceMin.toString(),
        currencyCode: dbProduct.currencyCode,
      },
    },
    variants:
      dbProduct.variants?.map((v: any) => ({
        id: v.id,
        title: v.title,
        availableForSale: v.availableForSale,
        selectedOptions: [],
        price: {
          amount: v.price.toString(),
          currencyCode: v.currencyCode,
        },
      })) || [],
    featuredImage: {
      url: dbProduct.featuredImageUrl,
      altText: dbProduct.featuredImageAlt,
      width: 800,
      height: 800,
    },
    images:
      dbProduct.images?.map((img: any) => ({
        url: img.url,
        altText: img.altText,
        width: img.width,
        height: img.height,
      })) || [],
    seo: {
      title: dbProduct.seoTitle,
      description: dbProduct.seoDescription,
    },
    tags: dbProduct.tags || [],
    updatedAt: dbProduct.updatedAt.toISOString(),
  };
}

// Cart operations will be handled client-side with localStorage
export async function createCart(): Promise<Cart> {
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
  // This will be handled by client-side cart management
  const cart = await getCart();
  return cart!;
}

export async function removeFromCart(lineIds: string[]): Promise<Cart> {
  // This will be handled by client-side cart management
  const cart = await getCart();
  return cart!;
}

export async function updateCart(
  lines: { id: string; merchandiseId: string; quantity: number }[]
): Promise<Cart> {
  // This will be handled by client-side cart management
  const cart = await getCart();
  return cart!;
}

export async function getCart(): Promise<Cart | undefined> {
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
  const collection = await prisma.collection.findUnique({
    where: { handle },
  });

  if (!collection) {
    return undefined;
  }

  return {
    handle: collection.handle,
    title: collection.title,
    description: collection.description,
    seo: {
      title: collection.seoTitle,
      description: collection.seoDescription,
    },
    path: `/search/${collection.handle}`,
    updatedAt: collection.updatedAt.toISOString(),
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
  // First, get the collection by handle to get its ID
  const collectionData = await prisma.collection.findUnique({
    where: { handle: collection },
    select: { id: true },
  });

  if (!collectionData) {
    return [];
  }

  // Get product handles from the collection
  const collectionProducts = await prisma.collectionProduct.findMany({
    where: { collectionId: collectionData.id },
    select: { productHandle: true },
  });

  if (collectionProducts.length === 0) {
    return [];
  }

  const productHandles = collectionProducts.map(
    (cp: { productHandle: string }) => cp.productHandle
  );

  // Build the query
  const where: any = {
    handle: { in: productHandles },
    NOT: {
      tags: { has: HIDDEN_PRODUCT_TAG },
    },
  };

  // Determine order by
  let orderBy: any = {};
  if (sortKey === "PRICE") {
    orderBy = { priceMin: reverse ? "desc" : "asc" };
  } else if (sortKey === "CREATED_AT" || sortKey === "CREATED") {
    orderBy = { createdAt: reverse ? "desc" : "asc" };
  } else {
    orderBy = { updatedAt: "desc" };
  }

  const dbProducts = await prisma.product.findMany({
    where,
    include: {
      variants: true,
      images: { orderBy: { position: "asc" } },
      options: true,
    },
    orderBy,
  });

  return dbProducts.map(transformProduct);
}

export async function getCollections(): Promise<Collection[]> {
  const dbCollections = await prisma.collection.findMany({
    where: {
      NOT: {
        handle: { startsWith: "hidden" },
      },
    },
    orderBy: { updatedAt: "desc" },
  });

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
    ...dbCollections.map(
      (collection: {
        handle: string;
        title: string;
        description: string;
        seoTitle: string;
        seoDescription: string;
        updatedAt: Date;
      }) => ({
        handle: collection.handle,
        title: collection.title,
        description: collection.description,
        seo: {
          title: collection.seoTitle,
          description: collection.seoDescription,
        },
        path: `/search/${collection.handle}`,
        updatedAt: collection.updatedAt.toISOString(),
      })
    ),
  ];
}

export async function getMenu(handle: string): Promise<Menu[]> {
  const menu = await prisma.menu.findUnique({
    where: { handle },
    include: {
      items: {
        orderBy: { position: "asc" },
      },
    },
  });

  if (!menu) {
    return [];
  }

  return menu.items.map((item: { title: string; path: string }) => ({
    title: item.title,
    path: item.path,
  }));
}

export async function getPage(handle: string): Promise<Page> {
  const page = await prisma.page.findUnique({
    where: { handle },
  });

  if (!page) {
    throw new Error(`Page not found: ${handle}`);
  }

  return {
    id: page.id,
    title: page.title,
    handle: page.handle,
    body: page.body,
    bodySummary: page.bodySummary,
    seo: {
      title: page.seoTitle || page.title,
      description: page.seoDescription || page.bodySummary,
    },
    createdAt: page.createdAt.toISOString(),
    updatedAt: page.updatedAt.toISOString(),
  };
}

export async function getPages(): Promise<Page[]> {
  const dbPages = await prisma.page.findMany({
    orderBy: { updatedAt: "desc" },
  });

  return dbPages.map(
    (page: {
      id: string;
      title: string;
      handle: string;
      body: string;
      bodySummary: string;
      seoTitle: string | null;
      seoDescription: string | null;
      createdAt: Date;
      updatedAt: Date;
    }) => ({
      id: page.id,
      title: page.title,
      handle: page.handle,
      body: page.body,
      bodySummary: page.bodySummary,
      seo: {
        title: page.seoTitle || page.title,
        description: page.seoDescription || page.bodySummary,
      },
      createdAt: page.createdAt.toISOString(),
      updatedAt: page.updatedAt.toISOString(),
    })
  );
}

export async function getProduct(handle: string): Promise<Product | undefined> {
  const dbProduct = await prisma.product.findUnique({
    where: { handle },
    include: {
      variants: true,
      images: { orderBy: { position: "asc" } },
      options: true,
    },
  });

  if (!dbProduct) {
    return undefined;
  }

  return transformProduct(dbProduct);
}

export async function getProductRecommendations(
  productId: string
): Promise<Product[]> {
  // Get random products excluding the current one
  const dbProducts = await prisma.product.findMany({
    where: {
      id: { not: productId },
      NOT: {
        tags: { has: HIDDEN_PRODUCT_TAG },
      },
    },
    include: {
      variants: true,
      images: { orderBy: { position: "asc" } },
      options: true,
    },
    take: 3,
    orderBy: { updatedAt: "desc" },
  });

  return dbProducts.map(transformProduct);
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
  // Build the where clause
  const where: any = {
    NOT: {
      tags: { has: HIDDEN_PRODUCT_TAG },
    },
  };

  // Apply search query
  if (query) {
    where.OR = [
      { title: { contains: query, mode: "insensitive" } },
      { description: { contains: query, mode: "insensitive" } },
      { tags: { has: query.toLowerCase() } },
    ];
  }

  // Determine order by
  let orderBy: any = {};
  if (sortKey === "PRICE") {
    orderBy = { priceMin: reverse ? "desc" : "asc" };
  } else if (sortKey === "CREATED_AT") {
    orderBy = { createdAt: reverse ? "desc" : "asc" };
  } else if (sortKey === "BEST_SELLING") {
    // For demo purposes, prioritize products with "featured" tag
    orderBy = { updatedAt: reverse ? "asc" : "desc" };
  } else {
    orderBy = { updatedAt: "desc" };
  }

  const dbProducts = await prisma.product.findMany({
    where,
    include: {
      variants: true,
      images: { orderBy: { position: "asc" } },
      options: true,
    },
    orderBy,
  });

  return dbProducts.map(transformProduct);
}

// Revalidate function is not needed for static data
export async function revalidate(): Promise<any> {
  return { status: 200 };
}
