"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { BarChart3, CheckCircle2 } from "lucide-react";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Container } from "@/components/shared/Container";
import { BrowserFrame } from "@/components/shared/BrowserFrame";
import analyticScreenshot from "../../../public/screenshots/analytic.png";
import historyScreenshot from "../../../public/screenshots/problem_history.png";

const BULLETS = [
  <>View a <span className="text-accent-amber font-semibold">full-year coding heatmap</span> with 5 intensity levels and hover tooltips on your own profile</>,
  <>Track daily and weekly practice with a <span className="text-accent-amber font-semibold">7-day bar chart</span> showing minutes per day</>,
  <>See <span className="text-accent-purple font-semibold">all-time problem history</span> with per-problem time, rating, and last-seen date</>,
  <>Monitor your <span className="text-accent-amber font-semibold">current practice streak</span> — consecutive days with any tracked coding time</>,
  <>View <span className="text-accent-emerald font-semibold">overview cards</span> for total coding time, today&apos;s time, problems worked, and most-worked problem</>,
  <>All metrics compiled and rendered <span className="text-accent-emerald font-semibold">locally</span> — no network roundtrips, no uploads</>,
];

export function AnalyticsShowcase() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="relative py-24 sm:py-32">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 opacity-[0.02]"
        style={{ background: "radial-gradient(circle, hsl(48 42% 89% / 0.25), transparent 70%)", filter: "blur(60px)" }}
      />

      <Container>
        <div ref={ref} className="grid gap-16 lg:grid-cols-2 lg:items-center lg:gap-20">
          {/* Left — text */}
          <motion.div
            initial={{ opacity: 0, x: -32 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col gap-6"
          >
            <SectionHeading
              eyebrow="Practice Analytics"
              title="Capture training"
              titleHighlight="diagnostics locally"
              description="Log and aggregate active solve times per problem, per day, and per week. Track your preparation routines with data compiled entirely on your local machine."
              align="left"
            />

            <ul className="flex flex-col gap-3">
              {BULLETS.map((b, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -16 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.1 + i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="flex items-start gap-3 text-sm text-muted-foreground"
                >
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent-blue" />
                  <span>{b}</span>
                </motion.li>
              ))}
            </ul>

            <div className="flex items-start gap-4 rounded-2xl border border-accent-blue/10 bg-accent-blue/5 p-5 shadow-sm">
              <BarChart3 className="mt-0.5 h-5 w-5 shrink-0 text-accent-blue" />
              <p className="text-sm text-muted-foreground/90 leading-relaxed">
                Personal practice analytics appear exclusively on <span className="text-accent-blue font-semibold text-foreground">your own Codeforces profile</span> — refreshing every 10 seconds with live session data from your <span className="text-accent-blue font-semibold text-foreground">local storage</span>.
              </p>
            </div>
          </motion.div>

          {/* Right — real screenshots */}
          <motion.div
            initial={{ opacity: 0, x: 32 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.15, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="relative flex flex-col gap-6"
          >
            <BrowserFrame url="codeforces.com/problemset" size="sm" className="w-full card-premium">
              <Image
                src={analyticScreenshot}
                alt="AetherCP Analytics Screenshot"
                className="w-full h-auto select-none pointer-events-none rounded-lg"
              />
            </BrowserFrame>

            <div className="relative sm:absolute sm:-bottom-12 sm:-left-8 sm:w-[85%] transition-all duration-300 hover:scale-[1.02] hover:z-20 z-10">
              <BrowserFrame url="codeforces.com/profile/tourist" size="sm" className="card-premium">
                <Image
                  src={historyScreenshot}
                  alt="AetherCP History Screenshot"
                  className="w-full h-auto select-none pointer-events-none rounded-lg"
                />
              </BrowserFrame>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
