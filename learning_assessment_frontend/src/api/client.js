/**
 * Simple API client wrapper with optional stub mode.
 * The backend is expected to run at REACT_APP_API_BASE_URL (default: http://localhost:3001).
 */

const DEFAULT_BASE_URL = "http://localhost:3001";

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// PUBLIC_INTERFACE
export function getApiBaseUrl() {
  /** Returns API base URL from environment with a safe default. */
  return process.env.REACT_APP_API_BASE_URL || DEFAULT_BASE_URL;
}

// PUBLIC_INTERFACE
export async function apiRequest(path, options = {}) {
  /**
   * Perform a fetch request to the backend API.
   * In this project phase, most calls are routed via feature APIs that may return stubs.
   */
  const baseUrl = getApiBaseUrl();
  const url = `${baseUrl}${path.startsWith("/") ? "" : "/"}${path}`;

  const resp = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!resp.ok) {
    const text = await resp.text().catch(() => "");
    const err = new Error(`API request failed: ${resp.status} ${resp.statusText} ${text}`.trim());
    err.status = resp.status;
    throw err;
  }

  // Try JSON first, fall back to text
  const contentType = resp.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    return resp.json();
  }
  return resp.text();
}

// PUBLIC_INTERFACE
export async function stubbed(value, { minDelayMs = 200, maxDelayMs = 450 } = {}) {
  /** Utility for stubbed responses with small randomized delay to emulate network latency. */
  const delay = Math.floor(minDelayMs + Math.random() * (maxDelayMs - minDelayMs));
  await sleep(delay);
  return value;
}

// PUBLIC_INTERFACE
export function shouldUseStubs() {
  /**
   * Stubs are used by default to avoid relying on backend endpoints early.
   * Set REACT_APP_USE_REAL_API=true to force real requests once backend is ready.
   */
  return (process.env.REACT_APP_USE_REAL_API || "").toLowerCase() !== "true";
}
