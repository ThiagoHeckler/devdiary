const API_URL = `${process.env.API_URL ?? "http://localhost:3000"}/api`;

/** Tempo (em segundos) que a lista e os posts ficam em cache antes de buscar de novo. */
const REVALIDATE_SECONDS = 60;

export interface PostSummary {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImageUrl: string | null;
  tags: string[];
  publishedAt: string;
  updatedAt: string;
}

export interface Post extends PostSummary {
  content: string;
}

export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

async function apiFetch(path: string) {
  return fetch(`${API_URL}${path}`, {
    next: { revalidate: REVALIDATE_SECONDS, tags: ["posts"] },
  });
}

export async function getPosts({
  page = 1,
  limit = 10,
  tag,
}: { page?: number; limit?: number; tag?: string } = {}): Promise<
  Paginated<PostSummary>
> {
  const params = new URLSearchParams({ page: String(page), limit: String(limit) });
  if (tag) params.set("tag", tag);

  const response = await apiFetch(`/posts?${params}`);
  if (!response.ok) {
    throw new Error(`Falha ao buscar posts: ${response.status}`);
  }
  return response.json();
}

export async function getPost(slug: string): Promise<Post | null> {
  const response = await apiFetch(`/posts/${encodeURIComponent(slug)}`);
  if (response.status === 404) return null;
  if (!response.ok) {
    throw new Error(`Falha ao buscar o post "${slug}": ${response.status}`);
  }
  return response.json();
}

export function formatDate(date: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "America/Sao_Paulo",
  }).format(new Date(date));
}
