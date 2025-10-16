import { PrismaClient } from "@prisma/client";
import collectionsData from "../lib/data/collections.json";
import menusData from "../lib/data/menus.json";
import pagesData from "../lib/data/pages.json";
import productsData from "../lib/data/products.json";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seed...\n");

  // Clear existing data
  console.log("🧹 Clearing existing data...");
  await prisma.menuItem.deleteMany();
  await prisma.menu.deleteMany();
  await prisma.collectionProduct.deleteMany();
  await prisma.collection.deleteMany();
  await prisma.productOption.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.product.deleteMany();
  await prisma.page.deleteMany();
  console.log("✅ Cleared existing data\n");

  // Seed Products
  console.log("📦 Seeding products...");
  for (const product of productsData) {
    await prisma.product.create({
      data: {
        id: product.id,
        handle: product.handle,
        availableForSale: product.availableForSale,
        title: product.title,
        description: product.description,
        descriptionHtml: product.descriptionHtml,
        priceMin: product.priceRange.minVariantPrice.amount,
        priceMax: product.priceRange.maxVariantPrice.amount,
        currencyCode: product.priceRange.minVariantPrice.currencyCode,
        featuredImageUrl: product.featuredImage.url,
        featuredImageAlt: product.featuredImage.altText,
        seoTitle: product.seo.title,
        seoDescription: product.seo.description,
        tags: product.tags,
        variants: {
          create: product.variants.map((variant) => ({
            id: variant.id,
            title: variant.title,
            availableForSale: variant.availableForSale,
            price: variant.price.amount,
            currencyCode: variant.price.currencyCode,
          })),
        },
        images: {
          create: product.images.map((image, index) => ({
            url: image.url,
            altText: image.altText,
            width: image.width,
            height: image.height,
            position: index,
          })),
        },
        options: {
          create: product.options.map((option) => ({
            id: option.id,
            name: option.name,
            values: option.values,
          })),
        },
      },
    });
  }
  console.log(`✅ Seeded ${productsData.length} products\n`);

  // Seed Collections
  console.log("📂 Seeding collections...");
  for (const collection of collectionsData) {
    await prisma.collection.create({
      data: {
        handle: collection.handle,
        title: collection.title,
        description: collection.description,
        seoTitle: collection.seo.title,
        seoDescription: collection.seo.description,
        updatedAt: new Date(collection.updatedAt),
      },
    });
  }
  console.log(`✅ Seeded ${collectionsData.length} collections\n`);

  // Link products to collections
  console.log("🔗 Linking products to collections...");
  const collectionLinks = [
    { collection: "apparel", products: ["acme-tshirt", "acme-hoodie"] },
    {
      collection: "accessories",
      products: ["acme-drawstring-bag", "acme-cup", "acme-backpack"],
    },
    {
      collection: "hidden-homepage-featured-items",
      products: ["acme-drawstring-bag", "acme-cup", "acme-tshirt"],
    },
    {
      collection: "hidden-homepage-carousel",
      products: ["acme-cup", "acme-tshirt", "acme-hoodie"],
    },
  ];

  for (const link of collectionLinks) {
    const collection = await prisma.collection.findUnique({
      where: { handle: link.collection },
    });

    if (!collection) continue;

    for (const productHandle of link.products) {
      const product = await prisma.product.findUnique({
        where: { handle: productHandle },
      });

      if (product) {
        await prisma.collectionProduct.create({
          data: {
            collectionId: collection.id,
            productHandle: product.handle,
          },
        });
      }
    }
  }
  console.log("✅ Linked products to collections\n");

  // Seed Pages
  console.log("📄 Seeding pages...");
  for (const page of pagesData) {
    await prisma.page.create({
      data: {
        id: page.id,
        title: page.title,
        handle: page.handle,
        body: page.body,
        bodySummary: page.bodySummary,
        seoTitle: page.seo.title,
        seoDescription: page.seo.description,
        createdAt: new Date(page.createdAt),
        updatedAt: new Date(page.updatedAt),
      },
    });
  }
  console.log(`✅ Seeded ${pagesData.length} pages\n`);

  // Seed Menus
  console.log("🧭 Seeding menus...");
  const menuEntries = Object.entries(menusData);
  for (const [handle, items] of menuEntries) {
    await prisma.menu.create({
      data: {
        handle,
        items: {
          create: items.map(
            (item: { title: string; path: string }, index: number) => ({
              title: item.title,
              path: item.path,
              position: index,
            })
          ),
        },
      },
    });
  }
  console.log(`✅ Seeded ${menuEntries.length} menus\n`);

  console.log("🎉 Database seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
