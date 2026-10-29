import Link from "next/link";
import { AboutSection } from "@/components/about-section";
import { PostCard } from "@/components/blog/post-card";
import { Container } from "@/components/container";
import { formatDate, getPosts, type PostSummary } from "@/lib/posts";
import { siteConfig } from "@/lib/site";

async function getLatestPosts(): Promise<PostSummary[] | null> {
  try {
    const { items } = await getPosts({ limit: 4 });
    return items;
  } catch {
    // Sem a API, a home ainda abre; só a lista de posts fica de fora.
    return null;
  }
}

const highlights = ["Estudos", "Experimentos", "Bastidores dos projetos"];

/** Cartão do hero: as últimas entradas do diário no formato de um git log. */
function DiaryLogCard({ posts }: { posts: PostSummary[] }) {
  const entries = posts.length > 0 ? posts.slice(0, 4) : null;

  return (
    <div
      aria-hidden="true"
      className="animate-fade-up rounded-2xl border border-border bg-surface/80 shadow-2xl shadow-accent/10 backdrop-blur [animation-delay:200ms]"
    >
      <div className="flex items-center gap-2 border-b border-border px-5 py-3">
        <span className="size-3 rounded-full bg-border" />
        <span className="size-3 rounded-full bg-border" />
        <span className="size-3 rounded-full bg-border" />
        <span className="ml-3 font-mono text-xs text-muted">~/devdiary $ git log</span>
      </div>
      <ul className="space-y-5 p-6 font-mono text-sm">
        {entries ? (
          entries.map((post, index) => (
            <li key={post.id} className="flex gap-4">
              <span
                className={`mt-1.5 size-2.5 shrink-0 rounded-full ${
                  index === 0 ? "bg-accent shadow-[0_0_12px] shadow-accent" : "border border-muted"
                }`}
              />
              <div className="min-w-0">
                <p className="text-xs text-muted">{formatDate(post.publishedAt)}</p>
                <p className={`mt-1 truncate ${index === 0 ? "text-foreground" : "text-muted"}`}>
                  {post.title}
                </p>
              </div>
            </li>
          ))
        ) : (
          <li className="text-muted">Primeira entrada a caminho...</li>
        )}
      </ul>
    </div>
  );
}

export default async function Home() {
  const posts = await getLatestPosts();

  return (
    <>
      <section className="relative isolate overflow-hidden border-b border-border">
        <div aria-hidden="true" className="bg-grid absolute inset-0 -z-10 opacity-70" />
        <div aria-hidden="true" className="bg-glow absolute inset-0 -z-10" />
        <Container className="grid items-center gap-16 py-20 sm:py-28 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
          <div className="animate-fade-up">
            <p className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/80 px-3 py-1 font-mono text-xs text-muted">
              <span className="size-1.5 rounded-full bg-accent" />
              Diário de desenvolvedor
            </p>
            <h1 className="mt-6 text-4xl font-semibold tracking-tight text-balance sm:text-6xl">
              O que eu estudo, construo e aprendo,{" "}
              <span className="text-accent">anotado no caminho.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-muted">
              O {siteConfig.name} é o meu diário de desenvolvimento. Cada post é
              uma entrada: o problema da vez, o que tentei, o que deu errado e o
              que ficou de lição.
            </p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Link
                href="#posts"
                className="inline-flex items-center justify-center rounded-full bg-accent px-6 py-3 font-medium text-accent-foreground shadow-lg shadow-accent/20 transition-colors hover:bg-accent-hover"
              >
                Ler o diário
              </Link>
              <a
                href={siteConfig.portfolio}
                className="rounded-full border border-border bg-surface/80 px-6 py-3 text-center font-medium transition-colors hover:border-accent"
              >
                Ver portfólio <span aria-hidden="true">↗</span>
              </a>
            </div>
            <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted">
              {highlights.map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <span aria-hidden="true" className="text-accent">#</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="hidden lg:block">
            <DiaryLogCard posts={posts ?? []} />
          </div>
        </Container>
      </section>

      <section id="posts" aria-labelledby="posts-titulo" className="scroll-mt-20">
        <Container className="py-20 sm:py-24">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="font-mono text-sm text-accent">Blog</p>
              <h2 id="posts-titulo" className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
                Últimas entradas
              </h2>
            </div>
            {posts && posts.length > 0 && (
              <Link href="/blog" className="link">
                Ver todos os posts
              </Link>
            )}
          </div>

          {posts === null ? (
            <p className="mt-12 text-muted">Não foi possível carregar os posts agora.</p>
          ) : posts.length === 0 ? (
            <p className="mt-12 text-muted">Nenhum post publicado ainda.</p>
          ) : (
            <div className="mt-12 grid gap-6 md:grid-cols-2">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </Container>
      </section>

      <AboutSection />
    </>
  );
}
