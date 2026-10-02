"use client";

import { Container } from "@/components/container";

export default function BlogError({ retry }: { error: Error; retry: () => void }) {
  return (
    <Container className="flex flex-1 flex-col items-center justify-center py-24 text-center">
      <h1 className="text-2xl font-semibold tracking-tight">
        Não foi possível carregar o blog
      </h1>
      <p className="mt-4 max-w-md text-muted">
        Houve um problema ao buscar os posts. Tente de novo em instantes.
      </p>
      <button
        type="button"
        onClick={() => retry()}
        className="mt-8 rounded-full bg-accent px-6 py-3 font-medium text-accent-foreground transition-colors hover:bg-accent-hover"
      >
        Tentar novamente
      </button>
    </Container>
  );
}
