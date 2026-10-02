import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/container";
import { CtaSection } from "@/components/cta-section";
import { ServiceIcon, ServiceIconBadge } from "@/components/icons";
import { PageHeader } from "@/components/page-header";
import { services } from "@/lib/services";

export const metadata: Metadata = {
  title: "Serviços",
  description:
    "Sites sob medida, sistemas web, automações e soluções com IA: o que cada serviço inclui e para quem ele faz sentido.",
  alternates: { canonical: "/servicos" },
};

export default function ServicesPage() {
  return (
    <>
      <PageHeader eyebrow="Serviços" title="Soluções sob medida para cada etapa do seu negócio">
        <p>
          Cada projeto começa pelo problema, não pela tecnologia. Estes são os
          tipos de trabalho que faço e o que você pode esperar de cada um.
        </p>
      </PageHeader>

      <Container className="py-12 sm:py-16">
        <nav aria-label="Serviços" className="flex flex-wrap gap-2">
          {services.map((service) => (
            <a
              key={service.id}
              href={`#${service.id}`}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-sm text-muted transition-colors hover:border-accent hover:text-foreground"
            >
              <ServiceIcon id={service.id} className="size-4 text-accent" />
              {service.title}
            </a>
          ))}
        </nav>

        <div className="mt-10 space-y-6">
          {services.map((service) => (
            <section
              key={service.id}
              id={service.id}
              aria-labelledby={`${service.id}-titulo`}
              className="scroll-mt-24 rounded-3xl border border-border bg-surface p-6 transition-colors hover:border-accent/50 sm:p-10"
            >
              <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
                <ServiceIconBadge id={service.id} />
                <div>
                  <h2 id={`${service.id}-titulo`} className="text-2xl font-semibold tracking-tight sm:text-3xl">
                    {service.title}
                  </h2>
                  <p className="mt-2 text-lg text-muted">{service.description}</p>
                </div>
              </div>

              <div className="mt-10 grid gap-8 border-t border-border pt-8 lg:grid-cols-3 lg:gap-10">
                <div>
                  <h3 className="font-mono text-sm text-accent">Para quem</h3>
                  <p className="mt-3">{service.forWho}</p>
                </div>
                <div>
                  <h3 className="font-mono text-sm text-accent">O que inclui</h3>
                  <ul className="mt-3 space-y-2.5">
                    {service.includes.map((item) => (
                      <li key={item} className="flex gap-3">
                        <span
                          aria-hidden="true"
                          className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-accent-soft text-xs text-accent"
                        >
                          ✓
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-mono text-sm text-accent">Exemplos</h3>
                  <ul className="mt-3 space-y-2.5 text-muted">
                    {service.examples.map((item) => (
                      <li key={item} className="flex gap-3">
                        <span aria-hidden="true" className="text-accent">→</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <Link
                href={`/contato?tipo=${service.projectType}`}
                className="mt-10 inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent-hover"
              >
                Pedir orçamento de {service.title.toLowerCase()}
                <span aria-hidden="true">→</span>
              </Link>
            </section>
          ))}
        </div>
      </Container>

      <CtaSection
        title="Não sabe qual serviço encaixa?"
        description="Descreva o problema com as suas palavras. Eu indico o caminho mais simples para resolver."
      />
    </>
  );
}
