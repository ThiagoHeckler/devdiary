// Projetos mostrados em /projetos e na home, do mais recente para o mais antigo.
// Para adicionar um, copie um item e preencha. Os links são opcionais:
// `blogSlug` aponta para o post do blog que conta os bastidores.
export interface Project {
  id: string;
  title: string;
  category: string;
  year: number;
  summary: string;
  problem: string;
  solution: string;
  result: string;
  stack: string[];
  url?: string;
  repoUrl?: string;
  blogSlug?: string;
}

export const projects: Project[] = [
  {
    id: "devdiary",
    title: "DevDiary",
    category: "Site e sistema web",
    year: 2026,
    summary:
      "Este site: um diário de desenvolvimento com painel próprio para escrever e publicar as entradas.",
    problem:
      "Queria um lugar meu para registrar estudos e projetos, sem depender de plataformas de terceiros.",
    solution:
      "Site em Next.js com páginas geradas no servidor para o SEO, API própria em NestJS com PostgreSQL e um painel com login para escrever as entradas em Markdown.",
    result:
      "Entradas com prévia automática no LinkedIn e no WhatsApp e publicação sem mexer em código.",
    stack: ["Next.js", "React", "TypeScript", "Tailwind CSS", "NestJS", "PostgreSQL"],
  },
];
