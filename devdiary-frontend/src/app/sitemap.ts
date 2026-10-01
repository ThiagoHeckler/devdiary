import type { MetadataRoute } from "next";
import { getPosts } from "@/lib/posts";
import { siteConfig } from "@/lib/site";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const url = (path: string) => new URL(path, siteConfig.url).toString();
  const pages: MetadataRoute.Sitemap = [
    { url: url("/"), changeFrequency: "monthly", priority: 1 },
    { url: url("/blog"), changeFrequency: "weekly", priority: 0.8 },
  ];

  try {
    const { items } = await getPosts({ limit: 100 });
    return [
      ...pages,
      ...items.map((post) => ({
        url: url(`/blog/${post.slug}`),
        lastModified: post.updatedAt,
        changeFrequency: "monthly" as const,
        priority: 0.7,
      })),
    ];
  } catch {
    // Sem a API (por exemplo, no build), publica só as páginas fixas.
    return pages;
  }
}
