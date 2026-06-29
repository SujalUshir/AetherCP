// ============================================================
// types/index.ts
// Shared TypeScript interfaces for the AetherCP website.
// ============================================================

// -- Navigation -----------------------------------------------
export interface NavLink {
  href: string;
  label: string;
  external?: boolean;
}

export interface NavGroup {
  label: string;
  links: NavLink[];
}

// -- Features -------------------------------------------------
export type FeatureAccent =
  | "indigo"
  | "violet"
  | "blue"
  | "emerald"
  | "orange"
  | "rose"
  | "yellow"
  | "cyan"
  | "fuchsia"
  | "sky"
  | "teal"
  | "amber";

export interface FeatureCard {
  id: string;
  icon: string; // Lucide icon name
  title: string;
  description: string;
  accent: FeatureAccent;
  badge?: string;
}

// -- Changelog ------------------------------------------------
export type ChangeType = "added" | "improved" | "fixed" | "removed";

export interface ChangeEntry {
  type: ChangeType;
  text: string;
}

export interface ChangelogVersion {
  version: string;
  date: string;
  tag?: "latest" | "beta";
  summary: string;
  changes: ChangeEntry[];
}

// -- FAQ ------------------------------------------------------
export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: "general" | "privacy" | "technical" | "platforms";
}

// -- Roadmap --------------------------------------------------
export type RoadmapStatus = "completed" | "in-progress" | "planned" | "idea";

export interface RoadmapItem {
  id: string;
  title: string;
  description: string;
  status: RoadmapStatus;
  category: string;
  priority?: "high" | "medium" | "low";
}

// -- Screenshots ----------------------------------------------
export interface ScreenshotItem {
  id: string;
  title: string;
  description: string;
  url: string; // simulated URL shown in address bar
  category: string;
}

// -- GitHub ---------------------------------------------------
export interface GitHubRepo {
  stars: number;
  forks: number;
  issues: number;
  watchers: number;
  latestVersion: string;
  license: string;
  lastUpdated: string;
}

// -- Why Items ------------------------------------------------
export interface WhyItem {
  id: string;
  icon: string;
  title: string;
  body: string;
  accent: FeatureAccent;
}

// -- Timeline Steps -------------------------------------------
export interface TimelineStep {
  id: string;
  step: number;
  title: string;
  description: string;
  icon: string;
  accent: FeatureAccent;
}
