"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { IdeaInput } from "@/components/workspace/idea-input";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";

export default function NewProjectPage() {
  return (
    <>
      <DashboardHeader title="New Project" description="Describe your product idea" />
      <div className="flex items-center justify-center min-h-[calc(100vh-3.5rem)] p-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-2xl"
        >
          <div className="mb-8 text-center">
            <div className="mb-4 inline-flex rounded-lg border border-white/[0.08] bg-white/[0.04] p-3">
              <Sparkles className="h-6 w-6 text-[#8B9DFF]" />
            </div>
            <h2 className="text-2xl font-medium tracking-tight">What are you building?</h2>
            <p className="mx-auto mt-2 max-w-md text-[13px] text-muted-foreground">
              Enter your product idea and SpecForge will generate a complete engineering blueprint.
            </p>
          </div>
          <div className="linear-surface rounded-lg p-6">
            <IdeaInput />
          </div>
        </motion.div>
      </div>
    </>
  );
}
