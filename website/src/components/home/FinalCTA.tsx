"use client";


import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Download, Github, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/shared/Container";

import { GITHUB_URL, DOWNLOAD_URL } from "@/data/navigation";

export function FinalCTA() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="relative py-24 sm:py-32">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border to-transparent"
      />

      {/* Glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 50% 50%, hsl(238 84% 67% / 0.3), transparent)",
        }}
      />

      <Container size="md">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 32 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative flex flex-col items-center gap-8 rounded-3xl border border-indigo-500/20 bg-gradient-to-b from-indigo-500/5 to-transparent p-12 text-center"
        >
          <div className="flex flex-col gap-3">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl leading-tight">
              Optimize your{" "}
              <span className="bg-gradient-to-r from-[#F0EBD8] via-[#E8DFC7] to-[#DDD3BA] bg-clip-text text-transparent">
                training today.
              </span>
            </h2>
            <p className="max-w-lg text-base text-muted-foreground sm:text-lg mx-auto">
              MIT Licensed. Open-source. Zero telemetry configurations. Load unpacked source locally in seconds.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button size="xl" asChild id="final-cta-download">
              <a href={DOWNLOAD_URL} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                <Download className="h-5 w-5 btn-icon-download" />
                Download Extension
                <ArrowRight className="h-4 w-4 opacity-70 btn-icon-arrow" />
              </a>
            </Button>
            <Button size="xl" variant="glass" asChild id="final-cta-github">
              <a
                href={GITHUB_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <Github className="h-5 w-5 btn-icon-github" />
                View Source
              </a>
            </Button>
          </div>

          <p className="text-xs text-muted-foreground/60">
            MIT License · Chrome Web Store · v1.2.0
          </p>
        </motion.div>
      </Container>
    </section>
  );
}
