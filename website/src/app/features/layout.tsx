import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Features — AetherCP",
  description:
    "Explore all features of AetherCP — coding timers, analytics heatmaps, Codeforces integrations, and VS Code support.",
  alternates: { canonical: "https://aethercp.dev/features" },
};

export default function FeaturesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
