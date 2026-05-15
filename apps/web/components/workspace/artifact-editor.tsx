"use client";

import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";

const Editor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center text-muted-foreground">
      <Loader2 className="h-6 w-6 animate-spin" />
    </div>
  ),
});

interface ArtifactEditorProps {
  value: string;
  onChange: (value: string) => void;
  language?: string;
}

export function ArtifactEditor({ value, onChange, language = "markdown" }: ArtifactEditorProps) {
  return (
    <div className="h-full min-h-[500px] rounded-lg border border-border overflow-hidden">
      <Editor
        height="100%"
        language={language}
        value={value}
        onChange={(v) => onChange(v ?? "")}
        theme="vs-dark"
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          fontFamily: "var(--font-geist-mono), monospace",
          lineNumbers: "on",
          wordWrap: "on",
          scrollBeyondLastLine: false,
          padding: { top: 16 },
          renderLineHighlight: "gutter",
        }}
      />
    </div>
  );
}
