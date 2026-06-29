"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  ShieldCheck, Trophy, Zap, Layers, CheckCircle, Github,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Container } from "@/components/shared/Container";
import { WHY_ITEMS } from "@/data/features";
import type { FeatureAccent } from "@/types";

const ICON_MAP: Record<string, LucideIcon> = {
  ShieldCheck, Trophy, Zap, Layers, CheckCircle, Github,
};

const ACCENT_STYLES: Record<FeatureAccent, { icon: string; bg: string; border: string; glow: string }> = {
  indigo:  { icon: "text-accent-purple",  bg: "bg-accent-purple/10",  border: "border-accent-purple/20",  glow: "group-hover:shadow-accent-purple/5"  },
  violet:  { icon: "text-accent-purple",  bg: "bg-accent-purple/10",  border: "border-accent-purple/20",  glow: "group-hover:shadow-accent-purple/5"  },
  blue:    { icon: "text-accent-blue",    bg: "bg-accent-blue/10",    border: "border-accent-blue/20",    glow: "group-hover:shadow-accent-blue/5"    },
  emerald: { icon: "text-accent-emerald", bg: "bg-accent-emerald/10", border: "border-accent-emerald/20", glow: "group-hover:shadow-accent-emerald/5" },
  orange:  { icon: "text-accent-orange",  bg: "bg-accent-orange/10",  border: "border-accent-orange/20",  glow: "group-hover:shadow-accent-orange/5"  },
  rose:    { icon: "text-accent-orange",  bg: "bg-accent-orange/10",  border: "border-accent-orange/20",  glow: "group-hover:shadow-accent-orange/5"  },
  yellow:  { icon: "text-accent-amber",   bg: "bg-accent-amber/10",   border: "border-accent-amber/20",   glow: "group-hover:shadow-accent-amber/5"   },
  cyan:    { icon: "text-accent-blue",    bg: "bg-accent-blue/10",    border: "border-accent-blue/20",    glow: "group-hover:shadow-accent-blue/5"    },
  fuchsia: { icon: "text-accent-purple",  bg: "bg-accent-purple/10",  border: "border-accent-purple/20",  glow: "group-hover:shadow-accent-purple/5"  },
  sky:     { icon: "text-accent-blue",    bg: "bg-accent-blue/10",    border: "border-accent-blue/20",    glow: "group-hover:shadow-accent-blue/5"    },
  teal:    { icon: "text-accent-emerald", bg: "bg-accent-emerald/10", border: "border-accent-emerald/20", glow: "group-hover:shadow-accent-emerald/5" },
  amber:   { icon: "text-accent-amber",   bg: "bg-accent-amber/10",   border: "border-accent-amber/20",   glow: "group-hover:shadow-accent-amber/5"   },
};

export function WhyAetherCP() {
  const headingRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(headingRef, { once: true, margin: "-60px" });

  return (
    <section className="relative py-24 sm:py-32">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      <Container>
        <div ref={headingRef} className="mb-16 flex justify-center">
          <SectionHeading
            eyebrow="Why AetherCP"
            title="Built for the modern"
            titleHighlight="competitive programmer"
            description="Unlike other extensions that look like legacy utility scripts, AetherCP is crafted with clean code, elegant views, and robust reliability."
          />
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {WHY_ITEMS.map((item, i) => {
            const Icon = ICON_MAP[item.icon] ?? CheckCircle;
            const style = ACCENT_STYLES[item.accent];

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 24 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.1 + i * 0.08, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                className={cn(
                  "group relative flex flex-col gap-4 rounded-2xl border border-white/5 bg-gradient-to-b from-bg-light/35 to-bg-dark/65 p-7 shadow-sm noise-overlay",
                  "transition-all duration-300 hover:-translate-y-1 hover:border-white/10 hover:shadow-xl hover:shadow-black/15",
                  style.glow
                )}
              >
                {/* Icon */}
                <div className={cn(
                  "flex h-11 w-11 items-center justify-center rounded-xl border",
                  style.bg, style.border,
                  "transition-transform duration-300 group-hover:scale-110"
                )}>
                  <Icon className={cn("h-5 w-5", style.icon)} />
                </div>

                {/* Text */}
                <div className="flex flex-col gap-1.5">
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{item.body}</p>
                </div>

                {/* Hover glow overlay */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  style={{ background: "radial-gradient(ellipse 60% 50% at 50% 0%, hsl(48 42% 89% / 0.03), transparent)" }}
                />
              </motion.div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
