import Link from "next/link";
import { Suspense } from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-neutral-50">
      <nav className="border-b border-neutral-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between">
            <div className="flex">
              <div className="flex flex-shrink-0 items-center">
                <Link href="/admin" className="text-xl font-bold text-black">
                  Admin Dashboard
                </Link>
              </div>
              <div className="ml-6 flex space-x-8">
                <Link
                  href="/admin"
                  className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-neutral-500 hover:border-neutral-300 hover:text-neutral-700"
                >
                  Overview
                </Link>
                <Link
                  href="/admin/products"
                  className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-neutral-500 hover:border-neutral-300 hover:text-neutral-700"
                >
                  Products
                </Link>
                <Link
                  href="/admin/collections"
                  className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-neutral-500 hover:border-neutral-300 hover:text-neutral-700"
                >
                  Collections
                </Link>
              </div>
            </div>
            <div className="flex items-center">
              <Link
                href="/"
                className="text-sm font-medium text-neutral-600 hover:text-neutral-900"
              >
                ← Back to Store
              </Link>
            </div>
          </div>
        </div>
      </nav>
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
      </main>
    </div>
  );
}
