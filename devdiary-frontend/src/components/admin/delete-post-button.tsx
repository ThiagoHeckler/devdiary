"use client";

import { deletePost } from "@/app/admin/actions";

export function DeletePostButton({ id, title }: { id: string; title: string }) {
  return (
    <form
      action={deletePost}
      onSubmit={(event) => {
        if (!confirm(`Apagar "${title}"? Não dá para desfazer.`)) {
          event.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button type="submit" className="text-sm text-red-600 hover:underline dark:text-red-400">
        Apagar post
      </button>
    </form>
  );
}
