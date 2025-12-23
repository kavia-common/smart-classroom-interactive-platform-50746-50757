import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Card } from "./Card";
import { FocusButton } from "./FocusButton";

// PUBLIC_INTERFACE
export function RoleGate({ allow = "any", children }) {
  /**
   * Role-aware gating.
   * allow: "any" | "teacher" | "student"
   */
  const { loading, user, isTeacher, isStudent } = useAuth();

  if (loading) {
    return (
      <Card title="Loading..." description="Preparing your session for Smart TV control." />
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const ok =
    allow === "any" ||
    (allow === "teacher" && isTeacher) ||
    (allow === "student" && isStudent);

  if (ok) return children;

  return (
    <Card
      title="Access restricted"
      description="This screen is not available for your current role."
    >
      <div style={{ marginTop: 14 }}>
        <FocusButton variant="ghost" onClick={() => (window.location.href = "/")}>
          Go Home
        </FocusButton>
      </div>
    </Card>
  );
}
