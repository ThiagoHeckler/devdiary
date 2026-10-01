import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PostCard } from "@/components/blog/post-card";
import { Container } from "@/components/container";
import { getPosts } from "@/lib/posts";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Estudos, tutoriais e bastidores dos projetos: desenvolvimento web, automações e IA na prática.",
  alternates: { canonical: "/blog" },
};

function firstValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function blogHref(page: number, tag?: string) {
  const params = new URLSearchParams();
  if (tag) params.set("tag", tag);
  if (page > 1) params.set("page", String(page));
  const query = params.toString();
  return query ? `/blog?${query}` : "/blog";
}

export default async function BlogPage({ searchParams }: PageProps<"/blog">) {
  const query = await searchParams;
  const tag = firstValue(query.tag);
  const page = Number(firstValue(query.page) ?? 1);

  if (!Number.isInteger(page) || page < 1) notFound();
  if (tag !== undefined && !/^[a-z0-9-]{1,50}$/.test(tag)) notFound();

  const { items, totalPages } = await getPosts({ page, tag });
  if (page > 1 && page > totalPages) notFound();

  return (
    <Container className="py-16 sm:py-20">
      <header className="max-w-2xl">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Blog</h1>
        <p className="mt-4 text-lg text-muted">
          Estudos, tutoriais e bastidores dos projetos.
        </p>
      </header>

      {tag && (
        <p className="mt-8 flex flex-wrap items-center gap-3 text-sm">
          <span>
            Posts com a tag{" "}
            <span className="rounded-full bg-accent-soft px-3 py-1 font-mono">#{tag}</span>
          </span>
          <Link href="/blog" className="text-accent hover:text-accent-hover">
            Ver todos
          </Link>
        </p>
      )}

      {items.length === 0 ? (
        <p className="mt-12 text-muted">
          {tag ? "Nenhum post com essa tag ainda." : "Nenhum post publicado ainda. Volte em breve!"}
        </p>
      ) : (
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {items.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <nav aria-label="Paginação" className="mt-12 flex items-center justify-between text-sm">
          {page > 1 ? (
            <Link href={blogHref(page - 1, tag)} className="font-medium text-accent hover:text-accent-hover">
              ← Mais recentes
            </Link>
          ) : (
            <span />
          )}
          <span className="text-muted">
            Página {page} de {totalPages}
          </span>
          {page < totalPages ? (
            <Link href={blogHref(page + 1, tag)} className="font-medium text-accent hover:text-accent-hover">
              Mais antigos →
            </Link>
          ) : (
            <span />
          )}
        </nav>
      )}
    </Container>
  );
}
