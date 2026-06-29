"use client";

import { useEffect, useState, useRef } from "react";
import { Search, HelpCircle, ArrowRight, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { FAQ_ITEMS } from "@/data/faq";
import { FEATURE_CARDS } from "@/data/features";
import { ROADMAP_ITEMS } from "@/data/roadmap";
import { CHANGELOG } from "@/data/changelog";

interface SearchResult {
  title: string;
  description: string;
  category: "Page" | "Feature" | "FAQ" | "Roadmap" | "Changelog";
  href: string;
}

const STATIC_PAGES: SearchResult[] = [
  { title: "Home Page", description: "Learn about AetherCP's features, principles, and statistics.", category: "Page", href: "/" },
  { title: "Features", description: "Full list of features including timers, heatmaps, and VS Code support.", category: "Page", href: "/features" },
  { title: "Screenshots", description: "Visual mockup gallery of popup tabs, Codeforces dashboard, and VS Code code editor.", category: "Page", href: "/screenshots" },
  { title: "Downloads", description: "Download installation archives, system requirements, and installation steps.", category: "Page", href: "/downloads" },
  { title: "Changelog", description: "AetherCP version release history, added features, and fixed bugs.", category: "Page", href: "/changelog" },
  { title: "Roadmap", description: "Future plans, platform support, encryption, goals, and achievements.", category: "Page", href: "/roadmap" },
  { title: "About Us", description: "compelling developer stories, core mission, and open-source principles.", category: "Page", href: "/about" },
  { title: "Privacy Policy", description: "Explanation of local storage, permissions, zero tracking, and data safety.", category: "Page", href: "/privacy" },
  { title: "Feedback & Support", description: "Report bugs, request extensions, or ask questions on GitHub.", category: "Page", href: "/feedback" },
];

export function SearchDialog() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>(STATIC_PAGES);
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Toggle search dialog with Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Set focus when dialog opens
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery("");
      setResults(STATIC_PAGES);
      setActiveIndex(0);
    }
  }, [open]);

  // Handle matching items
  useEffect(() => {
    if (!query.trim()) {
      setResults(STATIC_PAGES);
      return;
    }

    const term = query.toLowerCase();
    const matches: SearchResult[] = [];

    // Search Pages
    STATIC_PAGES.forEach((p) => {
      if (p.title.toLowerCase().includes(term) || p.description.toLowerCase().includes(term)) {
        matches.push(p);
      }
    });

    // Search Features
    FEATURE_CARDS.forEach((f) => {
      if (f.title.toLowerCase().includes(term) || f.description.toLowerCase().includes(term)) {
        matches.push({
          title: f.title,
          description: f.description,
          category: "Feature",
          href: `/#feature-${f.id}`,
        });
      }
    });

    // Search FAQs
    FAQ_ITEMS.forEach((faq) => {
      if (faq.question.toLowerCase().includes(term) || faq.answer.toLowerCase().includes(term)) {
        matches.push({
          title: faq.question,
          description: faq.answer,
          category: "FAQ",
          href: `/#faq`,
        });
      }
    });

    // Search Roadmap
    ROADMAP_ITEMS.forEach((road) => {
      if (road.title.toLowerCase().includes(term) || road.description.toLowerCase().includes(term)) {
        matches.push({
          title: road.title,
          description: road.description,
          category: "Roadmap",
          href: `/roadmap`,
        });
      }
    });

    // Search Changelog
    CHANGELOG.forEach((ch) => {
      if (ch.version.toLowerCase().includes(term) || ch.summary.toLowerCase().includes(term)) {
        matches.push({
          title: `Version ${ch.version}`,
          description: ch.summary,
          category: "Changelog",
          href: `/changelog`,
        });
      }
    });

    setResults(matches);
    setActiveIndex(0);
  }, [query]);

  // Navigation handlers
  const handleNav = (href: string) => {
    setOpen(false);
    router.push(href);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => (prev + 1) % Math.max(results.length, 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => (prev - 1 + results.length) % Math.max(results.length, 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (results[activeIndex]) {
        handleNav(results[activeIndex].href);
      }
    }
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex items-center justify-between rounded-lg border border-border/60 bg-white/5 px-3 py-1.5 text-xs text-muted-foreground hover:bg-white/10 hover:text-foreground transition-all w-40 max-w-full"
        aria-label="Open search dialog"
      >
        <div className="flex items-center gap-2">
          <Search className="h-3.5 w-3.5" />
          <span>Search...</span>
        </div>
        <kbd className="hidden sm:inline-block pointer-events-none select-none rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground/80">
          ⌘K
        </kbd>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-background/80 backdrop-blur-sm"
        onClick={() => setOpen(false)}
      />

      {/* Modal Dialog */}
      <div
        role="dialog"
        aria-modal="true"
        className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-white/10 bg-[hsl(222,47%,7%)] shadow-2xl transition-all flex flex-col max-h-[60vh] mx-4"
        onKeyDown={handleKeyDown}
      >
        {/* Search header */}
        <div className="flex items-center border-b border-white/5 px-4 py-3 bg-white/[0.01]">
          <Search className="h-4 w-4 text-muted-foreground shrink-0 mr-3" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a feature, FAQ or page..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground/50 border-0 focus:ring-0 p-0"
          />
          <button
            onClick={() => setOpen(false)}
            className="text-muted-foreground hover:text-foreground"
            aria-label="Close search"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="overflow-y-auto flex-1 p-2 divide-y divide-white/[0.02]">
          {results.map((res, idx) => {
            const isSelected = idx === activeIndex;
            return (
              <div
                key={`${res.category}-${res.href}-${res.title}`}
                onClick={() => handleNav(res.href)}
                onMouseEnter={() => setActiveIndex(idx)}
                className={cn(
                  "flex items-start justify-between gap-4 p-3 rounded-xl cursor-pointer transition-all",
                  isSelected ? "bg-primary/10 border border-primary/20" : "border border-transparent"
                )}
              >
                <div className="flex flex-col gap-1 min-w-0">
                  <span className="text-xs font-semibold text-foreground truncate">{res.title}</span>
                  <span className="text-[10px] text-muted-foreground line-clamp-2 leading-relaxed">{res.description}</span>
                </div>
                <div className="flex items-center gap-2 shrink-0 self-center">
                  <span className={cn(
                    "rounded px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider",
                    "bg-primary/10 text-primary border border-primary/20"
                  )}>
                    {res.category}
                  </span>
                  <ArrowRight className={cn("h-3 w-3 text-primary transition-transform", isSelected ? "translate-x-0.5" : "opacity-0")} />
                </div>
              </div>
            );
          })}

          {results.length === 0 && (
            <div className="py-12 text-center flex flex-col items-center gap-2">
              <HelpCircle className="h-8 w-8 text-muted-foreground/30" />
              <p className="text-xs text-muted-foreground font-medium">No results found for &ldquo;{query}&rdquo;</p>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="border-t border-white/5 px-4 py-2 text-[10px] text-muted-foreground/50 flex items-center justify-between bg-white/[0.01] select-none">
          <span>Search AetherCP docs</span>
          <div className="flex items-center gap-3">
            <span>↑↓ to navigate</span>
            <span>↵ to select</span>
            <span>esc to close</span>
          </div>
        </div>
      </div>
    </div>
  );
}
