import React from "react";

// PUBLIC_INTERFACE
export function Card({ title, description, children }) {
  /** TV-friendly card surface with consistent padding and typography. */
  return (
    <div className="card">
      <div className="card-inner">
        {title ? <h2 className="card-title">{title}</h2> : null}
        {description ? <p className="card-desc">{description}</p> : null}
        {children}
      </div>
    </div>
  );
}
