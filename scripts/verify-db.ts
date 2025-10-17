import { prisma } from "../lib/prisma";

async function main() {
  const productCount = await prisma.product.count();
  const collectionCount = await prisma.collection.count();
  const menuCount = await prisma.menu.count();
  const pageCount = await prisma.page.count();

  console.log("📊 Database Statistics:");
  console.log(`✅ Products: ${productCount}`);
  console.log(`✅ Collections: ${collectionCount}`);
  console.log(`✅ Menus: ${menuCount}`);
  console.log(`✅ Pages: ${pageCount}`);

  console.log("\n🏠 Homepage Collections:");

  // Check carousel collection
  const carouselCollection = await prisma.collection.findUnique({
    where: { handle: "hidden-homepage-carousel" },
  });
  console.log(
    `\nCarousel Collection: ${carouselCollection ? "✅ Found" : "❌ Not Found"}`
  );
  if (carouselCollection) {
    const carouselProducts = await prisma.collectionProduct.findMany({
      where: { collectionId: carouselCollection.id },
    });
    console.log(`  - Products linked: ${carouselProducts.length}`);
    console.log(
      `  - Product handles:`,
      carouselProducts.map((p) => p.productHandle)
    );
  }

  // Check featured items collection
  const featuredCollection = await prisma.collection.findUnique({
    where: { handle: "hidden-homepage-featured-items" },
  });
  console.log(
    `\nFeatured Items Collection: ${featuredCollection ? "✅ Found" : "❌ Not Found"}`
  );
  if (featuredCollection) {
    const featuredProducts = await prisma.collectionProduct.findMany({
      where: { collectionId: featuredCollection.id },
    });
    console.log(`  - Products linked: ${featuredProducts.length}`);
    console.log(
      `  - Product handles:`,
      featuredProducts.map((p) => p.productHandle)
    );
  }

  console.log("\n📦 All Collections:");
  const allCollections = await prisma.collection.findMany({
    select: { handle: true, title: true },
  });
  allCollections.forEach((c) => console.log(`  - ${c.handle}: ${c.title}`));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
