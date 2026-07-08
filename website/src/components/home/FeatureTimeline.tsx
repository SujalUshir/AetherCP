"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  Download, Globe, Timer, Database, BarChart3, TrendingUp,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Container } from "@/components/shared/Container";
import { TIMELINE_STEPS } from "@/data/features";

const ICON_MAP: Record<string, LucideIcon> = {
  Download, Globe, Timer, Database, BarChart3, TrendingUp,
};

const ACCENT_COLORS: Record<string, { text: string; bg: string; border: string; line: string }> = {
  indigo: { text: "text-primary", bg: "bg-primary/5", border: "border-primary/30", line: "bg-primary/30" },
  violet: { text: "text-primary", bg: "bg-primary/5", border: "border-primary/30", line: "bg-primary/30" },
  blue:   { text: "text-primary", bg: "bg-primary/5", border: "border-primary/30", line: "bg-primary/30" },
  cyan:   { text: "text-primary", bg: "bg-primary/5", border: "border-primary/30", line: "bg-primary/30" },
  emerald:{ text: "text-primary", bg: "bg-primary/5", border: "border-primary/30", line: "bg-primary/30" },
  orange: { text: "text-primary", bg: "bg-primary/5", border: "border-primary/30", line: "bg-primary/30" },
};

export function FeatureTimeline() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="relative py-24 sm:py-32">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      <Container>
        <div className="mb-16 flex justify-center">
          <SectionHeading
            eyebrow="How It Works"
            title="From install to"
            titleHighlight="insight in minutes"
            description="AetherCP requires zero configuration. Install, open a problem, and everything else happens automatically."
          />
        </div>

        <div ref={ref} className="relative mx-auto max-w-3xl">
          {/* Vertical connector line */}
          <div className="absolute left-6 top-6 bottom-6 w-px bg-gradient-to-b from-primary/30 via-border/60 to-transparent hidden sm:block" aria-hidden />

          <div className="flex flex-col gap-6">
            {TIMELINE_STEPS.map((step, i) => {
              const Icon = ICON_MAP[step.icon] ?? Download;
              const colors = ACCENT_COLORS[step.accent] ?? ACCENT_COLORS.indigo;

              return (
                 <motion.div
                   key={step.id}
                   initial={{ opacity: 0, x: -24 }}
                   animate={isInView ? { opacity: 1, x: 0 } : {}}
                   transition={{ delay: i * 0.1, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                   className="group relative flex items-start gap-6"
                 >
                   {/* Step icon */}
                   <div className={cn(
                     "relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border",
                     colors.bg, colors.border,
                     "transition-all duration-300 group-hover:scale-110 shadow-lg shadow-black/20"
                   )}>
                     <Icon className={cn("h-5 w-5", colors.text)} />
                     {/* Step number */}
                     <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-bg-dark text-[9px] font-bold border border-border/80 text-primary">
                       {step.step}
                     </span>
                   </div>

                   {/* Content */}
                   <div className={cn(
                     "flex-1 rounded-2xl p-6 card-premium noise-overlay"
                   )}>
                     <h3 className="mb-1.5 font-semibold text-lg text-foreground">{step.title}</h3>
                     <p className="text-sm leading-relaxed text-muted-foreground/80">{step.description}</p>
                   </div>
                 </motion.div>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
}
