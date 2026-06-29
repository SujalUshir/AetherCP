import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Screenshots — AetherCP",
  description:
    "See AetherCP in action — actual screenshots of the extension popup, analytics dashboard, Codeforces profile integration, and VS Code workflow.",
  alternates: { canonical: "https://aethercp.dev/screenshots" },
};

export default function ScreenshotsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
