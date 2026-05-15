"use client";

import { useEffect, useRef, useId } from "react";

export function MermaidRenderer({ chart }: { chart: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const id = useId().replace(/:/g, "");

  useEffect(() => {
    let active = true;
    
    import("mermaid")
      .then((m) => {
        if (!active) return;
        const mermaid = m.default;
        
        mermaid.initialize({
          theme: "dark",
          startOnLoad: false,
          securityLevel: "loose",
          fontFamily: "var(--font-geist-sans), sans-serif",
        });

        if (!ref.current || !chart.trim()) return;

        // Clear previous content
        ref.current.innerHTML = "";

        mermaid
          .render(`mermaid-${id}`, chart)
          .then(({ svg }) => {
            if (active && ref.current) {
              ref.current.innerHTML = svg;
            }
          })
          .catch((err) => {
            console.error("Mermaid async rendering error:", err);
            if (active && ref.current) {
              ref.current.innerHTML = `<pre class="text-xs text-red-400/80 bg-red-950/20 border border-red-900/30 p-4 rounded-lg overflow-auto w-full font-mono">${chart}</pre>`;
            }
          });
      })
      .catch((err) => {
        console.error("Failed to load mermaid dynamically:", err);
        if (active && ref.current) {
          ref.current.innerHTML = `<pre class="text-xs text-red-400/80 bg-red-950/20 border border-red-900/30 p-4 rounded-lg overflow-auto w-full font-mono">${chart}</pre>`;
        }
      });

    return () => {
      active = false;
    };
  }, [chart, id]);

  return (
    <div
      ref={ref}
      className="my-4 flex justify-center overflow-auto rounded-lg border border-white/[0.08] bg-white/[0.02] p-6 min-h-[200px]"
    />
  );
}


