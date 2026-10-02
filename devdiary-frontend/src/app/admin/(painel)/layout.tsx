import Link from "next/link";
import { logout } from "@/app/admin/actions";
import { AdminNav } from "@/components/admin/admin-nav";
import { Container } from "@/components/container";
import { siteConfig } from "@/lib/site";

export default function PainelLayout({ children }: LayoutProps<"/admin">) {
  return (
    <>
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur">
        <Container className="flex h-16 items-center justify-between gap-4">
          <div className="flex items-center gap-6 sm:gap-10">
            <Link href="/admin/posts" className="font-mono font-semibold tracking-tight">
              <span className="text-accent">&lt;</span>
              admin
              <span className="text-accent"> /&gt;</span>
            </Link>
            <AdminNav />
          </div>
          <div className="flex items-center gap-4 text-sm">
            <Link href="/" target="_blank" className="hidden text-muted hover:text-foreground sm:inline">
              Ver {siteConfig.name} ↗
            </Link>
            <form action={logout}>
              <button type="submit" className="text-muted hover:text-foreground">
                Sair
              </button>
            </form>
          </div>
        </Container>
      </header>
      <main className="flex flex-1 flex-col">
        <Container className="py-10">{children}</Container>
      </main>
    </>
  );
}
