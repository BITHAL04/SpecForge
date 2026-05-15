import { cn } from "@/lib/utils/cn";

export function AnimatedGradientText({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex animate-gradient bg-gradient-to-r from-[#a78bfa] via-[#e879f9] to-[#60a5fa] bg-[length:var(--bg-size,200%)_100%] bg-clip-text text-transparent",
        className,
      )}
      style={{ "--bg-size": "200%" } as React.CSSProperties}
    >
      {children}
    </span>
  );
}
