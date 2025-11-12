import { getCollectionById, updateCollection } from "lib/dal/collections";
import { notFound, redirect } from "next/navigation";

export const metadata = {
  title: "Edit Collection",
  description: "Edit collection details",
};

async function handleUpdate(formData: FormData) {
  "use server";

  const id = formData.get("id") as string;
  const data = {
    handle: formData.get("handle") as string,
    title: formData.get("title") as string,
    description: (formData.get("description") as string) || "",
    seoTitle:
      (formData.get("seoTitle") as string) || (formData.get("title") as string),
    seoDescription: (formData.get("seoDescription") as string) || "",
  };

  await updateCollection(id, data);
  redirect("/admin/collections");
}

export default async function EditCollectionPage({
  params,
}: {
  params: { id: string };
}) {
  const collection = await getCollectionById(params.id);

  if (!collection) {
    notFound();
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-black">Edit Collection</h1>
      </div>

      <form
        action={handleUpdate}
        className="rounded-lg border border-neutral-200 bg-white p-6"
      >
        <input type="hidden" name="id" value={collection.id} />

        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-neutral-700">
              Handle *
            </label>
            <input
              type="text"
              name="handle"
              required
              defaultValue={collection.handle}
              className="w-full rounded-lg border border-neutral-300 px-3 py-2 focus:border-black focus:outline-none"
              placeholder="summer-collection"
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
              defaultValue={collection.title}
              className="w-full rounded-lg border border-neutral-300 px-3 py-2 focus:border-black focus:outline-none"
              placeholder="Summer Collection"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-neutral-700">
              Description
            </label>
            <textarea
              name="description"
              rows={3}
              defaultValue={collection.description}
              className="w-full rounded-lg border border-neutral-300 px-3 py-2 focus:border-black focus:outline-none"
              placeholder="Collection description"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-neutral-700">
              SEO Title
            </label>
            <input
              type="text"
              name="seoTitle"
              defaultValue={collection.seoTitle}
              className="w-full rounded-lg border border-neutral-300 px-3 py-2 focus:border-black focus:outline-none"
              placeholder="SEO optimized title"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-neutral-700">
              SEO Description
            </label>
            <textarea
              name="seoDescription"
              rows={2}
              defaultValue={collection.seoDescription}
              className="w-full rounded-lg border border-neutral-300 px-3 py-2 focus:border-black focus:outline-none"
              placeholder="SEO meta description"
            />
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800"
            >
              Update Collection
            </button>
            <a
              href="/admin/collections"
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
