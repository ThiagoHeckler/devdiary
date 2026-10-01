"use client";

import { useState } from "react";
import { budgets, deadlines, projectTypes } from "@/lib/contact";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000"}/api`;

type Status =
  | { state: "idle" }
  | { state: "submitting" }
  | { state: "success" }
  | { state: "error"; message: string };

const inputClass =
  "mt-2 w-full rounded-lg border border-border bg-surface px-4 py-2.5 outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-accent/30";
const labelClass = "block text-sm font-medium";

export function ContactForm() {
  const [status, setStatus] = useState<Status>({ state: "idle" });

  // Usa onSubmit em vez de <form action>: o React limpa o formulário depois
  // de uma action, e o visitante perderia o que digitou se o envio falhasse.
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus({ state: "submitting" });

    const data = Object.fromEntries(new FormData(event.currentTarget));
    try {
      const response = await fetch(`${API_URL}/leads`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setStatus({ state: "success" });
        return;
      }
      setStatus({
        state: "error",
        message:
          response.status === 429
            ? "Muitos envios em pouco tempo. Tente de novo mais tarde."
            : response.status === 400
              ? "Confira os campos e tente de novo."
              : "Não foi possível enviar agora. Tente de novo em instantes.",
      });
    } catch {
      setStatus({
        state: "error",
        message: "Não foi possível enviar. Verifique sua conexão e tente de novo.",
      });
    }
  }

  if (status.state === "success") {
    return (
      <div role="status" className="rounded-2xl border border-accent bg-accent-soft p-8">
        <h2 className="text-xl font-semibold">Mensagem enviada!</h2>
        <p className="mt-2">
          Obrigado pelo contato. Respondo por e-mail, normalmente em até 2 dias úteis.
        </p>
      </div>
    );
  }

  const submitting = status.state === "submitting";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className={labelClass}>
            Nome *
          </label>
          <input id="name" name="name" required minLength={2} maxLength={100} autoComplete="name" className={inputClass} />
        </div>
        <div>
          <label htmlFor="email" className={labelClass}>
            E-mail *
          </label>
          <input id="email" name="email" type="email" required maxLength={254} autoComplete="email" className={inputClass} />
        </div>
      </div>

      <div>
        <label htmlFor="company" className={labelClass}>
          Empresa <span className="font-normal text-muted">(opcional)</span>
        </label>
        <input id="company" name="company" maxLength={100} autoComplete="organization" className={inputClass} />
      </div>

      <div className="grid gap-6 sm:grid-cols-3">
        <div>
          <label htmlFor="projectType" className={labelClass}>
            Tipo de projeto *
          </label>
          <select id="projectType" name="projectType" required defaultValue="" className={inputClass}>
            <option value="" disabled>
              Selecione
            </option>
            {projectTypes.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="budget" className={labelClass}>
            Orçamento
          </label>
          <select id="budget" name="budget" defaultValue="" className={inputClass}>
            <option value="">Prefiro não dizer</option>
            {budgets.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="deadline" className={labelClass}>
            Prazo
          </label>
          <select id="deadline" name="deadline" defaultValue="" className={inputClass}>
            <option value="">Prefiro não dizer</option>
            {deadlines.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="message" className={labelClass}>
          Conte sobre o projeto *
        </label>
        <textarea
          id="message"
          name="message"
          required
          minLength={20}
          maxLength={5000}
          rows={6}
          placeholder="O que você precisa, para quem é e o que já existe hoje."
          className={inputClass}
        />
      </div>

      {/* Armadilha para bots: invisível para pessoas, preenchida por robôs. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="website">Não preencha este campo</label>
        <input id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      {status.state === "error" && (
        <p role="alert" className="rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm">
          {status.message}
        </p>
      )}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted">
          Seus dados são usados só para responder este contato.
        </p>
        <button
          type="submit"
          disabled={submitting}
          className="rounded-full bg-accent px-6 py-3 font-medium text-accent-foreground transition-colors hover:bg-accent-hover disabled:cursor-wait disabled:opacity-70"
        >
          {submitting ? "Enviando..." : "Enviar mensagem"}
        </button>
      </div>
    </form>
  );
}
