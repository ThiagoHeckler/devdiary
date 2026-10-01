/**
 * Insere posts de exemplo para desenvolvimento local.
 * Uso: npm run seed
 */
import { NestFactory } from '@nestjs/core';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AppModule } from '../app.module';
import { Post, PostStatus } from '../posts/entities/post.entity';

const daysAgo = (days: number) => new Date(Date.now() - days * 86_400_000);

const posts: Partial<Post>[] = [
  {
    title: 'Exemplo: por que separei o frontend e a API do DevDiary',
    slug: 'exemplo-frontend-e-api-separados',
    excerpt:
      'Post de exemplo. Next.js para o site e NestJS para a API: o que cada um resolve e como conversam.',
    tags: ['nextjs', 'nestjs', 'arquitetura'],
    status: PostStatus.PUBLISHED,
    publishedAt: daysAgo(10),
    content: `> Este é um post de exemplo criado pelo seed. Substitua pelo seu conteúdo.

## O problema

Um blog precisa ser encontrado pelo Google e gerar boas prévias no LinkedIn e no WhatsApp.

## A solução

- **Next.js** renderiza cada página no servidor, com título e imagem próprios.
- **NestJS** expõe a API com validação, autenticação e banco.

\`\`\`ts
@Get(':slug')
findOne(@Param('slug') slug: string) {
  return this.postsService.findPublishedBySlug(slug);
}
\`\`\`

| Camada | Tecnologia |
| --- | --- |
| Frontend | Next.js |
| API | NestJS |
| Banco | PostgreSQL |
`,
  },
  {
    title: 'Exemplo: automatizando tarefas repetitivas com Node.js',
    slug: 'exemplo-automatizando-tarefas-com-node',
    excerpt:
      'Post de exemplo. Como identificar o que vale automatizar e um script simples para começar.',
    tags: ['automacao', 'nodejs'],
    status: PostStatus.PUBLISHED,
    publishedAt: daysAgo(3),
    content: `> Este é um post de exemplo criado pelo seed. Substitua pelo seu conteúdo.

## Comece pelo que se repete

Se uma tarefa é feita toda semana, do mesmo jeito, ela é candidata a virar script.

\`\`\`js
import { readdir } from 'node:fs/promises';

const files = await readdir('./notas');
console.log(\`\${files.length} arquivos encontrados\`);
\`\`\`
`,
  },
  {
    title: 'Exemplo: rascunho que não deve aparecer no site',
    slug: 'exemplo-rascunho',
    excerpt: 'Este post é um rascunho e não aparece na API pública.',
    tags: ['rascunho'],
    status: PostStatus.DRAFT,
    publishedAt: null,
    content: 'Rascunho.',
  },
];

async function seed() {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('O seed de exemplo não deve rodar em produção.');
  }

  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: ['error', 'warn'],
  });
  try {
    const repository = app.get<Repository<Post>>(getRepositoryToken(Post));
    await repository.upsert(posts, ['slug']);
    console.log(`${posts.length} posts de exemplo inseridos/atualizados.`);
  } finally {
    await app.close();
  }
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
