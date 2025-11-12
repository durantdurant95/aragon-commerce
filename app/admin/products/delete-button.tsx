"use client";

export function DeleteButton({
  productId,
  productName,
}: {
  productId: string;
  productName: string;
}) {
  return (
    <form
      action={async (formData: FormData) => {
        if (confirm(`Are you sure you want to delete "${productName}"?`)) {
          // The form will submit to the server action
        } else {
          return;
        }
      }}
      className="inline"
    >
      <input type="hidden" name="id" value={productId} />
      <button type="submit" className="text-red-600 hover:underline">
        Delete
      </button>
    </form>
  );
}
