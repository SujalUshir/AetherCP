"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Linkedin, Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GITHUB_URL } from "@/data/navigation";
import selfImg from "../../../public/screenshots/self.png";

const contentVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.09, delayChildren: 0.3 },
  },
};

const slideLeft = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] },
  },
};

const fadeScale = {
  hidden: { opacity: 0, scale: 0.97 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.75, ease: [0.16, 1, 0.3, 1] },
  },
};

const TECH_STACK = [
  "JavaScript",
  "TypeScript",
  "C++",
  "Python",
  "React",
  "Next.js",
  "Chrome Extensions",
];

export function AboutHero() {
  return (
    <section className="relative border-b border-border/40 bg-background overflow-hidden">
      {/* --- Desktop / Tablet: Image with overlaid text --- */}
      <div className="hidden sm:block">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeScale}
          className="relative w-full max-w-5xl mx-auto"
        >
          {/* The portrait image */}
          <Image
            src={selfImg}
            alt="Sujal Ushir"
            priority
            className="w-full h-auto object-contain select-none"
          />

          {/* Gradient overlay: dark on the left, fades to transparent on the right */}
          <div
            aria-hidden
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(to right, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.75) 38%, rgba(0,0,0,0.10) 62%, transparent 100%)",
            }}
          />

          {/* Content overlaid on the dark left area */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={contentVariants}
            className="absolute inset-0 flex flex-col justify-center px-10 md:px-14 lg:px-16 max-w-[55%]"
          >
            {/* Badge */}
            <motion.div variants={slideLeft} className="mb-5">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-primary">
                Developer / Creator of AetherCP
              </span>
            </motion.div>

            {/* Heading */}
            <motion.h1
              variants={slideLeft}
              className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.08] mb-4"
            >
              <span className="bg-gradient-to-r from-[#F0EBD8] via-[#E8DFC7] to-[#DDD3BA] bg-clip-text text-transparent">
                Hi, I&apos;m<br />Sujal Ushir.
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              variants={slideLeft}
              className="text-sm md:text-base text-white/70 leading-relaxed mb-6 max-w-xs"
            >
              CS student, <span className="text-accent-orange font-semibold">competitive programmer</span>, and <span className="text-accent-amber font-semibold">developer</span> building tools for coders who care about <span className="text-accent-amber font-semibold">performance</span> and <span className="text-accent-emerald font-semibold">privacy</span>.
            </motion.p>

            {/* Buttons */}
            <motion.div variants={slideLeft} className="flex flex-wrap gap-3 mb-7">
              <Button
                size="sm"
                asChild
                className="rounded-full shadow-sm px-5"
              >
                <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                  <Github className="h-4 w-4 btn-icon-github" />
                  View GitHub
                </a>
              </Button>
              <Button
                size="sm"
                variant="outline"
                asChild
                className="rounded-full px-5 border-white/20 text-white hover:bg-white/10"
              >
                <a
                  href="https://www.linkedin.com/in/sujal-ushir-a191b738b/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  <Linkedin className="h-4 w-4 btn-icon-social" />
                  Contact Me
                </a>
              </Button>
            </motion.div>

            {/* Tech Stack Chips */}
            <motion.div variants={slideLeft} className="flex flex-wrap gap-2">
              {TECH_STACK.map((tech) => (
                <span
                  key={tech}
                  className="inline-flex items-center rounded-md border border-white/10 bg-black/30 px-2.5 py-1 text-[10px] font-medium text-white/60 backdrop-blur-sm"
                >
                  {tech}
                </span>
              ))}
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* --- Mobile: Stacked layout (image first, then info) --- */}
      <div className="sm:hidden flex flex-col gap-6 px-6 py-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <Image
            src={selfImg}
            alt="Sujal Ushir"
            priority
            className="w-full h-auto rounded-2xl border border-white/10 shadow-xl object-contain"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          className="flex flex-col gap-5"
        >
          <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-primary">
            Developer / Creator of AetherCP
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight leading-tight">
            <span className="bg-gradient-to-r from-[#F0EBD8] via-[#E8DFC7] to-[#DDD3BA] bg-clip-text text-transparent">
              Hi, I&apos;m Sujal Ushir.
            </span>
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            CS student, <span className="text-accent-orange font-semibold">competitive programmer</span>, and <span className="text-accent-amber font-semibold">developer</span> building tools for coders who care about <span className="text-accent-amber font-semibold">performance</span> and <span className="text-accent-emerald font-semibold">privacy</span>.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button size="sm" asChild className="rounded-full px-5">
              <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                <Github className="h-4 w-4 btn-icon-github" />
                View GitHub
              </a>
            </Button>
            <Button size="sm" variant="outline" asChild className="rounded-full px-5">
              <a
                href="https://www.linkedin.com/in/sujal-ushir-a191b738b/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <Linkedin className="h-4 w-4 btn-icon-social" />
                Contact Me
              </a>
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {TECH_STACK.map((tech) => (
              <span
                key={tech}
                className="inline-flex items-center rounded-md border border-white/5 bg-bg-dark/40 px-2.5 py-1 text-[10px] font-medium text-muted-foreground"
              >
                {tech}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
