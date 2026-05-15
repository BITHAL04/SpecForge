"use client";

import { useEffect, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import type { GenerationEvent } from "@specforge/shared";
import { GenerationEventType } from "@specforge/shared";
import { getGenerationStreamUrl, listProjectEvents } from "@/lib/api/generation";

function refreshGenerationQueries(queryClient: ReturnType<typeof useQueryClient>, projectId: string) {
  queryClient.invalidateQueries({ queryKey: ["project", projectId] });
  queryClient.invalidateQueries({ queryKey: ["artifacts", projectId] });
  queryClient.invalidateQueries({ queryKey: ["artifact", projectId] });
}

function isTerminalEvent(event: GenerationEvent) {
  return (
    event.event_type === GenerationEventType.COMPLETED ||
    event.event_type === GenerationEventType.ERROR
  );
}

export function useGenerationEvents(projectId: string, enabled = true) {
  const queryClient = useQueryClient();
  const [events, setEvents] = useState<GenerationEvent[]>([]);
  const seen = useRef(new Set<string>());
  const finished = useRef(false);

  useEffect(() => {
    if (!enabled || !projectId) return;

    let cancelled = false;
    let es: EventSource | null = null;
    let streamConnected = false;

    function markFinished() {
      finished.current = true;
      es?.close();
      es = null;
      streamConnected = false;
    }

    function ingestEvent(event: GenerationEvent, appendOnly = false) {
      if (seen.current.has(event.id)) return;
      seen.current.add(event.id);
      setEvents((prev) => (appendOnly ? [...prev, event] : prev));
      refreshGenerationQueries(queryClient, projectId);
      if (isTerminalEvent(event)) {
        markFinished();
      }
    }

    async function pollEvents() {
      if (finished.current) return;
      try {
        const data = await listProjectEvents(projectId);
        if (cancelled) return;
        setEvents(data);
        for (const event of data) {
          if (seen.current.has(event.id)) continue;
          seen.current.add(event.id);
          refreshGenerationQueries(queryClient, projectId);
          if (isTerminalEvent(event)) {
            markFinished();
          }
        }
      } catch {
        /* polling fallback */
      }
    }

    function connectStream() {
      const token = localStorage.getItem("access_token");
      if (!token || finished.current) return;

      es = new EventSource(getGenerationStreamUrl(projectId, token));
      es.onopen = () => {
        streamConnected = true;
      };
      es.addEventListener("generation", (e) => {
        try {
          ingestEvent(JSON.parse(e.data) as GenerationEvent, true);
        } catch {
          /* ignore malformed events */
        }
      });
      es.onerror = () => {
        streamConnected = false;
        es?.close();
        es = null;
      };
    }

    finished.current = false;
    seen.current.clear();
    pollEvents();
    connectStream();
    const interval = setInterval(() => {
      if (!finished.current && !streamConnected) {
        void pollEvents();
      }
    }, 1000);

    return () => {
      cancelled = true;
      clearInterval(interval);
      es?.close();
    };
  }, [projectId, enabled, queryClient]);

  return events;
}
