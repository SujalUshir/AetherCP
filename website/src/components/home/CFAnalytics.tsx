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
  <><span className="text-accent-amber font-semibold">Rating progression</span> graph across all contests</>,
  <><span className="text-accent-blue font-semibold">Verdict distribution</span> — AC, WA, TLE, MLE, RE breakdown</>,
  <>Problem <span className="text-accent-amber font-semibold">difficulty distribution</span> chart</>,
  <><span className="text-accent-purple font-semibold">Tag-by-tag solved count</span> for identifying weak areas</>,
  <><span className="text-accent-purple font-semibold">Contest history</span> with delta and absolute rating</>,
  <>Injected directly into your <span className="text-accent-orange font-semibold">Codeforces</span> profile page</>,
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
            
            <BrowserFrame url="codeforces.com/profile/tourist" size="lg" className="w-full">
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
            transition={{ delay: 0.15, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col gap-6"
          >
            <SectionHeading
              eyebrow="Codeforces Analytics"
              title="Know your"
              titleHighlight="competitive profile"
              description="AetherCP injects a complete analytics dashboard directly into your Codeforces profile — no separate app, no new tab, no context switching."
              align="left"
            />

            <ul className="flex flex-col gap-3">
              {BULLETS.map((b, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: 16 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.1 + i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="flex items-start gap-3 text-sm text-muted-foreground"
                >
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent-amber" />
                  <span>{b}</span>
                </motion.li>
              ))}
            </ul>

            <div className="flex items-start gap-3 rounded-xl border border-accent-amber/20 bg-accent-amber/5 p-4">
              <Trophy className="mt-0.5 h-4 w-4 shrink-0 text-accent-amber" />
              <p className="text-sm text-muted-foreground leading-relaxed">
                The <span className="text-accent-blue font-semibold">analytics panel</span> appears automatically on any <span className="text-accent-orange font-semibold">Codeforces</span> profile page — yours or anyone else&apos;s.
              </p>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
