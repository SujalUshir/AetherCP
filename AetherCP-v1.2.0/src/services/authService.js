/**
 * AetherCP Authentication Service
 * Manages Google Sign-In, Sign-Out, and session restoration using Supabase.
 */

let _supabaseClient = null;

const REDACTED_VALUE = "[redacted]";

function serializeError(error) {
  if (!error) return null;

  return {
    name: error.name || "Error",
    message: error.message || String(error),
    stack: error.stack || null,
    status: error.status || null,
    code: error.code || error.error || null,
    details: error.details || null,
    hint: error.hint || null,
    cause: error.cause ? serializeError(error.cause) : null
  };
}

function logAuthError(context, error, extra = {}) {
  if (!isCloudBuild()) return;
  console.error(`[AetherCP Auth] ${context}`, {
    error: serializeError(error),
    extra
  });
}

function redactUrl(rawUrl) {
  try {
    const url = new URL(rawUrl);

    [
      "access_token",
      "refresh_token",
      "id_token",
      "code",
      "code_verifier",
      "code_challenge"
    ].forEach((key) => {
      if (url.searchParams.has(key)) {
        url.searchParams.set(key, REDACTED_VALUE);
      }
    });

    if (url.hash) {
      const hash = new URLSearchParams(url.hash.slice(1));
      [
        "access_token",
        "refresh_token",
        "id_token",
        "code",
        "code_verifier",
        "code_challenge"
      ].forEach((key) => {
        if (hash.has(key)) {
          hash.set(key, REDACTED_VALUE);
        }
      });
      url.hash = hash.toString();
    }

    return url.toString();
  } catch (_) {
    return "[unparseable-url]";
  }
}

function getAuthUserProfile(user) {
  if (!user) return null;

  const metadata = user.user_metadata || {};
  return {
    id: user.id,
    email: user.email || "",
    name: metadata.full_name || metadata.name || user.email || "",
    avatarUrl: metadata.avatar_url || metadata.picture || ""
  };
}

function getSupabaseConfig() {
  const url = AETHERCP_CONSTANTS.SUPABASE_URL;
  const anonKey = AETHERCP_CONSTANTS.SUPABASE_ANON_KEY;
  const missingConfig =
    !url ||
    !anonKey ||
    url === "YOUR_SUPABASE_PROJECT_URL" ||
    anonKey === "YOUR_SUPABASE_PUBLISHABLE_ANON_KEY";

  return { url, anonKey, missingConfig };
}

function assertSupabaseConfigured() {
  const { url, anonKey, missingConfig } = getSupabaseConfig();

  if (missingConfig) {
    const redirectUrl = chrome.identity.getRedirectURL();
    throw new Error(
      "Supabase authentication is not configured. Set AETHERCP_CONSTANTS.SUPABASE_URL and " +
      `AETHERCP_CONSTANTS.SUPABASE_ANON_KEY. Also allow this Chrome redirect URL in Supabase: ${redirectUrl}`
    );
  }

  return { url, anonKey };
}

async function supabaseAuthFetch(input, init) {
  const response = await fetch(input, init);

  if (!response.ok) {
    let responseBody = "";
    try {
      responseBody = await response.clone().text();
    } catch (err) {
      responseBody = `[failed to read response body: ${err.message}]`;
    }

    console.error("[AetherCP Auth] Supabase HTTP request failed.", {
      url: redactUrl(typeof input === "string" ? input : input.url),
      status: response.status,
      statusText: response.statusText,
      responseBody
    });
  }

  return response;
}

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
    const { url, anonKey, missingConfig } = getSupabaseConfig();

    if (missingConfig) {
      console.error("[AetherCP Auth] Supabase configuration is missing or still uses placeholders.", {
        hasUrl: Boolean(url),
        hasAnonKey: Boolean(anonKey),
        redirectUrl: chrome.identity.getRedirectURL()
      });
    }

    _supabaseClient = supabase.createClient(url, anonKey, {
      auth: {
        storage: chromeStorageAdapter,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
        flowType: "pkce"
      },
      global: {
        fetch: supabaseAuthFetch
      }
    });
  }
  return _supabaseClient;
}

