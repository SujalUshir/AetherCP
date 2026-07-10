import type { ChangelogVersion } from "@/types";

export const CHANGELOG: ChangelogVersion[] = [
  {
    version: "1.2.0",
    date: "June 2026",
    tag: "latest",
    summary: "Major release introducing profile widgets, enhanced loopback editor communication, and robust timer recovery routines.",
    changes: [
      { type: "added",    text: "Decoupled double-system profile analytics: injected Codeforces public status metrics and local session logs." },
      { type: "added",    text: "SVG-rendered rating progression and verdict distribution (AC/WA/TLE/MLE/RE) visualizations." },
      { type: "added",    text: "Topic Tag diagnostics dashboard mapping problem ratings to solved counts directly inside profile DOMs." },
      { type: "added",    text: "Sample test case and constraint parsers for contest (/contest/*) and gym (/gym/*) paths." },
      { type: "improved", text: "Editor integration protocol fetches fresh test cases asynchronously on trigger events." },
      { type: "improved", text: "Asynchronous state saving preserves timer integrity across service worker sleep transitions." },
      { type: "improved", text: "Refactored idle detection threshold to a generous 15 minutes, accommodating non-keyboard design cycles." },
      { type: "improved", text: "Context menu registrations restricted to supported URL formats to optimize resource footprint." },
      { type: "fixed",    text: "Resolved race conditions in contest and gym URL parsing routines." },
      { type: "fixed",    text: "Handled Chromium extension context invalidation warnings gracefully within content script listeners." },
      { type: "fixed",    text: "Corrected TTL caching bugs on API rating lookups." },
    ],
  },
  {
    version: "1.1.0",
    date: "April 2026",
    summary: "Telemetry engine updates, introducing full-year activity heatmaps, daily bar charts, and history popups.",
    changes: [
      { type: "added",    text: "Sunday-aligned 52-week activity calendar grid visualizing practice intensity locally." },
      { type: "added",    text: "Daily time breakdown bar chart using Chart.js inside the extension popup container." },
      { type: "added",    text: "Problem-by-problem historical ledger sorting entries by relative recency." },
      { type: "added",    text: "streak count calculator and consistency score aggregator." },
      { type: "improved", text: "Redesigned popup layout for enhanced text scanning and responsive boundaries." },
      { type: "improved", text: "Expanded LeetCode problem sheet DOM parser compatibility." },
      { type: "improved", text: "Re-entry loops in background worker restore session metrics gracefully after browser restarts." },
      { type: "fixed",    text: "Fixed timer leakage on document visibility changes (tab background transitions)." },
      { type: "fixed",    text: "Resolved duplicate rendering issues in history logs on fast route switches." },
    ],
  },
  {
    version: "1.0.1",
    date: "February 2026",
    summary: "Bug fix patch targeting startup race conditions and timer calculation discrepancies.",
    changes: [
      { type: "fixed", text: "Resolved startup race condition causing delays in content script timer initialization." },
      { type: "fixed", text: "Corrected timestamp offset discrepancies on browser restart cycles." },
      { type: "fixed", text: "Ensured reliable detection on Codeforces login redirection cascades." },
      { type: "fixed", text: "Prevented memory leaks in MutationObserver hooks on long-running problem tabs." },
      { type: "improved", text: "Decreased extension startup overhead by ~40% by deferring non-critical module imports." },
    ],
  },
  {
    version: "1.0.0",
    date: "January 2026",
    summary: "Initial release of AetherCP — the privacy-centric, local-first browser extension for competitive programmers.",
    changes: [
      { type: "added", text: "Automatic timing sessions on Codeforces and LeetCode problem sheets." },
      { type: "added", text: "Custom keyboard/click idle observer with automatic session pausing." },
      { type: "added", text: "Local storage schema built on sandboxed chrome.storage.local." },
      { type: "added", text: "Extension popup displaying current problem elapsed time and daily totals." },
      { type: "added", text: "Competitive Companion protocol integration on localhost loopback port 27121." },
      { type: "added", text: "Right-click context menu integrations for direct CPH transfers." },
    ],
  },
];
