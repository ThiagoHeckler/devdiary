# DevDiary Frontend

Site do DevDiary (vitrine, serviços, projetos e blog), feito com Next.js (App Router), TypeScript e Tailwind CSS.

## Rodando localmente

```bash
npm install
npm run dev
```

Acesse http://localhost:3001 (a API NestJS usa a porta 3000).

## Variáveis de ambiente

- `API_URL`: endereço da API NestJS, sem o `/api` (ex.: `http://localhost:3000`). É lida pelo servidor na hora de rodar, então dá para trocar sem refazer o build.
- `NEXT_PUBLIC_API_URL`: endereço público da API, usado pelo navegador no formulário de contato. É gravado no build.
- `NEXT_PUBLIC_SITE_URL`: endereço público do site (ex.: `https://devdiary.cloud`). Usado nos links do sitemap, nas URLs canônicas e nas prévias de redes sociais. É gravado no build.

## Blog

Os posts vêm da API (`GET /api/posts`). Cada post é gerado na primeira visita e atualizado a cada 60 segundos, então o build não depende da API estar no ar. Para ter posts de exemplo localmente, rode `npm run seed` no backend.

## Deploy (Hostinger, Web App Node.js)

O site é publicado pelo hPanel, conectado a este repositório no GitHub. Cada push na branch configurada dispara um novo build.

Configuração no hPanel:

- Branch: `main`
- Diretório raiz: `devdiary-frontend`
- Versão do Node: 20.9 ou mais nova (o Next 16 exige)
- Build: `npm run build`
- Start: `npm start` (usa a porta definida em `PORT` pela Hostinger e, sem ela, a 3001)

As variáveis de produção ficam no `.env.production`, que é commitado e não tem segredos. Como as `NEXT_PUBLIC_*` são gravadas no build, mudar uma delas exige um novo deploy.

Enquanto a API não estiver no ar em `api.devdiary.cloud`, a home funciona, mas o `/blog` mostra a página de erro e o formulário de contato não envia.
