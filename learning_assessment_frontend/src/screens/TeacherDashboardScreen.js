import React from "react";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "../components/AppLayout";
import { Card } from "../components/Card";
import { FocusButton } from "../components/FocusButton";

// PUBLIC_INTERFACE
export function TeacherDashboardScreen() {
  /** Teacher landing dashboard for managing content and starting sessions. */
  const navigate = useNavigate();

  return (
    <AppLayout
      title="Teacher Dashboard"
      subtitle="Create questions, set up quizzes/exams, and control the session on the TV."
    >
      <div className="grid grid-2">
        <Card title="Question Bank" description="List, create, and edit questions.">
          <div style={{ marginTop: 14 }}>
            <FocusButton tvnavGroup="main" tvnavCols={2} variant="primary" onClick={() => navigate("/teacher/questions")} full>
              Open Question Bank
            </FocusButton>
          </div>
        </Card>

        <Card title="Quiz / Exam Setup" description="Pick questions and start a session.">
          <div className="grid" style={{ marginTop: 14 }}>
            <FocusButton tvnavGroup="main" tvnavCols={2} variant="secondary" onClick={() => navigate("/teacher/setup")} full>
              Setup Quiz/Exam
            </FocusButton>
            <FocusButton tvnavGroup="main" tvnavCols={2} variant="ghost" onClick={() => navigate("/play/quiz")} full>
              Preview Play Screen
            </FocusButton>
          </div>
        </Card>

        <Card title="Memory Game" description="A simple grid-based matching game.">
          <div style={{ marginTop: 14 }}>
            <FocusButton tvnavGroup="main" tvnavCols={2} variant="primary" onClick={() => navigate("/play/memory")} full>
              Start Memory Game
            </FocusButton>
          </div>
        </Card>

        <Card title="Accessibility" description="Font size & contrast for TV viewing.">
          <div style={{ marginTop: 14 }}>
            <FocusButton tvnavGroup="main" tvnavCols={2} variant="ghost" onClick={() => navigate("/accessibility")} full>
              Open Accessibility Settings
            </FocusButton>
          </div>
        </Card>
      </div>
    </AppLayout>
  );
}
