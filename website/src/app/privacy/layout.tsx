import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Privacy Policy — AetherCP",
  description: "AetherCP Privacy Policy. We collect zero data, perform no tracking, and store everything locally.",
  alternates: { canonical: "https://aethercp.dev/privacy" },
};
export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
