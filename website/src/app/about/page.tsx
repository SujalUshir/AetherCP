import type { Metadata } from "next";
import { Container } from "@/components/shared/Container";
import { Button } from "@/components/ui/button";
import { Target, ShieldCheck, Timer, Github, ExternalLink, Sparkles, Heart } from "lucide-react";
import Link from "next/link";
import { GITHUB_URL } from "@/data/navigation";
import { AboutHero } from "@/components/about/AboutHero";

export const metadata: Metadata = {
  title: "About — AetherCP",
  description: "Learn more about the developer and the mission behind AetherCP, a privacy-first competitive programming companion.",
  alternates: { canonical: "https://aethercp.dev/about" },
};

export default function AboutPage() {
  return (
    <div className="relative pt-24 min-h-screen bg-background noise-overlay grid-bg-subtle flex flex-col gap-16 sm:gap-24">
      {/* 1. Developer Hero (Centered Layout) */}
      <AboutHero />

      {/* 2. About AetherCP */}
      <section className="relative">
        <Container size="md">
          <div className="flex flex-col gap-6 text-center border-t border-border/40 pt-16">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              About <span className="bg-gradient-to-r from-[#F0EBD8] via-[#E8DFC7] to-[#DDD3BA] bg-clip-text text-transparent">AetherCP</span>
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              AetherCP is a premium, lightweight <span className="text-primary font-semibold">browser extension</span> designed exclusively for <span className="text-accent-orange font-semibold">competitive programmers</span> and active coders. It runs quietly in your browser, automatically tracking solution timers when you solve contest problems on <span className="text-accent-orange font-semibold">Codeforces</span> and <span className="text-accent-amber font-semibold">LeetCode</span>. By parsing time constraints and editor configurations <span className="text-accent-emerald font-semibold">local-first</span>, it helps programmers maintain <span className="text-accent-amber font-semibold">focus</span>, optimize their training, and configure workspace directories in a single click.
            </p>
          </div>
        </Container>
      </section>

      {/* 3. Mission */}
      <section className="relative">
        <Container>
          <div className="flex flex-col gap-12 border-t border-border/40 pt-16">
            <div className="flex flex-col items-center text-center gap-2">
              <h2 className="text-xl font-bold tracking-tight">Our Mission</h2>
              <p className="text-xs text-muted-foreground">The principles guiding AetherCP development.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {/* Mission 1 */}
              <div className="flex flex-col gap-4 rounded-xl border border-white/5 bg-bg-dark/45 p-6 noise-overlay shadow-sm">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-blue/10 text-accent-blue">
                  <Timer className="h-4 w-4" />
                </div>
                <h3 className="text-sm font-semibold">Productivity</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Empowering coders to track practice sessions correctly. Features smart 15-minute idle windows that accommodate offline sketchpad thinking.
                </p>
              </div>

              {/* Mission 2 */}
              <div className="flex flex-col gap-4 rounded-xl border border-white/5 bg-bg-dark/45 p-6 noise-overlay shadow-sm">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-amber/10 text-accent-amber">
                  <Target className="h-4 w-4" />
                </div>
                <h3 className="text-sm font-semibold">Competitive CP</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Injects rating progressions, verdict allocations, and top tag analytics directly inside Codeforces profiles without adding context latency.
                </p>
              </div>

              {/* Mission 3 */}
              <div className="flex flex-col gap-4 rounded-xl border border-white/5 bg-bg-dark/45 p-6 noise-overlay shadow-sm">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-emerald/10 text-accent-emerald">
                  <ShieldCheck className="h-4 w-4" />
                </div>
                <h3 className="text-sm font-semibold">Privacy First</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Your code metrics belong to you. All tracking, parser structures, and solved logs are computed 100% locally. Zero telemetry.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 4. Why I Built AetherCP */}
      <section className="relative">
        <Container size="md">
          <div className="flex flex-col gap-6 text-left border-t border-border/40 pt-16">
            <h2 className="text-xl font-bold tracking-tight text-foreground">Why I Built AetherCP</h2>
            <div className="flex flex-col gap-5 text-sm text-muted-foreground leading-relaxed">
              <p>
                As a competitive programmer practicing on <span className="text-accent-orange font-semibold">Codeforces</span> and <span className="text-accent-amber font-semibold">LeetCode</span>, I constantly found myself wanting to monitor my practice efficiency. I wanted answers to simple questions: *How long did I spend on this 1600-rated problem before submitting? What is my daily solving streak? Is my <span className="text-accent-amber font-semibold">rating graph</span> trending up or plateauing?*
              </p>
              <p>
                Unfortunately, the available options were limited. Most developers relied on generic stopwatch timers or heavy tracking dashboards that required database logins and telemetry uploads. None of them parsed contest requirements and editor boundaries <span className="text-accent-emerald font-semibold">locally</span>.
              </p>
              <p>
                I built AetherCP to solve this exact problem: a clean, <span className="text-accent-emerald font-semibold">local-first</span> browser extension that tracks active <span className="text-accent-amber font-semibold">coding times</span> automatically, manages <span className="text-accent-blue font-semibold">workspace configurations</span> in one click, and injects clean rating panels directly on profile feeds.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* 5. Open Source */}
      <section className="relative">
        <Container size="md">
          <div className="flex flex-col items-center text-center gap-6 rounded-2xl border border-white/5 bg-bg-dark/40 p-8 noise-overlay shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Heart className="h-5 w-5" />
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="font-semibold text-lg">Proudly Open Source</h3>
              <p className="text-sm text-muted-foreground max-w-md">
                AetherCP is completely open source under the MIT license. We invite competitive coders and developers to audit, inspect, build, and suggest new integrations on GitHub.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button asChild>
                <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                  <Github className="h-4 w-4 btn-icon-github" />
                  Contribute on GitHub
                  <ExternalLink className="h-3 w-3 btn-icon-external" />
                </a>
              </Button>
              <Button variant="ghost" asChild>
                <Link href="/roadmap">View Roadmap</Link>
              </Button>
            </div>
          </div>
        </Container>
      </section>

      {/* 6. Future Vision */}
      <section className="relative pb-24">
        <Container size="md">
          <div className="flex flex-col gap-6 text-left border-t border-border/40 pt-16">
            <div className="flex items-center gap-2 text-primary">
              <Sparkles className="h-4 w-4" />
              <h2 className="text-base font-semibold uppercase tracking-wider">Future Vision</h2>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              We plan to expand AetherCP beyond its current feature set by introducing deeper productivity metrics, supporting more competitive programming platforms (such as AtCoder and CodeChef), and improving our offline synchronization systems for cross-device backup. Every single roadmap item will continue to adhere strictly to our local-first, privacy-respecting philosophy.
            </p>
          </div>
        </Container>
      </section>
    </div>
  );
}
