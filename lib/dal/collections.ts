"use server";

import { prisma } from "lib/prisma";
import { revalidatePath } from "next/cache";

export type Collection = {
  id: string;
  handle: string;
  title: string;
  description: string;
  seoTitle: string;
  seoDescription: string;
  createdAt: Date;
  updatedAt: Date;
};

export type CollectionInput = {
  handle: string;
  title: string;
  description?: string;
  seoTitle?: string;
  seoDescription?: string;
};

export async function getCollections(): Promise<Collection[]> {
  try {
    const collections = await prisma.collection.findMany({
      orderBy: { updatedAt: "desc" },
    });
    return collections;
  } catch (error) {
    console.error("Error fetching collections:", error);
    throw new Error("Failed to fetch collections");
  }
}

export async function getCollectionById(
  id: string
): Promise<Collection | null> {
  try {
    const collection = await prisma.collection.findUnique({
      where: { id },
    });
    return collection;
  } catch (error) {
    console.error("Error fetching collection:", error);
    throw new Error("Failed to fetch collection");
  }
}

export async function createCollection(
  data: CollectionInput
): Promise<Collection> {
  try {
    const collection = await prisma.collection.create({
      data: {
        handle: data.handle,
        title: data.title,
        description: data.description || "",
        seoTitle: data.seoTitle || data.title,
        seoDescription: data.seoDescription || data.description || "",
      },
    });

    revalidatePath("/admin/collections");
    revalidatePath("/search");

    return collection;
  } catch (error: any) {
    console.error("Error creating collection:", error);

    if (error.code === "P2002") {
      throw new Error("A collection with this handle already exists");
    }

    throw new Error("Failed to create collection");
  }
}

export async function updateCollection(
  id: string,
  data: CollectionInput
): Promise<Collection> {
  try {
    const collection = await prisma.collection.update({
      where: { id },
      data: {
        handle: data.handle,
        title: data.title,
        description: data.description || "",
        seoTitle: data.seoTitle || data.title,
        seoDescription: data.seoDescription || data.description || "",
      },
    });

    revalidatePath("/admin/collections");
    revalidatePath("/search");
    revalidatePath(`/search/${data.handle}`);

    return collection;
  } catch (error: any) {
    console.error("Error updating collection:", error);

    if (error.code === "P2025") {
      throw new Error("Collection not found");
    }

    if (error.code === "P2002") {
      throw new Error("A collection with this handle already exists");
    }

    throw new Error("Failed to update collection");
  }
}

export async function deleteCollection(id: string): Promise<void> {
  try {
    await prisma.collection.delete({
      where: { id },
    });

    revalidatePath("/admin/collections");
    revalidatePath("/search");
  } catch (error: any) {
    console.error("Error deleting collection:", error);

    if (error.code === "P2025") {
      throw new Error("Collection not found");
    }

    throw new Error("Failed to delete collection");
  }
}
