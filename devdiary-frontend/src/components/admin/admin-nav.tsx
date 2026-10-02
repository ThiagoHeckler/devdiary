"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/admin/posts", label: "Posts" },
  { href: "/admin/contatos", label: "Contatos" },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Admin" className="flex items-center gap-6">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          aria-current={pathname.startsWith(link.href) ? "page" : undefined}
          className="text-sm text-muted transition-colors hover:text-foreground aria-[current=page]:font-medium aria-[current=page]:text-foreground"
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
