"use client";

import { CheckCircle2, AlertCircle, X } from "lucide-react";
import { useToastStore } from "@/lib/stores/toast-store";
import { cn } from "@/lib/utils/cn";

export function Toaster() {
  const { toasts, dismiss } = useToastStore();

  if (!toasts.length) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 w-full max-w-sm pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={cn(
            "pointer-events-auto flex items-start gap-3 rounded-lg border px-4 py-3 shadow-2xl backdrop-blur-xl animate-in slide-in-from-bottom-2",
            t.variant === "success" && "border-emerald-500/30 bg-emerald-500/10",
            t.variant === "error" && "border-red-500/30 bg-red-500/10",
            t.variant === "default" && "border-white/[0.08] bg-[#0a0a0a]/95",
          )}
        >
          {t.variant === "success" && <CheckCircle2 className="h-4 w-4 text-emerald-400 mt-0.5 shrink-0" />}
          {t.variant === "error" && <AlertCircle className="h-4 w-4 text-red-400 mt-0.5 shrink-0" />}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium">{t.title}</p>
            {t.description && <p className="text-xs text-muted-foreground mt-0.5">{t.description}</p>}
          </div>
          <button onClick={() => dismiss(t.id)} className="text-muted-foreground hover:text-foreground">
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
}
