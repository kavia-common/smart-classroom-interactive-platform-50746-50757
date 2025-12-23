import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "../components/AppLayout";
import { Card } from "../components/Card";
import { FocusButton } from "../components/FocusButton";
import { useAuth } from "../contexts/AuthContext";

// PUBLIC_INTERFACE
export function LoginScreen() {
  /** Login screen for Teacher/Student role selection. */
  const { login } = useAuth();
  const navigate = useNavigate();
  const [role, setRole] = useState("teacher");
  const [pinOrCode, setPinOrCode] = useState("");

  const subtitle = useMemo(
    () => "Use the remote arrows to focus, Enter to select. Back/Escape to go back.",
    []
  );

  const onSubmit = async () => {
    const res = await login({ role, pinOrCode });
    if (res.user?.role === "teacher") navigate("/teacher");
    else navigate("/student/join");
  };

  return (
    <AppLayout title="Login" subtitle={subtitle}>
      <div className="grid grid-2">
        <Card
          title="Choose role"
          description="Teacher manages questions & sessions. Students join to play."
        >
          <div className="grid" style={{ marginTop: 14 }}>
            <FocusButton
              tvnavGroup="main"
              tvnavCols={1}
              variant={role === "teacher" ? "primary" : "ghost"}
              onClick={() => setRole("teacher")}
              full
            >
              Teacher
            </FocusButton>
            <FocusButton
              tvnavGroup="main"
              tvnavCols={1}
              variant={role === "student" ? "secondary" : "ghost"}
              onClick={() => setRole("student")}
              full
            >
              Student
            </FocusButton>
          </div>
        </Card>

        <Card
          title={role === "teacher" ? "Teacher PIN" : "Join Code"}
          description="This is a placeholder; backend integration will validate it later."
        >
          <div className="field" style={{ marginTop: 14 }}>
            <div className="label">{role === "teacher" ? "PIN" : "Code"}</div>
            <input
              className="input"
              value={pinOrCode}
              onChange={(e) => setPinOrCode(e.target.value)}
              placeholder={role === "teacher" ? "1234" : "ABCD"}
              aria-label={role === "teacher" ? "Teacher PIN" : "Join code"}
              data-tvnav="true"
              data-tvnav-group="main"
              data-tvnav-cols="1"
            />
            <p className="helper">Tip: On a TV, you may use an on-screen keyboard.</p>
          </div>

          <FocusButton tvnavGroup="main" tvnavCols={1} variant="primary" onClick={onSubmit} full>
            Continue
          </FocusButton>
        </Card>
      </div>
    </AppLayout>
  );
}
