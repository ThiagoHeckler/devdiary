export const siteConfig = {
  name: "DevDiary",
  description:
    "Diário de desenvolvedor de Thiago Heckler: estudos, experimentos e bastidores dos projetos, do jeito que aconteceram.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3001",
  author: "Thiago Heckler",
  github: "https://github.com/ThiagoHeckler",
  portfolio: "https://thiagoheckler.com.br",
};

export const mainNav = [
  { href: "/blog", label: "Blog" },
  { href: "/projetos", label: "Projetos" },
  { href: "/sobre", label: "Sobre" },
];

// Meus outros sites, mostrados na home e no Sobre.
export const mySites = [
  {
    name: "Thiago Heckler",
    domain: "thiagoheckler.com.br",
    url: "https://thiagoheckler.com.br",
    description:
      "Meu portfólio de desenvolvedor backend Java: projetos no ar para testar, serviços e contato.",
  },
  {
    name: "Covalia Software",
    domain: "covalia.com.br",
    url: "https://covalia.com.br",
    description:
      "Sites, aplicativos e sistemas sob medida para empresas, integrados a pagamentos, nota fiscal, WhatsApp e planilhas.",
  },
];
