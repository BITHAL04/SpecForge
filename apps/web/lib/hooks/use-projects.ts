import { useQuery } from "@tanstack/react-query";
import { listProjects } from "@/lib/api/projects";

export function useProjects() {
  return useQuery({
    queryKey: ["projects"],
    queryFn: listProjects,
    retry: 1,
  });
}
