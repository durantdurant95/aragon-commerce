"use server";

import { Decimal } from "@prisma/client/runtime/library";
import { prisma } from "lib/prisma";
import { revalidatePath } from "next/cache";

export type ProductVariant = {
  id: string;
  title: string;
  price: Decimal;
  currencyCode: string;
  availableForSale: boolean;
};

export type ProductImage = {
  id: string;
  url: string;
  altText: string;
  width: number;
  height: number;
  position: number;
};

export type ProductOption = {
  id: string;
  name: string;
  values: string[];
};

export type Product = {
  id: string;
  handle: string;
  title: string;
  description: string;
  descriptionHtml: string;
  priceMin: Decimal;
  priceMax: Decimal;
  currencyCode: string;
  availableForSale: boolean;
  featuredImageUrl: string;
  featuredImageAlt: string;
  seoTitle: string;
  seoDescription: string;
  tags: string[];
  variants: ProductVariant[];
  images: ProductImage[];
  options: ProductOption[];
  createdAt: Date;
  updatedAt: Date;
};

export type ProductInput = {
  handle: string;
  title: string;
  description?: string;
  descriptionHtml?: string;
  price: number;
  currencyCode?: string;
  availableForSale?: boolean;
  featuredImageUrl?: string;
  featuredImageAlt?: string;
  seoTitle?: string;
  seoDescription?: string;
  tags?: string[];
  variants?: Array<{
    title: string;
    price: number;
    currencyCode?: string;
    availableForSale?: boolean;
  }>;
  images?: Array<{
    url: string;
    altText?: string;
    width?: number;
    height?: number;
  }>;
  options?: Array<{
    name: string;
    values: string[];
  }>;
};

export async function getProducts(searchTerm?: string): Promise<Product[]> {
  try {
    const where: any = {};

    if (searchTerm) {
      where.OR = [
        { title: { contains: searchTerm, mode: "insensitive" } },
        { description: { contains: searchTerm, mode: "insensitive" } },
        { handle: { contains: searchTerm, mode: "insensitive" } },
      ];
    }

    const products = await prisma.product.findMany({
      where,
      include: {
        variants: true,
        images: {
          orderBy: { position: "asc" },
        },
        options: true,
      },
      orderBy: { updatedAt: "desc" },
    });

    return products;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw new Error("Failed to fetch products");
  }
}

export async function getProductById(id: string): Promise<Product | null> {
  try {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        variants: true,
        images: {
          orderBy: { position: "asc" },
        },
        options: true,
      },
    });

    return product;
  } catch (error) {
    console.error("Error fetching product:", error);
    throw new Error("Failed to fetch product");
  }
}

export async function createProduct(data: ProductInput): Promise<Product> {
  try {
    const product = await prisma.product.create({
      data: {
        id: `gid://shopify/Product/${Date.now()}`,
        handle: data.handle,
        title: data.title,
        description: data.description || "",
        descriptionHtml: data.descriptionHtml || data.description || "",
        priceMin: data.price,
        priceMax: data.price,
        currencyCode: data.currencyCode || "USD",
        availableForSale: data.availableForSale ?? true,
        featuredImageUrl: data.featuredImageUrl || "",
        featuredImageAlt: data.featuredImageAlt || data.title,
        seoTitle: data.seoTitle || data.title,
        seoDescription: data.seoDescription || data.description || "",
        tags: data.tags || [],
        variants: {
          create:
            data.variants?.map((v) => ({
              id: `gid://shopify/ProductVariant/${Date.now()}-${Math.random()}`,
              title: v.title || "Default",
              price: v.price || data.price,
              currencyCode: v.currencyCode || data.currencyCode || "USD",
              availableForSale: v.availableForSale ?? true,
            })) || [],
        },
        images: {
          create:
            data.images?.map((img, index) => ({
              url: img.url,
              altText: img.altText || data.title,
              width: img.width || 800,
              height: img.height || 800,
              position: index,
            })) || [],
        },
        options: {
          create:
            data.options?.map((opt) => ({
              name: opt.name,
              values: opt.values || [],
            })) || [],
        },
      },
      include: {
        variants: true,
        images: true,
        options: true,
      },
    });

    revalidatePath("/admin/products");
    revalidatePath("/search");
    revalidatePath("/");

    return product;
  } catch (error: any) {
    console.error("Error creating product:", error);

    if (error.code === "P2002") {
      throw new Error("A product with this handle already exists");
    }

    throw new Error("Failed to create product");
  }
}

export async function updateProduct(
  id: string,
  data: Partial<ProductInput>
): Promise<Product> {
  try {
    const updateData: any = {};

    if (data.handle !== undefined) updateData.handle = data.handle;
    if (data.title !== undefined) updateData.title = data.title;
    if (data.description !== undefined)
      updateData.description = data.description;
    if (data.descriptionHtml !== undefined)
      updateData.descriptionHtml = data.descriptionHtml;
    if (data.price !== undefined) {
      updateData.priceMin = data.price;
      updateData.priceMax = data.price;
    }
    if (data.currencyCode !== undefined)
      updateData.currencyCode = data.currencyCode;
    if (data.availableForSale !== undefined)
      updateData.availableForSale = data.availableForSale;
    if (data.featuredImageUrl !== undefined)
      updateData.featuredImageUrl = data.featuredImageUrl;
    if (data.featuredImageAlt !== undefined)
      updateData.featuredImageAlt = data.featuredImageAlt;
    if (data.seoTitle !== undefined) updateData.seoTitle = data.seoTitle;
    if (data.seoDescription !== undefined)
      updateData.seoDescription = data.seoDescription;
    if (data.tags !== undefined) updateData.tags = data.tags;

    const product = await prisma.product.update({
      where: { id },
      data: updateData,
      include: {
        variants: true,
        images: true,
        options: true,
      },
    });

    revalidatePath("/admin/products");
    revalidatePath("/search");
    revalidatePath("/");
    revalidatePath(`/product/${data.handle}`);

    return product;
  } catch (error: any) {
    console.error("Error updating product:", error);

    if (error.code === "P2025") {
      throw new Error("Product not found");
    }

    if (error.code === "P2002") {
      throw new Error("A product with this handle already exists");
    }

    throw new Error("Failed to update product");
  }
}

export async function deleteProduct(id: string): Promise<void> {
  try {
    await prisma.product.delete({
      where: { id },
    });

    revalidatePath("/admin/products");
    revalidatePath("/search");
    revalidatePath("/");
  } catch (error: any) {
    console.error("Error deleting product:", error);

    if (error.code === "P2025") {
      throw new Error("Product not found");
    }

    throw new Error("Failed to delete product");
  }
}