/**
 * Handles Sign-In with Google using chrome.identity.launchWebAuthFlow.
 */
async function signInWithGoogle() {
  if (!isCloudBuild()) {
    return { ok: false, error: "Cloud Sync is only available in the Cloud Edition." };
  }
  const { url: supabaseUrl } = assertSupabaseConfigured();
  const client = getSupabaseClient();
  const redirectUrl = chrome.identity.getRedirectURL();

  console.log("[AetherCP Auth] Initializing Google sign-in flow.", {
    supabaseUrl,
    redirectUrl
  });

  const { data, error } = await client.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: redirectUrl,
      scopes: "openid email profile",
      skipBrowserRedirect: true
    }
  });

  if (error) {
    logAuthError("Supabase failed to create Google OAuth URL.", error, {
      redirectUrl
    });
    throw error;
  }

  if (!data?.url) {
    throw new Error("Failed to retrieve OAuth authorization URL from Supabase.");
  }

  console.log("[AetherCP Auth] Launching identity web auth flow.", {
    authUrl: redactUrl(data.url)
  });

  let callbackUrl;
  try {
    callbackUrl = await chrome.identity.launchWebAuthFlow({
      url: data.url,
      interactive: true
    });
  } catch (err) {
    logAuthError("chrome.identity.launchWebAuthFlow threw.", err, {
      authUrl: redactUrl(data.url),
      redirectUrl
    });
    throw err;
  }

  if (!callbackUrl) {
    throw new Error("Google Sign-In flow was cancelled or failed.");
  }

  console.log("[AetherCP Auth] Web auth flow returned.", {
    callbackUrl: redactUrl(callbackUrl)
  });

  const urlObj = new URL(callbackUrl);
  const searchParams = new URLSearchParams(urlObj.search);
  const code = searchParams.get("code");
  const callbackError = searchParams.get("error") || null;
  const callbackErrorDescription = searchParams.get("error_description") || null;

  if (callbackError) {
    throw new Error(`OAuth callback error: ${callbackError}. ${callbackErrorDescription || ""}`.trim());
  }

  if (code) {
    console.log("[AetherCP Auth] Authorization code found. Exchanging code for Supabase session.");
    const { data: exchangeData, error: exchangeError } = await client.auth.exchangeCodeForSession(code);

    if (exchangeError) {
      logAuthError("Supabase code exchange failed.", exchangeError, {
        callbackUrl: redactUrl(callbackUrl)
      });
      throw exchangeError;
    }

    if (!exchangeData?.session || !exchangeData?.user) {
      throw new Error("Supabase code exchange completed without a session or user.");
    }

    console.log("[AetherCP Auth] Sign-in successful via PKCE.", {
      userId: exchangeData.user.id,
      expiresAt: exchangeData.session.expires_at
    });
    return getAuthUserProfile(exchangeData.user);
  }

  // Legacy implicit flow fallback: tokens are returned in the hash fragment.
  const hash = urlObj.hash.substring(1);
  const params = new URLSearchParams(hash);

  let accessToken = params.get("access_token");
  let refreshToken = params.get("refresh_token");

  // Fallback to query params in case redirect is configured differently.
  if (!accessToken) {
    accessToken = searchParams.get("access_token");
    refreshToken = searchParams.get("refresh_token");
  }

  if (!accessToken) {
    throw new Error("No authorization code or access token found in OAuth redirect callback URL.");
  }

  if (!refreshToken) {
    throw new Error("OAuth redirect callback included an access token but no refresh token.");
  }

  console.log("[AetherCP Auth] Setting session in Supabase client...");
  const { data: sessionData, error: sessionError } = await client.auth.setSession({
    access_token: accessToken,
    refresh_token: refreshToken
  });

  if (sessionError) {
    logAuthError("Supabase setSession failed.", sessionError, {
      callbackUrl: redactUrl(callbackUrl)
    });
    throw sessionError;
  }

  if (!sessionData?.session || !sessionData?.user) {
    throw new Error("Supabase setSession completed without a session or user.");
  }

  console.log("[AetherCP Auth] Sign-in successful via implicit token callback.", {
    userId: sessionData.user.id,
    expiresAt: sessionData.session.expires_at
  });
  return getAuthUserProfile(sessionData.user);
}

