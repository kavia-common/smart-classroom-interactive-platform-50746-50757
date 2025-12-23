import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const AccessibilityContext = createContext(null);

const STORAGE_KEY = "tv_accessibility_v1";

// PUBLIC_INTERFACE
export function useAccessibility() {
  /** Hook to access and update accessibility settings (font size, contrast). */
  const ctx = useContext(AccessibilityContext);
  if (!ctx) throw new Error("useAccessibility must be used within <AccessibilityProvider />");
  return ctx;
}

// PUBLIC_INTERFACE
export function AccessibilityProvider({ children }) {
  /** Provider for accessibility settings that apply CSS variables and data attributes. */
  const [fontScale, setFontScale] = useState(1.0); // 1.0 = default TV
  const [contrast, setContrast] = useState("normal"); // normal | high

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (typeof parsed.fontScale === "number") setFontScale(parsed.fontScale);
      if (parsed.contrast === "high" || parsed.contrast === "normal") setContrast(parsed.contrast);
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ fontScale, contrast }));
    } catch {
      // ignore
    }
    document.documentElement.style.setProperty("--tv-font-scale", String(fontScale));
    document.documentElement.setAttribute("data-contrast", contrast);
  }, [fontScale, contrast]);

  const value = useMemo(
    () => ({
      fontScale,
      setFontScale,
      contrast,
      setContrast,
    }),
    [fontScale, contrast]
  );

  return <AccessibilityContext.Provider value={value}>{children}</AccessibilityContext.Provider>;
}
