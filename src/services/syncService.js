/**
 * AetherCP Synchronization Service
 * Coordinates backup and restore operations with Supabase.
 */

const SYNC_STATES = {
  UNINITIALIZED: "UNINITIALIZED",
  RESTORING:     "RESTORING",
  READY:         "READY",
  SYNCING:       "SYNCING",
  ERROR:         "ERROR"
};

let _currentSyncState = SYNC_STATES.UNINITIALIZED;
let _syncLockPromise = null;
let _syncLockResolve = null;

function getSyncState() {
  return _currentSyncState;
}

function setSyncState(state) {
  console.log(`[AetherCP Sync] STATE TRANSITION: ${_currentSyncState} -> ${state}`);
  _currentSyncState = state;
}

function acquireSyncLock() {
  if (_syncLockPromise) {
    console.log("[AetherCP Sync] Lock already held.");
    return;
  }
  console.log("[AetherCP Sync] LOCK ACQUIRED");
  _syncLockPromise = new Promise((resolve) => {
    _syncLockResolve = resolve;
  });
}

function releaseSyncLock() {
  if (!_syncLockPromise) {
    console.log("[AetherCP Sync] Lock is not held.");
    return;
  }
  console.log("[AetherCP Sync] LOCK RELEASED");
  if (_syncLockResolve) {
    _syncLockResolve();
  }
  _syncLockPromise = null;
  _syncLockResolve = null;
}

async function awaitSyncLock() {
  if (_syncLockPromise) {
    console.log("[AetherCP Sync] WAITING... for sync lock");
    await _syncLockPromise;
  }
}

// Helper to retrieve sync status
async function getSyncStatus() {
  const res = await chrome.storage.local.get("aethercp_sync_status");
  return res["aethercp_sync_status"] || "Synced";
}

// Helper to set sync status and notify listeners
async function setSyncStatus(status) {
  await chrome.storage.local.set({ "aethercp_sync_status": status });
  chrome.runtime.sendMessage({ type: "SYNC_STATUS_CHANGED", status }).catch(() => {});
}

// Helper to get sync dirty flag
async function getSyncDirty() {
  const res = await chrome.storage.local.get("aethercp_sync_dirty");
  return res["aethercp_sync_dirty"] || false;
}

// Helper to set sync dirty flag
async function setSyncDirty(isDirty) {
  await chrome.storage.local.set({ "aethercp_sync_dirty": isDirty });
}

// Helper to get last backup timestamp
async function getLastBackupTime() {
  const res = await chrome.storage.local.get("aethercp_last_backup_time");
  return res["aethercp_last_backup_time"] || null;
}

// Helper to set last backup timestamp
async function setLastBackupTime(timestamp) {
  await chrome.storage.local.set({ "aethercp_last_backup_time": timestamp });
  chrome.runtime.sendMessage({ type: "SYNC_TIMESTAMP_CHANGED", timestamp }).catch(() => {});
}

// Helper to check if a timer is currently active
function isTimerTicking(state) {
  return state && state.activeSession !== null;
}

/**
 * Downloads the user backup from Supabase.
 */
async function downloadBackup() {
  const user = await getCurrentUser();
  if (!user) return null;

  console.log("[AetherCP Sync] DOWNLOAD START");
  try {
    const client = getSupabaseClient();
    const { data, error, status } = await client
      .from("user_data")
      .select("data, updated_at, version")
      .eq("user_id", user.id)
      .maybeSingle();

    if (error && status !== 406) {
      throw error;
    }

    console.log("[AetherCP Sync] DOWNLOAD END (Success)");
    return data || null;
  } catch (err) {
    console.error("[AetherCP Sync] DOWNLOAD END (Failed)", err);
    return null;
  }
}

/**
 * Uploads the entire local state to Supabase.
 */
async function uploadBackup(state) {
  if (isTimerTicking(state)) {
    console.log("[AetherCP Sync] Upload skipped: timer is currently ticking.");
    return;
  }

  const user = await getCurrentUser();
  if (!user) {
    console.log("[AetherCP Sync] Upload skipped: user is not authenticated.");
    return;
  }

  console.log("[AetherCP Sync] UPLOAD START");
  setSyncState(SYNC_STATES.SYNCING);
  await setSyncStatus("Uploading");

  try {
    const client = getSupabaseClient();
    
    // Ensure state contains updated_at
    if (!state.updated_at) {
      state.updated_at = new Date().toISOString();
    }

    const { error } = await client
      .from("user_data")
      .upsert({
        user_id: user.id,
        data: state,
        updated_at: state.updated_at,
        version: 1
      }, { onConflict: "user_id" });

    if (error) {
      throw error;
    }

    console.log("[AetherCP Sync] UPLOAD END (Success)");
    await setSyncStatus("Synced");
    await setSyncDirty(false);
    await setLastBackupTime(Date.now());
    setSyncState(SYNC_STATES.READY);
  } catch (err) {
    console.error("[AetherCP Sync] UPLOAD END (Failed)", err);
    console.log("[AetherCP Sync] Pending Sync");
    await setSyncStatus("Pending Sync");
    await setSyncDirty(true);
    setSyncState(SYNC_STATES.ERROR);
    console.log("[AetherCP Sync] Retry scheduled");
  }
}

