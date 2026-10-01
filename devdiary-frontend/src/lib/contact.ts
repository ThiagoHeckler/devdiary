// Mesmos valores aceitos pela API (devdiary-backend/src/leads/entities/lead.entity.ts).
export const projectTypes = [
  { value: "site", label: "Site" },
  { value: "sistema", label: "Sistema web" },
  { value: "automacao", label: "Automação" },
  { value: "ia", label: "Solução com IA" },
  { value: "outro", label: "Outro" },
];

export const budgets = [
  { value: "ate-3k", label: "Até R$ 3 mil" },
  { value: "3k-10k", label: "R$ 3 mil a R$ 10 mil" },
  { value: "10k-30k", label: "R$ 10 mil a R$ 30 mil" },
  { value: "acima-30k", label: "Acima de R$ 30 mil" },
  { value: "nao-sei", label: "Ainda não sei" },
];

export const deadlines = [
  { value: "urgente", label: "Urgente (até 1 mês)" },
  { value: "1-3-meses", label: "1 a 3 meses" },
  { value: "sem-pressa", label: "Sem pressa" },
];
