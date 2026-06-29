import type { Metadata } from "next";
import { Hero }              from "@/components/home/Hero";
import { ProductPreview }    from "@/components/home/ProductPreview";
import { AnalyticsShowcase } from "@/components/home/AnalyticsShowcase";
import { CFAnalytics }       from "@/components/home/CFAnalytics";
import { FeatureGrid }       from "@/components/home/FeatureGrid";
import { FinalCTA }          from "@/components/home/FinalCTA";

export const metadata: Metadata = {
  title: "AetherCP — Privacy-First Competitive Programming Companion",
  description:
    "Track your practice, analyze your progress, and open problems instantly in VS Code. 100% local, no backend, no tracking. Free Chrome extension for Codeforces and LeetCode.",
  alternates: { canonical: "https://aethercp.dev" },
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <ProductPreview />
      <AnalyticsShowcase />
      <CFAnalytics />
      <FeatureGrid />
      <FinalCTA />
    </>
  );
}
