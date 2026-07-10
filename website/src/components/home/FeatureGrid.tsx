"use client";

import * as React from "react";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  LayoutGrid, BarChart3, Timer, Trophy, History, TrendingUp,
  Code2, ShieldCheck, CalendarDays, HardDrive, Moon, Zap,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Container } from "@/components/shared/Container";
import { Button } from "@/components/ui/button";
import { FEATURE_CARDS } from "@/data/features";
import type { FeatureAccent } from "@/types";

const ICON_MAP: Record<string, LucideIcon> = {
  LayoutGrid, BarChart3, Timer, Trophy, History, TrendingUp,
  Code2, ShieldCheck, CalendarDays, HardDrive, Moon, Zap,
};

const ACCENT_CLASSES: Record<FeatureAccent, { icon: string; bg: string; badge: string }> = {
  indigo:  { icon: "text-accent-purple font-medium", bg: "bg-accent-purple/10", badge: "bg-accent-purple/10 text-accent-purple border-accent-purple/20" },
  violet:  { icon: "text-accent-purple font-medium", bg: "bg-accent-purple/10", badge: "bg-accent-purple/10 text-accent-purple border-accent-purple/20" },
  blue:    { icon: "text-accent-blue font-medium",    bg: "bg-accent-blue/10",    badge: "bg-accent-blue/10 text-accent-blue border-accent-blue/20" },
  emerald: { icon: "text-accent-emerald font-medium font-semibold", bg: "bg-accent-emerald/10", badge: "bg-accent-emerald/10 text-accent-emerald border-accent-emerald/20" },
  orange:  { icon: "text-accent-orange font-medium",  bg: "bg-accent-orange/10",  badge: "bg-accent-orange/10 text-accent-orange border-accent-orange/20" },
  rose:    { icon: "text-accent-orange font-medium",  bg: "bg-accent-orange/10",  badge: "bg-accent-orange/10 text-accent-orange border-accent-orange/20" },
  yellow:  { icon: "text-accent-amber font-medium",   bg: "bg-accent-amber/10",   badge: "bg-accent-amber/10 text-accent-amber border-accent-amber/20" },
  cyan:    { icon: "text-accent-blue font-medium",    bg: "bg-accent-blue/10",    badge: "bg-accent-blue/10 text-accent-blue border-accent-blue/20" },
  fuchsia: { icon: "text-accent-purple font-medium",  bg: "bg-accent-purple/10",  badge: "bg-accent-purple/10 text-accent-purple border-accent-purple/20" },
  sky:     { icon: "text-accent-blue font-medium",    bg: "bg-accent-blue/10",    badge: "bg-accent-blue/10 text-accent-blue border-accent-blue/20" },
  teal:    { icon: "text-accent-emerald font-medium", bg: "bg-accent-emerald/10", badge: "bg-accent-emerald/10 text-accent-emerald border-accent-emerald/20" },
  amber:   { icon: "text-accent-amber font-medium",   bg: "bg-accent-amber/10",   badge: "bg-accent-amber/10 text-accent-amber border-accent-amber/20" },
};

function highlightDescription(text: string) {
  const keywords = [
    { word: "Codeforces", class: "text-accent-orange font-semibold" },
    { word: "LeetCode", class: "text-accent-amber font-semibold" },
    { word: "VS Code", class: "text-accent-purple font-semibold" },
    { word: "local storage", class: "text-accent-emerald font-semibold" },
    { word: "local", class: "text-accent-emerald font-semibold" },
    { word: "privacy", class: "text-accent-emerald font-semibold" },
    { word: "analytics", class: "text-accent-blue font-semibold" },
    { word: "timer", class: "text-accent-amber font-semibold" },
    { word: "inactivity", class: "text-accent-blue font-semibold" },
  ];

  let parts: (string | React.ReactNode)[] = [text];

  keywords.forEach((kw) => {
    const newParts: (string | React.ReactNode)[] = [];
    parts.forEach((part) => {
      if (typeof part !== "string") {
        newParts.push(part);
        return;
      }

      const regex = new RegExp(`(${kw.word})`, "gi");
      const subParts = part.split(regex);
      subParts.forEach((sp, idx) => {
        if (sp.toLowerCase() === kw.word.toLowerCase()) {
          newParts.push(<span key={`${sp}-${idx}`} className={kw.class}>{sp}</span>);
        } else {
          newParts.push(sp);
        }
      });
    });
    parts = newParts;
  });

  return parts;
}

export function FeatureGrid() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-20px" });

  return (
    <section className="relative py-24 sm:py-32">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      <Container>
        <div className="mb-16 flex justify-center">
          <SectionHeading
            eyebrow="Key Features"
            title="Core"
            titleHighlight="instrumentation suite"
            description="Explore the core diagnostics capabilities designed into AetherCP—operating entirely within your browser's sandboxed local runtime."
          />
        </div>

        <div
          ref={ref}
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          {FEATURE_CARDS.slice(0, 8).map((card, i) => {
            const Icon = ICON_MAP[card.icon] ?? Zap;
            const style = ACCENT_CLASSES[card.accent];

            return (
              <motion.div
                key={card.id}
                id={`feature-${card.id}`}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: (i % 4) * 0.06 + Math.floor(i / 4) * 0.1, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                className="group relative flex flex-col gap-4 rounded-2xl p-6 card-premium noise-overlay"
              >
                {/* Badge */}
                {card.badge && (
                  <span className={cn(
                    "absolute right-3 top-3 rounded-full border px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider",
                    style.badge
                  )}>
                    {card.badge}
                  </span>
                )}

                {/* Icon */}
                <div className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-xl",
                  style.bg,
                  "transition-transform duration-300 group-hover:scale-110"
                )}>
                  <Icon className={cn("h-5 w-5", style.icon)} />
                </div>

                {/* Text */}
                <div className="flex flex-col gap-1.5">
                  <h3 className="text-sm font-semibold">{card.title}</h3>
                  <div className="text-xs leading-relaxed text-muted-foreground">{highlightDescription(card.description)}</div>
                </div>

                {/* Hover glow */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  style={{ background: "radial-gradient(ellipse 60% 50% at 20% 10%, hsl(238 84% 67% / 0.05), transparent)" }}
                />
              </motion.div>
            );
          })}
        </div>

        {/* View all features link */}
        <div className="mt-10 flex justify-center">
          <Button variant="ghost" asChild className="group text-sm text-muted-foreground hover:text-foreground">
            <Link href="/features" className="flex items-center gap-2">
              View all features
              <ArrowRight className="h-4 w-4 btn-icon-arrow" />
            </Link>
          </Button>
        </div>
      </Container>
    </section>
  );
}
