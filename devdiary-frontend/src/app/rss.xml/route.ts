import { getPost, getPosts, type PostSummary } from "@/lib/posts";
import { siteConfig } from "@/lib/site";

// Rendered per request (not at build time, when the API is not reachable).
// The API calls themselves are cached for 60 s by apiFetch.
export const dynamic = "force-dynamic";

const FEED_SIZE = 30;
const WORDS_PER_MINUTE = 200;

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/** Markdown → word count, ignoring code fences and syntax characters. */
function readingMinutes(markdown: string) {
  const text = markdown.replace(/```[\s\S]*?```/g, " ").replace(/[#>*_`[\]()!-]/g, " ");
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}

async function item(post: PostSummary) {
  const url = new URL(`/blog/${post.slug}`, siteConfig.url).toString();
  // The list endpoint has no content; the post endpoint is cached by apiFetch.
  const full = await getPost(post.slug);
  const minutes = full ? readingMinutes(full.content) : null;
  return [
    "    <item>",
    `      <title>${escapeXml(post.title)}</title>`,
    `      <link>${url}</link>`,
    `      <guid isPermaLink="true">${url}</guid>`,
    `      <pubDate>${new Date(post.publishedAt).toUTCString()}</pubDate>`,
    `      <description>${escapeXml(post.excerpt)}</description>`,
    ...post.tags.map((tag) => `      <category>${escapeXml(tag)}</category>`),
    minutes ? `      <dd:readingMinutes>${minutes}</dd:readingMinutes>` : "",
    "    </item>",
  ]
    .filter(Boolean)
    .join("\n");
}

export async function GET() {
  const { items } = await getPosts({ limit: FEED_SIZE });
  const entries = await Promise.all(items.map(item));
  const feedUrl = new URL("/rss.xml", siteConfig.url).toString();

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dd="https://devdiary.cloud/ns/1.0">
  <channel>
    <title>${escapeXml(siteConfig.name)}</title>
    <link>${siteConfig.url}</link>
    <description>${escapeXml(siteConfig.description)}</description>
    <language>pt-BR</language>
    <atom:link href="${feedUrl}" rel="self" type="application/rss+xml"/>
${entries.join("\n")}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
