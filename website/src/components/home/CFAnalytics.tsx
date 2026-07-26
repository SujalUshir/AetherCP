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
  <><span className="text-accent-amber font-semibold">Rating distribution bar chart</span> — color-coded by Codeforces difficulty tier (800 through 3500)</>,
  <><span className="text-accent-purple font-semibold">Topic pie chart</span> — top 10 problem tags from all solved submissions, with counts and percentages</>,
  <><span className="text-accent-blue font-semibold">Solved count badge</span> — deduplicated total of unique accepted problems</>,
  <>Works on <span className="text-accent-orange font-semibold">any Codeforces profile</span> — not just your own</>,
  <>Fetches up to <span className="text-accent-amber font-semibold">200,000 submissions</span> from the public Codeforces API</>,
  <>Renders entirely <span className="text-accent-emerald font-semibold">client-side</span> — no external servers, no data uploaded</>,
];

export function CFAnalytics() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="relative py-24 sm:py-32">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      <div
        aria-hidden
        className="pointer-events-none absolute left-0 top-1/2 h-[600px] w-[600px] -translate-y-1/2 opacity-[0.02]"
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
              title="Profile analytics on"
              titleHighlight="any Codeforces profile"
              highlightColor="text-brand-medium"
              description="AetherCP injects a rating distribution chart and topic breakdown directly into any Codeforces profile page — sourced from the public API, rendered client-side."
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
                Analytics appear automatically on <span className="text-accent-orange font-semibold text-foreground">any visited Codeforces profile</span> — no configuration needed. Data is fetched read-only from the <span className="text-accent-blue font-semibold text-foreground">public Codeforces API</span> and never uploaded anywhere.
              </p>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
