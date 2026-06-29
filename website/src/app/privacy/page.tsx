"use client";

import { Container } from "@/components/shared/Container";
import { Lock, EyeOff, ServerOff, CheckCircle2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FadeUp, StaggerFadeUp, StaggerItem } from "@/components/motion";

const PERMISSIONS = [
  {
    name: "storage",
    description: (
      <>
        Required to save session timers, problem statistics,{" "}
        <span className="text-accent-amber font-semibold">heatmaps</span>, and settings directly on your device.
      </>
    ),
  },
  {
    name: "tabs",
    description: (
      <>
        Used to determine if the currently open tab matches a{" "}
        <span className="text-accent-orange font-semibold">Codeforces</span> or{" "}
        <span className="text-accent-amber font-semibold">LeetCode</span> problem URL, starting the timer.
      </>
    ),
  },
  {
    name: "contextMenus",
    description: (
      <>
        Allows right-clicking on problem links to trigger the &apos;Open in{" "}
        <span className="text-accent-purple font-semibold">VS Code</span>&apos; context option.
      </>
    ),
  },
  {
    name: "Host permissions (codeforces.com, leetcode.com, localhost)",
    description: (
      <>
        Allows AetherCP to run content scripts to parse problem metadata on competitive sites and communicate with the local{" "}
        <span className="text-accent-blue font-semibold">VS Code receiver</span>.
      </>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <div className="pt-24 min-h-screen">
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
              <Lock className="h-3 w-3" />
              Privacy Policy
            </span>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              <span className="bg-gradient-to-r from-[#F0EBD8] via-[#E8DFC7] to-[#DDD3BA] bg-clip-text text-transparent">Your Data is Yours</span>
            </h1>
            <p className="max-w-xl text-base text-muted-foreground sm:text-lg">
              AetherCP was built on a simple premise: a <span className="text-accent-blue font-semibold">developer companion</span> should have access to your data, but its creators <span className="text-accent-orange font-semibold">shouldn&apos;t</span>.
            </p>
          </FadeUp>
        </Container>
      </section>

      {/* Main Privacy content */}
      <section className="pb-24">
        <Container size="md">
          <div className="flex flex-col gap-10 text-muted-foreground leading-relaxed text-sm">
            {/* Principles Cards — staggered */}
            <StaggerFadeUp className="grid gap-4 sm:grid-cols-3">
              <StaggerItem>
                <div className="flex flex-col gap-3 rounded-2xl border border-white/5 bg-bg-dark/50 p-5 h-full">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-blue/10 text-accent-blue">
                    <EyeOff className="h-4 w-4" />
                  </div>
                  <h3 className="font-semibold text-foreground text-sm">No Tracking</h3>
                  <p className="text-[11px] leading-relaxed">
                    We collect no analytics, send no telemetry, and use no third-party trackers.
                  </p>
                </div>
              </StaggerItem>

              <StaggerItem>
                <div className="flex flex-col gap-3 rounded-2xl border border-white/5 bg-bg-dark/50 p-5 h-full">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-purple/10 text-accent-purple">
                    <ServerOff className="h-4 w-4" />
                  </div>
                  <h3 className="font-semibold text-foreground text-sm">No Backend</h3>
                  <p className="text-[11px] leading-relaxed">
                    There is no database, cloud API, or sign-up backend. Data storage is 100% offline.
                  </p>
                </div>
              </StaggerItem>

              <StaggerItem>
                <div className="flex flex-col gap-3 rounded-2xl border border-white/5 bg-bg-dark/50 p-5 h-full">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-emerald/10 text-accent-emerald">
                    <Lock className="h-4 w-4" />
                  </div>
                  <h3 className="font-semibold text-foreground text-sm">No Selling</h3>
                  <p className="text-[11px] leading-relaxed">
                    We cannot sell your search or coding habits because we do not have them.
                  </p>
                </div>
              </StaggerItem>
            </StaggerFadeUp>

            {/* Core clauses */}
            <FadeUp className="flex flex-col gap-6 mt-4">
              <h2 className="text-lg font-bold text-foreground">1. Data Storage and Control</h2>
              <p>
                Every record generated during your <span className="text-accent-amber font-semibold">coding sessions</span> — including problem names, contest IDs, duration metrics, streak lists, and <span className="text-accent-amber font-semibold">weekly heatmaps</span> — is stored in your Chrome sandbox using the <code>chrome.storage.local</code> API.
              </p>
              <p>
                This storage is local to your machine and web browser. Uninstalling AetherCP instantly deletes all data stored by the extension. We have no way to recover or back up your data since we do not host a central cloud service.
              </p>

              <h2 className="text-lg font-bold text-foreground">2. Transparent Permissions</h2>
              <p>
                To provide automatic problem tracking and editor integrations, AetherCP requests specific browser permissions. Below is the full description of why each is required:
              </p>

              <div className="flex flex-col gap-3 rounded-2xl border border-white/5 bg-bg-dark/50 p-5 noise-overlay">
                {PERMISSIONS.map((perm, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent-blue" />
                    <div>
                      <h4 className="font-mono text-xs font-bold text-foreground">{perm.name}</h4>
                      <div className="text-xs text-muted-foreground mt-0.5">{perm.description}</div>
                    </div>
                  </div>
                ))}
              </div>

              <h2 className="text-lg font-bold text-foreground">3. Web Request Safety</h2>
              <p>
                AetherCP content scripts run locally inside problem tabs. When sending a problem to your editor, it makes a local network call to port <code>27121</code> (the standard port used by competitive programming receivers inside <span className="text-accent-purple font-semibold">VS Code</span>). No external network requests are ever triggered to servers other than the platforms you are actively visiting (<span className="text-accent-orange font-semibold">Codeforces</span> or <span className="text-accent-amber font-semibold">LeetCode</span>).
              </p>

              <h2 className="text-lg font-bold text-foreground">4. Fully Auditable &amp; Open Source</h2>
              <p>
                Because AetherCP is fully <span className="text-accent-orange font-semibold">open-source</span> under the MIT license, you do not have to take our word for any of the statements in this policy. You can inspect the source code, check the manifest files, review network requests inside Chrome DevTools, or compile the extension manually from source.
              </p>

              <h2 className="text-lg font-bold text-foreground">5. Changes to This Policy</h2>
              <p>
                Since AetherCP has no servers and does not collect any database entries, we will never change this extension to collect user metrics silently. If sync functions are added in future versions, they will be strictly opt-in and end-to-end encrypted locally before sync.
              </p>
            </FadeUp>

            <FadeUp className="mt-8 flex justify-center" delay={0.1}>
              <Button variant="outline" asChild className="group">
                <Link href="/">
                  <ArrowLeft className="mr-2 h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1" />
                  Back to Home
                </Link>
              </Button>
            </FadeUp>
          </div>
        </Container>
      </section>
    </div>
  );
}
