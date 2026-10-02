# DevDiary: progresso da sessão de 02/10/2026

Branch: `developer`. O trabalho de 01/10 já foi juntado na `main`.

## Passo 4: painel admin ✅

O painel fica em **http://localhost:3001/admin**. Ele não aparece no menu do site e o `robots.txt` pede para o Google não indexar.

### O que dá para fazer

- **Posts** (`/admin/posts`):
  - ver todos os posts, inclusive rascunhos, com filtro por status;
  - criar e editar com editor de Markdown e aba de **pré-visualização**, que mostra o post como ele vai aparecer no blog;
  - salvar como rascunho, publicar ou despublicar;
  - **agendar** com uma data futura (horário de Brasília);
  - apagar.

  O blog público é atualizado na hora quando um post é salvo.
- **Contatos** (`/admin/contatos`):
  - lista dos pedidos de orçamento, que abre mostrando os novos;
  - botões para marcar como contatado, arquivar ou voltar para novo;
  - clicar no e-mail abre a resposta no seu programa de e-mail.

### Como o login funciona

- Existe **um único usuário admin**, definido no `.env` do backend. Não há tabela de usuários.
  - `ADMIN_EMAIL`: o seu e-mail.
  - `ADMIN_PASSWORD_HASH`: o hash da senha (bcrypt). Gere com `npm run hash-password` dentro de `devdiary-backend`: o comando pede a senha e mostra a linha pronta para colar no `.env`.
  - `JWT_SECRET`: segredo aleatório de pelo menos 32 caracteres. O `.env.example` mostra como gerar.
- A sessão dura **8 horas**. Depois disso o painel pede o login de novo.
- O token fica num cookie `httpOnly` que só o servidor do Next lê. Um script na página não consegue roubar o token.
- **Proteção contra força bruta:** 10 tentativas de login a cada 15 minutos. Esse limite vale para todas as tentativas juntas, então, se alguém ficar tentando, o seu login também espera os 15 minutos.

### Localmente

O `.env` local do backend já tem um admin de teste: `admin@devdiary.local`. A senha foi enviada na conversa. Para usar a sua, rode `npm run hash-password` e troque `ADMIN_EMAIL` e `ADMIN_PASSWORD_HASH`.

### Na produção (VPS)

- Defina `JWT_SECRET`, `ADMIN_EMAIL` e `ADMIN_PASSWORD_HASH` no `.env` do backend. Sem eles, a API não sobe (no caso do `JWT_SECRET`) ou o login fica desativado.
- O site precisa estar em **HTTPS**, porque na produção o cookie de login só é enviado por conexão segura.

### Mudanças de estrutura no frontend

- As páginas públicas foram para `src/app/(site)/`, um grupo de rotas que tem o cabeçalho e o rodapé do site. As URLs não mudaram.
- O painel fica em `src/app/admin/` e tem layout próprio.

### API nova

- `POST /api/auth/login`
- `GET`, `POST`, `PATCH` e `DELETE` em `/api/admin/posts`
- `GET /api/admin/leads` e `PATCH /api/admin/leads/:id`

Todas as rotas `/api/admin/*` exigem o token.

## Próximo passo

5. Páginas de serviços, projetos e sobre. Os links do menu ainda abrem a página 404.

Os itens da sessão anterior continuam pendentes para você revisar:

- textos da home;
- prazo de resposta no `/contato`;
- domínio de produção (`NEXT_PUBLIC_SITE_URL`).
