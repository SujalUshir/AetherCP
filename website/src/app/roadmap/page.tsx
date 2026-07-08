"use client";

import { Container } from "@/components/shared/Container";
import { ROADMAP_ITEMS } from "@/data/roadmap";
import { cn } from "@/lib/utils";
import { CheckCircle2, Play, Calendar, HelpCircle, ArrowLeft, Trophy } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { RoadmapStatus } from "@/types";
import { FadeUp } from "@/components/motion";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const STATUS_CONFIG: Record<RoadmapStatus, {
  label: string;
  icon: React.ElementType;
  accent: string;
  bg: string;
  border: string;
}> = {
  completed: {
    label: "Released",
    icon: CheckCircle2,
    accent: "text-primary",
    bg: "bg-primary/5",
    border: "border-primary/20",
  },
  "in-progress": {
    label: "In Progress",
    icon: Play,
    accent: "text-accent-amber",
    bg: "bg-accent-amber/5",
    border: "border-accent-amber/20",
  },
  planned: {
    label: "Planned",
    icon: Calendar,
    accent: "text-muted-foreground",
    bg: "bg-white/[0.01]",
    border: "border-border/40",
  },
  idea: {
    label: "Backlog / Idea",
    icon: HelpCircle,
    accent: "text-muted-foreground",
    bg: "bg-white/[0.01]",
    border: "border-border/40",
  },
};

function RoadmapColumn({
  status,
  description,
  items,
  delay,
}: {
  status: RoadmapStatus;
  description: string;
  items: typeof ROADMAP_ITEMS;
  delay: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const conf = STATUS_CONFIG[status];
  const Icon = conf.icon;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay }}
      className="flex flex-col gap-4"
    >
      {/* Column Header */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between border-b border-border/80 pb-3">
          <div className="flex items-center gap-2">
            <Icon className={cn("h-4 w-4", conf.accent)} />
            <span className="text-sm font-bold text-foreground">{conf.label}</span>
          </div>
          <span className="rounded bg-white/5 px-2 py-0.5 text-xs text-muted-foreground font-semibold">
            {items.length}
          </span>
        </div>
        <p className="text-[11px] text-muted-foreground leading-relaxed mt-1">{description}</p>
      </div>

      {/* Cards stack — staggered within the column */}
      <motion.div
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.07, delayChildren: delay + 0.1 } } }}
        className="flex flex-col gap-3"
      >
        {items.map((item) => {
          const priorityColor = item.priority === "high"
            ? "border-t-accent-orange"
            : item.priority === "medium"
            ? "border-t-accent-amber"
            : "border-t-accent-blue";

          const priorityText = item.priority === "high"
            ? "text-accent-orange"
            : item.priority === "medium"
            ? "text-accent-amber"
            : "text-accent-blue";

          return (
            <motion.div
              key={item.id}
              variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } } }}
              className={cn(
                "group rounded-2xl border-t-2 border-x border-b p-6 transition-all duration-350 card-premium noise-overlay",
                "border-white/5 hover:border-primary/20",
                priorityColor
              )}
            >
              <div className="flex items-start justify-between gap-2 mb-3">
                <span className="rounded bg-white/5 px-2 py-0.5 text-[9px] font-bold text-muted-foreground uppercase tracking-wider">
                  {item.category}
                </span>
                {item.priority && (
                  <span className={cn(
                    "text-[9px] font-bold uppercase tracking-wider",
                    priorityText
                  )}>
                    {item.priority}
                  </span>
                )}
              </div>
              <h4 className="text-sm font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
                {item.title}
              </h4>
              <p className="text-xs leading-relaxed text-muted-foreground/80">{item.description}</p>
            </motion.div>
          );
        })}

        {items.length === 0 && (
          <div className="rounded-2xl border border-dashed border-white/5 p-6 text-center bg-bg-darker/10">
            <p className="text-xs text-muted-foreground/60">No items in this column</p>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

export default function RoadmapPage() {
  const groups: Record<RoadmapStatus, typeof ROADMAP_ITEMS> = {
    completed: [],
    "in-progress": [],
    planned: [],
    idea: [],
  };

  ROADMAP_ITEMS.forEach((item) => {
    groups[item.status].push(item);
  });

  const columns: { status: RoadmapStatus; description: string }[] = [
    { status: "in-progress", description: "Currently being developed or audited for release." },
    { status: "planned",     description: "Committed features planned for upcoming versions." },
    { status: "idea",        description: "Backlog items, experiments, and community suggestions." },
    { status: "completed",   description: "Successfully shipped features available in current releases." },
  ];

  return (
    <div className="pt-24 min-h-screen">
      {/* Header */}
      <section className="relative py-16 sm:py-20">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 -top-16 h-[400px] opacity-15"
          style={{ background: "radial-gradient(ellipse 70% 50% at 50% 0%, hsl(48 42% 89% / 0.3), transparent)" }}
        />
        <Container>
          <FadeUp className="flex flex-col items-center gap-4 text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              <Trophy className="h-3 w-3" />
              Development Cycle
            </span>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Product <span className="bg-gradient-to-r from-[#F0EBD8] via-[#E8DFC7] to-[#DDD3BA] bg-clip-text text-transparent">Roadmap</span>
            </h1>
            <p className="max-w-xl text-base text-muted-foreground sm:text-lg">
              Follow our plan for future <span className="text-accent-blue font-semibold">integrations</span>, client <span className="text-accent-blue font-semibold">analytics</span>, achievements, and cross-device local <span className="text-accent-emerald font-semibold">synchronization</span>.
            </p>
          </FadeUp>
        </Container>
      </section>

      {/* Columns Grid */}
      <section className="pb-24">
        <Container size="xl">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {columns.map(({ status, description }, i) => (
              <RoadmapColumn
                key={status}
                status={status}
                description={description}
                items={groups[status]}
                delay={i * 0.1}
              />
            ))}
          </div>

          <FadeUp className="mt-16 flex justify-center" delay={0.2}>
            <Button variant="outline" asChild>
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Link>
            </Button>
          </FadeUp>
        </Container>
      </section>
    </div>
  );
}
