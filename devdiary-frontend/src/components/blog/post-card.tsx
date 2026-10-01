import Link from "next/link";
import { formatDate, type PostSummary } from "@/lib/posts";
import { TagList } from "@/components/blog/tag-list";

export function PostCard({ post }: { post: PostSummary }) {
  return (
    <article className="group relative rounded-2xl border border-border bg-surface p-6 transition-colors hover:border-accent">
      <time dateTime={post.publishedAt} className="text-sm text-muted">
        {formatDate(post.publishedAt)}
      </time>
      <h2 className="mt-2 text-xl font-semibold tracking-tight group-hover:text-accent">
        <Link href={`/blog/${post.slug}`}>
          {/* Faz o card inteiro ser clicável sem aninhar links */}
          <span className="absolute inset-0 rounded-2xl" aria-hidden="true" />
          {post.title}
        </Link>
      </h2>
      <p className="mt-2 text-muted">{post.excerpt}</p>
      <TagList tags={post.tags} className="relative mt-4" />
    </article>
  );
}
