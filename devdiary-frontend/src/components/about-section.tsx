import Link from "next/link";
import { Container } from "@/components/container";
import { mySites, siteConfig } from "@/lib/site";

/** Quem escreve o diário e os outros sites dele. Usado na home. */
export function AboutSection() {
  return (
    <section aria-labelledby="autor-titulo" className="border-t border-border bg-surface">
      <Container className="grid gap-12 py-20 sm:py-24 lg:grid-cols-[2fr_3fr]">
        <div>
          <p className="font-mono text-sm text-accent">Quem escreve</p>
          <h2 id="autor-titulo" className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            {siteConfig.author}
          </h2>
          <p className="mt-4 text-muted">
            Desenvolvedor backend Java. Aqui anoto o que estou estudando e
            construindo; os trabalhos e o contato ficam nos sites ao lado.
          </p>
          <Link href="/sobre" className="link mt-6 inline-block">
            Mais sobre mim
          </Link>
        </div>
        <SitesList />
      </Container>
    </section>
  );
}

/** Cartões dos meus sites, cada um clicável por inteiro. */
export function SitesList() {
  return (
    <ul className="grid gap-4 sm:grid-cols-2">
      {mySites.map((site) => (
        <li
          key={site.url}
          className="group relative rounded-2xl border border-border bg-background p-6 transition-colors hover:border-accent"
        >
          <p className="font-mono text-sm text-accent">{site.domain}</p>
          <h3 className="mt-3 text-lg font-semibold group-hover:text-accent">
            <a href={site.url}>
              <span className="absolute inset-0 rounded-2xl" aria-hidden="true" />
              {site.name}
            </a>
          </h3>
          <p className="mt-2 text-muted">{site.description}</p>
        </li>
      ))}
    </ul>
  );
}
