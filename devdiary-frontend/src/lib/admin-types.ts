// Tipos das respostas da API admin (devdiary-backend/src/posts e src/leads).

export type PostStatus = "draft" | "published";
export type LeadStatus = "new" | "contacted" | "archived";

export interface AdminPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImageUrl: string | null;
  tags: string[];
  status: PostStatus;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export type AdminPostSummary = Omit<AdminPost, "content">;

export interface Lead {
  id: string;
  name: string;
  email: string;
  company: string | null;
  projectType: string;
  budget: string | null;
  deadline: string | null;
  message: string;
  status: LeadStatus;
  createdAt: string;
}

export const postStatusLabels: Record<PostStatus, string> = {
  draft: "Rascunho",
  published: "Publicado",
};

export const leadStatusLabels: Record<LeadStatus, string> = {
  new: "Novo",
  contacted: "Contatado",
  archived: "Arquivado",
};

/**
 * Datas do admin sempre no horário de Brasília, para o servidor e o navegador
 * mostrarem o mesmo valor.
 */
export const TIME_ZONE = "America/Sao_Paulo";

export function formatDateTime(date: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
    timeZone: TIME_ZONE,
  }).format(new Date(date));
}

/** ISO -> "2026-10-02T14:30", o formato do <input type="datetime-local">. */
export function toDateTimeLocal(date: string | null) {
  if (!date) return "";
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-CA", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
      timeZone: TIME_ZONE,
    })
      .formatToParts(new Date(date))
      .map((part) => [part.type, part.value]),
  );
  return `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}`;
}
