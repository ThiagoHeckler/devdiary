# DevDiary

Diário de desenvolvimento de [Thiago Heckler](https://thiagoheckler.com.br): estudos, experimentos e bastidores dos projetos, do jeito que aconteceram.

No ar em **[devdiary.cloud](https://devdiary.cloud)**.

## Stack

| Parte | Tecnologias |
|---|---|
| Frontend (`devdiary-frontend`) | Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4, react-markdown |
| Backend (`devdiary-backend`) | NestJS 11, TypeORM, class-validator, JWT, Helmet, Throttler |
| Banco | MySQL 8.4 (Docker em desenvolvimento) |

O site e a API são separados. O Next.js renderiza as páginas no servidor, o que garante SEO e boas prévias em redes sociais. A API NestJS guarda os posts e atende o painel admin.

## Funcionalidades

- **Blog** com posts em Markdown, destaque de código, tags e paginação.
- **Imagem de prévia (Open Graph)** gerada para cada post, além de `sitemap.xml` e `robots.txt`.
- **Painel admin** em `/admin`, com login, para criar, editar, agendar, publicar e apagar posts. O editor tem pré-visualização.
- **Tema claro e escuro.**
- Páginas de **projetos** e **sobre**.

## Estrutura

```
devdiary/
├── devdiary-frontend/   # site Next.js (porta 3001)
├── devdiary-backend/    # API NestJS (porta 3000, prefixo /api)
├── docs/                # anotações de progresso
└── docker-compose.yml   # MySQL para desenvolvimento
```

## Rodando localmente

Requisitos: Node.js 20.9 ou mais novo e Docker.

```bash
# 1. Banco (MySQL em 127.0.0.1:13306)
docker compose up -d

# 2. API
cd devdiary-backend
cp .env.example .env      # troque o JWT_SECRET (o arquivo mostra como gerar)
npm install
npm run start:dev         # http://localhost:3000/api

# 3. Site (em outro terminal)
cd devdiary-frontend
npm install
npm run dev               # http://localhost:3001
```

A API aplica as migrations sozinha quando sobe. Para ter posts de exemplo, rode `npm run seed` em `devdiary-backend`.

### Painel admin

Existe um único usuário admin, configurado no `.env` do backend:

1. Em `devdiary-backend`, rode `npm run hash-password`. O comando pede a senha (mínimo 12 caracteres).
2. Cole a linha `ADMIN_PASSWORD_HASH='...'` gerada no `.env` e preencha `ADMIN_EMAIL`.
3. Reinicie a API e entre em http://localhost:3001/admin.

Sem essas variáveis, a API sobe normalmente, mas o login do admin fica desativado.

## Variáveis de ambiente

**Backend** (`devdiary-backend/.env`, modelo em `.env.example`):

| Variável | Descrição |
|---|---|
| `PORT` | Porta da API (padrão `3000`) |
| `FRONTEND_URL` | Origens liberadas no CORS, separadas por vírgula |
| `DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`, `DB_DATABASE` | Conexão com o MySQL |
| `JWT_SECRET` | Segredo dos tokens de login, com pelo menos 32 caracteres. Sem ele, a API não sobe |
| `ADMIN_EMAIL`, `ADMIN_PASSWORD_HASH` | Credenciais do admin |
| `TRUST_PROXY` | Use `1` atrás de proxy reverso, para o limite de requisições ver o IP real |

**Frontend** (`devdiary-frontend/.env`, e `.env.production` em produção):

| Variável | Descrição |
|---|---|
| `API_URL` | URL da API usada pelo servidor do Next, sem o `/api` |
| `NEXT_PUBLIC_API_URL` | URL pública da API. É gravada no build |
| `NEXT_PUBLIC_SITE_URL` | URL pública do site, usada no sitemap, nas URLs canônicas e nas prévias. É gravada no build |

## API

Todas as rotas têm o prefixo `/api`.

| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/posts?page=&limit=&tag=` | Lista os posts publicados |
| `GET` | `/posts/:slug` | Mostra um post publicado |
| `POST` | `/auth/login` | Login do admin (até 10 tentativas a cada 15 minutos) |
| `GET`, `POST` | `/admin/posts` | Lista todos os posts, inclusive rascunhos, e cria posts |
| `GET`, `PATCH`, `DELETE` | `/admin/posts/:id` | Lê, edita e apaga um post |

As rotas `/admin/*` exigem o token do login.

## Scripts úteis

| Onde | Comando | O que faz |
|---|---|---|
| backend | `npm test` | Testes unitários (Jest) |
| backend | `npm run lint` | ESLint |
| backend | `npm run migration:generate -- src/database/migrations/Nome` | Gera uma migration a partir das entidades |
| backend | `npm run migration:run` / `migration:revert` | Aplica ou desfaz migrations |
| backend | `npm run seed` | Insere posts de exemplo |
| frontend | `npm run lint` | ESLint |
| frontend | `npm run build` | Build de produção |

## Deploy

O frontend é publicado na Hostinger (Web App Node.js), conectada a este repositório. Cada push na `main` dispara um novo build. Os detalhes estão em [`devdiary-frontend/README.md`](devdiary-frontend/README.md).

Fluxo de branches: o trabalho entra na `developer` por pull request e depois é juntado na `main`.
