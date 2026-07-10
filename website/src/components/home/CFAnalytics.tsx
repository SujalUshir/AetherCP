"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Trophy, CheckCircle2 } from "lucide-react";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Container } from "@/components/shared/Container";
import { BrowserFrame } from "@/components/shared/BrowserFrame";
import competitiveScreenshot from "../../../public/screenshots/competitive.png";

const BULLETS = [
  <>Plot <span className="text-accent-amber font-semibold">historical contest rating progression</span> lines</>,
  <>Analyze <span className="text-accent-blue font-semibold">verdict distributions</span> (AC, WA, TLE, MLE, and RE breakdowns)</>,
  <>Inspect solved problem <span className="text-accent-amber font-semibold">difficulty distributions</span></>,
  <>Evaluate solved counts on a <span className="text-accent-purple font-semibold">tag-by-tag basis</span> to identify weaknesses</>,
  <>Audit full <span className="text-accent-purple font-semibold">contest records</span> complete with ratings and deltas</>,
  <>Instrument analytics widgets directly into your <span className="text-accent-orange font-semibold">Codeforces</span> profile</>,
];

export function CFAnalytics() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="relative py-24 sm:py-32">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      <div
        aria-hidden
        className="pointer-events-none absolute left-0 top-1/2 h-[600px] w-[600px] -translate-y-1/2 opacity-10"
        style={{ background: "radial-gradient(circle, hsl(var(--accent-amber)) / 0.15, transparent 70%)" }}
      />

      <Container>
        <div ref={ref} className="grid gap-16 lg:grid-cols-2 lg:items-center lg:gap-20">
          {/* Left — CF dashboard screenshot */}
          <motion.div
            initial={{ opacity: 0, x: -32 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="relative order-last lg:order-first"
          >
            <div
              aria-hidden
              className="pointer-events-none absolute -inset-px rounded-3xl opacity-20"
              style={{ background: "radial-gradient(ellipse 80% 60% at 50% 50%, hsl(var(--accent-amber)) / 0.25, transparent)", filter: "blur(32px)" }}
            />
            
            <BrowserFrame url="codeforces.com/profile/tourist" size="lg" className="w-full card-premium">
              <Image
                src={competitiveScreenshot}
                alt="Codeforces Profile Analytics Screenshot"
                className="w-full h-auto select-none pointer-events-none rounded-lg"
              />
            </BrowserFrame>
          </motion.div>

          {/* Right — text */}
          <motion.div
            initial={{ opacity: 0, x: 32 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.15, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col gap-6"
          >
            <SectionHeading
              eyebrow="Codeforces Analytics"
              title="Audit your"
              titleHighlight="performance profile"
              description="AetherCP queries and aggregates user status history client-side, instrumenting Codeforces profiles with responsive canvas charts."
              align="left"
            />

            <ul className="flex flex-col gap-3">
              {BULLETS.map((b, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: 16 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.1 + i * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="flex items-start gap-3 text-sm text-muted-foreground"
                >
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent-amber" />
                  <span>{b}</span>
                </motion.li>
              ))}
            </ul>

            <div className="flex items-start gap-4 rounded-2xl border border-accent-amber/10 bg-accent-amber/5 p-5 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.02)]">
              <Trophy className="mt-0.5 h-5 w-5 shrink-0 text-accent-amber" />
              <p className="text-sm text-muted-foreground/90 leading-relaxed">
                The <span className="text-accent-blue font-semibold text-foreground">diagnostics panel</span> initializes automatically upon loading any <span className="text-accent-orange font-semibold text-foreground">Codeforces</span> profile page, querying the public API and rendering metrics client-side.
              </p>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
