/**
 * AetherCP Authentication Service
 * Manages Google Sign-In, Sign-Out, and session restoration using Supabase.
 */

let _supabaseClient = null;

// Custom storage adapter mapping Supabase GoTrue to chrome.storage.local
const chromeStorageAdapter = {
  getItem: async (key) => {
    try {
      const result = await chrome.storage.local.get(key);
      return result[key] || null;
    } catch (err) {
      console.error("[AetherCP Auth] Failed to read from chrome.storage.local:", err);
      return null;
    }
  },
  setItem: async (key, value) => {
    try {
      await chrome.storage.local.set({ [key]: value });
    } catch (err) {
      console.error("[AetherCP Auth] Failed to write to chrome.storage.local:", err);
    }
  },
  removeItem: async (key) => {
    try {
      await chrome.storage.local.remove(key);
    } catch (err) {
      console.error("[AetherCP Auth] Failed to remove from chrome.storage.local:", err);
    }
  }
};

/**
 * Initializes and returns the shared Supabase client instance.
 */
function getSupabaseClient() {
  if (!_supabaseClient) {
    const url = AETHERCP_CONSTANTS.SUPABASE_URL;
    const anonKey = AETHERCP_CONSTANTS.SUPABASE_ANON_KEY;

    if (!url || !anonKey || url === "YOUR_SUPABASE_PROJECT_URL" || anonKey === "YOUR_SUPABASE_PUBLISHABLE_ANON_KEY") {
      console.warn("[AetherCP Auth] Supabase is not configured. Please supply valid project credentials.");
    }

    _supabaseClient = supabase.createClient(url, anonKey, {
      auth: {
        storage: chromeStorageAdapter,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false // Required for Chrome extension background workers
      }
    });
  }
  return _supabaseClient;
}

/**
 * Handles Sign-In with Google using chrome.identity.launchWebAuthFlow.
 */
async function signInWithGoogle() {
  const client = getSupabaseClient();
  const redirectUrl = chrome.identity.getRedirectURL();

  console.log("[AetherCP Auth] Initializing Google sign-in flow. Redirect URL:", redirectUrl);

  const { data, error } = await client.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: redirectUrl
    }
  });

  if (error) {
    throw error;
  }

  if (!data?.url) {
    throw new Error("Failed to retrieve OAuth authorization URL from Supabase.");
  }

  console.log("[AetherCP Auth] Launching identity web auth flow...");
  const callbackUrl = await chrome.identity.launchWebAuthFlow({
    url: data.url,
    interactive: true
  });

  if (!callbackUrl) {
    throw new Error("Google Sign-In flow was cancelled or failed.");
  }

  console.log("[AetherCP Auth] Web auth flow returned. Parsing session tokens...");
  const urlObj = new URL(callbackUrl);
  // OAuth returns tokens in the hash fragment (e.g. #access_token=...&refresh_token=...)
  const hash = urlObj.hash.substring(1);
  const params = new URLSearchParams(hash);

  let accessToken = params.get("access_token");
  let refreshToken = params.get("refresh_token");

  // Fallback to query params in case redirect configured differently
  if (!accessToken) {
    const searchParams = new URLSearchParams(urlObj.search);
    accessToken = searchParams.get("access_token");
    refreshToken = searchParams.get("refresh_token");
  }

  if (!accessToken) {
    throw new Error("No access token found in redirect callback URL.");
  }

  console.log("[AetherCP Auth] Setting session in Supabase client...");
  const { data: sessionData, error: sessionError } = await client.auth.setSession({
    access_token: accessToken,
    refresh_token: refreshToken
  });

  if (sessionError) {
    throw sessionError;
  }

  console.log("[AetherCP Auth] Sign-in successful. User authenticated:", sessionData.user?.email);
  return sessionData.user;
}

/**
 * Signs the user out.
 */
async function signOut() {
  console.log("[AetherCP Auth] Signing user out...");
  const client = getSupabaseClient();
  const { error } = await client.auth.signOut();
  if (error) {
    throw error;
  }
  console.log("[AetherCP Auth] Sign-out completed.");
}

/**
 * Returns the current authenticated user.
 * Automatically restores the session and refreshes token if expired.
 */
async function getCurrentUser() {
  const client = getSupabaseClient();
  try {
    // getSession() will load from local storage and trigger auto-refresh if expired
    const { data: { session }, error: sessionError } = await client.auth.getSession();
    if (sessionError || !session) {
      return null;
    }
    // getUser() fetches the authenticated user object from the API to guarantee validation
    const { data: { user }, error: userError } = await client.auth.getUser();
    if (userError) {
      return null;
    }
    return user;
  } catch (err) {
    console.error("[AetherCP Auth] Error retrieving current user:", err);
    return null;
  }
}
