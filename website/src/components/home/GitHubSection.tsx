"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Star, GitFork, AlertCircle, Eye, Scale, ExternalLink } from "lucide-react";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Container } from "@/components/shared/Container";
import { useGitHub } from "@/hooks/useGitHub";
import { useAnimatedCounter } from "@/hooks/useAnimatedCounter";
import { cn } from "@/lib/utils";
import { GITHUB_URL } from "@/data/navigation";

function StatBlock({
  icon: Icon,
  label,
  value,
  accent,
}: {
  icon: React.ElementType;
  label: string;
  value: number;
  accent: string;
}) {
  const { ref, value: animated } = useAnimatedCounter(value, 1200);
  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className="flex flex-col items-center gap-2 rounded-2xl px-6 py-6 card-premium text-center min-w-[120px]"
    >
      <Icon className={cn("h-5 w-5", accent)} />
      <span className="text-3xl font-extrabold tracking-tight tabular-nums text-foreground">{animated}</span>
      <span className="text-xs uppercase tracking-wider text-muted-foreground/80 font-semibold">{label}</span>
    </div>
  );
}

export function GitHubSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const { data, loading } = useGitHub("SujalUshir", "AetherCP");

  return (
    <section className="relative py-24 sm:py-32">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      <Container>
        <div ref={ref} className="flex flex-col items-center gap-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <SectionHeading
              eyebrow="Open Source"
              title="Built in the open,"
              titleHighlight="for the community"
              description="AetherCP is fully open source. The code that runs in your browser is the code you can read on GitHub."
            />
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.15, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="grid w-full max-w-2xl grid-cols-2 gap-4 sm:grid-cols-4"
            aria-live="polite"
            aria-busy={loading}
          >
            <StatBlock icon={Star}        label="Stars"    value={data.stars}    accent="text-accent-amber" />
            <StatBlock icon={GitFork}     label="Forks"    value={data.forks}    accent="text-accent-purple" />
            <StatBlock icon={AlertCircle} label="Issues"   value={data.issues}   accent="text-accent-orange"   />
            <StatBlock icon={Eye}         label="Watchers" value={data.watchers} accent="text-accent-emerald"/>
          </motion.div>

          {/* Repo card */}
          <motion.a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.25, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="group flex w-full max-w-2xl items-center justify-between rounded-2xl p-8 card-premium noise-overlay hover:border-primary/20"
          >
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm text-muted-foreground/80">SujalUshir /</span>
                <span className="font-mono text-sm font-bold text-primary">AetherCP</span>
              </div>
              <p className="text-sm text-muted-foreground/90 leading-relaxed">Privacy-first competitive programming companion for Codeforces &amp; LeetCode.</p>
              <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground/75 font-medium">
                <span className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-accent-amber" />
                  JavaScript
                </span>
                <span className="flex items-center gap-1.5">
                  <Scale className="h-3.5 w-3.5" />
                  {data.license}
                </span>
                <span className="px-2 py-0.5 rounded-md border border-border bg-bg-light/40 text-[10px] uppercase font-bold tracking-wider">{data.latestVersion}</span>
              </div>
            </div>
            <ExternalLink className="h-5 w-5 text-muted-foreground transition-all duration-300 group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 shrink-0 ml-4" />
          </motion.a>
        </div>
      </Container>
    </section>
  );
}
