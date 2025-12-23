import React, { useEffect } from "react";
import { useTVNav } from "../tvnav/TVNavProvider";

// PUBLIC_INTERFACE
export function FocusList({ children, groupId = "main", autoFocus = true }) {
  /** Wraps a vertical list of focusable items. */
  const { requestInitialFocus } = useTVNav();

  useEffect(() => {
    if (autoFocus) requestInitialFocus(groupId);
  }, [autoFocus, groupId, requestInitialFocus]);

  return <div data-tvnav-group-container={groupId}>{children}</div>;
}
