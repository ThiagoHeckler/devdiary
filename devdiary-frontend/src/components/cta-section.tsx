import Link from "next/link";
import { Container } from "@/components/container";

/** Chamada para contato no fim das páginas. */
export function CtaSection({
  title,
  description = "Conte o que você precisa. Respondo com os próximos passos e uma estimativa inicial.",
  label = "Fale comigo",
  href = "/contato",
}: {
  title: string;
  description?: string;
  label?: string;
  href?: string;
}) {
  return (
    <section>
      <Container className="py-16 sm:py-20">
        <div className="relative isolate overflow-hidden rounded-3xl border border-border bg-surface px-6 py-14 text-center sm:px-12">
          <div aria-hidden="true" className="bg-grid absolute inset-0 -z-10 opacity-50" />
          <div aria-hidden="true" className="bg-glow absolute inset-0 -z-10" />
          <h2 className="text-2xl font-semibold tracking-tight text-balance sm:text-3xl">
            {title}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted">{description}</p>
          <Link
            href={href}
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 font-medium text-accent-foreground shadow-lg shadow-accent/20 transition-colors hover:bg-accent-hover"
          >
            {label}
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </Container>
    </section>
  );
}
