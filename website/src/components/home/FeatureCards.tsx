"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  BarChart3,
  Trophy,
  Code2,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Container } from "@/components/shared/Container";

interface Feature {
  id: string;
  icon: LucideIcon;
  title: string;
  description: string;
  bullets: string[];
  accent: string;
  glow: string;
}

const FEATURES: Feature[] = [
  {
    id: "practice-analytics",
    icon: BarChart3,
    title: "Practice Analytics",
    description:
      "Daily heatmaps, session timers, and streak tracking built directly into your browser.",
    bullets: [
      "Problem-level session timers",
      "Daily time heatmap",
      "Idle detection — only counts real work",
      "Persistent history across sessions",
    ],
    accent: "text-primary",
    glow: "hover:shadow-primary/5",
  },
  {
    id: "competitive-analytics",
    icon: Trophy,
    title: "Competitive Analytics",
    description:
      "Rating distribution chart and topic pie chart injected into any Codeforces profile page — sourced from the public API.",
    bullets: [
      "Rating distribution bar chart (800–3500)",
      "Problem topic pie chart (top 10 tags)",
      "Deduplicated solved count badge",
      "Works on any Codeforces profile",
    ],
    accent: "text-primary",
    glow: "hover:shadow-primary/5",
  },
  {
    id: "vscode-integration",
    icon: Code2,
    title: "VS Code Integration",
    description:
      "Send any problem to your editor in one click via the Competitive Companion protocol.",
    bullets: [
      "Sample test case extraction",
      "Time and memory limit parsing",
      "Compatible with competitive-companion",
      "Right-click context menu support",
    ],
    accent: "text-accent-blue",
    glow: "hover:shadow-accent-blue/5",
  },
  {
    id: "privacy-first",
    icon: ShieldCheck,
    title: "Privacy First",
    description:
      "All data lives in your browser storage. No servers, no accounts, no telemetry — ever.",
    bullets: [
      "Zero external data transmission",
      "No account required",
      "No analytics or tracking",
      "Fully open source on GitHub",
    ],
    accent: "text-accent-emerald",
    glow: "hover:shadow-accent-emerald/5",
  },
];

function FeatureCard({ feature, index }: { feature: Feature; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const Icon = feature.icon;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        delay: index * 0.1,
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      }}
      id={feature.id}
      className={cn(
        "group relative flex flex-col gap-5 rounded-2xl border border-border/80 bg-card p-7 card-premium",
        "transition-all duration-300",
        feature.glow
      )}
    >
      {/* Icon */}
      <div
        className={cn(
          "flex h-12 w-12 items-center justify-center rounded-xl border border-border bg-secondary",
          "transition-transform duration-300 group-hover:scale-110"
        )}
      >
        <Icon className={cn("h-6 w-6", feature.accent)} />
      </div>

      {/* Text */}
      <div className="flex flex-col gap-2">
        <h3 className="text-lg font-semibold">{feature.title}</h3>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {feature.description}
        </p>
      </div>

      {/* Bullets */}
      <ul className="flex flex-col gap-2">
        {feature.bullets.map((bullet) => (
          <li key={bullet} className="flex items-start gap-2.5 text-sm text-muted-foreground">
            <span className={cn("mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-current", feature.accent)} />
            {bullet}
          </li>
        ))}
      </ul>

    </motion.div>
  );
}

export function FeatureCards() {
  return (
    <section className="relative py-24 sm:py-32">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border to-transparent"
      />

      <Container>
        <div className="mb-16 flex justify-center">
          <SectionHeading
            eyebrow="Features"
            title="Built for"
            titleHighlight="competitive programmers"
            highlightColor="text-brand-dark"
            description="Everything you need to track, analyze, and improve your CP practice — without compromising your privacy."
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((feature, i) => (
            <FeatureCard key={feature.id} feature={feature} index={i} />
          ))}
        </div>
      </Container>
    </section>
  );
}
