"use client";

import { useActionState, useState, useTransition } from "react";
import { savePost } from "@/app/admin/actions";
import { Markdown } from "@/components/blog/markdown";
import {
  errorBoxClass,
  inputClass,
  labelClass,
  primaryButtonClass,
  secondaryButtonClass,
} from "@/components/admin/styles";
import { toDateTimeLocal, type AdminPost } from "@/lib/admin-types";

type Tab = "write" | "preview";

export function PostEditor({ post }: { post?: AdminPost }) {
  const [state, formAction, pending] = useActionState(savePost, undefined);
  const [, startTransition] = useTransition();
  const [tab, setTab] = useState<Tab>("write");
  const [content, setContent] = useState(post?.content ?? "");

  const published = post?.status === "published";

  // Com JavaScript, o envio passa pelo onSubmit: o React limpa o formulário
  // depois de uma action, e o texto se perderia se o salvamento falhasse.
  // O action={formAction} fica para o envio sem JavaScript.
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(
      event.currentTarget,
      (event.nativeEvent as SubmitEvent).submitter,
    );
    startTransition(() => formAction(formData));
  }

  return (
    <form action={formAction} onSubmit={handleSubmit} className="space-y-6">
      {post && <input type="hidden" name="id" value={post.id} />}

      <div>
        <label htmlFor="title" className={labelClass}>
          Título *
        </label>
        <input
          id="title"
          name="title"
          required
          minLength={3}
          maxLength={200}
          defaultValue={post?.title}
          className={`${inputClass} text-lg font-medium`}
        />
      </div>

      <div>
        <label htmlFor="excerpt" className={labelClass}>
          Resumo *{" "}
          <span className="font-normal text-muted">
            (aparece na lista do blog, no Google e nas prévias de link)
          </span>
        </label>
        <textarea
          id="excerpt"
          name="excerpt"
          required
          minLength={10}
          maxLength={300}
          rows={2}
          defaultValue={post?.excerpt}
          className={inputClass}
        />
      </div>

      <div>
        <div className="flex items-end justify-between gap-4">
          <span className={labelClass}>Conteúdo * (Markdown)</span>
          <div role="tablist" className="flex gap-1 text-sm">
            {(
              [
                ["write", "Escrever"],
                ["preview", "Pré-visualizar"],
              ] as const
            ).map(([value, label]) => (
              <button
                key={value}
                type="button"
                role="tab"
                aria-selected={tab === value}
                onClick={() => setTab(value)}
                className="rounded-md px-3 py-1 text-muted hover:text-foreground aria-selected:bg-accent-soft aria-selected:text-foreground"
              >
                {label}
              </button>
            ))}
          </div>
        </div>
        <textarea
          id="content"
          name="content"
          aria-label="Conteúdo em Markdown"
          required
          maxLength={100_000}
          rows={24}
          value={content}
          onChange={(event) => setContent(event.target.value)}
          hidden={tab !== "write"}
          className={`${inputClass} font-mono text-sm leading-relaxed`}
        />
        {tab === "preview" && (
          <div className="mt-2 min-h-96 rounded-lg border border-border bg-surface p-6">
            {content.trim() ? (
              <Markdown content={content} />
            ) : (
              <p className="text-muted">Nada para mostrar ainda.</p>
            )}
          </div>
        )}
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="slug" className={labelClass}>
            Slug <span className="font-normal text-muted">(endereço do post)</span>
          </label>
          <input
            id="slug"
            name="slug"
            maxLength={220}
            pattern="[a-z0-9]+(-[a-z0-9]+)*"
            title="Só letras minúsculas, números e hífens"
            placeholder="gerado a partir do título"
            defaultValue={post?.slug}
            className={`${inputClass} font-mono text-sm`}
          />
          {published && (
            <p className="mt-2 text-xs text-muted">
              Mudar o slug de um post publicado quebra os links já compartilhados.
            </p>
          )}
        </div>
        <div>
          <label htmlFor="tags" className={labelClass}>
            Tags <span className="font-normal text-muted">(separadas por vírgula)</span>
          </label>
          <input
            id="tags"
            name="tags"
            placeholder="nextjs, automacao, ia"
            defaultValue={post?.tags.join(", ")}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="coverImageUrl" className={labelClass}>
            URL da imagem de capa <span className="font-normal text-muted">(opcional)</span>
          </label>
          <input
            id="coverImageUrl"
            name="coverImageUrl"
            type="url"
            maxLength={500}
            placeholder="https://..."
            defaultValue={post?.coverImageUrl ?? ""}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="publishedAt" className={labelClass}>
            Data de publicação{" "}
            <span className="font-normal text-muted">(horário de Brasília)</span>
          </label>
          <input
            id="publishedAt"
            name="publishedAt"
            type="datetime-local"
            defaultValue={toDateTimeLocal(post?.publishedAt ?? null)}
            className={inputClass}
          />
          <p className="mt-2 text-xs text-muted">
            Em branco, vale o momento em que você publicar. Uma data futura agenda o post.
          </p>
        </div>
      </div>

      {state?.error && (
        <p role="alert" className={errorBoxClass}>
          {state.error}
        </p>
      )}

      {/* O botão principal vem primeiro no HTML porque o Enter num campo
          aciona o primeiro botão; a ordem na tela é invertida pelo CSS. */}
      <div className="flex flex-row-reverse flex-wrap items-center justify-start gap-3 border-t border-border pt-6">
        <button
          type="submit"
          name="status"
          value="published"
          disabled={pending}
          className={primaryButtonClass}
        >
          {pending ? "Salvando..." : published ? "Salvar" : "Publicar"}
        </button>
        <button
          type="submit"
          name="status"
          value="draft"
          disabled={pending}
          className={secondaryButtonClass}
        >
          {published ? "Despublicar" : "Salvar rascunho"}
        </button>
      </div>
    </form>
  );
}
