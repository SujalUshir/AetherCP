import type { ScreenshotItem } from "@/types";

export const SCREENSHOTS: ScreenshotItem[] = [
  {
    id: "popup",
    title: "Extension Popup",
    description: "The main AetherCP popup showing the active session timer, today's coding time, current streak, and recent problems. Opens instantly with one click.",
    url: "codeforces.com/contest/2239/problem/A",
    category: "Popup",
  },
  {
    id: "analytics",
    title: "Analytics Dashboard",
    description: "The full analytics view inside the popup — contribution heatmap, daily bar chart, weekly summary, and productivity score all in a single panel.",
    url: "codeforces.com/problemset",
    category: "Analytics",
  },
  {
    id: "cf-profile",
    title: "Codeforces Profile Analytics",
    description: "AetherCP injects a complete analytics panel directly into your Codeforces profile — rating graph, verdict distribution, tag analysis, and contest history.",
    url: "codeforces.com/profile/tourist",
    category: "Codeforces",
  },
  {
    id: "vscode",
    title: "VS Code Integration",
    description: "Sending a problem to VS Code in one click. AetherCP extracts all sample tests, time limits, and memory limits automatically via the Competitive Companion protocol.",
    url: "codeforces.com/contest/2100/problem/E",
    category: "VS Code",
  },
  {
    id: "history",
    title: "Problem History",
    description: "Complete problem-by-problem history with session duration, platform, timestamp, and difficulty rating — sorted by most recent.",
    url: "leetcode.com/problems/two-sum",
    category: "History",
  },
];
