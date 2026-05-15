import Link from "next/link";
import { Plus } from "lucide-react";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { ProjectList } from "@/components/dashboard/project-list";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  return (
    <>
      <DashboardHeader title="Projects" description="Your engineering blueprints" />
      <div className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Manage and explore your generated specs
          </p>
          <Button size="sm" asChild>
            <Link href="/projects/new">
              <Plus className="mr-2 h-4 w-4" />
              New Project
            </Link>
          </Button>
        </div>
        <ProjectList />
      </div>
    </>
  );
}
