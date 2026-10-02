// Projetos mostrados em /projetos, do mais recente para o mais antigo.
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
      "Este site: vitrine de serviços, blog técnico e painel para gerenciar posts e pedidos de orçamento.",
    problem:
      "Precisava de um lugar para apresentar meu trabalho, publicar estudos e receber pedidos de orçamento sem depender de plataformas de terceiros.",
    solution:
      "Site em Next.js com páginas geradas no servidor para o SEO, API própria em NestJS com PostgreSQL e um painel admin com login para escrever posts em Markdown e acompanhar os contatos.",
    result:
      "Blog com prévias automáticas para LinkedIn e WhatsApp, formulário de contato com aviso por e-mail e proteção contra spam, e publicação de posts sem mexer em código.",
    stack: ["Next.js", "React", "TypeScript", "Tailwind CSS", "NestJS", "PostgreSQL"],
  },
];
