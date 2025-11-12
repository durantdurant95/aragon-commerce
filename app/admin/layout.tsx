import { ModeToggle } from "@/components/mode-toggle";
import Link from "next/link";
import { Suspense } from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between">
            <div className="flex">
              <div className="flex flex-shrink-0 items-center">
                <Link
                  href="/admin"
                  className="text-xl font-bold text-foreground"
                >
                  Admin Dashboard
                </Link>
              </div>
              <div className="ml-6 flex space-x-8">
                <Link
                  href="/admin"
                  className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-muted-foreground hover:border-border hover:text-foreground"
                >
                  Overview
                </Link>
                <Link
                  href="/admin/products"
                  className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-muted-foreground hover:border-border hover:text-foreground"
                >
                  Products
                </Link>
                <Link
                  href="/admin/collections"
                  className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-muted-foreground hover:border-border hover:text-foreground"
                >
                  Collections
                </Link>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <ModeToggle />
              <Link
                href="/"
                className="text-sm font-medium text-muted-foreground hover:text-foreground"
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
