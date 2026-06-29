import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Roadmap — AetherCP",
  description: "Track planned improvements, upcoming platforms, and ongoing development for AetherCP.",
  alternates: { canonical: "https://aethercp.dev/roadmap" },
};
export default function RoadmapLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
