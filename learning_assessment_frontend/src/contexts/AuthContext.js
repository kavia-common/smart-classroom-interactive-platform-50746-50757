import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import * as authApi from "../api/auth";

const AuthContext = createContext(null);

// PUBLIC_INTERFACE
export function useAuth() {
  /** Hook to access auth state and actions. */
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider />");
  return ctx;
}

// PUBLIC_INTERFACE
export function AuthProvider({ children }) {
  /** Provides user session, role gating, and placeholder auth actions. */
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const me = await authApi.getMe();
        if (!mounted) return;
        setUser(me.user || null);
      } catch {
        // ignore
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // PUBLIC_INTERFACE
  const login = async ({ role, pinOrCode }) => {
    const res = await authApi.login({ role, pinOrCode });
    setUser(res.user);
    setToken(res.token);
    return res;
  };

  // PUBLIC_INTERFACE
  const logout = async () => {
    await authApi.logout();
    setUser(null);
    setToken(null);
  };

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      isTeacher: user?.role === "teacher",
      isStudent: user?.role === "student",
      login,
      logout,
      setUser, // placeholder escape hatch for wiring later
    }),
    [user, token, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
