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
    <div className="relative pt-24 min-h-screen bg-background noise-overlay grid-bg-subtle flex flex-col gap-20 sm:gap-28">
      {/* 1. Developer Hero (Centered Layout) */}
      <AboutHero />

      {/* 2. About AetherCP */}
      <section className="relative">
        <Container size="md">
          <div className="flex flex-col gap-6 text-center border-t border-white/5 pt-20">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              About <span className="bg-gradient-to-r from-[#F0EBD8] via-[#E8DFC7] to-[#DDD3BA] bg-clip-text text-transparent">AetherCP</span>
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground/80 leading-relaxed max-w-3xl mx-auto">
              AetherCP is a high-performance, local-first browser extension engineered specifically for competitive programmers. Running as an event-driven background service worker, it automates practice tracking on Codeforces and LeetCode. By processing time constraints, parsing sample tests, and coordinating local workspace configurations, it eliminates manual setup, allowing developers to concentrate fully on algorithm design.
            </p>
          </div>
        </Container>
      </section>

      {/* 3. Mission */}
      <section className="relative">
        <Container>
          <div className="flex flex-col gap-12 border-t border-white/5 pt-20">
            <div className="flex flex-col items-center text-center gap-2">
              <h2 className="text-2xl font-bold tracking-tight">Project Mission</h2>
              <p className="text-sm text-muted-foreground/80">The engineering principles guiding AetherCP development.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {/* Mission 1 */}
              <div className="flex flex-col gap-5 rounded-2xl p-7 card-premium noise-overlay">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent-blue/10 border border-accent-blue/10 text-accent-blue transition-transform duration-300 hover:scale-110">
                  <Timer className="h-5 w-5" />
                </div>
                <h3 className="text-base font-semibold text-foreground">Developer Productivity</h3>
                <p className="text-xs leading-relaxed text-muted-foreground/80">
                  Optimizing practice workflows via automated session capture. Features a smart 15-minute idle threshold that preserves metrics during offline paper-drafting phases.
                </p>
              </div>

              {/* Mission 2 */}
              <div className="flex flex-col gap-5 rounded-2xl p-7 card-premium noise-overlay">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent-amber/10 border border-accent-amber/10 text-accent-amber transition-transform duration-300 hover:scale-110">
                  <Target className="h-5 w-5" />
                </div>
                <h3 className="text-base font-semibold text-foreground">Instrumented Profiling</h3>
                <p className="text-xs leading-relaxed text-muted-foreground/80">
                  Injecting ratings-to-time ratios, verdict spreads, and topic tag distributions directly into competitive pages without adding page latency.
                </p>
              </div>

              {/* Mission 3 */}
              <div className="flex flex-col gap-5 rounded-2xl p-7 card-premium noise-overlay">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent-emerald/10 border border-accent-emerald/10 text-accent-emerald transition-transform duration-300 hover:scale-110">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <h3 className="text-base font-semibold text-foreground">Sandboxed Privacy</h3>
                <p className="text-xs leading-relaxed text-muted-foreground/80">
                  Securing user code metrics. All timer tracking, DOM data extraction, and solved analytics calculations run 100% locally. Zero cloud analytics SDKs.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 4. Why I Built AetherCP */}
      <section className="relative">
        <Container size="md">
          <div className="flex flex-col gap-6 text-left border-t border-white/5 pt-20">
            <h2 className="text-2xl font-bold tracking-tight text-foreground">Why I Engineered AetherCP</h2>
            <div className="flex flex-col gap-5 text-sm sm:text-base text-muted-foreground/85 leading-relaxed">
              <p>
                As an active participant in competitive programming, I recognized a significant diagnostic gap. Tracking practice efficiency was highly fragmented: developers relied on manual stopwatches or heavy cloud-based platforms requiring external database logins, telemetry tracking, and cookie collections. None of these solutions integrated directly with editor workspaces or respected user data privacy.
              </p>
              <p>
                I engineered AetherCP to bridge this gap. By building a local-first extension that runs entirely inside the browser&apos;s sandboxed storage runtime, AetherCP automates session logging, performs client-side analytics aggregation, and injects diagnostic dashboards directly into competitive profiles without introducing network roundtrips or context switching.
              </p>
              <p>
                The integration with Visual Studio Code utilizes loopback sockets to instantly deploy sample tests, memory limits, and source templates, accelerating setup times so developers can focus solely on problem-solving.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* 5. Open Source */}
      <section className="relative">
        <Container size="md">
          <div className="flex flex-col items-center text-center gap-6 rounded-2xl p-8 card-premium noise-overlay hover:border-primary/20">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 border border-primary/10 text-primary">
              <Heart className="h-5 w-5" />
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="font-semibold text-lg text-foreground">Proudly Open Source</h3>
              <p className="text-sm text-muted-foreground/80 max-w-md leading-relaxed">
                AetherCP is open-source under the MIT license. We invite the developer community to inspect the code, suggest features, and build platform integrations on GitHub.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 mt-2">
              <Button asChild className="rounded-xl px-6 py-5">
                <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                  <Github className="h-4 w-4 btn-icon-github" />
                  Contribute on GitHub
                  <ExternalLink className="h-3 w-3 btn-icon-external" />
                </a>
              </Button>
              <Button variant="ghost" asChild className="rounded-xl px-6 py-5">
                <Link href="/roadmap">View Roadmap</Link>
              </Button>
            </div>
          </div>
        </Container>
      </section>

      {/* 6. Future Vision */}
      <section className="relative pb-28">
        <Container size="md">
          <div className="flex flex-col gap-6 text-left border-t border-white/5 pt-20">
            <div className="flex items-center gap-2 text-primary">
              <Sparkles className="h-5 w-5" />
              <h2 className="text-lg font-bold tracking-tight text-foreground">Technical Direction</h2>
            </div>
            <p className="text-sm sm:text-base text-muted-foreground/85 leading-relaxed">
              Our roadmap focuses on expanding platform compatibility to AtCoder and CodeChef, implementing peer-to-peer data backup options, and expanding local client diagnostics. Every future enhancement will continue to run strictly local-first and respect absolute data privacy.
            </p>
          </div>
        </Container>
      </section>
    </div>
  );
}
