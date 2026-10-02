import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/container";
import { projects, type Project } from "@/lib/projects";

export const metadata: Metadata = {
  title: "Projetos",
  description:
    "Projetos de sites, sistemas web, automações e IA: o problema de cada cliente, a solução e o resultado.",
  alternates: { canonical: "/projetos" },
};

const linkClass = "font-medium text-accent hover:text-accent-hover";

function ProjectLinks({ project }: { project: Project }) {
  if (!project.url && !project.repoUrl && !project.blogSlug) return null;

  return (
    <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm">
      {project.url && (
        <a href={project.url} target="_blank" rel="noopener noreferrer" className={linkClass}>
          Ver online ↗
        </a>
      )}
      {project.repoUrl && (
        <a href={project.repoUrl} target="_blank" rel="noopener noreferrer" className={linkClass}>
          Código ↗
        </a>
      )}
      {project.blogSlug && (
        <Link href={`/blog/${project.blogSlug}`} className={linkClass}>
          Bastidores no blog →
        </Link>
      )}
    </div>
  );
}

export default function ProjectsPage() {
  return (
    <>
      <Container className="py-16 sm:py-20">
        <header className="max-w-2xl">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Projetos</h1>
          <p className="mt-4 text-lg text-muted">
            O problema de cada projeto, como resolvi e o que mudou depois.
          </p>
        </header>

        <div className="mt-12 space-y-6">
          {projects.map((project) => (
            <article
              key={project.id}
              id={project.id}
              aria-labelledby={`${project.id}-titulo`}
              className="scroll-mt-24 rounded-2xl border border-border bg-surface p-6 sm:p-8"
            >
              <p className="font-mono text-sm text-muted">
                {project.category} · {project.year}
              </p>
              <h2 id={`${project.id}-titulo`} className="mt-2 text-2xl font-semibold tracking-tight">
                {project.title}
              </h2>
              <p className="mt-2 text-lg text-muted">{project.summary}</p>

              <dl className="mt-8 grid gap-8 lg:grid-cols-3">
                <div>
                  <dt className="font-mono text-sm text-accent">Problema</dt>
                  <dd className="mt-3">{project.problem}</dd>
                </div>
                <div>
                  <dt className="font-mono text-sm text-accent">Solução</dt>
                  <dd className="mt-3">{project.solution}</dd>
                </div>
                <div>
                  <dt className="font-mono text-sm text-accent">Resultado</dt>
                  <dd className="mt-3">{project.result}</dd>
                </div>
              </dl>

              <ul aria-label="Tecnologias" className="mt-8 flex flex-wrap gap-2">
                {project.stack.map((tech) => (
                  <li key={tech} className="rounded-full bg-accent-soft px-3 py-1 font-mono text-xs">
                    {tech}
                  </li>
                ))}
              </ul>

              <ProjectLinks project={project} />
            </article>
          ))}
        </div>

        <p className="mt-12 text-muted">
          Estudos e experimentos menores ficam no{" "}
          <Link href="/blog" className={linkClass}>
            blog
          </Link>
          .
        </p>
      </Container>

      <section className="border-t border-border bg-surface">
        <Container className="py-16 text-center">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            O próximo projeto pode ser o seu
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted">
            Conte o que você precisa. Respondo com os próximos passos e uma
            estimativa inicial.
          </p>
          <Link
            href="/contato"
            className="mt-8 inline-block rounded-full bg-accent px-6 py-3 font-medium text-accent-foreground transition-colors hover:bg-accent-hover"
          >
            Solicitar orçamento
          </Link>
        </Container>
      </section>
    </>
  );
}
