import { ProductGrid } from "@/components/product-grid";
import { getProducts } from "@/lib/dal/products";

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
    </>
  );
}