/**
 * Compares local vs cloud timestamps and updates the older store.
 */
async function performSync(localState) {
  const user = await getCurrentUser();
  if (!user) return;

  const cloudBackup = await downloadBackup();
  if (!cloudBackup) {
    // If no backup exists: Automatically upload local storage
    console.log("[AetherCP Sync] Backup created");
    await uploadBackup(localState);
    return;
  }

  const localTime = localState.updated_at ? new Date(localState.updated_at).getTime() : 0;
  const cloudTime = cloudBackup.updated_at ? new Date(cloudBackup.updated_at).getTime() : 0;

  if (localTime > cloudTime) {
    console.log("[AetherCP Sync] Local newer");
    await uploadBackup(localState);
  } else if (cloudTime > localTime) {
    console.log("[AetherCP Sync] Cloud newer");
    const cloudState = cloudBackup.data;
    // Replace local storage with cloud state (bypassing the sync lock)
    await saveState(cloudState, true);
    
    // Verify storage write matches cloudState before releasing the lock
    const verifyData = await chrome.storage.local.get(STORAGE_KEY);
    const verifyState = verifyData[STORAGE_KEY];
    if (!verifyState || verifyState.updated_at !== cloudState.updated_at) {
      throw new Error("[AetherCP Sync] Verification failed: storage write did not match downloaded state!");
    }
    console.log("[AetherCP Sync] Verification success: storage matches downloaded cloud backup.");

    await setSyncStatus("Synced");
    await setSyncDirty(false);
    // Align last backup timestamp
    const cloudUpdatedAt = cloudBackup.updated_at ? new Date(cloudBackup.updated_at).getTime() : Date.now();
    await setLastBackupTime(cloudUpdatedAt);
  } else {
    console.log("[AetherCP Sync] Timestamps are equal. Sync complete.");
    await setSyncStatus("Synced");
    await setSyncDirty(false);
    const cloudUpdatedAt = cloudBackup.updated_at ? new Date(cloudBackup.updated_at).getTime() : Date.now();
    await setLastBackupTime(cloudUpdatedAt);
  }
}

/**
 * Triggered on successful login.
 */
async function syncOnLogin() {
  setSyncState(SYNC_STATES.RESTORING);
  acquireSyncLock();
  try {
    const localState = await getState(true); // bypass lock
    await performSync(localState);
    
    // Verify restored state if authenticated
    const user = await getCurrentUser();
    if (user) {
      const stored = await chrome.storage.local.get(STORAGE_KEY);
      if (stored[STORAGE_KEY]) {
        console.log("[AetherCP Sync] Restored state verification: SUCCESS");
      } else {
        console.warn("[AetherCP Sync] Restored state verification: empty state in storage!");
      }
    }
    setSyncState(SYNC_STATES.READY);
  } catch (err) {
    console.error("[AetherCP Sync] Post-login sync failed:", err);
    setSyncState(SYNC_STATES.ERROR);
    throw err;
  } finally {
    releaseSyncLock();
  }
}

/**
 * Triggered on extension/service worker startup.
 */
async function syncOnStartup() {
  const user = await getCurrentUser();
  if (!user) {
    setSyncState(SYNC_STATES.READY);
    return;
  }

  setSyncState(SYNC_STATES.RESTORING);
  acquireSyncLock();
  try {
    const state = await getState(true); // bypass lock
    if (isTimerTicking(state)) {
      setSyncState(SYNC_STATES.READY);
      return;
    }

    const isDirty = await getSyncDirty();
    const status = await getSyncStatus();

    // If sync is pending, local has updates, or status was offline/pending
    if (isDirty || status === "Pending Sync" || status === "Offline") {
      console.log("[AetherCP Sync] Retrying pending backup on startup...");
      await performSync(state);
    } else {
      // Do a general comparison sync
      await performSync(state);
    }
    setSyncState(SYNC_STATES.READY);
  } catch (err) {
    console.error("[AetherCP Sync] Startup sync execution failed:", err);
    setSyncState(SYNC_STATES.ERROR);
  } finally {
    releaseSyncLock();
  }
}

let uploadTimeoutId = null;

function scheduleDeferredUpload() {
  if (uploadTimeoutId) {
    clearTimeout(uploadTimeoutId);
  }

  setSyncDirty(true).catch(() => {});
  setSyncStatus("Pending Sync").catch(() => {});

  console.log("[AetherCP Sync] Session completed. Upload scheduled in 3 seconds...");

  uploadTimeoutId = setTimeout(async () => {
    uploadTimeoutId = null;
    try {
      const state = await getState();
      if (isTimerTicking(state)) {
        console.log("[AetherCP Sync] Upload skipped: timer restarted.");
        return;
      }
      await uploadBackup(state);
    } catch (err) {
      console.error("[AetherCP Sync] Deferred upload failed:", err);
    }
  }, 3000); // 3 seconds delay
}
