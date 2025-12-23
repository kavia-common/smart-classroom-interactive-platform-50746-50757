import { apiRequest, shouldUseStubs, stubbed } from "./client";

/**
 * Auth endpoints are placeholders. When backend is ready, update paths and payloads.
 */

const STUB_USERS = {
  teacher: { id: "t1", name: "Teacher", role: "teacher" },
  student: { id: "s1", name: "Student", role: "student" },
};

// PUBLIC_INTERFACE
export async function login({ role, pinOrCode }) {
  /** Login placeholder that returns a stub user unless real API is enabled. */
  if (shouldUseStubs()) {
    const selected = role === "teacher" ? STUB_USERS.teacher : STUB_USERS.student;
    return stubbed({
      user: selected,
      token: "stub-token",
      meta: { pinOrCode },
    });
  }

  // Placeholder backend call; adjust when backend auth endpoints are implemented.
  return apiRequest("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ role, pinOrCode }),
  });
}

// PUBLIC_INTERFACE
export async function logout() {
  /** Logout placeholder. */
  if (shouldUseStubs()) {
    return stubbed({ ok: true });
  }
  return apiRequest("/api/auth/logout", { method: "POST" });
}

// PUBLIC_INTERFACE
export async function getMe() {
  /** Fetch current user placeholder. */
  if (shouldUseStubs()) {
    return stubbed({ user: null });
  }
  return apiRequest("/api/auth/me", { method: "GET" });
}
