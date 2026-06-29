import type { Metadata } from "next";
import { Container } from "@/components/shared/Container";
import { Button } from "@/components/ui/button";
import { MessageSquare, Bug, Sparkles, Mail, ArrowRight, HelpCircle } from "lucide-react";
import Link from "next/link";
import { GITHUB_ISSUES_URL } from "@/data/navigation";

export const metadata: Metadata = {
  title: "Feedback — AetherCP",
  description: "Share feedback, report bugs, or submit feature requests for AetherCP.",
  alternates: { canonical: "https://aethercp.dev/feedback" },
};

const CONTACT_CARDS = [
  {
    id: "bug-report",
    title: "Report a Bug",
    description: (
      <>
        Found a problem detection error, a <span className="text-accent-amber font-semibold">timer issue</span>, or UI glitch? Let us know on <span className="text-accent-blue font-semibold">GitHub</span> so we can fix it.
      </>
    ),
    icon: Bug,
    buttonText: "Open Bug Report",
    href: `${GITHUB_ISSUES_URL}/new?assignees=&labels=bug&projects=&template=bug_report.md&title=%5BBUG%5D+`,
    accent: "text-rose-400 bg-rose-500/10 border-rose-500/20",
  },
  {
    id: "feature-request",
    title: "Request a Feature",
    description: (
      <>
        Have ideas for a new chart, <span className="text-accent-orange font-semibold">platform support</span> (e.g. AtCoder), or setting? We&apos;d love to hear your suggestions.
      </>
    ),
    icon: Sparkles,
    buttonText: "Suggest Feature",
    href: `${GITHUB_ISSUES_URL}/new?assignees=&labels=enhancement&projects=&template=feature_request.md&title=%5BFEATURE%5D+`,
    accent: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
  },
  {
    id: "general-inquiry",
    title: "General & Support",
    description: (
      <>
        Want to ask a question, discuss contributions, or reach the <span className="text-accent-amber font-semibold">developers</span> directly? Drop us an email.
      </>
    ),
    icon: Mail,
    buttonText: "Send Email",
    href: "mailto:support@aethercp.dev",
    accent: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  },
];

export default function FeedbackPage() {
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
          <div className="flex flex-col items-center gap-4 text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-accent-blue">
              <MessageSquare className="h-3 w-3" />
              Get In Touch
            </span>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl leading-tight">
              Help us improve <span className="bg-gradient-to-r from-[#F0EBD8] via-[#E8DFC7] to-[#DDD3BA] bg-clip-text text-transparent">AetherCP</span>
            </h1>
            <p className="max-w-xl text-base text-muted-foreground sm:text-lg">
              AetherCP is completely <span className="text-accent-orange font-semibold">open source</span> and built for the community. Your <span className="text-accent-amber font-semibold">feedback</span> determines what we build next.
            </p>
          </div>
        </Container>
      </section>

      {/* Main Feedback Paths */}
      <section className="pb-16">
        <Container>
          <div className="grid gap-6 md:grid-cols-3">
            {CONTACT_CARDS.map((card) => {
              const Icon = card.icon;
              return (
                <div
                  key={card.id}
                  className="group flex flex-col justify-between rounded-2xl border border-border/60 bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-border hover:shadow-xl"
                >
                  <div className="flex flex-col gap-4">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl border ${card.accent}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-semibold">{card.title}</h3>
                      <div className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
                        {card.description}
                      </div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <Button variant="outline" asChild className="w-full">
                      <a href={card.href} target="_blank" rel="noopener noreferrer">
                        {card.buttonText}
                        <ArrowRight className="ml-2 h-3.5 w-3.5 opacity-60 transition-transform group-hover:translate-x-0.5" />
                      </a>
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* Roadmap CTA */}
      <section className="py-12 border-t border-border/60 bg-white/[0.01]">
        <Container size="md">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 rounded-2xl border border-border/60 bg-card/50 p-6 sm:p-8">
            <div className="flex flex-col gap-1.5">
              <h3 className="font-semibold text-base">Check our Future Roadmap</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                See what platforms, integrations, and analytical updates we are planning to build next.
              </p>
            </div>
            <Button asChild className="shrink-0">
              <Link href="/roadmap" className="flex items-center gap-2">
                View Roadmap
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </Container>
      </section>

      {/* FAQ shortcut */}
      <section className="py-16 border-t border-border/60">
        <Container size="sm">
          <div className="flex flex-col items-center text-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <HelpCircle className="h-5 w-5" />
            </div>
            <h3 className="font-semibold text-lg">Have a quick question?</h3>
            <p className="text-sm text-muted-foreground max-w-md">
              Before submitting a bug report or feature request, check our FAQ section to see if your question is already answered.
            </p>
            <Button variant="ghost" asChild>
              <Link href="/#faq">Read the FAQ</Link>
            </Button>
          </div>
        </Container>
      </section>
    </div>
  );
}
