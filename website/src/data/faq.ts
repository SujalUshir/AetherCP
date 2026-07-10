import type { FaqItem } from "@/types";

export const FAQ_ITEMS: FaqItem[] = [
  {
    id: "is-free",
    question: "Is AetherCP free and open-source?",
    answer: "Yes, AetherCP is completely free and licensed under the permissive MIT License. There are no paid tiers, no premium features hidden behind paywalls, and no telemetry-gathering models. The entire codebase is fully public and audit-ready on GitHub.",
    category: "general",
  },
  {
    id: "data-collection",
    question: "Does the extension collect usage analytics or telemetry?",
    answer: "No. AetherCP is built on a strict zero-telemetry architecture. The extension contains no analytics trackers, advertising SDKs, crash reporters, or usage monitoring scripts. We are structurally incapable of accessing, viewing, or storing your practice logs because the extension has no tracking backend.",
    category: "privacy",
  },
  {
    id: "data-storage",
    question: "Where is my practice data persisted?",
    answer: "All session metrics, problem logs, heatmap statistics, and configurations are saved exclusively within the browser's chrome.storage.local API. This sandboxed local database resides on your local machine and does not sync to external servers.",
    category: "privacy",
  },
  {
    id: "permissions",
    question: "Why does the extension require specific browser permissions?",
    answer: "AetherCP requests: (1) `storage` to write session data locally; (2) `tabs` to check active navigation URLs and coordinate problem timing states; (3) `contextMenus` to register right-click shortcuts for VS Code integration; and (4) `identity` (only in the experimental Cloud Build) to enable optional cloud syncing. Host permissions are strictly restricted to codeforces.com, leetcode.com, and localhost loopbacks to maintain security.",
    category: "privacy",
  },
  {
    id: "codeforces-support",
    question: "How does the Codeforces integration operate?",
    answer: "AetherCP automatically parses Codeforces URLs matching /problemset/problem/, /contest//problem/, and /gym//problem/ paths. It also injects a custom canvas-based Chart.js dashboard into Codeforces profiles, displaying submission distributions retrieved via the public API alongside locally-computed productivity metrics.",
    category: "platforms",
  },
  {
    id: "leetcode-support",
    question: "What features are supported on LeetCode?",
    answer: "The extension automatically detects active LeetCode problem sheets and tracks active solve times. It also supports exporting LeetCode problems directly to VS Code, parsing the sample test cases from the problem's DOM description container.",
    category: "platforms",
  },
  {
    id: "other-platforms",
    question: "When will other platforms like AtCoder or CodeChef be supported?",
    answer: "Support for AtCoder and CodeChef is currently on the product roadmap. The extension is designed with a platform-agnostic architecture, meaning adding new platforms requires only registering content script matches and creating custom DOM selector parsers.",
    category: "platforms",
  },
  {
    id: "vscode-setup",
    question: "How does the VS Code integration establish connections?",
    answer: "AetherCP implements the standard Competitive Companion loopback protocol. When you trigger 'Open in VS Code' (from the popup or context menu), the background worker compiles a JSON payload and issues an HTTP POST request to localhost:27121. The active CPH extension in VS Code receives this payload to bootstrap your workspace.",
    category: "technical",
  },
  {
    id: "idle-detection",
    question: "How does the CP-friendly idle detection ensure timer accuracy?",
    answer: "The timer tracks activity by subscribing to keydown and click events on the active tab. If no inputs are recorded for 15 minutes, AetherCP pauses session logging and retroactively credits back the 15-minute thinking time. This accommodates pencil-and-paper drafting without skewing your practice metrics.",
    category: "technical",
  },
  {
    id: "data-export",
    question: "Can I export my local database?",
    answer: "Data portability is on the immediate roadmap. Currently, your data is accessible through Chrome DevTools under the Application storage tab. We are currently implementing a one-click export mechanism that compiles your problems and daily totals into standardized JSON and CSV files.",
    category: "technical",
  },
  {
    id: "multiple-browsers",
    question: "Can I synchronize session history across multiple devices?",
    answer: "Currently, data is strictly isolated to the browser instance where the extension is loaded. We have designed a planned sync feature that leverages end-to-end encryption (E2EE) to synchronize configurations and totals across devices without compromising our privacy-first guidelines.",
    category: "technical",
  },
  {
    id: "open-source",
    question: "How can I contribute to the project?",
    answer: "We welcome all contributions. You can fork our repository on GitHub, check out the issue tracker for bugs or roadmap priorities, and submit pull requests. For major architectural suggestions, please open a design issue first to align with our local-first roadmap.",
    category: "general",
  },
];
