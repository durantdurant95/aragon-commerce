import { deleteProduct, getProducts } from "lib/dal/products";
import { revalidatePath } from "next/cache";
import Link from "next/link";

export const metadata = {
  title: "Products Management",
  description: "Manage your products",
};

async function handleDelete(formData: FormData) {
  "use server";

  const id = formData.get("id") as string;
  await deleteProduct(id);
  revalidatePath("/admin/products");
}

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-black">Products</h1>
        <Link
          href="/admin/products/new"
          className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800"
        >
          New Product
        </Link>
      </div>

      <div className="rounded-lg border border-neutral-200 bg-white">
        {products.length === 0 ? (
          <div className="p-8 text-center text-neutral-500">
            No products yet. Create your first one!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-neutral-200 bg-neutral-50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-neutral-900">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-neutral-900">
                    Handle
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-neutral-900">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-neutral-900">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-neutral-900">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-neutral-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        {product.featuredImageUrl && (
                          <img
                            src={product.featuredImageUrl}
                            alt={product.title}
                            className="mr-3 h-10 w-10 rounded object-cover"
                          />
                        )}
                        <div>
                          <div className="text-sm font-medium text-neutral-900">
                            {product.title}
                          </div>
                          <div className="text-sm text-neutral-500">
                            {product.tags.slice(0, 2).join(", ")}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-neutral-600">
                      {product.handle}
                    </td>
                    <td className="px-6 py-4 text-sm text-neutral-900">
                      {product.currencyCode}{" "}
                      {parseFloat(product.priceMin.toString()).toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                          product.availableForSale
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {product.availableForSale ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right text-sm">
                      <Link
                        href={`/admin/products/${product.id}`}
                        className="mr-3 text-black hover:underline"
                      >
                        Edit
                      </Link>
                      <form action={handleDelete} className="inline">
                        <input type="hidden" name="id" value={product.id} />
                        <button
                          type="submit"
                          className="text-red-600 hover:underline"
                        >
                          Delete
                        </button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
