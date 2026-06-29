"use client";

import Image from "next/image";
import { BrowserFrame } from "@/components/shared/BrowserFrame";
import { Container } from "@/components/shared/Container";
import { FadeUp } from "@/components/motion";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";

import popupScreenshot from "../../../public/screenshots/popup.png";
import analyticScreenshot from "../../../public/screenshots/analytic.png";
import competitiveScreenshot from "../../../public/screenshots/competitive.png";
import vscodeScreenshot from "../../../public/screenshots/vscode.png";
import historyScreenshot from "../../../public/screenshots/problem_history.png";

const SCREENSHOT_SECTIONS = [
  {
    id: "popup",
    title: "Extension Popup",
    description: (
      <>
        The main AetherCP popup in the toolbar. Access your active{" "}
        <span className="text-accent-amber font-semibold">session timer</span>, today&apos;s total{" "}
        <span className="text-accent-amber font-semibold">coding duration</span>, and recent problem list instantly.
      </>
    ),
    url: "codeforces.com/contest/2239/problem/A",
    src: popupScreenshot,
    maxWidthClass: "max-w-[280px]",
  },
  {
    id: "analytics",
    title: "Analytics Dashboard",
    description: (
      <>
        The detailed practice <span className="text-accent-blue font-semibold">analytics panel</span>. Displays daily coding times, solved problem counts,{" "}
        <span className="text-accent-amber font-semibold">active streaks</span>, and a{" "}
        <span className="text-accent-amber font-semibold">contribution heatmap</span>.
      </>
    ),
    url: "codeforces.com/problemset",
    src: analyticScreenshot,
    maxWidthClass: "max-w-[640px]",
  },
  {
    id: "cf-profile",
    title: "Codeforces Profile Analytics",
    description: (
      <>
        Analytics panel injected directly into <span className="text-accent-orange font-semibold">Codeforces</span> profiles. Shows{" "}
        <span className="text-accent-amber font-semibold">rating progression</span>, difficulty spreads, top tags, and contest performance.
      </>
    ),
    url: "codeforces.com/profile/tourist",
    src: competitiveScreenshot,
    maxWidthClass: "max-w-[640px]",
  },
  {
    id: "vscode",
    title: "VS Code Integration",
    description: (
      <>
        Automated editor workspace setup. Open active contest problems, limits, and sample test cases inside your{" "}
        <span className="text-accent-purple font-semibold">editor</span> in one click.
      </>
    ),
    url: "codeforces.com/contest/2100/problem/E",
    src: vscodeScreenshot,
    maxWidthClass: "max-w-full",
  },
  {
    id: "history",
    title: "Problem History",
    description: (
      <>
        A complete log of all solved and unsolved problem sessions in{" "}
        <span className="text-accent-emerald font-semibold">local storage</span>, detailed with duration, difficulty rating, and timestamps.
      </>
    ),
    url: "leetcode.com/problems/two-sum",
    src: historyScreenshot,
    maxWidthClass: "max-w-[640px]",
  },
];

function ScreenshotItem({ item, index }: { item: typeof SCREENSHOT_SECTIONS[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-20px" });

  return (
    <motion.div
      ref={ref}
      key={item.id}
      id={`screenshot-${item.id}`}
      initial={{ opacity: 0, y: 28 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1], delay: 0.04 * index }}
      className="flex flex-col gap-6"
    >
      {/* Label */}
      <div className="flex items-start gap-3">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary border border-primary/20">
          {index + 1}
        </span>
        <div>
          <h2 className="text-lg font-semibold">{item.title}</h2>
          <div className="text-sm text-muted-foreground">{item.description}</div>
        </div>
      </div>

      {/* Browser frame with real screenshot */}
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={isInView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.08 + 0.04 * index }}
      >
        <BrowserFrame url={item.url} size="lg">
          <div className="flex justify-center w-full py-4">
            <Image
              src={item.src}
              alt={item.title}
              className={`${item.maxWidthClass} w-full h-auto rounded-xl shadow-xl border border-white/5 select-none pointer-events-none transition-transform duration-300 hover:scale-[1.01]`}
            />
          </div>
        </BrowserFrame>
      </motion.div>
    </motion.div>
  );
}

export default function ScreenshotsPage() {
  return (
    <div className="pt-24 min-h-screen">
      {/* Header */}
      <section className="relative py-16 sm:py-20">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 -top-16 h-[400px] opacity-20"
          style={{ background: "radial-gradient(ellipse 70% 50% at 50% 0%, hsl(48 42% 89% / 0.3), transparent)" }}
        />
        <Container>
          <FadeUp className="flex flex-col items-center gap-4 text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-primary">
              Screenshots
            </span>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Actual product <span className="bg-gradient-to-r from-[#F0EBD8] via-[#E8DFC7] to-[#DDD3BA] bg-clip-text text-transparent">screenshots</span>
            </h1>
            <p className="max-w-xl text-base text-muted-foreground sm:text-lg">
              Explore the real interface and <span className="text-accent-blue font-semibold">analytics</span> injected by the AetherCP <span className="text-primary font-semibold">Chrome extension</span>.
            </p>
          </FadeUp>
        </Container>
      </section>

      {/* Screenshots */}
      <section className="pb-24 sm:pb-32">
        <Container size="xl">
          <div className="flex flex-col gap-20">
            {SCREENSHOT_SECTIONS.map((item, i) => (
              <ScreenshotItem key={item.id} item={item} index={i} />
            ))}
          </div>
        </Container>
      </section>
    </div>
  );
}
