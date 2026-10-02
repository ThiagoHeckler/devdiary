import type { Metadata } from "next";
import { updateLeadStatus } from "@/app/admin/actions";
import {
  AdminPagination,
  StatusFilter,
  parsePage,
  parseStatus,
} from "@/components/admin/pagination";
import { adminFetch } from "@/lib/admin-api";
import {
  formatDateTime,
  leadStatusLabels,
  type Lead,
  type LeadStatus,
} from "@/lib/admin-types";
import { budgets, deadlines, projectTypes } from "@/lib/contact";
import type { Paginated } from "@/lib/posts";

export const metadata: Metadata = {
  title: "Contatos",
};

const statuses = ["new", "contacted", "archived"] as const;

function label(options: { value: string; label: string }[], value: string | null) {
  return options.find((option) => option.value === value)?.label ?? value;
}

/** Ações disponíveis para cada status. */
const nextActions: Record<LeadStatus, { status: LeadStatus; label: string }[]> = {
  new: [
    { status: "contacted", label: "Marcar como contatado" },
    { status: "archived", label: "Arquivar" },
  ],
  contacted: [
    { status: "archived", label: "Arquivar" },
    { status: "new", label: "Voltar para novo" },
  ],
  archived: [{ status: "new", label: "Voltar para novo" }],
};

export default async function LeadsPage({ searchParams }: PageProps<"/admin/contatos">) {
  const query = await searchParams;
  const page = parsePage(query.page);
  // Sem filtro na URL, mostra os novos: é o que pede atenção.
  const status = query.status === "todos" ? undefined : (parseStatus(query.status, statuses) ?? "new");

  const params = new URLSearchParams({ page: String(page), limit: "20" });
  if (status) params.set("status", status);
  const { items, totalPages, total } = await adminFetch<Paginated<Lead>>(`/admin/leads?${params}`);

  return (
    <>
      <h1 className="text-2xl font-semibold tracking-tight">Contatos</h1>

      <div className="mt-6">
        <StatusFilter
          basePath="/admin/contatos"
          current={status ?? "todos"}
          options={[
            { value: "new", label: "Novos" },
            { value: "contacted", label: "Contatados" },
            { value: "archived", label: "Arquivados" },
            { value: "todos", label: "Todos" },
          ]}
        />
      </div>

      {items.length === 0 ? (
        <p className="mt-10 text-muted">Nenhum contato por aqui.</p>
      ) : (
        <>
          <p className="mt-6 text-sm text-muted">
            {total} {total === 1 ? "contato" : "contatos"}
          </p>
          <ul className="mt-3 space-y-4">
            {items.map((lead) => (
              <li key={lead.id} className="rounded-2xl border border-border bg-surface p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-medium">
                      {lead.name}
                      {lead.company && <span className="text-muted"> · {lead.company}</span>}
                    </p>
                    <a
                      href={`mailto:${lead.email}`}
                      className="text-sm text-accent hover:text-accent-hover"
                    >
                      {lead.email}
                    </a>
                  </div>
                  <div className="text-right text-sm text-muted">
                    <p>{formatDateTime(lead.createdAt)}</p>
                    <p>{leadStatusLabels[lead.status]}</p>
                  </div>
                </div>

                <dl className="mt-4 flex flex-wrap gap-x-6 gap-y-1 text-sm">
                  <div className="flex gap-1">
                    <dt className="text-muted">Projeto:</dt>
                    <dd>{label(projectTypes, lead.projectType)}</dd>
                  </div>
                  <div className="flex gap-1">
                    <dt className="text-muted">Orçamento:</dt>
                    <dd>{label(budgets, lead.budget) ?? "-"}</dd>
                  </div>
                  <div className="flex gap-1">
                    <dt className="text-muted">Prazo:</dt>
                    <dd>{label(deadlines, lead.deadline) ?? "-"}</dd>
                  </div>
                </dl>

                <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed">{lead.message}</p>

                <div className="mt-4 flex flex-wrap gap-2 border-t border-border pt-4">
                  {nextActions[lead.status].map((action) => (
                    <form key={action.status} action={updateLeadStatus}>
                      <input type="hidden" name="id" value={lead.id} />
                      <input type="hidden" name="status" value={action.status} />
                      <button
                        type="submit"
                        className="rounded-full border border-border px-3 py-1 text-sm transition-colors hover:border-accent hover:text-accent"
                      >
                        {action.label}
                      </button>
                    </form>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        </>
      )}

      <AdminPagination
        basePath="/admin/contatos"
        page={page}
        totalPages={totalPages}
        params={{ status: status ?? "todos" }}
      />
    </>
  );
}
