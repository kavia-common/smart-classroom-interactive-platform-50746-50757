import React from "react";

/**
 * FocusButton: A TV-friendly button that participates in D-pad navigation.
 */

// PUBLIC_INTERFACE
export function FocusButton({
  children,
  onClick,
  variant = "primary", // primary|secondary|ghost|danger
  full = false,
  tvnavGroup = "main",
  tvnavCols = 1,
  disabled = false,
  ariaLabel,
  type = "button",
}) {
  /** TV-first button with strong focus styling and optional layout props. */
  const className = [
    "btn",
    variant === "primary" ? "btn-primary" : "",
    variant === "secondary" ? "btn-secondary" : "",
    variant === "ghost" ? "btn-ghost" : "",
    variant === "danger" ? "btn-danger" : "",
    full ? "btn-full" : "",
    "focusable",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type={type}
      className={className}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      data-tvnav="true"
      data-tvnav-group={tvnavGroup}
      data-tvnav-cols={String(tvnavCols)}
    >
      {children}
    </button>
  );
}
