import type { Metadata } from "next";
import Link from "next/link";
import { PostEditor } from "@/components/admin/post-editor";

export const metadata: Metadata = {
  title: "Novo post",
};

export default function NewPostPage() {
  return (
    <>
      <Link href="/admin/posts" className="text-sm text-muted hover:text-foreground">
        ← Posts
      </Link>
      <h1 className="mt-4 text-2xl font-semibold tracking-tight">Novo post</h1>
      <div className="mt-8">
        <PostEditor />
      </div>
    </>
  );
}
