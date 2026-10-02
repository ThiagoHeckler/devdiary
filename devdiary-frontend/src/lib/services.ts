// Serviços oferecidos. A home mostra o resumo e /servicos mostra os detalhes.
// `projectType` é o valor usado no formulário de contato (src/lib/contact.ts).
export interface Service {
  id: string;
  projectType: string;
  title: string;
  description: string;
  forWho: string;
  includes: string[];
  examples: string[];
}

export const services: Service[] = [
  {
    id: "sites",
    projectType: "site",
    title: "Sites sob medida",
    description:
      "Sites institucionais e landing pages rápidos, bem posicionados no Google e fáceis de atualizar.",
    forWho:
      "Empresas e profissionais que precisam ser encontrados e passar confiança para quem chega pelo Google, Instagram ou indicação.",
    includes: [
      "Layout próprio, pensado para celular primeiro",
      "SEO técnico: velocidade, metadados, sitemap e prévias para redes sociais",
      "Formulário de contato que chega no seu e-mail",
      "Blog ou área de notícias, se fizer sentido",
      "Publicação, domínio e HTTPS configurados",
    ],
    examples: [
      "Site institucional de escritório ou clínica",
      "Landing page para lançamento de produto",
      "Portfólio com área de orçamento",
    ],
  },
  {
    id: "sistemas",
    projectType: "sistema",
    title: "Sistemas web",
    description:
      "Painéis, áreas de cliente e ferramentas internas feitas para o fluxo real do seu negócio.",
    forWho:
      "Negócios que já resolvem tudo em planilhas, WhatsApp e papel e sentem que isso começou a travar o crescimento.",
    includes: [
      "Levantamento do fluxo atual antes de qualquer tela",
      "Login e níveis de acesso para a equipe e para clientes",
      "Painel com os números que importam para você",
      "Banco de dados com backup",
      "Entregas em partes, para você usar cedo e ajustar o rumo",
    ],
    examples: [
      "Controle de pedidos e estoque",
      "Área do cliente com documentos e status",
      "Agenda e cadastro de atendimentos",
    ],
  },
  {
    id: "automacoes",
    projectType: "automacao",
    title: "Automações",
    description:
      "Integrações entre sistemas e rotinas automáticas que eliminam trabalho manual repetitivo.",
    forWho:
      "Equipes que gastam horas por semana copiando dados de um lugar para outro, gerando relatórios ou enviando as mesmas mensagens.",
    includes: [
      "Mapeamento da tarefa e do tempo que ela consome hoje",
      "Integração com as ferramentas que você já usa (planilhas, ERPs, e-mail, APIs)",
      "Rotinas agendadas com aviso quando algo dá errado",
      "Registro do que foi feito, para conferir quando precisar",
    ],
    examples: [
      "Relatório semanal gerado e enviado sozinho",
      "Importação de pedidos de uma loja para o sistema interno",
      "Processamento de imagens e arquivos em lote",
    ],
  },
  {
    id: "ia",
    projectType: "ia",
    title: "Soluções com IA",
    description:
      "Assistentes, classificação de documentos e atendimento com IA aplicados onde trazem resultado.",
    forWho:
      "Quem quer usar IA num problema concreto do negócio, com custo previsível e sem promessas mágicas.",
    includes: [
      "Avaliação honesta de onde a IA ajuda e onde não vale a pena",
      "Protótipo rápido com os seus dados reais",
      "Integração com o seu site, sistema ou WhatsApp",
      "Controle de custo e revisão humana nos pontos críticos",
    ],
    examples: [
      "Assistente que responde dúvidas com base nos seus documentos",
      "Leitura e classificação automática de notas e contratos",
      "Triagem de mensagens de atendimento",
    ],
  },
];
