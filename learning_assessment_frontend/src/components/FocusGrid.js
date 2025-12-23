import React, { useEffect } from "react";
import { useTVNav } from "../tvnav/TVNavProvider";

// PUBLIC_INTERFACE
export function FocusGrid({ children, groupId = "main", cols = 3, autoFocus = true }) {
  /** Wraps a grid of focusable items. Each item should set data-tvnav-cols={cols}. */
  const { requestInitialFocus } = useTVNav();

  useEffect(() => {
    if (autoFocus) requestInitialFocus(groupId);
  }, [autoFocus, groupId, requestInitialFocus]);

  // The container itself doesn't need any specific attributes; the items carry group + cols.
  return <div data-tvnav-grid-container={groupId} data-tvnav-grid-cols={String(cols)}>{children}</div>;
}
