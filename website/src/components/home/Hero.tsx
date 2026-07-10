"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Download, Github, ArrowRight, ShieldCheck, HardDrive, Code2, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BrowserFrame } from "@/components/shared/BrowserFrame";
import { Container } from "@/components/shared/Container";
import { GITHUB_URL, DOWNLOAD_URL } from "@/data/navigation";
import { cn } from "@/lib/utils";
import popupScreenshot from "../../../public/screenshots/popup.png";

const heroContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const slideInBottom = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
  },
};

const imageFadeIn = {
  hidden: { opacity: 0, y: 40, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.4 },
  },
};

const CHIPS = [
  { label: "Privacy First", icon: ShieldCheck, colorClass: "text-accent-emerald border-accent-emerald/10 bg-accent-emerald/5" },
  { label: "Local Storage", icon: HardDrive, colorClass: "text-accent-emerald border-accent-emerald/10 bg-accent-emerald/5" },
  { label: "VS Code Integration", icon: Code2, colorClass: "text-accent-blue border-accent-blue/10 bg-accent-blue/5" },
  { label: "Open Source", icon: Heart, colorClass: "text-accent-orange border-accent-orange/10 bg-accent-orange/5" },
];

export function Hero() {
  return (
    <section className="relative min-h-screen bg-background grid-bg-subtle flex flex-col items-center justify-center pt-32 pb-24 overflow-hidden">
      {/* Background depth glows */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-[600px] w-[1000px] -translate-x-1/2 opacity-25"
        style={{
          background: "radial-gradient(ellipse 60% 40% at 50% 0%, hsl(var(--primary) / 0.35) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/3 h-[400px] w-[800px] -translate-x-1/2 opacity-10"
        style={{
          background: "radial-gradient(circle, hsl(var(--accent-blue) / 0.2) 0%, transparent 60%)",
          filter: "blur(50px)",
        }}
      />

      <Container size="xl" className="relative z-10 w-full flex flex-col items-center text-center">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={heroContainer}
          className="max-w-4xl flex flex-col items-center gap-8"
        >
          {/* Tagline Badge */}
          <motion.div variants={slideInBottom}>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/10 bg-primary/5 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-primary shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]">
              <span className="h-1.5 w-1.5 rounded-full bg-accent-emerald animate-pulse" />
              Chrome Extension · v1.2.0
            </span>
          </motion.div>

          {/* Title / Heading */}
          <motion.div variants={slideInBottom}>
            <h1 className="text-5xl font-extrabold sm:text-7xl lg:text-8xl tracking-tight leading-[1.05] max-w-3xl">
              Competitive Programming,{" "}
              <span className="bg-gradient-to-r from-[#F0EBD8] via-[#E8DFC7] to-[#DDD3BA] bg-clip-text text-transparent">
                Instrumented.
              </span>
            </h1>
          </motion.div>

          {/* Description */}
          <motion.div variants={slideInBottom}>
            <p className="max-w-2xl text-base text-muted-foreground leading-relaxed sm:text-xl">
              A high-performance, <span className="text-accent-emerald font-semibold">local-first</span> browser extension that automates session timing, injects visual <span className="text-accent-blue font-semibold">execution metrics</span> directly into Codeforces profiles, and establishes instant loopback synchronization with VS Code.
            </p>
          </motion.div>

          {/* Action Buttons */}
          <motion.div variants={slideInBottom} className="flex flex-col sm:flex-row gap-4 mt-2 w-full sm:w-auto">
            <Button size="xl" asChild id="hero-download-cta" className="rounded-xl px-10 py-7 text-base font-semibold shadow-2xl">
              <a href={DOWNLOAD_URL} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                <Download className="h-5 w-5 btn-icon-download" />
                Download Latest Release
                <ArrowRight className="h-4 w-4 opacity-70 btn-icon-arrow" />
              </a>
            </Button>
            <Button size="xl" variant="glass" asChild id="hero-github-cta" className="rounded-xl px-10 py-7 text-base font-semibold">
              <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                <Github className="h-5 w-5 btn-icon-github" />
                View on GitHub
              </a>
            </Button>
          </motion.div>

          {/* Small Feature Chips */}
          <motion.div
            variants={slideInBottom}
            className="flex flex-wrap items-center justify-center gap-3 mt-4"
          >
            {CHIPS.map(({ label, icon: Icon, colorClass }) => (
              <span
                key={label}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full border px-4 py-1.5 text-xs font-medium transition-all duration-300 hover:border-white/10 hover:text-foreground",
                  colorClass
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                {label}
              </span>
            ))}
          </motion.div>
        </motion.div>

        {/* Large Mockup Image (Merged Extension Preview) */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={imageFadeIn}
          className="w-full max-w-4xl mt-20 relative"
        >
          {/* Subtle glow behind preview */}
          <div
            aria-hidden
            className="pointer-events-none absolute -inset-10 rounded-[2.5rem] opacity-35 bg-gradient-radial from-accent-blue/10 via-transparent to-transparent blur-3xl"
          />

          <BrowserFrame url="codeforces.com/contest/2239/problem/A" size="sm" className="w-full card-premium">
            <div className="flex justify-center w-full py-8 bg-bg-darker/20 rounded-b-2xl">
              <div className="relative group max-w-[300px] w-full">
                {/* Glow ring around popup screenshot */}
                <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-accent-blue/10 to-accent-purple/10 opacity-75 blur-xl group-hover:opacity-100 transition-opacity duration-500" />
                <Image
                  src={popupScreenshot}
                  alt="AetherCP Extension Popup Preview"
                  className="relative max-w-full w-full h-auto rounded-xl border border-white/10 shadow-2xl transition-all duration-500 hover:scale-[1.01] hover:border-white/20 select-none pointer-events-none"
                  priority
                />
              </div>
            </div>
          </BrowserFrame>
        </motion.div>

        {/* Social Proof / Credibility Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="w-full max-w-4xl mt-16 pt-10 border-t border-border/40 flex flex-col items-center gap-6"
        >
          <p className="text-xs uppercase tracking-widest text-muted-foreground/60 font-semibold">
            Optimized for the platforms you use daily
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6 text-sm text-muted-foreground font-mono">
            <div className="flex items-center gap-2 grayscale opacity-55 hover:grayscale-0 hover:opacity-90 transition-all duration-300 cursor-default">
              <span className="h-2 w-2 rounded-full bg-accent-orange" />
              <span>CODEFORCES</span>
            </div>
            <div className="flex items-center gap-2 grayscale opacity-55 hover:grayscale-0 hover:opacity-90 transition-all duration-300 cursor-default">
              <span className="h-2 w-2 rounded-full bg-accent-amber" />
              <span>LEETCODE</span>
            </div>
            <div className="flex items-center gap-2 grayscale opacity-55 hover:grayscale-0 hover:opacity-90 transition-all duration-300 cursor-default">
              <span className="h-2 w-2 rounded-full bg-accent-blue" />
              <span>VS CODE</span>
            </div>
            <div className="flex items-center gap-2 grayscale opacity-55 hover:grayscale-0 hover:opacity-90 transition-all duration-300 cursor-default">
              <span className="h-2 w-2 rounded-full bg-accent-slate" />
              <span>GITHUB</span>
            </div>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
