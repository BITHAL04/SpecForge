"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Loader2 } from "lucide-react";
import { TextGenerateEffect } from "@/components/aceternity/text-generate-effect";

const steps = [
  { label: "Analyzing product idea", artifact: null },
  { label: "Generating PRD & personas", artifact: "PRD" },
  { label: "Writing user stories", artifact: "STORIES" },
  { label: "Designing architecture", artifact: "HLD" },
  { label: "Creating API specification", artifact: "API_SPEC" },
  { label: "Running security audit", artifact: "SECURITY" },
  { label: "Compiling master AI prompt", artifact: "MASTER_PROMPT" },
];

export function DemoSection() {
  const [activeStep, setActiveStep] = useState(0);
  const [playing, setPlaying] = useState(true);

  useEffect(() => {
    if (!playing) return;
    const timer = setInterval(() => {
      setActiveStep((s) => (s + 1) % steps.length);
    }, 2000);
    return () => clearInterval(timer);
  }, [playing]);

  return (
    <section id="demo" className="relative border-t border-white/[0.08] py-32 bg-background">
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <p className="mb-4 text-xs font-medium uppercase tracking-wider text-zinc-500">Live preview</p>
          <h2 className="font-display text-3xl tracking-tight text-white md:text-4xl">
            Watch your spec come to life
          </h2>
          <p className="mt-4 text-[15px] text-zinc-400">
            Real-time generation timeline as SpecForge builds every artifact.
          </p>
        </div>

        <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-2">
          <div
            className="overflow-hidden rounded-2xl border border-white/[0.08] bg-zinc-900/30 shadow-lg backdrop-blur-sm"
            onMouseEnter={() => setPlaying(false)}
            onMouseLeave={() => setPlaying(true)}
          >
            <div className="flex items-center justify-between border-b border-white/[0.08] px-4 py-3 bg-zinc-900/50">
              <span className="text-[13px] font-medium text-zinc-200">Generation Timeline</span>
              <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-400">
                In progress
              </span>
            </div>
            <div className="min-h-[320px] space-y-3 p-4">
              <AnimatePresence mode="popLayout">
                {steps.slice(0, activeStep + 1).map((step, i) => (
                  <motion.div
                    key={step.label}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-3 text-[13px]"
                  >
                    {i === activeStep ? (
                      <Loader2 className="h-4 w-4 shrink-0 animate-spin text-[#8B9DFF]" />
                    ) : (
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
                    )}
                    <span className={i === activeStep ? "text-white font-medium" : "text-zinc-500"}>{step.label}</span>
                    {step.artifact && (
                      <span className="ml-auto rounded-md border border-white/[0.08] bg-zinc-950/40 px-2 py-0.5 text-[10px] text-zinc-500">
                        {step.artifact}
                      </span>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-zinc-900/30 shadow-lg backdrop-blur-sm">
            <div className="border-b border-white/[0.08] px-4 py-3 bg-zinc-900/50">
              <span className="text-[13px] font-medium text-zinc-200">Artifact Preview</span>
            </div>
            <div className="min-h-[320px] p-6 font-mono text-[13px]">
              <TextGenerateEffect
                words="Executive Summary: A marketplace platform connecting hosts with travelers. Core features include listing management, real-time booking, secure payments via Stripe, and review systems..."
                className="text-[13px] font-normal leading-relaxed text-zinc-300"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
