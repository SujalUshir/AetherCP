"use client";

import Link from "next/link";
import { Download, Github, ExternalLink, Chrome, FileArchive, CheckCircle2, Info, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/shared/Container";
import { GITHUB_URL, DOWNLOAD_URL } from "@/data/navigation";
import { FadeUp, StaggerFadeUp, StaggerItem } from "@/components/motion";

const REQUIREMENTS = [
  <>Google <span className="text-accent-orange font-semibold">Chrome</span> 88+ or any Chromium-based browser</>,
  <>Windows, macOS, or Linux operating system</>,
  <>No account or <span className="text-accent-amber font-semibold">sign-up</span> required</>,
  <>No internet connection required after <span className="text-accent-emerald font-semibold">install</span></>,
];

const INSTALL_STEPS = [
  { step: 1, title: "Download the ZIP",      body: <>Download the latest release ZIP file from <span className="text-accent-blue font-semibold">GitHub Releases</span> below.</> },
  { step: 2, title: "Extract the archive",   body: "Extract the ZIP file to a permanent folder on your machine. Do not delete this folder after installation." },
  { step: 3, title: "Open Chrome Extensions",body: <>Navigate to <code className="text-accent-orange">chrome://extensions</code> in your browser address bar.</> },
  { step: 4, title: "Enable Developer Mode", body: <>Toggle on the <span className="text-accent-emerald font-semibold">Developer Mode</span> switch in the top-right corner of the Extensions page.</> },
  { step: 5, title: "Load Unpacked",          body: <>Click <span className="text-accent-purple font-semibold">Load unpacked</span> and select the extracted AetherCP folder. The extension will appear immediately.</> },
  { step: 6, title: "Pin to Toolbar",         body: <>Click the Extensions icon (puzzle piece) in Chrome and pin AetherCP for quick access.</> },
];

const RELEASE_NOTES = [
  <><span className="text-accent-orange font-semibold">Codeforces</span> profile analytics dashboard</>,
  <>Support for contest URL formats</>,
  <><span className="text-accent-amber font-semibold">Rating progression</span> graph and verdict distribution</>,
  <>Tag analysis with difficulty breakdown</>,
  <><span className="text-accent-purple font-semibold">VS Code</span> integration improvements</>,
  <>Idle detection threshold increased to 15 minutes</>,
  <><span className="text-accent-emerald font-semibold">Performance</span> improvements across all views</>,
  <>Bug fixes for session persistence on restart</>,
];

export default function DownloadsPage() {
  return (
    <div className="pt-24">
      {/* Header */}
      <section className="relative py-16 sm:py-20">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 -top-16 h-[400px] opacity-20"
          style={{ background: "radial-gradient(ellipse 70% 50% at 50% 0%, hsl(238 84% 67%), transparent)" }}
        />
        <Container>
          <FadeUp className="flex flex-col items-center gap-4 text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-accent-emerald/20 bg-accent-emerald/10 px-3 py-1 text-xs font-semibold text-accent-emerald">
              <span className="h-1.5 w-1.5 rounded-full bg-accent-emerald animate-pulse" />
              Latest Release — v1.2.0
            </span>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Download <span className="bg-gradient-to-r from-[#F0EBD8] via-[#E8DFC7] to-[#DDD3BA] bg-clip-text text-transparent">AetherCP</span>
            </h1>
            <p className="max-w-xl text-base text-muted-foreground sm:text-lg">
              Free to use, forever. No account required. <span className="text-accent-emerald font-semibold">Install</span> in under 60 seconds.
            </p>
          </FadeUp>
        </Container>
      </section>      {/* Download Options */}
      <section className="pb-16">
        <Container>
          <StaggerFadeUp className="grid gap-6 sm:grid-cols-3">
            {/* Chrome Web Store */}
            <StaggerItem>
              <div className="flex flex-col gap-5 rounded-2xl p-8 h-full card-premium noise-overlay">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent-blue/10 border border-accent-blue/10">
                    <Chrome className="h-5 w-5 text-accent-blue" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Chrome Web Store</p>
                    <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">One-click install</p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed flex-grow">
                  The recommended installation method. Install directly from the Chrome Web Store without enabling Developer Mode.
                </p>
                <div className="rounded-xl border border-accent-orange/15 bg-accent-orange/5 p-4 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.01)]">
                  <div className="flex items-center gap-2 text-[10px] text-accent-orange font-semibold">
                    <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                    Under review — available soon
                  </div>
                </div>
                <Button variant="outline" disabled className="w-full rounded-xl" aria-disabled>
                  <Chrome className="mr-2 h-4 w-4" />
                  Coming Soon
                </Button>
              </div>
            </StaggerItem>

            {/* GitHub Releases */}
            <StaggerItem>
              <div className="flex flex-col gap-5 rounded-2xl p-8 h-full card-premium noise-overlay border-accent-blue/20 shadow-lg shadow-accent-blue/5">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent-blue/10 border border-accent-blue/10">
                    <FileArchive className="h-5 w-5 text-accent-blue" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">GitHub Releases</p>
                    <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">ZIP — v1.2.0</p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed flex-grow">
                  Download the latest ZIP from GitHub and load it as an unpacked extension. See installation steps below.
                </p>
                <div className="text-[10px] text-muted-foreground/60 font-medium">Released June 2026 · MIT License</div>
                <Button asChild className="w-full rounded-xl" id="download-zip">
                  <a href={DOWNLOAD_URL} target="_blank" rel="noopener noreferrer">
                    <Download className="mr-2 h-4 w-4 btn-icon-download" />
                    Download v1.2.0 ZIP
                  </a>
                </Button>
              </div>
            </StaggerItem>

            {/* Source */}
            <StaggerItem>
              <div className="flex flex-col gap-5 rounded-2xl p-8 h-full card-premium noise-overlay">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent-emerald/10 border border-accent-emerald/10">
                    <Github className="h-5 w-5 text-accent-emerald" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Source Code</p>
                    <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Build from source</p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed flex-grow">
                  Clone the repository and build from source. Full access to the codebase, tests, and development workflow.
                </p>
                <div className="text-[10px] text-muted-foreground/60 font-medium">JavaScript · MIT License · Open Source</div>
                <Button variant="outline" asChild className="w-full rounded-xl" id="download-source">
                  <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer">
                    <Github className="mr-2 h-4 w-4 btn-icon-github" />
                    View on GitHub
                    <ExternalLink className="ml-2 h-3 w-3 opacity-60 btn-icon-external" />
                  </a>
                </Button>
              </div>
            </StaggerItem>
          </StaggerFadeUp>
        </Container>
      </section>

      {/* System Requirements */}
      <section className="py-16 border-t border-white/5">
        <Container size="md">
          <FadeUp>
            <h2 className="mb-8 text-2xl font-bold tracking-tight text-center sm:text-left">System Requirements</h2>
            <ul className="grid gap-4 sm:grid-cols-2">
              {REQUIREMENTS.map((r, i) => (
                <li key={i} className="flex items-start gap-3.5 text-sm text-muted-foreground" style={{ contentVisibility: 'auto' }}>
                  <Info className="mt-0.5 h-4.5 w-4.5 shrink-0 text-accent-blue" />
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </FadeUp>
        </Container>
      </section>

      {/* Installation Guide */}
      <section className="py-16 border-t border-white/5 bg-bg-darker/10">
        <Container size="md">
          <FadeUp className="mb-10 text-center sm:text-left">
            <h2 className="text-2xl font-bold tracking-tight">Manual Installation Guide</h2>
          </FadeUp>
          <StaggerFadeUp className="flex flex-col gap-5">
            {INSTALL_STEPS.map((s) => (
              <StaggerItem key={s.step}>
                <div className="flex items-start gap-5 p-6 card-premium noise-overlay">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent-blue/10 text-sm font-bold text-accent-blue border border-accent-blue/20">
                    {s.step}
                  </div>
                  <div>
                    <h3 className="font-semibold text-base text-foreground">{s.title}</h3>
                    <div className="mt-1.5 text-sm leading-relaxed text-muted-foreground/80">{s.body}</div>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerFadeUp>
        </Container>
      </section>

      {/* Release Notes */}
      <section className="py-16 border-t border-white/5 bg-bg-darker/5">
        <Container size="md">
          <FadeUp className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold tracking-tight">Release Notes — v1.2.0</h2>
            <Link href="/changelog" className="text-sm font-semibold text-accent-blue hover:underline">Full Changelog →</Link>
          </FadeUp>
          <StaggerFadeUp className="flex flex-col gap-3">
            {RELEASE_NOTES.map((note, i) => (
              <StaggerItem key={i}>
                <div className="flex items-start gap-3.5 text-sm text-muted-foreground">
                  <CheckCircle2 className="mt-0.5 h-4.5 w-4.5 shrink-0 text-accent-emerald" />
                  <span>{note}</span>
                </div>
              </StaggerItem>
            ))}
          </StaggerFadeUp>
        </Container>
      </section>
    </div>
  );
}
