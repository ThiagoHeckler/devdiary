import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Markdown } from "@/components/blog/markdown";
import { TagList } from "@/components/blog/tag-list";
import { Container } from "@/components/container";
import { siteConfig } from "@/lib/site";
import { formatDate, getPost } from "@/lib/posts";

// Nenhum post é gerado no build: cada um é gerado na primeira visita e
// atualizado em segundo plano (ISR), então o build não depende da API.
export function generateStaticParams() {
  return [];
}

export async function generateMetadata({
  params,
}: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.excerpt,
    keywords: post.tags,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      url: `/blog/${post.slug}`,
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: [siteConfig.author],
      tags: post.tags,
    },
  };
}

export default async function PostPage({ params }: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    keywords: post.tags.join(", "),
    url: new URL(`/blog/${post.slug}`, siteConfig.url).toString(),
    author: { "@type": "Person", name: siteConfig.author, url: siteConfig.github },
  };

  return (
    <Container className="py-16 sm:py-20">
      <script
        type="application/ld+json"
        // Escapa "<" para que o conteúdo do post não consiga fechar a tag <script>.
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <article className="mx-auto max-w-3xl">
        <Link href="/blog" className="text-sm text-muted hover:text-foreground">
          ← Voltar para o blog
        </Link>
        <header className="mt-8 border-b border-border pb-8">
          <time dateTime={post.publishedAt} className="text-sm text-muted">
            {formatDate(post.publishedAt)}
          </time>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            {post.title}
          </h1>
          <p className="mt-4 text-lg text-muted">{post.excerpt}</p>
          <TagList tags={post.tags} className="mt-6" />
        </header>
        <div className="mt-10">
          <Markdown content={post.content} />
        </div>
        <aside className="mt-16 rounded-2xl border border-border bg-surface p-6 sm:p-8">
          <h2 className="text-lg font-semibold">Precisa de algo parecido no seu negócio?</h2>
          <p className="mt-2 text-muted">
            Conte o que você precisa e eu respondo com os próximos passos.
          </p>
          <Link
            href="/contato"
            className="mt-6 inline-block rounded-full bg-accent px-5 py-2.5 font-medium text-accent-foreground transition-colors hover:bg-accent-hover"
          >
            Fale comigo
          </Link>
        </aside>
      </article>
    </Container>
  );
}
