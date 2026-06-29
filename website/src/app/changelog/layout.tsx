import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Changelog — AetherCP",
  description: "Version history and updates for AetherCP, the privacy-first competitive programming timer.",
  alternates: { canonical: "https://aethercp.dev/changelog" },
};
export default function ChangelogLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
