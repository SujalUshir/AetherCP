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
      className="flex flex-col items-center gap-1.5 rounded-2xl border border-border/60 bg-card px-6 py-5"
    >
      <Icon className={cn("h-5 w-5", accent)} />
      <span className="text-2xl font-bold tabular-nums">{animated}</span>
      <span className="text-xs text-muted-foreground">{label}</span>
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
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
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
            transition={{ delay: 0.15, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="grid w-full max-w-2xl grid-cols-2 gap-4 sm:grid-cols-4"
            aria-live="polite"
            aria-busy={loading}
          >
            <StatBlock icon={Star}        label="Stars"    value={data.stars}    accent="text-yellow-400" />
            <StatBlock icon={GitFork}     label="Forks"    value={data.forks}    accent="text-indigo-400" />
            <StatBlock icon={AlertCircle} label="Issues"   value={data.issues}   accent="text-rose-400"   />
            <StatBlock icon={Eye}         label="Watchers" value={data.watchers} accent="text-emerald-400"/>
          </motion.div>

          {/* Repo card */}
          <motion.a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.25, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="group flex w-full max-w-2xl items-center justify-between rounded-2xl border border-border/60 bg-card p-6 transition-all duration-300 hover:border-indigo-500/30 hover:shadow-lg hover:shadow-indigo-500/5"
          >
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm text-muted-foreground">SujalUshir /</span>
                <span className="font-mono text-sm font-semibold text-indigo-400">AetherCP</span>
              </div>
              <p className="text-sm text-muted-foreground">Privacy-first competitive programming companion for Codeforces &amp; LeetCode.</p>
              <div className="mt-1 flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-yellow-400" />
                  JavaScript
                </span>
                <span className="flex items-center gap-1">
                  <Scale className="h-3 w-3" />
                  {data.license}
                </span>
                <span>{data.latestVersion}</span>
              </div>
            </div>
            <ExternalLink className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-indigo-400 shrink-0" />
          </motion.a>
        </div>
      </Container>
    </section>
  );
}
