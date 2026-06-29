"use client";

import { useScrollProgress } from "@/hooks/useScrollProgress";

export function ScrollProgress() {
  const progress = useScrollProgress();

  return (
    <div
      className="fixed inset-x-0 top-0 z-[100] h-[2px]"
      role="progressbar"
      aria-valuenow={Math.round(progress)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Page scroll progress"
    >
      <div
        className="h-full bg-primary transition-none"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
