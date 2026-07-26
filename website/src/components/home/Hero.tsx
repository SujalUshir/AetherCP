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
import analyticScreenshot from "../../../public/screenshots/analytic.png";

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
    <section className="relative min-h-screen bg-background flex flex-col items-center justify-center pt-32 pb-24 overflow-hidden">
      {/* Background depth glows (Subtle light warmth) */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-[500px] w-[900px] -translate-x-1/2 opacity-[0.06]"
        style={{
          background: "radial-gradient(ellipse 60% 40% at 50% 0%, hsl(var(--primary)) 0%, transparent 70%)",
          filter: "blur(80px)",
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
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-primary shadow-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-accent-emerald animate-pulse" />
              Chrome Extension · v1.2.0
            </span>
          </motion.div>

          {/* Title / Heading */}
          <motion.div variants={slideInBottom}>
            <h1 className="text-5xl font-extrabold sm:text-7xl lg:text-8xl tracking-tight leading-[1.05] max-w-4xl text-foreground">
              Your Codeforces Training,{" "}
              <span className="text-brand-medium">Measured</span>{" "}
              <span className="text-brand-dark">Automatically.</span>
            </h1>
          </motion.div>

          {/* Description */}
          <motion.div variants={slideInBottom}>
            <p className="max-w-2xl text-base text-muted-foreground leading-relaxed sm:text-xl">
              A <span className="text-brand-medium font-semibold">local-first</span> browser extension that starts timing the moment you open a problem, pauses automatically after <span className="text-brand-dark font-semibold">5 minutes of inactivity</span>, and injects rich analytics directly into Codeforces profiles — no setup, no accounts required.
            </p>
          </motion.div>

          {/* Action Buttons */}
          <motion.div variants={slideInBottom} className="flex flex-col sm:flex-row gap-4 mt-2 w-full sm:w-auto">
            <Button size="xl" asChild id="hero-download-cta" className="rounded-xl px-10 py-7 text-base font-semibold shadow-sm">
              <a href={DOWNLOAD_URL} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                <Download className="h-5 w-5 btn-icon-download" />
                Download Latest Release
                <ArrowRight className="h-4 w-4 opacity-70 btn-icon-arrow" />
              </a>
            </Button>
            <Button size="xl" variant="outline" asChild id="hero-github-cta" className="rounded-xl px-10 py-7 text-base font-semibold">
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
                  "inline-flex items-center gap-1.5 rounded-full border px-4 py-1.5 text-xs font-medium transition-all duration-300 hover:border-primary/20",
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
          className="w-full max-w-4xl mt-16 relative"
        >
          <BrowserFrame url="codeforces.com/profile/tourist/analytics" size="sm" className="w-full card-premium overflow-hidden">
            <div className="relative w-full aspect-[16/10] bg-secondary/30">
              {/* Dashboard background */}
              <Image
                src={analyticScreenshot}
                alt="Codeforces Analytics Dashboard"
                fill
                className="object-cover object-top select-none pointer-events-none rounded-b-2xl"
                priority
              />

              {/* Floating Extension Popup on the Right Side (Entrance Parallax) */}
              <motion.div
                initial={{ opacity: 0, y: 35, x: 15, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, x: 0, scale: 1 }}
                transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1], delay: 0.65 }}
                className="absolute right-[4%] top-[8%] w-[26%] max-w-[220px] z-10 transition-transform duration-500 hover:scale-[1.03]"
              >
                <Image
                  src={popupScreenshot}
                  alt="AetherCP Extension Popup Preview"
                  className="rounded-xl border border-border shadow-xl select-none pointer-events-none w-full h-auto"
                />
              </motion.div>
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
            Designed for the platforms you compete on
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6 text-sm text-muted-foreground font-mono">
            <div className="flex items-center gap-2 grayscale opacity-55 hover:grayscale-0 hover:opacity-90 transition-all duration-300 cursor-default">
              <span className="h-2 w-2 rounded-full bg-accent-orange" />
              <span>CODEFORCES</span>
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
