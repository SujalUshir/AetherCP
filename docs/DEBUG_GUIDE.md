# Debug Guide

## Beginner Debug Checklist

1. Reload the extension in `chrome://extensions`.
2. Open the background service worker console.
3. Open the problem page console.
4. Open the popup console by right-clicking popup and inspecting.
5. Inspect `chrome.storage.local`.

## Where To Look

- Problem name wrong: check `src/content/`.
- Timer wrong: check `src/background/`.
- Popup display wrong: check `src/popup/`.
- Stored data wrong: check `docs/STORAGE_SCHEMA.md` and storage writes.
- Codeforces profile charts missing: open the page console and filter for `[AetherCP:profile]` or `[AetherCP:profile-injector]`.

## Console Logging Strategy

Use clear prefixes:

```js
console.log("[AetherCP:content]", "problem detected", problem);
console.log("[AetherCP:background]", "session started", session);
console.log("[AetherCP:popup]", "snapshot rendered", snapshot);
console.log("[AetherCP:profile-injector]", "appended graph template");
console.log("[AetherCP:profile]", "created chart", chartData);
console.log("[AetherCP API]", "fetched data successfully", results);
console.log("[AetherCP SOLVED]", "submissions processing", counts);
```

Avoid random logs without prefixes.

## Feature Isolation Strategy

When debugging:

1. Disable unrelated new features.
2. Test one platform at a time.
3. Test one event at a time: load, refresh, tab switch, popup reopen.
4. Record findings in `logs/`.
5. If an LLM helps debug, save the prompt and useful output in `ai/`.

## Useful Manual Tests

- Open LeetCode problem, wait 10 seconds, reopen popup.
- Refresh same problem and confirm time continues.
- Switch to another problem and confirm old one stops.
- Switch to non-problem tab and confirm timer stops.
- Close active problem tab and confirm timer stops.
