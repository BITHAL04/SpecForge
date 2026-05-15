"use client";

import { motion } from "framer-motion";
import { FileText, Layers, Shield, Code2 } from "lucide-react";

const cards = [
  {
    icon: FileText,
    title: "PRD & Personas",
    desc: "Executive summary, goals, user personas, and requirements.",
    delay: 0,
  },
  {
    icon: Layers,
    title: "Architecture",
    desc: "HLD, LLD, and interactive Mermaid system diagrams.",
    delay: 0.15,
  },
  {
    icon: Code2,
    title: "API Specification",
    desc: "OpenAPI endpoints, schemas, auth flows, and error codes.",
    delay: 0.3,
  },
  {
    icon: Shield,
    title: "Security & RBAC",
    desc: "Threat model, security audit, and role-based access design.",
    delay: 0.45,
  },
];

export function FloatingCards() {
  return (
    <section className="relative overflow-hidden py-24 bg-background border-t border-white/[0.08]">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((card) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: card.delay, duration: 0.5 }}
            >
              <div className="rounded-2xl border border-white/[0.08] bg-zinc-900/40 p-6 shadow-lg backdrop-blur-sm transition-all duration-200 hover:border-white/20 hover:bg-zinc-900/60 hover:shadow-xl">
                <card.icon className="mb-4 h-8 w-8 text-[#8B9DFF]" />
                <h3 className="text-[15px] font-medium text-white">{card.title}</h3>
                <p className="mt-2 text-[13px] leading-relaxed text-zinc-400">{card.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
