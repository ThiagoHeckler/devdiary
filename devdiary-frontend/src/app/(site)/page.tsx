import Link from "next/link";
import { Container } from "@/components/container";
import { CtaSection } from "@/components/cta-section";
import { ServiceIconBadge } from "@/components/icons";
import { services } from "@/lib/services";

const steps = [
  {
    title: "Conversa",
    description: "Entendo o problema, o contexto e o que precisa estar pronto primeiro.",
  },
  {
    title: "Proposta",
    description: "Escopo, prazo e valor claros, divididos em entregas pequenas.",
  },
  {
    title: "Desenvolvimento",
    description: "Você acompanha cada etapa funcionando, não só no final.",
  },
  {
    title: "Entrega e suporte",
    description: "Publicação, documentação e ajustes depois que o projeto está no ar.",
  },
];

const highlights = ["Proposta clara", "Entregas em etapas", "Suporte depois da entrega"];

/** Cartão decorativo do hero: as etapas do processo como um painel de projeto. */
function ProjectStatusCard() {
  return (
    <div
      aria-hidden="true"
      className="animate-fade-up rounded-2xl border border-border bg-surface/80 shadow-2xl shadow-accent/10 backdrop-blur [animation-delay:200ms]"
    >
      <div className="flex items-center gap-2 border-b border-border px-5 py-3">
        <span className="size-3 rounded-full bg-border" />
        <span className="size-3 rounded-full bg-border" />
        <span className="size-3 rounded-full bg-border" />
        <span className="ml-3 font-mono text-xs text-muted">seu-projeto</span>
      </div>
      <ul className="space-y-4 p-6">
        {steps.map((step, index) => {
          const done = index < 2;
          const current = index === 2;
          return (
            <li key={step.title} className="flex items-center gap-4">
              <span
                className={`flex size-8 shrink-0 items-center justify-center rounded-full font-mono text-xs ${
                  done
                    ? "bg-accent text-accent-foreground"
                    : current
                      ? "border-2 border-accent text-accent"
                      : "border border-border text-muted"
                }`}
              >
                {done ? "✓" : String(index + 1).padStart(2, "0")}
              </span>
              <div className="flex-1">
                <p className={`text-sm font-medium ${done || current ? "" : "text-muted"}`}>
                  {step.title}
                </p>
                {current && (
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-accent-soft">
                    <div className="h-full w-3/5 rounded-full bg-accent" />
                  </div>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default function Home() {
  return (
    <>
      <section className="relative isolate overflow-hidden border-b border-border">
        <div aria-hidden="true" className="bg-grid absolute inset-0 -z-10 opacity-70" />
        <div aria-hidden="true" className="bg-glow absolute inset-0 -z-10" />
        <Container className="grid items-center gap-16 py-20 sm:py-28 lg:grid-cols-[3fr_2fr]">
          <div className="animate-fade-up">
            <p className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/80 px-3 py-1 font-mono text-xs text-muted">
              <span className="size-1.5 rounded-full bg-accent" />
              Desenvolvimento sob medida
            </p>
            <h1 className="mt-6 text-4xl font-semibold tracking-tight text-balance sm:text-6xl">
              Tecnologia que resolve o problema do seu negócio,{" "}
              <span className="text-accent">do site à automação com IA.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-muted">
              Desenvolvo sites, sistemas web e automações para empresas e
              profissionais. No blog, registro os estudos e os bastidores de cada
              projeto.
            </p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/contato"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-accent px-6 py-3 font-medium text-accent-foreground shadow-lg shadow-accent/20 transition-colors hover:bg-accent-hover"
              >
                Solicitar orçamento
                <span aria-hidden="true">→</span>
              </Link>
              <Link
                href="/projetos"
                className="rounded-full border border-border bg-surface/80 px-6 py-3 text-center font-medium transition-colors hover:border-accent"
              >
                Ver projetos
              </Link>
            </div>
            <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted">
              {highlights.map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <span aria-hidden="true" className="text-accent">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="hidden lg:block">
            <ProjectStatusCard />
          </div>
        </Container>
      </section>

      <section aria-labelledby="servicos-titulo">
        <Container className="py-20 sm:py-24">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="font-mono text-sm text-accent">Serviços</p>
              <h2 id="servicos-titulo" className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
                O que posso fazer por você
              </h2>
            </div>
            <Link href="/servicos" className="font-medium text-accent hover:text-accent-hover">
              Ver todos os detalhes →
            </Link>
          </div>
          <ul className="mt-12 grid gap-4 sm:grid-cols-2">
            {services.map((service) => (
              <li
                key={service.id}
                className="group relative rounded-2xl border border-border bg-surface p-6 transition-all hover:-translate-y-0.5 hover:border-accent hover:shadow-lg hover:shadow-accent/5 sm:p-8"
              >
                <ServiceIconBadge id={service.id} />
                <h3 className="mt-5 text-lg font-semibold">
                  <Link href={`/servicos#${service.id}`} className="group-hover:text-accent">
                    {/* Faz o card inteiro ser clicável */}
                    <span className="absolute inset-0 rounded-2xl" aria-hidden="true" />
                    {service.title}
                  </Link>
                </h3>
                <p className="mt-2 text-muted">{service.description}</p>
                <span
                  aria-hidden="true"
                  className="mt-4 inline-block text-sm font-medium text-accent opacity-0 transition-opacity group-hover:opacity-100"
                >
                  Saiba mais →
                </span>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section aria-labelledby="processo-titulo" className="border-y border-border bg-surface">
        <Container className="py-20 sm:py-24">
          <p className="font-mono text-sm text-accent">Processo</p>
          <h2 id="processo-titulo" className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            Como trabalho
          </h2>
          {/* O ::before desenha a linha que liga as etapas no desktop */}
          <ol className="relative mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8 lg:before:absolute lg:before:inset-x-0 lg:before:top-5 lg:before:h-px lg:before:bg-border lg:before:content-['']">
            {steps.map((step, index) => (
              <li key={step.title} className="relative">
                <span className="relative flex size-10 items-center justify-center rounded-full border border-accent bg-surface font-mono text-sm text-accent">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-5 font-semibold">{step.title}</h3>
                <p className="mt-2 text-muted">{step.description}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <CtaSection title="Tem um projeto em mente?" />
    </>
  );
}
