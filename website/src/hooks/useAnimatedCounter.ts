"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

/**
 * Animates a number from 0 to `target` over `duration` ms,
 * triggering once the ref element enters the viewport.
 */
export function useAnimatedCounter(
  target: number,
  duration = 1500
): { ref: React.RefObject<HTMLElement | null>; value: number } {
  const ref = useRef<HTMLElement | null>(null);
  const isInView = useInView(ref as React.RefObject<Element>, {
    once: true,
    margin: "-60px",
  });
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    const startTime = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  }, [isInView, target, duration]);

  return { ref, value };
}
