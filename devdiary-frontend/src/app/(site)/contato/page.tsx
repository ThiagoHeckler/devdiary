import type { Metadata } from "next";
import { ContactForm } from "@/components/contact-form";
import { Container } from "@/components/container";
import { projectTypes } from "@/lib/contact";

export const metadata: Metadata = {
  title: "Contato",
  description:
    "Conte sobre o seu projeto de site, sistema web, automação ou IA e receba os próximos passos e uma estimativa inicial.",
  alternates: { canonical: "/contato" },
};

export default async function ContactPage({ searchParams }: PageProps<"/contato">) {
  // /contato?tipo=site, vindo da página de serviços, já deixa o tipo escolhido.
  const { tipo } = await searchParams;
  const defaultProjectType = projectTypes.some((type) => type.value === tipo)
    ? (tipo as string)
    : undefined;

  return (
    <Container className="py-16 sm:py-20">
      <div className="grid gap-12 lg:grid-cols-[1fr_2fr]">
        <header>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Vamos conversar sobre o seu projeto
          </h1>
          <p className="mt-4 text-lg text-muted">
            Conte o que você precisa. Respondo com os próximos passos e uma
            estimativa inicial.
          </p>
          <ul className="mt-8 space-y-3 text-muted">
            <li>✓ Resposta por e-mail, normalmente em até 2 dias úteis</li>
            <li>✓ Sem compromisso</li>
            <li>✓ Orçamento e prazo ajudam, mas são opcionais</li>
          </ul>
        </header>
        <ContactForm defaultProjectType={defaultProjectType} />
      </div>
    </Container>
  );
}
