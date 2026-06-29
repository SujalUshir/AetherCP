"use client";

import { useRef } from "react";
import { motion, useInView, HTMLMotionProps } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface ScrollRevealProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  yOffset?: number;
  xOffset?: number;
  scale?: number;
  once?: boolean;
}

export function ScrollReveal({
  children,
  delay = 0,
  duration = 0.55,
  yOffset = 24,
  xOffset = 0,
  scale = 1,
  once = true,
  className,
  ...props
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, margin: "-40px" });
  const shouldReduceMotion = useReducedMotion();

  // If user prefers reduced motion, disable transform offsets
  const finalY = shouldReduceMotion ? 0 : yOffset;
  const finalX = shouldReduceMotion ? 0 : xOffset;
  const finalScale = shouldReduceMotion ? 1 : scale;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: finalY, x: finalX, scale: finalScale }}
      animate={isInView ? { opacity: 1, y: 0, x: 0, scale: 1 } : {}}
      transition={{
        delay,
        duration,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}
