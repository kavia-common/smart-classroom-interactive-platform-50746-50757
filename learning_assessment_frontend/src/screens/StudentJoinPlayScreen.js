import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "../components/AppLayout";
import { Card } from "../components/Card";
import { FocusButton } from "../components/FocusButton";
import { useAuth } from "../contexts/AuthContext";

// PUBLIC_INTERFACE
export function StudentJoinPlayScreen() {
  /** Student screen to join a teacher session (placeholder). */
  const navigate = useNavigate();
  const { isStudent } = useAuth();
  const [code, setCode] = useState("");

  const subtitle = useMemo(
    () => "Enter the session code from the teacher's TV, then start playing.",
    []
  );

  return (
    <AppLayout title="Student Join" subtitle={subtitle}>
      <div className="grid grid-2">
        <Card title="Join code" description="Backend wiring will validate and connect students to sessions.">
          <div className="field" style={{ marginTop: 14 }}>
            <div className="label">Code</div>
            <input
              className="input"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="ABCD"
              aria-label="Session code"
              data-tvnav="true"
              data-tvnav-group="main"
              data-tvnav-cols="2"
            />
            <p className="helper">This is placeholder state; no real session is joined yet.</p>
          </div>

          <div className="grid grid-2">
            <FocusButton tvnavGroup="main" tvnavCols={2} variant="primary" onClick={() => navigate("/play/quiz")} full>
              Start Playing
            </FocusButton>
            <FocusButton tvnavGroup="main" tvnavCols={2} variant="ghost" onClick={() => navigate("/play/memory")} full>
              Memory Game
            </FocusButton>
          </div>

          {!isStudent ? (
            <p className="helper" style={{ marginTop: 12 }}>
              Note: You are not in Student role. Login as Student to see student-only experiences later.
            </p>
          ) : null}
        </Card>

        <Card title="TV controls" description="Works with remote, keyboard, or gamepad arrow keys.">
          <div className="grid" style={{ marginTop: 14 }}>
            <div className="tv-pill"><strong>Arrows</strong> move focus</div>
            <div className="tv-pill"><strong>Enter</strong> selects</div>
            <div className="tv-pill"><strong>Backspace / Escape</strong> goes back</div>
          </div>
        </Card>
      </div>
    </AppLayout>
  );
}