/**
 * Signs the user out.
 */
async function signOut() {
  if (!isCloudBuild()) {
    return { ok: true };
  }
  console.log("[AetherCP Auth] Signing user out...");
  assertSupabaseConfigured();
  const client = getSupabaseClient();
  const { error } = await client.auth.signOut();
  if (error) {
    logAuthError("Supabase signOut failed.", error);
    throw error;
  }
  console.log("[AetherCP Auth] Sign-out completed.");
}

/**
 * Helper to detect network connectivity and reachability errors.
 * Returns true only for genuine connectivity failures.
 */
function isNetworkOrUnreachableError(error) {
  if (!error) {
    return false;
  }

  if (typeof navigator !== "undefined" && navigator.onLine === false) {
    return true;
  }

  const message = (error.message || String(error)).toLowerCase();
  const networkMessages = [
    "failed to fetch",
    "networkerror",
    "net::",
    "dns failures",
    "connection refused",
    "timeout",
    "navigator.online === false",
    "http status 0"
  ];

  if (networkMessages.some((msg) => message.includes(msg))) {
    return true;
  }

  const status = error.status || error.statusCode || error.code;
  if (status !== undefined && status !== null) {
    const numStatus = Number(status);
    if (numStatus === 0 || (numStatus >= 500 && numStatus < 600)) {
      return true;
    }
  }

  return false;
}

/**
 * Returns the current authenticated user.
 * Automatically restores the session and refreshes token if expired.
 */
async function getCurrentUser() {
  if (!isCloudBuild()) {
    return null;
  }
  assertSupabaseConfigured();
  const client = getSupabaseClient();
  let session = null;
  try {
    // getSession() will load from local storage and trigger auto-refresh if expired
    const { data: { session: currentSession }, error: sessionError } = await client.auth.getSession();
    session = currentSession;
    if (sessionError || !session) {
      if (sessionError) {
        logAuthError("Supabase getSession failed.", sessionError);
      }
      return null;
    }

    if (session.expires_at && session.expires_at * 1000 <= Date.now() + 60000) {
      console.log("[AetherCP Auth] Session is expired or near expiry. Refreshing.");
      const { data: refreshData, error: refreshError } = await client.auth.refreshSession();
      if (refreshError) {
        logAuthError("Supabase refreshSession failed.", refreshError);
        if (isNetworkOrUnreachableError(refreshError)) {
          console.log("[AetherCP Auth] Network error during session refresh. Falling back to cached session user.");
          return getAuthUserProfile(session.user);
        }
        return null;
      }

      if (refreshData?.user) {
        return getAuthUserProfile(refreshData.user);
      }
    }

    // getUser() fetches the authenticated user object from the API to guarantee validation
    const { data: { user }, error: userError } = await client.auth.getUser();
    if (userError) {
      logAuthError("Supabase getUser failed.", userError);
      if (isNetworkOrUnreachableError(userError)) {
        console.log("[AetherCP Auth] Network error during getUser. Falling back to cached session user.");
        return getAuthUserProfile(session.user);
      }
      return null;
    }
    return getAuthUserProfile(user);
  } catch (err) {
    logAuthError("Error retrieving current user.", err);
    if (session && isNetworkOrUnreachableError(err)) {
      console.log("[AetherCP Auth] Exception caught during getUser/refresh. Falling back to cached session user.", err);
      return getAuthUserProfile(session.user);
    }
    return null;
  }
}
