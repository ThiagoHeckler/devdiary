import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/container";
import { CtaSection } from "@/components/cta-section";
import { PageHeader } from "@/components/page-header";
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
      <PageHeader eyebrow="Projetos" title="Trabalhos que resolveram problemas reais">
        <p>O problema de cada projeto, como resolvi e o que mudou depois.</p>
      </PageHeader>

      <Container className="py-12 sm:py-16">
        <div className="space-y-6">
          {projects.map((project) => (
            <article
              key={project.id}
              id={project.id}
              aria-labelledby={`${project.id}-titulo`}
              className="scroll-mt-24 rounded-3xl border border-border bg-surface p-6 transition-colors hover:border-accent/50 sm:p-10"
            >
              <p className="flex flex-wrap items-center gap-2 font-mono text-xs text-muted">
                <span className="rounded-full border border-border px-3 py-1">{project.category}</span>
                <span>{project.year}</span>
              </p>
              <h2 id={`${project.id}-titulo`} className="mt-4 text-2xl font-semibold tracking-tight sm:text-3xl">
                {project.title}
              </h2>
              <p className="mt-2 text-lg text-muted">{project.summary}</p>

              <dl className="mt-10 grid gap-8 border-t border-border pt-8 lg:grid-cols-3 lg:gap-10">
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

      <CtaSection title="O próximo projeto pode ser o seu" label="Solicitar orçamento" />
    </>
  );
}
