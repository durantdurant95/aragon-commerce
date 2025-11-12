import { ProductGrid } from "@/components/product-grid";
import { Button } from "@/components/ui/button";
import { getProducts } from "@/lib/dal/products";
import Footer from "components/layout/footer";
import Link from "next/link";

export const metadata = {
  description: "Product management and display system built with Next.js.",
  openGraph: {
    type: "website",
  },
};

export default async function HomePage() {
  const products = await getProducts();

  return (
    <>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <div className="flex items-center justify-between mb-6">
            <div className="flex-1" />
            <Button asChild variant="outline">
              <Link href="/admin">
                <svg
                  className="mr-2 h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                Manage Products
              </Link>
            </Button>
          </div>

          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Our Products
          </h1>
          <p className="mt-4 text-xl text-muted-foreground">
            Discover our curated collection of quality products
          </p>

          {products.length > 0 && (
            <p className="mt-2 text-sm text-muted-foreground">
              Showing {products.length} product
              {products.length === 1 ? "" : "s"}
            </p>
          )}
        </div>

        <ProductGrid products={products} />
      </div>
      <Footer />
    </>
  );
}
