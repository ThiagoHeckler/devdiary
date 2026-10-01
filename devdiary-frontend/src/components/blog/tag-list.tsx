import Link from "next/link";

export function TagList({
  tags,
  className = "",
}: {
  tags: string[];
  className?: string;
}) {
  if (tags.length === 0) return null;

  return (
    <ul className={`flex flex-wrap gap-2 ${className}`}>
      {tags.map((tag) => (
        <li key={tag}>
          <Link
            href={`/blog?tag=${encodeURIComponent(tag)}`}
            className="rounded-full bg-accent-soft px-3 py-1 font-mono text-xs text-foreground hover:underline"
          >
            #{tag}
          </Link>
        </li>
      ))}
    </ul>
  );
}
