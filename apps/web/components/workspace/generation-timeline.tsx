"use client";

import { useGenerationEvents } from "@/lib/hooks/use-generation-events";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";

export function GenerationTimeline({ projectId, enabled = true }: { projectId: string; enabled?: boolean }) {
  const events = useGenerationEvents(projectId, enabled);

  return (
    <aside className="hidden lg:flex w-64 flex-col border-l border-white/[0.08] bg-background">
      <div className="flex h-12 items-center justify-between border-b border-white/[0.08] px-4">
        <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Timeline</p>
        {events.length > 0 && <Badge variant="secondary" className="text-[10px] h-4">{events.length}</Badge>}
      </div>
      <ScrollArea className="flex-1">
        <div className="space-y-0.5 p-2">
          {events.length === 0 && (
            <p className="px-2 py-6 text-[11px] text-muted-foreground text-center">No events yet</p>
          )}
          {events.map((event) => (
            <div key={event.id} className="flex gap-2 rounded-md px-2 py-2 hover:bg-white/[0.04]">
              {event.event_type === "error" ? (
                <AlertCircle className="h-3.5 w-3.5 text-red-400 shrink-0 mt-0.5" />
              ) : event.event_type === "completed" ? (
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <Loader2 className="h-3.5 w-3.5 animate-spin text-[#5E6AD2] shrink-0 mt-0.5" />
              )}
              <div className="min-w-0">
                <p className="text-[11px] text-foreground/90 leading-relaxed">{event.message}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">
                  {new Date(event.created_at).toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </aside>
  );
}
