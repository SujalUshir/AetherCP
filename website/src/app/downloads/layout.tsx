import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Downloads — AetherCP",
  description: "Download AetherCP v1.2.0 for Chrome. Install from GitHub Releases or load manually as an unpacked extension.",
  alternates: { canonical: "https://aethercp.dev/downloads" },
};
export default function DownloadsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
