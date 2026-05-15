"use client";

import Link from "next/link";
import { useProjects } from "@/lib/hooks/use-projects";
import { cn } from "@/lib/utils/cn";

export function ActivityPanel({ compact }: { compact?: boolean }) {
  const { data: projects } = useProjects();
  const recent = projects?.slice(0, 4) ?? [];

  return (
    <div>
      <p className="mb-2 px-2 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
        {compact ? "Recent" : "Recent Activity"}
      </p>
      <div className="space-y-0.5">
        {recent.length === 0 && (
          <p className="px-2 text-[11px] text-muted-foreground">No projects yet</p>
        )}
        {recent.map((project) => (
          <Link
            key={project.id}
            href={`/projects/${project.id}`}
            className="flex flex-col rounded-md px-2 py-1.5 text-[11px] hover:bg-white/[0.04] transition-colors"
          >
            <span className="truncate text-foreground/90">{project.title}</span>
            <span className={cn("capitalize mt-0.5", project.status === "completed" ? "text-emerald-400/80" : "text-muted-foreground")}>
              {project.status} · {project.generation_progress}%
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
