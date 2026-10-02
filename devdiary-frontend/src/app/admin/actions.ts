"use server";

import { revalidatePath, updateTag } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  ApiError,
  API_URL,
  adminFetch,
  readErrorMessage,
} from "@/lib/admin-api";
import { ADMIN_COOKIE, ADMIN_COOKIE_PATH } from "@/lib/admin-cookie";
import type { AdminPost, LeadStatus } from "@/lib/admin-types";

export type FormState = { error?: string } | undefined;

/** Mesmo prazo do token na API (8 horas). */
const SESSION_SECONDS = 8 * 60 * 60;

export async function login(_state: FormState, formData: FormData): Promise<FormState> {
  let response: Response;
  try {
    response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: formData.get("email"),
        password: formData.get("password"),
      }),
      cache: "no-store",
    });
  } catch {
    return { error: "A API não respondeu. Confira se o backend está no ar." };
  }

  if (!response.ok) {
    return {
      error:
        response.status === 401
          ? "E-mail ou senha incorretos."
          : response.status === 429
            ? "Muitas tentativas. Espere 15 minutos e tente de novo."
            : response.status === 400
              ? "Informe um e-mail válido e a senha."
              : await readErrorMessage(response),
    };
  }

  const { accessToken } = (await response.json()) as { accessToken: string };
  (await cookies()).set(ADMIN_COOKIE, accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: ADMIN_COOKIE_PATH,
    maxAge: SESSION_SECONDS,
  });
  redirect("/admin/posts");
}

export async function logout() {
  (await cookies()).set(ADMIN_COOKIE, "", { path: ADMIN_COOKIE_PATH, maxAge: 0 });
  redirect("/admin/login");
}

function text(formData: FormData, name: string) {
  return String(formData.get(name) ?? "").trim();
}

/**
 * Cria ou atualiza um post. O botão clicado define o status
 * (name="status" no <button>).
 */
export async function savePost(_state: FormState, formData: FormData): Promise<FormState> {
  const id = text(formData, "id");
  // O campo é preenchido no horário de Brasília (sem horário de verão desde 2019).
  const publishedAtInput = text(formData, "publishedAt");
  const publishedAt = publishedAtInput ? new Date(`${publishedAtInput}:00-03:00`) : null;
  if (publishedAt && Number.isNaN(publishedAt.getTime())) {
    return { error: "Data de publicação inválida." };
  }

  const payload = {
    title: text(formData, "title"),
    slug: text(formData, "slug") || null,
    excerpt: text(formData, "excerpt"),
    content: String(formData.get("content") ?? ""),
    coverImageUrl: text(formData, "coverImageUrl") || null,
    tags: [
      ...new Set(
        text(formData, "tags")
          .split(",")
          .map((tag) => tag.trim().toLowerCase())
          .filter(Boolean),
      ),
    ],
    status: text(formData, "status") === "published" ? "published" : "draft",
    publishedAt: publishedAt?.toISOString() ?? null,
  };

  let post: AdminPost;
  try {
    post = await adminFetch<AdminPost>(id ? `/admin/posts/${id}` : "/admin/posts", {
      method: id ? "PATCH" : "POST",
      body: JSON.stringify(payload),
    });
  } catch (error) {
    if (error instanceof ApiError) return { error: error.message };
    throw error;
  }

  // Atualiza o blog público na hora.
  updateTag("posts");
  redirect(`/admin/posts/${post.id}?salvo=1`);
}

export async function deletePost(formData: FormData) {
  await adminFetch(`/admin/posts/${text(formData, "id")}`, { method: "DELETE" });
  updateTag("posts");
  redirect("/admin/posts?apagado=1");
}

export async function updateLeadStatus(formData: FormData) {
  const status = text(formData, "status") as LeadStatus;
  await adminFetch(`/admin/leads/${text(formData, "id")}`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
  revalidatePath("/admin/contatos");
}
