import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DeletePostButton } from "@/components/admin/delete-post-button";
import { PostEditor } from "@/components/admin/post-editor";
import { successBoxClass } from "@/components/admin/styles";
import { ApiError, adminFetch } from "@/lib/admin-api";
import { formatDateTime, type AdminPost } from "@/lib/admin-types";

export const metadata: Metadata = {
  title: "Editar post",
};

async function getPost(id: string) {
  try {
    return await adminFetch<AdminPost>(`/admin/posts/${encodeURIComponent(id)}`);
  } catch (error) {
    // 400: o id nem é um UUID.
    if (error instanceof ApiError && (error.status === 404 || error.status === 400)) {
      notFound();
    }
    throw error;
  }
}

export default async function EditPostPage({
  params,
  searchParams,
}: PageProps<"/admin/posts/[id]">) {
  const [{ id }, { salvo }] = await Promise.all([params, searchParams]);
  const post = await getPost(id);
  const published = post.status === "published";
  const scheduled = published && !!post.publishedAt && new Date(post.publishedAt) > new Date();

  return (
    <>
      <Link href="/admin/posts" className="text-sm text-muted hover:text-foreground">
        ← Posts
      </Link>
      <div className="mt-4 flex flex-wrap items-baseline justify-between gap-4">
        <h1 className="text-2xl font-semibold tracking-tight">Editar post</h1>
        <p className="text-sm text-muted">
          {scheduled
            ? `Agendado para ${formatDateTime(post.publishedAt!)}`
            : published
              ? "Publicado"
              : "Rascunho"}
          {" · "}
          alterado em {formatDateTime(post.updatedAt)}
          {published && !scheduled && (
            <>
              {" · "}
              <Link href={`/blog/${post.slug}`} target="_blank" className="text-accent hover:text-accent-hover">
                Ver no site ↗
              </Link>
            </>
          )}
        </p>
      </div>

      {salvo && (
        <p role="status" className={`mt-6 ${successBoxClass}`}>
          {scheduled
            ? "Post salvo e agendado."
            : published
              ? "Post salvo e publicado."
              : "Rascunho salvo."}
        </p>
      )}

      <div className="mt-8">
        {/* A chave remonta o editor com os dados novos depois de salvar. */}
        <PostEditor key={post.updatedAt} post={post} />
      </div>

      <div className="mt-12 border-t border-border pt-6">
        <DeletePostButton id={post.id} title={post.title} />
      </div>
    </>
  );
}
