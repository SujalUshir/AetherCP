import type { FaqItem } from "@/types";

export const FAQ_ITEMS: FaqItem[] = [
  {
    id: "is-free",
    question: "Is AetherCP free and open-source?",
    answer: "Yes. AetherCP is completely free and licensed under the MIT License. There are no paid tiers, no premium features, and no telemetry. The full codebase is public on GitHub.",
    category: "general",
  },
  {
    id: "platforms-supported",
    question: "Which platforms are supported?",
    answer: "AetherCP currently supports Codeforces only. Problem tracking works on /problemset/problem/, /contest//problem/, and /gym//problem/ URL patterns. LeetCode support is planned but disabled in the current release. AtCoder and CodeChef are not yet implemented.",
    category: "platforms",
  },
  {
    id: "leetcode-support",
    question: "Does it work on LeetCode?",
    answer: "No. LeetCode is not supported in the current release (v1.2.0). The infrastructure exists in the codebase but is intentionally disabled. Support for LeetCode is on the roadmap.",
    category: "platforms",
  },
  {
    id: "account-required",
    question: "Does it require an account or login?",
    answer: "No. AetherCP does not require any account, Google login, or sign-up. All data is stored locally in your browser using chrome.storage.local. Cloud Sync is a planned future feature and is not active in the current release.",
    category: "general",
  },
  {
    id: "refresh-timer",
    question: "What happens if I refresh a problem page?",
    answer: "Nothing — the timer keeps counting. AetherCP detects that the same problem is still open and does not restart the session. Refreshing the page preserves your accumulated time.",
    category: "technical",
  },
  {
    id: "idle-detection",
    question: "How does idle detection work?",
    answer: "AetherCP monitors keyboard and mouse activity (mousemove, click, keydown, scroll, touchstart, and tab focus events). If no activity is detected for 5 continuous minutes, the session is paused retroactively — the end timestamp is rolled back to when you actually stopped working, not when the idle check fired. Tracking resumes automatically on the next interaction.",
    category: "technical",
  },
  {
    id: "data-storage",
    question: "What data is stored locally?",
    answer: "AetherCP stores all session records, problem history, daily totals, and tab state in chrome.storage.local under the key 'aethercp'. This includes: problem name, platform, URL, rating, total seconds, session timestamps, and IST daily totals. A separate rating cache (cfProblemsCache) is also stored with a 24-hour TTL. No data is ever uploaded to a server.",
    category: "privacy",
  },
  {
    id: "data-collection",
    question: "Does the extension collect any telemetry or usage analytics?",
    answer: "No. AetherCP contains no analytics trackers, advertising SDKs, crash reporters, or usage monitoring. There is no backend server. We are structurally unable to access, view, or store your practice logs.",
    category: "privacy",
  },
  {
    id: "cloud-sync",
    question: "Is Cloud Sync available?",
    answer: "Not in the current release. Cloud Sync infrastructure exists in the codebase but is fully dormant and not usable. It is planned for a future release. All data in v1.2.0 is strictly local to your browser.",
    category: "technical",
  },
  {
    id: "vscode-setup",
    question: "How does VS Code integration work?",
    answer: "AetherCP implements the Competitive Companion protocol. Click 'Open in VS Code' in the popup (or right-click any Codeforces problem page) and AetherCP extracts the problem name, sample test cases, time limit, and memory limit from the page DOM, then sends a JSON payload to localhost:27121. The CPH extension in VS Code receives this to set up your workspace automatically.",
    category: "technical",
  },
  {
    id: "permissions",
    question: "Why does the extension need specific browser permissions?",
    answer: "AetherCP requests: (1) 'storage' to write session data locally; (2) 'tabs' to detect active problem pages and handle tab switching; (3) 'contextMenus' to register the right-click 'Open in VS Code' shortcut. Host permissions are limited to codeforces.com and localhost:27121. The 'identity' permission is present in the manifest for a planned future Cloud feature and is completely unused in the current release.",
    category: "privacy",
  },
  {
    id: "open-source",
    question: "How can I contribute to the project?",
    answer: "Fork the repository on GitHub, check the issue tracker for open bugs or roadmap priorities, and submit pull requests. For major architectural changes, please open a design issue first to align with the local-first philosophy.",
    category: "general",
  },
];
