import React from "react";
import { AppHeader } from "./AppHeader";

// PUBLIC_INTERFACE
export function AppLayout({ title, subtitle, children }) {
  /** Page layout: header + TV container + optional title block. */
  return (
    <div className="tv-app">
      <AppHeader />
      <div className="tv-container">
        {title ? (
          <div style={{ marginBottom: 16 }}>
            <h2 className="tv-title">{title}</h2>
            {subtitle ? <p className="tv-subtitle">{subtitle}</p> : null}
          </div>
        ) : null}

        <div className="tv-content">{children}</div>
      </div>
    </div>
  );
}
