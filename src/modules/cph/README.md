# CPH (Competitive Companion) Module

Integrates AetherCP with the **Competitive Companion** browser extension protocol and local CPH (Competitive Programming Helper) receiver.

## Responsibilities

- **Payload Construction**: Converts internal AetherCP problem records into standard Competitive Companion JSON payloads.
- **HTTP Client**: Sends problem payloads to the local CPH receiver running at `http://localhost:27121`.
- **Status Monitoring**: Regularly checks and caches whether the local CPH receiver is active.

---

## Core Logic Files

- [`src/modules/cph/cphPayloadBuilder.js`](../../src/modules/cph/cphPayloadBuilder.js)
  Constructs the payload matching the Competitive Companion schema. Includes helper functions to parse URLs into platform-specific group names (e.g., Codeforces contests, LeetCode) and to generate Java-friendly task class names.
- [`src/modules/cph/cphClient.js`](../../src/modules/cph/cphClient.js)
  Handles the HTTP POST request to the CPH receiver. Implements abort signals for timeouts and structured error handling.
- [`src/modules/cph/cphStatus.js`](../../src/modules/cph/cphStatus.js)
  Checks if the local receiver is alive by pinging the endpoint with a minimal payload.

---

## Storage & Cache Notes

- **In-Memory Cache**: Status checks use a 10-second cache (`_cphStatusCache`) within the service worker scope. This prevents spamming the local endpoint during frequent popup refreshes.
- **Cache Invalidation**: The cache is eagerly invalidated using `invalidateCphStatusCache()` after a successful payload submission to guarantee immediate accuracy.

---

## Debug Notes

- **Endpoint**: `http://localhost:27121`
- **Timeout**:
  - Payload sending: `3000ms`
  - Status check: `2000ms`
- **Debugging Payload Submissions**: Check the service worker/extension console for `[AetherCP CPH]` logs to view the structured payloads and responses.
