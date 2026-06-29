"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { BrowserFrame } from "@/components/shared/BrowserFrame";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Container } from "@/components/shared/Container";

export function ProductPreview() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="relative py-24 sm:py-32">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent" />

      <Container>
        <div className="mb-12 flex justify-center">
          <SectionHeading
            eyebrow="Product Preview"
            title="Everything you need,"
            titleHighlight="right in your browser"
            description="AetherCP lives as a lightweight popup — instant access to your session timer, analytics, and VS Code integration. Click the tabs to explore."
          />
        </div>

        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 48 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          {/* Outer glow */}
          <div
            aria-hidden
            className="pointer-events-none absolute -inset-px rounded-3xl opacity-25"
            style={{ background: "radial-gradient(ellipse 60% 40% at 50% 50%, hsl(238 84% 67% / 0.5), transparent)", filter: "blur(48px)" }}
          />
          <BrowserFrame url="codeforces.com/contest/2239/problem/A">
            <div className="flex justify-center w-full py-4">
              <img
                src="/screenshots/popup.png"
                alt="AetherCP Extension Popup"
                className="max-w-[280px] w-full rounded-2xl shadow-xl border border-white/10 select-none pointer-events-none transition-transform duration-300 hover:scale-[1.02]"
              />
            </div>
          </BrowserFrame>
        </motion.div>

        {/* Platform badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-3"
        >
          {[
            { label: "Chrome Extension", color: "border-accent-emerald/20 text-accent-emerald bg-accent-emerald/5" },
            { label: "Codeforces",        color: "border-accent-orange/20 text-accent-orange bg-accent-orange/5" },
            { label: "LeetCode",          color: "border-accent-amber/20 text-accent-amber bg-accent-amber/5" },
            { label: "VS Code",           color: "border-accent-blue/20 text-accent-blue bg-accent-blue/5" },
          ].map(({ label, color }) => (
            <span key={label} className={`rounded-full border px-3.5 py-1 text-xs font-semibold ${color}`}>
              {label}
            </span>
          ))}
        </motion.div>
      </Container>
    </section>
  );
}
