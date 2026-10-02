import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/container";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Sobre",
  description: `Quem está por trás do ${siteConfig.name}: ${siteConfig.author}, desenvolvedor de sites, sistemas web e automações com IA.`,
  alternates: { canonical: "/sobre" },
};

const principles = [
  {
    title: "Problema antes da tecnologia",
    description:
      "Primeiro entendo o que precisa mudar no seu dia a dia. A ferramenta vem depois, e às vezes a resposta é mais simples do que parecia.",
  },
  {
    title: "Entregas pequenas e frequentes",
    description:
      "Você vê o projeto funcionando desde as primeiras semanas e pode ajustar o rumo antes que fique caro.",
  },
  {
    title: "Conversa direta",
    description:
      "Sem jargão desnecessário. Você sabe o que está sendo feito, quanto custa e por quê.",
  },
  {
    title: "Código que dura",
    description:
      "Projetos documentados, com testes e fáceis de manter, mesmo que outra pessoa assuma depois.",
  },
];

const stack = [
  { area: "Frontend", items: ["React", "Next.js", "TypeScript", "Tailwind CSS"] },
  { area: "Backend", items: ["Node.js", "NestJS", "Java e Spring Boot", "PHP e Laravel"] },
  { area: "Dados", items: ["PostgreSQL", "MySQL", "MongoDB"] },
  { area: "Automação e IA", items: ["Python", "APIs de IA", "Integrações e rotinas agendadas"] },
];

export default function AboutPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: siteConfig.author,
    url: new URL("/sobre", siteConfig.url).toString(),
    sameAs: [siteConfig.github],
    jobTitle: "Desenvolvedor de software",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <Container className="py-16 sm:py-20">
        <header className="max-w-2xl">
          <p className="font-mono text-sm text-accent">Sobre</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            Oi, eu sou o {siteConfig.author.split(" ")[0]}
          </h1>
          <div className="mt-6 space-y-4 text-lg text-muted">
            <p>
              Sou desenvolvedor de software e crio sites, sistemas web e
              automações para empresas e profissionais que querem usar
              tecnologia para trabalhar melhor, não só para ter algo novo.
            </p>
            <p>
              O {siteConfig.name} nasceu como meu diário de estudos e virou o
              lugar onde apresento meu trabalho. No blog, conto os bastidores
              dos projetos: o que funcionou, o que não funcionou e o que aprendi
              no caminho.
            </p>
          </div>
        </header>

        <section aria-labelledby="principios-titulo" className="mt-16">
          <h2 id="principios-titulo" className="text-2xl font-semibold tracking-tight">
            Como trabalho
          </h2>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2">
            {principles.map((principle) => (
              <li key={principle.title} className="rounded-2xl border border-border bg-surface p-6">
                <h3 className="font-semibold">{principle.title}</h3>
                <p className="mt-2 text-muted">{principle.description}</p>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="tecnologias-titulo" className="mt-16">
          <h2 id="tecnologias-titulo" className="text-2xl font-semibold tracking-tight">
            Tecnologias que uso
          </h2>
          <dl className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {stack.map((group) => (
              <div key={group.area}>
                <dt className="font-mono text-sm text-accent">{group.area}</dt>
                <dd className="mt-3">
                  <ul className="space-y-1">
                    {group.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </dd>
              </div>
            ))}
          </dl>
        </section>

        <p className="mt-16 text-muted">
          Veja também os{" "}
          <Link href="/projetos" className="font-medium text-accent hover:text-accent-hover">
            projetos
          </Link>{" "}
          e o meu{" "}
          <a
            href={siteConfig.github}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-accent hover:text-accent-hover"
          >
            GitHub ↗
          </a>
          .
        </p>
      </Container>

      <section className="border-t border-border bg-surface">
        <Container className="py-16 text-center">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Vamos trabalhar juntos?
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
