import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ScrollProgress } from "@/components/shared/ScrollProgress";
import { BackToTop } from "@/components/shared/BackToTop";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "AetherCP — Privacy-First Competitive Programming Companion",
    template: "%s | AetherCP",
  },
  description:
    "Track your competitive programming practice, analyze your progress, and open problems instantly in VS Code. 100% local, no backend, no tracking.",
  keywords: [
    "competitive programming",
    "codeforces",
    "leetcode",
    "VS Code",
    "browser extension",
    "practice tracker",
    "analytics",
    "privacy",
  ],
  authors: [{ name: "Sujal Ushir" }],
  creator: "Sujal Ushir",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://aethercp.dev",
    title: "AetherCP — Privacy-First Competitive Programming Companion",
    description:
      "Track your practice. Analyze your progress. Open problems instantly in VS Code.",
    siteName: "AetherCP",
  },
  twitter: {
    card: "summary_large_image",
    title: "AetherCP — Privacy-First Competitive Programming Companion",
    description:
      "Track your practice. Analyze your progress. Open problems instantly in VS Code.",
    creator: "@sujalushir",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} dark`} suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground antialiased relative overflow-x-hidden w-full">
        <ScrollProgress />
        <div className="relative flex min-h-screen flex-col overflow-x-hidden w-full">
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
        <BackToTop />
      </body>
    </html>
  );
}
export const viewport = {
  themeColor: "#0a0d1a",
};
