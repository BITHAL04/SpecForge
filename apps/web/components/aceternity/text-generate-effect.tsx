"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils/cn";

export function TextGenerateEffect({
  words,
  className,
}: {
  words: string;
  className?: string;
}) {
  const tokens = words.split(" ");
  const [visible, setVisible] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible((v) => (v < tokens.length ? v + 1 : v));
    }, 80);
    return () => clearInterval(interval);
  }, [tokens.length]);

  return (
    <div className={cn("font-bold", className)}>
      {tokens.map((word, i) => (
        <motion.span
          key={`${word}-${i}`}
          initial={{ opacity: 0, filter: "blur(8px)" }}
          animate={i < visible ? { opacity: 1, filter: "blur(0px)" } : {}}
          transition={{ duration: 0.3 }}
          className="inline-block mr-1.5"
        >
          {word}
        </motion.span>
      ))}
    </div>
  );
}
