import { ImageResponse } from "next/og";
import { getPost } from "@/lib/posts";
import { siteConfig } from "@/lib/site";

export const alt = `Post do blog ${siteConfig.name}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "#0c0a09",
          color: "#f5f5f4",
        }}
      >
        <div style={{ display: "flex", fontSize: 36, fontFamily: "monospace" }}>
          <span style={{ color: "#2dd4bf" }}>&lt;</span>
          {siteConfig.name}
          <span style={{ color: "#2dd4bf" }}>&nbsp;/&gt;</span>
        </div>
        <div style={{ display: "flex", fontSize: 64, lineHeight: 1.15 }}>
          {post?.title ?? "Blog"}
        </div>
        <div style={{ display: "flex", gap: 16, fontSize: 28, color: "#a8a29e" }}>
          {(post?.tags ?? []).slice(0, 4).map((tag) => (
            <span key={tag}>#{tag}</span>
          ))}
        </div>
      </div>
    ),
    size,
  );
}
