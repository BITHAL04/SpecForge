"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { MermaidRenderer } from "@/components/diagrams/mermaid-renderer";
import type { ArtifactSection } from "@specforge/shared";

function MarkdownContent({ content }: { content: string }) {
  return (
    <div className="markdown-body text-sm leading-relaxed text-muted-foreground [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:text-foreground [&_h1]:mb-4 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-foreground [&_h2]:mt-8 [&_h2]:mb-3 [&_h3]:text-lg [&_h3]:font-medium [&_h3]:text-foreground [&_h3]:mt-6 [&_h3]:mb-2 [&_p]:mb-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-4 [&_li]:mb-1 [&_code]:rounded [&_code]:bg-white/[0.06] [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:text-[#8B9DFF] [&_code]:text-xs [&_pre]:rounded-lg [&_pre]:border [&_pre]:border-white/[0.08] [&_pre]:bg-white/[0.02] [&_pre]:p-4 [&_pre]:overflow-x-auto [&_pre]:mb-4 [&_a]:text-[#8B9DFF] [&_a]:underline">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || "");
            const lang = match ? match[1] : "";
            const codeString = String(children).replace(/\n$/, "");
            if (lang === "mermaid") {
              return <MermaidRenderer chart={codeString} />;
            }
            return (
              <code className={className} {...props}>
                {children}
              </code>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

interface ArtifactViewerProps {
  title: string;
  content: string;
  sections?: ArtifactSection[];
  format?: string;
}

export function ArtifactViewer({ title, content, sections, format }: ArtifactViewerProps) {
  const isMermaid =
    format === "mermaid" ||
    format === "MERMAID" ||
    content.trim().startsWith("erDiagram") ||
    content.trim().startsWith("graph ") ||
    content.trim().startsWith("flowchart ") ||
    content.trim().startsWith("sequenceDiagram");

  const isOpenApi = format === "openapi" || format === "json" || content.trim().startsWith("openapi:");

  return (
    <div className="mx-auto max-w-3xl">
      <h2 className="text-2xl font-bold tracking-tight mb-6 text-white">{title}</h2>

      {sections && sections.length > 0 ? (
        <div className="space-y-10">
          {sections.map((section) => (
            <section key={section.id}>
              <h3 className="text-lg font-semibold mb-4 text-foreground">{section.title}</h3>
              {section.format === "mermaid" ? (
                <MermaidRenderer chart={section.content} />
              ) : section.format === "openapi" || section.format === "json" ? (
                <pre className="overflow-x-auto rounded-lg border border-white/[0.08] bg-white/[0.02] p-4 text-xs font-mono text-muted-foreground">
                  {section.content}
                </pre>
              ) : (
                <MarkdownContent content={section.content} />
              )}
            </section>
          ))}
        </div>
      ) : isMermaid ? (
        <MermaidRenderer chart={content} />
      ) : isOpenApi ? (
        <pre className="overflow-x-auto rounded-lg border border-white/[0.08] bg-white/[0.02] p-4 text-xs font-mono text-muted-foreground">
          {content}
        </pre>
      ) : content ? (
        <MarkdownContent content={content} />
      ) : (
        <p className="text-muted-foreground text-sm">No content yet.</p>
      )}
    </div>
  );
}
