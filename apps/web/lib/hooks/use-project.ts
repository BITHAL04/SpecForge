"use client";

import { useQuery } from "@tanstack/react-query";
import { getProject } from "@/lib/api/projects";
import type { ProjectStatus } from "@specforge/shared";

export function useProject(projectId: string) {
  return useQuery({
    queryKey: ["project", projectId],
    queryFn: () => getProject(projectId),
    refetchInterval: (query) => {
      const status = query.state.data?.status as ProjectStatus | undefined;
      return status === "generating" ? 1000 : false;
    },
  });
}
