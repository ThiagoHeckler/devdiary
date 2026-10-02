import type { Metadata } from "next";
import { LoginForm } from "@/components/admin/login-form";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Entrar",
};

export default async function LoginPage({ searchParams }: PageProps<"/admin/login">) {
  const { expirou } = await searchParams;

  return (
    <main className="flex flex-1 items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm">
        <p className="text-center font-mono text-lg font-semibold">
          <span className="text-accent">&lt;</span>
          {siteConfig.name}
          <span className="text-accent"> /&gt;</span>
        </p>
        <h1 className="mt-2 text-center text-2xl font-semibold tracking-tight">
          Painel admin
        </h1>
        {expirou && (
          <p className="mt-6 text-center text-sm text-muted">
            Sua sessão expirou. Entre de novo.
          </p>
        )}
        <div className="mt-8 rounded-2xl border border-border bg-surface p-6">
          <LoginForm />
        </div>
      </div>
    </main>
  );
}
