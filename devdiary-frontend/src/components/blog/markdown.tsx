import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";

/**
 * Renderiza o conteúdo dos posts. HTML cru dentro do Markdown é ignorado
 * (padrão do react-markdown), então o conteúdo não consegue injetar scripts.
 */
export function Markdown({ content }: { content: string }) {
  return (
    <div className="prose prose-stone max-w-none dark:prose-invert prose-headings:tracking-tight prose-a:text-accent">
      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
