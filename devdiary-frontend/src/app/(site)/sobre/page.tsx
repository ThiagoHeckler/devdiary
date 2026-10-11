import type { Metadata } from "next";
import { SitesList } from "@/components/about-section";
import { Container } from "@/components/container";
import { PageHeader } from "@/components/page-header";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Sobre",
  description: `Quem escreve o ${siteConfig.name}: ${siteConfig.author}, desenvolvedor backend Java.`,
  alternates: { canonical: "/sobre" },
};

const stack = [
  { area: "Backend", items: ["Java e Spring Boot", "Node.js", "NestJS", "PHP e Laravel"] },
  { area: "Frontend", items: ["React", "Next.js", "TypeScript", "Tailwind CSS"] },
  { area: "Dados", items: ["PostgreSQL", "MySQL", "MongoDB"] },
  { area: "Automação e IA", items: ["Python", "APIs de IA", "Integrações e rotinas agendadas"] },
];

export default function AboutPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: siteConfig.author,
    url: siteConfig.portfolio,
    sameAs: [siteConfig.github, "https://covalia.com.br"],
    jobTitle: "Desenvolvedor backend Java",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <PageHeader eyebrow="Sobre" title={`Oi, eu sou o ${siteConfig.author.split(" ")[0]}`}>
        <p>
          Sou desenvolvedor backend Java. O {siteConfig.name} é o meu diário:
          onde anoto o que estou estudando e construindo, com os erros, os
          desvios e o que aprendi no caminho.
        </p>
        <p>
          Escrevo primeiro para mim, para lembrar depois. Se uma entrada ajudar
          mais alguém, melhor ainda.
        </p>
      </PageHeader>

      <Container className="py-16 sm:py-20">
        <section aria-labelledby="sites-titulo">
          <h2 id="sites-titulo" className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Meus sites
          </h2>
          <p className="mt-3 text-muted">Trabalhos, serviços e contato ficam aqui.</p>
          <div className="mt-8">
            <SitesList />
          </div>
        </section>

        <section aria-labelledby="tecnologias-titulo" className="mt-20">
          <h2 id="tecnologias-titulo" className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Tecnologias que uso
          </h2>
          <dl className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {stack.map((group) => (
              <div key={group.area}>
                <dt className="font-mono text-sm text-accent">{group.area}</dt>
                <dd className="mt-3">
                  <ul className="flex flex-wrap gap-2">
                    {group.items.map((item) => (
                      <li
                        key={item}
                        className="rounded-full border border-border bg-surface px-3 py-1 text-sm"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </dd>
              </div>
            ))}
          </dl>
        </section>

        <p className="mt-20 text-muted">
          Código no{" "}
          <a href={siteConfig.github} target="_blank" rel="noopener noreferrer" className="link">
            GitHub ↗
          </a>
          .
        </p>
      </Container>
    </>
  );
}
