"use client";


import { motion } from "framer-motion";
import { Download, Github, ArrowRight, ShieldCheck, HardDrive, Code2, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BrowserFrame } from "@/components/shared/BrowserFrame";
import { Container } from "@/components/shared/Container";
import { GITHUB_URL, DOWNLOAD_URL } from "@/data/navigation";
import { cn } from "@/lib/utils";

const heroContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const slideInBottom = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
};

const slideInRight = {
  hidden: { opacity: 0, x: 32 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.25 },
  },
};

const CHIPS = [
  { label: "Privacy First", icon: ShieldCheck, colorClass: "text-accent-emerald border-accent-emerald/20 bg-accent-emerald/5" },
  { label: "Local Storage", icon: HardDrive, colorClass: "text-accent-emerald border-accent-emerald/20 bg-accent-emerald/5" },
  { label: "VS Code Integration", icon: Code2, colorClass: "text-accent-blue border-accent-blue/20 bg-accent-blue/5" },
  { label: "Open Source", icon: Heart, colorClass: "text-accent-orange border-accent-orange/20 bg-accent-orange/5" },
];

export function Hero() {
  return (
    <section className="relative min-h-screen bg-background noise-overlay flex items-center pt-24 pb-16 overflow-hidden">
      {/* Background depth radial glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute right-0 top-1/4 h-[700px] w-[700px] -translate-y-1/3 opacity-15"
        style={{
          background: "radial-gradient(circle, hsl(var(--primary) / 0.2) 0%, transparent 70%)",
          filter: "blur(50px)",
        }}
      />

      <Container size="xl" className="relative z-10 w-full">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={heroContainer}
          className="grid gap-12 lg:grid-cols-12 lg:gap-16 items-center"
        >
          {/* Left Column: Content */}
          <div className="lg:col-span-7 flex flex-col gap-6 text-left order-2 lg:order-1">
            {/* Tagline Badge */}
            <motion.div variants={slideInBottom}>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-primary">
                ✦ Chrome Extension · v1.2.0
              </span>
            </motion.div>

            {/* Title / Heading */}
            <motion.div variants={slideInBottom}>
              <h1 className="text-6xl font-extrabold sm:text-7xl lg:text-8xl tracking-tight leading-[0.95]">
                <span className="bg-gradient-to-r from-[#F0EBD8] via-[#E8DFC7] to-[#DDD3BA] bg-clip-text text-transparent">
                  Aether<span className="text-primary">CP</span>
                </span>
              </h1>
            </motion.div>

            {/* Description */}
            <motion.div variants={slideInBottom}>
              <p className="max-w-xl text-base text-muted-foreground leading-relaxed sm:text-lg">
                A <span className="text-accent-emerald font-semibold">privacy-first</span> competitive programming companion that tracks <span className="text-accent-amber font-semibold">coding sessions</span>, provides dashboard <span className="text-accent-blue font-semibold">analytics</span>, and integrates seamlessly with VS Code. Built <span className="text-accent-emerald font-semibold">local-first</span> with zero tracking.
              </p>
            </motion.div>

            {/* Action Buttons */}
            <motion.div variants={slideInBottom} className="flex flex-col sm:flex-row gap-3 mt-2">
              <Button size="lg" asChild id="hero-download-cta" className="rounded-full shadow-md shadow-black/10 hover:shadow-lg transition-all duration-300 px-8 py-6 text-base">
                <a href={DOWNLOAD_URL} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                  <Download className="h-5 w-5 btn-icon-download" />
                  Download Latest Release
                  <ArrowRight className="h-4 w-4 opacity-70 btn-icon-arrow" />
                </a>
              </Button>
              <Button size="lg" variant="glass" asChild id="hero-github-cta" className="rounded-full px-8 py-6 text-base">
                <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                  <Github className="h-5 w-5 btn-icon-github" />
                  View on GitHub
                </a>
              </Button>
            </motion.div>

            {/* Small Feature Chips */}
            <motion.div
              variants={slideInBottom}
              className="flex flex-wrap gap-2.5 mt-4"
            >
              {CHIPS.map(({ label, icon: Icon, colorClass }) => (
                <span
                  key={label}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors hover:text-foreground",
                    colorClass
                  )}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {label}
                </span>
              ))}
            </motion.div>
          </div>

          {/* Right Column: Large Interactive Image */}
          <motion.div
            variants={slideInRight}
            className="lg:col-span-5 flex justify-center lg:justify-end order-1 lg:order-2"
          >
            <div className="w-full max-w-[480px] lg:max-w-full">
              <BrowserFrame url="codeforces.com/contest/2239/problem/A" size="sm" className="w-full">
                <div className="flex justify-center w-full py-4 bg-bg-darker/25">
                  <img
                    src="/screenshots/popup.png"
                    alt="AetherCP Extension Popup Preview"
                    className="max-w-[280px] sm:max-w-[300px] w-full rounded-xl border border-white/10 shadow-2xl transition-transform duration-500 hover:scale-[1.01] select-none pointer-events-none"
                  />
                </div>
              </BrowserFrame>
            </div>
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
}
