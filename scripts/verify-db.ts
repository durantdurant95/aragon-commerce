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

  console.log("\n📦 Sample Product:");
  const product = await prisma.product.findFirst({
    include: {
      variants: true,
      images: true,
    },
  });
  console.log(JSON.stringify(product, null, 2));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
