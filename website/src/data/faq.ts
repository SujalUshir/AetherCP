import type { FaqItem } from "@/types";

export const FAQ_ITEMS: FaqItem[] = [
  {
    id: "is-free",
    question: "Is AetherCP free?",
    answer: "Yes — completely free, forever. AetherCP is open source under the MIT license. There is no paid tier, no freemium model, and no premium features behind a paywall. The entire codebase is public on GitHub.",
    category: "general",
  },
  {
    id: "data-collection",
    question: "Does AetherCP collect any data?",
    answer: "No. AetherCP collects zero personal data. It contains no analytics scripts, no telemetry, no crash reporters, and no usage trackers. We are architecturally incapable of seeing your data because there is no server to send it to.",
    category: "privacy",
  },
  {
    id: "data-storage",
    question: "Where is my data stored?",
    answer: "All your session data, problem history, analytics, and settings are stored exclusively in your browser's chrome.storage.local. This is sandboxed to your browser and your machine. It never touches the internet.",
    category: "privacy",
  },
  {
    id: "permissions",
    question: "What browser permissions does AetherCP request and why?",
    answer: "AetherCP requests: storage (to save your sessions locally), tabs (to detect which tab is active), and contextMenus (for the right-click VS Code integration). Host permissions are limited to codeforces.com, leetcode.com, and localhost:27121 (CPH receiver). We request the minimum possible permissions.",
    category: "privacy",
  },
  {
    id: "codeforces-support",
    question: "Does it work with Codeforces?",
    answer: "Yes. AetherCP fully supports Codeforces including all three URL formats: /problemset/problem/, /contest//problem/, and /gym//problem/. It also injects a full analytics dashboard directly into your Codeforces profile page.",
    category: "platforms",
  },
  {
    id: "leetcode-support",
    question: "Does it support LeetCode?",
    answer: "Yes. AetherCP detects LeetCode problems and tracks your session time automatically. The VS Code integration also works on LeetCode — sample test extraction parses examples from the problem description.",
    category: "platforms",
  },
  {
    id: "other-platforms",
    question: "Will AtCoder, CodeChef, or other platforms be supported?",
    answer: "AtCoder support is on the roadmap. The architecture is designed to be platform-agnostic — adding new platforms requires only a new content script entry and a parser module. Track progress on the Roadmap page.",
    category: "platforms",
  },
  {
    id: "vscode-setup",
    question: "How does VS Code integration work?",
    answer: "AetherCP uses the Competitive Companion protocol. Install the competitive-companion receiver for VS Code (or any compatible extension), and click 'Open in VS Code' in the popup. AetherCP will send the problem name, sample tests, time limit, and memory limit directly to your editor.",
    category: "technical",
  },
  {
    id: "idle-detection",
    question: "How does idle detection work?",
    answer: "The session timer pauses automatically after 15 minutes of inactivity (no keyboard or mouse input). This threshold is intentionally generous — competitive programming involves thinking, sketching, and reading — not just typing. When you return, the timer resumes instantly.",
    category: "technical",
  },
  {
    id: "data-export",
    question: "Can I export my data?",
    answer: "Not yet — data export is on the roadmap. Currently, your data lives in chrome.storage.local and can be accessed via the Chrome DevTools Application panel. A one-click export to JSON/CSV is planned for a future release.",
    category: "technical",
  },
  {
    id: "multiple-browsers",
    question: "Does it sync across browsers or devices?",
    answer: "Not currently. All data is local to the browser where the extension is installed. Cross-device sync via chrome.storage.sync or a privacy-respecting cloud backend is planned. This will be opt-in and end-to-end encrypted.",
    category: "technical",
  },
  {
    id: "open-source",
    question: "Can I contribute to AetherCP?",
    answer: "Absolutely. The repository is open on GitHub under the MIT License. Open an issue to discuss a feature, submit a pull request, report a bug, or review the code. All contributions are welcome.",
    category: "general",
  },
];
