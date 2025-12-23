import React, { useEffect, useRef } from "react";
import { FocusButton } from "./FocusButton";

// PUBLIC_INTERFACE
export function Modal({ open, title, children, onClose, tvnavGroup = "modal" }) {
  /** Simple modal overlay; Escape/Back handled globally by TVNavProvider. */
  const overlayRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    // Try to focus the close button first.
    const closeBtn = overlayRef.current?.querySelector(`[data-tvnav-group="${tvnavGroup}"]`);
    closeBtn?.focus?.();
  }, [open, tvnavGroup]);

  if (!open) return null;

  return (
    <div
      className="modal-overlay"
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-label={title || "Dialog"}
      onMouseDown={(e) => {
        // Click outside closes.
        if (e.target === e.currentTarget) onClose?.();
      }}
    >
      <div className="modal">
        <div className="modal-header">
          <h3 className="modal-title">{title}</h3>
          <FocusButton tvnavGroup={tvnavGroup} variant="ghost" onClick={onClose} ariaLabel="Close dialog">
            Close
          </FocusButton>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
}
