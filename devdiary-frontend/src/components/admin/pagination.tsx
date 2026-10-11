import Link from "next/link";

/** Links de página anterior/próxima mantendo os outros filtros da URL. */
export function AdminPagination({
  basePath,
  page,
  totalPages,
  params = {},
}: {
  basePath: string;
  page: number;
  totalPages: number;
  params?: Record<string, string | undefined>;
}) {
  if (totalPages <= 1) return null;

  const href = (target: number) => {
    const query = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
      if (value) query.set(key, value);
    }
    if (target > 1) query.set("page", String(target));
    const search = query.toString();
    return search ? `${basePath}?${search}` : basePath;
  };

  return (
    <nav aria-label="Paginação" className="mt-8 flex items-center justify-between text-sm">
      {page > 1 ? (
        <Link href={href(page - 1)} className="font-medium text-accent hover:text-accent-hover">
          ← Anterior
        </Link>
      ) : (
        <span />
      )}
      <span className="text-muted">
        Página {page} de {totalPages}
      </span>
      {page < totalPages ? (
        <Link href={href(page + 1)} className="font-medium text-accent hover:text-accent-hover">
          Próxima →
        </Link>
      ) : (
        <span />
      )}
    </nav>
  );
}

/** Abas de filtro por status. */
export function StatusFilter({
  basePath,
  current,
  options,
}: {
  basePath: string;
  current?: string;
  options: { value?: string; label: string }[];
}) {
  return (
    <nav aria-label="Filtrar por status" className="flex flex-wrap gap-2">
      {options.map((option) => (
        <Link
          key={option.label}
          href={option.value ? `${basePath}?status=${option.value}` : basePath}
          aria-current={current === option.value ? "page" : undefined}
          className="rounded-full border border-border px-3 py-1 text-sm text-muted transition-colors hover:text-foreground aria-[current=page]:border-accent aria-[current=page]:bg-accent-soft aria-[current=page]:text-foreground"
        >
          {option.label}
        </Link>
      ))}
    </nav>
  );
}

export function parsePage(value: string | string[] | undefined) {
  const page = Number(Array.isArray(value) ? value[0] : (value ?? 1));
  return Number.isInteger(page) && page >= 1 ? page : 1;
}

export function parseStatus<T extends string>(
  value: string | string[] | undefined,
  allowed: readonly T[],
): T | undefined {
  const status = Array.isArray(value) ? value[0] : value;
  return allowed.find((item) => item === status);
}
