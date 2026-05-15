"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { isAuthenticated } from "@/lib/auth/session";

const IDEA_KEY = "specforge_idea";

export function HeroSection() {
  const router = useRouter();
  const [idea, setIdea] = useState("");

  useEffect(() => {
    const saved = sessionStorage.getItem(IDEA_KEY);
    if (saved) setIdea(saved);
  }, []);

  function handleStart(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = idea.trim();
    if (trimmed) sessionStorage.setItem(IDEA_KEY, trimmed);
    router.push(isAuthenticated() ? "/projects/new" : "/signup");
  }

  return (
    <section className="relative flex min-h-[90vh] w-full flex-col items-center justify-start overflow-hidden bg-background pt-[12vh] sm:pt-[16vh]">
      {/* Background decorations */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.1)_0%,transparent_60%)]" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
            backgroundSize: "64px 64px",
            maskImage: "linear-gradient(to bottom, black 40%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(to bottom, black 40%, transparent 100%)",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto grid w-full max-w-7xl grid-cols-12 gap-y-12 px-6 py-12 md:gap-x-8 md:px-10 lg:px-12 md:py-24">
        {/* Left Side: Headline & Input */}
        <div className="col-span-12 flex flex-col justify-center lg:col-span-7">
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="font-sans text-5xl font-semibold leading-[1.05] tracking-tighter text-white sm:text-6xl md:text-7xl"
          >
            <span>SpecForge turns your</span>{" "}
            <span className="text-zinc-500">product idea</span>
            <br />
            <span>into a complete</span>
            <br />
            <span className="bg-gradient-to-r from-[#D0D4F7] to-[#8B9DFF] bg-clip-text text-transparent">
              engineering blueprint.
            </span>
          </motion.h1>

          <p className="mt-6 max-w-xl text-lg font-medium text-zinc-400/80 sm:text-xl tracking-tight">
            Generate full PRDs, user stories, software architecture diagrams, database schemas, and master prompts instantly using AI.
          </p>

          <motion.form
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            onSubmit={handleStart}
            className="mt-10 flex w-full max-w-lg items-center rounded-full bg-white/[0.03] p-1 pl-6 shadow-inner-border backdrop-blur-xl transition-all focus-within:bg-white/[0.05] focus-within:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1),0_0_20px_rgba(255,255,255,0.05)]"
          >
            <input
              type="text"
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              placeholder="Describe your product idea..."
              className="flex-1 border-none bg-transparent font-sans text-sm font-medium text-white outline-none placeholder:text-zinc-600"
            />
            <button
              type="submit"
              className="linear-button ml-2 h-10 w-10 flex-shrink-0"
              aria-label="Submit idea"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </motion.form>
        </div>

        {/* Right Side: Flow pipeline mock-up card */}
        <div className="col-span-12 flex items-center justify-center lg:col-span-5">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-md rounded-3xl bg-[#080808]/80 p-6 shadow-linear-surface backdrop-blur-2xl"
          >
            <div className="mb-4 flex items-center gap-2 border-b border-white/[0.04] pb-4">
              <div className="h-3 w-3 rounded-full bg-[#5E6AD2]/80 shadow-[0_0_10px_rgba(94,106,210,0.5)]" />
              <div className="h-3 w-3 rounded-full bg-white/10" />
              <div className="h-3 w-3 rounded-full bg-white/10" />
              <span className="ml-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">pipeline state</span>
            </div>
            <p className="font-mono text-xs font-medium text-zinc-400">
              PRD &rarr; Architecture &rarr; API &rarr; Security &rarr; Master Prompt
            </p>
            <div className="mt-6 space-y-4">
              <div className="h-2 w-4/5 rounded-full bg-white/[0.06]" />
              <div className="h-2 w-3/5 rounded-full bg-white/[0.06]" />
              <div className="relative h-2 w-2/3 overflow-hidden rounded-full bg-white/[0.02]">
                <div className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/20 to-transparent shadow-[0_0_10px_rgba(255,255,255,0.2)]" />
              </div>
            </div>
            {/* Subtle light orb decoration inside the card */}
            <div className="absolute -bottom-10 -right-10 -z-10 h-32 w-32 rounded-full bg-[#5E6AD2]/10 blur-2xl" />
          </motion.div>
        </div>
      </div>

      <div className="absolute bottom-6 left-6 z-20 hidden md:block">
        <span className="font-sans text-xs font-medium text-zinc-600">2026</span>
      </div>

      <div className="absolute bottom-6 right-6 z-20 hidden md:block">
        <span className="font-sans text-xs font-medium uppercase tracking-wider text-zinc-600">
          engineering specs
        </span>
      </div>
    </section>
  );
}

export { IDEA_KEY };
