export const siteConfig = {
  name: "DevDiary",
  description:
    "Sites sob medida, sistemas web e automações com IA para empresas e profissionais. Projetos, estudos e bastidores no blog.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3001",
  author: "Thiago Heckler",
  github: "https://github.com/ThiagoHeckler",
};

export const mainNav = [
  { href: "/servicos", label: "Serviços" },
  { href: "/projetos", label: "Projetos" },
  { href: "/blog", label: "Blog" },
  { href: "/sobre", label: "Sobre" },
];
