"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useProjects } from "@/lib/hooks/use-projects";
import { useUIStore } from "@/lib/stores/ui-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

const statusVariant: Record<string, "default" | "success" | "warning" | "secondary"> = {
  draft: "secondary",
  generating: "warning",
  completed: "success",
  failed: "default",
};

export function ProjectList() {
  const { data: projects, isLoading, isError } = useProjects();
  const searchQuery = useUIStore((s) => s.searchQuery);

  const filtered = projects?.filter(
    (p) =>
      !searchQuery ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.idea.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  if (isLoading) {
    return (
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-36 rounded-lg bg-white/10" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-lg border border-white/[0.08] p-12 text-center">
        <p className="text-[13px] text-muted-foreground">Could not load projects. Check your connection.</p>
      </div>
    );
  }

  if (!filtered?.length) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-white/[0.12] py-20 text-center">
        <p className="text-[13px] text-muted-foreground">No projects yet</p>
        <Button className="mt-4" size="sm" asChild>
          <Link href="/projects/new">Create your first project</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {filtered.map((project, i) => (
        <motion.div
          key={project.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.04 }}
        >
          <Link href={`/projects/${project.id}`}>
            <Card className="group linear-surface hover:bg-white/[0.04] transition-all duration-150 cursor-pointer border-white/[0.08]">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-[13px] font-medium line-clamp-1">{project.title}</CardTitle>
                  <ArrowRight className="h-3.5 w-3.5 text-muted-foreground opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all shrink-0" />
                </div>
                <Badge variant={statusVariant[project.status] ?? "secondary"} className="w-fit text-[10px] h-4 capitalize">
                  {project.status}
                </Badge>
              </CardHeader>
              <CardContent>
                <p className="text-[12px] text-muted-foreground line-clamp-2 leading-relaxed">{project.idea}</p>
                <div className="mt-4 h-0.5 rounded-full bg-white/[0.06] overflow-hidden">
                  <div className={cn("h-full rounded-full bg-white/40 transition-all")} style={{ width: `${project.generation_progress}%` }} />
                </div>
              </CardContent>
            </Card>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}
