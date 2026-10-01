"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Container } from "@/components/container";
import { mainNav, siteConfig } from "@/lib/site";

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur">
      <Container className="flex h-16 items-center justify-between">
        <Link
          href="/"
          className="font-mono text-lg font-semibold tracking-tight"
          onClick={() => setOpen(false)}
        >
          <span className="text-accent">&lt;</span>
          {siteConfig.name}
          <span className="text-accent"> /&gt;</span>
        </Link>

        <nav aria-label="Principal" className="hidden items-center gap-8 md:flex">
          {mainNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(pathname, item.href) ? "page" : undefined}
              className="text-sm text-muted transition-colors hover:text-foreground aria-[current=page]:text-foreground aria-[current=page]:font-medium"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/contato"
            className="rounded-full bg-accent px-4 py-2 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent-hover"
          >
            Fale comigo
          </Link>
        </nav>

        <button
          type="button"
          className="-mr-2 rounded-md p-2 text-muted hover:text-foreground md:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          onClick={() => setOpen((value) => !value)}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            {open ? (
              <path d="M6 6l12 12M18 6L6 18" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" />
            )}
          </svg>
        </button>
      </Container>

      {open && (
        <nav id="mobile-nav" aria-label="Principal" className="border-t border-border md:hidden">
          <Container className="flex flex-col gap-1 py-4">
            {mainNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive(pathname, item.href) ? "page" : undefined}
                className="rounded-md px-2 py-2 text-muted hover:text-foreground aria-[current=page]:text-foreground aria-[current=page]:font-medium"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/contato"
              className="mt-2 rounded-full bg-accent px-4 py-2 text-center font-medium text-accent-foreground hover:bg-accent-hover"
              onClick={() => setOpen(false)}
            >
              Fale comigo
            </Link>
          </Container>
        </nav>
      )}
    </header>
  );
}
