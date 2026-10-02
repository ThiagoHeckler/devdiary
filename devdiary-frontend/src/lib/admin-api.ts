import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_COOKIE } from "@/lib/admin-cookie";

export const API_URL = `${process.env.API_URL ?? "http://localhost:3000"}/api`;

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
  }
}

/** Junta as mensagens de erro do NestJS (texto ou lista) em uma frase. */
export async function readErrorMessage(response: Response) {
  try {
    const body = (await response.json()) as { message?: string | string[] };
    if (Array.isArray(body.message)) return body.message.join("; ");
    if (body.message) return body.message;
  } catch {
    // Resposta sem JSON.
  }
  return `Erro ${response.status} na API`;
}

/**
 * Chama uma rota protegida da API com o token do cookie.
 * Sem token ou com token vencido, manda para a tela de login.
 */
export async function adminFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = (await cookies()).get(ADMIN_COOKIE)?.value;
  if (!token) redirect("/admin/login");

  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    cache: "no-store",
    headers: {
      ...(init.body ? { "Content-Type": "application/json" } : {}),
      ...init.headers,
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.status === 401) redirect("/admin/login?expirou=1");
  if (!response.ok) {
    throw new ApiError(response.status, await readErrorMessage(response));
  }
  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}
