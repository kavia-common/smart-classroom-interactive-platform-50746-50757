import React, { useMemo } from "react";
import { AppLayout } from "../components/AppLayout";
import { Card } from "../components/Card";
import { FocusButton } from "../components/FocusButton";
import { LargeToggle } from "../components/LargeToggle";
import { useAccessibility } from "../contexts/AccessibilityContext";

// PUBLIC_INTERFACE
export function AccessibilitySettingsScreen() {
  /** Accessibility settings for TV viewing: font size and contrast. */
  const { fontScale, setFontScale, contrast, setContrast } = useAccessibility();

  const subtitle = useMemo(
    () => "Improve readability from a distance. Settings are saved on this device.",
    []
  );

  const bump = (delta) => setFontScale((s) => Math.max(0.9, Math.min(1.6, Number((s + delta).toFixed(2)))));

  return (
    <AppLayout title="Accessibility Settings" subtitle={subtitle}>
      <div className="grid grid-2">
        <Card title="Font size" description="Increase for easier reading on large screens.">
          <div className="tv-pill" style={{ marginTop: 14, justifyContent: "space-between" }}>
            <span className="badge">Scale: {fontScale.toFixed(2)}x</span>
            <span className="tv-kicker">Range: 0.90–1.60</span>
          </div>

          <div className="grid grid-2" style={{ marginTop: 14 }}>
            <FocusButton tvnavGroup="main" tvnavCols={2} variant="ghost" onClick={() => bump(-0.1)} full>
              A−
            </FocusButton>
            <FocusButton tvnavGroup="main" tvnavCols={2} variant="primary" onClick={() => bump(+0.1)} full>
              A+
            </FocusButton>
          </div>

          <div className="hr" />
          <FocusButton tvnavGroup="main" tvnavCols={2} variant="secondary" onClick={() => setFontScale(1.0)} full>
            Reset font size
          </FocusButton>
        </Card>

        <Card title="Contrast" description="High contrast helps in bright rooms.">
          <LargeToggle
            tvnavGroup="main"
            tvnavCols={2}
            label="High contrast mode"
            value={contrast === "high"}
            onToggle={() => setContrast((c) => (c === "high" ? "normal" : "high"))}
            onLabel="High"
            offLabel="Normal"
          />
          <p className="helper">
            Focus rings are always visible. Use arrows + Enter to operate.
          </p>
        </Card>
      </div>
    </AppLayout>
  );
}
