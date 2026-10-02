"use client";

import { useActionState } from "react";
import { login } from "@/app/admin/actions";
import {
  errorBoxClass,
  inputClass,
  labelClass,
  primaryButtonClass,
} from "@/components/admin/styles";

export function LoginForm() {
  const [state, formAction, pending] = useActionState(login, undefined);

  return (
    <form action={formAction} className="space-y-5">
      <div>
        <label htmlFor="email" className={labelClass}>
          E-mail
        </label>
        <input id="email" name="email" type="email" required autoComplete="username" className={inputClass} />
      </div>
      <div>
        <label htmlFor="password" className={labelClass}>
          Senha
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className={inputClass}
        />
      </div>

      {state?.error && (
        <p role="alert" className={errorBoxClass}>
          {state.error}
        </p>
      )}

      <button type="submit" disabled={pending} className={`w-full ${primaryButtonClass}`}>
        {pending ? "Entrando..." : "Entrar"}
      </button>
    </form>
  );
}
