/**
 * AetherCP Synchronization Service
 *
 * Single source of truth for all cloud sync operations.
 *
 * Public API (called from background.js):
 *   syncOnLogin()    — after successful Google sign-in
 *   syncOnStartup()  — when the service worker starts
 *   syncOnLogout()   — when the user signs out
 *   markDirty()      — after any local state write
 *
 * Design:
 *   - Cloud backup always wins on login and startup.
 *   - No merge logic, no timestamp comparison, no locks.
 *   - Dirty flag is persisted to survive service-worker restarts.
 *   - Upload is debounced: 3s after markDirty(), 30s safety-net interval.
 */

// ─── Persisted key names ──────────────────────────────────────────────────────

const SYNC_DIRTY_KEY  = "aethercp_sync_dirty";
const SYNC_STATUS_KEY = "aethercp_sync_status";
const SYNC_TIME_KEY   = "aethercp_last_backup_time";

// ─── In-memory state ──────────────────────────────────────────────────────────

let _dirty          = false;   // memory cache — authoritative between ticks
let _uploadTimeoutId = null;   // debounce handle

// ─── Private helpers ──────────────────────────────────────────────────────────

async function _setDirty(value) {
  _dirty = value;
  await chrome.storage.local.set({ [SYNC_DIRTY_KEY]: value });
}

async function _setSyncStatus(status) {
  await chrome.storage.local.set({ [SYNC_STATUS_KEY]: status });
  chrome.runtime.sendMessage({ type: "SYNC_STATUS_CHANGED", status }).catch(() => {});
}

async function _setLastBackupTime(timestamp) {
  await chrome.storage.local.set({ [SYNC_TIME_KEY]: timestamp });
  chrome.runtime.sendMessage({ type: "SYNC_TIMESTAMP_CHANGED", timestamp }).catch(() => {});
}

// ─── Download ─────────────────────────────────────────────────────────────────

async function downloadBackup() {
  const user = await getCurrentUser();
  if (!user) return null;

  console.log("[Sync] Download Started");
  try {
    const { data, error, status } = await getSupabaseClient()
      .from("user_data")
      .select("data, updated_at, version")
      .eq("user_id", user.id)
      .maybeSingle();

    if (error && status !== 406) throw error;

    if (!data) {
      console.log("[Sync] No Cloud Backup");
      return null;
    }

    console.log("[Sync] Download Success");
    return data;
  } catch (err) {
    console.error("[Sync] Download Failed", err);
    return null;
  }
}

// ─── Upload ───────────────────────────────────────────────────────────────────

async function uploadBackup() {
  const user = await getCurrentUser();
  if (!user) return;

  const storageKey = AETHERCP_CONSTANTS.STORAGE_KEY;
  const result = await chrome.storage.local.get(storageKey);
  const state  = result[storageKey];
  if (!state) return;

  // Never upload mid-session — the timer is still running
  if (state.activeSession !== null) return;

  console.log("[Sync] Upload Started");
  await _setSyncStatus("Uploading");

  try {
    const now = new Date().toISOString();
    const { error } = await getSupabaseClient()
      .from("user_data")
      .upsert(
        { user_id: user.id, data: { ...state, updated_at: now }, updated_at: now, version: 1 },
        { onConflict: "user_id" }
      );

    if (error) throw error;

    await _setDirty(false);
    await _setLastBackupTime(Date.now());
    await _setSyncStatus("Synced");
    console.log("[Sync] Upload Success");
  } catch (err) {
    console.error("[Sync] Upload Failed", err);
    await _setSyncStatus("Pending Sync");
    console.log("[Sync] Retry Scheduled");
    // _dirty remains true — the 30s interval will retry
  }
}

// ─── markDirty ────────────────────────────────────────────────────────────────

function markDirty() {
  _dirty = true;
  chrome.storage.local.set({ [SYNC_DIRTY_KEY]: true }).catch(() => {});
  console.log("[Sync] Dirty State Set");

  if (_uploadTimeoutId) return; // upload already queued

  _uploadTimeoutId = setTimeout(async () => {
    _uploadTimeoutId = null;
    await uploadBackup();
  }, 3000);
}

// ─── Login ────────────────────────────────────────────────────────────────────

async function syncOnLogin() {
  console.log("[Sync] Login Sync Started");

  const backup = await downloadBackup();

  if (backup && backup.data) {
    // Cloud exists — it wins. Restore it immediately.
    await chrome.storage.local.set({ [AETHERCP_CONSTANTS.STORAGE_KEY]: backup.data });
    const ts = backup.updated_at ? new Date(backup.updated_at).getTime() : Date.now();
    await _setDirty(false);
    await _setLastBackupTime(ts);
    await _setSyncStatus("Synced");
    console.log("[Sync] Restored Local Storage");
  } else {
    // No cloud backup — upload what we have so far
    await uploadBackup();
  }
}

// ─── Startup ──────────────────────────────────────────────────────────────────

async function syncOnStartup() {
  const user = await getCurrentUser();
  if (!user) return;

  const backup = await downloadBackup();

  if (backup && backup.data) {
    await chrome.storage.local.set({ [AETHERCP_CONSTANTS.STORAGE_KEY]: backup.data });
    const ts = backup.updated_at ? new Date(backup.updated_at).getTime() : Date.now();
    await _setDirty(false);
    await _setLastBackupTime(ts);
    await _setSyncStatus("Synced");
    console.log("[Sync] Restored Local Storage");
  }
  // else: keep local, do nothing
}

// ─── Logout ───────────────────────────────────────────────────────────────────

async function syncOnLogout() {
  await signOut();

  if (_uploadTimeoutId) {
    clearTimeout(_uploadTimeoutId);
    _uploadTimeoutId = null;
  }

  _dirty = false;

  await chrome.storage.local.remove([
    AETHERCP_CONSTANTS.STORAGE_KEY,
    SYNC_DIRTY_KEY,
    SYNC_STATUS_KEY,
    SYNC_TIME_KEY
  ]);
}

// ─── 30-second safety-net interval ───────────────────────────────────────────
// Handles the case where the service worker was killed while _dirty was true
// and the debounce timeout was lost. On next wake, the persisted flag triggers.

(async function _initPeriodicUpload() {
  // Sync memory cache with what was persisted before the last restart
  const result = await chrome.storage.local.get(SYNC_DIRTY_KEY);
  if (result[SYNC_DIRTY_KEY]) {
    _dirty = true;
  }

  setInterval(async () => {
    if (!_dirty)          return; // nothing to do
    if (_uploadTimeoutId) return; // debounce already running
    await uploadBackup();
  }, 30_000);
})();
