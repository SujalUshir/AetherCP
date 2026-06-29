/**
 * AetherCP Motion Primitives
 *
 * Reusable Framer Motion wrappers for scroll-triggered animations.
 * All components use `useInView` with `once: true` so they only play once.
 * All components respect `prefers-reduced-motion` via a CSS media query
 * on the root html element (handled in globals.css).
 */

"use client";

import { useRef } from "react";
import { motion, useInView, type Variants } from "framer-motion";
import { cn } from "@/lib/utils";

// --- Shared Timing Constants ---------------------------------
export const EASE_OUT   = [0.16, 1, 0.3, 1] as const;
export const EASE_SNAPPY = [0.22, 1, 0.36, 1] as const;

// --- Base Variants --------------------------------------------

export const fadeUp: Variants = {
  hidden:  { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE_OUT } },
};

export const fadeIn: Variants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.55, ease: "easeOut" } },
};

export const fadeScale: Variants = {
  hidden:  { opacity: 0, scale: 0.96 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.65, ease: EASE_OUT } },
};

export const slideLeft: Variants = {
  hidden:  { opacity: 0, x: -24 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: EASE_OUT } },
};

export const slideRight: Variants = {
  hidden:  { opacity: 0, x: 24 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: EASE_OUT } },
};

export const staggerContainer: Variants = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
};

// --- Component Props ------------------------------------------

interface AnimProps {
  children: React.ReactNode;
  className?: string;
  /** Extra delay before animation plays, in seconds */
  delay?: number;
  /** Viewport margin before triggering (default "-80px") */
  margin?: string;
}

function makeAnimComponent(variants: Variants) {
  return function AnimComponent({
    children,
    className,
    delay = 0,
    margin = "-20px",
  }: AnimProps) {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, margin: margin as "0px" });

    // Clone variants to apply delay without mutating the shared object
    const delayedVariants: Variants = delay
      ? {
          hidden: variants.hidden,
          visible: {
            ...((variants.visible as object) ?? {}),
            transition: {
              ...((variants.visible as { transition?: object })?.transition ?? {}),
              delay,
            },
          },
        }
      : variants;

    return (
      <motion.div
        ref={ref}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        variants={delayedVariants}
        className={cn(className)}
      >
        {children}
      </motion.div>
    );
  };
}

/** Fades in + slides up. Best for headings, paragraphs, full sections. */
export const FadeUp = makeAnimComponent(fadeUp);

/** Pure fade. Best for subtle reveals, overlays. */
export const FadeIn = makeAnimComponent(fadeIn);

/** Fades in + scales from 0.96. Best for screenshots, images, cards. */
export const FadeScale = makeAnimComponent(fadeScale);

/** Slides in from left. Best for left-column content. */
export const SlideLeft = makeAnimComponent(slideLeft);

/** Slides in from right. Best for right-column content / images. */
export const SlideRight = makeAnimComponent(slideRight);

// --- Stagger Container ----------------------------------------

interface StaggerProps {
  children: React.ReactNode;
  className?: string;
  /** Delay between children, default 0.09s */
  stagger?: number;
  margin?: string;
}

/** Wraps children and staggers their `fadeUp` animations */
export function StaggerFadeUp({
  children,
  className,
  stagger = 0.09,
  margin = "-60px",
}: StaggerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: margin as "0px" });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={{
        hidden:  {},
        visible: { transition: { staggerChildren: stagger, delayChildren: 0.05 } },
      }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}

/** Child item for use inside StaggerFadeUp */
export function StaggerItem({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div variants={fadeUp} className={cn(className)}>
      {children}
    </motion.div>
  );
}
