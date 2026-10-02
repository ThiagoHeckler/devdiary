// Ícones de traço simples (24x24), herdam a cor do texto.
const paths: Record<string, React.ReactNode> = {
  // Janela de navegador
  sites: (
    <>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M3 9h18M7 6.5h.01M10 6.5h.01" />
    </>
  ),
  // Painel com gráfico
  sistemas: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M8 16v-4M12 16V8M16 16v-6" />
    </>
  ),
  // Raio
  automacoes: <path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z" />,
  // Faísca
  ia: (
    <path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3zM19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8L19 15z" />
  ),
};

export function ServiceIcon({ id, className = "" }: { id: string; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      {paths[id]}
    </svg>
  );
}

/** Ícone dentro de um quadrado com fundo na cor de destaque. */
export function ServiceIconBadge({ id }: { id: string }) {
  return (
    <span className="inline-flex size-11 items-center justify-center rounded-xl bg-accent-soft text-accent">
      <ServiceIcon id={id} className="size-6" />
    </span>
  );
}
