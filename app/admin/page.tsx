import { prisma } from "lib/prisma";
import Link from "next/link";

export const metadata = {
  title: "Admin Dashboard",
  description: "Manage your store",
};

async function getStats() {
  const [productsCount, collectionsCount, pagesCount] = await Promise.all([
    prisma.product.count(),
    prisma.collection.count(),
    prisma.page.count(),
  ]);

  return {
    productsCount,
    collectionsCount,
    pagesCount,
  };
}

export default async function AdminPage() {
  const stats = await getStats();

  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold text-black">Dashboard Overview</h1>

      <div className="grid gap-6 md:grid-cols-3">
        <Link
          href="/admin/products"
          className="rounded-lg border border-neutral-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
        >
          <h2 className="mb-2 text-lg font-semibold text-neutral-900">
            Products
          </h2>
          <p className="text-3xl font-bold text-black">{stats.productsCount}</p>
          <p className="mt-2 text-sm text-neutral-600">
            Manage your product catalog
          </p>
        </Link>

        <Link
          href="/admin/collections"
          className="rounded-lg border border-neutral-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
        >
          <h2 className="mb-2 text-lg font-semibold text-neutral-900">
            Collections
          </h2>
          <p className="text-3xl font-bold text-black">
            {stats.collectionsCount}
          </p>
          <p className="mt-2 text-sm text-neutral-600">
            Organize products into collections
          </p>
        </Link>

        <div className="rounded-lg border border-neutral-200 bg-white p-6 shadow-sm">
          <h2 className="mb-2 text-lg font-semibold text-neutral-900">Pages</h2>
          <p className="text-3xl font-bold text-black">{stats.pagesCount}</p>
          <p className="mt-2 text-sm text-neutral-600">Content pages</p>
        </div>
      </div>
    </div>
  );
}
