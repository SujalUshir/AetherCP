import Link from "next/link";
import { ArrowLeft, type LucideIcon } from "lucide-react";
import { Container } from "@/components/shared/Container";
import { Button } from "@/components/ui/button";

interface PlaceholderPageProps {
  icon: LucideIcon;
  title: string;
  description: string;
  badge?: string;
  cta?: { label: string; href: string };
}

export function PlaceholderPage({
  icon: Icon,
  title,
  description,
  badge,
  cta,
}: PlaceholderPageProps) {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center py-32">
      {/* Background glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 50% 40%, hsl(238 84% 67% / 0.5), transparent)",
        }}
      />

      <Container size="sm">
        <div className="flex flex-col items-center gap-8 text-center">
          {/* Icon */}
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10">
            <Icon className="h-8 w-8 text-primary" />
          </div>

          {/* Badge */}
          {badge && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-primary">
              {badge}
            </span>
          )}

          <div className="flex flex-col gap-3">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              {title}
            </h1>
            <p className="max-w-lg text-base leading-relaxed text-muted-foreground sm:text-lg">
              {description}
            </p>
          </div>

          <div className="flex flex-col items-center gap-3 sm:flex-row">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Link>
            </Button>
            {cta && (
              <Button size="sm" asChild>
                <Link href={cta.href}>{cta.label}</Link>
              </Button>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
