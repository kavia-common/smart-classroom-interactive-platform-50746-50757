import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

/**
 * TVNavProvider:
 * - Centralizes arrow-key navigation between elements that opt in via `data-tvnav` attributes.
 * - Enter activates (click).
 * - Backspace/Escape navigates back (history).
 *
 * Usage:
 * - Wrap <TVNavProvider> around your app.
 * - Use FocusButton / FocusList / FocusGrid components which automatically set tvnav attributes.
 */

const TVNavContext = createContext(null);

function isEditableTarget(el) {
  if (!el) return false;
  const tag = (el.tagName || "").toLowerCase();
  return tag === "input" || tag === "textarea" || el.isContentEditable;
}

function getGroupElements(groupId) {
  const selector = `[data-tvnav="true"][data-tvnav-group="${CSS.escape(groupId)}"]`;
  return Array.from(document.querySelectorAll(selector)).filter(
    (el) => !el.hasAttribute("disabled") && el.getAttribute("aria-disabled") !== "true"
  );
}

function indexOfEl(list, el) {
  return list.findIndex((x) => x === el);
}

function focusEl(el) {
  if (!el) return;
  el.focus({ preventScroll: true });
  el.scrollIntoView({ block: "nearest", inline: "nearest" });
}

// PUBLIC_INTERFACE
export function useTVNav() {
  /** Access TV navigation helpers (group registration, programmatic focus). */
  const ctx = useContext(TVNavContext);
  if (!ctx) throw new Error("useTVNav must be used within <TVNavProvider />");
  return ctx;
}

// PUBLIC_INTERFACE
export function TVNavProvider({ children }) {
  /** Provider enabling D-pad navigation for Smart TV/keyboard usage. */
  const navigate = useNavigate();
  const [activeGroup, setActiveGroup] = useState("main");
  const lastFocusByGroup = useRef(new Map());

  useEffect(() => {
    const onFocusIn = (e) => {
      const el = e.target;
      if (!(el instanceof HTMLElement)) return;
      const group = el.getAttribute("data-tvnav-group");
      if (group) {
        lastFocusByGroup.current.set(group, el);
        setActiveGroup(group);
      }
    };

    const onKeyDown = (e) => {
      // Let inputs behave normally.
      if (isEditableTarget(e.target)) return;

      const key = e.key;

      // Back / Escape behavior for TVs.
      if (key === "Escape" || key === "Backspace") {
        e.preventDefault();
        navigate(-1);
        return;
      }

      // Activate focused element
      if (key === "Enter") {
        const el = document.activeElement;
        if (el && el instanceof HTMLElement) {
          // For buttons/links we trigger click.
          e.preventDefault();
          el.click?.();
        }
        return;
      }

      // D-pad navigation
      const isArrow = key === "ArrowUp" || key === "ArrowDown" || key === "ArrowLeft" || key === "ArrowRight";
      if (!isArrow) return;

      const group = activeGroup || "main";
      const elements = getGroupElements(group);

      if (!elements.length) return;

      const current = document.activeElement;
      let idx = current && current instanceof HTMLElement ? indexOfEl(elements, current) : -1;
      if (idx < 0) idx = 0;

      const cols = Number(elements[idx]?.getAttribute("data-tvnav-cols") || "1");
      let nextIdx = idx;

      if (key === "ArrowRight") nextIdx = Math.min(idx + 1, elements.length - 1);
      if (key === "ArrowLeft") nextIdx = Math.max(idx - 1, 0);
      if (key === "ArrowDown") nextIdx = Math.min(idx + cols, elements.length - 1);
      if (key === "ArrowUp") nextIdx = Math.max(idx - cols, 0);

      if (nextIdx !== idx) {
        e.preventDefault();
        focusEl(elements[nextIdx]);
      }
    };

    window.addEventListener("focusin", onFocusIn);
    window.addEventListener("keydown", onKeyDown, { passive: false });

    return () => {
      window.removeEventListener("focusin", onFocusIn);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [activeGroup, navigate]);

  // PUBLIC_INTERFACE
  const requestInitialFocus = (groupId) => {
    /** Focus the first element in a group or the last-focused element, if present. */
    const last = lastFocusByGroup.current.get(groupId);
    if (last && document.contains(last)) {
      focusEl(last);
      return;
    }
    const els = getGroupElements(groupId);
    focusEl(els[0]);
  };

  const value = useMemo(
    () => ({
      activeGroup,
      setActiveGroup,
      requestInitialFocus,
    }),
    [activeGroup]
  );

  return <TVNavContext.Provider value={value}>{children}</TVNavContext.Provider>;
}
