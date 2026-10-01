# DevDiary: progresso da sessão de 01/10/2026

Branch: `feat/nextjs-blog` (com push feito, ainda sem PR para a `main`).

## Objetivo do projeto

O DevDiary é a sua vitrine como empresa, não um portfólio de currículo. O site serve para empresas e clientes conhecerem seu trabalho e pedirem orçamento de sites, sistemas, automações e soluções com IA. O blog mostra estudos e projetos, e com isso traz visitas pelo Google e pelo LinkedIn.

## Plano (MVP primeiro)

1. ✅ Trocar o frontend para Next.js e criar o layout base
2. ✅ Blog completo: API de posts, listagem, página do post e SEO/Open Graph
3. ✅ Contato e leads, com aviso por e-mail
4. ⏭️ **Admin com login e editor de posts** (próximo passo)
5. Serviços, projetos e sobre
6. Deploy na VPS e primeiro post publicado

## Commits desta sessão

```
f9cba14 feat(frontend): add contact page with quote request form
04fe1d1 feat(backend): add contact form endpoint with e-mail notification
7f062f6 feat(frontend): add blog list and post pages
8da4661 feat(backend): add public posts API and local Postgres
9430693 feat(frontend): add base layout and home page
3011aef chore: run Next.js on port 3001 and allow it in API CORS
c6a9517 feat(frontend): migrate from Vite to Next.js
```

## Por que o computador travou

Neste computador, o `/tmp` fica na **RAM** (tmpfs de 2,6 GB, num total de 5,1 GB). O `create-next-app` estava instalando o `node_modules` dentro do `/tmp`, o que encheu a memória. Agora as instalações rodam direto no disco e em etapas, e o uso de memória ficou sempre acima de ~2,9 GB livres.

## Passo 1: Next.js e layout base

- O frontend saiu do React + Vite e foi para **Next.js 16** (App Router), TypeScript, Tailwind 4 e ESLint. A troca foi para o SEO e para as prévias de links no LinkedIn e no WhatsApp funcionarem.
- **Portas:** a API (NestJS) fica na `3000` e o site (Next) na `3001`. O CORS do backend aceita `http://localhost:3001` por padrão.
- O layout tem:
  - cabeçalho com menu para celular;
  - rodapé;
  - home com chamada principal, 4 serviços, "Como trabalho" e chamada para contato;
  - página 404 em português;
  - tema claro e escuro.
- A configuração do site fica em `devdiary-frontend/src/lib/site.ts`: nome, descrição e links do menu.
- ⚠️ **Os textos da home são um rascunho meu.** Revise para soarem como você.

## Passo 2: blog

### Banco

- `docker-compose.yml` na raiz do repositório:
  - **Postgres 17** na porta `15435`, acessível só pelo seu computador;
  - **Mailpit** nas portas `1025` e `8025` (detalhes no passo 3).
- O `devdiary-backend/.env` foi criado, porque não existia. O modelo commitado é o `.env.example`.

### API

- Entidade `Post`: título, slug, resumo, conteúdo em Markdown, capa, tags, status (rascunho ou publicado) e data de publicação.
- `GET /api/posts?page=&limit=&tag=` lista só os publicados, com paginação e filtro por tag.
- `GET /api/posts/:slug` devolve o post publicado. Rascunhos e slugs inexistentes dão 404.
- `npm run seed` cria **3 posts de exemplo**: 2 publicados e 1 rascunho, com "Exemplo" no título. Substitua pelos seus.
- Criar e editar posts **ainda não existe**. Isso entra com o login do admin, para ninguém conseguir escrever na API antes disso.

### Site

- `/blog` mostra a lista com paginação e filtro por tag.
- `/blog/[slug]` mostra o post em Markdown, com tabelas e código colorido.
- Cada post tem título e descrição próprios, URL canônica, dados estruturados para o Google (JSON-LD) e uma **imagem de prévia gerada automaticamente** para o LinkedIn e o WhatsApp.
- O site também gera `sitemap.xml`, com os posts, e `robots.txt`.
- Os posts são gerados na primeira visita e atualizados a cada 60 s, então o build não depende da API estar no ar.

### Variáveis de ambiente do frontend

- `API_URL`: usada pelo **servidor** para buscar os posts. É lida na hora de rodar, então dá para trocar sem refazer o build.
- `NEXT_PUBLIC_API_URL`: usada pelo **navegador** no formulário de contato. É gravada no build.
- `NEXT_PUBLIC_SITE_URL`: domínio público do site, usado no sitemap, nas URLs canônicas e nas prévias. ⚠️ **Defina na produção.** Imagino que seja `https://devdiary.cloud`, mas falta confirmar.

### Pendência visual

Na imagem de prévia, às vezes aparece um espaço duplo entre palavras do título. É um defeito do gerador de imagens do Next com essa fonte. Testei duas correções e nenhuma resolveu. Dá para tentar de novo carregando outra fonte.

## Passo 3: formulário de contato

### Site: `/contato`

- Campos: nome, e-mail, empresa (opcional), tipo de projeto, orçamento e prazo (os dois opcionais) e a mensagem.
- O formulário envia **direto do navegador para a API**. Se passasse pelo servidor do Next, todos os visitantes teriam o mesmo IP e o limite contra spam valeria para todos juntos.
- Se o envio falhar, o que a pessoa digitou não se perde. A mensagem de erro diz o motivo: campos inválidos, envios demais ou falta de conexão.
- ⚠️ **"Resposta em até 2 dias úteis"** é um prazo que eu inventei e aparece na página. Ajuste para o que você consegue cumprir.

### API: `POST /api/leads`

- Valida os campos, salva no banco (tabela `leads`, com status novo, contatado ou arquivado) e te avisa por e-mail.
- No aviso, o "responder para" é o e-mail do visitante, então é só clicar em responder.
- **Proteção contra spam:**
  - campo invisível que só robôs preenchem: o robô recebe um "sucesso" falso e nada é salvo;
  - limite de **5 envios por hora por IP**.
- Se o e-mail falhar, o contato continua salvo e o visitante não vê erro.
- Em desenvolvimento, o **Mailpit** captura os e-mails. Veja em http://localhost:8025.

### Configuração na produção (`.env` do backend na VPS)

- `LEADS_NOTIFY_TO`: o seu e-mail.
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS` e `MAIL_FROM`: um SMTP de verdade, como o do seu provedor de e-mail, ou um serviço como Resend ou Brevo.
- `TRUST_PROXY=1`: se a API ficar atrás do nginx. Sem isso, todos os visitantes contam como um IP só.
- `FRONTEND_URL`: o domínio do site, para o CORS.

## Como rodar localmente

```bash
docker compose up -d                          # na raiz: Postgres e Mailpit
cd devdiary-backend && npm run seed           # opcional: posts de exemplo
cd devdiary-backend && npm run start:dev      # API em http://localhost:3000/api
cd devdiary-frontend && npm run dev           # site em http://localhost:3001
```

Os e-mails capturados aparecem em http://localhost:8025.

## Decisões para a próxima sessão

1. **Seguir para o painel admin (passo 4):**
   - login com JWT, já que o `bcrypt` está instalado;
   - criar, editar e publicar posts com editor de Markdown;
   - ver os contatos recebidos e mudar o status deles.
2. **Ou abrir o PR** da `feat/nextjs-blog` para a `main` antes de continuar.
3. **Itens para revisar por conta própria:**
   - textos da home;
   - prazo de resposta na página de contato;
   - domínio de produção (`NEXT_PUBLIC_SITE_URL`).

Os links do menu para Serviços, Projetos e Sobre ainda abrem a página 404. Essas páginas entram no passo 5.
