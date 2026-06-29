"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Github, Download, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/shared/Container";
import { SearchDialog } from "@/components/shared/SearchDialog";

const NAV_LINKS = [
  { href: "/features",     label: "Features"     },
  { href: "/screenshots",  label: "Screenshots"  },
  { href: "/downloads",    label: "Downloads"    },
  { href: "/changelog",    label: "Changelog"    },
  { href: "/roadmap",      label: "Roadmap"      },
  { href: "/about",        label: "About"        },
];

import { GITHUB_URL, DOWNLOAD_URL } from "@/data/navigation";

export function Navbar() {
  const pathname   = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open,     setOpen]     = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setOpen(false); }, [pathname]);

  // Disable body scroll when drawer is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Close drawer on ESC press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
      }
    };
    if (open) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <motion.header
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled
          ? "border-b border-border/60 bg-background/90 shadow-lg shadow-black/20 backdrop-blur-xl"
          : "bg-transparent"
      )}
    >
      <Container>
        <nav className="flex h-16 items-center justify-between gap-4">
          {/* Mobile hamburger menu toggle */}
          <button
            id="mobile-menu-toggle"
            className="flex items-center justify-center rounded-md p-2 text-muted-foreground hover:text-foreground md:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          {/* Logo */}
          <Link
            href="/"
            className="group flex items-center gap-2.5 shrink-0 focus-visible:outline-none"
            aria-label="AetherCP Home"
          >
            <Image
              src="/icons/icon128.png"
              alt="AetherCP Logo"
              width={32}
              height={32}
              className="h-8 w-8 object-contain transition-transform duration-200 group-hover:scale-105"
            />
            <span className="text-lg font-bold tracking-tight">
              Aether<span className="text-primary">CP</span>
            </span>
          </Link>

          {/* Desktop links */}
          <ul className="hidden items-center gap-1 lg:flex">
            {NAV_LINKS.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className={cn(
                    "rounded-md px-3 py-2 text-sm font-medium transition-colors duration-150",
                    pathname === href
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Search Dialog & Desktop CTAs */}
          <div className="hidden items-center gap-3 md:flex ml-auto">
            <SearchDialog />
            <Button variant="ghost" size="sm" asChild>
              <a
                href={GITHUB_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <Github className="h-4 w-4 btn-icon-github" />
                GitHub
              </a>
            </Button>
            <Button size="sm" asChild>
              <a href={DOWNLOAD_URL} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                <Download className="h-4 w-4 btn-icon-download" />
                Download
              </a>
            </Button>
          </div>

          {/* Mobile Search dialog trigger */}
          <div className="flex items-center gap-2 md:hidden ml-auto">
            <SearchDialog />
          </div>
        </nav>
      </Container>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm md:hidden"
              onClick={() => setOpen(false)}
            />
            {/* Drawer */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.25, ease: "easeOut" }}
              className="fixed inset-y-0 left-0 z-[101] w-72 max-w-[80vw] bg-background border-r border-border/60 rounded-r-2xl shadow-2xl flex flex-col p-6 md:hidden"
            >
              {/* Logo and Close Button */}
              <div className="flex items-center justify-between pb-4 border-b border-border/40">
                <Link
                  href="/"
                  className="flex items-center gap-2.5 focus-visible:outline-none"
                  onClick={() => setOpen(false)}
                >
                  <Image
                    src="/icons/icon128.png"
                    alt="AetherCP Logo"
                    width={28}
                    height={28}
                    className="h-7 w-7 object-contain"
                  />
                  <span className="text-base font-bold tracking-tight">
                    Aether<span className="text-primary">CP</span>
                  </span>
                </Link>
                <button
                  className="p-1 rounded-md text-muted-foreground hover:text-foreground focus-visible:outline-none"
                  onClick={() => setOpen(false)}
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Navigation Links */}
              <nav className="flex flex-col gap-1.5 py-6 flex-1 overflow-y-auto">
                {NAV_LINKS.map(({ href, label }) => (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                      pathname === href
                        ? "bg-secondary text-foreground"
                        : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                    )}
                  >
                    {label}
                  </Link>
                ))}
              </nav>

              {/* Download and Social buttons near bottom */}
              <div className="mt-auto pt-4 border-t border-border/60 flex flex-col gap-2">
                <Button variant="outline" size="sm" asChild className="w-full">
                  <a
                    href={GITHUB_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2"
                    onClick={() => setOpen(false)}
                  >
                    <Github className="h-4 w-4" />
                    GitHub
                  </a>
                </Button>
                <Button size="sm" asChild className="w-full">
                  <a
                    href={DOWNLOAD_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2"
                    onClick={() => setOpen(false)}
                  >
                    <Download className="h-4 w-4" />
                    Download
                  </a>
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
