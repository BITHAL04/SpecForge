"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";
import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";

const navItems = [
  { label: "features", href: "#features" },
  { label: "demo", href: "#demo" },
  { label: "pricing", href: "#pricing" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed left-0 top-0 z-50 w-full bg-gradient-to-b from-background/90 to-transparent py-6 backdrop-blur-[4px] md:py-10">
      <div className="mx-auto grid max-w-7xl grid-cols-12 items-center px-6 md:px-10">
        <div className="col-span-6 flex items-center gap-2 md:col-span-3">
          <Link href="/" className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-[#8B9DFF]" />
            <span className="font-display text-xl tracking-tight text-white font-semibold">SpecForge</span>
          </Link>
        </div>

        <div className="col-span-6 hidden items-center justify-center gap-6 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="text-sm lowercase text-zinc-400 transition-colors hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="col-span-6 flex items-center justify-end gap-4 md:col-span-3">
          <Show when="signed-out">
            <SignInButton mode="modal">
              <button className="hidden text-sm lowercase text-zinc-400 transition-colors hover:text-white md:block">
                log in
              </button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button className="hidden rounded-full bg-white px-5 py-2 text-sm font-medium lowercase text-black transition-colors hover:bg-zinc-200 md:block">
                get started →
              </button>
            </SignUpButton>
          </Show>
          <Show when="signed-in">
            <Link
              href="/dashboard"
              className="hidden rounded-full bg-white px-5 py-2 text-sm font-medium lowercase text-black transition-colors hover:bg-zinc-200 md:block"
            >
              dashboard →
            </Link>
            <div className="hidden md:block">
              <UserButton />
            </div>
          </Show>

          <button
            className="relative z-50 flex h-8 w-8 flex-col items-center justify-center gap-1.5 md:hidden"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            <motion.span
              animate={isOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
              className="block h-0.5 w-6 bg-white transition-all"
            />
            <motion.span
              animate={isOpen ? { opacity: 0 } : { opacity: 1 }}
              className="block h-0.5 w-6 bg-white transition-all"
            />
            <motion.span
              animate={isOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
              className="block h-0.5 w-6 bg-white transition-all"
            />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute left-0 top-full flex w-full flex-col gap-4 border-t border-white/[0.08] bg-[#0c0c0e]/95 p-6 shadow-lg backdrop-blur-md md:hidden"
          >
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-lg lowercase text-zinc-200 hover:text-white"
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <Show when="signed-out">
              <SignInButton mode="modal">
                <button className="text-left text-lg lowercase text-zinc-200 hover:text-white" onClick={() => setIsOpen(false)}>
                  log in
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button
                  className="rounded-full bg-white px-5 py-3 text-center text-lg font-medium lowercase text-black transition-colors hover:bg-zinc-200"
                  onClick={() => setIsOpen(false)}
                >
                  get started →
                </button>
              </SignUpButton>
            </Show>
            <Show when="signed-in">
              <Link
                href="/dashboard"
                className="rounded-full bg-white px-5 py-3 text-center text-lg font-medium lowercase text-black transition-colors hover:bg-zinc-200"
                onClick={() => setIsOpen(false)}
              >
                dashboard →
              </Link>
            </Show>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
