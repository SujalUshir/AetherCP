"use client";


import Image from "next/image";
import { BrowserFrame } from "@/components/shared/BrowserFrame";
import { Container } from "@/components/shared/Container";
import { Button } from "@/components/ui/button";
import popupScreenshot from "../../../public/screenshots/popup.png";
import analyticScreenshot from "../../../public/screenshots/analytic.png";
import competitiveScreenshot from "../../../public/screenshots/competitive.png";
import vscodeScreenshot from "../../../public/screenshots/vscode.png";
import {
  Timer,
  Zap,
  BarChart3,
  LayoutGrid,
  Trophy,
  TrendingUp,
  History,
  Code2,
  HardDrive,
  ShieldCheck,
  EyeOff,
  ServerOff,
  Sparkles,
  ArrowRight,
  Github,
  Flame
} from "lucide-react";
import {
  FadeUp,
  SlideLeft,
  SlideRight,
  StaggerFadeUp,
  StaggerItem
} from "@/components/motion";
import { GITHUB_URL, DOWNLOAD_URL } from "@/data/navigation";

export default function FeaturesPage() {
  return (
    <div className="pt-24 min-h-screen bg-background select-none">
      {/* --- Hero Section --- */}
      <section className="relative py-20 sm:py-32 overflow-hidden border-b border-border/20">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 -top-16 h-[500px] opacity-20"
          style={{
            background: "radial-gradient(ellipse 70% 50% at 50% 0%, hsl(48 42% 89% / 0.3), transparent)"
          }}
        />
        <Container>
          <div className="flex flex-col items-center gap-6 text-center max-w-4xl mx-auto">
            <FadeUp>
              <span className="inline-flex items-center gap-2 rounded-full border border-accent-blue/30 bg-accent-blue/10 px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-widest text-accent-blue">
                <Sparkles className="h-3 w-3" />
                Manifest V3 &bull; Local-First &bull; Zero Telemetry
              </span>
            </FadeUp>

            <FadeUp delay={0.06}>
              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-7xl text-foreground leading-[1.08]">
                Developer Diagnostics for <br />
                <span className="bg-gradient-to-r from-[#F0EBD8] via-[#E8DFC7] to-[#DDD3BA] bg-clip-text text-transparent">
                  Competitive Coders
                </span>
              </h1>
            </FadeUp>

            <FadeUp delay={0.12} className="max-w-2xl">
              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                Automate workspace environments, track coding diagnostics, and visualize performance trends without external database dependencies or usage tracking.
              </p>
            </FadeUp>

            <FadeUp delay={0.18} className="flex flex-wrap justify-center gap-4 mt-2">
              <Button size="lg" asChild className="rounded-full shadow-md px-8 py-6 text-base">
                <a href={DOWNLOAD_URL} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                  <DownloadIcon className="h-5 w-5 btn-icon-download" />
                  Install Extension
                </a>
              </Button>
              <Button size="lg" variant="glass" asChild className="rounded-full px-8 py-6 text-base">
                <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                  <Github className="h-5 w-5 btn-icon-github" />
                  Star on GitHub
                </a>
              </Button>
            </FadeUp>
          </div>
        </Container>
      </section>

      {/* --- Category 1: Productivity Features (Text Left, Screenshot Right) --- */}
      <section className="py-20 sm:py-28 border-b border-border/20">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16 items-center">
            {/* Left Column: Details */}
            <SlideLeft className="lg:col-span-6 flex flex-col gap-6 text-left">
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-accent-amber" />
                <span className="text-xs font-bold text-accent-amber uppercase tracking-widest">
                  Productivity Workspace
                </span>
              </div>
              <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
                Maximize Your{" "}
                <span className="bg-gradient-to-r from-accent-amber to-accent-orange bg-clip-text text-transparent">
                  Focus Zone
                </span>
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                AetherCP runs quietly as a background runtime script, automating timing captures and loopback compiler configuration, keeping you in code flow.
              </p>

              {/* Feature bullet list with rich highlight text */}
              <div className="flex flex-col gap-6 mt-2">
                <div className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent-amber/10 text-accent-amber">
                    <Timer className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-foreground">
                      Automated Timing Session Tracking
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                      Initializes timing parameters automatically on loading problem page tabs. Operates silently without user triggers.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent-blue/10 text-accent-blue">
                    <Zap className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-foreground">
                      Asynchronous Idle Observers
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                      Maintains timing accuracy via a CP-optimized 15-minute inactivity timeout. Observes focus states and ignores noisy layout mouse actions.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent-purple/10 text-accent-purple">
                    <Code2 className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-foreground">
                      VS Code Loopback Sync
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                      Syncs parsed sample test inputs, memory limits, and timeouts directly to local CPH receivers using loopback ports.
                    </p>
                  </div>
                </div>
              </div>
            </SlideLeft>

            {/* Right Column: Screenshot */}
            <SlideRight className="lg:col-span-6 flex justify-center">
              <BrowserFrame url="localhost:27121/cph" size="lg" className="w-full">
                <div className="flex justify-center w-full py-4 px-2 bg-[#2a2a2a]">
                  <Image
                    src={vscodeScreenshot}
                    alt="VS Code Integration Workspace"
                    className="w-full h-auto object-contain rounded-lg border border-white/5 select-none pointer-events-none shadow-2xl"
                  />
                </div>
              </BrowserFrame>
            </SlideRight>
          </div>
        </Container>
      </section>

      {/* --- Category 2: Competitive Programming Features (Screenshot Left, Text Right) --- */}
      <section className="py-20 sm:py-28 border-b border-border/20 bg-bg-dark/10">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16 items-center">
            {/* Left Column: Screenshot */}
            <SlideLeft className="lg:col-span-6 flex justify-center order-2 lg:order-1">
              <BrowserFrame url="codeforces.com/profile/tourist" size="lg" className="w-full">
                <div className="flex justify-center w-full py-4 px-2">
                  <Image
                    src={competitiveScreenshot}
                    alt="Codeforces Profile Injected Analytics"
                    className="w-full h-auto object-contain rounded-lg border border-white/5 select-none pointer-events-none shadow-2xl"
                  />
                </div>
              </BrowserFrame>
            </SlideLeft>

            {/* Right Column: Details */}
            <SlideRight className="lg:col-span-6 flex flex-col gap-6 text-left order-1 lg:order-2">
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-accent-orange" />
                <span className="text-xs font-bold text-accent-orange uppercase tracking-widest">
                  Contest Telemetry
                </span>
              </div>
              <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
                Instrumented{" "}
                <span className="bg-gradient-to-r from-accent-orange to-accent-amber bg-clip-text text-transparent">
                  Codeforces
                </span>{" "}
                Dashboards
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                Instrument your competitive workspace. AetherCP injects canvas visualizations directly into competitive dashboards, displaying submission records and mapping diagnostic trends.
              </p>

              {/* Feature bullet list with rich highlights */}
              <div className="flex flex-col gap-6 mt-2">
                <div className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent-orange/10 text-accent-orange">
                    <Trophy className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-foreground">
                      Injected Profile Telemetry
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                      Displays rating distributions, solved tag counts, and verdict breakdowns in real time directly on visited user profiles.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent-emerald/10 text-accent-emerald">
                    <TrendingUp className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-foreground">
                      Solved Performance Timelines
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                      Maps rating peaks to practice volume. Identifies preparation plateaus and tracks consistency trends.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent-purple/10 text-accent-purple">
                    <History className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-foreground">
                      Searchable Local Ledger
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                      Keeps a structured history of timing durations, problem platform metrics, and metadata indexed for rapid lookup.
                    </p>
                  </div>
                </div>
              </div>
            </SlideRight>
          </div>
        </Container>
      </section>

      {/* --- Category 3: Analytics Features (Staggered Personality Cards) --- */}
      <section className="py-20 sm:py-28 border-b border-border/20">
        <Container>
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="inline-flex items-center gap-2 rounded-full border border-accent-blue/20 bg-accent-blue/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-accent-blue">
              Category 03 &bull; Visual Progress
            </span>
            <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl mt-3">
              Practice dashboards with{" "}
              <span className="bg-gradient-to-r from-accent-blue to-accent-purple bg-clip-text text-transparent">
                Personality
              </span>
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mt-2">
              Clean visual components that give your competitive programming habit a satisfying visual representation.
            </p>
          </div>

          <StaggerFadeUp className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* Card 1: Blue accent */}
            <StaggerItem>
              <div className="flex flex-col gap-4 rounded-2xl border border-accent-blue/15 bg-gradient-to-b from-bg-light/35 to-bg-dark/65 p-6 h-full transition-all duration-300 hover:border-accent-blue/30 hover:shadow-lg hover:shadow-accent-blue/5 noise-overlay">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent-blue/10 text-accent-blue">
                  <BarChart3 className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground text-sm">
                    Today&apos;s <span className="text-accent-blue">Analytics</span>
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed mt-2">
                    Popup window displays total practice duration, solved count, active streak count, and most-worked tag of the day.
                  </p>
                </div>
              </div>
            </StaggerItem>

            {/* Card 2: Green/Emerald accent */}
            <StaggerItem>
              <div className="flex flex-col gap-4 rounded-2xl border border-accent-emerald/15 bg-gradient-to-b from-bg-light/35 to-bg-dark/65 p-6 h-full transition-all duration-300 hover:border-accent-emerald/30 hover:shadow-lg hover:shadow-accent-emerald/5 noise-overlay">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent-emerald/10 text-accent-emerald">
                  <LayoutGrid className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground text-sm">
                    Practice <span className="text-accent-emerald">Heatmap</span>
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed mt-2">
                    GitHub-style calendar grid tracking active days and duration intensity. Injected directly into your competitive homepage.
                  </p>
                </div>
              </div>
            </StaggerItem>

            {/* Card 3: Orange accent */}
            <StaggerItem>
              <div className="flex flex-col gap-4 rounded-2xl border border-accent-orange/15 bg-gradient-to-b from-bg-light/35 to-bg-dark/65 p-6 h-full transition-all duration-300 hover:border-accent-orange/30 hover:shadow-lg hover:shadow-accent-orange/5 noise-overlay">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent-orange/10 text-accent-orange">
                  <Flame className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground text-sm">
                    Streak <span className="text-accent-orange">Tracking</span>
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed mt-2">
                    Stay motivated. Calculates active daily solved streaks and helps you build structured practice schedules.
                  </p>
                </div>
              </div>
            </StaggerItem>
          </StaggerFadeUp>
        </Container>
      </section>

      {/* --- Category 4: Privacy & Performance (Cards Grid) --- */}
      <section className="py-20 sm:py-28 border-b border-border/20 bg-bg-dark/10">
        <Container>
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="inline-flex items-center gap-2 rounded-full border border-accent-emerald/20 bg-accent-emerald/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-accent-emerald">
              Category 04 &bull; Security &amp; Offline
            </span>
            <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl mt-3">
              100%{" "}
              <span className="bg-gradient-to-r from-accent-emerald to-accent-blue bg-clip-text text-transparent">
                Local-First Architecture
              </span>
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mt-2">
              Eliminate cloud databases. All practice statistics are sandboxed and persisted within your browser&apos;s client-side storage boundaries.
            </p>
          </div>

          <StaggerFadeUp className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <StaggerItem>
              <div className="flex flex-col gap-3 rounded-2xl border border-accent-emerald/15 bg-gradient-to-b from-bg-light/35 to-bg-dark/65 p-6 h-full noise-overlay transition-all duration-300 hover:border-accent-emerald/35">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent-emerald/10 text-accent-emerald mb-2">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-foreground text-sm">
                  <span className="text-accent-emerald">Privacy</span> Shield
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  No sign-ups, no login tokens, and zero usage telemetry tracked backend.
                </p>
              </div>
            </StaggerItem>

            <StaggerItem>
              <div className="flex flex-col gap-3 rounded-2xl border border-accent-blue/15 bg-gradient-to-b from-bg-light/35 to-bg-dark/65 p-6 h-full noise-overlay transition-all duration-300 hover:border-accent-blue/35">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent-blue/10 text-accent-blue mb-2">
                  <HardDrive className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-foreground text-sm">
                  <span className="text-accent-blue">Local Storage</span> sandbox
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Persistent logging utilizes local chrome.storage API inside sandbox.
                </p>
              </div>
            </StaggerItem>

            <StaggerItem>
              <div className="flex flex-col gap-3 rounded-2xl border border-accent-purple/15 bg-gradient-to-b from-bg-light/35 to-bg-dark/65 p-6 h-full noise-overlay transition-all duration-300 hover:border-accent-purple/35">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent-purple/10 text-accent-purple mb-2">
                  <EyeOff className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-foreground text-sm">
                  No Third Party <span className="text-accent-purple">Access</span>
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Your coding logs, rating progress, and solved logs are never synced or uploaded.
                </p>
              </div>
            </StaggerItem>

            <StaggerItem>
              <div className="flex flex-col gap-3 rounded-2xl border border-accent-orange/15 bg-gradient-to-b from-bg-light/35 to-bg-dark/65 p-6 h-full noise-overlay transition-all duration-300 hover:border-accent-orange/35">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent-orange/10 text-accent-orange mb-2">
                  <ServerOff className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-foreground text-sm">
                  Offline <span className="text-accent-orange">Execution</span>
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Runs natively in browser background. Offline usage caches locally until network access.
                </p>
              </div>
            </StaggerItem>
          </StaggerFadeUp>
        </Container>
      </section>

      {/* --- Real Screenshots Gallery --- */}
      <section className="py-20 sm:py-28 border-b border-border/20">
        <Container size="xl">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold text-accent-blue uppercase tracking-widest">
              Live Showcase
            </span>
            <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl mt-3">
              Explore the{" "}
              <span className="bg-gradient-to-r from-accent-blue to-accent-purple bg-clip-text text-transparent">
                User Interface
              </span>
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mt-2">
              Browse actual screenshots taken directly from the extension popup and dashboard analytics views.
            </p>
          </div>

          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
            {/* Screenshot 1 */}
            <SlideLeft className="flex flex-col gap-4">
              <span className="text-xs font-semibold text-accent-blue">Dashboard View</span>
              <BrowserFrame url="codeforces.com/problemset" size="lg" className="w-full shadow-2xl">
                <div className="flex justify-center w-full py-4 px-2">
                  <Image
                    src={analyticScreenshot}
                    alt="Analytics Dashboard"
                    className="w-full max-w-[500px] h-auto object-contain rounded-lg border border-white/5"
                  />
                </div>
              </BrowserFrame>
            </SlideLeft>

            {/* Screenshot 2 */}
            <SlideRight className="flex flex-col gap-4">
              <span className="text-xs font-semibold text-accent-purple">Popup Widget</span>
              <BrowserFrame url="leetcode.com/problems/two-sum" size="lg" className="w-full shadow-2xl">
                <div className="flex justify-center w-full py-4 px-2">
                  <Image
                    src={popupScreenshot}
                    alt="Extension Popup View"
                    className="w-full max-w-[280px] h-auto object-contain rounded-lg border border-white/5"
                  />
                </div>
              </BrowserFrame>
            </SlideRight>
          </div>
        </Container>
      </section>

      {/* --- Call To Action --- */}
      <section className="py-20 sm:py-28">
        <Container size="sm">
          <FadeUp className="flex flex-col items-center text-center gap-6">
            <h3 className="text-3xl font-extrabold text-foreground">
              Ready to optimize your practice?
            </h3>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              Install AetherCP completely free today and start collecting visual analytics logs locally.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Button asChild className="rounded-full px-8 py-6 text-base shadow-sm">
                <a href={DOWNLOAD_URL} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                  <ArrowRight className="h-4 w-4 btn-icon-arrow" />
                  Download Extension
                </a>
              </Button>
              <Button variant="outline" asChild className="rounded-full px-8 py-6 text-base">
                <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                  <Github className="h-4 w-4 btn-icon-github" />
                  View on GitHub
                </a>
              </Button>
            </div>
          </FadeUp>
        </Container>
      </section>
    </div>
  );
}

// Minimal Download Icon component since it wasn't explicitly imported
function DownloadIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
      ></path>
    </svg>
  );
}
