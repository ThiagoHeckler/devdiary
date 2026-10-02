import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/container";
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
      <Container className="py-16 sm:py-20">
        <header className="max-w-2xl">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Serviços</h1>
          <p className="mt-4 text-lg text-muted">
            Cada projeto começa pelo problema, não pela tecnologia. Estes são os
            tipos de trabalho que faço e o que você pode esperar de cada um.
          </p>
        </header>

        <nav aria-label="Serviços" className="mt-8 flex flex-wrap gap-2">
          {services.map((service) => (
            <a
              key={service.id}
              href={`#${service.id}`}
              className="rounded-full border border-border px-4 py-1.5 text-sm text-muted transition-colors hover:border-accent hover:text-foreground"
            >
              {service.title}
            </a>
          ))}
        </nav>

        <div className="mt-12 space-y-6">
          {services.map((service) => (
            <section
              key={service.id}
              id={service.id}
              aria-labelledby={`${service.id}-titulo`}
              className="scroll-mt-24 rounded-2xl border border-border bg-surface p-6 sm:p-8"
            >
              <h2 id={`${service.id}-titulo`} className="text-2xl font-semibold tracking-tight">
                {service.title}
              </h2>
              <p className="mt-2 text-lg text-muted">{service.description}</p>

              <div className="mt-8 grid gap-8 lg:grid-cols-3">
                <div>
                  <h3 className="font-mono text-sm text-accent">Para quem</h3>
                  <p className="mt-3">{service.forWho}</p>
                </div>
                <div>
                  <h3 className="font-mono text-sm text-accent">O que inclui</h3>
                  <ul className="mt-3 space-y-2">
                    {service.includes.map((item) => (
                      <li key={item} className="flex gap-2">
                        <span aria-hidden="true" className="text-accent">✓</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-mono text-sm text-accent">Exemplos</h3>
                  <ul className="mt-3 space-y-2 text-muted">
                    {service.examples.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <Link
                href={`/contato?tipo=${service.projectType}`}
                className="mt-8 inline-block font-medium text-accent hover:text-accent-hover"
              >
                Pedir orçamento de {service.title.toLowerCase()} →
              </Link>
            </section>
          ))}
        </div>
      </Container>

      <section className="border-t border-border bg-surface">
        <Container className="py-16 text-center">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Não sabe qual serviço encaixa?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted">
            Descreva o problema com as suas palavras. Eu indico o caminho mais
            simples para resolver.
          </p>
          <Link
            href="/contato"
            className="mt-8 inline-block rounded-full bg-accent px-6 py-3 font-medium text-accent-foreground transition-colors hover:bg-accent-hover"
          >
            Fale comigo
          </Link>
        </Container>
      </section>
    </>
  );
}
