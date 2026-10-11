"use client";

import { useSyncExternalStore } from "react";
import { THEME_STORAGE_KEY } from "@/lib/theme";

type Theme = "light" | "dark";

function readTheme(): Theme {
  return document.documentElement.dataset.theme === "light" ? "light" : "dark";
}

// Acompanha o data-theme do <html>, para todos os botões ficarem em sincronia.
function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributeFilter: ["data-theme"] });
  return () => observer.disconnect();
}

export function ThemeToggle({ className = "" }: { className?: string }) {
  // No servidor não dá para saber o tema salvo; null evita o ícone errado.
  const theme = useSyncExternalStore<Theme | null>(subscribe, readTheme, () => null);
  const next: Theme = theme === "light" ? "dark" : "light";

  function toggle() {
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // Sem localStorage (aba anônima, por exemplo) a troca vale só nesta página.
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={next === "light" ? "Usar tema claro" : "Usar tema escuro"}
      title={next === "light" ? "Tema claro" : "Tema escuro"}
      className={`inline-flex size-9 items-center justify-center rounded-full border border-border text-muted transition-colors hover:border-accent hover:text-foreground ${className}`}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        className="size-[18px]"
      >
        {theme === null ? null : next === "light" ? (
          // Sol: clicar leva ao tema claro
          <>
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
          </>
        ) : (
          // Lua: clicar leva ao tema escuro
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        )}
      </svg>
    </button>
  );
}
