import React from "react";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "../components/AppLayout";
import { Card } from "../components/Card";
import { FocusButton } from "../components/FocusButton";
import { useAuth } from "../contexts/AuthContext";

// PUBLIC_INTERFACE
export function HomeScreen() {
  /** Landing screen to route users to teacher/student flows. */
  const navigate = useNavigate();
  const { user, isTeacher } = useAuth();

  return (
    <AppLayout
      title="Smart TV Learning"
      subtitle="Large, high-contrast UI designed for remote control navigation."
    >
      <div className="grid grid-2">
        <Card
          title={user ? `Welcome, ${user.name}` : "Welcome"}
          description="Pick an action. Login is stubbed until backend is ready."
        >
          <div className="grid" style={{ marginTop: 14 }}>
            <FocusButton tvnavGroup="main" tvnavCols={2} variant="primary" onClick={() => navigate("/login")} full>
              Login
            </FocusButton>
            <FocusButton
              tvnavGroup="main"
              tvnavCols={2}
              variant="secondary"
              onClick={() => navigate(isTeacher ? "/teacher" : "/student/join")}
              full
            >
              Continue
            </FocusButton>
          </div>
        </Card>

        <Card title="Quick demo" description="Preview screens without setup.">
          <div className="grid" style={{ marginTop: 14 }}>
            <FocusButton tvnavGroup="main" tvnavCols={2} variant="ghost" onClick={() => navigate("/teacher")} full>
              Teacher Dashboard
            </FocusButton>
            <FocusButton tvnavGroup="main" tvnavCols={2} variant="ghost" onClick={() => navigate("/play/quiz")} full>
              Quiz Play
            </FocusButton>
            <FocusButton tvnavGroup="main" tvnavCols={2} variant="ghost" onClick={() => navigate("/play/memory")} full>
              Memory Game
            </FocusButton>
          </div>
        </Card>
      </div>
    </AppLayout>
  );
}
