"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () =>
    window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <button
      onClick={scrollToTop}
      aria-label="Back to top"
      className={cn(
        "fixed bottom-8 right-8 z-50 flex h-10 w-10 items-center justify-center rounded-xl",
        "border border-border/60 bg-card/90 backdrop-blur-sm shadow-lg shadow-black/20",
        "text-muted-foreground transition-all duration-300 hover:border-primary/40 hover:text-primary",
        visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0 pointer-events-none"
      )}
    >
      <ArrowUp className="h-4 w-4" />
    </button>
  );
}
