import Link from "next/link";
import { Container } from "@/components/container";
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

export default function Home() {
  return (
    <>
      <section className="border-b border-border">
        <Container className="py-20 sm:py-28">
          <p className="font-mono text-sm text-accent">Desenvolvimento sob medida</p>
          <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
            Tecnologia que resolve o problema do seu negócio, do site à automação com IA.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-muted">
            Desenvolvo sites, sistemas web e automações para empresas e
            profissionais. No blog, registro os estudos e os bastidores de cada
            projeto.
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/contato"
              className="rounded-full bg-accent px-6 py-3 text-center font-medium text-accent-foreground transition-colors hover:bg-accent-hover"
            >
              Solicitar orçamento
            </Link>
            <Link
              href="/projetos"
              className="rounded-full border border-border px-6 py-3 text-center font-medium transition-colors hover:bg-surface"
            >
              Ver projetos
            </Link>
          </div>
        </Container>
      </section>

      <section aria-labelledby="servicos-titulo">
        <Container className="py-20">
          <h2 id="servicos-titulo" className="text-2xl font-semibold tracking-tight sm:text-3xl">
            O que posso fazer por você
          </h2>
          <ul className="mt-10 grid gap-4 sm:grid-cols-2">
            {services.map((service) => (
              <li
                key={service.id}
                className="rounded-2xl border border-border bg-surface p-6"
              >
                <h3 className="font-semibold">
                  <Link href={`/servicos#${service.id}`} className="hover:text-accent">
                    {service.title}
                  </Link>
                </h3>
                <p className="mt-2 text-muted">{service.description}</p>
              </li>
            ))}
          </ul>
          <Link
            href="/servicos"
            className="mt-8 inline-block font-medium text-accent hover:text-accent-hover"
          >
            Conheça os serviços →
          </Link>
        </Container>
      </section>

      <section aria-labelledby="processo-titulo" className="border-y border-border bg-surface">
        <Container className="py-20">
          <h2 id="processo-titulo" className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Como trabalho
          </h2>
          <ol className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, index) => (
              <li key={step.title}>
                <span className="font-mono text-sm text-accent">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-2 font-semibold">{step.title}</h3>
                <p className="mt-2 text-muted">{step.description}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <section>
        <Container className="py-20 text-center">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Tem um projeto em mente?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted">
            Conte o que você precisa. Respondo com os próximos passos e uma
            estimativa inicial.
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
