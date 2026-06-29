"use client";

import { Container } from "@/components/shared/Container";
import { CHANGELOG } from "@/data/changelog";
import { cn } from "@/lib/utils";
import { ArrowLeft, GitCommit, Sparkles } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FadeUp } from "@/components/motion";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";

function ChangelogEntry({ release, index }: { release: typeof CHANGELOG[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-20px" });

  return (
    <motion.div
      ref={ref}
      key={release.version}
      initial={{ opacity: 0, x: -20 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1], delay: 0.05 * Math.min(index, 3) }}
      className="relative mb-16 last:mb-0"
    >
      {/* Node Dot */}
      <span className="absolute -left-[35px] sm:-left-[43px] top-1 flex h-8 w-8 items-center justify-center rounded-full bg-background border border-border/80">
        <GitCommit className="h-4 w-4 text-accent-blue" />
      </span>

      {/* Release Info */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-4">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold">v{release.version}</h2>
          {release.tag && (
            <span className={cn(
              "rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
              release.tag === "latest"
                ? "bg-accent-emerald/15 text-accent-emerald border border-accent-emerald/20"
                : "bg-accent-blue/15 text-accent-blue border border-accent-blue/20"
            )}>
              {release.tag}
            </span>
          )}
        </div>
        <span className="text-xs text-muted-foreground">{release.date}</span>
      </div>

      <p className="text-sm text-muted-foreground leading-relaxed mb-6 font-medium">
        {release.summary}
      </p>

      {/* Change log categories */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.1 + 0.05 * Math.min(index, 3) }}
        className="flex flex-col gap-4 rounded-2xl border border-white/5 bg-bg-dark/50 p-6 noise-overlay"
      >
        {release.changes.map((item, ci) => {
          const isAdded = item.type === "added";
          const isImproved = item.type === "improved";

          return (
            <div key={ci} className="flex items-start gap-3">
              <span className={cn(
                "mt-0.5 rounded px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider shrink-0",
                isAdded    && "bg-accent-emerald/10 text-accent-emerald border border-accent-emerald/20",
                isImproved && "bg-accent-blue/10 text-accent-blue border border-accent-blue/20",
                !isAdded && !isImproved && "bg-accent-orange/10 text-accent-orange border border-accent-orange/20"
              )}>
                {item.type}
              </span>
              <span className="text-sm text-muted-foreground leading-relaxed">
                {item.text}
              </span>
            </div>
          );
        })}
      </motion.div>
    </motion.div>
  );
}

export default function ChangelogPage() {
  return (
    <div className="pt-24 min-h-screen">
      {/* Header */}
      <section className="relative py-16 sm:py-20">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 -top-16 h-[400px] opacity-20"
          style={{ background: "radial-gradient(ellipse 70% 50% at 50% 0%, hsl(238 84% 67%), transparent)" }}
        />
        <Container>
          <FadeUp className="flex flex-col items-center gap-4 text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-accent-blue/20 bg-accent-blue/10 px-3 py-1 text-xs font-semibold text-accent-blue">
              <Sparkles className="h-3 w-3" />
              Product Updates
            </span>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              <span className="bg-gradient-to-r from-[#F0EBD8] via-[#E8DFC7] to-[#DDD3BA] bg-clip-text text-transparent">Changelog</span>
            </h1>
            <p className="max-w-xl text-base text-muted-foreground sm:text-lg">
              Explore the latest <span className="text-accent-amber font-semibold">features</span>, improvements, and fixes added to <span className="text-primary font-semibold">AetherCP</span>.
            </p>
          </FadeUp>
        </Container>
      </section>

      {/* Timeline Section */}
      <section className="pb-24 sm:pb-32">
        <Container size="md">
          <div className="relative border-l border-border/80 pl-6 sm:pl-8 ml-4">
            {CHANGELOG.map((release, i) => (
              <ChangelogEntry key={release.version} release={release} index={i} />
            ))}
          </div>

          <FadeUp className="mt-12 flex justify-center" delay={0.1}>
            <Button variant="outline" asChild className="group">
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1" />
                Back to Home
              </Link>
            </Button>
          </FadeUp>
        </Container>
      </section>
    </div>
  );
}
