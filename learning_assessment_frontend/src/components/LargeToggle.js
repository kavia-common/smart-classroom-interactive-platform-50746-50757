import React from "react";
import { FocusButton } from "./FocusButton";

// PUBLIC_INTERFACE
export function LargeToggle({
  label,
  value,
  onToggle,
  tvnavGroup = "main",
  tvnavCols = 1,
  onLabel = "On",
  offLabel = "Off",
}) {
  /** Big TV-friendly toggle built from a focusable button. */
  const text = value ? onLabel : offLabel;
  const variant = value ? "primary" : "ghost";

  return (
    <div className="field">
      <div className="label">{label}</div>
      <FocusButton tvnavGroup={tvnavGroup} tvnavCols={tvnavCols} variant={variant} onClick={onToggle} full>
        {text}
      </FocusButton>
    </div>
  );
}
