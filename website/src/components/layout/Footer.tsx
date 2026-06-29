"use client";

import Image from "next/image";
import Link from "next/link";
import { Github } from "lucide-react";
import { Container } from "@/components/shared/Container";
import { FOOTER_GROUPS, GITHUB_URL } from "@/data/navigation";
import { FadeIn } from "@/components/motion";

export function Footer() {
  return (
    <footer className="relative border-t border-border/60 bg-background/80 pt-16 pb-8">
      {/* Top gradient line */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent"
      />

      <FadeIn margin="-40px">

      <Container>
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:gap-12">
          {/* Brand column */}
          <div className="col-span-2 flex flex-col gap-4 md:col-span-1">
            <Link href="/" className="group flex items-center gap-2.5">
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
            <p className="max-w-[220px] text-sm leading-relaxed text-muted-foreground">
              The privacy-first competitive programming companion. 100% local.
              No backend. No tracking.
            </p>
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-fit items-center gap-2 rounded-md border border-border/60 px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
            >
              <Github className="h-3.5 w-3.5" />
              View on GitHub
            </a>
          </div>

          {/* Link columns */}
          {FOOTER_GROUPS.map((group) => (
            <div key={group.label} className="flex flex-col gap-3">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/60">
                {group.label}
              </p>
              <ul className="flex flex-col gap-2">
                {group.links.map(({ href, label, external }) => (
                  <li key={href}>
                    {external ? (
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {label}
                      </a>
                    ) : (
                      <Link
                        href={href}
                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-border/60 pt-6 text-xs text-muted-foreground sm:flex-row">
          <p>
            © {new Date().getFullYear()} AetherCP. Open source under the MIT
            License.
          </p>
          <p>
            Made with{" "}
            <span className="text-primary">♥</span> by{" "}
            <a
              href="https://github.com/SujalUshir"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-foreground/80 transition-colors hover:text-primary"
            >
              Sujal Ushir
            </a>
          </p>
        </div>
      </Container>
      </FadeIn>
    </footer>
  );
}
