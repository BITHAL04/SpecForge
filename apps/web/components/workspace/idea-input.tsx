"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { createProject, startGeneration } from "@/lib/api/projects";
import { toastError, toastSuccess } from "@/lib/stores/toast-store";
import { ApiError } from "@/lib/api/client";
import { IDEA_KEY } from "@/components/marketing/hero-section";
import { Loader2 } from "lucide-react";
import { ProjectStatus, type Project } from "@specforge/shared";

export function IdeaInput() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [idea, setIdea] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const saved = sessionStorage.getItem(IDEA_KEY);
    if (saved) {
      setIdea(saved);
      sessionStorage.removeItem(IDEA_KEY);
    }
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (idea.length < 10) return;
    setLoading(true);
    try {
      const project = await createProject(idea);
      await queryClient.invalidateQueries({ queryKey: ["projects"] });
      try {
        await startGeneration(project.id);
        queryClient.setQueryData<Project>(["project", project.id], {
          ...project,
          status: ProjectStatus.GENERATING,
          generation_progress: 0,
        });
        toastSuccess("Project created", "Generation pipeline started.");
      } catch (genErr) {
        const message = genErr instanceof ApiError ? genErr.message : "Generation could not start";
        toastError("Project saved", `${message}. You can retry from the workspace.`);
      }
      router.push(`/projects/${project.id}`);
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Could not create project";
      toastError("Failed to create project", message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Textarea
        placeholder='e.g. "Build an Airbnb clone with host dashboards, instant booking, and Stripe payments"'
        value={idea}
        onChange={(e) => setIdea(e.target.value)}
        rows={5}
        required
        minLength={10}
        className="resize-none bg-white/[0.04] border-white/[0.08] text-[13px] leading-relaxed focus-visible:ring-white/20"
      />
      <div className="flex items-center justify-between">
        <p className="text-[11px] text-muted-foreground">{idea.length}/10000</p>
        <Button type="submit" disabled={loading || idea.length < 10}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {loading ? "Forging..." : "Generate blueprint"}
        </Button>
      </div>
    </form>
  );
}
