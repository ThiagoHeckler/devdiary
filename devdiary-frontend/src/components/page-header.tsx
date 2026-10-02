import { Container } from "@/components/container";

/** Topo das páginas internas: rótulo, título e descrição sobre o quadriculado. */
export function PageHeader({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <section className="relative isolate overflow-hidden border-b border-border">
      <div aria-hidden="true" className="bg-grid absolute inset-0 -z-10 opacity-60" />
      <div aria-hidden="true" className="bg-glow absolute inset-0 -z-10" />
      <Container className="py-16 sm:py-24">
        <div className="max-w-2xl animate-fade-up">
          <p className="font-mono text-sm text-accent">{eyebrow}</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
            {title}
          </h1>
          {children && <div className="mt-6 space-y-4 text-lg text-muted">{children}</div>}
        </div>
      </Container>
    </section>
  );
}
