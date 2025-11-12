import { getProductById, updateProduct } from "lib/dal/products";
import { notFound, redirect } from "next/navigation";

export const metadata = {
  title: "Edit Product",
  description: "Edit product details",
};

async function handleUpdate(formData: FormData) {
  "use server";

  const id = formData.get("id") as string;
  const data = {
    handle: formData.get("handle") as string,
    title: formData.get("title") as string,
    description: (formData.get("description") as string) || "",
    descriptionHtml: (formData.get("description") as string) || "",
    price: parseFloat(formData.get("price") as string),
    currencyCode: (formData.get("currencyCode") as string) || "USD",
    availableForSale: formData.get("availableForSale") === "on",
    featuredImageUrl: (formData.get("featuredImageUrl") as string) || "",
    featuredImageAlt: (formData.get("title") as string) || "",
    seoTitle:
      (formData.get("seoTitle") as string) || (formData.get("title") as string),
    seoDescription: (formData.get("seoDescription") as string) || "",
    tags:
      (formData.get("tags") as string)
        ?.split(",")
        .map((t) => t.trim())
        .filter(Boolean) || [],
  };

  await updateProduct(id, data);
  redirect("/admin/products");
}

export default async function EditProductPage({
  params,
}: {
  params: { id: string };
}) {
  const product = await getProductById(params.id);

  if (!product) {
    notFound();
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-black">Edit Product</h1>
      </div>

      <form
        action={handleUpdate}
        className="rounded-lg border border-neutral-200 bg-white p-6"
      >
        <input type="hidden" name="id" value={product.id} />

        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-neutral-700">
                Handle *
              </label>
              <input
                type="text"
                name="handle"
                required
                defaultValue={product.handle}
                className="w-full rounded-lg border border-neutral-300 px-3 py-2 focus:border-black focus:outline-none"
                placeholder="product-handle"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-neutral-700">
                Title *
              </label>
              <input
                type="text"
                name="title"
                required
                defaultValue={product.title}
                className="w-full rounded-lg border border-neutral-300 px-3 py-2 focus:border-black focus:outline-none"
                placeholder="Product Title"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-neutral-700">
              Description
            </label>
            <textarea
              name="description"
              rows={3}
              defaultValue={product.description}
              className="w-full rounded-lg border border-neutral-300 px-3 py-2 focus:border-black focus:outline-none"
              placeholder="Product description"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-neutral-700">
                Price *
              </label>
              <input
                type="number"
                name="price"
                step="0.01"
                required
                defaultValue={product.priceMin.toString()}
                className="w-full rounded-lg border border-neutral-300 px-3 py-2 focus:border-black focus:outline-none"
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-neutral-700">
                Currency
              </label>
              <select
                name="currencyCode"
                defaultValue={product.currencyCode}
                className="w-full rounded-lg border border-neutral-300 px-3 py-2 focus:border-black focus:outline-none"
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
              </select>
            </div>

            <div className="flex items-end">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="availableForSale"
                  className="mr-2 h-4 w-4"
                  defaultChecked={product.availableForSale}
                />
                <span className="text-sm font-medium text-neutral-700">
                  Available for Sale
                </span>
              </label>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-neutral-700">
              Featured Image URL
            </label>
            <input
              type="url"
              name="featuredImageUrl"
              defaultValue={product.featuredImageUrl}
              className="w-full rounded-lg border border-neutral-300 px-3 py-2 focus:border-black focus:outline-none"
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-neutral-700">
              Tags (comma separated)
            </label>
            <input
              type="text"
              name="tags"
              defaultValue={product.tags.join(", ")}
              className="w-full rounded-lg border border-neutral-300 px-3 py-2 focus:border-black focus:outline-none"
              placeholder="summer, sale, featured"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-neutral-700">
                SEO Title
              </label>
              <input
                type="text"
                name="seoTitle"
                defaultValue={product.seoTitle}
                className="w-full rounded-lg border border-neutral-300 px-3 py-2 focus:border-black focus:outline-none"
                placeholder="SEO optimized title"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-neutral-700">
                SEO Description
              </label>
              <input
                type="text"
                name="seoDescription"
                defaultValue={product.seoDescription}
                className="w-full rounded-lg border border-neutral-300 px-3 py-2 focus:border-black focus:outline-none"
                placeholder="SEO meta description"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800"
            >
              Update Product
            </button>
            <a
              href="/admin/products"
              className="rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
            >
              Cancel
            </a>
          </div>
        </div>
      </form>
    </div>
  );
}
