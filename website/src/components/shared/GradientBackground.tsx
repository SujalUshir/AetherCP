"use client";

import { cn } from "@/lib/utils";

interface GradientBackgroundProps {
  className?: string;
  variant?: "hero" | "subtle" | "radial";
  children?: React.ReactNode;
}

export function GradientBackground({
  className,
  variant = "hero",
  children,
}: GradientBackgroundProps) {
  return (
    <div className={cn("relative overflow-hidden", className)}>
      {/* Hero glow — large subtle warm radial behind content */}
      {variant === "hero" && (
        <>
          {/* Top center glow */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 -top-40 h-[600px] opacity-20"
            style={{
              background:
                "radial-gradient(ellipse 80% 60% at 50% 0%, hsl(48 42% 89% / 0.3), transparent)",
            }}
          />
          {/* Bottom subtle border line */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-border to-transparent"
          />
        </>
      )}

      {variant === "subtle" && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border to-transparent"
        />
      )}

      {variant === "radial" && (
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 opacity-10"
          style={{
            background:
              "radial-gradient(circle, hsl(48 42% 89% / 0.2), transparent 70%)",
          }}
        />
      )}

      {children}
    </div>
  );
}
