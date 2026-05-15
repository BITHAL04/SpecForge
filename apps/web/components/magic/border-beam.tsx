import { cn } from "@/lib/utils/cn";

export function BorderBeam({
  className,
  size = 200,
  duration = 4,
}: {
  className?: string;
  size?: number;
  duration?: number;
}) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 rounded-[inherit] [border:calc(var(--size)*1px)_solid_transparent]",
        className,
      )}
      style={
        {
          "--size": size,
          mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          maskComposite: "exclude",
          background: `linear-gradient(90deg, transparent, #8b5cf6, #3b82f6, transparent) border-box`,
          backgroundSize: "200% 100%",
          animation: `shimmer ${duration}s linear infinite`,
        } as React.CSSProperties
      }
    />
  );
}
