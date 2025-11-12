import { deleteCollection, getCollections } from "lib/dal/collections";
import { revalidatePath } from "next/cache";
import Link from "next/link";

export const metadata = {
  title: "Collections Management",
  description: "Manage your collections",
};

async function handleDelete(formData: FormData) {
  "use server";

  const id = formData.get("id") as string;
  await deleteCollection(id);
  revalidatePath("/admin/collections");
}

export default async function CollectionsPage() {
  const collections = await getCollections();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-black">Collections</h1>
        <Link
          href="/admin/collections/new"
          className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800"
        >
          New Collection
        </Link>
      </div>

      <div className="rounded-lg border border-neutral-200 bg-white">
        {collections.length === 0 ? (
          <div className="p-8 text-center text-neutral-500">
            No collections yet. Create your first one!
          </div>
        ) : (
          <table className="w-full">
            <thead className="border-b border-neutral-200 bg-neutral-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-neutral-900">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-neutral-900">
                  Handle
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-neutral-900">
                  Description
                </th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-neutral-900">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {collections.map((collection) => (
                <tr key={collection.id} className="hover:bg-neutral-50">
                  <td className="px-6 py-4 text-sm font-medium text-neutral-900">
                    {collection.title}
                  </td>
                  <td className="px-6 py-4 text-sm text-neutral-600">
                    {collection.handle}
                  </td>
                  <td className="px-6 py-4 text-sm text-neutral-600">
                    {collection.description.substring(0, 60)}
                    {collection.description.length > 60 ? "..." : ""}
                  </td>
                  <td className="px-6 py-4 text-right text-sm">
                    <Link
                      href={`/admin/collections/${collection.id}`}
                      className="mr-3 text-black hover:underline"
                    >
                      Edit
                    </Link>
                    <form action={handleDelete} className="inline">
                      <input type="hidden" name="id" value={collection.id} />
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
        )}
      </div>
    </div>
  );
}
