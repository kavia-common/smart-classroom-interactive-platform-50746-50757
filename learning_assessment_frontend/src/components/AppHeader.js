import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { FocusButton } from "./FocusButton";

// PUBLIC_INTERFACE
export function AppHeader() {
  /** Top header showing app brand, current route hint, user role, and logout. */
  const { user, isTeacher, isStudent, logout } = useAuth();
  const loc = useLocation();
  const navigate = useNavigate();

  const roleLabel = isTeacher ? "Teacher" : isStudent ? "Student" : "Guest";

  return (
    <div className="tv-header">
      <div className="tv-brand">
        <h1>Neon Fun Classroom</h1>
        <span className="tv-pill">
          <span className="badge">{roleLabel}</span>
          <span className="tv-kicker">{loc.pathname}</span>
        </span>
      </div>

      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <FocusButton tvnavGroup="header" variant="ghost" onClick={() => navigate("/accessibility")} tvnavCols={4}>
          Accessibility
        </FocusButton>
        {user ? (
          <FocusButton tvnavGroup="header" variant="danger" onClick={logout} tvnavCols={4}>
            Logout
          </FocusButton>
        ) : (
          <FocusButton tvnavGroup="header" variant="ghost" onClick={() => navigate("/login")} tvnavCols={4}>
            Login
          </FocusButton>
        )}
      </div>
    </div>
  );
}
