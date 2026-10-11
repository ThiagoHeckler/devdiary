import type { Metadata } from "next";
import Link from "next/link";
import {
  AdminPagination,
  StatusFilter,
  parsePage,
  parseStatus,
} from "@/components/admin/pagination";
import { primaryButtonClass, successBoxClass } from "@/components/admin/styles";
import { adminFetch } from "@/lib/admin-api";
import {
  formatDateTime,
  postStatusLabels,
  type AdminPostSummary,
  type PostStatus,
} from "@/lib/admin-types";
import type { Paginated } from "@/lib/posts";

export const metadata: Metadata = {
  title: "Posts",
};

const statuses = ["draft", "published"] as const;

function StatusBadge({ post }: { post: AdminPostSummary }) {
  const scheduled =
    post.status === "published" && post.publishedAt && new Date(post.publishedAt) > new Date();
  return (
    <span
      className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
        post.status === "published" && !scheduled
          ? "bg-accent-soft text-foreground"
          : "border border-border text-muted"
      }`}
    >
      {scheduled ? "Agendado" : postStatusLabels[post.status]}
    </span>
  );
}

export default async function AdminPostsPage({ searchParams }: PageProps<"/admin/posts">) {
  const query = await searchParams;
  const page = parsePage(query.page);
  const status = parseStatus<PostStatus>(query.status, statuses);

  const params = new URLSearchParams({ page: String(page), limit: "20" });
  if (status) params.set("status", status);
  const { items, totalPages } = await adminFetch<Paginated<AdminPostSummary>>(
    `/admin/posts?${params}`,
  );

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold tracking-tight">Posts</h1>
        <Link href="/admin/posts/novo" className={primaryButtonClass}>
          Novo post
        </Link>
      </div>

      {query.apagado && (
        <p role="status" className={`mt-6 ${successBoxClass}`}>
          Post apagado.
        </p>
      )}

      <div className="mt-6">
        <StatusFilter
          basePath="/admin/posts"
          current={status}
          options={[
            { label: "Todos" },
            { value: "draft", label: "Rascunhos" },
            { value: "published", label: "Publicados" },
          ]}
        />
      </div>

      {items.length === 0 ? (
        <p className="mt-10 text-muted">Nenhum post por aqui.</p>
      ) : (
        <ul className="mt-6 divide-y divide-border rounded-2xl border border-border bg-surface">
          {items.map((post) => (
            <li key={post.id} className="flex flex-col gap-2 p-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
              <div className="min-w-0">
                <Link
                  href={`/admin/posts/${post.id}`}
                  className="font-medium hover:text-accent"
                >
                  {post.title}
                </Link>
                <p className="mt-1 truncate font-mono text-xs text-muted">/blog/{post.slug}</p>
              </div>
              <div className="flex shrink-0 items-center gap-4 text-sm text-muted">
                <StatusBadge post={post} />
                <span title="Última alteração">{formatDateTime(post.updatedAt)}</span>
                {post.status === "published" && (
                  <Link href={`/blog/${post.slug}`} target="_blank" className="hover:text-foreground">
                    Ver ↗
                  </Link>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      <AdminPagination
        basePath="/admin/posts"
        page={page}
        totalPages={totalPages}
        params={{ status }}
      />
    </>
  );
}
